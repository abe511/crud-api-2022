import { v4 as uuidv4 } from "uuid";


export const isUser = (data: any): data is User => {
    return Boolean(
        data
        && "username" in data
        && "age" in data
        && "hobbies" in data
        && typeof(data.username) === "string"
        && typeof(data.age) === "number"
        && typeof(data.hobbies) === "object"
        && Array.isArray(data.hobbies)
        && data.hobbies.every((el: unknown) => typeof(el) === "string")
    );
};


interface IUser {
    readonly id: string,
    username: string,
    age: number,
    hobbies: string[]
}


class User implements IUser {

    readonly id: string;
    username: string;
    age: number;
    hobbies: string[];

    constructor(username: string, age: number, hobbies: string[]) {
        this.id = uuidv4();
        this.username = username;
        this.age = age;
        this.hobbies = hobbies;
    }
}

export default User;
