import { createReadStream, existsSync } from "fs";
import path from "path";
import { getSectionAndPath, getStoragePathFromUrl } from "./file-utils";
import { JsonRequest, JsonResponse } from "./server-utils";

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
