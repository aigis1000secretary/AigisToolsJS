
const fs = require("fs");
const path = require("path");

const file = require("./file.js")
const curl = require("./curl.js")
const decode = require("./decode.js")

module.exports = {
    defaultlist: () => {
        let out = path.join(process.cwd(), "./files.txt")
        let h = fs.readFileSync(out);
        let text = h.toString();
        return text;
    },

    getfile_raw: async (base, part1, part2) => {
        if (!/[0-9A-F]{40}/i.test(part1)) throw part1;
        if (!/[0-9A-Z]{32}/i.test(part2)) throw part2;

        let local_dir = path.join(process.cwd(), `Data/Cache/net/${part1}`);
        let local_spec = path.join(process.cwd(), `Data/Cache/net/${part1}/${part2}`);

        if (!file.dir_exists(local_dir)) {
            file.make_dir(local_dir);
        }

        if (file.file_exists(local_spec)) {
            return local_spec;
        }

        let url = `${base}${part1}/${part2}`
        console.log("--output", local_spec, "\n--compressed", url)
        await curl.execute(url, local_spec);

        return local_spec;
    },

    getlist_raw: async (list) => {
        // default value
        list = list || module.exports.defaultlist();

        // split url
        let match = list.match(/(https\:\/\/drc1bk94f7rq8.cloudfront.net\/)([0-9A-F]{40})(\/)([0-9A-Z]{32})/i);
        let base = match[1];
        let part1 = match[2];
        let part2 = match[4];

        let fname = await module.exports.getfile_raw(base, part1, part2);

        let text = fs.readFileSync(fname, { encoding: "Binary" });

        text = decode.decode_list(text);

        return text;
    }
}
