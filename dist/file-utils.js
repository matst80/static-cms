"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoragePathFromPage = exports.getStoragePathFromUrl = exports.getSectionAndPath = exports.compressStaticFile = void 0;
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const node_stream_1 = require("node:stream");
const promises_2 = require("node:stream/promises");
const node_zlib_1 = __importStar(require("node:zlib"));
const storage_1 = require("./types/storage");
const gzipCompressFile = async (outputFile, source) => {
    const gzip = (0, node_zlib_1.createGzip)();
    const destination = (0, node_fs_1.createWriteStream)(outputFile);
    return (0, promises_2.pipeline)(source, gzip, destination);
};
const brotliOptions = {
    chunkSize: 32 * 1024,
    params: {
        [node_zlib_1.default.constants.BROTLI_PARAM_MODE]: node_zlib_1.default.constants.BROTLI_MODE_TEXT,
        [node_zlib_1.default.constants.BROTLI_PARAM_QUALITY]: 6,
    },
};
const brotliCompressFile = async (outputFile, source) => {
    const br = (0, node_zlib_1.createBrotliCompress)(brotliOptions);
    const destination = (0, node_fs_1.createWriteStream)(outputFile);
    return (0, promises_2.pipeline)(source, br, destination);
};
const compressStaticFile = async (filename, data, emptyWithoutCompression = false) => {
    const jsonContent = JSON.stringify(data);
    const getStream = () => node_stream_1.Readable.from(jsonContent);
    return Promise.all([
        gzipCompressFile(`${filename}.gz`, getStream()),
        brotliCompressFile(`${filename}.br`, getStream()),
        (0, promises_1.writeFile)(filename, emptyWithoutCompression ? "" : getStream()),
    ]);
};
exports.compressStaticFile = compressStaticFile;
const staticPath = process.env.STATIC_PATH ?? "static";
const makeJsonUrl = (url) => {
    if (url === "" || url === "/") {
        return "index.json";
    }
    if (url.endsWith("/")) {
        return url + "index.json";
    }
    return url + ".json";
};
const getSectionAndPath = (url) => {
    const [section, ...path] = url.split("/").filter((p) => p && p.length);
    if (!storage_1.storageSections.includes(section)) {
        return { section: null, path: url };
    }
    return { section: section, path: path.join("/") };
};
exports.getSectionAndPath = getSectionAndPath;
const getStorageDirectory = async (section, ...path) => {
    const fsPath = (0, node_path_1.join)(staticPath, section, ...path);
    if (!(0, node_fs_1.existsSync)(fsPath)) {
        await (0, promises_1.mkdir)(fsPath, { recursive: true });
    }
    return fsPath;
};
const getStoragePathFromUrl = async (url, section) => {
    const path = makeJsonUrl(url).split("/");
    const filename = path.pop();
    const fsPath = await getStorageDirectory(section, ...path);
    return (0, node_path_1.join)(fsPath, filename);
};
exports.getStoragePathFromUrl = getStoragePathFromUrl;
const getStoragePathFromPage = ({ url }) => (0, exports.getStoragePathFromUrl)(url, "page");
exports.getStoragePathFromPage = getStoragePathFromPage;
