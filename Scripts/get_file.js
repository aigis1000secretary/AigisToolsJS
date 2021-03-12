
const fs = require("fs");
const path = require("path");

const dl = require("./lib/download.js")
const parse_al = require("./lib/parse_al.js")
const output_al = require("./lib/output_al.js")

module.exports = async (fname, mode) => {
    console.log("get_file", fname);

    // out path
    let out = path.join(process.cwd(), "out/files");
    let working = path.join(process.cwd(), "working/");

    let copyTarget = [
        ".png",
        ".ogg",
        ".mp3",
        ".htm",
        ".lua",
        ".js",
        ".txt"
    ]

    let ext = path.extname(fname);
    let copy = copyTarget.includes(ext);

    let text = await dl.getfile(null, fname)
    if (copy || mode == "copy") {
        // output rawfile
        fs.writeFileSync(`${out}/${fname}`, text, { encoding: "binary" });
    } else if (mode == "decompress" || mode == "dec") {
        // todo?
        let obj = parse_al.decompress(text);
        // output dec file
        fs.writeFileSync(`${out}/${fname}.dec`, obj, { encoding: "binary" });
    } else {
        // parse_al
        let obj = parse_al.parse(text)
        console.log(obj)
        output_al.output(obj, `${out}\\${fname}\\`, working);


        // text = require("./lib/decode.js").decode_list(text);
        // console.log(text)
    }






    // if (!file.dir_exists(out)) {
    //     file.make_dir(out);
    // }

    // // get file list
    // let files_text = await dl.getlist_raw();
    // // output list
    // fs.writeFileSync(`${out}/files.txt`, files_text);
}