
const fs = require("fs");
const request = require("request");

module.exports = {
    execute: async (url, dest) => {
        let download = (url, filename, resolve, reject) => {
            request.get({ uri: url, encoding: 'binary', gzip: true }, function (err, res) {
                if (!err) {
                    fs.writeFile(filename, res.body, "binary", function (err, res) {
                        if (!err) {
                            resolve && resolve();
                        } else {
                            reject && reject(err);
                        }
                    })
                } else {
                    reject && reject(err);
                }
            })
        }

        return await new Promise((resolve, reject) => {
            download(url, dest, resolve, reject)
        });
    }
}