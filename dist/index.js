"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
const http_1 = __importDefault(require("http"));
const file_utils_1 = require("./file-utils");
const server_utils_1 = require("./server-utils");
const fs_1 = require("fs");
const port = process.env.PORT ?? 3010;
const validate = (type) => (data) => {
    if (type === "page") {
        if (!data.modules) {
            throw new Error("no modules, page will be empty");
        }
    }
    return data;
};
const server = http_1.default.createServer((0, server_utils_1.jsonRequest)(async (req, res) => {
    const { url, method, headers, body } = req;
    if (!url) {
        console.log("missing url");
        return res.writeHead(404).end();
    }
    const { path, section } = (0, file_utils_1.getSectionAndPath)(url);
    if (section) {
        const fileExistsPromise = (0, file_utils_1.getStoragePathFromUrl)(path, section).then((filePath) => ({ exists: (0, fs_1.existsSync)(filePath), filePath }));
        if (method === "DELETE") {
            if (await fileExistsPromise) {
                console.log("delete file!");
            }
        }
        else if (method === "POST" || method === "PUT") {
            const data = await body;
            if (section === "page") {
                await (0, page_1.storePages)({ ...data, url: path });
            }
        }
        else if (method === "PATCH") {
            console.log("patch file");
        }
        return { ok: true };
    }
    res.writeHead(400, "Invalid section");
}));
server.listen(port);
