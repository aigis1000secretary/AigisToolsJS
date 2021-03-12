
// const fs = require("fs");
// const request = require("request");

const decode = (text, key, offset = 1) => {
    for (let i = 0; i < text.length; ++i) {
        text[i] ^= key;
    }
    text = text.toString('utf8');

    return text
};

const decode_list = (text) => {
    // decode raw
    text = decode(text, 0xea ^ 0x30);
    // sort　by resource name
    let list = text.split('\n');
    list.sort((_a, _b) => {
        let a = _a.substring(89).toLowerCase() || "zz";
        let b = _b.substring(89).toLowerCase() || "zz";
        if (a > b) return 1;
        if (a < b) return -1;
        else return 0;
    })
    list = list.filter(item => item);
    return list.join('\n');
};

const decode_xml = () => {
};

module.exports = {
    decode,
    decode_list,
    decode_xml
};