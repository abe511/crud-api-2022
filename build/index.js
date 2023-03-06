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
exports.server = void 0;
const http_1 = require("http");
const uuid_1 = require("uuid");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const utils_1 = require("./utils");
const user_1 = __importStar(require("./user"));
const PORT = process.env.PORT || 5555;
const DB = [];
// ******** REMOVE THIS ***********
const u1 = new user_1.default("jenny", 23, ["playing", "swimming"]);
const u2 = new user_1.default("jelly", 21, ["running", "jumping"]);
const u3 = new user_1.default("jessie", 25, ["singing", "dancing"]);
const u4 = new user_1.default("jake", 35, []);
DB.push(u1, u2, u3, u4);
// ********************************
exports.server = (0, http_1.createServer)((req, res) => {
    var _a;
    const path = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/");
    const userId = path === null || path === void 0 ? void 0 : path.pop();
    switch (req.url) {
        case "/api/users":
        case "/api/users/":
            if (req.method === "GET") {
                try {
                    (0, utils_1.respond)(res, 200, DB);
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
                        DB.push(user);
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
                    const index = DB.findIndex((user) => {
                        return user.id === userId;
                    });
                    if (index >= 0) {
                        switch (req.method) {
                            case "DELETE":
                                DB.splice(index, 1);
                                (0, utils_1.respond)(res, 204);
                                break;
                            case "GET":
                                (0, utils_1.respond)(res, 200, DB[index]);
                                break;
                            case "PUT":
                                (0, utils_1.requestStreamToJSON)(req)
                                    .then((data) => {
                                    if (!(0, user_1.isUser)(data)) {
                                        (0, utils_1.respond)(res, 400);
                                    }
                                    else {
                                        DB[index].username = data.username;
                                        DB[index].age = data.age;
                                        DB[index].hobbies = data.hobbies;
                                        (0, utils_1.respond)(res, 200, DB[index]);
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
exports.server.listen(PORT, () => {
    console.log(`http server started on port: ${PORT}`);
});
