"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = void 0;
const uuid_1 = require("uuid");
const isUser = (data) => {
    return Boolean(data
        && "username" in data
        && "age" in data
        && "hobbies" in data
        && typeof (data.username) === "string"
        && typeof (data.age) === "number"
        && typeof (data.hobbies) === "object"
        && Array.isArray(data.hobbies)
        && data.hobbies.every((el) => typeof (el) === "string"));
};
exports.isUser = isUser;
class User {
    constructor(username, age, hobbies) {
        this.id = (0, uuid_1.v4)();
        this.username = username;
        this.age = age;
        this.hobbies = hobbies;
    }
}
exports.default = User;
