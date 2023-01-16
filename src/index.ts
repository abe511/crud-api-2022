import { IncomingMessage, ServerResponse, createServer } from "http";
import { validate } from "uuid";
import * as dotenv from "dotenv";
dotenv.config();

import { requestStreamToJSON, respond } from "./utils";
import User, { isUser } from "./user";

const PORT = process.env.PORT || 5555;

const DB: User[] = [];

// ******** REMOVE THIS ***********
const u1 = new User("jenny", 23, ["playing", "swimming"]);
const u2 = new User("jelly", 21, ["running", "jumping"]);
const u3 = new User("jessie", 25, ["singing", "dancing"]);
const u4 = new User("jake", 35, []);
DB.push(u1, u2, u3, u4);
// ********************************

const server = createServer((req: IncomingMessage, res: ServerResponse) => {

    const path = req.url?.split("/");
    const userId = path?.pop();

    switch(req.url) {
        case "/api/users":
        case "/api/users/":
            if(req.method === "GET") {
                try {
                    respond(res, 200, DB);
                } catch (err) {
                    respond(res, 500);
                }
            } else if(req.method === "POST") {
                requestStreamToJSON(req)
                    .then((data: unknown) => {
                        if(!isUser(data)) {
                            respond(res, 400);
                        } else {
                            const user = new User(data.username, data.age, data.hobbies);
                            DB.push(user);
                            respond(res, 200, user);
                        }
                    }).catch((err) => {
                        respond(res, 500);
                    });
            }
            break;
        case `/api/users/${userId}`:
            if(userId && !validate(userId)) {
                respond(res, 400);
            } else {
                try {
                    const index: number = DB.findIndex((user) => {
                        return user.id === userId;
                    });
                
                    if(index >= 0) {
                        switch(req.method) {
                            case "DELETE":
                                DB.splice(index, 1);
                                respond(res, 204);
                                break;
                            case "GET":
                                respond(res, 200, DB[index]);
                                break;
                            case "PUT":
                                requestStreamToJSON(req)
                                .then((data: unknown) => {
                                    if(!isUser(data)) {
                                        respond(res, 400);
                                    } else {
                                        DB[index].username = data.username;
                                        DB[index].age = data.age;
                                        DB[index].hobbies = data.hobbies;
                                        respond(res, 200, DB[index]);
                                    }
                                }).catch((err) => {
                                    respond(res, 500);
                                });
                                break;
                        }
                    } else {
                        respond(res, 404);
                    }
                } catch(err) {
                    respond(res, 500);
                }
            }
            break;
        default:
            respond(res, 404);
    }

});

server.listen(PORT, () => {
    console.log(`http server started on port: ${PORT}`);
})