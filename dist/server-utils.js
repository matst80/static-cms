"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonRequest = void 0;
const json = (req) => new Promise((res, rej) => {
    const body = [];
    req
        .on("data", (chunk) => {
        body.push(chunk);
    })
        .on("end", () => {
        try {
            res(JSON.parse(Buffer.concat(body).toString()));
        }
        catch (err) {
            rej(err);
        }
    });
});
const error = (res, message, status = 400) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(status);
    res.end(JSON.stringify({ message }));
};
const jsonRequest = (handler) => (req, res) => {
    req.body = json(req);
    res.json = (prm) => handle(res, prm);
    res.error = (err) => error(res, err);
    handle(res, handler(req, res));
};
exports.jsonRequest = jsonRequest;
const handle = (res, prm) => prm
    .then((data) => {
    if (!res.headersSent) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(data ? 200 : 201);
    }
    if (!data) {
        res.end();
    }
    else {
        res.end(JSON.stringify(data));
    }
})
    .catch((err) => error(res, err.toString(), 500));
