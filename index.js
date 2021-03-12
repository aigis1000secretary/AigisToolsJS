
// const fs = require("fs");

// let out = path.join(process.cwd(), "./files.txt")
// let local_dir = path.join(process.cwd(), `Data/Cache/net/`)
// console.log(0xea ^ 0x30);

const main = async () => {
    // await require("./Scripts/get_file_list.js")();
    await require("./Scripts/get_file.js")("AbilityList.atb");

}; main();