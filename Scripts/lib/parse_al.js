
const fs = require("fs");

const parser = (data, decompress) => {

    let read_word = (offset) => {
        // let b1, b2 = data: byte(offset, offset + 1)
        return b1 + b2 * 256
    }

    let read_dword = (offset) => {
        let [b1, b2, b3, b4] = data.subarray(offset, offset + 4)
        return b1 + b2 * 256 + b3 * (256 * 256) + b4 * (256 * 256 * 256)
    }

    let read_sdword = (offset) => {
        let dword = read_dword(offset)
        if (dword >= 0x80000000) {
            dword = dword - 0x100000000
        }
        return dword
    }

    let tofloat = (bin) => {
        let bytes = 4
        let expbits = 8
        let expbias = 127

        let sign = bin >> (bytes * 8 - 1)
        let exponent = bin >> (bytes * 8 - (1 + expbits))
        exponent = exponent & ((1 << expbits) - 1)
        let mantissa = bin & ((1 << (bytes * 8 - 1 - expbits)) - 1)
        let f

        if (exponent == 0 && mantissa == 0) {
            f = 0.0
        } else {
            exponent = exponent - expbias
            f = 1.0 + mantissa / (1 << (bytes * 8 - 1 - expbits))
            f = f * 2.0 ^ exponent
        }
        if (sign == 1) {
            f = -f
        }
        return f
    }

    let read_float = (offset) => {
        return tofloat(read_dword(offset))
    }

    let read_string = (offset, maxlen) => {
        let end_offset = offset + maxlen;
        return data.subarray(offset, end_offset).toString('utf8');
    }

    let align = (offset, a, n) => {
        while (true) {
            let current_align = offset % a
            if (current_align == n) {
                return offset
            }
            offset = offset + 1
        }
    }

    let parse_object = (offset) => {
        let object_type = read_string(offset, 4);
        let t = { type: object_type };
        // console.log(object_type)

        if (object_type == "ALLZ") {
            offset = offset + 4;
            let vers = data[offset]; offset = offset + 1;
            let minbits_length = data[offset]; offset = offset + 1;
            let minbits_offset = data[offset]; offset = offset + 1;
            let minbits_literal = data[offset]; offset = offset + 1;
            let dst_size = read_dword(offset); offset = offset + 4;
            // let dst = Buffer.from(new Array());
            let dst = new Array();

            if (vers != 1) throw `vers != 1`;

            let bits = 0;
            let bits_count = 0;

            let ensure = (n) => {
                while (bits_count < n) {
                    bits = bits | (data[offset] << bits_count);
                    offset = offset + 1;
                    bits_count = bits_count + 8;
                }
            }

            let readbit = () => {
                ensure(1);
                let result = bits & 1;
                bits = bits >> 1;
                bits_count = bits_count - 1;
                return result;
            }

            let readbits = (n) => {
                ensure(n);
                let result = bits & ((1 << n) - 1);
                bits = bits >> n;
                bits_count = bits_count - n;
                return result;
            }

            let readunary = () => {
                let n = 0;
                while (readbit() == 1) {
                    n = n + 1;
                }
                return n;
            }

            let readcontrol = (minbits) => {
                let u = readunary();
                let n = readbits(u + minbits);
                if (u > 0) {
                    return n + (((1 << u) - 1) << minbits);
                } else {
                    return n;
                }
            }

            let readcontrol_length = () => {
                return 3 + readcontrol(minbits_length);
            }

            let readcontrol_offset = () => {
                return -1 - readcontrol(minbits_offset);
            }

            let readcontrol_literal = () => {
                return 1 + readcontrol(minbits_literal);
            }

            let copy_word = (word_off, word_len) => {
                // console.log("word", word_off, word_len)
                for (let i = 0; i < word_len; ++i) {
                    dst.push(dst[word_off])
                }
            }

            let copy_literal = (control) => {
                // console.log("literal", control)
                for (let i = 0; i < control; ++i) {
                    dst.push(data[offset]); offset = offset + 1;
                }
            }

            // -- initial segment
            copy_literal(readcontrol_literal());
            let word_off = readcontrol_offset();
            let word_len = readcontrol_length();
            let literal;


            let finish = "overflow";
            while (offset < data.length) {
                if (dst.length + word_len >= dst_size) {
                    finish = "word";
                    break;
                }
                if (readbit() == 0) {
                    // --print("mode 0")
                    literal = readcontrol_literal();
                    if (dst.length + word_len + literal >= dst_size) {
                        finish = "literal";
                        break;
                    }
                    let literal_offset = offset;
                    offset = offset + literal;
                    let next_off = readcontrol_offset();
                    let next_len = readcontrol_length();
                    copy_word(word_off, word_len);
                    let control_offset = offset;
                    offset = literal_offset;
                    copy_literal(literal);
                    if (offset != literal_offset + literal) throw (`offset == literal_offset + literal`);

                    offset = control_offset
                    word_off = next_off;
                    word_len = next_len;
                }
                else {
                    // --print("mode 1")
                    let next_off = readcontrol_offset()
                    let next_len = readcontrol_length()
                    copy_word(word_off, word_len)
                    word_off = next_off;
                    word_len = next_len;
                }
            }
            // --print("finish", finish)
            if (finish == 'word') {
                copy_word(word_off, word_len)
            } else if (finish == 'literal') {
                copy_word(word_off, word_len)
                copy_literal(literal)
            } else if (finish == 'overflow') {
                throw (`finish == 'overflow'`)
            }

            // console.log("final length", dst.length)

            if (!decompress) {
                // t = parse(dst: tostring())
                // console.log(Buffer.from(dst).toString('utf8'))
                t = Buffer.from(dst).toString('utf8');
            }

            t.lz = Buffer.from(dst).toString('utf8');

            return [offset, t];
        }
        // else if (object_type == "ALAR") {

        return [offset, t];
    }





    return () => {
        let [, obj] = parse_object(0);
        return obj;
    }


};

const parse = (data) => {
    return parser(data)();
};

const decompress = () => {
    throw (`implement interface member 'parse_al.js: decompress'`);
};

module.exports = {
    parse,
    decompress
}