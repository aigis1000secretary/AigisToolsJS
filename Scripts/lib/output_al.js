
const fs = require("fs");

let output = (obj, where, working, aux, hasaod) => {

}

module.exports = {
    output: (obj, where, working, aux) => {

        if (!dir_exists(working)) {
            make_dir(working);
        }

        if (!/[\\\/]$/.test(working)) {
            working = working + "/";
        }

        output(obj, where, working, aux || {})
    }
}

