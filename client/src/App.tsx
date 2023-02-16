import { useEffect, useState } from "react";
import "./App.css";
import Page from "./editors/Page";
import { useCms, useUrls } from "./useCms";

function App() {
  const [url, setUrl] = useState<string>("");
  const { data: urls, isLoading } = useUrls();
  const { savePage } = useCms();
  const [urlToCreate, setUrlToCreate] = useState("");
  const createNewPage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (urlToCreate && urlToCreate.length) {
      savePage(urlToCreate, { modules: [] }).then(() => setUrlToCreate(""));
    }
  };
  return (
    <div className="App">
      <form onSubmit={createNewPage}>
        {urls?.map(({ url, title }) => (
          <button key={url} onClick={() => setUrl(url)}>
            {title ?? url}
          </button>
        ))}
        <input
          value={urlToCreate}
          onChange={(e) => setUrlToCreate(e.target.value)}
          placeholder="Create"
        />
      </form>
      <Page url={url} />
      <div>
        <a href="/auth/">Login</a>
      </div>
    </div>
  );
}

export default App;
