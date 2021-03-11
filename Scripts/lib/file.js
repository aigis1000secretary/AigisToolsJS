
const fs = require("fs");

module.exports = {
    dir_exists: (dir) => {
        return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();
    },

    file_exists: (dir) => {
        return fs.existsSync(dir) && !fs.lstatSync(dir).isDirectory();
    },

    make_dir: (dir) => {
        return fs.mkdirSync(dir, { recursive: true });
    }
}