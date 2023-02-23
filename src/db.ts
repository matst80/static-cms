import {
  createClient,
  RedisClientOptions,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
import ShortUniqueId from "short-unique-id";
import { StorageProvider } from "./types/db-provider";
import { Module, Page } from "./types/storage";
const uid = new ShortUniqueId();

const moduleListId = "module_ids";
const pageListId = "page_urls";
const urlChangeId = "page_url_change";

export const redisStorage = (
  options?: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>
): StorageProvider => {
  const client = createClient(options);
  client.connect();
  const clientPubSub = createClient(options);
  clientPubSub.connect();
  const getTitle = (url: string) => client.hGet(url, "title");
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
        await client.hSet(Module, module.id, JSON.stringify(module));
      }
    },
    async savePage(page) {
      await Promise.all([
        client.zAdd(pageListId, {
          value: page.url,
          score: Date.now(),
        }),
        client.hSet(Page, page.url, JSON.stringify(page)),
        client.hSet(page.url, "title", page.seoTitle ?? ""),
      ]);
    },
    listenForUrlChange(listener) {
      clientPubSub.subscribe(urlChangeId, (data) => listener(JSON.parse(data)));
    },
    async getUrls() {
      const urls = await client.zRange(pageListId, 0, -1);
      return await Promise.all(
        urls.map((url) =>
          getTitle(url).then((title = "") => ({ url: `/${url}`, title }))
        )
      );
    },
    getPage(url) {
      return client
        .hGet(Page, url)
        .then((d) => (d ? JSON.parse(d) : undefined));
    },
    getTitle,
  };
};
