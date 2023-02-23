import { BaseModule } from "services";

export const UglyHtml = ({ html }: BaseModule) => {
  if (!html || typeof html !== "string") {
    return null;
  }
  return <div dangerouslySetInnerHTML={{ __html: String(html) }}></div>;
};
