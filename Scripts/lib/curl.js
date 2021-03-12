
const fs = require("fs");
const request = require("request");
const util = require('util');
const get = util.promisify(request.get);

const execute = async (url, dest) => {
    console.log(`--output ${dest.replace(`${process.cwd()}\\`, "")}\n--compressed ${url}`);
    // download
    const res = await get({ url, encoding: 'binary', gzip: true });
    // to file
    fs.writeFileSync(dest, res.body, "binary");
};

module.exports = {
    execute
}