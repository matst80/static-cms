import { createWriteStream, existsSync, ReadStream } from "node:fs";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import zlib, { createBrotliCompress, createGzip } from "node:zlib";
import { Page, PageModule } from "slask-cms";
import { storageSections, StorageSections } from "./types/storage";

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

export const compressStaticFile = async (
  filename: string,
  data: object,
  emptyWithoutCompression = false
) => {
  console.log("writing", filename);
  const jsonContent = JSON.stringify(data);
  const getStream = () => Readable.from(jsonContent) as ReadStream;
  return Promise.all([
    gzipCompressFile(`${filename}.gz`, getStream()),
    brotliCompressFile(`${filename}.br`, getStream()),
    writeFile(filename, emptyWithoutCompression ? "" : getStream()),
  ]);
};

export const getVariants = (path: string) => [path, path + ".gz", path + ".br"];

const staticPath = process.env.STATIC_PATH ?? "static";

const makeJsonUrl = (url: string) => {
  if (url === "" || url === "/") {
    return "index.json";
  }
  if (url.endsWith("/")) {
    return url + "index.json";
  }
  return url + ".json";
};

export const getSectionAndPath = (
  url: string
): { section: StorageSections | null; path: string } => {
  const [section, ...path] = url.split("/").filter((p) => p && p.length);
  if (!storageSections.includes(section as any)) {
    return { section: null, path: url };
  }
  return { section: section as StorageSections, path: path.join("/") };
};

const getStorageDirectory = async (
  section: StorageSections,
  ...path: string[]
) => {
  const fsPath = join(staticPath, section, ...path);
  if (!existsSync(fsPath)) {
    await mkdir(fsPath, { recursive: true });
  }
  return fsPath;
};

export const getStoragePathFromUrl = async (
  url: string,
  section: StorageSections
) => {
  const path = makeJsonUrl(url).split("/");
  const filename = path.pop()!;
  const fsPath = await getStorageDirectory(section, ...path);
  return join(fsPath, filename);
};

export const getStoragePathFromPage = ({ url }: Page) =>
  getStoragePathFromUrl(url, "page");

export const getStoragePathFromModule = ({ id }: PageModule) =>
  join(staticPath, "module", `${id}.json`);

export const getStoragePathForUrlList = () =>
  join(staticPath, "page", `urls.json`);
