import { pageFactory } from "./page";
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
import { redisStorage } from "./db";
import { urlGeneratorFactory } from "./url-generator";
import { authHandlerFactory } from "./auth";

const getHandler =
  process.env.NODE_ENV === "development"
    ? require("staticfiles")
    : () => {
        return null;
      };

const port = process.env.PORT ?? 3010;

const validate = (type: StorageSections) => (data: any) => {
  if (type === "page") {
    if (!data.modules) {
      throw new Error("no modules, page will be empty");
    }
  }
  return data;
};

const db = redisStorage({
  url: process.env.REDIS ?? "redis://:slaskdb@localhost:6379",
});

const authOptions = {
  configurationUrl:
    "https://accounts.google.com/.well-known/openid-configuration",
  client_id:
    process.env.GOOGLE_CLIENT_ID ||
    "1017700364201-hiv4l9c41osmqfkv17ju7gg08e570lfr.apps.googleusercontent.com",
  client_secret:
    process.env.GOOGLE_CLIENT_SECRET || "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",
  redirect_uri:
    process.env.GOOGLE_REDIRECT_URI || "https://cms.tornberg.me/auth/callback",
};
const { authHandler, validToken } = authHandlerFactory(authOptions);

const { storePages } = pageFactory(db);
urlGeneratorFactory(db);

const authorized = ({ headers }: http.IncomingMessage) => {
  return true;
  // const { authorization } = headers;
  // if (!authorization) {
  //   return false;
  // }
  // return validToken(authorization.split(" ")[1]);
};

const server = http.createServer(
  jsonRequest(authHandler, async (req, res) => {
    const { url, method, headers, body } = req;
    if (!url) {
      // console.log("missing url");
      return res.writeHead(404).end();
    }

    const { path, section } = getSectionAndPath(url);

    if (section) {
      if (method === "GET") {
        return getHandler(req, res);
      }
      if (!authorized(req)) {
        return res.writeHead(401).end();
      }
      const fileExistsPromise = getStoragePathFromUrl(path, section).then(
        (filePath) => ({ exists: existsSync(filePath), filePath })
      );
      if (method === "DELETE") {
        const { exists, filePath } = await fileExistsPromise;
        if (exists) {
          await getVariants(filePath).map(unlink);

          return { filePath, deleted: true };
        }
      } else if (method === "POST" || method === "PUT") {
        const data = await body;
        if (section === "page") {
          await storePages({ ...data, url: path });
        } else {
          console.log("save", section, data);
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
