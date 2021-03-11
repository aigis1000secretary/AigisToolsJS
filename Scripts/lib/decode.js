
// const fs = require("fs");
// const request = require("request");

module.exports = {
    decode: (text, key, offset = 1) => {
        text = Buffer.from(text, 'binary');
        for (let i = 0; i < text.length; ++i) {
            text[i] ^= key;
        }
        text = text.toString('utf8');

        return text
    },

    decode_list: (text) => {
        text = module.exports.decode(text, 0xea ^ 0x30);
        let list = text.split('\n');
        list.sort((_a, _b) => {
            let a = _a.substring(89).toLowerCase() || "zzzz";
            let b = _b.substring(89).toLowerCase() || "zzzz";
            if (a > b) return 1;
            if (a < b) return -1;
            else return 0;
        })
        return list.join('\n');
    },

    decode_xml: () => {
    },
}