import { Link } from "react-router-dom";
import { UrlAndTitle } from "slask-cms";

const getPageUrl = (url: string) => {
  return ["page", ...url.split("/").filter((d) => d.length)].join("/");
};

export default function PageLink({ url, title, modified }: UrlAndTitle) {
  const pageUrl = getPageUrl(url);
  return (
    <li key={url}>
      <Link to={pageUrl}>
        {title?.length ? title : url}{" "}
        <span className="pill">{new Date(modified).toDateString()}</span>
      </Link>
    </li>
  );
}
