import { Link, useLoaderData } from "react-router-dom";
import { Page } from "slask-cms";
import Resolver from "../modules/Resolver";
import Editor from "./Editor";
import InlineEditor from "./InlineEditor";

export default function PagePreview() {
  const page = useLoaderData() as Page;
  return (
    <div>
      <pre>{JSON.stringify(page, null, 2)}</pre>
      {page.modules?.length ? (
        <Editor>
          {page.modules.map((module) => (
            <Resolver key={module.id} {...module} />
          ))}
          <InlineEditor />
        </Editor>
      ) : (
        <p>No modules</p>
      )}
      <Link className="btn" to={`/page-edit/${page.url}`}>
        Edit
      </Link>
    </div>
  );
}
