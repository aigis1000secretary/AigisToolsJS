
// const fs = require("fs");

// let out = path.join(process.cwd(), "./files.txt")
// let local_dir = path.join(process.cwd(), `Data/Cache/net/`)
// console.log(0xea ^ 0x30);

const main = async () => {
    const get_file_list = await require("./Scripts/get_file_list.js");
    get_file_list();

}; main();