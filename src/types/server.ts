export type SectionHandler = (options: {
  method: string;
  path: string;
  body: Promise<any>;
  fileStatus: Promise<{
    exists: boolean;
    filePath: string;
  }>;
}) => Promise<any>;