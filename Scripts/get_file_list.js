
const fs = require("fs");
const path = require("path");
const file = require("./lib/file.js")
const dl = require("./lib/download.js")

module.exports = async () => {
    // out path
    let out = path.join(process.cwd(), "out/files")
    if (!file.dir_exists(out)) {
        file.make_dir(out);
    }

    // get file list
    let files_text = await dl.getlist_raw();
    // output:
    fs.writeFileSync(`${out}/files.txt`, files_text);
}