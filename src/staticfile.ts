import { createReadStream, existsSync } from "fs";
import {
  compressStaticFile,
  getSectionAndPath,
  getStoragePathFromUrl,
} from "./file-utils";
import { JsonRequest, JsonResponse } from "./server-utils";
import { SectionHandler } from "./types/server";

export default async function handleStaticFiles(
  req: JsonRequest,
  res: JsonResponse
) {
  const { url } = req;
  const { path, section } = getSectionAndPath(url!);
  if (section == null) {
    return null;
  }
  const { exists, filePath } = await getStoragePathFromUrl(path, section).then(
    (filePath) => ({ exists: existsSync(filePath), filePath })
  );
  if (exists) {
    res.setHeader("Content-Type", "application/json");
    const stream = createReadStream(filePath);
    stream.pipe(res);
  }
}

export const defaultHandler: SectionHandler = async ({
  method,
  filePath,
  body,
}) => {
  if (method === "POST") {
    const translations = await body();
    const fsPath = await filePath;
    compressStaticFile(fsPath, translations, false);
    return { ok: true };
  }
  return { ok: false };
};
