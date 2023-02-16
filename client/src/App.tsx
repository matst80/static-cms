import { useEffect, useState } from "react";
import "./App.css";
import Page from "./editors/Page";
import { useCms } from "./useCms";

function App() {
  const [url, setUrl] = useState<string>("");
  const [urls, setUrls] = useState<string[]>([]);
  const { getUrls } = useCms();
  useEffect(() => {
    getUrls().then(setUrls);
  }, [getUrls]);
  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        {urls.map((u) => (
          <button key={u} onClick={() => setUrl(u)}>
            {u}
          </button>
        ))}
        <Page url={url} />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
