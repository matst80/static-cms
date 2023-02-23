import { ChangeEvent, useState } from "react";
import { AssetFile, Image } from "slask-cms";
import { useAssets, useFileUpload } from "../useCms";
import { stop } from "../utils";
import { Dialog } from "../components/Dialog";
import { FieldEditorProps } from "./editor-types";

const ImageBrowser = () => {
  return <div>bilder</div>;
};

function FileUploadMultiple() {
  const { startUpload, setFiles, files } = useFileUpload();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUploadClick = () => {
    startUpload("image");
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple />

      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name} - {file.type}
          </li>
        ))}
      </ul>

      <button className="btn" onClick={handleUploadClick}>
        Upload
      </button>
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
          <div key={name} className="flex-col" onClick={() => onSelect(file)}>
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
    <>
      <Dialog open={showBrowser} onClose={() => setShowBrowser(false)}>
        <FileList
          path="images"
          onSelect={(file) => {
            const src = `/assets/image/${file.name}`;
            onChange([
              ...(data?.filter((s) => s.src !== src) ?? []),
              {
                src,
                title: file.name,
              },
            ]);
          }}
        />
        <div>
          Upload:
          <FileUploadMultiple />
        </div>
      </Dialog>
      <div className="flex">
        {data?.map(({ src, title }) => {
          return (
            <div>
              <img src={src} title={title} />
              <span>{title}</span>
            </div>
          );
        })}

        <button className="btn" onClick={stop(() => setShowBrowser(true))}>
          Open browser
        </button>
      </div>
    </>
  );
}
