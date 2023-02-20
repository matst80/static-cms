import { JsonRequest, JsonResponse } from "../server-utils"

export type SectionHandler = (options: {
  req:JsonRequest,
  res:JsonResponse,
  method: string;
  path: string;
  body: ()=>null|Promise<any>;
  fileStatus: Promise<{
    exists: boolean;
    filePath: string;
  }>;
}) => Promise<any>;