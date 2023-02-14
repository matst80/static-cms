import {
  createReadStream,
  createWriteStream,
  existsSync,
  ReadStream,
} from "node:fs";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import zlib, { createBrotliCompress, createGzip } from "node:zlib";

const gzipCompressFile = async (outputFile: string, source: ReadStream) => {
  const gzip = createGzip();
  const destination = createWriteStream(outputFile);
  return pipeline(source, gzip, destination);
};

const brotliOptions = {
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 6,
  },
};

const brotliCompressFile = async (outputFile: string, source: ReadStream) => {
  const br = createBrotliCompress(brotliOptions);

  const destination = createWriteStream(outputFile);
  return pipeline(source, br, destination);
};

export const compressStaticFile = async (filename: string, data: object) => {
  const jsonContent = JSON.stringify(data);
  const getStream = () => Readable.from(jsonContent) as ReadStream;
  return Promise.all([
    gzipCompressFile(`${filename}.gz`, getStream()),
    brotliCompressFile(`${filename}.br`, getStream()),
    writeFile(filename, getStream()),
  ]);
};

const staticPath = process.env.STATIC_PATH ?? "static";

const makeJsonUrl = (url: string) => {
  if (url.endsWith("/")) {
    return url + "index.json";
  }
  return url + ".json";
};

export const getStoragePathFromUrl = async (url: string) => {
  const path = makeJsonUrl(url).split("/");
  const filename = path.pop();
  const fsPath = join(...[staticPath, ...path]);
  if (!existsSync(fsPath)) {
    await mkdir(fsPath, { recursive: true });
  }
  if (!filename || !filename.length) {
    throw new Error("no filename present or to short");
  }
  return join(fsPath, filename);
};
