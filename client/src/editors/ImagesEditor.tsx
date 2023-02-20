import { ChangeEvent, useState } from "react";
import { Image } from "slask-cms";
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
    fetch("https://cms.tornberg.me/assets/", {
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

export default function ImagesEditor({
  data,
  onChange,
}: FieldEditorProps<Image[]>) {
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
      <div>
        Upload:
        <FileUploadMultiple />
      </div>
    </div>
  );
}
