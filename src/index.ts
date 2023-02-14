import { compressStaticFile, getStoragePathFromUrl } from "./file-utils";
import { Page } from "./types/page-and-components";

const storePage = async (page: Page) => {
  const path = await getStoragePathFromUrl(page.url);
  return compressStaticFile(path, page);
};

storePage({
  url: "blog/test",
  id: "start",
  modules: [
    {
      id: "top",
      settings: {
        hej: 1,
      },
      type: "top",
      links: [{ href: "/kalle", caption: "Kalle!" }],
    },
  ],
});
