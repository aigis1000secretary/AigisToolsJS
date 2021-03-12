
const fs = require("fs");

const dir_exists = (dir) => {
    return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();
};

const file_exists = (dir) => {
    return fs.existsSync(dir) && !fs.lstatSync(dir).isDirectory();
};

const make_dir = (dir) => {
    return fs.mkdirSync(dir, { recursive: true });
};

module.exports = {
    dir_exists,
    file_exists,
    make_dir
}