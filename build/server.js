"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const uuid_1 = require("uuid");
const utils_1 = require("./utils");
const user_1 = __importStar(require("./user"));
const cluster_1 = require("./cluster");
// import { PORT, DB } from "./cluster";
// import process from "process";
// process.send(JSON.stringify({msg: req.method}));
const server = (PORT) => {
    const httpServer = (0, http_1.createServer)((req, res) => {
        var _a;
        console.log(`port: ${PORT} request: ${req.method} url:${req.url}`);
        const path = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/");
        const userId = path === null || path === void 0 ? void 0 : path.pop();
        switch (req.url) {
            case "/api/users":
            case "/api/users/":
                if (req.method === "GET") {
                    try {
                        (0, utils_1.respond)(res, 200, cluster_1.DB);
                    }
                    catch (err) {
                        (0, utils_1.respond)(res, 500);
                    }
                }
                else if (req.method === "POST") {
                    (0, utils_1.requestStreamToJSON)(req)
                        .then((data) => {
                        if (!(0, user_1.isUser)(data)) {
                            (0, utils_1.respond)(res, 400);
                        }
                        else {
                            const user = new user_1.default(data.username, data.age, data.hobbies);
                            cluster_1.DB.push(user);
                            (0, utils_1.respond)(res, 200, user);
                        }
                    }).catch((err) => {
                        (0, utils_1.respond)(res, 500);
                    });
                }
                break;
            case `/api/users/${userId}`:
                if (userId && !(0, uuid_1.validate)(userId)) {
                    (0, utils_1.respond)(res, 400);
                }
                else {
                    try {
                        const index = cluster_1.DB.findIndex((user) => {
                            return user.id === userId;
                        });
                        if (index >= 0) {
                            switch (req.method) {
                                case "DELETE":
                                    cluster_1.DB.splice(index, 1);
                                    (0, utils_1.respond)(res, 204);
                                    break;
                                case "GET":
                                    (0, utils_1.respond)(res, 200, cluster_1.DB[index]);
                                    break;
                                case "PUT":
                                    (0, utils_1.requestStreamToJSON)(req)
                                        .then((data) => {
                                        if (!(0, user_1.isUser)(data)) {
                                            (0, utils_1.respond)(res, 400);
                                        }
                                        else {
                                            cluster_1.DB[index].username = data.username;
                                            cluster_1.DB[index].age = data.age;
                                            cluster_1.DB[index].hobbies = data.hobbies;
                                            (0, utils_1.respond)(res, 200, cluster_1.DB[index]);
                                        }
                                    }).catch((err) => {
                                        (0, utils_1.respond)(res, 500);
                                    });
                                    break;
                            }
                        }
                        else {
                            (0, utils_1.respond)(res, 404);
                        }
                    }
                    catch (err) {
                        (0, utils_1.respond)(res, 500);
                    }
                }
                break;
            default:
                (0, utils_1.respond)(res, 404);
        }
    });
    httpServer.listen(PORT, () => {
        console.log(`http server started on port: ${PORT}`);
    });
};
exports.default = server;
