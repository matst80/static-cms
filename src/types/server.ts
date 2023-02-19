export type SectionHandler = (options: {
  method: string;
  path: string;
  body: ()=>null|Promise<any>;
  fileStatus: Promise<{
    exists: boolean;
    filePath: string;
  }>;
}) => Promise<any>;