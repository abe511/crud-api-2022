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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const cluster_1 = __importDefault(require("cluster"));
const os_1 = require("os");
const server_1 = __importDefault(require("./server"));
const user_1 = __importDefault(require("./user"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let PORT = parseInt(process.env.PORT) || 5555;
exports.DB = [];
// ******** REMOVE THIS ***********
const u1 = new user_1.default("jenny", 23, ["playing", "swimming"]);
const u2 = new user_1.default("jelly", 21, ["running", "jumping"]);
const u3 = new user_1.default("jessie", 25, ["singing", "dancing"]);
const u4 = new user_1.default("jake", 35, []);
exports.DB.push(u1, u2, u3, u4);
// ********************************
const numCPUs = (0, os_1.cpus)().length;
const WORKERS = {};
// const WORKERS: any = [];
if (cluster_1.default.isPrimary) {
    // cluster.setupPrimary({
    //     exec: "worker.js"
    // });
    console.log(`Primary process ${process.pid} running`);
    for (let i = 0; i < numCPUs; ++i) {
        // ++PORT;
        const worker = cluster_1.default.fork();
        WORKERS[worker.id] = {
            port: PORT + worker.id
        };
        console.log(worker.id, PORT);
    }
    // PORT -= numCPUs;
    cluster_1.default.on("exit", (worker, code, signal) => {
        console.log(`forking new worker instead of process: ${worker.process.pid} [code: ${code}, signal: ${signal}]`);
        PORT = WORKERS[worker.id].PORT;
        const newWorker = cluster_1.default.fork();
        WORKERS[newWorker.id] = {
            port: PORT
        };
    });
}
else {
    console.log(`Worker ${process.pid} running`);
    (0, server_1.default)(PORT);
}
