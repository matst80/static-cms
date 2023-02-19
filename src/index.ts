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
import { redisStorage } from "./db";
import { urlGeneratorFactory } from "./url-generator";
import { authHandlerFactory } from "./auth";
import { pageHandlerFactory } from "./pagehandler";
import { SectionHandler } from "./types/server";
import { authOptions } from "./settings";

const getHandler =
  process.env.NODE_ENV === "development"
    ? require("staticfiles")
    : () => {
        return null;
      };

const port = process.env.PORT ?? 3010;

const db = redisStorage({
  url: process.env.REDIS ?? "redis://:slaskdb@localhost:6379",
});

const pageHandler = pageHandlerFactory(db);
const { authHandler, validToken } = authHandlerFactory(authOptions);
urlGeneratorFactory(db);

const authorized = ({ headers }: http.IncomingMessage) => {
  return true;
  // const { authorization } = headers;
  // if (!authorization) {
  //   return false;
  // }
  // return validToken(authorization.split(" ")[1]);
};

const sectionHandlers: Record<StorageSections, SectionHandler> = {
  page: pageHandler,
  header: () => Promise.reject("Not implemented"),
  settings: () => Promise.reject("Not implemented"),
  module: () => Promise.reject("Not implemented"),
};

const server = http.createServer(
  jsonRequest(authHandler, async (req, res) => {
    const { url, method, body } = req;
    if (!url || !method) {
      // console.log("missing url");
      return res.writeHead(404).end();
    }

    const { path, section } = getSectionAndPath(url);
    if (!section) {
      return res.writeHead(400, "Invalid section");
    }

    if (!authorized(req)) {
      return res.writeHead(401).end();
    }

    return sectionHandlers[section]({
      fileStatus: getStoragePathFromUrl(path, section).then((filePath) => ({
        exists: existsSync(filePath),
        filePath,
      })),
      method,
      path,
      body,
    });
  })
);

server.listen(port);
