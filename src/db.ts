import {
  createClient,
  RedisClientOptions,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
import ShortUniqueId from "short-unique-id";
import { StorageProvider } from "./types/db-provider";
const uid = new ShortUniqueId();

const moduleListId = "cms_module_ids";
const pageListId = "cms_page_urls";
const urlChangeId = "cms_page_url_change";
const pageHashId = "cms_page";
const moduleHashId = "cms_module";
const urlPrefix = "cms-url:";

export const redisStorage = (
  options?: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>
): StorageProvider => {
  const client = createClient(options);
  client.connect();
  const clientPubSub = createClient(options);
  clientPubSub.connect();
  const getMetadata = (url: string) =>
    Promise.all([client.hGet(urlPrefix+url, "title"), client.hGet(urlPrefix+url, "modified")]).then(
      ([title = "", modified]) => {
        return {
          url,
          title,
          modified: modified ? Number(modified) : Date.now(),
        };
      }
    );
  return {
    getId() {
      return uid.stamp(32);
    },
    emitUrlChange(urlData) {
      const data = JSON.stringify(urlData);
      return Promise.all([client.publish(urlChangeId, data)]);
    },
    async saveModule(module) {
      if (module.id) {
        await client.zAdd(moduleListId, {
          value: module.id,
          score: Date.now(),
        });
        await client.hSet(moduleHashId, module.id, JSON.stringify(module));
      }
    },
    async savePage(page) {
      await Promise.all([
        client.zAdd(pageListId, {
          value: page.url,
          score: Date.now(),
        }),
        client.hSet(pageHashId, page.url, JSON.stringify(page)),
        client.hSet(urlPrefix+page.url, "title", page.seoTitle ?? ""),
        client.hSet(urlPrefix+page.url, "modified", String(page.modified)),
      ]);
    },
    listenForUrlChange(listener) {
      clientPubSub.subscribe(urlChangeId, (data) => listener(JSON.parse(data)));
    },
    async getUrls() {
      const urls = await client.zRange(pageListId, 0, -1);
      return await Promise.all(urls.map(getMetadata));
    },
    getPage(url) {
      return client
        .hGet(pageHashId, url)
        .then((d) => (d ? JSON.parse(d) : undefined));
    },
    getMetadata: getMetadata,
  };
};
