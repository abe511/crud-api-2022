import fs from "fs";

fs.rm("./build", {recursive: true, force: true}, (err) => {
    if(err) 
        console.log(err);
});