import { Element, Editor, Frame } from "@craftjs/core";
import { Link, useLoaderData } from "react-router-dom";
import { Page } from "slask-cms";
import { Button } from "./Button";
import { Card } from "./Card";
import { Text } from "./Text";
import { Container } from "./Container";

import Resolver from "../modules/Resolver";

export default function PagePreview() {
  const page = useLoaderData() as Page;
  return (
    <div>
      <pre>{JSON.stringify(page, null, 2)}</pre>
      <Editor resolver={{ Card, Button, Text, Container, Resolver }}>
        <Frame>
          <Element is={Container} padding={10} canvas>
            {page.modules?.map((d) => (
              <Resolver key={d.id} {...d} />
            ))}
          </Element>
        </Frame>
      </Editor>
      <Link
        className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        to={`/page/${page.url}/edit`}
      >
        Edit
      </Link>
    </div>
  );
}
