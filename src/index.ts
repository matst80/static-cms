import { storePages } from "./page";
import http from "http";
import { getSectionAndPath, getStoragePathFromUrl } from "./file-utils";
import { jsonRequest } from "./server-utils";
import { StorageSections } from "./types/storage";

const port = process.env.PORT ?? 3010;

const validate = (type: StorageSections) => (data: any) => {
  if (type === "page") {
    if (!data.modules) {
      throw new Error("no modules, page will be empty");
    }
  }
  return data;
};

const server = http.createServer(
  jsonRequest(async (req, res) => {
    const { url, method, headers, body } = req;
    if (!url) {
      console.log("missing url");
      return res.writeHead(404).end();
    }
    const { path, section } = getSectionAndPath(url);

    if (section) {
      const [originalFilePath, data] = await Promise.all([
        getStoragePathFromUrl(path, section),
        body.then(validate(section)),
      ]);
      if (section === "page") {
        await storePages({ ...data, url: path });
      }
      console.log(path, data);
      return { ok: true };
    }
    res.writeHead(400, "Invalid section");
  })
);

server.listen(port);
