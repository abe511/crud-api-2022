import cluster from "cluster";
import { cpus } from "os";
import server from "./server";
import User from "./user";
import * as dotenv from "dotenv";
dotenv.config();

let PORT = parseInt(process.env.PORT as string) || 5555;

export const DB: User[] = [];


// ******** REMOVE THIS ***********
const u1 = new User("jenny", 23, ["playing", "swimming"]);
const u2 = new User("jelly", 21, ["running", "jumping"]);
const u3 = new User("jessie", 25, ["singing", "dancing"]);
const u4 = new User("jake", 35, []);
DB.push(u1, u2, u3, u4);
// ********************************

const numCPUs: number = cpus().length;

const WORKERS: any = {};
// const WORKERS: any = [];

if(cluster.isPrimary) {

    // cluster.setupPrimary({
    //     exec: "worker.js"
    // });

    console.log(`Primary process ${process.pid} running`);

    for(let i = 0; i < numCPUs; ++i) {
        // ++PORT;
        const worker = cluster.fork();
        WORKERS[worker.id] = {
            port: PORT + worker.id
        };
        console.log(worker.id, PORT);
    }

    // PORT -= numCPUs;

    cluster.on("exit", (worker, code, signal) => {
        console.log(`forking new worker instead of process: ${worker.process.pid} [code: ${code}, signal: ${signal}]`);
        PORT = WORKERS[worker.id].PORT;
        const newWorker = cluster.fork();
        WORKERS[newWorker.id] = {
            port: PORT
        };
    });
} else {
    console.log(`Worker ${process.pid} running`);
    server(PORT);
}


