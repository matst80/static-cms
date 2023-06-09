import http from "http";
import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

const counter = new client.Counter({
  name: "jsonrequests",
  help: "metric_help",
});

export type JsonRequest = http.IncomingMessage & {
  body: () => null | Promise<unknown>;
};

export type JsonResponse = http.ServerResponse<http.IncomingMessage> & {
  json: <R>(data: Promise<R>) => void;
  error: (err: Error | string) => void;
};

const json = (req: http.IncomingMessage) =>
  new Promise((res, rej) => {
    const body: any[] = [];
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        try {
          const text = Buffer.concat(body).toString();
          res(JSON.parse(text));
        } catch (err) {
          rej(err);
        }
      });
  });

const error = (
  res: http.ServerResponse<http.IncomingMessage>,
  message: Error | string,
  status = 400
) => {
  console.error(message);
  if (!res.closed) {
    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
    }
    res.end(JSON.stringify({ message }));
  }
};

export type AuthHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => void;

export type JsonHandler = (
  request: JsonRequest,
  response: JsonResponse
) => Promise<any>;

export const jsonRequest =
  (authHandler: AuthHandler, handler: JsonHandler) =>
  (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
  ) => {
    const { url, method } = req;
    if (url?.startsWith("/auth/")) {
      return authHandler(req, res);
    }
    if (url?.startsWith("/metrics")) {
      res.setHeader("Content-Type", client.register.contentType);
      client.register.metrics().then((data) => {
        res.end(data);
      });

      return;
    }
    counter.inc();
    (req as JsonRequest).body = () => (method === "GET" ? null : json(req));
    (res as JsonResponse).json = (prm) => handle(res, prm);
    (res as JsonResponse).error = (err) => error(res, err);
    handle(res, handler(req as JsonRequest, res as JsonResponse));
  };

const handle = <T>(
  res: http.ServerResponse<http.IncomingMessage>,
  prm: Promise<T>
) =>
  prm
    .then((data) => {
      if (!res.closed) {
        if (!res.headersSent) {
          res.setHeader("Content-Type", "application/json");
          res.writeHead(data ? 200 : 201);
        }

        if (!data) {
          res.end();
        } else {
          res.end(JSON.stringify(data));
        }
      }
    })
    .catch((err) => error(res, err.toString(), 500));
