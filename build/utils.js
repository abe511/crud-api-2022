"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = exports.requestStreamToJSON = void 0;
const requestStreamToJSON = (request) => {
    return new Promise((resolve, _) => {
        const data = [];
        request.on("data", (chunk) => {
            data.push(chunk);
        });
        request.on("end", () => {
            const result = Buffer.concat(data).toString();
            resolve(JSON.parse(result));
        });
    });
};
exports.requestStreamToJSON = requestStreamToJSON;
const respond = (res, statusCode, response = "") => {
    let message = "OK";
    res.setHeader("Content-Type", "application/json");
    switch (statusCode) {
        case 204:
            message = "No Content";
            response = { message: "Record Removed" };
            break;
        case 400:
            message = "Bad Request";
            response = { message: "Bad Request" };
            break;
        case 404:
            message = "Not Found";
            response = { message: "Resource Not Found" };
            break;
        case 500:
            message = "Server Error";
            response = { message: "Internal Server Error" };
            break;
    }
    res.writeHead(statusCode, message);
    res.end(JSON.stringify(response));
};
exports.respond = respond;
