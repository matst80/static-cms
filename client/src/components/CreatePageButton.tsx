import { Page } from "slask-cms";
import { useCms } from "../useCms";
import { useEditorDialog } from "../schema-editor/dialog/EditorDialog";
import { stop } from "../utils";
import { PageObjectEditor } from "../schema-editor/PageEditor";

export function CreatePageButton({ path = "/", title = "Create page" }) {
  const { savePage } = useCms();
  const { dialog, setOpen } = useEditorDialog(
    { ...defaultPageSettings, url: path },
    {
      "Create page": (page: Page) => {
        savePage(page.url, page);
        return true;
      },
    },
    PageObjectEditor
  );
  return (
    <>
      {dialog}
      <button className="btn" onClick={stop(() => setOpen(true))}>
        {title}
      </button>
    </>
  );
}
const defaultPageSettings = {
  modules: [],
  url: "",
};
