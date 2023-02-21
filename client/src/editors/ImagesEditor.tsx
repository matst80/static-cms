import { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import { AssetFile, Image } from "slask-cms";
import { useAssets } from "../useCms";
import { stop } from "../utils";
import { Dialog } from "./Dialog";
import { FieldEditorProps } from "./editor-types";

const ImageBrowser = () => {
  return <div>bilder</div>;
};

function FileUploadMultiple() {
  const [fileList, setFileList] = useState<FileList | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
  };

  const handleUploadClick = () => {
    if (!fileList) {
      return;
    }

    // 👇 Create new FormData object and append files
    const data = new FormData();
    files.forEach((file, i) => {
      data.append(`file-${i}`, file, file.name);
    });

    // 👇 Uploading the files using the fetch API to the server
    fetch("/assets/images/", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  // 👇 files is not an array, but it's iterable, spread to get an array of files
  const files = fileList ? [...fileList] : [];

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple />

      <ul>
        {files.map((file, i) => (
          <li key={i}>
            {file.name} - {file.type}
          </li>
        ))}
      </ul>

      <button onClick={handleUploadClick}>Upload</button>
    </div>
  );
}

function FileList({ path, onSelect }: FileListProps) {
  const { data } = useAssets(path);
  return (
    <div className="grid grid-cols-5">
      {data?.map((file) => {
        const { name, size } = file;
        return (
          <div className="flex-col" onClick={() => onSelect(file)}>
            {name}
            <span>{size}</span>
          </div>
        );
      })}
    </div>
  );
}

type FileListProps = {
  path: string;
  onSelect: (file: AssetFile) => void;
};

export default function ImagesEditor({
  data,
  onChange,
}: FieldEditorProps<Image[]>) {
  const [showBrowser, setShowBrowser] = useState<boolean>(false);
  return (
    <div className="flex">
      {data?.map(({ src, title }) => {
        return (
          <div>
            <img src={src} title={title} />
            <span>{title}</span>
          </div>
        );
      })}
      <Dialog open={showBrowser} onClose={() => setShowBrowser(false)}>
        <FileList
          path="images"
          onSelect={(file) =>
            onChange([
              ...(data ?? []),
              {
                src: `/assets/image/${file.name}`,
                title: file.name,
              },
            ])
          }
        />
        <div>
          Upload:
          <FileUploadMultiple />
        </div>
      </Dialog>

      <button onClick={stop(() => setShowBrowser(true))}>Open browser</button>
    </div>
  );
}
