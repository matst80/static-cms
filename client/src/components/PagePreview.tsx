import { Element, Editor, Frame } from "@craftjs/core";
import { Link, useLoaderData } from "react-router-dom";
import { Page } from "slask-cms";
import { Button } from "./Button";
import { Card } from "./Card";
import { Text } from "./Text";
import { Container } from "./Container";

import Resolver from "./Resolver";

export default function PagePreview() {
  const page = useLoaderData() as Page;
  return (
    <div>
      <pre>{JSON.stringify(page, null, 2)}</pre>
      <Editor resolver={{ Card, Button, Text, Container, Resolver }}>
        <Frame>
          <Element is={Container} padding={5} background="transparent" canvas>
            {page.modules?.map((d) => (
              <Resolver key={d.id} {...d} />
            ))}
          </Element>
        </Frame>
      </Editor>
      <Link to={`/page/${page.url}/edit`}>Edit</Link>
    </div>
  );
}
