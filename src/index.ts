import { storePages } from "./page";
import http from "http";
import {
  getSectionAndPath,
  getStoragePathFromUrl,
  getVariants,
} from "./file-utils";
import { jsonRequest } from "./server-utils";
import { StorageSections } from "./types/storage";
import { existsSync } from "fs";
import { unlink } from "fs/promises";

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
      const fileExistsPromise = getStoragePathFromUrl(path, section).then(
        (filePath) => ({ exists: existsSync(filePath), filePath })
      );

      if (method === "DELETE") {
        const { exists, filePath } = await fileExistsPromise;
        if (exists) {
          await getVariants(filePath).map(unlink);

          console.log("delete file!");
        }
      } else if (method === "POST" || method === "PUT") {
        const data = await body;
        if (section === "page") {
          await storePages({ ...data, url: path });
        }
      } else if (method === "PATCH") {
        console.log("patch file");
      }
      return { ok: true };
    }
    res.writeHead(400, "Invalid section");
  })
);

server.listen(port);
