import { IncomingMessage, ServerResponse } from "http";

export const requestStreamToJSON = <T>(request: IncomingMessage): Promise<T> => {
    return new Promise((resolve, _) => {
        const data: Uint8Array[] = [];
        request.on("data", (chunk) => {
            data.push(chunk);
        });
        request.on("end", () => {
            const result: string = Buffer.concat(data).toString();
            resolve(JSON.parse(result));
        });
    });
};


export const respond = (res: ServerResponse, statusCode: number, response: any = ""): void => {

    let message: string = "OK";

    res.setHeader("Content-Type", "application/json");
    switch(statusCode) {
        case 204:
            message = "No Content";
            response = {message: "Record Removed"};
            break;
        case 400:
            message = "Bad Request";
            response = {message: "Bad Request"};
            break;
        case 404:
            message = "Not Found";
            response = {message: "Resource Not Found"};
            break;
        case 500:
            message = "Server Error";
            response = {message: "Internal Server Error"};
            break;
    }
    res.writeHead(statusCode, message);
    res.end(JSON.stringify(response)); 
};