"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storePages = void 0;
const file_utils_1 = require("./file-utils");
const storePages = async (...pages) => Promise.all(pages.map((page) => (0, file_utils_1.getStoragePathFromPage)(page).then((path) => (0, file_utils_1.compressStaticFile)(path, page, true))));
exports.storePages = storePages;
