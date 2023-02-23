import { Page } from "slask-cms";
import { PageObjectEditor } from "./editors/PageEditor";
import { useCms } from "./useCms";
import { useEditorDialog } from "./editors/EditorDialog";

export function CreatePageButton({ path = "/" }) {
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
      <button className="btn" onClick={() => setOpen(true)}>
        Create page
      </button>
    </>
  );
}
const defaultPageSettings = {
  modules: [],
  url: "",
};
