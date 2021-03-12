
const fs = require("fs");
const path = require("path");

const file = require("./file.js")
const curl = require("./curl.js")
const decode = require("./decode.js")

let lists_raw = [];
let lists = [];
let list_base = [];

const defaultlist = () => {
    let out = path.join(process.cwd(), "./files.txt");
    return fs.readFileSync(out).toString();
};

const getfile_raw = async (base, part1, part2) => {
    // check var
    if (!/[0-9a-f]{40}/i.test(part1)) throw part1;
    if (!/[0-9a-z]{32}/i.test(part2)) throw part2;
    // get fullpath
    let local_dir = path.join(process.cwd(), `Data/Cache/net/${part1}`);
    let local_spec = path.join(process.cwd(), `Data/Cache/net/${part1}/${part2}`);

    if (!file.dir_exists(local_dir)) {
        file.make_dir(local_dir);
    }

    if (file.file_exists(local_spec)) {
        return local_spec;
    }

    // download new raw data
    let url = `${base}${part1}/${part2}`
    await curl.execute(url, local_spec);

    return local_spec;
};

const getlist_raw = async (list) => {
    // default value
    list = list || defaultlist();
    if (lists_raw[list]) {
        return lists_raw[list]
    }

    // split url
    let [, base, part1, part2] = list.match(/(https\:\/\/drc1bk94f7rq8.cloudfront.net\/)([0-9a-f]{40})\/([0-9a-z]{32})/i);

    // raw filename
    let fname = await getfile_raw(base, part1, part2);
    // raw text
    let text = fs.readFileSync(fname, { encoding: "binary" });
    text = Buffer.from(text, 'binary');
    // decode list
    text = decode.decode_list(text);

    // keep Cache
    lists_raw[list] = text;
    list_base[list] = base;
    return text;
};

const getlist = async (list) => {
    // default value
    list = list || defaultlist();
    if (lists[list]) {
        return lists[list]
    }

    // get list
    let text = (await getlist_raw(list)).split('\n');
    let entries = [];
    for (let line of text) {
        let [, part1, part2, type, size, name] = line.match(/([0-9a-f]{40}),([0-9a-z]{32}),(\w+),(\d+),([\w\._]+)/i);
        size = parseInt(size);
        let entry = { part1, part2, type, size, name };

        entries[name] = entry;
    }

    // keep Cache
    lists[list] = entries;
    return entries;
};

const getfile = async (list, fname) => {
    list = list || defaultlist();

    // get list by obj
    let entries = await getlist(list);
    if (!entries[fname]) throw (`missing ${fname}`);

    // get target data
    let entry = entries[fname]
    if (!list_base[list]) throw (`missing ${list} base`);

    let fpath = await getfile_raw(list_base[list], entry.part1, entry.part2);
    let text = fs.readFileSync(fpath, { encoding: "binary" });
    text = Buffer.from(text, 'binary');

    return text;
};

module.exports = {
    defaultlist,
    getfile_raw,
    getlist_raw,
    getlist,
    getfile
}
