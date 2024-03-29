"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookData = exports.fakeGetBookData = void 0;
const axios = require("axios");
function fakeGetBookData(authors, title) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    authors,
                    title,
                });
            }, 200);
        });
    });
}
exports.fakeGetBookData = fakeGetBookData;
function sanitizeTitle(title) {
    const regex = /[&,-,/,\\]/gi;
    return title.replace(regex, "");
}
function getBookData(authorIn, titleIn) {
    return __awaiter(this, void 0, void 0, function* () {
        let baseURL = "https://www.googleapis.com/books/v1/volumes";
        let query = `${baseURL}?q=${sanitizeTitle(titleIn)}+inauthor:${authorIn}`;
        let id = `${authorIn.replace(/\s/g, "")}-${titleIn.replace(/\s/g, "")}`;
        const queryDateString = new Date()
            .toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
            .replace(/\//g, "-");
        // console.log(query);
        return axios
            .get(query)
            .then((resp) => {
            var _a;
            if (resp.data.totalItems === 0) {
                return {
                    query,
                    queryDateString,
                };
            }
            let bookInfo = resp.data.items[0].volumeInfo;
            let title = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.title;
            let authors = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.authors;
            let subTitle = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.subtitle;
            let description = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.description;
            let publisher = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.publisher;
            let publishedDate = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.publishedDate;
            let pageCount = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.pageCount;
            let categories = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.categories;
            let imageURL = (bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.imageLinks)
                ? (_a = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.imageLinks) === null || _a === void 0 ? void 0 : _a.thumbnail
                : "";
            let bookDetailsURL = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.infoLink;
            let isbn = bookInfo === null || bookInfo === void 0 ? void 0 : bookInfo.industryIdentifiers;
            let googleISBNS = undefined;
            if (Array.isArray(isbn)) {
                googleISBNS =
                    isbn &&
                        isbn.reduce((final, el) => {
                            return Object.assign(Object.assign({}, final), { [el.type]: el.identifier });
                        }, {});
            }
            return {
                id,
                subTitle,
                title,
                authors,
                description,
                publisher,
                publishedDate,
                pageCount,
                categories,
                imageURL,
                bookDetailsURL,
                googleISBNS,
                query,
                queryDateString,
            };
        })
            .catch((e) => {
            //console.log("ERROR", e.response.status);
            return { id, authorIn, titleIn, query, error: e };
        });
    });
}
exports.getBookData = getBookData;
module.exports = {
    getBookData,
    fakeGetBookData,
};
