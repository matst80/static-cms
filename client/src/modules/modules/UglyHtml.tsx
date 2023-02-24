import { CmsModuleProps } from ".";

export const UglyHtml = ({ html }: CmsModuleProps) => {
  if (!html || typeof html !== "string") {
    return null;
  }
  return <div dangerouslySetInnerHTML={{ __html: String(html) }}></div>;
};
