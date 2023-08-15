var __TEMPORAL__;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@protobufjs/aspromise/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@protobufjs/aspromise/index.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";

module.exports = asPromise;

/**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */

/**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */
function asPromise(fn, ctx/*, varargs */) {
    var params  = new Array(arguments.length - 1),
        offset  = 0,
        index   = 2,
        pending = true;
    while (index < arguments.length)
        params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err/*, varargs */) {
            if (pending) {
                pending = false;
                if (err)
                    reject(err);
                else {
                    var params = new Array(arguments.length - 1),
                        offset = 0;
                    while (offset < params.length)
                        params[offset++] = arguments[offset];
                    resolve.apply(null, params);
                }
            }
        };
        try {
            fn.apply(ctx || null, params);
        } catch (err) {
            if (pending) {
                pending = false;
                reject(err);
            }
        }
    });
}


/***/ }),

/***/ "./node_modules/@protobufjs/base64/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@protobufjs/base64/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var base64 = exports;

/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */
base64.length = function length(string) {
    var p = string.length;
    if (!p)
        return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
    return Math.ceil(string.length * 3) / 4 - n;
};

// Base64 encoding table
var b64 = new Array(64);

// Base64 decoding table
var s64 = new Array(123);

// 65..90, 97..122, 48..57, 43, 47
for (var i = 0; i < 64;)
    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */
base64.encode = function encode(buffer, start, end) {
    var parts = null,
        chunk = [];
    var i = 0, // output index
        j = 0, // goto index
        t;     // temporary
    while (start < end) {
        var b = buffer[start++];
        switch (j) {
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1)
            chunk[i++] = 61;
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

var invalidEncoding = "invalid encoding";

/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */
base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, // goto index
        t;     // temporary
    for (var i = 0; i < string.length;) {
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1)
            break;
        if ((c = s64[c]) === undefined)
            throw Error(invalidEncoding);
        switch (j) {
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1)
        throw Error(invalidEncoding);
    return offset - start;
};

/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */
base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};


/***/ }),

/***/ "./node_modules/@protobufjs/codegen/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@protobufjs/codegen/index.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";

module.exports = codegen;

/**
 * Begins generating a function.
 * @memberof util
 * @param {string[]} functionParams Function parameter names
 * @param {string} [functionName] Function name if not anonymous
 * @returns {Codegen} Appender that appends code to the function's body
 */
function codegen(functionParams, functionName) {

    /* istanbul ignore if */
    if (typeof functionParams === "string") {
        functionName = functionParams;
        functionParams = undefined;
    }

    var body = [];

    /**
     * Appends code to the function's body or finishes generation.
     * @typedef Codegen
     * @type {function}
     * @param {string|Object.<string,*>} [formatStringOrScope] Format string or, to finish the function, an object of additional scope variables, if any
     * @param {...*} [formatParams] Format parameters
     * @returns {Codegen|Function} Itself or the generated function if finished
     * @throws {Error} If format parameter counts do not match
     */

    function Codegen(formatStringOrScope) {
        // note that explicit array handling below makes this ~50% faster

        // finish the function
        if (typeof formatStringOrScope !== "string") {
            var source = toString();
            if (codegen.verbose)
                console.log("codegen: " + source); // eslint-disable-line no-console
            source = "return " + source;
            if (formatStringOrScope) {
                var scopeKeys   = Object.keys(formatStringOrScope),
                    scopeParams = new Array(scopeKeys.length + 1),
                    scopeValues = new Array(scopeKeys.length),
                    scopeOffset = 0;
                while (scopeOffset < scopeKeys.length) {
                    scopeParams[scopeOffset] = scopeKeys[scopeOffset];
                    scopeValues[scopeOffset] = formatStringOrScope[scopeKeys[scopeOffset++]];
                }
                scopeParams[scopeOffset] = source;
                return Function.apply(null, scopeParams).apply(null, scopeValues); // eslint-disable-line no-new-func
            }
            return Function(source)(); // eslint-disable-line no-new-func
        }

        // otherwise append to body
        var formatParams = new Array(arguments.length - 1),
            formatOffset = 0;
        while (formatOffset < formatParams.length)
            formatParams[formatOffset] = arguments[++formatOffset];
        formatOffset = 0;
        formatStringOrScope = formatStringOrScope.replace(/%([%dfijs])/g, function replace($0, $1) {
            var value = formatParams[formatOffset++];
            switch ($1) {
                case "d": case "f": return String(Number(value));
                case "i": return String(Math.floor(value));
                case "j": return JSON.stringify(value);
                case "s": return String(value);
            }
            return "%";
        });
        if (formatOffset !== formatParams.length)
            throw Error("parameter count mismatch");
        body.push(formatStringOrScope);
        return Codegen;
    }

    function toString(functionNameOverride) {
        return "function " + (functionNameOverride || functionName || "") + "(" + (functionParams && functionParams.join(",") || "") + "){\n  " + body.join("\n  ") + "\n}";
    }

    Codegen.toString = toString;
    return Codegen;
}

/**
 * Begins generating a function.
 * @memberof util
 * @function codegen
 * @param {string} [functionName] Function name if not anonymous
 * @returns {Codegen} Appender that appends code to the function's body
 * @variation 2
 */

/**
 * When set to `true`, codegen will log generated code to console. Useful for debugging.
 * @name util.codegen.verbose
 * @type {boolean}
 */
codegen.verbose = false;


/***/ }),

/***/ "./node_modules/@protobufjs/eventemitter/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@protobufjs/eventemitter/index.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";

module.exports = EventEmitter;

/**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */
function EventEmitter() {

    /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */
    this._listeners = {};
}

/**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn  : fn,
        ctx : ctx || this
    });
    return this;
};

/**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined)
        this._listeners = {};
    else {
        if (fn === undefined)
            this._listeners[evt] = [];
        else {
            var listeners = this._listeners[evt];
            for (var i = 0; i < listeners.length;)
                if (listeners[i].fn === fn)
                    listeners.splice(i, 1);
                else
                    ++i;
        }
    }
    return this;
};

/**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
        var args = [],
            i = 1;
        for (; i < arguments.length;)
            args.push(arguments[i++]);
        for (i = 0; i < listeners.length;)
            listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
};


/***/ }),

/***/ "./node_modules/@protobufjs/fetch/index.js":
/*!*************************************************!*\
  !*** ./node_modules/@protobufjs/fetch/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = fetch;

var asPromise = __webpack_require__(/*! @protobufjs/aspromise */ "./node_modules/@protobufjs/aspromise/index.js"),
    inquire   = __webpack_require__(/*! @protobufjs/inquire */ "./node_modules/@protobufjs/inquire/index.js");

var fs = inquire("fs");

/**
 * Node-style callback as used by {@link util.fetch}.
 * @typedef FetchCallback
 * @type {function}
 * @param {?Error} error Error, if any, otherwise `null`
 * @param {string} [contents] File contents, if there hasn't been an error
 * @returns {undefined}
 */

/**
 * Options as used by {@link util.fetch}.
 * @typedef FetchOptions
 * @type {Object}
 * @property {boolean} [binary=false] Whether expecting a binary response
 * @property {boolean} [xhr=false] If `true`, forces the use of XMLHttpRequest
 */

/**
 * Fetches the contents of a file.
 * @memberof util
 * @param {string} filename File path or url
 * @param {FetchOptions} options Fetch options
 * @param {FetchCallback} callback Callback function
 * @returns {undefined}
 */
function fetch(filename, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    } else if (!options)
        options = {};

    if (!callback)
        return asPromise(fetch, this, filename, options); // eslint-disable-line no-invalid-this

    // if a node-like filesystem is present, try it first but fall back to XHR if nothing is found.
    if (!options.xhr && fs && fs.readFile)
        return fs.readFile(filename, function fetchReadFileCallback(err, contents) {
            return err && typeof XMLHttpRequest !== "undefined"
                ? fetch.xhr(filename, options, callback)
                : err
                ? callback(err)
                : callback(null, options.binary ? contents : contents.toString("utf8"));
        });

    // use the XHR version otherwise.
    return fetch.xhr(filename, options, callback);
}

/**
 * Fetches the contents of a file.
 * @name util.fetch
 * @function
 * @param {string} path File path or url
 * @param {FetchCallback} callback Callback function
 * @returns {undefined}
 * @variation 2
 */

/**
 * Fetches the contents of a file.
 * @name util.fetch
 * @function
 * @param {string} path File path or url
 * @param {FetchOptions} [options] Fetch options
 * @returns {Promise<string|Uint8Array>} Promise
 * @variation 3
 */

/**/
fetch.xhr = function fetch_xhr(filename, options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange /* works everywhere */ = function fetchOnReadyStateChange() {

        if (xhr.readyState !== 4)
            return undefined;

        // local cors security errors return status 0 / empty string, too. afaik this cannot be
        // reliably distinguished from an actually empty file for security reasons. feel free
        // to send a pull request if you are aware of a solution.
        if (xhr.status !== 0 && xhr.status !== 200)
            return callback(Error("status " + xhr.status));

        // if binary data is expected, make sure that some sort of array is returned, even if
        // ArrayBuffers are not supported. the binary string fallback, however, is unsafe.
        if (options.binary) {
            var buffer = xhr.response;
            if (!buffer) {
                buffer = [];
                for (var i = 0; i < xhr.responseText.length; ++i)
                    buffer.push(xhr.responseText.charCodeAt(i) & 255);
            }
            return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer) : buffer);
        }
        return callback(null, xhr.responseText);
    };

    if (options.binary) {
        // ref: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data#Receiving_binary_data_in_older_browsers
        if ("overrideMimeType" in xhr)
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        xhr.responseType = "arraybuffer";
    }

    xhr.open("GET", filename);
    xhr.send();
};


/***/ }),

/***/ "./node_modules/@protobufjs/float/index.js":
/*!*************************************************!*\
  !*** ./node_modules/@protobufjs/float/index.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


module.exports = factory(factory);

/**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */

/**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

// Factory function for the purpose of node-based testing in modified global environments
function factory(exports) {

    // float: typed array
    if (typeof Float32Array !== "undefined") (function() {

        var f32 = new Float32Array([ -0 ]),
            f8b = new Uint8Array(f32.buffer),
            le  = f8b[3] === 128;

        function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
        }

        function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        /* istanbul ignore next */
        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

        function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
        }

        function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos    ];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
        }

        /* istanbul ignore next */
        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        /* istanbul ignore next */
        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

    // float: ieee754
    })(); else (function() {

        function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0)
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
            else if (isNaN(val))
                writeUint(2143289344, buf, pos);
            else if (val > 3.4028234663852886e+38) // +-Infinity
                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 1.1754943508222875e-38) // denormal
                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
            else {
                var exponent = Math.floor(Math.log(val) / Math.LN2),
                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
        }

        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

        function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos),
                sign = (uint >> 31) * 2 + 1,
                exponent = uint >>> 23 & 255,
                mantissa = uint & 8388607;
            return exponent === 255
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 1.401298464324817e-45 * mantissa
                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }

        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

    })();

    // double: typed array
    if (typeof Float64Array !== "undefined") (function() {

        var f64 = new Float64Array([-0]),
            f8b = new Uint8Array(f64.buffer),
            le  = f8b[7] === 128;

        function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
        }

        function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        /* istanbul ignore next */
        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

        function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
        }

        function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos    ];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
        }

        /* istanbul ignore next */
        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        /* istanbul ignore next */
        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

    // double: ieee754
    })(); else (function() {

        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
            } else if (val > 1.7976931348623157e+308) { // +-Infinity
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
                var mantissa;
                if (val < 2.2250738585072014e-308) { // denormal
                    mantissa = val / 5e-324;
                    writeUint(mantissa >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2);
                    if (exponent === 1024)
                        exponent = 1023;
                    mantissa = val * Math.pow(2, -exponent);
                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
            }
        }

        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0),
                hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1,
                exponent = hi >>> 20 & 2047,
                mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 5e-324 * mantissa
                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }

        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

    })();

    return exports;
}

// uint helpers

function writeUintLE(val, buf, pos) {
    buf[pos    ] =  val        & 255;
    buf[pos + 1] =  val >>> 8  & 255;
    buf[pos + 2] =  val >>> 16 & 255;
    buf[pos + 3] =  val >>> 24;
}

function writeUintBE(val, buf, pos) {
    buf[pos    ] =  val >>> 24;
    buf[pos + 1] =  val >>> 16 & 255;
    buf[pos + 2] =  val >>> 8  & 255;
    buf[pos + 3] =  val        & 255;
}

function readUintLE(buf, pos) {
    return (buf[pos    ]
          | buf[pos + 1] << 8
          | buf[pos + 2] << 16
          | buf[pos + 3] << 24) >>> 0;
}

function readUintBE(buf, pos) {
    return (buf[pos    ] << 24
          | buf[pos + 1] << 16
          | buf[pos + 2] << 8
          | buf[pos + 3]) >>> 0;
}


/***/ }),

/***/ "./node_modules/@protobufjs/inquire/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@protobufjs/inquire/index.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";

module.exports = inquire;

/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */
function inquire(moduleName) {
    try {
        var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
        if (mod && (mod.length || Object.keys(mod).length))
            return mod;
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}


/***/ }),

/***/ "./node_modules/@protobufjs/path/index.js":
/*!************************************************!*\
  !*** ./node_modules/@protobufjs/path/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * A minimal path module to resolve Unix, Windows and URL paths alike.
 * @memberof util
 * @namespace
 */
var path = exports;

var isAbsolute =
/**
 * Tests if the specified path is absolute.
 * @param {string} path Path to test
 * @returns {boolean} `true` if path is absolute
 */
path.isAbsolute = function isAbsolute(path) {
    return /^(?:\/|\w+:)/.test(path);
};

var normalize =
/**
 * Normalizes the specified path.
 * @param {string} path Path to normalize
 * @returns {string} Normalized path
 */
path.normalize = function normalize(path) {
    path = path.replace(/\\/g, "/")
               .replace(/\/{2,}/g, "/");
    var parts    = path.split("/"),
        absolute = isAbsolute(path),
        prefix   = "";
    if (absolute)
        prefix = parts.shift() + "/";
    for (var i = 0; i < parts.length;) {
        if (parts[i] === "..") {
            if (i > 0 && parts[i - 1] !== "..")
                parts.splice(--i, 2);
            else if (absolute)
                parts.splice(i, 1);
            else
                ++i;
        } else if (parts[i] === ".")
            parts.splice(i, 1);
        else
            ++i;
    }
    return prefix + parts.join("/");
};

/**
 * Resolves the specified include path against the specified origin path.
 * @param {string} originPath Path to the origin file
 * @param {string} includePath Include path relative to origin path
 * @param {boolean} [alreadyNormalized=false] `true` if both paths are already known to be normalized
 * @returns {string} Path to the include file
 */
path.resolve = function resolve(originPath, includePath, alreadyNormalized) {
    if (!alreadyNormalized)
        includePath = normalize(includePath);
    if (isAbsolute(includePath))
        return includePath;
    if (!alreadyNormalized)
        originPath = normalize(originPath);
    return (originPath = originPath.replace(/(?:\/|^)[^/]+$/, "")).length ? normalize(originPath + "/" + includePath) : includePath;
};


/***/ }),

/***/ "./node_modules/@protobufjs/pool/index.js":
/*!************************************************!*\
  !*** ./node_modules/@protobufjs/pool/index.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";

module.exports = pool;

/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */

/**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */

/**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */
function pool(alloc, slice, size) {
    var SIZE   = size || 8192;
    var MAX    = SIZE >>> 1;
    var slab   = null;
    var offset = SIZE;
    return function pool_alloc(size) {
        if (size < 1 || size > MAX)
            return alloc(size);
        if (offset + size > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size);
        if (offset & 7) // align to 32 bit
            offset = (offset | 7) + 1;
        return buf;
    };
}


/***/ }),

/***/ "./node_modules/@protobufjs/utf8/index.js":
/*!************************************************!*\
  !*** ./node_modules/@protobufjs/utf8/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var utf8 = exports;

/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
utf8.length = function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
        return "";
    var parts = null,
        chunk = [],
        i = 0, // char offset
        t;     // temporary
    while (start < end) {
        t = buffer[start++];
        if (t < 128)
            chunk[i++] = t;
        else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/activity-options.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/activity-options.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActivityCancellationType = void 0;
const type_helpers_1 = __webpack_require__(/*! ./type-helpers */ "./node_modules/@temporalio/common/lib/type-helpers.js");
// Avoid importing the proto implementation to reduce workflow bundle size
// Copied from coresdk.workflow_commands.ActivityCancellationType
var ActivityCancellationType;
(function (ActivityCancellationType) {
    ActivityCancellationType[ActivityCancellationType["TRY_CANCEL"] = 0] = "TRY_CANCEL";
    ActivityCancellationType[ActivityCancellationType["WAIT_CANCELLATION_COMPLETED"] = 1] = "WAIT_CANCELLATION_COMPLETED";
    ActivityCancellationType[ActivityCancellationType["ABANDON"] = 2] = "ABANDON";
})(ActivityCancellationType = exports.ActivityCancellationType || (exports.ActivityCancellationType = {}));
(0, type_helpers_1.checkExtends)();
(0, type_helpers_1.checkExtends)();


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/converter/data-converter.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/converter/data-converter.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultDataConverter = exports.defaultFailureConverter = void 0;
const failure_converter_1 = __webpack_require__(/*! ./failure-converter */ "./node_modules/@temporalio/common/lib/converter/failure-converter.js");
const payload_converter_1 = __webpack_require__(/*! ./payload-converter */ "./node_modules/@temporalio/common/lib/converter/payload-converter.js");
/**
 * The default {@link FailureConverter} used by the SDK.
 *
 * Error messages and stack traces are serizalized as plain text.
 */
exports.defaultFailureConverter = new failure_converter_1.DefaultFailureConverter();
/**
 * A "loaded" data converter that uses the default set of failure and payload converters.
 */
exports.defaultDataConverter = {
    payloadConverter: payload_converter_1.defaultPayloadConverter,
    failureConverter: exports.defaultFailureConverter,
    payloadCodecs: [],
};


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/converter/failure-converter.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/converter/failure-converter.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultFailureConverter = exports.cutoffStackTrace = void 0;
const failure_1 = __webpack_require__(/*! ../failure */ "./node_modules/@temporalio/common/lib/failure.js");
const type_helpers_1 = __webpack_require__(/*! ../type-helpers */ "./node_modules/@temporalio/common/lib/type-helpers.js");
const payload_converter_1 = __webpack_require__(/*! ./payload-converter */ "./node_modules/@temporalio/common/lib/converter/payload-converter.js");
/**
 * Stack traces will be cutoff when on of these patterns is matched
 */
const CUTOFF_STACK_PATTERNS = [
    /** Activity execution */
    /\s+at Activity\.execute \(.*[\\/]worker[\\/](?:src|lib)[\\/]activity\.[jt]s:\d+:\d+\)/,
    /** Workflow activation */
    /\s+at Activator\.\S+NextHandler \(.*[\\/]workflow[\\/](?:src|lib)[\\/]internals\.[jt]s:\d+:\d+\)/,
    /** Workflow run anything in context */
    /\s+at Script\.runInContext \((?:node:vm|vm\.js):\d+:\d+\)/,
];
/**
 * Cuts out the framework part of a stack trace, leaving only user code entries
 */
function cutoffStackTrace(stack) {
    const lines = (stack ?? '').split(/\r?\n/);
    const acc = Array();
    lineLoop: for (const line of lines) {
        for (const pattern of CUTOFF_STACK_PATTERNS) {
            if (pattern.test(line))
                break lineLoop;
        }
        acc.push(line);
    }
    return acc.join('\n');
}
exports.cutoffStackTrace = cutoffStackTrace;
/**
 * Default, cross-language-compatible Failure converter.
 *
 * By default, it will leave error messages and stack traces as plain text. In order to encrypt them, set
 * `encodeCommonAttributes` to `true` in the constructor options and use a {@link PayloadCodec} that can encrypt /
 * decrypt Payloads in your {@link WorkerOptions.dataConverter | Worker} and
 * {@link ClientOptions.dataConverter | Client options}.
 *
 * @experimental
 */
class DefaultFailureConverter {
    constructor(options) {
        const { encodeCommonAttributes } = options ?? {};
        this.options = {
            encodeCommonAttributes: encodeCommonAttributes ?? false,
        };
    }
    /**
     * Converts a Failure proto message to a JS Error object.
     *
     * Does not set common properties, that is done in {@link failureToError}.
     */
    failureToErrorInner(failure, payloadConverter) {
        if (failure.applicationFailureInfo) {
            return new failure_1.ApplicationFailure(failure.message ?? undefined, failure.applicationFailureInfo.type, Boolean(failure.applicationFailureInfo.nonRetryable), (0, payload_converter_1.arrayFromPayloads)(payloadConverter, failure.applicationFailureInfo.details?.payloads), this.optionalFailureToOptionalError(failure.cause, payloadConverter));
        }
        if (failure.serverFailureInfo) {
            return new failure_1.ServerFailure(failure.message ?? undefined, Boolean(failure.serverFailureInfo.nonRetryable), this.optionalFailureToOptionalError(failure.cause, payloadConverter));
        }
        if (failure.timeoutFailureInfo) {
            return new failure_1.TimeoutFailure(failure.message ?? undefined, (0, payload_converter_1.fromPayloadsAtIndex)(payloadConverter, 0, failure.timeoutFailureInfo.lastHeartbeatDetails?.payloads), failure.timeoutFailureInfo.timeoutType ?? failure_1.TimeoutType.TIMEOUT_TYPE_UNSPECIFIED);
        }
        if (failure.terminatedFailureInfo) {
            return new failure_1.TerminatedFailure(failure.message ?? undefined, this.optionalFailureToOptionalError(failure.cause, payloadConverter));
        }
        if (failure.canceledFailureInfo) {
            return new failure_1.CancelledFailure(failure.message ?? undefined, (0, payload_converter_1.arrayFromPayloads)(payloadConverter, failure.canceledFailureInfo.details?.payloads), this.optionalFailureToOptionalError(failure.cause, payloadConverter));
        }
        if (failure.resetWorkflowFailureInfo) {
            return new failure_1.ApplicationFailure(failure.message ?? undefined, 'ResetWorkflow', false, (0, payload_converter_1.arrayFromPayloads)(payloadConverter, failure.resetWorkflowFailureInfo.lastHeartbeatDetails?.payloads), this.optionalFailureToOptionalError(failure.cause, payloadConverter));
        }
        if (failure.childWorkflowExecutionFailureInfo) {
            const { namespace, workflowType, workflowExecution, retryState } = failure.childWorkflowExecutionFailureInfo;
            if (!(workflowType?.name && workflowExecution)) {
                throw new TypeError('Missing attributes on childWorkflowExecutionFailureInfo');
            }
            return new failure_1.ChildWorkflowFailure(namespace ?? undefined, workflowExecution, workflowType.name, retryState ?? failure_1.RetryState.RETRY_STATE_UNSPECIFIED, this.optionalFailureToOptionalError(failure.cause, payloadConverter));
        }
        if (failure.activityFailureInfo) {
            if (!failure.activityFailureInfo.activityType?.name) {
                throw new TypeError('Missing activityType?.name on activityFailureInfo');
            }
            return new failure_1.ActivityFailure(failure.message ?? undefined, failure.activityFailureInfo.activityType.name, failure.activityFailureInfo.activityId ?? undefined, failure.activityFailureInfo.retryState ?? failure_1.RetryState.RETRY_STATE_UNSPECIFIED, failure.activityFailureInfo.identity ?? undefined, this.optionalFailureToOptionalError(failure.cause, payloadConverter));
        }
        return new failure_1.TemporalFailure(failure.message ?? undefined, this.optionalFailureToOptionalError(failure.cause, payloadConverter));
    }
    failureToError(failure, payloadConverter) {
        if (failure.encodedAttributes) {
            const attrs = payloadConverter.fromPayload(failure.encodedAttributes);
            // Don't apply encodedAttributes unless they conform to an expected schema
            if (typeof attrs === 'object' && attrs !== null) {
                const { message, stack_trace } = attrs;
                // Avoid mutating the argument
                failure = { ...failure };
                if (typeof message === 'string') {
                    failure.message = message;
                }
                if (typeof stack_trace === 'string') {
                    failure.stackTrace = stack_trace;
                }
            }
        }
        const err = this.failureToErrorInner(failure, payloadConverter);
        err.stack = failure.stackTrace ?? '';
        err.failure = failure;
        return err;
    }
    errorToFailure(err, payloadConverter) {
        const failure = this.errorToFailureInner(err, payloadConverter);
        if (this.options.encodeCommonAttributes) {
            const { message, stackTrace } = failure;
            failure.message = 'Encoded failure';
            failure.stackTrace = '';
            failure.encodedAttributes = payloadConverter.toPayload({ message, stack_trace: stackTrace });
        }
        return failure;
    }
    errorToFailureInner(err, payloadConverter) {
        if (err instanceof failure_1.TemporalFailure) {
            if (err.failure)
                return err.failure;
            const base = {
                message: err.message,
                stackTrace: cutoffStackTrace(err.stack),
                cause: this.optionalErrorToOptionalFailure(err.cause, payloadConverter),
                source: failure_1.FAILURE_SOURCE,
            };
            if (err instanceof failure_1.ActivityFailure) {
                return {
                    ...base,
                    activityFailureInfo: {
                        ...err,
                        activityType: { name: err.activityType },
                    },
                };
            }
            if (err instanceof failure_1.ChildWorkflowFailure) {
                return {
                    ...base,
                    childWorkflowExecutionFailureInfo: {
                        ...err,
                        workflowExecution: err.execution,
                        workflowType: { name: err.workflowType },
                    },
                };
            }
            if (err instanceof failure_1.ApplicationFailure) {
                return {
                    ...base,
                    applicationFailureInfo: {
                        type: err.type,
                        nonRetryable: err.nonRetryable,
                        details: err.details && err.details.length
                            ? { payloads: (0, payload_converter_1.toPayloads)(payloadConverter, ...err.details) }
                            : undefined,
                    },
                };
            }
            if (err instanceof failure_1.CancelledFailure) {
                return {
                    ...base,
                    canceledFailureInfo: {
                        details: err.details && err.details.length
                            ? { payloads: (0, payload_converter_1.toPayloads)(payloadConverter, ...err.details) }
                            : undefined,
                    },
                };
            }
            if (err instanceof failure_1.TimeoutFailure) {
                return {
                    ...base,
                    timeoutFailureInfo: {
                        timeoutType: err.timeoutType,
                        lastHeartbeatDetails: err.lastHeartbeatDetails
                            ? { payloads: (0, payload_converter_1.toPayloads)(payloadConverter, err.lastHeartbeatDetails) }
                            : undefined,
                    },
                };
            }
            if (err instanceof failure_1.ServerFailure) {
                return {
                    ...base,
                    serverFailureInfo: { nonRetryable: err.nonRetryable },
                };
            }
            if (err instanceof failure_1.TerminatedFailure) {
                return {
                    ...base,
                    terminatedFailureInfo: {},
                };
            }
            // Just a TemporalFailure
            return base;
        }
        const base = {
            source: failure_1.FAILURE_SOURCE,
        };
        if ((0, type_helpers_1.isError)(err)) {
            return {
                ...base,
                message: String(err.message) ?? '',
                stackTrace: cutoffStackTrace(err.stack),
                cause: this.optionalErrorToOptionalFailure(err.cause, payloadConverter),
            };
        }
        const recommendation = ` [A non-Error value was thrown from your code. We recommend throwing Error objects so that we can provide a stack trace]`;
        if (typeof err === 'string') {
            return { ...base, message: err + recommendation };
        }
        if (typeof err === 'object') {
            let message = '';
            try {
                message = JSON.stringify(err);
            }
            catch (_err) {
                message = String(err);
            }
            return { ...base, message: message + recommendation };
        }
        return { ...base, message: String(err) + recommendation };
    }
    /**
     * Converts a Failure proto message to a JS Error object if defined or returns undefined.
     */
    optionalFailureToOptionalError(failure, payloadConverter) {
        return failure ? this.failureToError(failure, payloadConverter) : undefined;
    }
    /**
     * Converts an error to a Failure proto message if defined or returns undefined
     */
    optionalErrorToOptionalFailure(err, payloadConverter) {
        return err ? this.errorToFailure(err, payloadConverter) : undefined;
    }
}
exports.DefaultFailureConverter = DefaultFailureConverter;


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/converter/payload-codec.js":
/*!************************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/converter/payload-codec.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/converter/payload-converter.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/converter/payload-converter.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultPayloadConverter = exports.DefaultPayloadConverter = exports.searchAttributePayloadConverter = exports.SearchAttributePayloadConverter = exports.JsonPayloadConverter = exports.BinaryPayloadConverter = exports.UndefinedPayloadConverter = exports.CompositePayloadConverter = exports.mapFromPayloads = exports.arrayFromPayloads = exports.fromPayloadsAtIndex = exports.mapToPayloads = exports.toPayloads = void 0;
const encoding_1 = __webpack_require__(/*! ../encoding */ "./node_modules/@temporalio/common/lib/encoding.js");
const errors_1 = __webpack_require__(/*! ../errors */ "./node_modules/@temporalio/common/lib/errors.js");
const types_1 = __webpack_require__(/*! ./types */ "./node_modules/@temporalio/common/lib/converter/types.js");
/**
 * Implements conversion of a list of values.
 *
 * @param converter
 * @param values JS values to convert to Payloads
 * @return list of {@link Payload}s
 * @throws {@link ValueError} if conversion of the value passed as parameter failed for any
 *     reason.
 */
function toPayloads(converter, ...values) {
    if (values.length === 0) {
        return undefined;
    }
    return values.map((value) => converter.toPayload(value));
}
exports.toPayloads = toPayloads;
/**
 * Run {@link PayloadConverter.toPayload} on each value in the map.
 *
 * @throws {@link ValueError} if conversion of any value in the map fails
 */
function mapToPayloads(converter, map) {
    return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, converter.toPayload(v)]));
}
exports.mapToPayloads = mapToPayloads;
/**
 * Implements conversion of an array of values of different types. Useful for deserializing
 * arguments of function invocations.
 *
 * @param converter
 * @param index index of the value in the payloads
 * @param payloads serialized value to convert to JS values.
 * @return converted JS value
 * @throws {@link PayloadConverterError} if conversion of the data passed as parameter failed for any
 *     reason.
 */
function fromPayloadsAtIndex(converter, index, payloads) {
    // To make adding arguments a backwards compatible change
    if (payloads === undefined || payloads === null || index >= payloads.length) {
        return undefined;
    }
    return converter.fromPayload(payloads[index]);
}
exports.fromPayloadsAtIndex = fromPayloadsAtIndex;
/**
 * Run {@link PayloadConverter.fromPayload} on each value in the array.
 */
function arrayFromPayloads(converter, payloads) {
    if (!payloads) {
        return [];
    }
    return payloads.map((payload) => converter.fromPayload(payload));
}
exports.arrayFromPayloads = arrayFromPayloads;
function mapFromPayloads(converter, map) {
    if (map == null)
        return map;
    return Object.fromEntries(Object.entries(map).map(([k, payload]) => {
        const value = converter.fromPayload(payload);
        return [k, value];
    }));
}
exports.mapFromPayloads = mapFromPayloads;
/**
 * Tries to convert values to {@link Payload}s using the {@link PayloadConverterWithEncoding}s provided to the constructor, in the order provided.
 *
 * Converts Payloads to values based on the `Payload.metadata.encoding` field, which matches the {@link PayloadConverterWithEncoding.encodingType}
 * of the converter that created the Payload.
 */
class CompositePayloadConverter {
    constructor(...converters) {
        this.converterByEncoding = new Map();
        if (converters.length === 0) {
            throw new errors_1.PayloadConverterError('Must provide at least one PayloadConverterWithEncoding');
        }
        this.converters = converters;
        for (const converter of converters) {
            this.converterByEncoding.set(converter.encodingType, converter);
        }
    }
    /**
     * Tries to run `.toPayload(value)` on each converter in the order provided at construction.
     * Returns the first successful result, throws {@link ValueError} if there is no converter that can handle the value.
     */
    toPayload(value) {
        for (const converter of this.converters) {
            const result = converter.toPayload(value);
            if (result !== undefined) {
                return result;
            }
        }
        throw new errors_1.ValueError(`Unable to convert ${value} to payload`);
    }
    /**
     * Run {@link PayloadConverterWithEncoding.fromPayload} based on the `encoding` metadata of the {@link Payload}.
     */
    fromPayload(payload) {
        if (payload.metadata === undefined || payload.metadata === null) {
            throw new errors_1.ValueError('Missing payload metadata');
        }
        const encoding = (0, encoding_1.decode)(payload.metadata[types_1.METADATA_ENCODING_KEY]);
        const converter = this.converterByEncoding.get(encoding);
        if (converter === undefined) {
            throw new errors_1.ValueError(`Unknown encoding: ${encoding}`);
        }
        return converter.fromPayload(payload);
    }
}
exports.CompositePayloadConverter = CompositePayloadConverter;
/**
 * Converts between JS undefined and NULL Payload
 */
class UndefinedPayloadConverter {
    constructor() {
        this.encodingType = types_1.encodingTypes.METADATA_ENCODING_NULL;
    }
    toPayload(value) {
        if (value !== undefined) {
            return undefined;
        }
        return {
            metadata: {
                [types_1.METADATA_ENCODING_KEY]: types_1.encodingKeys.METADATA_ENCODING_NULL,
            },
        };
    }
    fromPayload(_content) {
        return undefined; // Just return undefined
    }
}
exports.UndefinedPayloadConverter = UndefinedPayloadConverter;
/**
 * Converts between binary data types and RAW Payload
 */
class BinaryPayloadConverter {
    constructor() {
        this.encodingType = types_1.encodingTypes.METADATA_ENCODING_RAW;
    }
    toPayload(value) {
        if (!(value instanceof Uint8Array)) {
            return undefined;
        }
        return {
            metadata: {
                [types_1.METADATA_ENCODING_KEY]: types_1.encodingKeys.METADATA_ENCODING_RAW,
            },
            data: value,
        };
    }
    fromPayload(content) {
        return (
        // Wrap with Uint8Array from this context to ensure `instanceof` works
        (content.data ? new Uint8Array(content.data.buffer, content.data.byteOffset, content.data.length) : content.data));
    }
}
exports.BinaryPayloadConverter = BinaryPayloadConverter;
/**
 * Converts between non-undefined values and serialized JSON Payload
 */
class JsonPayloadConverter {
    constructor() {
        this.encodingType = types_1.encodingTypes.METADATA_ENCODING_JSON;
    }
    toPayload(value) {
        if (value === undefined) {
            return undefined;
        }
        let json;
        try {
            json = JSON.stringify(value);
        }
        catch (err) {
            return undefined;
        }
        return {
            metadata: {
                [types_1.METADATA_ENCODING_KEY]: types_1.encodingKeys.METADATA_ENCODING_JSON,
            },
            data: (0, encoding_1.encode)(json),
        };
    }
    fromPayload(content) {
        if (content.data === undefined || content.data === null) {
            throw new errors_1.ValueError('Got payload with no data');
        }
        return JSON.parse((0, encoding_1.decode)(content.data));
    }
}
exports.JsonPayloadConverter = JsonPayloadConverter;
/**
 * Converts Search Attribute values using JsonPayloadConverter
 */
class SearchAttributePayloadConverter {
    constructor() {
        this.jsonConverter = new JsonPayloadConverter();
        this.validNonDateTypes = ['string', 'number', 'boolean'];
    }
    toPayload(values) {
        if (!Array.isArray(values)) {
            throw new errors_1.ValueError(`SearchAttribute value must be an array`);
        }
        if (values.length > 0) {
            const firstValue = values[0];
            const firstType = typeof firstValue;
            if (firstType === 'object') {
                for (const idx in values) {
                    const value = values[idx];
                    if (!(value instanceof Date)) {
                        throw new errors_1.ValueError(`SearchAttribute values must arrays of strings, numbers, booleans, or Dates. The value ${value} at index ${idx} is of type ${typeof value}`);
                    }
                }
            }
            else {
                if (!this.validNonDateTypes.includes(firstType)) {
                    throw new errors_1.ValueError(`SearchAttribute array values must be: string | number | boolean | Date`);
                }
                for (const idx in values) {
                    const value = values[idx];
                    if (typeof value !== firstType) {
                        throw new errors_1.ValueError(`All SearchAttribute array values must be of the same type. The first value ${firstValue} of type ${firstType} doesn't match value ${value} of type ${typeof value} at index ${idx}`);
                    }
                }
            }
        }
        // JSON.stringify takes care of converting Dates to ISO strings
        const ret = this.jsonConverter.toPayload(values);
        if (ret === undefined) {
            throw new errors_1.ValueError('Could not convert search attributes to payloads');
        }
        return ret;
    }
    /**
     * Datetime Search Attribute values are converted to `Date`s
     */
    fromPayload(payload) {
        if (payload.metadata === undefined || payload.metadata === null) {
            throw new errors_1.ValueError('Missing payload metadata');
        }
        const value = this.jsonConverter.fromPayload(payload);
        let arrayWrappedValue = Array.isArray(value) ? value : [value];
        const searchAttributeType = (0, encoding_1.decode)(payload.metadata.type);
        if (searchAttributeType === 'Datetime') {
            arrayWrappedValue = arrayWrappedValue.map((dateString) => new Date(dateString));
        }
        return arrayWrappedValue;
    }
}
exports.SearchAttributePayloadConverter = SearchAttributePayloadConverter;
exports.searchAttributePayloadConverter = new SearchAttributePayloadConverter();
class DefaultPayloadConverter extends CompositePayloadConverter {
    // Match the order used in other SDKs, but exclude Protobuf converters so that the code, including
    // `proto3-json-serializer`, doesn't take space in Workflow bundles that don't use Protobufs. To use Protobufs, use
    // {@link DefaultPayloadConverterWithProtobufs}.
    //
    // Go SDK:
    // https://github.com/temporalio/sdk-go/blob/5e5645f0c550dcf717c095ae32c76a7087d2e985/converter/default_data_converter.go#L28
    constructor() {
        super(new UndefinedPayloadConverter(), new BinaryPayloadConverter(), new JsonPayloadConverter());
    }
}
exports.DefaultPayloadConverter = DefaultPayloadConverter;
/**
 * The default {@link PayloadConverter} used by the SDK. Supports `Uint8Array` and JSON serializables (so if
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | `JSON.stringify(yourArgOrRetval)`}
 * works, the default payload converter will work).
 *
 * To also support Protobufs, create a custom payload converter with {@link DefaultPayloadConverter}:
 *
 * `const myConverter = new DefaultPayloadConverter({ protobufRoot })`
 */
exports.defaultPayloadConverter = new DefaultPayloadConverter();


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/converter/types.js":
/*!****************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/converter/types.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.METADATA_MESSAGE_TYPE_KEY = exports.encodingKeys = exports.encodingTypes = exports.METADATA_ENCODING_KEY = void 0;
const encoding_1 = __webpack_require__(/*! ../encoding */ "./node_modules/@temporalio/common/lib/encoding.js");
exports.METADATA_ENCODING_KEY = 'encoding';
exports.encodingTypes = {
    METADATA_ENCODING_NULL: 'binary/null',
    METADATA_ENCODING_RAW: 'binary/plain',
    METADATA_ENCODING_JSON: 'json/plain',
    METADATA_ENCODING_PROTOBUF_JSON: 'json/protobuf',
    METADATA_ENCODING_PROTOBUF: 'binary/protobuf',
};
exports.encodingKeys = {
    METADATA_ENCODING_NULL: (0, encoding_1.encode)(exports.encodingTypes.METADATA_ENCODING_NULL),
    METADATA_ENCODING_RAW: (0, encoding_1.encode)(exports.encodingTypes.METADATA_ENCODING_RAW),
    METADATA_ENCODING_JSON: (0, encoding_1.encode)(exports.encodingTypes.METADATA_ENCODING_JSON),
    METADATA_ENCODING_PROTOBUF_JSON: (0, encoding_1.encode)(exports.encodingTypes.METADATA_ENCODING_PROTOBUF_JSON),
    METADATA_ENCODING_PROTOBUF: (0, encoding_1.encode)(exports.encodingTypes.METADATA_ENCODING_PROTOBUF),
};
exports.METADATA_MESSAGE_TYPE_KEY = 'messageType';


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/deprecated-time.js":
/*!****************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/deprecated-time.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.optionalTsToDate = exports.tsToDate = exports.msToNumber = exports.msOptionalToNumber = exports.msOptionalToTs = exports.msToTs = exports.msNumberToTs = exports.tsToMs = exports.optionalTsToMs = void 0;
const time = __importStar(__webpack_require__(/*! ./time */ "./node_modules/@temporalio/common/lib/time.js"));
/**
 * Lossy conversion function from Timestamp to number due to possible overflow.
 * If ts is null or undefined returns undefined.
 *
 * @hidden
 * @deprecated - meant for internal use only
 */
function optionalTsToMs(ts) {
    return time.optionalTsToMs(ts);
}
exports.optionalTsToMs = optionalTsToMs;
/**
 * Lossy conversion function from Timestamp to number due to possible overflow
 *
 * @hidden
 * @deprecated - meant for internal use only
 * @deprecated - meant for internal use only
 */
function tsToMs(ts) {
    return time.tsToMs(ts);
}
exports.tsToMs = tsToMs;
/**
 * @hidden
 * @deprecated - meant for internal use only
 */
function msNumberToTs(millis) {
    return time.msNumberToTs(millis);
}
exports.msNumberToTs = msNumberToTs;
/**
 * @hidden
 * @deprecated - meant for internal use only
 */
function msToTs(str) {
    return time.msToTs(str);
}
exports.msToTs = msToTs;
/**
 * @hidden
 * @deprecated - meant for internal use only
 */
function msOptionalToTs(str) {
    return time.msOptionalToTs(str);
}
exports.msOptionalToTs = msOptionalToTs;
/**
 * @hidden
 * @deprecated - meant for internal use only
 */
function msOptionalToNumber(val) {
    return time.msOptionalToNumber(val);
}
exports.msOptionalToNumber = msOptionalToNumber;
/**
 * @hidden
 * @deprecated - meant for internal use only
 */
function msToNumber(val) {
    return time.msToNumber(val);
}
exports.msToNumber = msToNumber;
/**
 * @hidden
 * @deprecated - meant for internal use only
 */
function tsToDate(ts) {
    return time.tsToDate(ts);
}
exports.tsToDate = tsToDate;
/**
 * @hidden
 * @deprecated - meant for internal use only
 */
function optionalTsToDate(ts) {
    return time.optionalTsToDate(ts);
}
exports.optionalTsToDate = optionalTsToDate;


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/encoding.js":
/*!*********************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/encoding.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Pasted with modifications from: https://raw.githubusercontent.com/anonyco/FastestSmallestTextEncoderDecoder/master/EncoderDecoderTogether.src.js
/* eslint no-fallthrough: 0 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decode = exports.encode = exports.TextEncoder = exports.TextDecoder = void 0;
const fromCharCode = String.fromCharCode;
const encoderRegexp = /[\x80-\uD7ff\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g;
const tmpBufferU16 = new Uint16Array(32);
class TextDecoder {
    decode(inputArrayOrBuffer) {
        const inputAs8 = inputArrayOrBuffer instanceof Uint8Array ? inputArrayOrBuffer : new Uint8Array(inputArrayOrBuffer);
        let resultingString = '', tmpStr = '', index = 0, nextEnd = 0, cp0 = 0, codePoint = 0, minBits = 0, cp1 = 0, pos = 0, tmp = -1;
        const len = inputAs8.length | 0;
        const lenMinus32 = (len - 32) | 0;
        // Note that tmp represents the 2nd half of a surrogate pair incase a surrogate gets divided between blocks
        for (; index < len;) {
            nextEnd = index <= lenMinus32 ? 32 : (len - index) | 0;
            for (; pos < nextEnd; index = (index + 1) | 0, pos = (pos + 1) | 0) {
                cp0 = inputAs8[index] & 0xff;
                switch (cp0 >> 4) {
                    case 15:
                        cp1 = inputAs8[(index = (index + 1) | 0)] & 0xff;
                        if (cp1 >> 6 !== 0b10 || 0b11110111 < cp0) {
                            index = (index - 1) | 0;
                            break;
                        }
                        codePoint = ((cp0 & 0b111) << 6) | (cp1 & 0b00111111);
                        minBits = 5; // 20 ensures it never passes -> all invalid replacements
                        cp0 = 0x100; //  keep track of th bit size
                    case 14:
                        cp1 = inputAs8[(index = (index + 1) | 0)] & 0xff;
                        codePoint <<= 6;
                        codePoint |= ((cp0 & 0b1111) << 6) | (cp1 & 0b00111111);
                        minBits = cp1 >> 6 === 0b10 ? (minBits + 4) | 0 : 24; // 24 ensures it never passes -> all invalid replacements
                        cp0 = (cp0 + 0x100) & 0x300; // keep track of th bit size
                    case 13:
                    case 12:
                        cp1 = inputAs8[(index = (index + 1) | 0)] & 0xff;
                        codePoint <<= 6;
                        codePoint |= ((cp0 & 0b11111) << 6) | (cp1 & 0b00111111);
                        minBits = (minBits + 7) | 0;
                        // Now, process the code point
                        if (index < len && cp1 >> 6 === 0b10 && codePoint >> minBits && codePoint < 0x110000) {
                            cp0 = codePoint;
                            codePoint = (codePoint - 0x10000) | 0;
                            if (0 <= codePoint /*0xffff < codePoint*/) {
                                // BMP code point
                                //nextEnd = nextEnd - 1|0;
                                tmp = ((codePoint >> 10) + 0xd800) | 0; // highSurrogate
                                cp0 = ((codePoint & 0x3ff) + 0xdc00) | 0; // lowSurrogate (will be inserted later in the switch-statement)
                                if (pos < 31) {
                                    // notice 31 instead of 32
                                    tmpBufferU16[pos] = tmp;
                                    pos = (pos + 1) | 0;
                                    tmp = -1;
                                }
                                else {
                                    // else, we are at the end of the inputAs8 and let tmp0 be filled in later on
                                    // NOTE that cp1 is being used as a temporary variable for the swapping of tmp with cp0
                                    cp1 = tmp;
                                    tmp = cp0;
                                    cp0 = cp1;
                                }
                            }
                            else
                                nextEnd = (nextEnd + 1) | 0; // because we are advancing i without advancing pos
                        }
                        else {
                            // invalid code point means replacing the whole thing with null replacement characters
                            cp0 >>= 8;
                            index = (index - cp0 - 1) | 0; // reset index  back to what it was before
                            cp0 = 0xfffd;
                        }
                        // Finally, reset the variables for the next go-around
                        minBits = 0;
                        codePoint = 0;
                        nextEnd = index <= lenMinus32 ? 32 : (len - index) | 0;
                    /*case 11:
                  case 10:
                  case 9:
                  case 8:
                    codePoint ? codePoint = 0 : cp0 = 0xfffd; // fill with invalid replacement character
                  case 7:
                  case 6:
                  case 5:
                  case 4:
                  case 3:
                  case 2:
                  case 1:
                  case 0:
                    tmpBufferU16[pos] = cp0;
                    continue;*/
                    default: // fill with invalid replacement character
                        tmpBufferU16[pos] = cp0;
                        continue;
                    case 11:
                    case 10:
                    case 9:
                    case 8:
                }
                tmpBufferU16[pos] = 0xfffd; // fill with invalid replacement character
            }
            tmpStr += fromCharCode(tmpBufferU16[0], tmpBufferU16[1], tmpBufferU16[2], tmpBufferU16[3], tmpBufferU16[4], tmpBufferU16[5], tmpBufferU16[6], tmpBufferU16[7], tmpBufferU16[8], tmpBufferU16[9], tmpBufferU16[10], tmpBufferU16[11], tmpBufferU16[12], tmpBufferU16[13], tmpBufferU16[14], tmpBufferU16[15], tmpBufferU16[16], tmpBufferU16[17], tmpBufferU16[18], tmpBufferU16[19], tmpBufferU16[20], tmpBufferU16[21], tmpBufferU16[22], tmpBufferU16[23], tmpBufferU16[24], tmpBufferU16[25], tmpBufferU16[26], tmpBufferU16[27], tmpBufferU16[28], tmpBufferU16[29], tmpBufferU16[30], tmpBufferU16[31]);
            if (pos < 32)
                tmpStr = tmpStr.slice(0, (pos - 32) | 0); //-(32-pos));
            if (index < len) {
                //fromCharCode.apply(0, tmpBufferU16 : Uint8Array ?  tmpBufferU16.subarray(0,pos) : tmpBufferU16.slice(0,pos));
                tmpBufferU16[0] = tmp;
                pos = ~tmp >>> 31; //tmp !== -1 ? 1 : 0;
                tmp = -1;
                if (tmpStr.length < resultingString.length)
                    continue;
            }
            else if (tmp !== -1) {
                tmpStr += fromCharCode(tmp);
            }
            resultingString += tmpStr;
            tmpStr = '';
        }
        return resultingString;
    }
}
exports.TextDecoder = TextDecoder;
//////////////////////////////////////////////////////////////////////////////////////
function encoderReplacer(nonAsciiChars) {
    // make the UTF string into a binary UTF-8 encoded string
    let point = nonAsciiChars.charCodeAt(0) | 0;
    if (0xd800 <= point) {
        if (point <= 0xdbff) {
            const nextcode = nonAsciiChars.charCodeAt(1) | 0; // defaults to 0 when NaN, causing null replacement character
            if (0xdc00 <= nextcode && nextcode <= 0xdfff) {
                //point = ((point - 0xD800)<<10) + nextcode - 0xDC00 + 0x10000|0;
                point = ((point << 10) + nextcode - 0x35fdc00) | 0;
                if (point > 0xffff)
                    return fromCharCode((0x1e /*0b11110*/ << 3) | (point >> 18), (0x2 /*0b10*/ << 6) | ((point >> 12) & 0x3f) /*0b00111111*/, (0x2 /*0b10*/ << 6) | ((point >> 6) & 0x3f) /*0b00111111*/, (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/);
            }
            else
                point = 65533 /*0b1111111111111101*/; //return '\xEF\xBF\xBD';//fromCharCode(0xef, 0xbf, 0xbd);
        }
        else if (point <= 0xdfff) {
            point = 65533 /*0b1111111111111101*/; //return '\xEF\xBF\xBD';//fromCharCode(0xef, 0xbf, 0xbd);
        }
    }
    /*if (point <= 0x007f) return nonAsciiChars;
    else */ if (point <= 0x07ff) {
        return fromCharCode((0x6 << 5) | (point >> 6), (0x2 << 6) | (point & 0x3f));
    }
    else
        return fromCharCode((0xe /*0b1110*/ << 4) | (point >> 12), (0x2 /*0b10*/ << 6) | ((point >> 6) & 0x3f) /*0b00111111*/, (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/);
}
class TextEncoder {
    encode(inputString) {
        // 0xc0 => 0b11000000; 0xff => 0b11111111; 0xc0-0xff => 0b11xxxxxx
        // 0x80 => 0b10000000; 0xbf => 0b10111111; 0x80-0xbf => 0b10xxxxxx
        const encodedString = inputString === void 0 ? '' : '' + inputString, len = encodedString.length | 0;
        let result = new Uint8Array(((len << 1) + 8) | 0);
        let tmpResult;
        let i = 0, pos = 0, point = 0, nextcode = 0;
        let upgradededArraySize = !Uint8Array; // normal arrays are auto-expanding
        for (i = 0; i < len; i = (i + 1) | 0, pos = (pos + 1) | 0) {
            point = encodedString.charCodeAt(i) | 0;
            if (point <= 0x007f) {
                result[pos] = point;
            }
            else if (point <= 0x07ff) {
                result[pos] = (0x6 << 5) | (point >> 6);
                result[(pos = (pos + 1) | 0)] = (0x2 << 6) | (point & 0x3f);
            }
            else {
                widenCheck: {
                    if (0xd800 <= point) {
                        if (point <= 0xdbff) {
                            nextcode = encodedString.charCodeAt((i = (i + 1) | 0)) | 0; // defaults to 0 when NaN, causing null replacement character
                            if (0xdc00 <= nextcode && nextcode <= 0xdfff) {
                                //point = ((point - 0xD800)<<10) + nextcode - 0xDC00 + 0x10000|0;
                                point = ((point << 10) + nextcode - 0x35fdc00) | 0;
                                if (point > 0xffff) {
                                    result[pos] = (0x1e /*0b11110*/ << 3) | (point >> 18);
                                    result[(pos = (pos + 1) | 0)] = (0x2 /*0b10*/ << 6) | ((point >> 12) & 0x3f) /*0b00111111*/;
                                    result[(pos = (pos + 1) | 0)] = (0x2 /*0b10*/ << 6) | ((point >> 6) & 0x3f) /*0b00111111*/;
                                    result[(pos = (pos + 1) | 0)] = (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/;
                                    continue;
                                }
                                break widenCheck;
                            }
                            point = 65533 /*0b1111111111111101*/; //return '\xEF\xBF\xBD';//fromCharCode(0xef, 0xbf, 0xbd);
                        }
                        else if (point <= 0xdfff) {
                            point = 65533 /*0b1111111111111101*/; //return '\xEF\xBF\xBD';//fromCharCode(0xef, 0xbf, 0xbd);
                        }
                    }
                    if (!upgradededArraySize && i << 1 < pos && i << 1 < ((pos - 7) | 0)) {
                        upgradededArraySize = true;
                        tmpResult = new Uint8Array(len * 3);
                        tmpResult.set(result);
                        result = tmpResult;
                    }
                }
                result[pos] = (0xe /*0b1110*/ << 4) | (point >> 12);
                result[(pos = (pos + 1) | 0)] = (0x2 /*0b10*/ << 6) | ((point >> 6) & 0x3f) /*0b00111111*/;
                result[(pos = (pos + 1) | 0)] = (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/;
            }
        }
        return Uint8Array ? result.subarray(0, pos) : result.slice(0, pos);
    }
    encodeInto(inputString, u8Arr) {
        const encodedString = inputString === void 0 ? '' : ('' + inputString).replace(encoderRegexp, encoderReplacer);
        let len = encodedString.length | 0, i = 0, char = 0, read = 0;
        const u8ArrLen = u8Arr.length | 0;
        const inputLength = inputString.length | 0;
        if (u8ArrLen < len)
            len = u8ArrLen;
        putChars: {
            for (; i < len; i = (i + 1) | 0) {
                char = encodedString.charCodeAt(i) | 0;
                switch (char >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        read = (read + 1) | 0;
                    // extension points:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        break;
                    case 12:
                    case 13:
                        if (((i + 1) | 0) < u8ArrLen) {
                            read = (read + 1) | 0;
                            break;
                        }
                    case 14:
                        if (((i + 2) | 0) < u8ArrLen) {
                            //if (!(char === 0xEF && encodedString.substr(i+1|0,2) === "\xBF\xBD"))
                            read = (read + 1) | 0;
                            break;
                        }
                    case 15:
                        if (((i + 3) | 0) < u8ArrLen) {
                            read = (read + 1) | 0;
                            break;
                        }
                    default:
                        break putChars;
                }
                //read = read + ((char >> 6) !== 2) |0;
                u8Arr[i] = char;
            }
        }
        return { written: i, read: inputLength < read ? inputLength : read };
    }
}
exports.TextEncoder = TextEncoder;
/**
 * Encode a UTF-8 string into a Uint8Array
 */
function encode(s) {
    return TextEncoder.prototype.encode(s);
}
exports.encode = encode;
/**
 * Decode a Uint8Array into a UTF-8 string
 */
function decode(a) {
    return TextDecoder.prototype.decode(a);
}
exports.decode = decode;


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/errors.js":
/*!*******************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/errors.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NamespaceNotFoundError = exports.WorkflowNotFoundError = exports.WorkflowExecutionAlreadyStartedError = exports.IllegalStateError = exports.PayloadConverterError = exports.ValueError = void 0;
const failure_1 = __webpack_require__(/*! ./failure */ "./node_modules/@temporalio/common/lib/failure.js");
const type_helpers_1 = __webpack_require__(/*! ./type-helpers */ "./node_modules/@temporalio/common/lib/type-helpers.js");
/**
 * Thrown from code that receives a value that is unexpected or that it's unable to handle.
 */
let ValueError = class ValueError extends Error {
    constructor(message, cause) {
        super(message ?? undefined);
        this.cause = cause;
    }
};
ValueError = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('ValueError')
], ValueError);
exports.ValueError = ValueError;
/**
 * Thrown when a Payload Converter is misconfigured.
 */
let PayloadConverterError = class PayloadConverterError extends ValueError {
};
PayloadConverterError = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('PayloadConverterError')
], PayloadConverterError);
exports.PayloadConverterError = PayloadConverterError;
/**
 * Used in different parts of the SDK to note that something unexpected has happened.
 */
let IllegalStateError = class IllegalStateError extends Error {
};
IllegalStateError = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('IllegalStateError')
], IllegalStateError);
exports.IllegalStateError = IllegalStateError;
/**
 * This exception is thrown in the following cases:
 *  - Workflow with the same Workflow Id is currently running
 *  - There is a closed Workflow with the same Workflow Id and the {@link WorkflowOptions.workflowIdReusePolicy}
 *    is `WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE`
 *  - There is closed Workflow in the `Completed` state with the same Workflow Id and the {@link WorkflowOptions.workflowIdReusePolicy}
 *    is `WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE_FAILED_ONLY`
 */
let WorkflowExecutionAlreadyStartedError = class WorkflowExecutionAlreadyStartedError extends failure_1.TemporalFailure {
    constructor(message, workflowId, workflowType) {
        super(message);
        this.workflowId = workflowId;
        this.workflowType = workflowType;
    }
};
WorkflowExecutionAlreadyStartedError = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('WorkflowExecutionAlreadyStartedError')
], WorkflowExecutionAlreadyStartedError);
exports.WorkflowExecutionAlreadyStartedError = WorkflowExecutionAlreadyStartedError;
/**
 * Thrown when a Workflow with the given Id is not known to Temporal Server.
 * It could be because:
 * - Id passed is incorrect
 * - Workflow is closed (for some calls, e.g. `terminate`)
 * - Workflow was deleted from the Server after reaching its retention limit
 */
let WorkflowNotFoundError = class WorkflowNotFoundError extends Error {
    constructor(message, workflowId, runId) {
        super(message);
        this.workflowId = workflowId;
        this.runId = runId;
    }
};
WorkflowNotFoundError = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('WorkflowNotFoundError')
], WorkflowNotFoundError);
exports.WorkflowNotFoundError = WorkflowNotFoundError;
/**
 * Thrown when the specified namespace is not known to Temporal Server.
 */
let NamespaceNotFoundError = class NamespaceNotFoundError extends Error {
    constructor(namespace) {
        super(`Namespace not found: '${namespace}'`);
        this.namespace = namespace;
    }
};
NamespaceNotFoundError = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('NamespaceNotFoundError')
], NamespaceNotFoundError);
exports.NamespaceNotFoundError = NamespaceNotFoundError;


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/failure.js":
/*!********************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/failure.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rootCause = exports.ensureTemporalFailure = exports.ensureApplicationFailure = exports.ChildWorkflowFailure = exports.ActivityFailure = exports.TimeoutFailure = exports.TerminatedFailure = exports.CancelledFailure = exports.ApplicationFailure = exports.ServerFailure = exports.TemporalFailure = exports.RetryState = exports.TimeoutType = exports.FAILURE_SOURCE = void 0;
const type_helpers_1 = __webpack_require__(/*! ./type-helpers */ "./node_modules/@temporalio/common/lib/type-helpers.js");
exports.FAILURE_SOURCE = 'TypeScriptSDK';
// Avoid importing the proto implementation to reduce workflow bundle size
// Copied from temporal.api.enums.v1.TimeoutType
var TimeoutType;
(function (TimeoutType) {
    TimeoutType[TimeoutType["TIMEOUT_TYPE_UNSPECIFIED"] = 0] = "TIMEOUT_TYPE_UNSPECIFIED";
    TimeoutType[TimeoutType["TIMEOUT_TYPE_START_TO_CLOSE"] = 1] = "TIMEOUT_TYPE_START_TO_CLOSE";
    TimeoutType[TimeoutType["TIMEOUT_TYPE_SCHEDULE_TO_START"] = 2] = "TIMEOUT_TYPE_SCHEDULE_TO_START";
    TimeoutType[TimeoutType["TIMEOUT_TYPE_SCHEDULE_TO_CLOSE"] = 3] = "TIMEOUT_TYPE_SCHEDULE_TO_CLOSE";
    TimeoutType[TimeoutType["TIMEOUT_TYPE_HEARTBEAT"] = 4] = "TIMEOUT_TYPE_HEARTBEAT";
})(TimeoutType = exports.TimeoutType || (exports.TimeoutType = {}));
(0, type_helpers_1.checkExtends)();
(0, type_helpers_1.checkExtends)();
// Avoid importing the proto implementation to reduce workflow bundle size
// Copied from temporal.api.enums.v1.RetryState
var RetryState;
(function (RetryState) {
    RetryState[RetryState["RETRY_STATE_UNSPECIFIED"] = 0] = "RETRY_STATE_UNSPECIFIED";
    RetryState[RetryState["RETRY_STATE_IN_PROGRESS"] = 1] = "RETRY_STATE_IN_PROGRESS";
    RetryState[RetryState["RETRY_STATE_NON_RETRYABLE_FAILURE"] = 2] = "RETRY_STATE_NON_RETRYABLE_FAILURE";
    RetryState[RetryState["RETRY_STATE_TIMEOUT"] = 3] = "RETRY_STATE_TIMEOUT";
    RetryState[RetryState["RETRY_STATE_MAXIMUM_ATTEMPTS_REACHED"] = 4] = "RETRY_STATE_MAXIMUM_ATTEMPTS_REACHED";
    RetryState[RetryState["RETRY_STATE_RETRY_POLICY_NOT_SET"] = 5] = "RETRY_STATE_RETRY_POLICY_NOT_SET";
    RetryState[RetryState["RETRY_STATE_INTERNAL_SERVER_ERROR"] = 6] = "RETRY_STATE_INTERNAL_SERVER_ERROR";
    RetryState[RetryState["RETRY_STATE_CANCEL_REQUESTED"] = 7] = "RETRY_STATE_CANCEL_REQUESTED";
})(RetryState = exports.RetryState || (exports.RetryState = {}));
(0, type_helpers_1.checkExtends)();
(0, type_helpers_1.checkExtends)();
/**
 * Represents failures that can cross Workflow and Activity boundaries.
 *
 * **Never extend this class or any of its children.**
 *
 * The only child class you should ever throw from your code is {@link ApplicationFailure}.
 */
let TemporalFailure = class TemporalFailure extends Error {
    constructor(message, cause) {
        super(message ?? undefined);
        this.cause = cause;
    }
};
TemporalFailure = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('TemporalFailure')
], TemporalFailure);
exports.TemporalFailure = TemporalFailure;
/** Exceptions originated at the Temporal service. */
let ServerFailure = class ServerFailure extends TemporalFailure {
    constructor(message, nonRetryable, cause) {
        super(message, cause);
        this.nonRetryable = nonRetryable;
    }
};
ServerFailure = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('ServerFailure')
], ServerFailure);
exports.ServerFailure = ServerFailure;
/**
 * `ApplicationFailure`s are used to communicate application-specific failures in Workflows and Activities.
 *
 * The {@link type} property is matched against {@link RetryPolicy.nonRetryableErrorTypes} to determine if an instance
 * of this error is retryable. Another way to avoid retrying is by setting the {@link nonRetryable} flag to `true`.
 *
 * In Workflows, if you throw a non-`ApplicationFailure`, the Workflow Task will fail and be retried. If you throw an
 * `ApplicationFailure`, the Workflow Execution will fail.
 *
 * In Activities, you can either throw an `ApplicationFailure` or another `Error` to fail the Activity Task. In the
 * latter case, the `Error` will be converted to an `ApplicationFailure`. The conversion is done as following:
 *
 * - `type` is set to `error.constructor?.name ?? error.name`
 * - `message` is set to `error.message`
 * - `nonRetryable` is set to false
 * - `details` are set to null
 * - stack trace is copied from the original error
 *
 * When an {@link https://docs.temporal.io/concepts/what-is-an-activity-execution | Activity Execution} fails, the
 * `ApplicationFailure` from the last Activity Task will be the `cause` of the {@link ActivityFailure} thrown in the
 * Workflow.
 */
let ApplicationFailure = class ApplicationFailure extends TemporalFailure {
    /**
     * Alternatively, use {@link fromError} or {@link create}.
     */
    constructor(message, type, nonRetryable, details, cause) {
        super(message, cause);
        this.type = type;
        this.nonRetryable = nonRetryable;
        this.details = details;
    }
    /**
     * Create a new `ApplicationFailure` from an Error object.
     *
     * First calls {@link ensureApplicationFailure | `ensureApplicationFailure(error)`} and then overrides any fields
     * provided in `overrides`.
     */
    static fromError(error, overrides) {
        const failure = ensureApplicationFailure(error);
        Object.assign(failure, overrides);
        return failure;
    }
    /**
     * Create a new `ApplicationFailure`.
     *
     * By default, will be retryable (unless its `type` is included in {@link RetryPolicy.nonRetryableErrorTypes}).
     */
    static create(options) {
        const { message, type, nonRetryable = false, details, cause } = options;
        return new this(message, type, nonRetryable, details, cause);
    }
    /**
     * Get a new `ApplicationFailure` with the {@link nonRetryable} flag set to false. Note that this error will still
     * not be retried if its `type` is included in {@link RetryPolicy.nonRetryableErrorTypes}.
     *
     * @param message Optional error message
     * @param type Optional error type (used by {@link RetryPolicy.nonRetryableErrorTypes})
     * @param details Optional details about the failure. Serialized by the Worker's {@link PayloadConverter}.
     */
    static retryable(message, type, ...details) {
        return new this(message, type ?? 'Error', false, details);
    }
    /**
     * Get a new `ApplicationFailure` with the {@link nonRetryable} flag set to true.
     *
     * When thrown from an Activity or Workflow, the Activity or Workflow will not be retried (even if `type` is not
     * listed in {@link RetryPolicy.nonRetryableErrorTypes}).
     *
     * @param message Optional error message
     * @param type Optional error type
     * @param details Optional details about the failure. Serialized by the Worker's {@link PayloadConverter}.
     */
    static nonRetryable(message, type, ...details) {
        return new this(message, type ?? 'Error', true, details);
    }
};
ApplicationFailure = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('ApplicationFailure')
], ApplicationFailure);
exports.ApplicationFailure = ApplicationFailure;
/**
 * This error is thrown when Cancellation has been requested. To allow Cancellation to happen, let it propagate. To
 * ignore Cancellation, catch it and continue executing. Note that Cancellation can only be requested a single time, so
 * your Workflow/Activity Execution will not receive further Cancellation requests.
 *
 * When a Workflow or Activity has been successfully cancelled, a `CancelledFailure` will be the `cause`.
 */
let CancelledFailure = class CancelledFailure extends TemporalFailure {
    constructor(message, details = [], cause) {
        super(message, cause);
        this.details = details;
    }
};
CancelledFailure = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('CancelledFailure')
], CancelledFailure);
exports.CancelledFailure = CancelledFailure;
/**
 * Used as the `cause` when a Workflow has been terminated
 */
let TerminatedFailure = class TerminatedFailure extends TemporalFailure {
    constructor(message, cause) {
        super(message, cause);
    }
};
TerminatedFailure = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('TerminatedFailure')
], TerminatedFailure);
exports.TerminatedFailure = TerminatedFailure;
/**
 * Used to represent timeouts of Activities and Workflows
 */
let TimeoutFailure = class TimeoutFailure extends TemporalFailure {
    constructor(message, lastHeartbeatDetails, timeoutType) {
        super(message);
        this.lastHeartbeatDetails = lastHeartbeatDetails;
        this.timeoutType = timeoutType;
    }
};
TimeoutFailure = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('TimeoutFailure')
], TimeoutFailure);
exports.TimeoutFailure = TimeoutFailure;
/**
 * Contains information about an Activity failure. Always contains the original reason for the failure as its `cause`.
 * For example, if an Activity timed out, the cause will be a {@link TimeoutFailure}.
 *
 * This exception is expected to be thrown only by the framework code.
 */
let ActivityFailure = class ActivityFailure extends TemporalFailure {
    constructor(message, activityType, activityId, retryState, identity, cause) {
        super(message, cause);
        this.activityType = activityType;
        this.activityId = activityId;
        this.retryState = retryState;
        this.identity = identity;
    }
};
ActivityFailure = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('ActivityFailure')
], ActivityFailure);
exports.ActivityFailure = ActivityFailure;
/**
 * Contains information about a Child Workflow failure. Always contains the reason for the failure as its {@link cause}.
 * For example, if the Child was Terminated, the `cause` is a {@link TerminatedFailure}.
 *
 * This exception is expected to be thrown only by the framework code.
 */
let ChildWorkflowFailure = class ChildWorkflowFailure extends TemporalFailure {
    constructor(namespace, execution, workflowType, retryState, cause) {
        super('Child Workflow execution failed', cause);
        this.namespace = namespace;
        this.execution = execution;
        this.workflowType = workflowType;
        this.retryState = retryState;
    }
};
ChildWorkflowFailure = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('ChildWorkflowFailure')
], ChildWorkflowFailure);
exports.ChildWorkflowFailure = ChildWorkflowFailure;
/**
 * If `error` is already an `ApplicationFailure`, returns `error`.
 *
 * Otherwise, converts `error` into an `ApplicationFailure` with:
 *
 * - `message`: `error.message` or `String(error)`
 * - `type`: `error.constructor.name` or `error.name`
 * - `stack`: `error.stack` or `''`
 */
function ensureApplicationFailure(error) {
    if (error instanceof ApplicationFailure) {
        return error;
    }
    const message = ((0, type_helpers_1.isRecord)(error) && String(error.message)) || String(error);
    const type = ((0, type_helpers_1.isRecord)(error) && (error.constructor?.name ?? error.name)) || undefined;
    const failure = ApplicationFailure.create({ message, type, nonRetryable: false });
    failure.stack = ((0, type_helpers_1.isRecord)(error) && String(error.stack)) || '';
    return failure;
}
exports.ensureApplicationFailure = ensureApplicationFailure;
/**
 * If `err` is an Error it is turned into an `ApplicationFailure`.
 *
 * If `err` was already a `TemporalFailure`, returns the original error.
 *
 * Otherwise returns an `ApplicationFailure` with `String(err)` as the message.
 */
function ensureTemporalFailure(err) {
    if (err instanceof TemporalFailure) {
        return err;
    }
    return ensureApplicationFailure(err);
}
exports.ensureTemporalFailure = ensureTemporalFailure;
/**
 * Get the root cause message of given `error`.
 *
 * In case `error` is a {@link TemporalFailure}, recurse the `cause` chain and return the root `cause.message`.
 * Otherwise, return `error.message`.
 */
function rootCause(error) {
    if (error instanceof TemporalFailure) {
        return error.cause ? rootCause(error.cause) : error.message;
    }
    return (0, type_helpers_1.errorMessage)(error);
}
exports.rootCause = rootCause;


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/index.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Common library for code that's used across the Client, Worker, and/or Workflow
 *
 * @module
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.errorCode = exports.errorMessage = exports.str = exports.u8 = void 0;
const encoding = __importStar(__webpack_require__(/*! ./encoding */ "./node_modules/@temporalio/common/lib/encoding.js"));
const helpers = __importStar(__webpack_require__(/*! ./type-helpers */ "./node_modules/@temporalio/common/lib/type-helpers.js"));
__exportStar(__webpack_require__(/*! ./activity-options */ "./node_modules/@temporalio/common/lib/activity-options.js"), exports);
__exportStar(__webpack_require__(/*! ./converter/data-converter */ "./node_modules/@temporalio/common/lib/converter/data-converter.js"), exports);
__exportStar(__webpack_require__(/*! ./converter/failure-converter */ "./node_modules/@temporalio/common/lib/converter/failure-converter.js"), exports);
__exportStar(__webpack_require__(/*! ./converter/payload-codec */ "./node_modules/@temporalio/common/lib/converter/payload-codec.js"), exports);
__exportStar(__webpack_require__(/*! ./converter/payload-converter */ "./node_modules/@temporalio/common/lib/converter/payload-converter.js"), exports);
__exportStar(__webpack_require__(/*! ./converter/types */ "./node_modules/@temporalio/common/lib/converter/types.js"), exports);
__exportStar(__webpack_require__(/*! ./deprecated-time */ "./node_modules/@temporalio/common/lib/deprecated-time.js"), exports);
__exportStar(__webpack_require__(/*! ./errors */ "./node_modules/@temporalio/common/lib/errors.js"), exports);
__exportStar(__webpack_require__(/*! ./failure */ "./node_modules/@temporalio/common/lib/failure.js"), exports);
__exportStar(__webpack_require__(/*! ./interfaces */ "./node_modules/@temporalio/common/lib/interfaces.js"), exports);
__exportStar(__webpack_require__(/*! ./logger */ "./node_modules/@temporalio/common/lib/logger.js"), exports);
__exportStar(__webpack_require__(/*! ./retry-policy */ "./node_modules/@temporalio/common/lib/retry-policy.js"), exports);
__exportStar(__webpack_require__(/*! ./workflow-handle */ "./node_modules/@temporalio/common/lib/workflow-handle.js"), exports);
__exportStar(__webpack_require__(/*! ./workflow-options */ "./node_modules/@temporalio/common/lib/workflow-options.js"), exports);
__exportStar(__webpack_require__(/*! ./versioning-intent */ "./node_modules/@temporalio/common/lib/versioning-intent.js"), exports);
/**
 * Encode a UTF-8 string into a Uint8Array
 *
 * @hidden
 * @deprecated - meant for internal use only
 */
function u8(s) {
    return encoding.encode(s);
}
exports.u8 = u8;
/**
 * Decode a Uint8Array into a UTF-8 string
 *
 * @hidden
 * @deprecated - meant for internal use only
 */
function str(arr) {
    return encoding.decode(arr);
}
exports.str = str;
/**
 * Get `error.message` (or `undefined` if not present)
 *
 * @hidden
 * @deprecated - meant for internal use only
 */
function errorMessage(error) {
    return helpers.errorMessage(error);
}
exports.errorMessage = errorMessage;
/**
 * Get `error.code` (or `undefined` if not present)
 *
 * @hidden
 * @deprecated - meant for internal use only
 */
function errorCode(error) {
    return helpers.errorCode(error);
}
exports.errorCode = errorCode;


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/interceptors.js":
/*!*************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/interceptors.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.composeInterceptors = void 0;
/**
 * Composes all interceptor methods into a single function
 *
 * @param interceptors a list of interceptors
 * @param method the name of the interceptor method to compose
 * @param next the original function to be executed at the end of the interception chain
 */
// ts-prune-ignore-next (imported via lib/interceptors)
function composeInterceptors(interceptors, method, next) {
    for (let i = interceptors.length - 1; i >= 0; --i) {
        const interceptor = interceptors[i];
        if (interceptor[method] !== undefined) {
            const prev = next;
            // We loose type safety here because Typescript can't deduce that interceptor[method] is a function that returns
            // the same type as Next<I, M>
            next = ((input) => interceptor[method](input, prev));
        }
    }
    return next;
}
exports.composeInterceptors = composeInterceptors;


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/interfaces.js":
/*!***********************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/interfaces.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/logger.js":
/*!*******************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/logger.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/retry-policy.js":
/*!*************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/retry-policy.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decompileRetryPolicy = exports.compileRetryPolicy = void 0;
const errors_1 = __webpack_require__(/*! ./errors */ "./node_modules/@temporalio/common/lib/errors.js");
const time_1 = __webpack_require__(/*! ./time */ "./node_modules/@temporalio/common/lib/time.js");
/**
 * Turn a TS RetryPolicy into a proto compatible RetryPolicy
 */
function compileRetryPolicy(retryPolicy) {
    if (retryPolicy.backoffCoefficient != null && retryPolicy.backoffCoefficient <= 0) {
        throw new errors_1.ValueError('RetryPolicy.backoffCoefficient must be greater than 0');
    }
    if (retryPolicy.maximumAttempts != null) {
        if (retryPolicy.maximumAttempts === Number.POSITIVE_INFINITY) {
            // drop field (Infinity is the default)
            const { maximumAttempts: _, ...without } = retryPolicy;
            retryPolicy = without;
        }
        else if (retryPolicy.maximumAttempts <= 0) {
            throw new errors_1.ValueError('RetryPolicy.maximumAttempts must be a positive integer');
        }
        else if (!Number.isInteger(retryPolicy.maximumAttempts)) {
            throw new errors_1.ValueError('RetryPolicy.maximumAttempts must be an integer');
        }
    }
    const maximumInterval = (0, time_1.msOptionalToNumber)(retryPolicy.maximumInterval);
    const initialInterval = (0, time_1.msToNumber)(retryPolicy.initialInterval ?? 1000);
    if (maximumInterval === 0) {
        throw new errors_1.ValueError('RetryPolicy.maximumInterval cannot be 0');
    }
    if (initialInterval === 0) {
        throw new errors_1.ValueError('RetryPolicy.initialInterval cannot be 0');
    }
    if (maximumInterval != null && maximumInterval < initialInterval) {
        throw new errors_1.ValueError('RetryPolicy.maximumInterval cannot be less than its initialInterval');
    }
    return {
        maximumAttempts: retryPolicy.maximumAttempts,
        initialInterval: (0, time_1.msToTs)(initialInterval),
        maximumInterval: (0, time_1.msOptionalToTs)(maximumInterval),
        backoffCoefficient: retryPolicy.backoffCoefficient,
        nonRetryableErrorTypes: retryPolicy.nonRetryableErrorTypes,
    };
}
exports.compileRetryPolicy = compileRetryPolicy;
/**
 * Turn a proto compatible RetryPolicy into a TS RetryPolicy
 */
function decompileRetryPolicy(retryPolicy) {
    if (!retryPolicy) {
        return undefined;
    }
    return {
        backoffCoefficient: retryPolicy.backoffCoefficient ?? undefined,
        maximumAttempts: retryPolicy.maximumAttempts ?? undefined,
        maximumInterval: (0, time_1.optionalTsToMs)(retryPolicy.maximumInterval),
        initialInterval: (0, time_1.optionalTsToMs)(retryPolicy.initialInterval),
        nonRetryableErrorTypes: retryPolicy.nonRetryableErrorTypes ?? undefined,
    };
}
exports.decompileRetryPolicy = decompileRetryPolicy;


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/time.js":
/*!*****************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/time.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.optionalDateToTs = exports.optionalTsToDate = exports.tsToDate = exports.msToNumber = exports.msOptionalToNumber = exports.msOptionalToTs = exports.msToTs = exports.msNumberToTs = exports.tsToMs = exports.optionalTsToMs = void 0;
// eslint-disable-next-line import/no-named-as-default
const long_1 = __importDefault(__webpack_require__(/*! long */ "./node_modules/long/umd/index.js"));
const ms_1 = __importDefault(__webpack_require__(/*! ms */ "./node_modules/@temporalio/common/node_modules/ms/dist/index.cjs"));
const errors_1 = __webpack_require__(/*! ./errors */ "./node_modules/@temporalio/common/lib/errors.js");
/**
 * Lossy conversion function from Timestamp to number due to possible overflow.
 * If ts is null or undefined returns undefined.
 */
function optionalTsToMs(ts) {
    if (ts === undefined || ts === null) {
        return undefined;
    }
    return tsToMs(ts);
}
exports.optionalTsToMs = optionalTsToMs;
/**
 * Lossy conversion function from Timestamp to number due to possible overflow
 */
function tsToMs(ts) {
    if (ts === undefined || ts === null) {
        throw new Error(`Expected timestamp, got ${ts}`);
    }
    const { seconds, nanos } = ts;
    return (seconds || long_1.default.UZERO)
        .mul(1000)
        .add(Math.floor((nanos || 0) / 1000000))
        .toNumber();
}
exports.tsToMs = tsToMs;
function msNumberToTs(millis) {
    const seconds = Math.floor(millis / 1000);
    const nanos = (millis % 1000) * 1000000;
    if (Number.isNaN(seconds) || Number.isNaN(nanos)) {
        throw new errors_1.ValueError(`Invalid millis ${millis}`);
    }
    return { seconds: long_1.default.fromNumber(seconds), nanos };
}
exports.msNumberToTs = msNumberToTs;
function msToTs(str) {
    return msNumberToTs(msToNumber(str));
}
exports.msToTs = msToTs;
function msOptionalToTs(str) {
    return str ? msToTs(str) : undefined;
}
exports.msOptionalToTs = msOptionalToTs;
function msOptionalToNumber(val) {
    if (val === undefined)
        return undefined;
    return msToNumber(val);
}
exports.msOptionalToNumber = msOptionalToNumber;
function msToNumber(val) {
    if (typeof val === 'number') {
        return val;
    }
    return msWithValidation(val);
}
exports.msToNumber = msToNumber;
function msWithValidation(str) {
    const millis = (0, ms_1.default)(str);
    if (millis == null || isNaN(millis)) {
        throw new TypeError(`Invalid duration string: '${str}'`);
    }
    return millis;
}
function tsToDate(ts) {
    return new Date(tsToMs(ts));
}
exports.tsToDate = tsToDate;
function optionalTsToDate(ts) {
    if (ts === undefined || ts === null) {
        return undefined;
    }
    return new Date(tsToMs(ts));
}
exports.optionalTsToDate = optionalTsToDate;
// ts-prune-ignore-next (imported via schedule-helpers.ts)
function optionalDateToTs(date) {
    if (date === undefined || date === null) {
        return undefined;
    }
    return msToTs(date.getTime());
}
exports.optionalDateToTs = optionalDateToTs;


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/type-helpers.js":
/*!*************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/type-helpers.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymbolBasedInstanceOfError = exports.assertNever = exports.errorCode = exports.errorMessage = exports.isAbortError = exports.isError = exports.hasOwnProperties = exports.hasOwnProperty = exports.isRecord = exports.checkExtends = void 0;
/** Verify that an type _Copy extends _Orig */
function checkExtends() {
    // noop, just type check
}
exports.checkExtends = checkExtends;
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
exports.isRecord = isRecord;
function hasOwnProperty(record, prop) {
    return prop in record;
}
exports.hasOwnProperty = hasOwnProperty;
function hasOwnProperties(record, props) {
    return props.every((prop) => prop in record);
}
exports.hasOwnProperties = hasOwnProperties;
function isError(error) {
    return (isRecord(error) &&
        typeof error.name === 'string' &&
        typeof error.message === 'string' &&
        (error.stack == null || typeof error.stack === 'string'));
}
exports.isError = isError;
function isAbortError(error) {
    return isError(error) && error.name === 'AbortError';
}
exports.isAbortError = isAbortError;
/**
 * Get `error.message` (or `undefined` if not present)
 */
function errorMessage(error) {
    if (isError(error)) {
        return error.message;
    }
    else if (typeof error === 'string') {
        return error;
    }
    return undefined;
}
exports.errorMessage = errorMessage;
function isErrorWithCode(error) {
    return isRecord(error) && typeof error.code === 'string';
}
/**
 * Get `error.code` (or `undefined` if not present)
 */
function errorCode(error) {
    if (isErrorWithCode(error)) {
        return error.code;
    }
    return undefined;
}
exports.errorCode = errorCode;
/**
 * Asserts that some type is the never type
 */
function assertNever(msg, x) {
    throw new TypeError(msg + ': ' + x);
}
exports.assertNever = assertNever;
/**
 * A decorator to be used on error classes. It adds the 'name' property AND provides a custom
 * 'instanceof' handler that works correctly across execution contexts.
 *
 * ### Details ###
 *
 * According to the EcmaScript's spec, the default behavior of JavaScript's `x instanceof Y` operator is to walk up the
 * prototype chain of object 'x', checking if any constructor in that hierarchy is _exactly the same object_ as the
 * constructor function 'Y'.
 *
 * Unfortunately, it happens in various situations that different constructor function objects get created for what
 * appears to be the very same class. This leads to surprising behavior where `instanceof` returns false though it is
 * known that the object is indeed an instance of that class. One particular case where this happens is when constructor
 * 'Y' belongs to a different realm than the constuctor with which 'x' was instantiated. Another case is when two copies
 * of the same library gets loaded in the same realm.
 *
 * In practice, this tends to cause issues when crossing the workflow-sandboxing boundary (since Node's vm module
 * really creates new execution realms), as well as when running tests using Jest (see https://github.com/jestjs/jest/issues/2549
 * for some details on that one).
 *
 * This function injects a custom 'instanceof' handler into the prototype of 'clazz', which is both cross-realm safe and
 * cross-copies-of-the-same-lib safe. It works by adding a special symbol property to the prototype of 'clazz', and then
 * checking for the presence of that symbol.
 */
function SymbolBasedInstanceOfError(markerName) {
    return (clazz) => {
        const marker = Symbol.for(`__temporal_is${markerName}`);
        Object.defineProperty(clazz.prototype, 'name', { value: markerName, enumerable: true });
        Object.defineProperty(clazz.prototype, marker, { value: true, enumerable: false });
        Object.defineProperty(clazz, Symbol.hasInstance, {
            // eslint-disable-next-line object-shorthand
            value: function (error) {
                if (this === clazz) {
                    return isRecord(error) && error[marker] === true;
                }
                else {
                    // 'this' must be a _subclass_ of clazz that doesn't redefined [Symbol.hasInstance], so that it inherited
                    // from clazz's [Symbol.hasInstance]. If we don't handle this particular situation, then
                    // `x instanceof SubclassOfParent` would return true for any instance of 'Parent', which is clearly wrong.
                    //
                    // Ideally, it'd be preferable to avoid this case entirely, by making sure that all subclasses of 'clazz'
                    // redefine [Symbol.hasInstance], but we can't enforce that. We therefore fallback to the default instanceof
                    // behavior (which is NOT cross-realm safe).
                    return this.prototype.isPrototypeOf(error); // eslint-disable-line no-prototype-builtins
                }
            },
        });
    };
}
exports.SymbolBasedInstanceOfError = SymbolBasedInstanceOfError;


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/versioning-intent.js":
/*!******************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/versioning-intent.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/workflow-handle.js":
/*!****************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/workflow-handle.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./node_modules/@temporalio/common/lib/workflow-options.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@temporalio/common/lib/workflow-options.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractWorkflowType = exports.compileWorkflowOptions = exports.WorkflowIdReusePolicy = void 0;
const time_1 = __webpack_require__(/*! ./time */ "./node_modules/@temporalio/common/lib/time.js");
const type_helpers_1 = __webpack_require__(/*! ./type-helpers */ "./node_modules/@temporalio/common/lib/type-helpers.js");
// Avoid importing the proto implementation to reduce workflow bundle size
// Copied from temporal.api.enums.v1.WorkflowIdReusePolicy
/**
 * Concept: {@link https://docs.temporal.io/concepts/what-is-a-workflow-id-reuse-policy/ | Workflow Id Reuse Policy}
 *
 * Whether a Workflow can be started with a Workflow Id of a Closed Workflow.
 *
 * *Note: A Workflow can never be started with a Workflow Id of a Running Workflow.*
 */
var WorkflowIdReusePolicy;
(function (WorkflowIdReusePolicy) {
    /**
     * No need to use this.
     *
     * (If a `WorkflowIdReusePolicy` is set to this, or is not set at all, the default value will be used.)
     */
    WorkflowIdReusePolicy[WorkflowIdReusePolicy["WORKFLOW_ID_REUSE_POLICY_UNSPECIFIED"] = 0] = "WORKFLOW_ID_REUSE_POLICY_UNSPECIFIED";
    /**
     * The Workflow can be started if the previous Workflow is in a Closed state.
     * @default
     */
    WorkflowIdReusePolicy[WorkflowIdReusePolicy["WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE"] = 1] = "WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE";
    /**
     * The Workflow can be started if the previous Workflow is in a Closed state that is not Completed.
     */
    WorkflowIdReusePolicy[WorkflowIdReusePolicy["WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE_FAILED_ONLY"] = 2] = "WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE_FAILED_ONLY";
    /**
     * The Workflow cannot be started.
     */
    WorkflowIdReusePolicy[WorkflowIdReusePolicy["WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE"] = 3] = "WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE";
    /**
     * Terminate the current workflow if one is already running.
     */
    WorkflowIdReusePolicy[WorkflowIdReusePolicy["WORKFLOW_ID_REUSE_POLICY_TERMINATE_IF_RUNNING"] = 4] = "WORKFLOW_ID_REUSE_POLICY_TERMINATE_IF_RUNNING";
})(WorkflowIdReusePolicy = exports.WorkflowIdReusePolicy || (exports.WorkflowIdReusePolicy = {}));
(0, type_helpers_1.checkExtends)();
(0, type_helpers_1.checkExtends)();
function compileWorkflowOptions(options) {
    const { workflowExecutionTimeout, workflowRunTimeout, workflowTaskTimeout, ...rest } = options;
    return {
        ...rest,
        workflowExecutionTimeout: (0, time_1.msOptionalToTs)(workflowExecutionTimeout),
        workflowRunTimeout: (0, time_1.msOptionalToTs)(workflowRunTimeout),
        workflowTaskTimeout: (0, time_1.msOptionalToTs)(workflowTaskTimeout),
    };
}
exports.compileWorkflowOptions = compileWorkflowOptions;
function extractWorkflowType(workflowTypeOrFunc) {
    if (typeof workflowTypeOrFunc === 'string')
        return workflowTypeOrFunc;
    if (typeof workflowTypeOrFunc === 'function') {
        if (workflowTypeOrFunc?.name)
            return workflowTypeOrFunc.name;
        throw new TypeError('Invalid workflow type: the workflow function is anonymous');
    }
    throw new TypeError(`Invalid workflow type: expected either a string or a function, got '${typeof workflowTypeOrFunc}'`);
}
exports.extractWorkflowType = extractWorkflowType;


/***/ }),

/***/ "./node_modules/@temporalio/proto/lib/patch-protobuf-root.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@temporalio/proto/lib/patch-protobuf-root.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.patchProtobufRoot = void 0;
const ROOT_PROPS = [
    'options',
    'parsedOptions',
    'name',
    'parent',
    'resolved',
    'comment',
    'filename',
    'nested',
    '_nestedArray',
];
/**
 * Create a version of `root` with non-nested namespaces to match the generated types.
 * For more information, see:
 * https://github.com/temporalio/sdk-typescript/blob/main/docs/protobuf-libraries.md#current-solution
 * @param root Generated by `pbjs -t json-module -w commonjs -o json-module.js *.proto`
 * @returns A new patched `root`
 */
function patchProtobufRoot(root) {
    return _patchProtobufRoot(root);
}
exports.patchProtobufRoot = patchProtobufRoot;
function _patchProtobufRoot(root, name) {
    const newRoot = new root.constructor(isNamespace(root) ? name : {});
    for (const key in root) {
        newRoot[key] = root[key];
    }
    if (isRecord(root.nested)) {
        for (const typeOrNamespace in root.nested) {
            const value = root.nested[typeOrNamespace];
            if (ROOT_PROPS.includes(typeOrNamespace)) {
                console.log(`patchProtobufRoot warning: overriding property '${typeOrNamespace}' that is used by protobufjs with the '${typeOrNamespace}' protobuf ${isNamespace(value) ? 'namespace' : 'type'}. This may result in protobufjs not working property.`);
            }
            if (isNamespace(value)) {
                newRoot[typeOrNamespace] = _patchProtobufRoot(value, typeOrNamespace);
            }
            else if (isType(value)) {
                newRoot[typeOrNamespace] = value;
            }
        }
    }
    return newRoot;
}
function isType(value) {
    return isRecord(value) && value.constructor.name === 'Type';
}
function isNamespace(value) {
    return isRecord(value) && value.constructor.name === 'Namespace';
}
// Duplicate from type-helpers instead of importing in order to avoid circular dependency
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}


/***/ }),

/***/ "./node_modules/@temporalio/proto/protos/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@temporalio/proto/protos/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./root */ "./node_modules/@temporalio/proto/protos/root.js");


/***/ }),

/***/ "./node_modules/@temporalio/proto/protos/json-module.js":
/*!**************************************************************!*\
  !*** ./node_modules/@temporalio/proto/protos/json-module.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/


var $protobuf = __webpack_require__(/*! protobufjs/light */ "./node_modules/protobufjs/light.js");

var $root = ($protobuf.roots.__temporal || ($protobuf.roots.__temporal = new $protobuf.Root()))
.addJSON({
  coresdk: {
    options: {
      ruby_package: "Temporalio::Bridge::Api::CoreInterface"
    },
    nested: {
      ActivityHeartbeat: {
        fields: {
          taskToken: {
            type: "bytes",
            id: 1
          },
          details: {
            rule: "repeated",
            type: "temporal.api.common.v1.Payload",
            id: 2
          }
        }
      },
      ActivityTaskCompletion: {
        fields: {
          taskToken: {
            type: "bytes",
            id: 1
          },
          result: {
            type: "activity_result.ActivityExecutionResult",
            id: 2
          }
        }
      },
      activity_result: {
        options: {
          ruby_package: "Temporalio::Bridge::Api::ActivityResult"
        },
        nested: {
          ActivityExecutionResult: {
            oneofs: {
              status: {
                oneof: [
                  "completed",
                  "failed",
                  "cancelled",
                  "willCompleteAsync"
                ]
              }
            },
            fields: {
              completed: {
                type: "Success",
                id: 1
              },
              failed: {
                type: "Failure",
                id: 2
              },
              cancelled: {
                type: "Cancellation",
                id: 3
              },
              willCompleteAsync: {
                type: "WillCompleteAsync",
                id: 4
              }
            }
          },
          ActivityResolution: {
            oneofs: {
              status: {
                oneof: [
                  "completed",
                  "failed",
                  "cancelled",
                  "backoff"
                ]
              }
            },
            fields: {
              completed: {
                type: "Success",
                id: 1
              },
              failed: {
                type: "Failure",
                id: 2
              },
              cancelled: {
                type: "Cancellation",
                id: 3
              },
              backoff: {
                type: "DoBackoff",
                id: 4
              }
            }
          },
          Success: {
            fields: {
              result: {
                type: "temporal.api.common.v1.Payload",
                id: 1
              }
            }
          },
          Failure: {
            fields: {
              failure: {
                type: "temporal.api.failure.v1.Failure",
                id: 1
              }
            }
          },
          Cancellation: {
            fields: {
              failure: {
                type: "temporal.api.failure.v1.Failure",
                id: 1
              }
            }
          },
          WillCompleteAsync: {
            fields: {}
          },
          DoBackoff: {
            fields: {
              attempt: {
                type: "uint32",
                id: 1
              },
              backoffDuration: {
                type: "google.protobuf.Duration",
                id: 2
              },
              originalScheduleTime: {
                type: "google.protobuf.Timestamp",
                id: 3
              }
            }
          }
        }
      },
      activity_task: {
        options: {
          ruby_package: "Temporalio::Bridge::Api::ActivityTask"
        },
        nested: {
          ActivityTask: {
            oneofs: {
              variant: {
                oneof: [
                  "start",
                  "cancel"
                ]
              }
            },
            fields: {
              taskToken: {
                type: "bytes",
                id: 1
              },
              start: {
                type: "Start",
                id: 3
              },
              cancel: {
                type: "Cancel",
                id: 4
              }
            }
          },
          Start: {
            fields: {
              workflowNamespace: {
                type: "string",
                id: 1
              },
              workflowType: {
                type: "string",
                id: 2
              },
              workflowExecution: {
                type: "temporal.api.common.v1.WorkflowExecution",
                id: 3
              },
              activityId: {
                type: "string",
                id: 4
              },
              activityType: {
                type: "string",
                id: 5
              },
              headerFields: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 6
              },
              input: {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 7
              },
              heartbeatDetails: {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 8
              },
              scheduledTime: {
                type: "google.protobuf.Timestamp",
                id: 9
              },
              currentAttemptScheduledTime: {
                type: "google.protobuf.Timestamp",
                id: 10
              },
              startedTime: {
                type: "google.protobuf.Timestamp",
                id: 11
              },
              attempt: {
                type: "uint32",
                id: 12
              },
              scheduleToCloseTimeout: {
                type: "google.protobuf.Duration",
                id: 13
              },
              startToCloseTimeout: {
                type: "google.protobuf.Duration",
                id: 14
              },
              heartbeatTimeout: {
                type: "google.protobuf.Duration",
                id: 15
              },
              retryPolicy: {
                type: "temporal.api.common.v1.RetryPolicy",
                id: 16
              },
              isLocal: {
                type: "bool",
                id: 17
              }
            }
          },
          Cancel: {
            fields: {
              reason: {
                type: "ActivityCancelReason",
                id: 1
              }
            }
          },
          ActivityCancelReason: {
            values: {
              NOT_FOUND: 0,
              CANCELLED: 1,
              TIMED_OUT: 2,
              WORKER_SHUTDOWN: 3
            }
          }
        }
      },
      common: {
        options: {
          ruby_package: "Temporalio::Bridge::Api::Common"
        },
        nested: {
          NamespacedWorkflowExecution: {
            fields: {
              namespace: {
                type: "string",
                id: 1
              },
              workflowId: {
                type: "string",
                id: 2
              },
              runId: {
                type: "string",
                id: 3
              }
            }
          },
          VersioningIntent: {
            values: {
              UNSPECIFIED: 0,
              COMPATIBLE: 1,
              DEFAULT: 2
            }
          }
        }
      },
      external_data: {
        options: {
          ruby_package: "Temporalio::Bridge::Api::ExternalData"
        },
        nested: {
          LocalActivityMarkerData: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              attempt: {
                type: "uint32",
                id: 2
              },
              activityId: {
                type: "string",
                id: 3
              },
              activityType: {
                type: "string",
                id: 4
              },
              completeTime: {
                type: "google.protobuf.Timestamp",
                id: 5
              },
              backoff: {
                type: "google.protobuf.Duration",
                id: 6
              },
              originalScheduleTime: {
                type: "google.protobuf.Timestamp",
                id: 7
              }
            }
          },
          PatchedMarkerData: {
            fields: {
              id: {
                type: "string",
                id: 1
              },
              deprecated: {
                type: "bool",
                id: 2
              }
            }
          }
        }
      },
      workflow_activation: {
        options: {
          ruby_package: "Temporalio::Bridge::Api::WorkflowActivation"
        },
        nested: {
          WorkflowActivation: {
            fields: {
              runId: {
                type: "string",
                id: 1
              },
              timestamp: {
                type: "google.protobuf.Timestamp",
                id: 2
              },
              isReplaying: {
                type: "bool",
                id: 3
              },
              historyLength: {
                type: "uint32",
                id: 4
              },
              jobs: {
                rule: "repeated",
                type: "WorkflowActivationJob",
                id: 5
              },
              availableInternalFlags: {
                rule: "repeated",
                type: "uint32",
                id: 6
              },
              historySizeBytes: {
                type: "uint64",
                id: 7
              },
              continueAsNewSuggested: {
                type: "bool",
                id: 8
              }
            }
          },
          WorkflowActivationJob: {
            oneofs: {
              variant: {
                oneof: [
                  "startWorkflow",
                  "fireTimer",
                  "updateRandomSeed",
                  "queryWorkflow",
                  "cancelWorkflow",
                  "signalWorkflow",
                  "resolveActivity",
                  "notifyHasPatch",
                  "resolveChildWorkflowExecutionStart",
                  "resolveChildWorkflowExecution",
                  "resolveSignalExternalWorkflow",
                  "resolveRequestCancelExternalWorkflow",
                  "removeFromCache"
                ]
              }
            },
            fields: {
              startWorkflow: {
                type: "StartWorkflow",
                id: 1
              },
              fireTimer: {
                type: "FireTimer",
                id: 2
              },
              updateRandomSeed: {
                type: "UpdateRandomSeed",
                id: 4
              },
              queryWorkflow: {
                type: "QueryWorkflow",
                id: 5
              },
              cancelWorkflow: {
                type: "CancelWorkflow",
                id: 6
              },
              signalWorkflow: {
                type: "SignalWorkflow",
                id: 7
              },
              resolveActivity: {
                type: "ResolveActivity",
                id: 8
              },
              notifyHasPatch: {
                type: "NotifyHasPatch",
                id: 9
              },
              resolveChildWorkflowExecutionStart: {
                type: "ResolveChildWorkflowExecutionStart",
                id: 10
              },
              resolveChildWorkflowExecution: {
                type: "ResolveChildWorkflowExecution",
                id: 11
              },
              resolveSignalExternalWorkflow: {
                type: "ResolveSignalExternalWorkflow",
                id: 12
              },
              resolveRequestCancelExternalWorkflow: {
                type: "ResolveRequestCancelExternalWorkflow",
                id: 13
              },
              removeFromCache: {
                type: "RemoveFromCache",
                id: 50
              }
            }
          },
          StartWorkflow: {
            fields: {
              workflowType: {
                type: "string",
                id: 1
              },
              workflowId: {
                type: "string",
                id: 2
              },
              "arguments": {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 3
              },
              randomnessSeed: {
                type: "uint64",
                id: 4
              },
              headers: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 5
              },
              identity: {
                type: "string",
                id: 6
              },
              parentWorkflowInfo: {
                type: "common.NamespacedWorkflowExecution",
                id: 7
              },
              workflowExecutionTimeout: {
                type: "google.protobuf.Duration",
                id: 8
              },
              workflowRunTimeout: {
                type: "google.protobuf.Duration",
                id: 9
              },
              workflowTaskTimeout: {
                type: "google.protobuf.Duration",
                id: 10
              },
              continuedFromExecutionRunId: {
                type: "string",
                id: 11
              },
              continuedInitiator: {
                type: "temporal.api.enums.v1.ContinueAsNewInitiator",
                id: 12
              },
              continuedFailure: {
                type: "temporal.api.failure.v1.Failure",
                id: 13
              },
              lastCompletionResult: {
                type: "temporal.api.common.v1.Payloads",
                id: 14
              },
              firstExecutionRunId: {
                type: "string",
                id: 15
              },
              retryPolicy: {
                type: "temporal.api.common.v1.RetryPolicy",
                id: 16
              },
              attempt: {
                type: "int32",
                id: 17
              },
              cronSchedule: {
                type: "string",
                id: 18
              },
              workflowExecutionExpirationTime: {
                type: "google.protobuf.Timestamp",
                id: 19
              },
              cronScheduleToScheduleInterval: {
                type: "google.protobuf.Duration",
                id: 20
              },
              memo: {
                type: "temporal.api.common.v1.Memo",
                id: 21
              },
              searchAttributes: {
                type: "temporal.api.common.v1.SearchAttributes",
                id: 22
              },
              startTime: {
                type: "google.protobuf.Timestamp",
                id: 23
              }
            }
          },
          FireTimer: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              }
            }
          },
          ResolveActivity: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              result: {
                type: "activity_result.ActivityResolution",
                id: 2
              }
            }
          },
          ResolveChildWorkflowExecutionStart: {
            oneofs: {
              status: {
                oneof: [
                  "succeeded",
                  "failed",
                  "cancelled"
                ]
              }
            },
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              succeeded: {
                type: "ResolveChildWorkflowExecutionStartSuccess",
                id: 2
              },
              failed: {
                type: "ResolveChildWorkflowExecutionStartFailure",
                id: 3
              },
              cancelled: {
                type: "ResolveChildWorkflowExecutionStartCancelled",
                id: 4
              }
            }
          },
          ResolveChildWorkflowExecutionStartSuccess: {
            fields: {
              runId: {
                type: "string",
                id: 1
              }
            }
          },
          ResolveChildWorkflowExecutionStartFailure: {
            fields: {
              workflowId: {
                type: "string",
                id: 1
              },
              workflowType: {
                type: "string",
                id: 2
              },
              cause: {
                type: "child_workflow.StartChildWorkflowExecutionFailedCause",
                id: 3
              }
            }
          },
          ResolveChildWorkflowExecutionStartCancelled: {
            fields: {
              failure: {
                type: "temporal.api.failure.v1.Failure",
                id: 1
              }
            }
          },
          ResolveChildWorkflowExecution: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              result: {
                type: "child_workflow.ChildWorkflowResult",
                id: 2
              }
            }
          },
          UpdateRandomSeed: {
            fields: {
              randomnessSeed: {
                type: "uint64",
                id: 1
              }
            }
          },
          QueryWorkflow: {
            fields: {
              queryId: {
                type: "string",
                id: 1
              },
              queryType: {
                type: "string",
                id: 2
              },
              "arguments": {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 3
              },
              headers: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 5
              }
            }
          },
          CancelWorkflow: {
            fields: {
              details: {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 1
              }
            }
          },
          SignalWorkflow: {
            fields: {
              signalName: {
                type: "string",
                id: 1
              },
              input: {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 2
              },
              identity: {
                type: "string",
                id: 3
              },
              headers: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 5
              }
            }
          },
          NotifyHasPatch: {
            fields: {
              patchId: {
                type: "string",
                id: 1
              }
            }
          },
          ResolveSignalExternalWorkflow: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              failure: {
                type: "temporal.api.failure.v1.Failure",
                id: 2
              }
            }
          },
          ResolveRequestCancelExternalWorkflow: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              failure: {
                type: "temporal.api.failure.v1.Failure",
                id: 2
              }
            }
          },
          RemoveFromCache: {
            fields: {
              message: {
                type: "string",
                id: 1
              },
              reason: {
                type: "EvictionReason",
                id: 2
              }
            },
            nested: {
              EvictionReason: {
                values: {
                  UNSPECIFIED: 0,
                  CACHE_FULL: 1,
                  CACHE_MISS: 2,
                  NONDETERMINISM: 3,
                  LANG_FAIL: 4,
                  LANG_REQUESTED: 5,
                  TASK_NOT_FOUND: 6,
                  UNHANDLED_COMMAND: 7,
                  FATAL: 8,
                  PAGINATION_OR_HISTORY_FETCH: 9
                }
              }
            }
          }
        }
      },
      child_workflow: {
        options: {
          ruby_package: "Temporalio::Bridge::Api::ChildWorkflow"
        },
        nested: {
          ChildWorkflowResult: {
            oneofs: {
              status: {
                oneof: [
                  "completed",
                  "failed",
                  "cancelled"
                ]
              }
            },
            fields: {
              completed: {
                type: "Success",
                id: 1
              },
              failed: {
                type: "Failure",
                id: 2
              },
              cancelled: {
                type: "Cancellation",
                id: 3
              }
            }
          },
          Success: {
            fields: {
              result: {
                type: "temporal.api.common.v1.Payload",
                id: 1
              }
            }
          },
          Failure: {
            fields: {
              failure: {
                type: "temporal.api.failure.v1.Failure",
                id: 1
              }
            }
          },
          Cancellation: {
            fields: {
              failure: {
                type: "temporal.api.failure.v1.Failure",
                id: 1
              }
            }
          },
          ParentClosePolicy: {
            values: {
              PARENT_CLOSE_POLICY_UNSPECIFIED: 0,
              PARENT_CLOSE_POLICY_TERMINATE: 1,
              PARENT_CLOSE_POLICY_ABANDON: 2,
              PARENT_CLOSE_POLICY_REQUEST_CANCEL: 3
            }
          },
          StartChildWorkflowExecutionFailedCause: {
            values: {
              START_CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_UNSPECIFIED: 0,
              START_CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_WORKFLOW_ALREADY_EXISTS: 1
            }
          },
          ChildWorkflowCancellationType: {
            values: {
              ABANDON: 0,
              TRY_CANCEL: 1,
              WAIT_CANCELLATION_COMPLETED: 2,
              WAIT_CANCELLATION_REQUESTED: 3
            }
          }
        }
      },
      workflow_commands: {
        options: {
          ruby_package: "Temporalio::Bridge::Api::WorkflowCommands"
        },
        nested: {
          WorkflowCommand: {
            oneofs: {
              variant: {
                oneof: [
                  "startTimer",
                  "scheduleActivity",
                  "respondToQuery",
                  "requestCancelActivity",
                  "cancelTimer",
                  "completeWorkflowExecution",
                  "failWorkflowExecution",
                  "continueAsNewWorkflowExecution",
                  "cancelWorkflowExecution",
                  "setPatchMarker",
                  "startChildWorkflowExecution",
                  "cancelChildWorkflowExecution",
                  "requestCancelExternalWorkflowExecution",
                  "signalExternalWorkflowExecution",
                  "cancelSignalWorkflow",
                  "scheduleLocalActivity",
                  "requestCancelLocalActivity",
                  "upsertWorkflowSearchAttributes",
                  "modifyWorkflowProperties"
                ]
              }
            },
            fields: {
              startTimer: {
                type: "StartTimer",
                id: 1
              },
              scheduleActivity: {
                type: "ScheduleActivity",
                id: 2
              },
              respondToQuery: {
                type: "QueryResult",
                id: 3
              },
              requestCancelActivity: {
                type: "RequestCancelActivity",
                id: 4
              },
              cancelTimer: {
                type: "CancelTimer",
                id: 5
              },
              completeWorkflowExecution: {
                type: "CompleteWorkflowExecution",
                id: 6
              },
              failWorkflowExecution: {
                type: "FailWorkflowExecution",
                id: 7
              },
              continueAsNewWorkflowExecution: {
                type: "ContinueAsNewWorkflowExecution",
                id: 8
              },
              cancelWorkflowExecution: {
                type: "CancelWorkflowExecution",
                id: 9
              },
              setPatchMarker: {
                type: "SetPatchMarker",
                id: 10
              },
              startChildWorkflowExecution: {
                type: "StartChildWorkflowExecution",
                id: 11
              },
              cancelChildWorkflowExecution: {
                type: "CancelChildWorkflowExecution",
                id: 12
              },
              requestCancelExternalWorkflowExecution: {
                type: "RequestCancelExternalWorkflowExecution",
                id: 13
              },
              signalExternalWorkflowExecution: {
                type: "SignalExternalWorkflowExecution",
                id: 14
              },
              cancelSignalWorkflow: {
                type: "CancelSignalWorkflow",
                id: 15
              },
              scheduleLocalActivity: {
                type: "ScheduleLocalActivity",
                id: 16
              },
              requestCancelLocalActivity: {
                type: "RequestCancelLocalActivity",
                id: 17
              },
              upsertWorkflowSearchAttributes: {
                type: "UpsertWorkflowSearchAttributes",
                id: 18
              },
              modifyWorkflowProperties: {
                type: "ModifyWorkflowProperties",
                id: 19
              }
            }
          },
          StartTimer: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              startToFireTimeout: {
                type: "google.protobuf.Duration",
                id: 2
              }
            }
          },
          CancelTimer: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              }
            }
          },
          ScheduleActivity: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              activityId: {
                type: "string",
                id: 2
              },
              activityType: {
                type: "string",
                id: 3
              },
              taskQueue: {
                type: "string",
                id: 5
              },
              headers: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 6
              },
              "arguments": {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 7
              },
              scheduleToCloseTimeout: {
                type: "google.protobuf.Duration",
                id: 8
              },
              scheduleToStartTimeout: {
                type: "google.protobuf.Duration",
                id: 9
              },
              startToCloseTimeout: {
                type: "google.protobuf.Duration",
                id: 10
              },
              heartbeatTimeout: {
                type: "google.protobuf.Duration",
                id: 11
              },
              retryPolicy: {
                type: "temporal.api.common.v1.RetryPolicy",
                id: 12
              },
              cancellationType: {
                type: "ActivityCancellationType",
                id: 13
              },
              doNotEagerlyExecute: {
                type: "bool",
                id: 14
              },
              versioningIntent: {
                type: "coresdk.common.VersioningIntent",
                id: 15
              }
            }
          },
          ScheduleLocalActivity: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              activityId: {
                type: "string",
                id: 2
              },
              activityType: {
                type: "string",
                id: 3
              },
              attempt: {
                type: "uint32",
                id: 4
              },
              originalScheduleTime: {
                type: "google.protobuf.Timestamp",
                id: 5
              },
              headers: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 6
              },
              "arguments": {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 7
              },
              scheduleToCloseTimeout: {
                type: "google.protobuf.Duration",
                id: 8
              },
              scheduleToStartTimeout: {
                type: "google.protobuf.Duration",
                id: 9
              },
              startToCloseTimeout: {
                type: "google.protobuf.Duration",
                id: 10
              },
              retryPolicy: {
                type: "temporal.api.common.v1.RetryPolicy",
                id: 11
              },
              localRetryThreshold: {
                type: "google.protobuf.Duration",
                id: 12
              },
              cancellationType: {
                type: "ActivityCancellationType",
                id: 13
              }
            }
          },
          ActivityCancellationType: {
            values: {
              TRY_CANCEL: 0,
              WAIT_CANCELLATION_COMPLETED: 1,
              ABANDON: 2
            }
          },
          RequestCancelActivity: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              }
            }
          },
          RequestCancelLocalActivity: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              }
            }
          },
          QueryResult: {
            oneofs: {
              variant: {
                oneof: [
                  "succeeded",
                  "failed"
                ]
              }
            },
            fields: {
              queryId: {
                type: "string",
                id: 1
              },
              succeeded: {
                type: "QuerySuccess",
                id: 2
              },
              failed: {
                type: "temporal.api.failure.v1.Failure",
                id: 3
              }
            }
          },
          QuerySuccess: {
            fields: {
              response: {
                type: "temporal.api.common.v1.Payload",
                id: 1
              }
            }
          },
          CompleteWorkflowExecution: {
            fields: {
              result: {
                type: "temporal.api.common.v1.Payload",
                id: 1
              }
            }
          },
          FailWorkflowExecution: {
            fields: {
              failure: {
                type: "temporal.api.failure.v1.Failure",
                id: 1
              }
            }
          },
          ContinueAsNewWorkflowExecution: {
            fields: {
              workflowType: {
                type: "string",
                id: 1
              },
              taskQueue: {
                type: "string",
                id: 2
              },
              "arguments": {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 3
              },
              workflowRunTimeout: {
                type: "google.protobuf.Duration",
                id: 4
              },
              workflowTaskTimeout: {
                type: "google.protobuf.Duration",
                id: 5
              },
              memo: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 6
              },
              headers: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 7
              },
              searchAttributes: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 8
              },
              retryPolicy: {
                type: "temporal.api.common.v1.RetryPolicy",
                id: 9
              },
              versioningIntent: {
                type: "coresdk.common.VersioningIntent",
                id: 10
              }
            }
          },
          CancelWorkflowExecution: {
            fields: {}
          },
          SetPatchMarker: {
            fields: {
              patchId: {
                type: "string",
                id: 1
              },
              deprecated: {
                type: "bool",
                id: 2
              }
            }
          },
          StartChildWorkflowExecution: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              namespace: {
                type: "string",
                id: 2
              },
              workflowId: {
                type: "string",
                id: 3
              },
              workflowType: {
                type: "string",
                id: 4
              },
              taskQueue: {
                type: "string",
                id: 5
              },
              input: {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 6
              },
              workflowExecutionTimeout: {
                type: "google.protobuf.Duration",
                id: 7
              },
              workflowRunTimeout: {
                type: "google.protobuf.Duration",
                id: 8
              },
              workflowTaskTimeout: {
                type: "google.protobuf.Duration",
                id: 9
              },
              parentClosePolicy: {
                type: "child_workflow.ParentClosePolicy",
                id: 10
              },
              workflowIdReusePolicy: {
                type: "temporal.api.enums.v1.WorkflowIdReusePolicy",
                id: 12
              },
              retryPolicy: {
                type: "temporal.api.common.v1.RetryPolicy",
                id: 13
              },
              cronSchedule: {
                type: "string",
                id: 14
              },
              headers: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 15
              },
              memo: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 16
              },
              searchAttributes: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 17
              },
              cancellationType: {
                type: "child_workflow.ChildWorkflowCancellationType",
                id: 18
              },
              versioningIntent: {
                type: "coresdk.common.VersioningIntent",
                id: 19
              }
            }
          },
          CancelChildWorkflowExecution: {
            fields: {
              childWorkflowSeq: {
                type: "uint32",
                id: 1
              }
            }
          },
          RequestCancelExternalWorkflowExecution: {
            oneofs: {
              target: {
                oneof: [
                  "workflowExecution",
                  "childWorkflowId"
                ]
              }
            },
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              workflowExecution: {
                type: "common.NamespacedWorkflowExecution",
                id: 2
              },
              childWorkflowId: {
                type: "string",
                id: 3
              }
            }
          },
          SignalExternalWorkflowExecution: {
            oneofs: {
              target: {
                oneof: [
                  "workflowExecution",
                  "childWorkflowId"
                ]
              }
            },
            fields: {
              seq: {
                type: "uint32",
                id: 1
              },
              workflowExecution: {
                type: "common.NamespacedWorkflowExecution",
                id: 2
              },
              childWorkflowId: {
                type: "string",
                id: 3
              },
              signalName: {
                type: "string",
                id: 4
              },
              args: {
                rule: "repeated",
                type: "temporal.api.common.v1.Payload",
                id: 5
              },
              headers: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 6
              }
            }
          },
          CancelSignalWorkflow: {
            fields: {
              seq: {
                type: "uint32",
                id: 1
              }
            }
          },
          UpsertWorkflowSearchAttributes: {
            fields: {
              searchAttributes: {
                keyType: "string",
                type: "temporal.api.common.v1.Payload",
                id: 1
              }
            }
          },
          ModifyWorkflowProperties: {
            fields: {
              upsertedMemo: {
                type: "temporal.api.common.v1.Memo",
                id: 1
              }
            }
          }
        }
      },
      workflow_completion: {
        options: {
          ruby_package: "Temporalio::Bridge::Api::WorkflowCompletion"
        },
        nested: {
          WorkflowActivationCompletion: {
            oneofs: {
              status: {
                oneof: [
                  "successful",
                  "failed"
                ]
              }
            },
            fields: {
              runId: {
                type: "string",
                id: 1
              },
              successful: {
                type: "Success",
                id: 2
              },
              failed: {
                type: "Failure",
                id: 3
              }
            }
          },
          Success: {
            fields: {
              commands: {
                rule: "repeated",
                type: "workflow_commands.WorkflowCommand",
                id: 1
              },
              usedInternalFlags: {
                rule: "repeated",
                type: "uint32",
                id: 6
              }
            }
          },
          Failure: {
            fields: {
              failure: {
                type: "temporal.api.failure.v1.Failure",
                id: 1
              },
              forceCause: {
                type: "temporal.api.enums.v1.WorkflowTaskFailedCause",
                id: 2
              }
            }
          }
        }
      }
    }
  },
  temporal: {
    nested: {
      api: {
        nested: {
          common: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/common/v1;common",
                  java_package: "io.temporal.api.common.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Common::V1",
                  csharp_namespace: "Temporalio.Api.Common.V1"
                },
                nested: {
                  DataBlob: {
                    fields: {
                      encodingType: {
                        type: "temporal.api.enums.v1.EncodingType",
                        id: 1
                      },
                      data: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  Payloads: {
                    fields: {
                      payloads: {
                        rule: "repeated",
                        type: "Payload",
                        id: 1
                      }
                    }
                  },
                  Payload: {
                    fields: {
                      metadata: {
                        keyType: "string",
                        type: "bytes",
                        id: 1
                      },
                      data: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  SearchAttributes: {
                    fields: {
                      indexedFields: {
                        keyType: "string",
                        type: "Payload",
                        id: 1
                      }
                    }
                  },
                  Memo: {
                    fields: {
                      fields: {
                        keyType: "string",
                        type: "Payload",
                        id: 1
                      }
                    }
                  },
                  Header: {
                    fields: {
                      fields: {
                        keyType: "string",
                        type: "Payload",
                        id: 1
                      }
                    }
                  },
                  WorkflowExecution: {
                    fields: {
                      workflowId: {
                        type: "string",
                        id: 1
                      },
                      runId: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  WorkflowType: {
                    fields: {
                      name: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  ActivityType: {
                    fields: {
                      name: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  RetryPolicy: {
                    fields: {
                      initialInterval: {
                        type: "google.protobuf.Duration",
                        id: 1,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      backoffCoefficient: {
                        type: "double",
                        id: 2
                      },
                      maximumInterval: {
                        type: "google.protobuf.Duration",
                        id: 3,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      maximumAttempts: {
                        type: "int32",
                        id: 4
                      },
                      nonRetryableErrorTypes: {
                        rule: "repeated",
                        type: "string",
                        id: 5
                      }
                    }
                  },
                  MeteringMetadata: {
                    fields: {
                      nonfirstLocalActivityExecutionAttempts: {
                        type: "uint32",
                        id: 13
                      }
                    }
                  },
                  WorkerVersionStamp: {
                    fields: {
                      buildId: {
                        type: "string",
                        id: 1
                      },
                      bundleId: {
                        type: "string",
                        id: 2
                      },
                      useVersioning: {
                        type: "bool",
                        id: 3
                      }
                    }
                  },
                  WorkerVersionCapabilities: {
                    fields: {
                      buildId: {
                        type: "string",
                        id: 1
                      },
                      useVersioning: {
                        type: "bool",
                        id: 2
                      }
                    }
                  }
                }
              }
            }
          },
          enums: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/enums/v1;enums",
                  java_package: "io.temporal.api.enums.v1",
                  java_multiple_files: true,
                  java_outer_classname: "ScheduleProto",
                  ruby_package: "Temporalio::Api::Enums::V1",
                  csharp_namespace: "Temporalio.Api.Enums.V1"
                },
                nested: {
                  EncodingType: {
                    values: {
                      ENCODING_TYPE_UNSPECIFIED: 0,
                      ENCODING_TYPE_PROTO3: 1,
                      ENCODING_TYPE_JSON: 2
                    }
                  },
                  IndexedValueType: {
                    values: {
                      INDEXED_VALUE_TYPE_UNSPECIFIED: 0,
                      INDEXED_VALUE_TYPE_TEXT: 1,
                      INDEXED_VALUE_TYPE_KEYWORD: 2,
                      INDEXED_VALUE_TYPE_INT: 3,
                      INDEXED_VALUE_TYPE_DOUBLE: 4,
                      INDEXED_VALUE_TYPE_BOOL: 5,
                      INDEXED_VALUE_TYPE_DATETIME: 6,
                      INDEXED_VALUE_TYPE_KEYWORD_LIST: 7
                    }
                  },
                  Severity: {
                    values: {
                      SEVERITY_UNSPECIFIED: 0,
                      SEVERITY_HIGH: 1,
                      SEVERITY_MEDIUM: 2,
                      SEVERITY_LOW: 3
                    }
                  },
                  WorkflowIdReusePolicy: {
                    values: {
                      WORKFLOW_ID_REUSE_POLICY_UNSPECIFIED: 0,
                      WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE: 1,
                      WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE_FAILED_ONLY: 2,
                      WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE: 3,
                      WORKFLOW_ID_REUSE_POLICY_TERMINATE_IF_RUNNING: 4
                    }
                  },
                  ParentClosePolicy: {
                    values: {
                      PARENT_CLOSE_POLICY_UNSPECIFIED: 0,
                      PARENT_CLOSE_POLICY_TERMINATE: 1,
                      PARENT_CLOSE_POLICY_ABANDON: 2,
                      PARENT_CLOSE_POLICY_REQUEST_CANCEL: 3
                    }
                  },
                  ContinueAsNewInitiator: {
                    values: {
                      CONTINUE_AS_NEW_INITIATOR_UNSPECIFIED: 0,
                      CONTINUE_AS_NEW_INITIATOR_WORKFLOW: 1,
                      CONTINUE_AS_NEW_INITIATOR_RETRY: 2,
                      CONTINUE_AS_NEW_INITIATOR_CRON_SCHEDULE: 3
                    }
                  },
                  WorkflowExecutionStatus: {
                    values: {
                      WORKFLOW_EXECUTION_STATUS_UNSPECIFIED: 0,
                      WORKFLOW_EXECUTION_STATUS_RUNNING: 1,
                      WORKFLOW_EXECUTION_STATUS_COMPLETED: 2,
                      WORKFLOW_EXECUTION_STATUS_FAILED: 3,
                      WORKFLOW_EXECUTION_STATUS_CANCELED: 4,
                      WORKFLOW_EXECUTION_STATUS_TERMINATED: 5,
                      WORKFLOW_EXECUTION_STATUS_CONTINUED_AS_NEW: 6,
                      WORKFLOW_EXECUTION_STATUS_TIMED_OUT: 7
                    }
                  },
                  PendingActivityState: {
                    values: {
                      PENDING_ACTIVITY_STATE_UNSPECIFIED: 0,
                      PENDING_ACTIVITY_STATE_SCHEDULED: 1,
                      PENDING_ACTIVITY_STATE_STARTED: 2,
                      PENDING_ACTIVITY_STATE_CANCEL_REQUESTED: 3
                    }
                  },
                  PendingWorkflowTaskState: {
                    values: {
                      PENDING_WORKFLOW_TASK_STATE_UNSPECIFIED: 0,
                      PENDING_WORKFLOW_TASK_STATE_SCHEDULED: 1,
                      PENDING_WORKFLOW_TASK_STATE_STARTED: 2
                    }
                  },
                  HistoryEventFilterType: {
                    values: {
                      HISTORY_EVENT_FILTER_TYPE_UNSPECIFIED: 0,
                      HISTORY_EVENT_FILTER_TYPE_ALL_EVENT: 1,
                      HISTORY_EVENT_FILTER_TYPE_CLOSE_EVENT: 2
                    }
                  },
                  RetryState: {
                    values: {
                      RETRY_STATE_UNSPECIFIED: 0,
                      RETRY_STATE_IN_PROGRESS: 1,
                      RETRY_STATE_NON_RETRYABLE_FAILURE: 2,
                      RETRY_STATE_TIMEOUT: 3,
                      RETRY_STATE_MAXIMUM_ATTEMPTS_REACHED: 4,
                      RETRY_STATE_RETRY_POLICY_NOT_SET: 5,
                      RETRY_STATE_INTERNAL_SERVER_ERROR: 6,
                      RETRY_STATE_CANCEL_REQUESTED: 7
                    }
                  },
                  TimeoutType: {
                    values: {
                      TIMEOUT_TYPE_UNSPECIFIED: 0,
                      TIMEOUT_TYPE_START_TO_CLOSE: 1,
                      TIMEOUT_TYPE_SCHEDULE_TO_START: 2,
                      TIMEOUT_TYPE_SCHEDULE_TO_CLOSE: 3,
                      TIMEOUT_TYPE_HEARTBEAT: 4
                    }
                  },
                  WorkflowTaskFailedCause: {
                    values: {
                      WORKFLOW_TASK_FAILED_CAUSE_UNSPECIFIED: 0,
                      WORKFLOW_TASK_FAILED_CAUSE_UNHANDLED_COMMAND: 1,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_SCHEDULE_ACTIVITY_ATTRIBUTES: 2,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_REQUEST_CANCEL_ACTIVITY_ATTRIBUTES: 3,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_START_TIMER_ATTRIBUTES: 4,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_CANCEL_TIMER_ATTRIBUTES: 5,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_RECORD_MARKER_ATTRIBUTES: 6,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_COMPLETE_WORKFLOW_EXECUTION_ATTRIBUTES: 7,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_FAIL_WORKFLOW_EXECUTION_ATTRIBUTES: 8,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_CANCEL_WORKFLOW_EXECUTION_ATTRIBUTES: 9,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_REQUEST_CANCEL_EXTERNAL_WORKFLOW_EXECUTION_ATTRIBUTES: 10,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_CONTINUE_AS_NEW_ATTRIBUTES: 11,
                      WORKFLOW_TASK_FAILED_CAUSE_START_TIMER_DUPLICATE_ID: 12,
                      WORKFLOW_TASK_FAILED_CAUSE_RESET_STICKY_TASK_QUEUE: 13,
                      WORKFLOW_TASK_FAILED_CAUSE_WORKFLOW_WORKER_UNHANDLED_FAILURE: 14,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_SIGNAL_WORKFLOW_EXECUTION_ATTRIBUTES: 15,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_START_CHILD_EXECUTION_ATTRIBUTES: 16,
                      WORKFLOW_TASK_FAILED_CAUSE_FORCE_CLOSE_COMMAND: 17,
                      WORKFLOW_TASK_FAILED_CAUSE_FAILOVER_CLOSE_COMMAND: 18,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_SIGNAL_INPUT_SIZE: 19,
                      WORKFLOW_TASK_FAILED_CAUSE_RESET_WORKFLOW: 20,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_BINARY: 21,
                      WORKFLOW_TASK_FAILED_CAUSE_SCHEDULE_ACTIVITY_DUPLICATE_ID: 22,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_SEARCH_ATTRIBUTES: 23,
                      WORKFLOW_TASK_FAILED_CAUSE_NON_DETERMINISTIC_ERROR: 24,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_MODIFY_WORKFLOW_PROPERTIES_ATTRIBUTES: 25,
                      WORKFLOW_TASK_FAILED_CAUSE_PENDING_CHILD_WORKFLOWS_LIMIT_EXCEEDED: 26,
                      WORKFLOW_TASK_FAILED_CAUSE_PENDING_ACTIVITIES_LIMIT_EXCEEDED: 27,
                      WORKFLOW_TASK_FAILED_CAUSE_PENDING_SIGNALS_LIMIT_EXCEEDED: 28,
                      WORKFLOW_TASK_FAILED_CAUSE_PENDING_REQUEST_CANCEL_LIMIT_EXCEEDED: 29,
                      WORKFLOW_TASK_FAILED_CAUSE_BAD_UPDATE_WORKFLOW_EXECUTION_MESSAGE: 30,
                      WORKFLOW_TASK_FAILED_CAUSE_UNHANDLED_UPDATE: 31
                    }
                  },
                  StartChildWorkflowExecutionFailedCause: {
                    values: {
                      START_CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_UNSPECIFIED: 0,
                      START_CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_WORKFLOW_ALREADY_EXISTS: 1,
                      START_CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_NAMESPACE_NOT_FOUND: 2
                    }
                  },
                  CancelExternalWorkflowExecutionFailedCause: {
                    values: {
                      CANCEL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_UNSPECIFIED: 0,
                      CANCEL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_EXTERNAL_WORKFLOW_EXECUTION_NOT_FOUND: 1,
                      CANCEL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_NAMESPACE_NOT_FOUND: 2
                    }
                  },
                  SignalExternalWorkflowExecutionFailedCause: {
                    values: {
                      SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_UNSPECIFIED: 0,
                      SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_EXTERNAL_WORKFLOW_EXECUTION_NOT_FOUND: 1,
                      SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_NAMESPACE_NOT_FOUND: 2,
                      SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_SIGNAL_COUNT_LIMIT_EXCEEDED: 3
                    }
                  },
                  ResourceExhaustedCause: {
                    values: {
                      RESOURCE_EXHAUSTED_CAUSE_UNSPECIFIED: 0,
                      RESOURCE_EXHAUSTED_CAUSE_RPS_LIMIT: 1,
                      RESOURCE_EXHAUSTED_CAUSE_CONCURRENT_LIMIT: 2,
                      RESOURCE_EXHAUSTED_CAUSE_SYSTEM_OVERLOADED: 3,
                      RESOURCE_EXHAUSTED_CAUSE_PERSISTENCE_LIMIT: 4,
                      RESOURCE_EXHAUSTED_CAUSE_BUSY_WORKFLOW: 5
                    }
                  },
                  BatchOperationType: {
                    values: {
                      BATCH_OPERATION_TYPE_UNSPECIFIED: 0,
                      BATCH_OPERATION_TYPE_TERMINATE: 1,
                      BATCH_OPERATION_TYPE_CANCEL: 2,
                      BATCH_OPERATION_TYPE_SIGNAL: 3,
                      BATCH_OPERATION_TYPE_DELETE: 4,
                      BATCH_OPERATION_TYPE_RESET: 5
                    }
                  },
                  BatchOperationState: {
                    values: {
                      BATCH_OPERATION_STATE_UNSPECIFIED: 0,
                      BATCH_OPERATION_STATE_RUNNING: 1,
                      BATCH_OPERATION_STATE_COMPLETED: 2,
                      BATCH_OPERATION_STATE_FAILED: 3
                    }
                  },
                  NamespaceState: {
                    values: {
                      NAMESPACE_STATE_UNSPECIFIED: 0,
                      NAMESPACE_STATE_REGISTERED: 1,
                      NAMESPACE_STATE_DEPRECATED: 2,
                      NAMESPACE_STATE_DELETED: 3
                    }
                  },
                  ArchivalState: {
                    values: {
                      ARCHIVAL_STATE_UNSPECIFIED: 0,
                      ARCHIVAL_STATE_DISABLED: 1,
                      ARCHIVAL_STATE_ENABLED: 2
                    }
                  },
                  ReplicationState: {
                    values: {
                      REPLICATION_STATE_UNSPECIFIED: 0,
                      REPLICATION_STATE_NORMAL: 1,
                      REPLICATION_STATE_HANDOVER: 2
                    }
                  },
                  QueryResultType: {
                    values: {
                      QUERY_RESULT_TYPE_UNSPECIFIED: 0,
                      QUERY_RESULT_TYPE_ANSWERED: 1,
                      QUERY_RESULT_TYPE_FAILED: 2
                    }
                  },
                  QueryRejectCondition: {
                    values: {
                      QUERY_REJECT_CONDITION_UNSPECIFIED: 0,
                      QUERY_REJECT_CONDITION_NONE: 1,
                      QUERY_REJECT_CONDITION_NOT_OPEN: 2,
                      QUERY_REJECT_CONDITION_NOT_COMPLETED_CLEANLY: 3
                    }
                  },
                  ResetReapplyType: {
                    values: {
                      RESET_REAPPLY_TYPE_UNSPECIFIED: 0,
                      RESET_REAPPLY_TYPE_SIGNAL: 1,
                      RESET_REAPPLY_TYPE_NONE: 2
                    }
                  },
                  ResetType: {
                    values: {
                      RESET_TYPE_UNSPECIFIED: 0,
                      RESET_TYPE_FIRST_WORKFLOW_TASK: 1,
                      RESET_TYPE_LAST_WORKFLOW_TASK: 2
                    }
                  },
                  TaskQueueKind: {
                    values: {
                      TASK_QUEUE_KIND_UNSPECIFIED: 0,
                      TASK_QUEUE_KIND_NORMAL: 1,
                      TASK_QUEUE_KIND_STICKY: 2
                    }
                  },
                  TaskQueueType: {
                    values: {
                      TASK_QUEUE_TYPE_UNSPECIFIED: 0,
                      TASK_QUEUE_TYPE_WORKFLOW: 1,
                      TASK_QUEUE_TYPE_ACTIVITY: 2
                    }
                  },
                  TaskReachability: {
                    values: {
                      TASK_REACHABILITY_UNSPECIFIED: 0,
                      TASK_REACHABILITY_NEW_WORKFLOWS: 1,
                      TASK_REACHABILITY_EXISTING_WORKFLOWS: 2,
                      TASK_REACHABILITY_OPEN_WORKFLOWS: 3,
                      TASK_REACHABILITY_CLOSED_WORKFLOWS: 4
                    }
                  },
                  EventType: {
                    values: {
                      EVENT_TYPE_UNSPECIFIED: 0,
                      EVENT_TYPE_WORKFLOW_EXECUTION_STARTED: 1,
                      EVENT_TYPE_WORKFLOW_EXECUTION_COMPLETED: 2,
                      EVENT_TYPE_WORKFLOW_EXECUTION_FAILED: 3,
                      EVENT_TYPE_WORKFLOW_EXECUTION_TIMED_OUT: 4,
                      EVENT_TYPE_WORKFLOW_TASK_SCHEDULED: 5,
                      EVENT_TYPE_WORKFLOW_TASK_STARTED: 6,
                      EVENT_TYPE_WORKFLOW_TASK_COMPLETED: 7,
                      EVENT_TYPE_WORKFLOW_TASK_TIMED_OUT: 8,
                      EVENT_TYPE_WORKFLOW_TASK_FAILED: 9,
                      EVENT_TYPE_ACTIVITY_TASK_SCHEDULED: 10,
                      EVENT_TYPE_ACTIVITY_TASK_STARTED: 11,
                      EVENT_TYPE_ACTIVITY_TASK_COMPLETED: 12,
                      EVENT_TYPE_ACTIVITY_TASK_FAILED: 13,
                      EVENT_TYPE_ACTIVITY_TASK_TIMED_OUT: 14,
                      EVENT_TYPE_ACTIVITY_TASK_CANCEL_REQUESTED: 15,
                      EVENT_TYPE_ACTIVITY_TASK_CANCELED: 16,
                      EVENT_TYPE_TIMER_STARTED: 17,
                      EVENT_TYPE_TIMER_FIRED: 18,
                      EVENT_TYPE_TIMER_CANCELED: 19,
                      EVENT_TYPE_WORKFLOW_EXECUTION_CANCEL_REQUESTED: 20,
                      EVENT_TYPE_WORKFLOW_EXECUTION_CANCELED: 21,
                      EVENT_TYPE_REQUEST_CANCEL_EXTERNAL_WORKFLOW_EXECUTION_INITIATED: 22,
                      EVENT_TYPE_REQUEST_CANCEL_EXTERNAL_WORKFLOW_EXECUTION_FAILED: 23,
                      EVENT_TYPE_EXTERNAL_WORKFLOW_EXECUTION_CANCEL_REQUESTED: 24,
                      EVENT_TYPE_MARKER_RECORDED: 25,
                      EVENT_TYPE_WORKFLOW_EXECUTION_SIGNALED: 26,
                      EVENT_TYPE_WORKFLOW_EXECUTION_TERMINATED: 27,
                      EVENT_TYPE_WORKFLOW_EXECUTION_CONTINUED_AS_NEW: 28,
                      EVENT_TYPE_START_CHILD_WORKFLOW_EXECUTION_INITIATED: 29,
                      EVENT_TYPE_START_CHILD_WORKFLOW_EXECUTION_FAILED: 30,
                      EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_STARTED: 31,
                      EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_COMPLETED: 32,
                      EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_FAILED: 33,
                      EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_CANCELED: 34,
                      EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_TIMED_OUT: 35,
                      EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_TERMINATED: 36,
                      EVENT_TYPE_SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_INITIATED: 37,
                      EVENT_TYPE_SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED: 38,
                      EVENT_TYPE_EXTERNAL_WORKFLOW_EXECUTION_SIGNALED: 39,
                      EVENT_TYPE_UPSERT_WORKFLOW_SEARCH_ATTRIBUTES: 40,
                      EVENT_TYPE_WORKFLOW_EXECUTION_UPDATE_ACCEPTED: 41,
                      EVENT_TYPE_WORKFLOW_EXECUTION_UPDATE_REJECTED: 42,
                      EVENT_TYPE_WORKFLOW_EXECUTION_UPDATE_COMPLETED: 43,
                      EVENT_TYPE_WORKFLOW_PROPERTIES_MODIFIED_EXTERNALLY: 44,
                      EVENT_TYPE_ACTIVITY_PROPERTIES_MODIFIED_EXTERNALLY: 45,
                      EVENT_TYPE_WORKFLOW_PROPERTIES_MODIFIED: 46
                    }
                  },
                  UpdateWorkflowExecutionLifecycleStage: {
                    values: {
                      UPDATE_WORKFLOW_EXECUTION_LIFECYCLE_STAGE_UNSPECIFIED: 0,
                      UPDATE_WORKFLOW_EXECUTION_LIFECYCLE_STAGE_ADMITTED: 1,
                      UPDATE_WORKFLOW_EXECUTION_LIFECYCLE_STAGE_ACCEPTED: 2,
                      UPDATE_WORKFLOW_EXECUTION_LIFECYCLE_STAGE_COMPLETED: 3
                    }
                  },
                  CommandType: {
                    values: {
                      COMMAND_TYPE_UNSPECIFIED: 0,
                      COMMAND_TYPE_SCHEDULE_ACTIVITY_TASK: 1,
                      COMMAND_TYPE_REQUEST_CANCEL_ACTIVITY_TASK: 2,
                      COMMAND_TYPE_START_TIMER: 3,
                      COMMAND_TYPE_COMPLETE_WORKFLOW_EXECUTION: 4,
                      COMMAND_TYPE_FAIL_WORKFLOW_EXECUTION: 5,
                      COMMAND_TYPE_CANCEL_TIMER: 6,
                      COMMAND_TYPE_CANCEL_WORKFLOW_EXECUTION: 7,
                      COMMAND_TYPE_REQUEST_CANCEL_EXTERNAL_WORKFLOW_EXECUTION: 8,
                      COMMAND_TYPE_RECORD_MARKER: 9,
                      COMMAND_TYPE_CONTINUE_AS_NEW_WORKFLOW_EXECUTION: 10,
                      COMMAND_TYPE_START_CHILD_WORKFLOW_EXECUTION: 11,
                      COMMAND_TYPE_SIGNAL_EXTERNAL_WORKFLOW_EXECUTION: 12,
                      COMMAND_TYPE_UPSERT_WORKFLOW_SEARCH_ATTRIBUTES: 13,
                      COMMAND_TYPE_PROTOCOL_MESSAGE: 14,
                      COMMAND_TYPE_MODIFY_WORKFLOW_PROPERTIES: 16
                    }
                  },
                  ScheduleOverlapPolicy: {
                    values: {
                      SCHEDULE_OVERLAP_POLICY_UNSPECIFIED: 0,
                      SCHEDULE_OVERLAP_POLICY_SKIP: 1,
                      SCHEDULE_OVERLAP_POLICY_BUFFER_ONE: 2,
                      SCHEDULE_OVERLAP_POLICY_BUFFER_ALL: 3,
                      SCHEDULE_OVERLAP_POLICY_CANCEL_OTHER: 4,
                      SCHEDULE_OVERLAP_POLICY_TERMINATE_OTHER: 5,
                      SCHEDULE_OVERLAP_POLICY_ALLOW_ALL: 6
                    }
                  }
                }
              }
            }
          },
          failure: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/failure/v1;failure",
                  java_package: "io.temporal.api.failure.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Failure::V1",
                  csharp_namespace: "Temporalio.Api.Failure.V1"
                },
                nested: {
                  ApplicationFailureInfo: {
                    fields: {
                      type: {
                        type: "string",
                        id: 1
                      },
                      nonRetryable: {
                        type: "bool",
                        id: 2
                      },
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 3
                      }
                    }
                  },
                  TimeoutFailureInfo: {
                    fields: {
                      timeoutType: {
                        type: "temporal.api.enums.v1.TimeoutType",
                        id: 1
                      },
                      lastHeartbeatDetails: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      }
                    }
                  },
                  CanceledFailureInfo: {
                    fields: {
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      }
                    }
                  },
                  TerminatedFailureInfo: {
                    fields: {}
                  },
                  ServerFailureInfo: {
                    fields: {
                      nonRetryable: {
                        type: "bool",
                        id: 1
                      }
                    }
                  },
                  ResetWorkflowFailureInfo: {
                    fields: {
                      lastHeartbeatDetails: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      }
                    }
                  },
                  ActivityFailureInfo: {
                    fields: {
                      scheduledEventId: {
                        type: "int64",
                        id: 1
                      },
                      startedEventId: {
                        type: "int64",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      activityType: {
                        type: "temporal.api.common.v1.ActivityType",
                        id: 4
                      },
                      activityId: {
                        type: "string",
                        id: 5
                      },
                      retryState: {
                        type: "temporal.api.enums.v1.RetryState",
                        id: 6
                      }
                    }
                  },
                  ChildWorkflowExecutionFailureInfo: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 3
                      },
                      initiatedEventId: {
                        type: "int64",
                        id: 4
                      },
                      startedEventId: {
                        type: "int64",
                        id: 5
                      },
                      retryState: {
                        type: "temporal.api.enums.v1.RetryState",
                        id: 6
                      }
                    }
                  },
                  Failure: {
                    oneofs: {
                      failureInfo: {
                        oneof: [
                          "applicationFailureInfo",
                          "timeoutFailureInfo",
                          "canceledFailureInfo",
                          "terminatedFailureInfo",
                          "serverFailureInfo",
                          "resetWorkflowFailureInfo",
                          "activityFailureInfo",
                          "childWorkflowExecutionFailureInfo"
                        ]
                      }
                    },
                    fields: {
                      message: {
                        type: "string",
                        id: 1
                      },
                      source: {
                        type: "string",
                        id: 2
                      },
                      stackTrace: {
                        type: "string",
                        id: 3
                      },
                      encodedAttributes: {
                        type: "temporal.api.common.v1.Payload",
                        id: 20
                      },
                      cause: {
                        type: "Failure",
                        id: 4
                      },
                      applicationFailureInfo: {
                        type: "ApplicationFailureInfo",
                        id: 5
                      },
                      timeoutFailureInfo: {
                        type: "TimeoutFailureInfo",
                        id: 6
                      },
                      canceledFailureInfo: {
                        type: "CanceledFailureInfo",
                        id: 7
                      },
                      terminatedFailureInfo: {
                        type: "TerminatedFailureInfo",
                        id: 8
                      },
                      serverFailureInfo: {
                        type: "ServerFailureInfo",
                        id: 9
                      },
                      resetWorkflowFailureInfo: {
                        type: "ResetWorkflowFailureInfo",
                        id: 10
                      },
                      activityFailureInfo: {
                        type: "ActivityFailureInfo",
                        id: 11
                      },
                      childWorkflowExecutionFailureInfo: {
                        type: "ChildWorkflowExecutionFailureInfo",
                        id: 12
                      }
                    }
                  }
                }
              }
            }
          },
          workflowservice: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/workflowservice/v1;workflowservice",
                  java_package: "io.temporal.api.workflowservice.v1",
                  java_multiple_files: true,
                  java_outer_classname: "RequestResponseProto",
                  ruby_package: "Temporalio::Api::WorkflowService::V1",
                  csharp_namespace: "Temporalio.Api.WorkflowService.V1"
                },
                nested: {
                  WorkflowService: {
                    methods: {
                      RegisterNamespace: {
                        requestType: "RegisterNamespaceRequest",
                        responseType: "RegisterNamespaceResponse"
                      },
                      DescribeNamespace: {
                        requestType: "DescribeNamespaceRequest",
                        responseType: "DescribeNamespaceResponse"
                      },
                      ListNamespaces: {
                        requestType: "ListNamespacesRequest",
                        responseType: "ListNamespacesResponse"
                      },
                      UpdateNamespace: {
                        requestType: "UpdateNamespaceRequest",
                        responseType: "UpdateNamespaceResponse"
                      },
                      DeprecateNamespace: {
                        requestType: "DeprecateNamespaceRequest",
                        responseType: "DeprecateNamespaceResponse"
                      },
                      StartWorkflowExecution: {
                        requestType: "StartWorkflowExecutionRequest",
                        responseType: "StartWorkflowExecutionResponse"
                      },
                      GetWorkflowExecutionHistory: {
                        requestType: "GetWorkflowExecutionHistoryRequest",
                        responseType: "GetWorkflowExecutionHistoryResponse"
                      },
                      GetWorkflowExecutionHistoryReverse: {
                        requestType: "GetWorkflowExecutionHistoryReverseRequest",
                        responseType: "GetWorkflowExecutionHistoryReverseResponse"
                      },
                      PollWorkflowTaskQueue: {
                        requestType: "PollWorkflowTaskQueueRequest",
                        responseType: "PollWorkflowTaskQueueResponse"
                      },
                      RespondWorkflowTaskCompleted: {
                        requestType: "RespondWorkflowTaskCompletedRequest",
                        responseType: "RespondWorkflowTaskCompletedResponse"
                      },
                      RespondWorkflowTaskFailed: {
                        requestType: "RespondWorkflowTaskFailedRequest",
                        responseType: "RespondWorkflowTaskFailedResponse"
                      },
                      PollActivityTaskQueue: {
                        requestType: "PollActivityTaskQueueRequest",
                        responseType: "PollActivityTaskQueueResponse"
                      },
                      RecordActivityTaskHeartbeat: {
                        requestType: "RecordActivityTaskHeartbeatRequest",
                        responseType: "RecordActivityTaskHeartbeatResponse"
                      },
                      RecordActivityTaskHeartbeatById: {
                        requestType: "RecordActivityTaskHeartbeatByIdRequest",
                        responseType: "RecordActivityTaskHeartbeatByIdResponse"
                      },
                      RespondActivityTaskCompleted: {
                        requestType: "RespondActivityTaskCompletedRequest",
                        responseType: "RespondActivityTaskCompletedResponse"
                      },
                      RespondActivityTaskCompletedById: {
                        requestType: "RespondActivityTaskCompletedByIdRequest",
                        responseType: "RespondActivityTaskCompletedByIdResponse"
                      },
                      RespondActivityTaskFailed: {
                        requestType: "RespondActivityTaskFailedRequest",
                        responseType: "RespondActivityTaskFailedResponse"
                      },
                      RespondActivityTaskFailedById: {
                        requestType: "RespondActivityTaskFailedByIdRequest",
                        responseType: "RespondActivityTaskFailedByIdResponse"
                      },
                      RespondActivityTaskCanceled: {
                        requestType: "RespondActivityTaskCanceledRequest",
                        responseType: "RespondActivityTaskCanceledResponse"
                      },
                      RespondActivityTaskCanceledById: {
                        requestType: "RespondActivityTaskCanceledByIdRequest",
                        responseType: "RespondActivityTaskCanceledByIdResponse"
                      },
                      RequestCancelWorkflowExecution: {
                        requestType: "RequestCancelWorkflowExecutionRequest",
                        responseType: "RequestCancelWorkflowExecutionResponse"
                      },
                      SignalWorkflowExecution: {
                        requestType: "SignalWorkflowExecutionRequest",
                        responseType: "SignalWorkflowExecutionResponse"
                      },
                      SignalWithStartWorkflowExecution: {
                        requestType: "SignalWithStartWorkflowExecutionRequest",
                        responseType: "SignalWithStartWorkflowExecutionResponse"
                      },
                      ResetWorkflowExecution: {
                        requestType: "ResetWorkflowExecutionRequest",
                        responseType: "ResetWorkflowExecutionResponse"
                      },
                      TerminateWorkflowExecution: {
                        requestType: "TerminateWorkflowExecutionRequest",
                        responseType: "TerminateWorkflowExecutionResponse"
                      },
                      DeleteWorkflowExecution: {
                        requestType: "DeleteWorkflowExecutionRequest",
                        responseType: "DeleteWorkflowExecutionResponse"
                      },
                      ListOpenWorkflowExecutions: {
                        requestType: "ListOpenWorkflowExecutionsRequest",
                        responseType: "ListOpenWorkflowExecutionsResponse"
                      },
                      ListClosedWorkflowExecutions: {
                        requestType: "ListClosedWorkflowExecutionsRequest",
                        responseType: "ListClosedWorkflowExecutionsResponse"
                      },
                      ListWorkflowExecutions: {
                        requestType: "ListWorkflowExecutionsRequest",
                        responseType: "ListWorkflowExecutionsResponse"
                      },
                      ListArchivedWorkflowExecutions: {
                        requestType: "ListArchivedWorkflowExecutionsRequest",
                        responseType: "ListArchivedWorkflowExecutionsResponse"
                      },
                      ScanWorkflowExecutions: {
                        requestType: "ScanWorkflowExecutionsRequest",
                        responseType: "ScanWorkflowExecutionsResponse"
                      },
                      CountWorkflowExecutions: {
                        requestType: "CountWorkflowExecutionsRequest",
                        responseType: "CountWorkflowExecutionsResponse"
                      },
                      GetSearchAttributes: {
                        requestType: "GetSearchAttributesRequest",
                        responseType: "GetSearchAttributesResponse"
                      },
                      RespondQueryTaskCompleted: {
                        requestType: "RespondQueryTaskCompletedRequest",
                        responseType: "RespondQueryTaskCompletedResponse"
                      },
                      ResetStickyTaskQueue: {
                        requestType: "ResetStickyTaskQueueRequest",
                        responseType: "ResetStickyTaskQueueResponse"
                      },
                      QueryWorkflow: {
                        requestType: "QueryWorkflowRequest",
                        responseType: "QueryWorkflowResponse"
                      },
                      DescribeWorkflowExecution: {
                        requestType: "DescribeWorkflowExecutionRequest",
                        responseType: "DescribeWorkflowExecutionResponse"
                      },
                      DescribeTaskQueue: {
                        requestType: "DescribeTaskQueueRequest",
                        responseType: "DescribeTaskQueueResponse"
                      },
                      GetClusterInfo: {
                        requestType: "GetClusterInfoRequest",
                        responseType: "GetClusterInfoResponse"
                      },
                      GetSystemInfo: {
                        requestType: "GetSystemInfoRequest",
                        responseType: "GetSystemInfoResponse"
                      },
                      ListTaskQueuePartitions: {
                        requestType: "ListTaskQueuePartitionsRequest",
                        responseType: "ListTaskQueuePartitionsResponse"
                      },
                      CreateSchedule: {
                        requestType: "CreateScheduleRequest",
                        responseType: "CreateScheduleResponse"
                      },
                      DescribeSchedule: {
                        requestType: "DescribeScheduleRequest",
                        responseType: "DescribeScheduleResponse"
                      },
                      UpdateSchedule: {
                        requestType: "UpdateScheduleRequest",
                        responseType: "UpdateScheduleResponse"
                      },
                      PatchSchedule: {
                        requestType: "PatchScheduleRequest",
                        responseType: "PatchScheduleResponse"
                      },
                      ListScheduleMatchingTimes: {
                        requestType: "ListScheduleMatchingTimesRequest",
                        responseType: "ListScheduleMatchingTimesResponse"
                      },
                      DeleteSchedule: {
                        requestType: "DeleteScheduleRequest",
                        responseType: "DeleteScheduleResponse"
                      },
                      ListSchedules: {
                        requestType: "ListSchedulesRequest",
                        responseType: "ListSchedulesResponse"
                      },
                      UpdateWorkerBuildIdCompatibility: {
                        requestType: "UpdateWorkerBuildIdCompatibilityRequest",
                        responseType: "UpdateWorkerBuildIdCompatibilityResponse"
                      },
                      GetWorkerBuildIdCompatibility: {
                        requestType: "GetWorkerBuildIdCompatibilityRequest",
                        responseType: "GetWorkerBuildIdCompatibilityResponse"
                      },
                      GetWorkerTaskReachability: {
                        requestType: "GetWorkerTaskReachabilityRequest",
                        responseType: "GetWorkerTaskReachabilityResponse"
                      },
                      UpdateWorkflowExecution: {
                        requestType: "UpdateWorkflowExecutionRequest",
                        responseType: "UpdateWorkflowExecutionResponse"
                      },
                      PollWorkflowExecutionUpdate: {
                        requestType: "PollWorkflowExecutionUpdateRequest",
                        responseType: "PollWorkflowExecutionUpdateResponse"
                      },
                      StartBatchOperation: {
                        requestType: "StartBatchOperationRequest",
                        responseType: "StartBatchOperationResponse"
                      },
                      StopBatchOperation: {
                        requestType: "StopBatchOperationRequest",
                        responseType: "StopBatchOperationResponse"
                      },
                      DescribeBatchOperation: {
                        requestType: "DescribeBatchOperationRequest",
                        responseType: "DescribeBatchOperationResponse"
                      },
                      ListBatchOperations: {
                        requestType: "ListBatchOperationsRequest",
                        responseType: "ListBatchOperationsResponse"
                      }
                    }
                  },
                  RegisterNamespaceRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      description: {
                        type: "string",
                        id: 2
                      },
                      ownerEmail: {
                        type: "string",
                        id: 3
                      },
                      workflowExecutionRetentionPeriod: {
                        type: "google.protobuf.Duration",
                        id: 4,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      clusters: {
                        rule: "repeated",
                        type: "temporal.api.replication.v1.ClusterReplicationConfig",
                        id: 5
                      },
                      activeClusterName: {
                        type: "string",
                        id: 6
                      },
                      data: {
                        keyType: "string",
                        type: "string",
                        id: 7
                      },
                      securityToken: {
                        type: "string",
                        id: 8
                      },
                      isGlobalNamespace: {
                        type: "bool",
                        id: 9
                      },
                      historyArchivalState: {
                        type: "temporal.api.enums.v1.ArchivalState",
                        id: 10
                      },
                      historyArchivalUri: {
                        type: "string",
                        id: 11
                      },
                      visibilityArchivalState: {
                        type: "temporal.api.enums.v1.ArchivalState",
                        id: 12
                      },
                      visibilityArchivalUri: {
                        type: "string",
                        id: 13
                      }
                    }
                  },
                  RegisterNamespaceResponse: {
                    fields: {}
                  },
                  ListNamespacesRequest: {
                    fields: {
                      pageSize: {
                        type: "int32",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 2
                      },
                      namespaceFilter: {
                        type: "temporal.api.namespace.v1.NamespaceFilter",
                        id: 3
                      }
                    }
                  },
                  ListNamespacesResponse: {
                    fields: {
                      namespaces: {
                        rule: "repeated",
                        type: "DescribeNamespaceResponse",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  DescribeNamespaceRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      id: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  DescribeNamespaceResponse: {
                    fields: {
                      namespaceInfo: {
                        type: "temporal.api.namespace.v1.NamespaceInfo",
                        id: 1
                      },
                      config: {
                        type: "temporal.api.namespace.v1.NamespaceConfig",
                        id: 2
                      },
                      replicationConfig: {
                        type: "temporal.api.replication.v1.NamespaceReplicationConfig",
                        id: 3
                      },
                      failoverVersion: {
                        type: "int64",
                        id: 4
                      },
                      isGlobalNamespace: {
                        type: "bool",
                        id: 5
                      },
                      failoverHistory: {
                        rule: "repeated",
                        type: "temporal.api.replication.v1.FailoverStatus",
                        id: 6
                      }
                    }
                  },
                  UpdateNamespaceRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      updateInfo: {
                        type: "temporal.api.namespace.v1.UpdateNamespaceInfo",
                        id: 2
                      },
                      config: {
                        type: "temporal.api.namespace.v1.NamespaceConfig",
                        id: 3
                      },
                      replicationConfig: {
                        type: "temporal.api.replication.v1.NamespaceReplicationConfig",
                        id: 4
                      },
                      securityToken: {
                        type: "string",
                        id: 5
                      },
                      deleteBadBinary: {
                        type: "string",
                        id: 6
                      },
                      promoteNamespace: {
                        type: "bool",
                        id: 7
                      }
                    }
                  },
                  UpdateNamespaceResponse: {
                    fields: {
                      namespaceInfo: {
                        type: "temporal.api.namespace.v1.NamespaceInfo",
                        id: 1
                      },
                      config: {
                        type: "temporal.api.namespace.v1.NamespaceConfig",
                        id: 2
                      },
                      replicationConfig: {
                        type: "temporal.api.replication.v1.NamespaceReplicationConfig",
                        id: 3
                      },
                      failoverVersion: {
                        type: "int64",
                        id: 4
                      },
                      isGlobalNamespace: {
                        type: "bool",
                        id: 5
                      }
                    }
                  },
                  DeprecateNamespaceRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      securityToken: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  DeprecateNamespaceResponse: {
                    fields: {}
                  },
                  StartWorkflowExecutionRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowId: {
                        type: "string",
                        id: 2
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 3
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 4
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 5
                      },
                      workflowExecutionTimeout: {
                        type: "google.protobuf.Duration",
                        id: 6,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowRunTimeout: {
                        type: "google.protobuf.Duration",
                        id: 7,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskTimeout: {
                        type: "google.protobuf.Duration",
                        id: 8,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      identity: {
                        type: "string",
                        id: 9
                      },
                      requestId: {
                        type: "string",
                        id: 10
                      },
                      workflowIdReusePolicy: {
                        type: "temporal.api.enums.v1.WorkflowIdReusePolicy",
                        id: 11
                      },
                      retryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 12
                      },
                      cronSchedule: {
                        type: "string",
                        id: 13
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 14
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 15
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 16
                      },
                      requestEagerExecution: {
                        type: "bool",
                        id: 17
                      },
                      continuedFailure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 18
                      },
                      lastCompletionResult: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 19
                      },
                      workflowStartDelay: {
                        type: "google.protobuf.Duration",
                        id: 20,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      }
                    }
                  },
                  StartWorkflowExecutionResponse: {
                    fields: {
                      runId: {
                        type: "string",
                        id: 1
                      },
                      eagerWorkflowTask: {
                        type: "PollWorkflowTaskQueueResponse",
                        id: 2
                      }
                    }
                  },
                  GetWorkflowExecutionHistoryRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      execution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      maximumPageSize: {
                        type: "int32",
                        id: 3
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 4
                      },
                      waitNewEvent: {
                        type: "bool",
                        id: 5
                      },
                      historyEventFilterType: {
                        type: "temporal.api.enums.v1.HistoryEventFilterType",
                        id: 6
                      },
                      skipArchival: {
                        type: "bool",
                        id: 7
                      }
                    }
                  },
                  GetWorkflowExecutionHistoryResponse: {
                    fields: {
                      history: {
                        type: "temporal.api.history.v1.History",
                        id: 1
                      },
                      rawHistory: {
                        rule: "repeated",
                        type: "temporal.api.common.v1.DataBlob",
                        id: 2
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 3
                      },
                      archived: {
                        type: "bool",
                        id: 4
                      }
                    }
                  },
                  GetWorkflowExecutionHistoryReverseRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      execution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      maximumPageSize: {
                        type: "int32",
                        id: 3
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 4
                      }
                    }
                  },
                  GetWorkflowExecutionHistoryReverseResponse: {
                    fields: {
                      history: {
                        type: "temporal.api.history.v1.History",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 3
                      }
                    }
                  },
                  PollWorkflowTaskQueueRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      binaryChecksum: {
                        type: "string",
                        id: 4
                      },
                      workerVersionCapabilities: {
                        type: "temporal.api.common.v1.WorkerVersionCapabilities",
                        id: 5
                      }
                    }
                  },
                  PollWorkflowTaskQueueResponse: {
                    fields: {
                      taskToken: {
                        type: "bytes",
                        id: 1
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 3
                      },
                      previousStartedEventId: {
                        type: "int64",
                        id: 4
                      },
                      startedEventId: {
                        type: "int64",
                        id: 5
                      },
                      attempt: {
                        type: "int32",
                        id: 6
                      },
                      backlogCountHint: {
                        type: "int64",
                        id: 7
                      },
                      history: {
                        type: "temporal.api.history.v1.History",
                        id: 8
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 9
                      },
                      query: {
                        type: "temporal.api.query.v1.WorkflowQuery",
                        id: 10
                      },
                      workflowExecutionTaskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 11
                      },
                      scheduledTime: {
                        type: "google.protobuf.Timestamp",
                        id: 12,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      startedTime: {
                        type: "google.protobuf.Timestamp",
                        id: 13,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      queries: {
                        keyType: "string",
                        type: "temporal.api.query.v1.WorkflowQuery",
                        id: 14
                      },
                      messages: {
                        rule: "repeated",
                        type: "temporal.api.protocol.v1.Message",
                        id: 15
                      }
                    }
                  },
                  RespondWorkflowTaskCompletedRequest: {
                    fields: {
                      taskToken: {
                        type: "bytes",
                        id: 1
                      },
                      commands: {
                        rule: "repeated",
                        type: "temporal.api.command.v1.Command",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      stickyAttributes: {
                        type: "temporal.api.taskqueue.v1.StickyExecutionAttributes",
                        id: 4
                      },
                      returnNewWorkflowTask: {
                        type: "bool",
                        id: 5
                      },
                      forceCreateNewWorkflowTask: {
                        type: "bool",
                        id: 6
                      },
                      binaryChecksum: {
                        type: "string",
                        id: 7
                      },
                      queryResults: {
                        keyType: "string",
                        type: "temporal.api.query.v1.WorkflowQueryResult",
                        id: 8
                      },
                      namespace: {
                        type: "string",
                        id: 9
                      },
                      workerVersionStamp: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 10
                      },
                      messages: {
                        rule: "repeated",
                        type: "temporal.api.protocol.v1.Message",
                        id: 11
                      },
                      sdkMetadata: {
                        type: "temporal.api.sdk.v1.WorkflowTaskCompletedMetadata",
                        id: 12
                      },
                      meteringMetadata: {
                        type: "temporal.api.common.v1.MeteringMetadata",
                        id: 13
                      }
                    }
                  },
                  RespondWorkflowTaskCompletedResponse: {
                    fields: {
                      workflowTask: {
                        type: "PollWorkflowTaskQueueResponse",
                        id: 1
                      },
                      activityTasks: {
                        rule: "repeated",
                        type: "PollActivityTaskQueueResponse",
                        id: 2
                      },
                      resetHistoryEventId: {
                        type: "int64",
                        id: 3
                      }
                    }
                  },
                  RespondWorkflowTaskFailedRequest: {
                    fields: {
                      taskToken: {
                        type: "bytes",
                        id: 1
                      },
                      cause: {
                        type: "temporal.api.enums.v1.WorkflowTaskFailedCause",
                        id: 2
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 3
                      },
                      identity: {
                        type: "string",
                        id: 4
                      },
                      binaryChecksum: {
                        type: "string",
                        id: 5
                      },
                      namespace: {
                        type: "string",
                        id: 6
                      },
                      messages: {
                        rule: "repeated",
                        type: "temporal.api.protocol.v1.Message",
                        id: 7
                      },
                      workerVersion: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 8
                      }
                    }
                  },
                  RespondWorkflowTaskFailedResponse: {
                    fields: {}
                  },
                  PollActivityTaskQueueRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      taskQueueMetadata: {
                        type: "temporal.api.taskqueue.v1.TaskQueueMetadata",
                        id: 4
                      },
                      workerVersionCapabilities: {
                        type: "temporal.api.common.v1.WorkerVersionCapabilities",
                        id: 5
                      }
                    }
                  },
                  PollActivityTaskQueueResponse: {
                    fields: {
                      taskToken: {
                        type: "bytes",
                        id: 1
                      },
                      workflowNamespace: {
                        type: "string",
                        id: 2
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 3
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 4
                      },
                      activityType: {
                        type: "temporal.api.common.v1.ActivityType",
                        id: 5
                      },
                      activityId: {
                        type: "string",
                        id: 6
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 7
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 8
                      },
                      heartbeatDetails: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 9
                      },
                      scheduledTime: {
                        type: "google.protobuf.Timestamp",
                        id: 10,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      currentAttemptScheduledTime: {
                        type: "google.protobuf.Timestamp",
                        id: 11,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      startedTime: {
                        type: "google.protobuf.Timestamp",
                        id: 12,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      attempt: {
                        type: "int32",
                        id: 13
                      },
                      scheduleToCloseTimeout: {
                        type: "google.protobuf.Duration",
                        id: 14,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      startToCloseTimeout: {
                        type: "google.protobuf.Duration",
                        id: 15,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      heartbeatTimeout: {
                        type: "google.protobuf.Duration",
                        id: 16,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      retryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 17
                      }
                    }
                  },
                  RecordActivityTaskHeartbeatRequest: {
                    fields: {
                      taskToken: {
                        type: "bytes",
                        id: 1
                      },
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      namespace: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  RecordActivityTaskHeartbeatResponse: {
                    fields: {
                      cancelRequested: {
                        type: "bool",
                        id: 1
                      }
                    }
                  },
                  RecordActivityTaskHeartbeatByIdRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowId: {
                        type: "string",
                        id: 2
                      },
                      runId: {
                        type: "string",
                        id: 3
                      },
                      activityId: {
                        type: "string",
                        id: 4
                      },
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 5
                      },
                      identity: {
                        type: "string",
                        id: 6
                      }
                    }
                  },
                  RecordActivityTaskHeartbeatByIdResponse: {
                    fields: {
                      cancelRequested: {
                        type: "bool",
                        id: 1
                      }
                    }
                  },
                  RespondActivityTaskCompletedRequest: {
                    fields: {
                      taskToken: {
                        type: "bytes",
                        id: 1
                      },
                      result: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      namespace: {
                        type: "string",
                        id: 4
                      },
                      workerVersion: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 5
                      }
                    }
                  },
                  RespondActivityTaskCompletedResponse: {
                    fields: {}
                  },
                  RespondActivityTaskCompletedByIdRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowId: {
                        type: "string",
                        id: 2
                      },
                      runId: {
                        type: "string",
                        id: 3
                      },
                      activityId: {
                        type: "string",
                        id: 4
                      },
                      result: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 5
                      },
                      identity: {
                        type: "string",
                        id: 6
                      }
                    }
                  },
                  RespondActivityTaskCompletedByIdResponse: {
                    fields: {}
                  },
                  RespondActivityTaskFailedRequest: {
                    fields: {
                      taskToken: {
                        type: "bytes",
                        id: 1
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      namespace: {
                        type: "string",
                        id: 4
                      },
                      lastHeartbeatDetails: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 5
                      },
                      workerVersion: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 6
                      }
                    }
                  },
                  RespondActivityTaskFailedResponse: {
                    fields: {
                      failures: {
                        rule: "repeated",
                        type: "temporal.api.failure.v1.Failure",
                        id: 1
                      }
                    }
                  },
                  RespondActivityTaskFailedByIdRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowId: {
                        type: "string",
                        id: 2
                      },
                      runId: {
                        type: "string",
                        id: 3
                      },
                      activityId: {
                        type: "string",
                        id: 4
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 5
                      },
                      identity: {
                        type: "string",
                        id: 6
                      },
                      lastHeartbeatDetails: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 7
                      }
                    }
                  },
                  RespondActivityTaskFailedByIdResponse: {
                    fields: {
                      failures: {
                        rule: "repeated",
                        type: "temporal.api.failure.v1.Failure",
                        id: 1
                      }
                    }
                  },
                  RespondActivityTaskCanceledRequest: {
                    fields: {
                      taskToken: {
                        type: "bytes",
                        id: 1
                      },
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      namespace: {
                        type: "string",
                        id: 4
                      },
                      workerVersion: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 5
                      }
                    }
                  },
                  RespondActivityTaskCanceledResponse: {
                    fields: {}
                  },
                  RespondActivityTaskCanceledByIdRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowId: {
                        type: "string",
                        id: 2
                      },
                      runId: {
                        type: "string",
                        id: 3
                      },
                      activityId: {
                        type: "string",
                        id: 4
                      },
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 5
                      },
                      identity: {
                        type: "string",
                        id: 6
                      }
                    }
                  },
                  RespondActivityTaskCanceledByIdResponse: {
                    fields: {}
                  },
                  RequestCancelWorkflowExecutionRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      requestId: {
                        type: "string",
                        id: 4
                      },
                      firstExecutionRunId: {
                        type: "string",
                        id: 5
                      },
                      reason: {
                        type: "string",
                        id: 6
                      }
                    }
                  },
                  RequestCancelWorkflowExecutionResponse: {
                    fields: {}
                  },
                  SignalWorkflowExecutionRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      signalName: {
                        type: "string",
                        id: 3
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 4
                      },
                      identity: {
                        type: "string",
                        id: 5
                      },
                      requestId: {
                        type: "string",
                        id: 6
                      },
                      control: {
                        type: "string",
                        id: 7
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 8
                      },
                      skipGenerateWorkflowTask: {
                        type: "bool",
                        id: 9
                      }
                    }
                  },
                  SignalWorkflowExecutionResponse: {
                    fields: {}
                  },
                  SignalWithStartWorkflowExecutionRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowId: {
                        type: "string",
                        id: 2
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 3
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 4
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 5
                      },
                      workflowExecutionTimeout: {
                        type: "google.protobuf.Duration",
                        id: 6,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowRunTimeout: {
                        type: "google.protobuf.Duration",
                        id: 7,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskTimeout: {
                        type: "google.protobuf.Duration",
                        id: 8,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      identity: {
                        type: "string",
                        id: 9
                      },
                      requestId: {
                        type: "string",
                        id: 10
                      },
                      workflowIdReusePolicy: {
                        type: "temporal.api.enums.v1.WorkflowIdReusePolicy",
                        id: 11
                      },
                      signalName: {
                        type: "string",
                        id: 12
                      },
                      signalInput: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 13
                      },
                      control: {
                        type: "string",
                        id: 14
                      },
                      retryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 15
                      },
                      cronSchedule: {
                        type: "string",
                        id: 16
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 17
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 18
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 19
                      },
                      workflowStartDelay: {
                        type: "google.protobuf.Duration",
                        id: 20,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      skipGenerateWorkflowTask: {
                        type: "bool",
                        id: 21
                      }
                    }
                  },
                  SignalWithStartWorkflowExecutionResponse: {
                    fields: {
                      runId: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  ResetWorkflowExecutionRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      reason: {
                        type: "string",
                        id: 3
                      },
                      workflowTaskFinishEventId: {
                        type: "int64",
                        id: 4
                      },
                      requestId: {
                        type: "string",
                        id: 5
                      },
                      resetReapplyType: {
                        type: "temporal.api.enums.v1.ResetReapplyType",
                        id: 6
                      }
                    }
                  },
                  ResetWorkflowExecutionResponse: {
                    fields: {
                      runId: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  TerminateWorkflowExecutionRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      reason: {
                        type: "string",
                        id: 3
                      },
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 4
                      },
                      identity: {
                        type: "string",
                        id: 5
                      },
                      firstExecutionRunId: {
                        type: "string",
                        id: 6
                      }
                    }
                  },
                  TerminateWorkflowExecutionResponse: {
                    fields: {}
                  },
                  DeleteWorkflowExecutionRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      }
                    }
                  },
                  DeleteWorkflowExecutionResponse: {
                    fields: {}
                  },
                  ListOpenWorkflowExecutionsRequest: {
                    oneofs: {
                      filters: {
                        oneof: [
                          "executionFilter",
                          "typeFilter"
                        ]
                      }
                    },
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      maximumPageSize: {
                        type: "int32",
                        id: 2
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 3
                      },
                      startTimeFilter: {
                        type: "temporal.api.filter.v1.StartTimeFilter",
                        id: 4
                      },
                      executionFilter: {
                        type: "temporal.api.filter.v1.WorkflowExecutionFilter",
                        id: 5
                      },
                      typeFilter: {
                        type: "temporal.api.filter.v1.WorkflowTypeFilter",
                        id: 6
                      }
                    }
                  },
                  ListOpenWorkflowExecutionsResponse: {
                    fields: {
                      executions: {
                        rule: "repeated",
                        type: "temporal.api.workflow.v1.WorkflowExecutionInfo",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  ListClosedWorkflowExecutionsRequest: {
                    oneofs: {
                      filters: {
                        oneof: [
                          "executionFilter",
                          "typeFilter",
                          "statusFilter"
                        ]
                      }
                    },
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      maximumPageSize: {
                        type: "int32",
                        id: 2
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 3
                      },
                      startTimeFilter: {
                        type: "temporal.api.filter.v1.StartTimeFilter",
                        id: 4
                      },
                      executionFilter: {
                        type: "temporal.api.filter.v1.WorkflowExecutionFilter",
                        id: 5
                      },
                      typeFilter: {
                        type: "temporal.api.filter.v1.WorkflowTypeFilter",
                        id: 6
                      },
                      statusFilter: {
                        type: "temporal.api.filter.v1.StatusFilter",
                        id: 7
                      }
                    }
                  },
                  ListClosedWorkflowExecutionsResponse: {
                    fields: {
                      executions: {
                        rule: "repeated",
                        type: "temporal.api.workflow.v1.WorkflowExecutionInfo",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  ListWorkflowExecutionsRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      pageSize: {
                        type: "int32",
                        id: 2
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 3
                      },
                      query: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  ListWorkflowExecutionsResponse: {
                    fields: {
                      executions: {
                        rule: "repeated",
                        type: "temporal.api.workflow.v1.WorkflowExecutionInfo",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  ListArchivedWorkflowExecutionsRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      pageSize: {
                        type: "int32",
                        id: 2
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 3
                      },
                      query: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  ListArchivedWorkflowExecutionsResponse: {
                    fields: {
                      executions: {
                        rule: "repeated",
                        type: "temporal.api.workflow.v1.WorkflowExecutionInfo",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  ScanWorkflowExecutionsRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      pageSize: {
                        type: "int32",
                        id: 2
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 3
                      },
                      query: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  ScanWorkflowExecutionsResponse: {
                    fields: {
                      executions: {
                        rule: "repeated",
                        type: "temporal.api.workflow.v1.WorkflowExecutionInfo",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  CountWorkflowExecutionsRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      query: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  CountWorkflowExecutionsResponse: {
                    fields: {
                      count: {
                        type: "int64",
                        id: 1
                      }
                    }
                  },
                  GetSearchAttributesRequest: {
                    fields: {}
                  },
                  GetSearchAttributesResponse: {
                    fields: {
                      keys: {
                        keyType: "string",
                        type: "temporal.api.enums.v1.IndexedValueType",
                        id: 1
                      }
                    }
                  },
                  RespondQueryTaskCompletedRequest: {
                    fields: {
                      taskToken: {
                        type: "bytes",
                        id: 1
                      },
                      completedType: {
                        type: "temporal.api.enums.v1.QueryResultType",
                        id: 2
                      },
                      queryResult: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 3
                      },
                      errorMessage: {
                        type: "string",
                        id: 4
                      },
                      namespace: {
                        type: "string",
                        id: 6
                      }
                    },
                    reserved: [
                      [
                        5,
                        5
                      ]
                    ]
                  },
                  RespondQueryTaskCompletedResponse: {
                    fields: {}
                  },
                  ResetStickyTaskQueueRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      execution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      }
                    }
                  },
                  ResetStickyTaskQueueResponse: {
                    fields: {}
                  },
                  QueryWorkflowRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      execution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      query: {
                        type: "temporal.api.query.v1.WorkflowQuery",
                        id: 3
                      },
                      queryRejectCondition: {
                        type: "temporal.api.enums.v1.QueryRejectCondition",
                        id: 4
                      }
                    }
                  },
                  QueryWorkflowResponse: {
                    fields: {
                      queryResult: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      },
                      queryRejected: {
                        type: "temporal.api.query.v1.QueryRejected",
                        id: 2
                      }
                    }
                  },
                  DescribeWorkflowExecutionRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      execution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      }
                    }
                  },
                  DescribeWorkflowExecutionResponse: {
                    fields: {
                      executionConfig: {
                        type: "temporal.api.workflow.v1.WorkflowExecutionConfig",
                        id: 1
                      },
                      workflowExecutionInfo: {
                        type: "temporal.api.workflow.v1.WorkflowExecutionInfo",
                        id: 2
                      },
                      pendingActivities: {
                        rule: "repeated",
                        type: "temporal.api.workflow.v1.PendingActivityInfo",
                        id: 3
                      },
                      pendingChildren: {
                        rule: "repeated",
                        type: "temporal.api.workflow.v1.PendingChildExecutionInfo",
                        id: 4
                      },
                      pendingWorkflowTask: {
                        type: "temporal.api.workflow.v1.PendingWorkflowTaskInfo",
                        id: 5
                      }
                    }
                  },
                  DescribeTaskQueueRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 2
                      },
                      taskQueueType: {
                        type: "temporal.api.enums.v1.TaskQueueType",
                        id: 3
                      },
                      includeTaskQueueStatus: {
                        type: "bool",
                        id: 4
                      }
                    }
                  },
                  DescribeTaskQueueResponse: {
                    fields: {
                      pollers: {
                        rule: "repeated",
                        type: "temporal.api.taskqueue.v1.PollerInfo",
                        id: 1
                      },
                      taskQueueStatus: {
                        type: "temporal.api.taskqueue.v1.TaskQueueStatus",
                        id: 2
                      }
                    }
                  },
                  GetClusterInfoRequest: {
                    fields: {}
                  },
                  GetClusterInfoResponse: {
                    fields: {
                      supportedClients: {
                        keyType: "string",
                        type: "string",
                        id: 1
                      },
                      serverVersion: {
                        type: "string",
                        id: 2
                      },
                      clusterId: {
                        type: "string",
                        id: 3
                      },
                      versionInfo: {
                        type: "temporal.api.version.v1.VersionInfo",
                        id: 4
                      },
                      clusterName: {
                        type: "string",
                        id: 5
                      },
                      historyShardCount: {
                        type: "int32",
                        id: 6
                      },
                      persistenceStore: {
                        type: "string",
                        id: 7
                      },
                      visibilityStore: {
                        type: "string",
                        id: 8
                      }
                    }
                  },
                  GetSystemInfoRequest: {
                    fields: {}
                  },
                  GetSystemInfoResponse: {
                    fields: {
                      serverVersion: {
                        type: "string",
                        id: 1
                      },
                      capabilities: {
                        type: "Capabilities",
                        id: 2
                      }
                    },
                    nested: {
                      Capabilities: {
                        fields: {
                          signalAndQueryHeader: {
                            type: "bool",
                            id: 1
                          },
                          internalErrorDifferentiation: {
                            type: "bool",
                            id: 2
                          },
                          activityFailureIncludeHeartbeat: {
                            type: "bool",
                            id: 3
                          },
                          supportsSchedules: {
                            type: "bool",
                            id: 4
                          },
                          encodedFailureAttributes: {
                            type: "bool",
                            id: 5
                          },
                          buildIdBasedVersioning: {
                            type: "bool",
                            id: 6
                          },
                          upsertMemo: {
                            type: "bool",
                            id: 7
                          },
                          eagerWorkflowStart: {
                            type: "bool",
                            id: 8
                          },
                          sdkMetadata: {
                            type: "bool",
                            id: 9
                          }
                        }
                      }
                    }
                  },
                  ListTaskQueuePartitionsRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 2
                      }
                    }
                  },
                  ListTaskQueuePartitionsResponse: {
                    fields: {
                      activityTaskQueuePartitions: {
                        rule: "repeated",
                        type: "temporal.api.taskqueue.v1.TaskQueuePartitionMetadata",
                        id: 1
                      },
                      workflowTaskQueuePartitions: {
                        rule: "repeated",
                        type: "temporal.api.taskqueue.v1.TaskQueuePartitionMetadata",
                        id: 2
                      }
                    }
                  },
                  CreateScheduleRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      scheduleId: {
                        type: "string",
                        id: 2
                      },
                      schedule: {
                        type: "temporal.api.schedule.v1.Schedule",
                        id: 3
                      },
                      initialPatch: {
                        type: "temporal.api.schedule.v1.SchedulePatch",
                        id: 4
                      },
                      identity: {
                        type: "string",
                        id: 5
                      },
                      requestId: {
                        type: "string",
                        id: 6
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 7
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 8
                      }
                    }
                  },
                  CreateScheduleResponse: {
                    fields: {
                      conflictToken: {
                        type: "bytes",
                        id: 1
                      }
                    }
                  },
                  DescribeScheduleRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      scheduleId: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  DescribeScheduleResponse: {
                    fields: {
                      schedule: {
                        type: "temporal.api.schedule.v1.Schedule",
                        id: 1
                      },
                      info: {
                        type: "temporal.api.schedule.v1.ScheduleInfo",
                        id: 2
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 3
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 4
                      },
                      conflictToken: {
                        type: "bytes",
                        id: 5
                      }
                    }
                  },
                  UpdateScheduleRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      scheduleId: {
                        type: "string",
                        id: 2
                      },
                      schedule: {
                        type: "temporal.api.schedule.v1.Schedule",
                        id: 3
                      },
                      conflictToken: {
                        type: "bytes",
                        id: 4
                      },
                      identity: {
                        type: "string",
                        id: 5
                      },
                      requestId: {
                        type: "string",
                        id: 6
                      }
                    }
                  },
                  UpdateScheduleResponse: {
                    fields: {}
                  },
                  PatchScheduleRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      scheduleId: {
                        type: "string",
                        id: 2
                      },
                      patch: {
                        type: "temporal.api.schedule.v1.SchedulePatch",
                        id: 3
                      },
                      identity: {
                        type: "string",
                        id: 4
                      },
                      requestId: {
                        type: "string",
                        id: 5
                      }
                    }
                  },
                  PatchScheduleResponse: {
                    fields: {}
                  },
                  ListScheduleMatchingTimesRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      scheduleId: {
                        type: "string",
                        id: 2
                      },
                      startTime: {
                        type: "google.protobuf.Timestamp",
                        id: 3,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      endTime: {
                        type: "google.protobuf.Timestamp",
                        id: 4,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      }
                    }
                  },
                  ListScheduleMatchingTimesResponse: {
                    fields: {
                      startTime: {
                        rule: "repeated",
                        type: "google.protobuf.Timestamp",
                        id: 1,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      }
                    }
                  },
                  DeleteScheduleRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      scheduleId: {
                        type: "string",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  DeleteScheduleResponse: {
                    fields: {}
                  },
                  ListSchedulesRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      maximumPageSize: {
                        type: "int32",
                        id: 2
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 3
                      }
                    }
                  },
                  ListSchedulesResponse: {
                    fields: {
                      schedules: {
                        rule: "repeated",
                        type: "temporal.api.schedule.v1.ScheduleListEntry",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  UpdateWorkerBuildIdCompatibilityRequest: {
                    oneofs: {
                      operation: {
                        oneof: [
                          "addNewBuildIdInNewDefaultSet",
                          "addNewCompatibleBuildId",
                          "promoteSetByBuildId",
                          "promoteBuildIdWithinSet",
                          "mergeSets"
                        ]
                      }
                    },
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      taskQueue: {
                        type: "string",
                        id: 2
                      },
                      addNewBuildIdInNewDefaultSet: {
                        type: "string",
                        id: 3
                      },
                      addNewCompatibleBuildId: {
                        type: "AddNewCompatibleVersion",
                        id: 4
                      },
                      promoteSetByBuildId: {
                        type: "string",
                        id: 5
                      },
                      promoteBuildIdWithinSet: {
                        type: "string",
                        id: 6
                      },
                      mergeSets: {
                        type: "MergeSets",
                        id: 7
                      }
                    },
                    nested: {
                      AddNewCompatibleVersion: {
                        fields: {
                          newBuildId: {
                            type: "string",
                            id: 1
                          },
                          existingCompatibleBuildId: {
                            type: "string",
                            id: 2
                          },
                          makeSetDefault: {
                            type: "bool",
                            id: 3
                          }
                        }
                      },
                      MergeSets: {
                        fields: {
                          primarySetBuildId: {
                            type: "string",
                            id: 1
                          },
                          secondarySetBuildId: {
                            type: "string",
                            id: 2
                          }
                        }
                      }
                    }
                  },
                  UpdateWorkerBuildIdCompatibilityResponse: {
                    fields: {
                      versionSetId: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  GetWorkerBuildIdCompatibilityRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      taskQueue: {
                        type: "string",
                        id: 2
                      },
                      maxSets: {
                        type: "int32",
                        id: 3
                      }
                    }
                  },
                  GetWorkerBuildIdCompatibilityResponse: {
                    fields: {
                      majorVersionSets: {
                        rule: "repeated",
                        type: "temporal.api.taskqueue.v1.CompatibleVersionSet",
                        id: 1
                      }
                    }
                  },
                  GetWorkerTaskReachabilityRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      buildIds: {
                        rule: "repeated",
                        type: "string",
                        id: 2
                      },
                      taskQueues: {
                        rule: "repeated",
                        type: "string",
                        id: 3
                      },
                      reachability: {
                        type: "temporal.api.enums.v1.TaskReachability",
                        id: 4
                      }
                    }
                  },
                  GetWorkerTaskReachabilityResponse: {
                    fields: {
                      buildIdReachability: {
                        rule: "repeated",
                        type: "temporal.api.taskqueue.v1.BuildIdReachability",
                        id: 1
                      }
                    }
                  },
                  UpdateWorkflowExecutionRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      firstExecutionRunId: {
                        type: "string",
                        id: 3
                      },
                      waitPolicy: {
                        type: "temporal.api.update.v1.WaitPolicy",
                        id: 4
                      },
                      request: {
                        type: "temporal.api.update.v1.Request",
                        id: 5
                      }
                    }
                  },
                  UpdateWorkflowExecutionResponse: {
                    fields: {
                      updateRef: {
                        type: "temporal.api.update.v1.UpdateRef",
                        id: 1
                      },
                      outcome: {
                        type: "temporal.api.update.v1.Outcome",
                        id: 2
                      }
                    }
                  },
                  StartBatchOperationRequest: {
                    oneofs: {
                      operation: {
                        oneof: [
                          "terminationOperation",
                          "signalOperation",
                          "cancellationOperation",
                          "deletionOperation",
                          "resetOperation"
                        ]
                      }
                    },
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      visibilityQuery: {
                        type: "string",
                        id: 2
                      },
                      jobId: {
                        type: "string",
                        id: 3
                      },
                      reason: {
                        type: "string",
                        id: 4
                      },
                      executions: {
                        rule: "repeated",
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 5
                      },
                      terminationOperation: {
                        type: "temporal.api.batch.v1.BatchOperationTermination",
                        id: 10
                      },
                      signalOperation: {
                        type: "temporal.api.batch.v1.BatchOperationSignal",
                        id: 11
                      },
                      cancellationOperation: {
                        type: "temporal.api.batch.v1.BatchOperationCancellation",
                        id: 12
                      },
                      deletionOperation: {
                        type: "temporal.api.batch.v1.BatchOperationDeletion",
                        id: 13
                      },
                      resetOperation: {
                        type: "temporal.api.batch.v1.BatchOperationReset",
                        id: 14
                      }
                    }
                  },
                  StartBatchOperationResponse: {
                    fields: {}
                  },
                  StopBatchOperationRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      jobId: {
                        type: "string",
                        id: 2
                      },
                      reason: {
                        type: "string",
                        id: 3
                      },
                      identity: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  StopBatchOperationResponse: {
                    fields: {}
                  },
                  DescribeBatchOperationRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      jobId: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  DescribeBatchOperationResponse: {
                    fields: {
                      operationType: {
                        type: "temporal.api.enums.v1.BatchOperationType",
                        id: 1
                      },
                      jobId: {
                        type: "string",
                        id: 2
                      },
                      state: {
                        type: "temporal.api.enums.v1.BatchOperationState",
                        id: 3
                      },
                      startTime: {
                        type: "google.protobuf.Timestamp",
                        id: 4,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      closeTime: {
                        type: "google.protobuf.Timestamp",
                        id: 5,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      totalOperationCount: {
                        type: "int64",
                        id: 6
                      },
                      completeOperationCount: {
                        type: "int64",
                        id: 7
                      },
                      failureOperationCount: {
                        type: "int64",
                        id: 8
                      },
                      identity: {
                        type: "string",
                        id: 9
                      },
                      reason: {
                        type: "string",
                        id: 10
                      }
                    }
                  },
                  ListBatchOperationsRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      pageSize: {
                        type: "int32",
                        id: 2
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 3
                      }
                    }
                  },
                  ListBatchOperationsResponse: {
                    fields: {
                      operationInfo: {
                        rule: "repeated",
                        type: "temporal.api.batch.v1.BatchOperationInfo",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  PollWorkflowExecutionUpdateRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      updateRef: {
                        type: "temporal.api.update.v1.UpdateRef",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      waitPolicy: {
                        type: "temporal.api.update.v1.WaitPolicy",
                        id: 4
                      }
                    }
                  },
                  PollWorkflowExecutionUpdateResponse: {
                    fields: {
                      outcome: {
                        type: "temporal.api.update.v1.Outcome",
                        id: 1
                      }
                    }
                  }
                }
              }
            }
          },
          history: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/history/v1;history",
                  java_package: "io.temporal.api.history.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::History::V1",
                  csharp_namespace: "Temporalio.Api.History.V1"
                },
                nested: {
                  WorkflowExecutionStartedEventAttributes: {
                    fields: {
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 1
                      },
                      parentWorkflowNamespace: {
                        type: "string",
                        id: 2
                      },
                      parentWorkflowNamespaceId: {
                        type: "string",
                        id: 27
                      },
                      parentWorkflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 3
                      },
                      parentInitiatedEventId: {
                        type: "int64",
                        id: 4
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 5
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 6
                      },
                      workflowExecutionTimeout: {
                        type: "google.protobuf.Duration",
                        id: 7,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowRunTimeout: {
                        type: "google.protobuf.Duration",
                        id: 8,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskTimeout: {
                        type: "google.protobuf.Duration",
                        id: 9,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      continuedExecutionRunId: {
                        type: "string",
                        id: 10
                      },
                      initiator: {
                        type: "temporal.api.enums.v1.ContinueAsNewInitiator",
                        id: 11
                      },
                      continuedFailure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 12
                      },
                      lastCompletionResult: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 13
                      },
                      originalExecutionRunId: {
                        type: "string",
                        id: 14
                      },
                      identity: {
                        type: "string",
                        id: 15
                      },
                      firstExecutionRunId: {
                        type: "string",
                        id: 16
                      },
                      retryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 17
                      },
                      attempt: {
                        type: "int32",
                        id: 18
                      },
                      workflowExecutionExpirationTime: {
                        type: "google.protobuf.Timestamp",
                        id: 19,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      cronSchedule: {
                        type: "string",
                        id: 20
                      },
                      firstWorkflowTaskBackoff: {
                        type: "google.protobuf.Duration",
                        id: 21,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 22
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 23
                      },
                      prevAutoResetPoints: {
                        type: "temporal.api.workflow.v1.ResetPoints",
                        id: 24
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 25
                      },
                      parentInitiatedEventVersion: {
                        type: "int64",
                        id: 26
                      },
                      workflowId: {
                        type: "string",
                        id: 28
                      },
                      sourceVersionStamp: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 29
                      }
                    }
                  },
                  WorkflowExecutionCompletedEventAttributes: {
                    fields: {
                      result: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 2
                      },
                      newExecutionRunId: {
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  WorkflowExecutionFailedEventAttributes: {
                    fields: {
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 1
                      },
                      retryState: {
                        type: "temporal.api.enums.v1.RetryState",
                        id: 2
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 3
                      },
                      newExecutionRunId: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  WorkflowExecutionTimedOutEventAttributes: {
                    fields: {
                      retryState: {
                        type: "temporal.api.enums.v1.RetryState",
                        id: 1
                      },
                      newExecutionRunId: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  WorkflowExecutionContinuedAsNewEventAttributes: {
                    fields: {
                      newExecutionRunId: {
                        type: "string",
                        id: 1
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 2
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 3
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 4
                      },
                      workflowRunTimeout: {
                        type: "google.protobuf.Duration",
                        id: 5,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskTimeout: {
                        type: "google.protobuf.Duration",
                        id: 6,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 7
                      },
                      backoffStartInterval: {
                        type: "google.protobuf.Duration",
                        id: 8,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      initiator: {
                        type: "temporal.api.enums.v1.ContinueAsNewInitiator",
                        id: 9
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 10
                      },
                      lastCompletionResult: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 11
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 12
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 13
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 14
                      },
                      useCompatibleVersion: {
                        type: "bool",
                        id: 15
                      }
                    }
                  },
                  WorkflowTaskScheduledEventAttributes: {
                    fields: {
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 1
                      },
                      startToCloseTimeout: {
                        type: "google.protobuf.Duration",
                        id: 2,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      attempt: {
                        type: "int32",
                        id: 3
                      }
                    }
                  },
                  WorkflowTaskStartedEventAttributes: {
                    fields: {
                      scheduledEventId: {
                        type: "int64",
                        id: 1
                      },
                      identity: {
                        type: "string",
                        id: 2
                      },
                      requestId: {
                        type: "string",
                        id: 3
                      },
                      suggestContinueAsNew: {
                        type: "bool",
                        id: 4
                      },
                      historySizeBytes: {
                        type: "int64",
                        id: 5
                      }
                    }
                  },
                  WorkflowTaskCompletedEventAttributes: {
                    fields: {
                      scheduledEventId: {
                        type: "int64",
                        id: 1
                      },
                      startedEventId: {
                        type: "int64",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      binaryChecksum: {
                        type: "string",
                        id: 4
                      },
                      workerVersion: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 5
                      },
                      sdkMetadata: {
                        type: "temporal.api.sdk.v1.WorkflowTaskCompletedMetadata",
                        id: 6
                      },
                      meteringMetadata: {
                        type: "temporal.api.common.v1.MeteringMetadata",
                        id: 13
                      }
                    }
                  },
                  WorkflowTaskTimedOutEventAttributes: {
                    fields: {
                      scheduledEventId: {
                        type: "int64",
                        id: 1
                      },
                      startedEventId: {
                        type: "int64",
                        id: 2
                      },
                      timeoutType: {
                        type: "temporal.api.enums.v1.TimeoutType",
                        id: 3
                      }
                    }
                  },
                  WorkflowTaskFailedEventAttributes: {
                    fields: {
                      scheduledEventId: {
                        type: "int64",
                        id: 1
                      },
                      startedEventId: {
                        type: "int64",
                        id: 2
                      },
                      cause: {
                        type: "temporal.api.enums.v1.WorkflowTaskFailedCause",
                        id: 3
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 4
                      },
                      identity: {
                        type: "string",
                        id: 5
                      },
                      baseRunId: {
                        type: "string",
                        id: 6
                      },
                      newRunId: {
                        type: "string",
                        id: 7
                      },
                      forkEventVersion: {
                        type: "int64",
                        id: 8
                      },
                      binaryChecksum: {
                        type: "string",
                        id: 9
                      },
                      workerVersion: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 10
                      }
                    }
                  },
                  ActivityTaskScheduledEventAttributes: {
                    fields: {
                      activityId: {
                        type: "string",
                        id: 1
                      },
                      activityType: {
                        type: "temporal.api.common.v1.ActivityType",
                        id: 2
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 4
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 5
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 6
                      },
                      scheduleToCloseTimeout: {
                        type: "google.protobuf.Duration",
                        id: 7,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      scheduleToStartTimeout: {
                        type: "google.protobuf.Duration",
                        id: 8,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      startToCloseTimeout: {
                        type: "google.protobuf.Duration",
                        id: 9,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      heartbeatTimeout: {
                        type: "google.protobuf.Duration",
                        id: 10,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 11
                      },
                      retryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 12
                      },
                      useCompatibleVersion: {
                        type: "bool",
                        id: 13
                      }
                    },
                    reserved: [
                      [
                        3,
                        3
                      ]
                    ]
                  },
                  ActivityTaskStartedEventAttributes: {
                    fields: {
                      scheduledEventId: {
                        type: "int64",
                        id: 1
                      },
                      identity: {
                        type: "string",
                        id: 2
                      },
                      requestId: {
                        type: "string",
                        id: 3
                      },
                      attempt: {
                        type: "int32",
                        id: 4
                      },
                      lastFailure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 5
                      }
                    }
                  },
                  ActivityTaskCompletedEventAttributes: {
                    fields: {
                      result: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      },
                      scheduledEventId: {
                        type: "int64",
                        id: 2
                      },
                      startedEventId: {
                        type: "int64",
                        id: 3
                      },
                      identity: {
                        type: "string",
                        id: 4
                      },
                      workerVersion: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 5
                      }
                    }
                  },
                  ActivityTaskFailedEventAttributes: {
                    fields: {
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 1
                      },
                      scheduledEventId: {
                        type: "int64",
                        id: 2
                      },
                      startedEventId: {
                        type: "int64",
                        id: 3
                      },
                      identity: {
                        type: "string",
                        id: 4
                      },
                      retryState: {
                        type: "temporal.api.enums.v1.RetryState",
                        id: 5
                      },
                      workerVersion: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 6
                      }
                    }
                  },
                  ActivityTaskTimedOutEventAttributes: {
                    fields: {
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 1
                      },
                      scheduledEventId: {
                        type: "int64",
                        id: 2
                      },
                      startedEventId: {
                        type: "int64",
                        id: 3
                      },
                      retryState: {
                        type: "temporal.api.enums.v1.RetryState",
                        id: 4
                      }
                    }
                  },
                  ActivityTaskCancelRequestedEventAttributes: {
                    fields: {
                      scheduledEventId: {
                        type: "int64",
                        id: 1
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 2
                      }
                    }
                  },
                  ActivityTaskCanceledEventAttributes: {
                    fields: {
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      },
                      latestCancelRequestedEventId: {
                        type: "int64",
                        id: 2
                      },
                      scheduledEventId: {
                        type: "int64",
                        id: 3
                      },
                      startedEventId: {
                        type: "int64",
                        id: 4
                      },
                      identity: {
                        type: "string",
                        id: 5
                      },
                      workerVersion: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 6
                      }
                    }
                  },
                  TimerStartedEventAttributes: {
                    fields: {
                      timerId: {
                        type: "string",
                        id: 1
                      },
                      startToFireTimeout: {
                        type: "google.protobuf.Duration",
                        id: 2,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 3
                      }
                    }
                  },
                  TimerFiredEventAttributes: {
                    fields: {
                      timerId: {
                        type: "string",
                        id: 1
                      },
                      startedEventId: {
                        type: "int64",
                        id: 2
                      }
                    }
                  },
                  TimerCanceledEventAttributes: {
                    fields: {
                      timerId: {
                        type: "string",
                        id: 1
                      },
                      startedEventId: {
                        type: "int64",
                        id: 2
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 3
                      },
                      identity: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  WorkflowExecutionCancelRequestedEventAttributes: {
                    fields: {
                      cause: {
                        type: "string",
                        id: 1
                      },
                      externalInitiatedEventId: {
                        type: "int64",
                        id: 2
                      },
                      externalWorkflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 3
                      },
                      identity: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  WorkflowExecutionCanceledEventAttributes: {
                    fields: {
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 1
                      },
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      }
                    }
                  },
                  MarkerRecordedEventAttributes: {
                    fields: {
                      markerName: {
                        type: "string",
                        id: 1
                      },
                      details: {
                        keyType: "string",
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 3
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 4
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 5
                      }
                    }
                  },
                  WorkflowExecutionSignaledEventAttributes: {
                    fields: {
                      signalName: {
                        type: "string",
                        id: 1
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 4
                      },
                      skipGenerateWorkflowTask: {
                        type: "bool",
                        id: 5
                      }
                    }
                  },
                  WorkflowExecutionTerminatedEventAttributes: {
                    fields: {
                      reason: {
                        type: "string",
                        id: 1
                      },
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  RequestCancelExternalWorkflowExecutionInitiatedEventAttributes: {
                    fields: {
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 1
                      },
                      namespace: {
                        type: "string",
                        id: 2
                      },
                      namespaceId: {
                        type: "string",
                        id: 7
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 3
                      },
                      control: {
                        type: "string",
                        id: 4
                      },
                      childWorkflowOnly: {
                        type: "bool",
                        id: 5
                      },
                      reason: {
                        type: "string",
                        id: 6
                      }
                    }
                  },
                  RequestCancelExternalWorkflowExecutionFailedEventAttributes: {
                    fields: {
                      cause: {
                        type: "temporal.api.enums.v1.CancelExternalWorkflowExecutionFailedCause",
                        id: 1
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 2
                      },
                      namespace: {
                        type: "string",
                        id: 3
                      },
                      namespaceId: {
                        type: "string",
                        id: 7
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 4
                      },
                      initiatedEventId: {
                        type: "int64",
                        id: 5
                      },
                      control: {
                        type: "string",
                        id: 6
                      }
                    }
                  },
                  ExternalWorkflowExecutionCancelRequestedEventAttributes: {
                    fields: {
                      initiatedEventId: {
                        type: "int64",
                        id: 1
                      },
                      namespace: {
                        type: "string",
                        id: 2
                      },
                      namespaceId: {
                        type: "string",
                        id: 4
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 3
                      }
                    }
                  },
                  SignalExternalWorkflowExecutionInitiatedEventAttributes: {
                    fields: {
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 1
                      },
                      namespace: {
                        type: "string",
                        id: 2
                      },
                      namespaceId: {
                        type: "string",
                        id: 9
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 3
                      },
                      signalName: {
                        type: "string",
                        id: 4
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 5
                      },
                      control: {
                        type: "string",
                        id: 6
                      },
                      childWorkflowOnly: {
                        type: "bool",
                        id: 7
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 8
                      }
                    }
                  },
                  SignalExternalWorkflowExecutionFailedEventAttributes: {
                    fields: {
                      cause: {
                        type: "temporal.api.enums.v1.SignalExternalWorkflowExecutionFailedCause",
                        id: 1
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 2
                      },
                      namespace: {
                        type: "string",
                        id: 3
                      },
                      namespaceId: {
                        type: "string",
                        id: 7
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 4
                      },
                      initiatedEventId: {
                        type: "int64",
                        id: 5
                      },
                      control: {
                        type: "string",
                        id: 6
                      }
                    }
                  },
                  ExternalWorkflowExecutionSignaledEventAttributes: {
                    fields: {
                      initiatedEventId: {
                        type: "int64",
                        id: 1
                      },
                      namespace: {
                        type: "string",
                        id: 2
                      },
                      namespaceId: {
                        type: "string",
                        id: 5
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 3
                      },
                      control: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  UpsertWorkflowSearchAttributesEventAttributes: {
                    fields: {
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 1
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 2
                      }
                    }
                  },
                  WorkflowPropertiesModifiedEventAttributes: {
                    fields: {
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 1
                      },
                      upsertedMemo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 2
                      }
                    }
                  },
                  StartChildWorkflowExecutionInitiatedEventAttributes: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      namespaceId: {
                        type: "string",
                        id: 18
                      },
                      workflowId: {
                        type: "string",
                        id: 2
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 3
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 4
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 5
                      },
                      workflowExecutionTimeout: {
                        type: "google.protobuf.Duration",
                        id: 6,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowRunTimeout: {
                        type: "google.protobuf.Duration",
                        id: 7,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskTimeout: {
                        type: "google.protobuf.Duration",
                        id: 8,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      parentClosePolicy: {
                        type: "temporal.api.enums.v1.ParentClosePolicy",
                        id: 9
                      },
                      control: {
                        type: "string",
                        id: 10
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 11
                      },
                      workflowIdReusePolicy: {
                        type: "temporal.api.enums.v1.WorkflowIdReusePolicy",
                        id: 12
                      },
                      retryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 13
                      },
                      cronSchedule: {
                        type: "string",
                        id: 14
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 15
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 16
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 17
                      },
                      useCompatibleVersion: {
                        type: "bool",
                        id: 19
                      }
                    }
                  },
                  StartChildWorkflowExecutionFailedEventAttributes: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      namespaceId: {
                        type: "string",
                        id: 8
                      },
                      workflowId: {
                        type: "string",
                        id: 2
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 3
                      },
                      cause: {
                        type: "temporal.api.enums.v1.StartChildWorkflowExecutionFailedCause",
                        id: 4
                      },
                      control: {
                        type: "string",
                        id: 5
                      },
                      initiatedEventId: {
                        type: "int64",
                        id: 6
                      },
                      workflowTaskCompletedEventId: {
                        type: "int64",
                        id: 7
                      }
                    }
                  },
                  ChildWorkflowExecutionStartedEventAttributes: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      namespaceId: {
                        type: "string",
                        id: 6
                      },
                      initiatedEventId: {
                        type: "int64",
                        id: 2
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 3
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 4
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 5
                      }
                    }
                  },
                  ChildWorkflowExecutionCompletedEventAttributes: {
                    fields: {
                      result: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      },
                      namespace: {
                        type: "string",
                        id: 2
                      },
                      namespaceId: {
                        type: "string",
                        id: 7
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 3
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 4
                      },
                      initiatedEventId: {
                        type: "int64",
                        id: 5
                      },
                      startedEventId: {
                        type: "int64",
                        id: 6
                      }
                    }
                  },
                  ChildWorkflowExecutionFailedEventAttributes: {
                    fields: {
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 1
                      },
                      namespace: {
                        type: "string",
                        id: 2
                      },
                      namespaceId: {
                        type: "string",
                        id: 8
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 3
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 4
                      },
                      initiatedEventId: {
                        type: "int64",
                        id: 5
                      },
                      startedEventId: {
                        type: "int64",
                        id: 6
                      },
                      retryState: {
                        type: "temporal.api.enums.v1.RetryState",
                        id: 7
                      }
                    }
                  },
                  ChildWorkflowExecutionCanceledEventAttributes: {
                    fields: {
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      },
                      namespace: {
                        type: "string",
                        id: 2
                      },
                      namespaceId: {
                        type: "string",
                        id: 7
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 3
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 4
                      },
                      initiatedEventId: {
                        type: "int64",
                        id: 5
                      },
                      startedEventId: {
                        type: "int64",
                        id: 6
                      }
                    }
                  },
                  ChildWorkflowExecutionTimedOutEventAttributes: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      namespaceId: {
                        type: "string",
                        id: 7
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 3
                      },
                      initiatedEventId: {
                        type: "int64",
                        id: 4
                      },
                      startedEventId: {
                        type: "int64",
                        id: 5
                      },
                      retryState: {
                        type: "temporal.api.enums.v1.RetryState",
                        id: 6
                      }
                    }
                  },
                  ChildWorkflowExecutionTerminatedEventAttributes: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      namespaceId: {
                        type: "string",
                        id: 6
                      },
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 3
                      },
                      initiatedEventId: {
                        type: "int64",
                        id: 4
                      },
                      startedEventId: {
                        type: "int64",
                        id: 5
                      }
                    }
                  },
                  WorkflowPropertiesModifiedExternallyEventAttributes: {
                    fields: {
                      newTaskQueue: {
                        type: "string",
                        id: 1
                      },
                      newWorkflowTaskTimeout: {
                        type: "google.protobuf.Duration",
                        id: 2,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      newWorkflowRunTimeout: {
                        type: "google.protobuf.Duration",
                        id: 3,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      newWorkflowExecutionTimeout: {
                        type: "google.protobuf.Duration",
                        id: 4,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      upsertedMemo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 5
                      }
                    }
                  },
                  ActivityPropertiesModifiedExternallyEventAttributes: {
                    fields: {
                      scheduledEventId: {
                        type: "int64",
                        id: 1
                      },
                      newRetryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 2
                      }
                    }
                  },
                  WorkflowExecutionUpdateAcceptedEventAttributes: {
                    fields: {
                      protocolInstanceId: {
                        type: "string",
                        id: 1
                      },
                      acceptedRequestMessageId: {
                        type: "string",
                        id: 2
                      },
                      acceptedRequestSequencingEventId: {
                        type: "int64",
                        id: 3
                      },
                      acceptedRequest: {
                        type: "temporal.api.update.v1.Request",
                        id: 4
                      }
                    }
                  },
                  WorkflowExecutionUpdateCompletedEventAttributes: {
                    fields: {
                      meta: {
                        type: "temporal.api.update.v1.Meta",
                        id: 1
                      },
                      acceptedEventId: {
                        type: "int64",
                        id: 3
                      },
                      outcome: {
                        type: "temporal.api.update.v1.Outcome",
                        id: 2
                      }
                    }
                  },
                  WorkflowExecutionUpdateRejectedEventAttributes: {
                    fields: {
                      protocolInstanceId: {
                        type: "string",
                        id: 1
                      },
                      rejectedRequestMessageId: {
                        type: "string",
                        id: 2
                      },
                      rejectedRequestSequencingEventId: {
                        type: "int64",
                        id: 3
                      },
                      rejectedRequest: {
                        type: "temporal.api.update.v1.Request",
                        id: 4
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 5
                      }
                    }
                  },
                  HistoryEvent: {
                    oneofs: {
                      attributes: {
                        oneof: [
                          "workflowExecutionStartedEventAttributes",
                          "workflowExecutionCompletedEventAttributes",
                          "workflowExecutionFailedEventAttributes",
                          "workflowExecutionTimedOutEventAttributes",
                          "workflowTaskScheduledEventAttributes",
                          "workflowTaskStartedEventAttributes",
                          "workflowTaskCompletedEventAttributes",
                          "workflowTaskTimedOutEventAttributes",
                          "workflowTaskFailedEventAttributes",
                          "activityTaskScheduledEventAttributes",
                          "activityTaskStartedEventAttributes",
                          "activityTaskCompletedEventAttributes",
                          "activityTaskFailedEventAttributes",
                          "activityTaskTimedOutEventAttributes",
                          "timerStartedEventAttributes",
                          "timerFiredEventAttributes",
                          "activityTaskCancelRequestedEventAttributes",
                          "activityTaskCanceledEventAttributes",
                          "timerCanceledEventAttributes",
                          "markerRecordedEventAttributes",
                          "workflowExecutionSignaledEventAttributes",
                          "workflowExecutionTerminatedEventAttributes",
                          "workflowExecutionCancelRequestedEventAttributes",
                          "workflowExecutionCanceledEventAttributes",
                          "requestCancelExternalWorkflowExecutionInitiatedEventAttributes",
                          "requestCancelExternalWorkflowExecutionFailedEventAttributes",
                          "externalWorkflowExecutionCancelRequestedEventAttributes",
                          "workflowExecutionContinuedAsNewEventAttributes",
                          "startChildWorkflowExecutionInitiatedEventAttributes",
                          "startChildWorkflowExecutionFailedEventAttributes",
                          "childWorkflowExecutionStartedEventAttributes",
                          "childWorkflowExecutionCompletedEventAttributes",
                          "childWorkflowExecutionFailedEventAttributes",
                          "childWorkflowExecutionCanceledEventAttributes",
                          "childWorkflowExecutionTimedOutEventAttributes",
                          "childWorkflowExecutionTerminatedEventAttributes",
                          "signalExternalWorkflowExecutionInitiatedEventAttributes",
                          "signalExternalWorkflowExecutionFailedEventAttributes",
                          "externalWorkflowExecutionSignaledEventAttributes",
                          "upsertWorkflowSearchAttributesEventAttributes",
                          "workflowExecutionUpdateAcceptedEventAttributes",
                          "workflowExecutionUpdateRejectedEventAttributes",
                          "workflowExecutionUpdateCompletedEventAttributes",
                          "workflowPropertiesModifiedExternallyEventAttributes",
                          "activityPropertiesModifiedExternallyEventAttributes",
                          "workflowPropertiesModifiedEventAttributes"
                        ]
                      }
                    },
                    fields: {
                      eventId: {
                        type: "int64",
                        id: 1
                      },
                      eventTime: {
                        type: "google.protobuf.Timestamp",
                        id: 2,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      eventType: {
                        type: "temporal.api.enums.v1.EventType",
                        id: 3
                      },
                      version: {
                        type: "int64",
                        id: 4
                      },
                      taskId: {
                        type: "int64",
                        id: 5
                      },
                      workerMayIgnore: {
                        type: "bool",
                        id: 300
                      },
                      workflowExecutionStartedEventAttributes: {
                        type: "WorkflowExecutionStartedEventAttributes",
                        id: 6
                      },
                      workflowExecutionCompletedEventAttributes: {
                        type: "WorkflowExecutionCompletedEventAttributes",
                        id: 7
                      },
                      workflowExecutionFailedEventAttributes: {
                        type: "WorkflowExecutionFailedEventAttributes",
                        id: 8
                      },
                      workflowExecutionTimedOutEventAttributes: {
                        type: "WorkflowExecutionTimedOutEventAttributes",
                        id: 9
                      },
                      workflowTaskScheduledEventAttributes: {
                        type: "WorkflowTaskScheduledEventAttributes",
                        id: 10
                      },
                      workflowTaskStartedEventAttributes: {
                        type: "WorkflowTaskStartedEventAttributes",
                        id: 11
                      },
                      workflowTaskCompletedEventAttributes: {
                        type: "WorkflowTaskCompletedEventAttributes",
                        id: 12
                      },
                      workflowTaskTimedOutEventAttributes: {
                        type: "WorkflowTaskTimedOutEventAttributes",
                        id: 13
                      },
                      workflowTaskFailedEventAttributes: {
                        type: "WorkflowTaskFailedEventAttributes",
                        id: 14
                      },
                      activityTaskScheduledEventAttributes: {
                        type: "ActivityTaskScheduledEventAttributes",
                        id: 15
                      },
                      activityTaskStartedEventAttributes: {
                        type: "ActivityTaskStartedEventAttributes",
                        id: 16
                      },
                      activityTaskCompletedEventAttributes: {
                        type: "ActivityTaskCompletedEventAttributes",
                        id: 17
                      },
                      activityTaskFailedEventAttributes: {
                        type: "ActivityTaskFailedEventAttributes",
                        id: 18
                      },
                      activityTaskTimedOutEventAttributes: {
                        type: "ActivityTaskTimedOutEventAttributes",
                        id: 19
                      },
                      timerStartedEventAttributes: {
                        type: "TimerStartedEventAttributes",
                        id: 20
                      },
                      timerFiredEventAttributes: {
                        type: "TimerFiredEventAttributes",
                        id: 21
                      },
                      activityTaskCancelRequestedEventAttributes: {
                        type: "ActivityTaskCancelRequestedEventAttributes",
                        id: 22
                      },
                      activityTaskCanceledEventAttributes: {
                        type: "ActivityTaskCanceledEventAttributes",
                        id: 23
                      },
                      timerCanceledEventAttributes: {
                        type: "TimerCanceledEventAttributes",
                        id: 24
                      },
                      markerRecordedEventAttributes: {
                        type: "MarkerRecordedEventAttributes",
                        id: 25
                      },
                      workflowExecutionSignaledEventAttributes: {
                        type: "WorkflowExecutionSignaledEventAttributes",
                        id: 26
                      },
                      workflowExecutionTerminatedEventAttributes: {
                        type: "WorkflowExecutionTerminatedEventAttributes",
                        id: 27
                      },
                      workflowExecutionCancelRequestedEventAttributes: {
                        type: "WorkflowExecutionCancelRequestedEventAttributes",
                        id: 28
                      },
                      workflowExecutionCanceledEventAttributes: {
                        type: "WorkflowExecutionCanceledEventAttributes",
                        id: 29
                      },
                      requestCancelExternalWorkflowExecutionInitiatedEventAttributes: {
                        type: "RequestCancelExternalWorkflowExecutionInitiatedEventAttributes",
                        id: 30
                      },
                      requestCancelExternalWorkflowExecutionFailedEventAttributes: {
                        type: "RequestCancelExternalWorkflowExecutionFailedEventAttributes",
                        id: 31
                      },
                      externalWorkflowExecutionCancelRequestedEventAttributes: {
                        type: "ExternalWorkflowExecutionCancelRequestedEventAttributes",
                        id: 32
                      },
                      workflowExecutionContinuedAsNewEventAttributes: {
                        type: "WorkflowExecutionContinuedAsNewEventAttributes",
                        id: 33
                      },
                      startChildWorkflowExecutionInitiatedEventAttributes: {
                        type: "StartChildWorkflowExecutionInitiatedEventAttributes",
                        id: 34
                      },
                      startChildWorkflowExecutionFailedEventAttributes: {
                        type: "StartChildWorkflowExecutionFailedEventAttributes",
                        id: 35
                      },
                      childWorkflowExecutionStartedEventAttributes: {
                        type: "ChildWorkflowExecutionStartedEventAttributes",
                        id: 36
                      },
                      childWorkflowExecutionCompletedEventAttributes: {
                        type: "ChildWorkflowExecutionCompletedEventAttributes",
                        id: 37
                      },
                      childWorkflowExecutionFailedEventAttributes: {
                        type: "ChildWorkflowExecutionFailedEventAttributes",
                        id: 38
                      },
                      childWorkflowExecutionCanceledEventAttributes: {
                        type: "ChildWorkflowExecutionCanceledEventAttributes",
                        id: 39
                      },
                      childWorkflowExecutionTimedOutEventAttributes: {
                        type: "ChildWorkflowExecutionTimedOutEventAttributes",
                        id: 40
                      },
                      childWorkflowExecutionTerminatedEventAttributes: {
                        type: "ChildWorkflowExecutionTerminatedEventAttributes",
                        id: 41
                      },
                      signalExternalWorkflowExecutionInitiatedEventAttributes: {
                        type: "SignalExternalWorkflowExecutionInitiatedEventAttributes",
                        id: 42
                      },
                      signalExternalWorkflowExecutionFailedEventAttributes: {
                        type: "SignalExternalWorkflowExecutionFailedEventAttributes",
                        id: 43
                      },
                      externalWorkflowExecutionSignaledEventAttributes: {
                        type: "ExternalWorkflowExecutionSignaledEventAttributes",
                        id: 44
                      },
                      upsertWorkflowSearchAttributesEventAttributes: {
                        type: "UpsertWorkflowSearchAttributesEventAttributes",
                        id: 45
                      },
                      workflowExecutionUpdateAcceptedEventAttributes: {
                        type: "WorkflowExecutionUpdateAcceptedEventAttributes",
                        id: 46
                      },
                      workflowExecutionUpdateRejectedEventAttributes: {
                        type: "WorkflowExecutionUpdateRejectedEventAttributes",
                        id: 47
                      },
                      workflowExecutionUpdateCompletedEventAttributes: {
                        type: "WorkflowExecutionUpdateCompletedEventAttributes",
                        id: 48
                      },
                      workflowPropertiesModifiedExternallyEventAttributes: {
                        type: "WorkflowPropertiesModifiedExternallyEventAttributes",
                        id: 49
                      },
                      activityPropertiesModifiedExternallyEventAttributes: {
                        type: "ActivityPropertiesModifiedExternallyEventAttributes",
                        id: 50
                      },
                      workflowPropertiesModifiedEventAttributes: {
                        type: "WorkflowPropertiesModifiedEventAttributes",
                        id: 51
                      }
                    }
                  },
                  History: {
                    fields: {
                      events: {
                        rule: "repeated",
                        type: "HistoryEvent",
                        id: 1
                      }
                    }
                  }
                }
              }
            }
          },
          taskqueue: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/taskqueue/v1;taskqueue",
                  java_package: "io.temporal.api.taskqueue.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::TaskQueue::V1",
                  csharp_namespace: "Temporalio.Api.TaskQueue.V1"
                },
                nested: {
                  TaskQueue: {
                    fields: {
                      name: {
                        type: "string",
                        id: 1
                      },
                      kind: {
                        type: "temporal.api.enums.v1.TaskQueueKind",
                        id: 2
                      },
                      normalName: {
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  TaskQueueMetadata: {
                    fields: {
                      maxTasksPerSecond: {
                        type: "google.protobuf.DoubleValue",
                        id: 1
                      }
                    }
                  },
                  TaskQueueStatus: {
                    fields: {
                      backlogCountHint: {
                        type: "int64",
                        id: 1
                      },
                      readLevel: {
                        type: "int64",
                        id: 2
                      },
                      ackLevel: {
                        type: "int64",
                        id: 3
                      },
                      ratePerSecond: {
                        type: "double",
                        id: 4
                      },
                      taskIdBlock: {
                        type: "TaskIdBlock",
                        id: 5
                      }
                    }
                  },
                  TaskIdBlock: {
                    fields: {
                      startId: {
                        type: "int64",
                        id: 1
                      },
                      endId: {
                        type: "int64",
                        id: 2
                      }
                    }
                  },
                  TaskQueuePartitionMetadata: {
                    fields: {
                      key: {
                        type: "string",
                        id: 1
                      },
                      ownerHostName: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  PollerInfo: {
                    fields: {
                      lastAccessTime: {
                        type: "google.protobuf.Timestamp",
                        id: 1,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      identity: {
                        type: "string",
                        id: 2
                      },
                      ratePerSecond: {
                        type: "double",
                        id: 3
                      },
                      workerVersionCapabilities: {
                        type: "temporal.api.common.v1.WorkerVersionCapabilities",
                        id: 4
                      }
                    }
                  },
                  StickyExecutionAttributes: {
                    fields: {
                      workerTaskQueue: {
                        type: "TaskQueue",
                        id: 1
                      },
                      scheduleToStartTimeout: {
                        type: "google.protobuf.Duration",
                        id: 2,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      }
                    }
                  },
                  CompatibleVersionSet: {
                    fields: {
                      buildIds: {
                        rule: "repeated",
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  TaskQueueReachability: {
                    fields: {
                      taskQueue: {
                        type: "string",
                        id: 1
                      },
                      reachability: {
                        rule: "repeated",
                        type: "temporal.api.enums.v1.TaskReachability",
                        id: 2
                      }
                    }
                  },
                  BuildIdReachability: {
                    fields: {
                      buildId: {
                        type: "string",
                        id: 1
                      },
                      taskQueueReachability: {
                        rule: "repeated",
                        type: "TaskQueueReachability",
                        id: 2
                      }
                    }
                  }
                }
              }
            }
          },
          update: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/update/v1;update",
                  java_package: "io.temporal.api.update.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Update::V1",
                  csharp_namespace: "Temporalio.Api.Update.V1"
                },
                nested: {
                  WaitPolicy: {
                    fields: {
                      lifecycleStage: {
                        type: "temporal.api.enums.v1.UpdateWorkflowExecutionLifecycleStage",
                        id: 1
                      }
                    }
                  },
                  UpdateRef: {
                    fields: {
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 1
                      },
                      updateId: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  Outcome: {
                    oneofs: {
                      value: {
                        oneof: [
                          "success",
                          "failure"
                        ]
                      }
                    },
                    fields: {
                      success: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 2
                      }
                    }
                  },
                  Meta: {
                    fields: {
                      updateId: {
                        type: "string",
                        id: 1
                      },
                      identity: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  Input: {
                    fields: {
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 1
                      },
                      name: {
                        type: "string",
                        id: 2
                      },
                      args: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 3
                      }
                    }
                  },
                  Request: {
                    fields: {
                      meta: {
                        type: "Meta",
                        id: 1
                      },
                      input: {
                        type: "Input",
                        id: 2
                      }
                    }
                  },
                  Rejection: {
                    fields: {
                      rejectedRequestMessageId: {
                        type: "string",
                        id: 1
                      },
                      rejectedRequestSequencingEventId: {
                        type: "int64",
                        id: 2
                      },
                      rejectedRequest: {
                        type: "Request",
                        id: 3
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 4
                      }
                    }
                  },
                  Acceptance: {
                    fields: {
                      acceptedRequestMessageId: {
                        type: "string",
                        id: 1
                      },
                      acceptedRequestSequencingEventId: {
                        type: "int64",
                        id: 2
                      },
                      acceptedRequest: {
                        type: "Request",
                        id: 3
                      }
                    }
                  },
                  Response: {
                    fields: {
                      meta: {
                        type: "Meta",
                        id: 1
                      },
                      outcome: {
                        type: "Outcome",
                        id: 2
                      }
                    }
                  }
                }
              }
            }
          },
          workflow: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/workflow/v1;workflow",
                  java_package: "io.temporal.api.workflow.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Workflow::V1",
                  csharp_namespace: "Temporalio.Api.Workflow.V1"
                },
                nested: {
                  WorkflowExecutionInfo: {
                    fields: {
                      execution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 1
                      },
                      type: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 2
                      },
                      startTime: {
                        type: "google.protobuf.Timestamp",
                        id: 3,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      closeTime: {
                        type: "google.protobuf.Timestamp",
                        id: 4,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      status: {
                        type: "temporal.api.enums.v1.WorkflowExecutionStatus",
                        id: 5
                      },
                      historyLength: {
                        type: "int64",
                        id: 6
                      },
                      parentNamespaceId: {
                        type: "string",
                        id: 7
                      },
                      parentExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 8
                      },
                      executionTime: {
                        type: "google.protobuf.Timestamp",
                        id: 9,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 10
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 11
                      },
                      autoResetPoints: {
                        type: "ResetPoints",
                        id: 12
                      },
                      taskQueue: {
                        type: "string",
                        id: 13
                      },
                      stateTransitionCount: {
                        type: "int64",
                        id: 14
                      },
                      historySizeBytes: {
                        type: "int64",
                        id: 15
                      },
                      mostRecentWorkerVersionStamp: {
                        type: "temporal.api.common.v1.WorkerVersionStamp",
                        id: 16
                      }
                    }
                  },
                  WorkflowExecutionConfig: {
                    fields: {
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 1
                      },
                      workflowExecutionTimeout: {
                        type: "google.protobuf.Duration",
                        id: 2,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowRunTimeout: {
                        type: "google.protobuf.Duration",
                        id: 3,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      defaultWorkflowTaskTimeout: {
                        type: "google.protobuf.Duration",
                        id: 4,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      }
                    }
                  },
                  PendingActivityInfo: {
                    fields: {
                      activityId: {
                        type: "string",
                        id: 1
                      },
                      activityType: {
                        type: "temporal.api.common.v1.ActivityType",
                        id: 2
                      },
                      state: {
                        type: "temporal.api.enums.v1.PendingActivityState",
                        id: 3
                      },
                      heartbeatDetails: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 4
                      },
                      lastHeartbeatTime: {
                        type: "google.protobuf.Timestamp",
                        id: 5,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      lastStartedTime: {
                        type: "google.protobuf.Timestamp",
                        id: 6,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      attempt: {
                        type: "int32",
                        id: 7
                      },
                      maximumAttempts: {
                        type: "int32",
                        id: 8
                      },
                      scheduledTime: {
                        type: "google.protobuf.Timestamp",
                        id: 9,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      expirationTime: {
                        type: "google.protobuf.Timestamp",
                        id: 10,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      lastFailure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 11
                      },
                      lastWorkerIdentity: {
                        type: "string",
                        id: 12
                      }
                    }
                  },
                  PendingChildExecutionInfo: {
                    fields: {
                      workflowId: {
                        type: "string",
                        id: 1
                      },
                      runId: {
                        type: "string",
                        id: 2
                      },
                      workflowTypeName: {
                        type: "string",
                        id: 3
                      },
                      initiatedId: {
                        type: "int64",
                        id: 4
                      },
                      parentClosePolicy: {
                        type: "temporal.api.enums.v1.ParentClosePolicy",
                        id: 5
                      }
                    }
                  },
                  PendingWorkflowTaskInfo: {
                    fields: {
                      state: {
                        type: "temporal.api.enums.v1.PendingWorkflowTaskState",
                        id: 1
                      },
                      scheduledTime: {
                        type: "google.protobuf.Timestamp",
                        id: 2,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      originalScheduledTime: {
                        type: "google.protobuf.Timestamp",
                        id: 3,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      startedTime: {
                        type: "google.protobuf.Timestamp",
                        id: 4,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      attempt: {
                        type: "int32",
                        id: 5
                      }
                    }
                  },
                  ResetPoints: {
                    fields: {
                      points: {
                        rule: "repeated",
                        type: "ResetPointInfo",
                        id: 1
                      }
                    }
                  },
                  ResetPointInfo: {
                    fields: {
                      binaryChecksum: {
                        type: "string",
                        id: 1
                      },
                      runId: {
                        type: "string",
                        id: 2
                      },
                      firstWorkflowTaskCompletedId: {
                        type: "int64",
                        id: 3
                      },
                      createTime: {
                        type: "google.protobuf.Timestamp",
                        id: 4,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      expireTime: {
                        type: "google.protobuf.Timestamp",
                        id: 5,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      resettable: {
                        type: "bool",
                        id: 6
                      }
                    }
                  },
                  NewWorkflowExecutionInfo: {
                    fields: {
                      workflowId: {
                        type: "string",
                        id: 1
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 2
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 3
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 4
                      },
                      workflowExecutionTimeout: {
                        type: "google.protobuf.Duration",
                        id: 5,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowRunTimeout: {
                        type: "google.protobuf.Duration",
                        id: 6,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskTimeout: {
                        type: "google.protobuf.Duration",
                        id: 7,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowIdReusePolicy: {
                        type: "temporal.api.enums.v1.WorkflowIdReusePolicy",
                        id: 8
                      },
                      retryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 9
                      },
                      cronSchedule: {
                        type: "string",
                        id: 10
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 11
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 12
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 13
                      }
                    }
                  }
                }
              }
            }
          },
          sdk: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/sdk/v1;sdk",
                  java_package: "io.temporal.api.sdk.v1",
                  java_multiple_files: true,
                  java_outer_classname: "TaskCompleteMetadataProto",
                  ruby_package: "Temporalio::Api::Sdk::V1",
                  csharp_namespace: "Temporalio.Api.Sdk.V1"
                },
                nested: {
                  WorkflowTaskCompletedMetadata: {
                    fields: {
                      coreUsedFlags: {
                        rule: "repeated",
                        type: "uint32",
                        id: 1
                      },
                      langUsedFlags: {
                        rule: "repeated",
                        type: "uint32",
                        id: 2
                      }
                    }
                  }
                }
              }
            }
          },
          command: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/command/v1;command",
                  java_package: "io.temporal.api.command.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Command::V1",
                  csharp_namespace: "Temporalio.Api.Command.V1"
                },
                nested: {
                  ScheduleActivityTaskCommandAttributes: {
                    fields: {
                      activityId: {
                        type: "string",
                        id: 1
                      },
                      activityType: {
                        type: "temporal.api.common.v1.ActivityType",
                        id: 2
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 4
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 5
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 6
                      },
                      scheduleToCloseTimeout: {
                        type: "google.protobuf.Duration",
                        id: 7,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      scheduleToStartTimeout: {
                        type: "google.protobuf.Duration",
                        id: 8,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      startToCloseTimeout: {
                        type: "google.protobuf.Duration",
                        id: 9,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      heartbeatTimeout: {
                        type: "google.protobuf.Duration",
                        id: 10,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      retryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 11
                      },
                      requestEagerExecution: {
                        type: "bool",
                        id: 12
                      },
                      useCompatibleVersion: {
                        type: "bool",
                        id: 13
                      }
                    },
                    reserved: [
                      [
                        3,
                        3
                      ]
                    ]
                  },
                  RequestCancelActivityTaskCommandAttributes: {
                    fields: {
                      scheduledEventId: {
                        type: "int64",
                        id: 1
                      }
                    }
                  },
                  StartTimerCommandAttributes: {
                    fields: {
                      timerId: {
                        type: "string",
                        id: 1
                      },
                      startToFireTimeout: {
                        type: "google.protobuf.Duration",
                        id: 2,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      }
                    }
                  },
                  CompleteWorkflowExecutionCommandAttributes: {
                    fields: {
                      result: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      }
                    }
                  },
                  FailWorkflowExecutionCommandAttributes: {
                    fields: {
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 1
                      }
                    }
                  },
                  CancelTimerCommandAttributes: {
                    fields: {
                      timerId: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  CancelWorkflowExecutionCommandAttributes: {
                    fields: {
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      }
                    }
                  },
                  RequestCancelExternalWorkflowExecutionCommandAttributes: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowId: {
                        type: "string",
                        id: 2
                      },
                      runId: {
                        type: "string",
                        id: 3
                      },
                      control: {
                        type: "string",
                        id: 4
                      },
                      childWorkflowOnly: {
                        type: "bool",
                        id: 5
                      },
                      reason: {
                        type: "string",
                        id: 6
                      }
                    }
                  },
                  SignalExternalWorkflowExecutionCommandAttributes: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      execution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 2
                      },
                      signalName: {
                        type: "string",
                        id: 3
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 4
                      },
                      control: {
                        type: "string",
                        id: 5
                      },
                      childWorkflowOnly: {
                        type: "bool",
                        id: 6
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 7
                      }
                    }
                  },
                  UpsertWorkflowSearchAttributesCommandAttributes: {
                    fields: {
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 1
                      }
                    }
                  },
                  ModifyWorkflowPropertiesCommandAttributes: {
                    fields: {
                      upsertedMemo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 1
                      }
                    }
                  },
                  RecordMarkerCommandAttributes: {
                    fields: {
                      markerName: {
                        type: "string",
                        id: 1
                      },
                      details: {
                        keyType: "string",
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 3
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 4
                      }
                    }
                  },
                  ContinueAsNewWorkflowExecutionCommandAttributes: {
                    fields: {
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 1
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 2
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 3
                      },
                      workflowRunTimeout: {
                        type: "google.protobuf.Duration",
                        id: 4,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskTimeout: {
                        type: "google.protobuf.Duration",
                        id: 5,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      backoffStartInterval: {
                        type: "google.protobuf.Duration",
                        id: 6,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      retryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 7
                      },
                      initiator: {
                        type: "temporal.api.enums.v1.ContinueAsNewInitiator",
                        id: 8
                      },
                      failure: {
                        type: "temporal.api.failure.v1.Failure",
                        id: 9
                      },
                      lastCompletionResult: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 10
                      },
                      cronSchedule: {
                        type: "string",
                        id: 11
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 12
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 13
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 14
                      },
                      useCompatibleVersion: {
                        type: "bool",
                        id: 15
                      }
                    }
                  },
                  StartChildWorkflowExecutionCommandAttributes: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      workflowId: {
                        type: "string",
                        id: 2
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 3
                      },
                      taskQueue: {
                        type: "temporal.api.taskqueue.v1.TaskQueue",
                        id: 4
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 5
                      },
                      workflowExecutionTimeout: {
                        type: "google.protobuf.Duration",
                        id: 6,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowRunTimeout: {
                        type: "google.protobuf.Duration",
                        id: 7,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      workflowTaskTimeout: {
                        type: "google.protobuf.Duration",
                        id: 8,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      parentClosePolicy: {
                        type: "temporal.api.enums.v1.ParentClosePolicy",
                        id: 9
                      },
                      control: {
                        type: "string",
                        id: 10
                      },
                      workflowIdReusePolicy: {
                        type: "temporal.api.enums.v1.WorkflowIdReusePolicy",
                        id: 11
                      },
                      retryPolicy: {
                        type: "temporal.api.common.v1.RetryPolicy",
                        id: 12
                      },
                      cronSchedule: {
                        type: "string",
                        id: 13
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 14
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 15
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 16
                      },
                      useCompatibleVersion: {
                        type: "bool",
                        id: 17
                      }
                    }
                  },
                  ProtocolMessageCommandAttributes: {
                    fields: {
                      messageId: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  Command: {
                    oneofs: {
                      attributes: {
                        oneof: [
                          "scheduleActivityTaskCommandAttributes",
                          "startTimerCommandAttributes",
                          "completeWorkflowExecutionCommandAttributes",
                          "failWorkflowExecutionCommandAttributes",
                          "requestCancelActivityTaskCommandAttributes",
                          "cancelTimerCommandAttributes",
                          "cancelWorkflowExecutionCommandAttributes",
                          "requestCancelExternalWorkflowExecutionCommandAttributes",
                          "recordMarkerCommandAttributes",
                          "continueAsNewWorkflowExecutionCommandAttributes",
                          "startChildWorkflowExecutionCommandAttributes",
                          "signalExternalWorkflowExecutionCommandAttributes",
                          "upsertWorkflowSearchAttributesCommandAttributes",
                          "protocolMessageCommandAttributes",
                          "modifyWorkflowPropertiesCommandAttributes"
                        ]
                      }
                    },
                    fields: {
                      commandType: {
                        type: "temporal.api.enums.v1.CommandType",
                        id: 1
                      },
                      scheduleActivityTaskCommandAttributes: {
                        type: "ScheduleActivityTaskCommandAttributes",
                        id: 2
                      },
                      startTimerCommandAttributes: {
                        type: "StartTimerCommandAttributes",
                        id: 3
                      },
                      completeWorkflowExecutionCommandAttributes: {
                        type: "CompleteWorkflowExecutionCommandAttributes",
                        id: 4
                      },
                      failWorkflowExecutionCommandAttributes: {
                        type: "FailWorkflowExecutionCommandAttributes",
                        id: 5
                      },
                      requestCancelActivityTaskCommandAttributes: {
                        type: "RequestCancelActivityTaskCommandAttributes",
                        id: 6
                      },
                      cancelTimerCommandAttributes: {
                        type: "CancelTimerCommandAttributes",
                        id: 7
                      },
                      cancelWorkflowExecutionCommandAttributes: {
                        type: "CancelWorkflowExecutionCommandAttributes",
                        id: 8
                      },
                      requestCancelExternalWorkflowExecutionCommandAttributes: {
                        type: "RequestCancelExternalWorkflowExecutionCommandAttributes",
                        id: 9
                      },
                      recordMarkerCommandAttributes: {
                        type: "RecordMarkerCommandAttributes",
                        id: 10
                      },
                      continueAsNewWorkflowExecutionCommandAttributes: {
                        type: "ContinueAsNewWorkflowExecutionCommandAttributes",
                        id: 11
                      },
                      startChildWorkflowExecutionCommandAttributes: {
                        type: "StartChildWorkflowExecutionCommandAttributes",
                        id: 12
                      },
                      signalExternalWorkflowExecutionCommandAttributes: {
                        type: "SignalExternalWorkflowExecutionCommandAttributes",
                        id: 13
                      },
                      upsertWorkflowSearchAttributesCommandAttributes: {
                        type: "UpsertWorkflowSearchAttributesCommandAttributes",
                        id: 14
                      },
                      protocolMessageCommandAttributes: {
                        type: "ProtocolMessageCommandAttributes",
                        id: 15
                      },
                      modifyWorkflowPropertiesCommandAttributes: {
                        type: "ModifyWorkflowPropertiesCommandAttributes",
                        id: 17
                      }
                    }
                  }
                }
              }
            }
          },
          filter: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/filter/v1;filter",
                  java_package: "io.temporal.api.filter.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Filter::V1",
                  csharp_namespace: "Temporalio.Api.Filter.V1"
                },
                nested: {
                  WorkflowExecutionFilter: {
                    fields: {
                      workflowId: {
                        type: "string",
                        id: 1
                      },
                      runId: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  WorkflowTypeFilter: {
                    fields: {
                      name: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  StartTimeFilter: {
                    fields: {
                      earliestTime: {
                        type: "google.protobuf.Timestamp",
                        id: 1,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      latestTime: {
                        type: "google.protobuf.Timestamp",
                        id: 2,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      }
                    }
                  },
                  StatusFilter: {
                    fields: {
                      status: {
                        type: "temporal.api.enums.v1.WorkflowExecutionStatus",
                        id: 1
                      }
                    }
                  }
                }
              }
            }
          },
          protocol: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/protocol/v1;protocol",
                  java_package: "io.temporal.api.protocol.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Protocol::V1",
                  csharp_namespace: "Temporalio.Api.Protocol.V1"
                },
                nested: {
                  Message: {
                    oneofs: {
                      sequencingId: {
                        oneof: [
                          "eventId",
                          "commandIndex"
                        ]
                      }
                    },
                    fields: {
                      id: {
                        type: "string",
                        id: 1
                      },
                      protocolInstanceId: {
                        type: "string",
                        id: 2
                      },
                      eventId: {
                        type: "int64",
                        id: 3
                      },
                      commandIndex: {
                        type: "int64",
                        id: 4
                      },
                      body: {
                        type: "google.protobuf.Any",
                        id: 5
                      }
                    }
                  }
                }
              }
            }
          },
          namespace: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/namespace/v1;namespace",
                  java_package: "io.temporal.api.namespace.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Namespace::V1",
                  csharp_namespace: "Temporalio.Api.Namespace.V1"
                },
                nested: {
                  NamespaceInfo: {
                    fields: {
                      name: {
                        type: "string",
                        id: 1
                      },
                      state: {
                        type: "temporal.api.enums.v1.NamespaceState",
                        id: 2
                      },
                      description: {
                        type: "string",
                        id: 3
                      },
                      ownerEmail: {
                        type: "string",
                        id: 4
                      },
                      data: {
                        keyType: "string",
                        type: "string",
                        id: 5
                      },
                      id: {
                        type: "string",
                        id: 6
                      },
                      supportsSchedules: {
                        type: "bool",
                        id: 100
                      }
                    }
                  },
                  NamespaceConfig: {
                    fields: {
                      workflowExecutionRetentionTtl: {
                        type: "google.protobuf.Duration",
                        id: 1,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      badBinaries: {
                        type: "BadBinaries",
                        id: 2
                      },
                      historyArchivalState: {
                        type: "temporal.api.enums.v1.ArchivalState",
                        id: 3
                      },
                      historyArchivalUri: {
                        type: "string",
                        id: 4
                      },
                      visibilityArchivalState: {
                        type: "temporal.api.enums.v1.ArchivalState",
                        id: 5
                      },
                      visibilityArchivalUri: {
                        type: "string",
                        id: 6
                      },
                      customSearchAttributeAliases: {
                        keyType: "string",
                        type: "string",
                        id: 7
                      }
                    }
                  },
                  BadBinaries: {
                    fields: {
                      binaries: {
                        keyType: "string",
                        type: "BadBinaryInfo",
                        id: 1
                      }
                    }
                  },
                  BadBinaryInfo: {
                    fields: {
                      reason: {
                        type: "string",
                        id: 1
                      },
                      operator: {
                        type: "string",
                        id: 2
                      },
                      createTime: {
                        type: "google.protobuf.Timestamp",
                        id: 3,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      }
                    }
                  },
                  UpdateNamespaceInfo: {
                    fields: {
                      description: {
                        type: "string",
                        id: 1
                      },
                      ownerEmail: {
                        type: "string",
                        id: 2
                      },
                      data: {
                        keyType: "string",
                        type: "string",
                        id: 3
                      },
                      state: {
                        type: "temporal.api.enums.v1.NamespaceState",
                        id: 4
                      }
                    }
                  },
                  NamespaceFilter: {
                    fields: {
                      includeDeleted: {
                        type: "bool",
                        id: 1
                      }
                    }
                  }
                }
              }
            }
          },
          query: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/query/v1;query",
                  java_package: "io.temporal.api.query.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Query::V1",
                  csharp_namespace: "Temporalio.Api.Query.V1"
                },
                nested: {
                  WorkflowQuery: {
                    fields: {
                      queryType: {
                        type: "string",
                        id: 1
                      },
                      queryArgs: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 3
                      }
                    }
                  },
                  WorkflowQueryResult: {
                    fields: {
                      resultType: {
                        type: "temporal.api.enums.v1.QueryResultType",
                        id: 1
                      },
                      answer: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      },
                      errorMessage: {
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  QueryRejected: {
                    fields: {
                      status: {
                        type: "temporal.api.enums.v1.WorkflowExecutionStatus",
                        id: 1
                      }
                    }
                  }
                }
              }
            }
          },
          replication: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/replication/v1;replication",
                  java_package: "io.temporal.api.replication.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Replication::V1",
                  csharp_namespace: "Temporalio.Api.Replication.V1"
                },
                nested: {
                  ClusterReplicationConfig: {
                    fields: {
                      clusterName: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  NamespaceReplicationConfig: {
                    fields: {
                      activeClusterName: {
                        type: "string",
                        id: 1
                      },
                      clusters: {
                        rule: "repeated",
                        type: "ClusterReplicationConfig",
                        id: 2
                      },
                      state: {
                        type: "temporal.api.enums.v1.ReplicationState",
                        id: 3
                      }
                    }
                  },
                  FailoverStatus: {
                    fields: {
                      failoverTime: {
                        type: "google.protobuf.Timestamp",
                        id: 1,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      failoverVersion: {
                        type: "int64",
                        id: 2
                      }
                    }
                  }
                }
              }
            }
          },
          schedule: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/schedule/v1;schedule",
                  java_package: "io.temporal.api.schedule.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Schedule::V1",
                  csharp_namespace: "Temporalio.Api.Schedule.V1"
                },
                nested: {
                  CalendarSpec: {
                    fields: {
                      second: {
                        type: "string",
                        id: 1
                      },
                      minute: {
                        type: "string",
                        id: 2
                      },
                      hour: {
                        type: "string",
                        id: 3
                      },
                      dayOfMonth: {
                        type: "string",
                        id: 4
                      },
                      month: {
                        type: "string",
                        id: 5
                      },
                      year: {
                        type: "string",
                        id: 6
                      },
                      dayOfWeek: {
                        type: "string",
                        id: 7
                      },
                      comment: {
                        type: "string",
                        id: 8
                      }
                    }
                  },
                  Range: {
                    fields: {
                      start: {
                        type: "int32",
                        id: 1
                      },
                      end: {
                        type: "int32",
                        id: 2
                      },
                      step: {
                        type: "int32",
                        id: 3
                      }
                    }
                  },
                  StructuredCalendarSpec: {
                    fields: {
                      second: {
                        rule: "repeated",
                        type: "Range",
                        id: 1
                      },
                      minute: {
                        rule: "repeated",
                        type: "Range",
                        id: 2
                      },
                      hour: {
                        rule: "repeated",
                        type: "Range",
                        id: 3
                      },
                      dayOfMonth: {
                        rule: "repeated",
                        type: "Range",
                        id: 4
                      },
                      month: {
                        rule: "repeated",
                        type: "Range",
                        id: 5
                      },
                      year: {
                        rule: "repeated",
                        type: "Range",
                        id: 6
                      },
                      dayOfWeek: {
                        rule: "repeated",
                        type: "Range",
                        id: 7
                      },
                      comment: {
                        type: "string",
                        id: 8
                      }
                    }
                  },
                  IntervalSpec: {
                    fields: {
                      interval: {
                        type: "google.protobuf.Duration",
                        id: 1,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      phase: {
                        type: "google.protobuf.Duration",
                        id: 2,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      }
                    }
                  },
                  ScheduleSpec: {
                    fields: {
                      structuredCalendar: {
                        rule: "repeated",
                        type: "StructuredCalendarSpec",
                        id: 7
                      },
                      cronString: {
                        rule: "repeated",
                        type: "string",
                        id: 8
                      },
                      calendar: {
                        rule: "repeated",
                        type: "CalendarSpec",
                        id: 1
                      },
                      interval: {
                        rule: "repeated",
                        type: "IntervalSpec",
                        id: 2
                      },
                      excludeCalendar: {
                        rule: "repeated",
                        type: "CalendarSpec",
                        id: 3,
                        options: {
                          deprecated: true
                        }
                      },
                      excludeStructuredCalendar: {
                        rule: "repeated",
                        type: "StructuredCalendarSpec",
                        id: 9
                      },
                      startTime: {
                        type: "google.protobuf.Timestamp",
                        id: 4,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      endTime: {
                        type: "google.protobuf.Timestamp",
                        id: 5,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      jitter: {
                        type: "google.protobuf.Duration",
                        id: 6,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      timezoneName: {
                        type: "string",
                        id: 10
                      },
                      timezoneData: {
                        type: "bytes",
                        id: 11
                      }
                    }
                  },
                  SchedulePolicies: {
                    fields: {
                      overlapPolicy: {
                        type: "temporal.api.enums.v1.ScheduleOverlapPolicy",
                        id: 1
                      },
                      catchupWindow: {
                        type: "google.protobuf.Duration",
                        id: 2,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      },
                      pauseOnFailure: {
                        type: "bool",
                        id: 3
                      }
                    }
                  },
                  ScheduleAction: {
                    oneofs: {
                      action: {
                        oneof: [
                          "startWorkflow"
                        ]
                      }
                    },
                    fields: {
                      startWorkflow: {
                        type: "temporal.api.workflow.v1.NewWorkflowExecutionInfo",
                        id: 1
                      }
                    }
                  },
                  ScheduleActionResult: {
                    fields: {
                      scheduleTime: {
                        type: "google.protobuf.Timestamp",
                        id: 1,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      actualTime: {
                        type: "google.protobuf.Timestamp",
                        id: 2,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      startWorkflowResult: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 11
                      }
                    }
                  },
                  ScheduleState: {
                    fields: {
                      notes: {
                        type: "string",
                        id: 1
                      },
                      paused: {
                        type: "bool",
                        id: 2
                      },
                      limitedActions: {
                        type: "bool",
                        id: 3
                      },
                      remainingActions: {
                        type: "int64",
                        id: 4
                      }
                    }
                  },
                  TriggerImmediatelyRequest: {
                    fields: {
                      overlapPolicy: {
                        type: "temporal.api.enums.v1.ScheduleOverlapPolicy",
                        id: 1
                      }
                    }
                  },
                  BackfillRequest: {
                    fields: {
                      startTime: {
                        type: "google.protobuf.Timestamp",
                        id: 1,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      endTime: {
                        type: "google.protobuf.Timestamp",
                        id: 2,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      overlapPolicy: {
                        type: "temporal.api.enums.v1.ScheduleOverlapPolicy",
                        id: 3
                      }
                    }
                  },
                  SchedulePatch: {
                    fields: {
                      triggerImmediately: {
                        type: "TriggerImmediatelyRequest",
                        id: 1
                      },
                      backfillRequest: {
                        rule: "repeated",
                        type: "BackfillRequest",
                        id: 2
                      },
                      pause: {
                        type: "string",
                        id: 3
                      },
                      unpause: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  ScheduleInfo: {
                    fields: {
                      actionCount: {
                        type: "int64",
                        id: 1
                      },
                      missedCatchupWindow: {
                        type: "int64",
                        id: 2
                      },
                      overlapSkipped: {
                        type: "int64",
                        id: 3
                      },
                      runningWorkflows: {
                        rule: "repeated",
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 9
                      },
                      recentActions: {
                        rule: "repeated",
                        type: "ScheduleActionResult",
                        id: 4
                      },
                      futureActionTimes: {
                        rule: "repeated",
                        type: "google.protobuf.Timestamp",
                        id: 5,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      createTime: {
                        type: "google.protobuf.Timestamp",
                        id: 6,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      updateTime: {
                        type: "google.protobuf.Timestamp",
                        id: 7,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      invalidScheduleError: {
                        type: "string",
                        id: 8,
                        options: {
                          deprecated: true
                        }
                      }
                    }
                  },
                  Schedule: {
                    fields: {
                      spec: {
                        type: "ScheduleSpec",
                        id: 1
                      },
                      action: {
                        type: "ScheduleAction",
                        id: 2
                      },
                      policies: {
                        type: "SchedulePolicies",
                        id: 3
                      },
                      state: {
                        type: "ScheduleState",
                        id: 4
                      }
                    }
                  },
                  ScheduleListInfo: {
                    fields: {
                      spec: {
                        type: "ScheduleSpec",
                        id: 1
                      },
                      workflowType: {
                        type: "temporal.api.common.v1.WorkflowType",
                        id: 2
                      },
                      notes: {
                        type: "string",
                        id: 3
                      },
                      paused: {
                        type: "bool",
                        id: 4
                      },
                      recentActions: {
                        rule: "repeated",
                        type: "ScheduleActionResult",
                        id: 5
                      },
                      futureActionTimes: {
                        rule: "repeated",
                        type: "google.protobuf.Timestamp",
                        id: 6,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      }
                    }
                  },
                  ScheduleListEntry: {
                    fields: {
                      scheduleId: {
                        type: "string",
                        id: 1
                      },
                      memo: {
                        type: "temporal.api.common.v1.Memo",
                        id: 2
                      },
                      searchAttributes: {
                        type: "temporal.api.common.v1.SearchAttributes",
                        id: 3
                      },
                      info: {
                        type: "ScheduleListInfo",
                        id: 4
                      }
                    }
                  }
                }
              }
            }
          },
          version: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/version/v1;version",
                  java_package: "io.temporal.api.version.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Version::V1",
                  csharp_namespace: "Temporalio.Api.Version.V1"
                },
                nested: {
                  ReleaseInfo: {
                    fields: {
                      version: {
                        type: "string",
                        id: 1
                      },
                      releaseTime: {
                        type: "google.protobuf.Timestamp",
                        id: 2,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      notes: {
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  Alert: {
                    fields: {
                      message: {
                        type: "string",
                        id: 1
                      },
                      severity: {
                        type: "temporal.api.enums.v1.Severity",
                        id: 2
                      }
                    }
                  },
                  VersionInfo: {
                    fields: {
                      current: {
                        type: "ReleaseInfo",
                        id: 1
                      },
                      recommended: {
                        type: "ReleaseInfo",
                        id: 2
                      },
                      instructions: {
                        type: "string",
                        id: 3
                      },
                      alerts: {
                        rule: "repeated",
                        type: "Alert",
                        id: 4
                      },
                      lastUpdateTime: {
                        type: "google.protobuf.Timestamp",
                        id: 5,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          batch: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/batch/v1;batch",
                  java_package: "io.temporal.api.batch.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::Batch::V1",
                  csharp_namespace: "Temporalio.Api.Batch.V1"
                },
                nested: {
                  BatchOperationInfo: {
                    fields: {
                      jobId: {
                        type: "string",
                        id: 1
                      },
                      state: {
                        type: "temporal.api.enums.v1.BatchOperationState",
                        id: 2
                      },
                      startTime: {
                        type: "google.protobuf.Timestamp",
                        id: 3,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      },
                      closeTime: {
                        type: "google.protobuf.Timestamp",
                        id: 4,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      }
                    }
                  },
                  BatchOperationTermination: {
                    fields: {
                      details: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 1
                      },
                      identity: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  BatchOperationSignal: {
                    fields: {
                      signal: {
                        type: "string",
                        id: 1
                      },
                      input: {
                        type: "temporal.api.common.v1.Payloads",
                        id: 2
                      },
                      header: {
                        type: "temporal.api.common.v1.Header",
                        id: 3
                      },
                      identity: {
                        type: "string",
                        id: 4
                      }
                    }
                  },
                  BatchOperationCancellation: {
                    fields: {
                      identity: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  BatchOperationDeletion: {
                    fields: {
                      identity: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  BatchOperationReset: {
                    fields: {
                      resetType: {
                        type: "temporal.api.enums.v1.ResetType",
                        id: 1
                      },
                      resetReapplyType: {
                        type: "temporal.api.enums.v1.ResetReapplyType",
                        id: 2
                      },
                      identity: {
                        type: "string",
                        id: 3
                      }
                    }
                  }
                }
              }
            }
          },
          operatorservice: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/operatorservice/v1;operatorservice",
                  java_package: "io.temporal.api.operatorservice.v1",
                  java_multiple_files: true,
                  java_outer_classname: "RequestResponseProto",
                  ruby_package: "Temporalio::Api::OperatorService::V1",
                  csharp_namespace: "Temporalio.Api.OperatorService.V1"
                },
                nested: {
                  OperatorService: {
                    methods: {
                      AddSearchAttributes: {
                        requestType: "AddSearchAttributesRequest",
                        responseType: "AddSearchAttributesResponse"
                      },
                      RemoveSearchAttributes: {
                        requestType: "RemoveSearchAttributesRequest",
                        responseType: "RemoveSearchAttributesResponse"
                      },
                      ListSearchAttributes: {
                        requestType: "ListSearchAttributesRequest",
                        responseType: "ListSearchAttributesResponse"
                      },
                      DeleteNamespace: {
                        requestType: "DeleteNamespaceRequest",
                        responseType: "DeleteNamespaceResponse"
                      },
                      AddOrUpdateRemoteCluster: {
                        requestType: "AddOrUpdateRemoteClusterRequest",
                        responseType: "AddOrUpdateRemoteClusterResponse"
                      },
                      RemoveRemoteCluster: {
                        requestType: "RemoveRemoteClusterRequest",
                        responseType: "RemoveRemoteClusterResponse"
                      },
                      ListClusters: {
                        requestType: "ListClustersRequest",
                        responseType: "ListClustersResponse"
                      }
                    }
                  },
                  AddSearchAttributesRequest: {
                    fields: {
                      searchAttributes: {
                        keyType: "string",
                        type: "temporal.api.enums.v1.IndexedValueType",
                        id: 1
                      },
                      namespace: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  AddSearchAttributesResponse: {
                    fields: {}
                  },
                  RemoveSearchAttributesRequest: {
                    fields: {
                      searchAttributes: {
                        rule: "repeated",
                        type: "string",
                        id: 1
                      },
                      namespace: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  RemoveSearchAttributesResponse: {
                    fields: {}
                  },
                  ListSearchAttributesRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  ListSearchAttributesResponse: {
                    fields: {
                      customAttributes: {
                        keyType: "string",
                        type: "temporal.api.enums.v1.IndexedValueType",
                        id: 1
                      },
                      systemAttributes: {
                        keyType: "string",
                        type: "temporal.api.enums.v1.IndexedValueType",
                        id: 2
                      },
                      storageSchema: {
                        keyType: "string",
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  DeleteNamespaceRequest: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  DeleteNamespaceResponse: {
                    fields: {
                      deletedNamespace: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  AddOrUpdateRemoteClusterRequest: {
                    fields: {
                      frontendAddress: {
                        type: "string",
                        id: 1
                      },
                      enableRemoteClusterConnection: {
                        type: "bool",
                        id: 2
                      }
                    }
                  },
                  AddOrUpdateRemoteClusterResponse: {
                    fields: {}
                  },
                  RemoveRemoteClusterRequest: {
                    fields: {
                      clusterName: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  RemoveRemoteClusterResponse: {
                    fields: {}
                  },
                  ListClustersRequest: {
                    fields: {
                      pageSize: {
                        type: "int32",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  },
                  ListClustersResponse: {
                    fields: {
                      clusters: {
                        rule: "repeated",
                        type: "ClusterMetadata",
                        id: 1
                      },
                      nextPageToken: {
                        type: "bytes",
                        id: 4
                      }
                    }
                  },
                  ClusterMetadata: {
                    fields: {
                      clusterName: {
                        type: "string",
                        id: 1
                      },
                      clusterId: {
                        type: "string",
                        id: 2
                      },
                      address: {
                        type: "string",
                        id: 3
                      },
                      initialFailoverVersion: {
                        type: "int64",
                        id: 4
                      },
                      historyShardCount: {
                        type: "int32",
                        id: 5
                      },
                      isConnectionEnabled: {
                        type: "bool",
                        id: 6
                      }
                    }
                  }
                }
              }
            }
          },
          errordetails: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/errordetails/v1;errordetails",
                  java_package: "io.temporal.api.errordetails.v1",
                  java_multiple_files: true,
                  java_outer_classname: "MessageProto",
                  ruby_package: "Temporalio::Api::ErrorDetails::V1",
                  csharp_namespace: "Temporalio.Api.ErrorDetails.V1"
                },
                nested: {
                  NotFoundFailure: {
                    fields: {
                      currentCluster: {
                        type: "string",
                        id: 1
                      },
                      activeCluster: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  WorkflowExecutionAlreadyStartedFailure: {
                    fields: {
                      startRequestId: {
                        type: "string",
                        id: 1
                      },
                      runId: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  NamespaceNotActiveFailure: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      currentCluster: {
                        type: "string",
                        id: 2
                      },
                      activeCluster: {
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  NamespaceInvalidStateFailure: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      },
                      state: {
                        type: "temporal.api.enums.v1.NamespaceState",
                        id: 2
                      },
                      allowedStates: {
                        rule: "repeated",
                        type: "temporal.api.enums.v1.NamespaceState",
                        id: 3
                      }
                    }
                  },
                  NamespaceNotFoundFailure: {
                    fields: {
                      namespace: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  NamespaceAlreadyExistsFailure: {
                    fields: {}
                  },
                  ClientVersionNotSupportedFailure: {
                    fields: {
                      clientVersion: {
                        type: "string",
                        id: 1
                      },
                      clientName: {
                        type: "string",
                        id: 2
                      },
                      supportedVersions: {
                        type: "string",
                        id: 3
                      }
                    }
                  },
                  ServerVersionNotSupportedFailure: {
                    fields: {
                      serverVersion: {
                        type: "string",
                        id: 1
                      },
                      clientSupportedServerVersions: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  CancellationAlreadyRequestedFailure: {
                    fields: {}
                  },
                  QueryFailedFailure: {
                    fields: {}
                  },
                  PermissionDeniedFailure: {
                    fields: {
                      reason: {
                        type: "string",
                        id: 1
                      }
                    }
                  },
                  ResourceExhaustedFailure: {
                    fields: {
                      cause: {
                        type: "temporal.api.enums.v1.ResourceExhaustedCause",
                        id: 1
                      }
                    }
                  },
                  SystemWorkflowFailure: {
                    fields: {
                      workflowExecution: {
                        type: "temporal.api.common.v1.WorkflowExecution",
                        id: 1
                      },
                      workflowError: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  WorkflowNotReadyFailure: {
                    fields: {}
                  },
                  NewerBuildExistsFailure: {
                    fields: {
                      defaultBuildId: {
                        type: "string",
                        id: 1
                      }
                    }
                  }
                }
              }
            }
          },
          testservice: {
            nested: {
              v1: {
                options: {
                  go_package: "go.temporal.io/api/testservice/v1;testservice",
                  java_package: "io.temporal.api.testservice.v1",
                  java_multiple_files: true,
                  java_outer_classname: "ServiceProto",
                  ruby_package: "Temporalio::Api::TestService::V1",
                  csharp_namespace: "Temporalio.Api.TestService.V1"
                },
                nested: {
                  LockTimeSkippingRequest: {
                    fields: {}
                  },
                  LockTimeSkippingResponse: {
                    fields: {}
                  },
                  UnlockTimeSkippingRequest: {
                    fields: {}
                  },
                  UnlockTimeSkippingResponse: {
                    fields: {}
                  },
                  SleepUntilRequest: {
                    fields: {
                      timestamp: {
                        type: "google.protobuf.Timestamp",
                        id: 1,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      }
                    }
                  },
                  SleepRequest: {
                    fields: {
                      duration: {
                        type: "google.protobuf.Duration",
                        id: 1,
                        options: {
                          "(gogoproto.stdduration)": true
                        }
                      }
                    }
                  },
                  SleepResponse: {
                    fields: {}
                  },
                  GetCurrentTimeResponse: {
                    fields: {
                      time: {
                        type: "google.protobuf.Timestamp",
                        id: 1,
                        options: {
                          "(gogoproto.stdtime)": true
                        }
                      }
                    }
                  },
                  TestService: {
                    methods: {
                      LockTimeSkipping: {
                        requestType: "LockTimeSkippingRequest",
                        responseType: "LockTimeSkippingResponse"
                      },
                      UnlockTimeSkipping: {
                        requestType: "UnlockTimeSkippingRequest",
                        responseType: "UnlockTimeSkippingResponse"
                      },
                      Sleep: {
                        requestType: "SleepRequest",
                        responseType: "SleepResponse"
                      },
                      SleepUntil: {
                        requestType: "SleepUntilRequest",
                        responseType: "SleepResponse"
                      },
                      UnlockTimeSkippingWithSleep: {
                        requestType: "SleepRequest",
                        responseType: "SleepResponse"
                      },
                      GetCurrentTime: {
                        requestType: "google.protobuf.Empty",
                        responseType: "GetCurrentTimeResponse"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  gogoproto: {
    options: {
      go_package: "github.com/gogo/protobuf/gogoproto"
    },
    nested: {
      goprotoEnumPrefix: {
        type: "bool",
        id: 62001,
        extend: "google.protobuf.EnumOptions"
      },
      goprotoEnumStringer: {
        type: "bool",
        id: 62021,
        extend: "google.protobuf.EnumOptions"
      },
      enumStringer: {
        type: "bool",
        id: 62022,
        extend: "google.protobuf.EnumOptions"
      },
      enumCustomname: {
        type: "string",
        id: 62023,
        extend: "google.protobuf.EnumOptions"
      },
      enumdecl: {
        type: "bool",
        id: 62024,
        extend: "google.protobuf.EnumOptions"
      },
      enumvalueCustomname: {
        type: "string",
        id: 66001,
        extend: "google.protobuf.EnumValueOptions"
      },
      goprotoGettersAll: {
        type: "bool",
        id: 63001,
        extend: "google.protobuf.FileOptions"
      },
      goprotoEnumPrefixAll: {
        type: "bool",
        id: 63002,
        extend: "google.protobuf.FileOptions"
      },
      goprotoStringerAll: {
        type: "bool",
        id: 63003,
        extend: "google.protobuf.FileOptions"
      },
      verboseEqualAll: {
        type: "bool",
        id: 63004,
        extend: "google.protobuf.FileOptions"
      },
      faceAll: {
        type: "bool",
        id: 63005,
        extend: "google.protobuf.FileOptions"
      },
      gostringAll: {
        type: "bool",
        id: 63006,
        extend: "google.protobuf.FileOptions"
      },
      populateAll: {
        type: "bool",
        id: 63007,
        extend: "google.protobuf.FileOptions"
      },
      stringerAll: {
        type: "bool",
        id: 63008,
        extend: "google.protobuf.FileOptions"
      },
      onlyoneAll: {
        type: "bool",
        id: 63009,
        extend: "google.protobuf.FileOptions"
      },
      equalAll: {
        type: "bool",
        id: 63013,
        extend: "google.protobuf.FileOptions"
      },
      descriptionAll: {
        type: "bool",
        id: 63014,
        extend: "google.protobuf.FileOptions"
      },
      testgenAll: {
        type: "bool",
        id: 63015,
        extend: "google.protobuf.FileOptions"
      },
      benchgenAll: {
        type: "bool",
        id: 63016,
        extend: "google.protobuf.FileOptions"
      },
      marshalerAll: {
        type: "bool",
        id: 63017,
        extend: "google.protobuf.FileOptions"
      },
      unmarshalerAll: {
        type: "bool",
        id: 63018,
        extend: "google.protobuf.FileOptions"
      },
      stableMarshalerAll: {
        type: "bool",
        id: 63019,
        extend: "google.protobuf.FileOptions"
      },
      sizerAll: {
        type: "bool",
        id: 63020,
        extend: "google.protobuf.FileOptions"
      },
      goprotoEnumStringerAll: {
        type: "bool",
        id: 63021,
        extend: "google.protobuf.FileOptions"
      },
      enumStringerAll: {
        type: "bool",
        id: 63022,
        extend: "google.protobuf.FileOptions"
      },
      unsafeMarshalerAll: {
        type: "bool",
        id: 63023,
        extend: "google.protobuf.FileOptions"
      },
      unsafeUnmarshalerAll: {
        type: "bool",
        id: 63024,
        extend: "google.protobuf.FileOptions"
      },
      goprotoExtensionsMapAll: {
        type: "bool",
        id: 63025,
        extend: "google.protobuf.FileOptions"
      },
      goprotoUnrecognizedAll: {
        type: "bool",
        id: 63026,
        extend: "google.protobuf.FileOptions"
      },
      gogoprotoImport: {
        type: "bool",
        id: 63027,
        extend: "google.protobuf.FileOptions"
      },
      protosizerAll: {
        type: "bool",
        id: 63028,
        extend: "google.protobuf.FileOptions"
      },
      compareAll: {
        type: "bool",
        id: 63029,
        extend: "google.protobuf.FileOptions"
      },
      typedeclAll: {
        type: "bool",
        id: 63030,
        extend: "google.protobuf.FileOptions"
      },
      enumdeclAll: {
        type: "bool",
        id: 63031,
        extend: "google.protobuf.FileOptions"
      },
      goprotoRegistration: {
        type: "bool",
        id: 63032,
        extend: "google.protobuf.FileOptions"
      },
      messagenameAll: {
        type: "bool",
        id: 63033,
        extend: "google.protobuf.FileOptions"
      },
      goprotoSizecacheAll: {
        type: "bool",
        id: 63034,
        extend: "google.protobuf.FileOptions"
      },
      goprotoUnkeyedAll: {
        type: "bool",
        id: 63035,
        extend: "google.protobuf.FileOptions"
      },
      goprotoGetters: {
        type: "bool",
        id: 64001,
        extend: "google.protobuf.MessageOptions"
      },
      goprotoStringer: {
        type: "bool",
        id: 64003,
        extend: "google.protobuf.MessageOptions"
      },
      verboseEqual: {
        type: "bool",
        id: 64004,
        extend: "google.protobuf.MessageOptions"
      },
      face: {
        type: "bool",
        id: 64005,
        extend: "google.protobuf.MessageOptions"
      },
      gostring: {
        type: "bool",
        id: 64006,
        extend: "google.protobuf.MessageOptions"
      },
      populate: {
        type: "bool",
        id: 64007,
        extend: "google.protobuf.MessageOptions"
      },
      stringer: {
        type: "bool",
        id: 67008,
        extend: "google.protobuf.MessageOptions"
      },
      onlyone: {
        type: "bool",
        id: 64009,
        extend: "google.protobuf.MessageOptions"
      },
      equal: {
        type: "bool",
        id: 64013,
        extend: "google.protobuf.MessageOptions"
      },
      description: {
        type: "bool",
        id: 64014,
        extend: "google.protobuf.MessageOptions"
      },
      testgen: {
        type: "bool",
        id: 64015,
        extend: "google.protobuf.MessageOptions"
      },
      benchgen: {
        type: "bool",
        id: 64016,
        extend: "google.protobuf.MessageOptions"
      },
      marshaler: {
        type: "bool",
        id: 64017,
        extend: "google.protobuf.MessageOptions"
      },
      unmarshaler: {
        type: "bool",
        id: 64018,
        extend: "google.protobuf.MessageOptions"
      },
      stableMarshaler: {
        type: "bool",
        id: 64019,
        extend: "google.protobuf.MessageOptions"
      },
      sizer: {
        type: "bool",
        id: 64020,
        extend: "google.protobuf.MessageOptions"
      },
      unsafeMarshaler: {
        type: "bool",
        id: 64023,
        extend: "google.protobuf.MessageOptions"
      },
      unsafeUnmarshaler: {
        type: "bool",
        id: 64024,
        extend: "google.protobuf.MessageOptions"
      },
      goprotoExtensionsMap: {
        type: "bool",
        id: 64025,
        extend: "google.protobuf.MessageOptions"
      },
      goprotoUnrecognized: {
        type: "bool",
        id: 64026,
        extend: "google.protobuf.MessageOptions"
      },
      protosizer: {
        type: "bool",
        id: 64028,
        extend: "google.protobuf.MessageOptions"
      },
      compare: {
        type: "bool",
        id: 64029,
        extend: "google.protobuf.MessageOptions"
      },
      typedecl: {
        type: "bool",
        id: 64030,
        extend: "google.protobuf.MessageOptions"
      },
      messagename: {
        type: "bool",
        id: 64033,
        extend: "google.protobuf.MessageOptions"
      },
      goprotoSizecache: {
        type: "bool",
        id: 64034,
        extend: "google.protobuf.MessageOptions"
      },
      goprotoUnkeyed: {
        type: "bool",
        id: 64035,
        extend: "google.protobuf.MessageOptions"
      },
      nullable: {
        type: "bool",
        id: 65001,
        extend: "google.protobuf.FieldOptions"
      },
      embed: {
        type: "bool",
        id: 65002,
        extend: "google.protobuf.FieldOptions"
      },
      customtype: {
        type: "string",
        id: 65003,
        extend: "google.protobuf.FieldOptions"
      },
      customname: {
        type: "string",
        id: 65004,
        extend: "google.protobuf.FieldOptions"
      },
      jsontag: {
        type: "string",
        id: 65005,
        extend: "google.protobuf.FieldOptions"
      },
      moretags: {
        type: "string",
        id: 65006,
        extend: "google.protobuf.FieldOptions"
      },
      casttype: {
        type: "string",
        id: 65007,
        extend: "google.protobuf.FieldOptions"
      },
      castkey: {
        type: "string",
        id: 65008,
        extend: "google.protobuf.FieldOptions"
      },
      castvalue: {
        type: "string",
        id: 65009,
        extend: "google.protobuf.FieldOptions"
      },
      stdtime: {
        type: "bool",
        id: 65010,
        extend: "google.protobuf.FieldOptions"
      },
      stdduration: {
        type: "bool",
        id: 65011,
        extend: "google.protobuf.FieldOptions"
      },
      wktpointer: {
        type: "bool",
        id: 65012,
        extend: "google.protobuf.FieldOptions"
      }
    }
  },
  google: {
    nested: {
      protobuf: {
        nested: {
          FileDescriptorSet: {
            fields: {
              file: {
                rule: "repeated",
                type: "FileDescriptorProto",
                id: 1
              }
            }
          },
          FileDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              "package": {
                type: "string",
                id: 2
              },
              dependency: {
                rule: "repeated",
                type: "string",
                id: 3
              },
              publicDependency: {
                rule: "repeated",
                type: "int32",
                id: 10,
                options: {
                  packed: false
                }
              },
              weakDependency: {
                rule: "repeated",
                type: "int32",
                id: 11,
                options: {
                  packed: false
                }
              },
              messageType: {
                rule: "repeated",
                type: "DescriptorProto",
                id: 4
              },
              enumType: {
                rule: "repeated",
                type: "EnumDescriptorProto",
                id: 5
              },
              service: {
                rule: "repeated",
                type: "ServiceDescriptorProto",
                id: 6
              },
              extension: {
                rule: "repeated",
                type: "FieldDescriptorProto",
                id: 7
              },
              options: {
                type: "FileOptions",
                id: 8
              },
              sourceCodeInfo: {
                type: "SourceCodeInfo",
                id: 9
              },
              syntax: {
                type: "string",
                id: 12
              }
            }
          },
          DescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              field: {
                rule: "repeated",
                type: "FieldDescriptorProto",
                id: 2
              },
              extension: {
                rule: "repeated",
                type: "FieldDescriptorProto",
                id: 6
              },
              nestedType: {
                rule: "repeated",
                type: "DescriptorProto",
                id: 3
              },
              enumType: {
                rule: "repeated",
                type: "EnumDescriptorProto",
                id: 4
              },
              extensionRange: {
                rule: "repeated",
                type: "ExtensionRange",
                id: 5
              },
              oneofDecl: {
                rule: "repeated",
                type: "OneofDescriptorProto",
                id: 8
              },
              options: {
                type: "MessageOptions",
                id: 7
              },
              reservedRange: {
                rule: "repeated",
                type: "ReservedRange",
                id: 9
              },
              reservedName: {
                rule: "repeated",
                type: "string",
                id: 10
              }
            },
            nested: {
              ExtensionRange: {
                fields: {
                  start: {
                    type: "int32",
                    id: 1
                  },
                  end: {
                    type: "int32",
                    id: 2
                  }
                }
              },
              ReservedRange: {
                fields: {
                  start: {
                    type: "int32",
                    id: 1
                  },
                  end: {
                    type: "int32",
                    id: 2
                  }
                }
              }
            }
          },
          FieldDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              number: {
                type: "int32",
                id: 3
              },
              label: {
                type: "Label",
                id: 4
              },
              type: {
                type: "Type",
                id: 5
              },
              typeName: {
                type: "string",
                id: 6
              },
              extendee: {
                type: "string",
                id: 2
              },
              defaultValue: {
                type: "string",
                id: 7
              },
              oneofIndex: {
                type: "int32",
                id: 9
              },
              jsonName: {
                type: "string",
                id: 10
              },
              options: {
                type: "FieldOptions",
                id: 8
              }
            },
            nested: {
              Type: {
                values: {
                  TYPE_DOUBLE: 1,
                  TYPE_FLOAT: 2,
                  TYPE_INT64: 3,
                  TYPE_UINT64: 4,
                  TYPE_INT32: 5,
                  TYPE_FIXED64: 6,
                  TYPE_FIXED32: 7,
                  TYPE_BOOL: 8,
                  TYPE_STRING: 9,
                  TYPE_GROUP: 10,
                  TYPE_MESSAGE: 11,
                  TYPE_BYTES: 12,
                  TYPE_UINT32: 13,
                  TYPE_ENUM: 14,
                  TYPE_SFIXED32: 15,
                  TYPE_SFIXED64: 16,
                  TYPE_SINT32: 17,
                  TYPE_SINT64: 18
                }
              },
              Label: {
                values: {
                  LABEL_OPTIONAL: 1,
                  LABEL_REQUIRED: 2,
                  LABEL_REPEATED: 3
                }
              }
            }
          },
          OneofDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              options: {
                type: "OneofOptions",
                id: 2
              }
            }
          },
          EnumDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              value: {
                rule: "repeated",
                type: "EnumValueDescriptorProto",
                id: 2
              },
              options: {
                type: "EnumOptions",
                id: 3
              }
            }
          },
          EnumValueDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              number: {
                type: "int32",
                id: 2
              },
              options: {
                type: "EnumValueOptions",
                id: 3
              }
            }
          },
          ServiceDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              method: {
                rule: "repeated",
                type: "MethodDescriptorProto",
                id: 2
              },
              options: {
                type: "ServiceOptions",
                id: 3
              }
            }
          },
          MethodDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              inputType: {
                type: "string",
                id: 2
              },
              outputType: {
                type: "string",
                id: 3
              },
              options: {
                type: "MethodOptions",
                id: 4
              },
              clientStreaming: {
                type: "bool",
                id: 5
              },
              serverStreaming: {
                type: "bool",
                id: 6
              }
            }
          },
          FileOptions: {
            fields: {
              javaPackage: {
                type: "string",
                id: 1
              },
              javaOuterClassname: {
                type: "string",
                id: 8
              },
              javaMultipleFiles: {
                type: "bool",
                id: 10
              },
              javaGenerateEqualsAndHash: {
                type: "bool",
                id: 20,
                options: {
                  deprecated: true
                }
              },
              javaStringCheckUtf8: {
                type: "bool",
                id: 27
              },
              optimizeFor: {
                type: "OptimizeMode",
                id: 9,
                options: {
                  "default": "SPEED"
                }
              },
              goPackage: {
                type: "string",
                id: 11
              },
              ccGenericServices: {
                type: "bool",
                id: 16
              },
              javaGenericServices: {
                type: "bool",
                id: 17
              },
              pyGenericServices: {
                type: "bool",
                id: 18
              },
              deprecated: {
                type: "bool",
                id: 23
              },
              ccEnableArenas: {
                type: "bool",
                id: 31
              },
              objcClassPrefix: {
                type: "string",
                id: 36
              },
              csharpNamespace: {
                type: "string",
                id: 37
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ],
            reserved: [
              [
                38,
                38
              ]
            ],
            nested: {
              OptimizeMode: {
                values: {
                  SPEED: 1,
                  CODE_SIZE: 2,
                  LITE_RUNTIME: 3
                }
              }
            }
          },
          MessageOptions: {
            fields: {
              messageSetWireFormat: {
                type: "bool",
                id: 1
              },
              noStandardDescriptorAccessor: {
                type: "bool",
                id: 2
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              mapEntry: {
                type: "bool",
                id: 7
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ],
            reserved: [
              [
                8,
                8
              ]
            ]
          },
          FieldOptions: {
            fields: {
              ctype: {
                type: "CType",
                id: 1,
                options: {
                  "default": "STRING"
                }
              },
              packed: {
                type: "bool",
                id: 2
              },
              jstype: {
                type: "JSType",
                id: 6,
                options: {
                  "default": "JS_NORMAL"
                }
              },
              lazy: {
                type: "bool",
                id: 5
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              weak: {
                type: "bool",
                id: 10
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ],
            reserved: [
              [
                4,
                4
              ]
            ],
            nested: {
              CType: {
                values: {
                  STRING: 0,
                  CORD: 1,
                  STRING_PIECE: 2
                }
              },
              JSType: {
                values: {
                  JS_NORMAL: 0,
                  JS_STRING: 1,
                  JS_NUMBER: 2
                }
              }
            }
          },
          OneofOptions: {
            fields: {
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          EnumOptions: {
            fields: {
              allowAlias: {
                type: "bool",
                id: 2
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          EnumValueOptions: {
            fields: {
              deprecated: {
                type: "bool",
                id: 1
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          ServiceOptions: {
            fields: {
              deprecated: {
                type: "bool",
                id: 33
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          MethodOptions: {
            fields: {
              deprecated: {
                type: "bool",
                id: 33
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          UninterpretedOption: {
            fields: {
              name: {
                rule: "repeated",
                type: "NamePart",
                id: 2
              },
              identifierValue: {
                type: "string",
                id: 3
              },
              positiveIntValue: {
                type: "uint64",
                id: 4
              },
              negativeIntValue: {
                type: "int64",
                id: 5
              },
              doubleValue: {
                type: "double",
                id: 6
              },
              stringValue: {
                type: "bytes",
                id: 7
              },
              aggregateValue: {
                type: "string",
                id: 8
              }
            },
            nested: {
              NamePart: {
                fields: {
                  namePart: {
                    rule: "required",
                    type: "string",
                    id: 1
                  },
                  isExtension: {
                    rule: "required",
                    type: "bool",
                    id: 2
                  }
                }
              }
            }
          },
          SourceCodeInfo: {
            fields: {
              location: {
                rule: "repeated",
                type: "Location",
                id: 1
              }
            },
            nested: {
              Location: {
                fields: {
                  path: {
                    rule: "repeated",
                    type: "int32",
                    id: 1
                  },
                  span: {
                    rule: "repeated",
                    type: "int32",
                    id: 2
                  },
                  leadingComments: {
                    type: "string",
                    id: 3
                  },
                  trailingComments: {
                    type: "string",
                    id: 4
                  },
                  leadingDetachedComments: {
                    rule: "repeated",
                    type: "string",
                    id: 6
                  }
                }
              }
            }
          },
          GeneratedCodeInfo: {
            fields: {
              annotation: {
                rule: "repeated",
                type: "Annotation",
                id: 1
              }
            },
            nested: {
              Annotation: {
                fields: {
                  path: {
                    rule: "repeated",
                    type: "int32",
                    id: 1
                  },
                  sourceFile: {
                    type: "string",
                    id: 2
                  },
                  begin: {
                    type: "int32",
                    id: 3
                  },
                  end: {
                    type: "int32",
                    id: 4
                  }
                }
              }
            }
          },
          Duration: {
            fields: {
              seconds: {
                type: "int64",
                id: 1
              },
              nanos: {
                type: "int32",
                id: 2
              }
            }
          },
          Empty: {
            fields: {}
          },
          Timestamp: {
            fields: {
              seconds: {
                type: "int64",
                id: 1
              },
              nanos: {
                type: "int32",
                id: 2
              }
            }
          },
          DoubleValue: {
            fields: {
              value: {
                type: "double",
                id: 1
              }
            }
          },
          FloatValue: {
            fields: {
              value: {
                type: "float",
                id: 1
              }
            }
          },
          Int64Value: {
            fields: {
              value: {
                type: "int64",
                id: 1
              }
            }
          },
          UInt64Value: {
            fields: {
              value: {
                type: "uint64",
                id: 1
              }
            }
          },
          Int32Value: {
            fields: {
              value: {
                type: "int32",
                id: 1
              }
            }
          },
          UInt32Value: {
            fields: {
              value: {
                type: "uint32",
                id: 1
              }
            }
          },
          BoolValue: {
            fields: {
              value: {
                type: "bool",
                id: 1
              }
            }
          },
          StringValue: {
            fields: {
              value: {
                type: "string",
                id: 1
              }
            }
          },
          BytesValue: {
            fields: {
              value: {
                type: "bytes",
                id: 1
              }
            }
          },
          Any: {
            fields: {
              type_url: {
                type: "string",
                id: 1
              },
              value: {
                type: "bytes",
                id: 2
              }
            }
          }
        }
      },
      rpc: {
        options: {
          cc_enable_arenas: true,
          go_package: "google.golang.org/genproto/googleapis/rpc/status;status",
          java_multiple_files: true,
          java_outer_classname: "StatusProto",
          java_package: "com.google.rpc",
          objc_class_prefix: "RPC"
        },
        nested: {
          Status: {
            fields: {
              code: {
                type: "int32",
                id: 1
              },
              message: {
                type: "string",
                id: 2
              },
              details: {
                rule: "repeated",
                type: "google.protobuf.Any",
                id: 3
              }
            }
          }
        }
      }
    }
  },
  grpc: {
    nested: {
      health: {
        nested: {
          v1: {
            options: {
              csharp_namespace: "Grpc.Health.V1",
              go_package: "google.golang.org/grpc/health/grpc_health_v1",
              java_multiple_files: true,
              java_outer_classname: "HealthProto",
              java_package: "io.grpc.health.v1"
            },
            nested: {
              HealthCheckRequest: {
                fields: {
                  service: {
                    type: "string",
                    id: 1
                  }
                }
              },
              HealthCheckResponse: {
                fields: {
                  status: {
                    type: "ServingStatus",
                    id: 1
                  }
                },
                nested: {
                  ServingStatus: {
                    values: {
                      UNKNOWN: 0,
                      SERVING: 1,
                      NOT_SERVING: 2,
                      SERVICE_UNKNOWN: 3
                    }
                  }
                }
              },
              Health: {
                methods: {
                  Check: {
                    requestType: "HealthCheckRequest",
                    responseType: "HealthCheckResponse"
                  },
                  Watch: {
                    requestType: "HealthCheckRequest",
                    responseType: "HealthCheckResponse",
                    responseStream: true
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

module.exports = $root;


/***/ }),

/***/ "./node_modules/@temporalio/proto/protos/root.js":
/*!*******************************************************!*\
  !*** ./node_modules/@temporalio/proto/protos/root.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Workaround an issue that prevents protobufjs from loading 'long' in Yarn 3 PnP
// https://github.com/protobufjs/protobuf.js/issues/1745#issuecomment-1200319399
const $protobuf = __webpack_require__(/*! protobufjs/light */ "./node_modules/protobufjs/light.js");
$protobuf.util.Long = __webpack_require__(/*! long */ "./node_modules/long/umd/index.js");
$protobuf.configure();

const { patchProtobufRoot } = __webpack_require__(/*! ../lib/patch-protobuf-root */ "./node_modules/@temporalio/proto/lib/patch-protobuf-root.js");
const unpatchedRoot = __webpack_require__(/*! ./json-module */ "./node_modules/@temporalio/proto/protos/json-module.js");
module.exports = patchProtobufRoot(unpatchedRoot);


/***/ }),

/***/ "./node_modules/@temporalio/worker/lib/workflow-log-interceptor.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@temporalio/worker/lib/workflow-log-interceptor.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.interceptors = exports.WorkflowInboundLogInterceptor = exports.WorkflowLogInterceptor = exports.workflowLogAttributes = void 0;
const workflow_1 = __webpack_require__(/*! @temporalio/workflow */ "./node_modules/@temporalio/workflow/lib/index.js");
const stack_helpers_1 = __webpack_require__(/*! @temporalio/workflow/lib/stack-helpers */ "./node_modules/@temporalio/workflow/lib/stack-helpers.js");
/**
 * Returns a map of attributes to be set on log messages for a given Workflow
 */
function workflowLogAttributes(info) {
    return {
        namespace: info.namespace,
        taskQueue: info.taskQueue,
        workflowId: info.workflowId,
        runId: info.runId,
        workflowType: info.workflowType,
    };
}
exports.workflowLogAttributes = workflowLogAttributes;
/** Logs workflow execution starts and completions, attaches log attributes to `workflow.log` calls  */
class WorkflowLogInterceptor {
    getLogAttributes(input, next) {
        return next({ ...input, ...workflowLogAttributes((0, workflow_1.workflowInfo)()) });
    }
    execute(input, next) {
        workflow_1.log.debug('Workflow started');
        const p = next(input).then((res) => {
            workflow_1.log.debug('Workflow completed');
            return res;
        }, (error) => {
            // Avoid using instanceof checks in case the modules they're defined in loaded more than once,
            // e.g. by jest or when multiple versions are installed.
            if (typeof error === 'object' && error != null) {
                if ((0, workflow_1.isCancellation)(error)) {
                    workflow_1.log.debug('Workflow completed as cancelled');
                    throw error;
                }
                else if (error instanceof workflow_1.ContinueAsNew) {
                    workflow_1.log.debug('Workflow continued as new');
                    throw error;
                }
            }
            workflow_1.log.warn('Workflow failed', { error });
            throw error;
        });
        // Avoid showing this interceptor in stack trace query
        (0, stack_helpers_1.untrackPromise)(p);
        return p;
    }
}
exports.WorkflowLogInterceptor = WorkflowLogInterceptor;
/** @deprecated use {@link WorkflowLogInterceptor} instead */
exports.WorkflowInboundLogInterceptor = WorkflowLogInterceptor;
// ts-prune-ignore-next
const interceptors = () => {
    const interceptor = new WorkflowLogInterceptor();
    return { inbound: [interceptor], outbound: [interceptor] };
};
exports.interceptors = interceptors;


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/alea.js":
/*!*******************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/alea.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Mash = exports.alea = void 0;
// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// Taken and modified from https://github.com/davidbau/seedrandom/blob/released/lib/alea.js
class Alea {
    constructor(seed) {
        const mash = new Mash();
        // Apply the seeding algorithm from Baagoe.
        this.c = 1;
        this.s0 = mash.mash([32]);
        this.s1 = mash.mash([32]);
        this.s2 = mash.mash([32]);
        this.s0 -= mash.mash(seed);
        if (this.s0 < 0) {
            this.s0 += 1;
        }
        this.s1 -= mash.mash(seed);
        if (this.s1 < 0) {
            this.s1 += 1;
        }
        this.s2 -= mash.mash(seed);
        if (this.s2 < 0) {
            this.s2 += 1;
        }
    }
    next() {
        const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32
        this.s0 = this.s1;
        this.s1 = this.s2;
        return (this.s2 = t - (this.c = t | 0));
    }
}
function alea(seed) {
    const xg = new Alea(seed);
    return xg.next.bind(xg);
}
exports.alea = alea;
class Mash {
    constructor() {
        this.n = 0xefc8249d;
    }
    mash(data) {
        let { n } = this;
        for (let i = 0; i < data.length; i++) {
            n += data[i];
            let h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000; // 2^32
        }
        this.n = n;
        return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    }
}
exports.Mash = Mash;


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/cancellation-scope.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/cancellation-scope.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CancellationScope_cancelRequested;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerSleepImplementation = exports.RootCancellationScope = exports.disableStorage = exports.CancellationScope = exports.AsyncLocalStorage = void 0;
const common_1 = __webpack_require__(/*! @temporalio/common */ "./node_modules/@temporalio/common/lib/index.js");
const stack_helpers_1 = __webpack_require__(/*! ./stack-helpers */ "./node_modules/@temporalio/workflow/lib/stack-helpers.js");
// AsyncLocalStorage is injected via vm module into global scope.
// In case Workflow code is imported in Node.js context, replace with an empty class.
exports.AsyncLocalStorage = globalThis.AsyncLocalStorage ?? class {
};
/** Magic symbol used to create the root scope - intentionally not exported */
const NO_PARENT = Symbol('NO_PARENT');
/**
 * In the SDK, Workflows are represented internally by a tree of scopes where the `execute` function runs in the root scope.
 * Cancellation propagates from outer scopes to inner ones and is handled by catching {@link CancelledFailure}s
 * thrown by cancellable operations (see below).
 *
 * Scopes are created using the `CancellationScope` constructor or the static helper methods
 * {@link cancellable}, {@link nonCancellable} and {@link withTimeout}.
 *
 * When a `CancellationScope` is cancelled, it will propagate cancellation any child scopes and any cancellable
 * operations created within it, such as:
 *
 * - Activities
 * - Child Workflows
 * - Timers (created with the {@link sleep} function)
 * - {@link Trigger}s
 *
 * @example
 *
 * ```ts
 * await CancellationScope.cancellable(async () => {
 *   const promise = someActivity();
 *   CancellationScope.current().cancel(); // Cancels the activity
 *   await promise; // Throws `ActivityFailure` with `cause` set to `CancelledFailure`
 * });
 * ```
 *
 * @example
 *
 * ```ts
 * const scope = new CancellationScope();
 * const promise = scope.run(someActivity);
 * scope.cancel(); // Cancels the activity
 * await promise; // Throws `ActivityFailure` with `cause` set to `CancelledFailure`
 * ```
 */
class CancellationScope {
    constructor(options) {
        _CancellationScope_cancelRequested.set(this, false);
        this.timeout = options?.timeout;
        this.cancellable = options?.cancellable ?? true;
        this.cancelRequested = new Promise((_, reject) => {
            // Typescript does not understand that the Promise executor runs synchronously
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.reject = (err) => {
                __classPrivateFieldSet(this, _CancellationScope_cancelRequested, true, "f");
                reject(err);
            };
        });
        (0, stack_helpers_1.untrackPromise)(this.cancelRequested);
        // Avoid unhandled rejections
        (0, stack_helpers_1.untrackPromise)(this.cancelRequested.catch(() => undefined));
        if (options?.parent !== NO_PARENT) {
            this.parent = options?.parent || CancellationScope.current();
            __classPrivateFieldSet(this, _CancellationScope_cancelRequested, __classPrivateFieldGet(this.parent, _CancellationScope_cancelRequested, "f"), "f");
            this.parent.cancelRequested.catch((err) => {
                this.reject(err);
            });
        }
    }
    get consideredCancelled() {
        return __classPrivateFieldGet(this, _CancellationScope_cancelRequested, "f") && this.cancellable;
    }
    /**
     * Activate the scope as current and run  `fn`
     *
     * Any timers, Activities, Triggers and CancellationScopes created in the body of `fn`
     * automatically link their cancellation to this scope.
     *
     * @return the result of `fn`
     */
    run(fn) {
        return storage.run(this, this.runInContext.bind(this, fn));
    }
    /**
     * Method that runs a function in AsyncLocalStorage context.
     *
     * Could have been written as anonymous function, made into a method for improved stack traces.
     */
    async runInContext(fn) {
        if (this.timeout) {
            (0, stack_helpers_1.untrackPromise)(sleep(this.timeout).then(() => this.cancel(), () => {
                // scope was already cancelled, ignore
            }));
        }
        return await fn();
    }
    /**
     * Request to cancel the scope and linked children
     */
    cancel() {
        this.reject(new common_1.CancelledFailure('Cancellation scope cancelled'));
    }
    /**
     * Get the current "active" scope
     */
    static current() {
        // Using globals directly instead of a helper function to avoid circular import
        return storage.getStore() ?? globalThis.__TEMPORAL_ACTIVATOR__.rootScope;
    }
    /** Alias to `new CancellationScope({ cancellable: true }).run(fn)` */
    static cancellable(fn) {
        return new this({ cancellable: true }).run(fn);
    }
    /** Alias to `new CancellationScope({ cancellable: false }).run(fn)` */
    static nonCancellable(fn) {
        return new this({ cancellable: false }).run(fn);
    }
    /** Alias to `new CancellationScope({ cancellable: true, timeout }).run(fn)` */
    static withTimeout(timeout, fn) {
        return new this({ cancellable: true, timeout }).run(fn);
    }
}
exports.CancellationScope = CancellationScope;
_CancellationScope_cancelRequested = new WeakMap();
const storage = new exports.AsyncLocalStorage();
/**
 * Avoid exposing the storage directly so it doesn't get frozen
 */
function disableStorage() {
    storage.disable();
}
exports.disableStorage = disableStorage;
class RootCancellationScope extends CancellationScope {
    constructor() {
        super({ cancellable: true, parent: NO_PARENT });
    }
    cancel() {
        this.reject(new common_1.CancelledFailure('Workflow cancelled'));
    }
}
exports.RootCancellationScope = RootCancellationScope;
/** This function is here to avoid a circular dependency between this module and workflow.ts */
let sleep = (_) => {
    throw new common_1.IllegalStateError('Workflow has not been properly initialized');
};
function registerSleepImplementation(fn) {
    sleep = fn;
}
exports.registerSleepImplementation = registerSleepImplementation;


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/errors.js":
/*!*********************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/errors.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isCancellation = exports.DeterminismViolationError = exports.WorkflowError = void 0;
const common_1 = __webpack_require__(/*! @temporalio/common */ "./node_modules/@temporalio/common/lib/index.js");
const type_helpers_1 = __webpack_require__(/*! @temporalio/common/lib/type-helpers */ "./node_modules/@temporalio/common/lib/type-helpers.js");
/**
 * Base class for all workflow errors
 */
let WorkflowError = class WorkflowError extends Error {
};
WorkflowError = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('WorkflowError')
], WorkflowError);
exports.WorkflowError = WorkflowError;
/**
 * Thrown in workflow when it tries to do something that non-deterministic such as construct a WeakRef()
 */
let DeterminismViolationError = class DeterminismViolationError extends WorkflowError {
};
DeterminismViolationError = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('DeterminismViolationError')
], DeterminismViolationError);
exports.DeterminismViolationError = DeterminismViolationError;
/**
 * Returns whether provided `err` is caused by cancellation
 */
function isCancellation(err) {
    return (err instanceof common_1.CancelledFailure ||
        ((err instanceof common_1.ActivityFailure || err instanceof common_1.ChildWorkflowFailure) && err.cause instanceof common_1.CancelledFailure));
}
exports.isCancellation = isCancellation;


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/global-attributes.js":
/*!********************************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/global-attributes.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setActivatorUntyped = exports.maybeGetActivatorUntyped = void 0;
function maybeGetActivatorUntyped() {
    return globalThis.__TEMPORAL_ACTIVATOR__;
}
exports.maybeGetActivatorUntyped = maybeGetActivatorUntyped;
function setActivatorUntyped(activator) {
    globalThis.__TEMPORAL_ACTIVATOR__ = activator;
}
exports.setActivatorUntyped = setActivatorUntyped;


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/index.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * This library provides tools required for authoring workflows.
 *
 * ## Usage
 * See the {@link https://docs.temporal.io/typescript/hello-world#workflows | tutorial} for writing your first workflow.
 *
 * ### Timers
 *
 * The recommended way of scheduling timers is by using the {@link sleep} function. We've replaced `setTimeout` and
 * `clearTimeout` with deterministic versions so these are also usable but have a limitation that they don't play well
 * with {@link https://docs.temporal.io/typescript/cancellation-scopes | cancellation scopes}.
 *
 * <!--SNIPSTART typescript-sleep-workflow-->
 * <!--SNIPEND-->
 *
 * ### Activities
 *
 * To schedule Activities, use {@link proxyActivities} to obtain an Activity function and call.
 *
 * <!--SNIPSTART typescript-schedule-activity-workflow-->
 * <!--SNIPEND-->
 *
 * ### Signals and Queries
 *
 * To add signal handlers to a Workflow, add a signals property to the exported `workflow` object. Signal handlers can
 * return either `void` or `Promise<void>`, you may schedule activities and timers from a signal handler.
 *
 * To add query handlers to a Workflow, add a queries property to the exported `workflow` object. Query handlers must
 * **not** mutate any variables or generate any commands (like Activities or Timers), they run synchronously and thus
 * **must** return a `Promise`.
 *
 * #### Implementation
 *
 * <!--SNIPSTART typescript-workflow-signal-implementation-->
 * <!--SNIPEND-->
 *
 * ### More
 *
 * - [Deterministic built-ins](https://docs.temporal.io/typescript/determinism#sources-of-non-determinism)
 * - [Cancellation and scopes](https://docs.temporal.io/typescript/cancellation-scopes)
 *   - {@link CancellationScope}
 *   - {@link Trigger}
 * - [Sinks](https://docs.temporal.io/application-development/observability/?lang=ts#logging)
 *   - {@link Sinks}
 *
 * @module
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Trigger = exports.ParentClosePolicy = exports.ContinueAsNew = exports.ChildWorkflowCancellationType = exports.CancellationScope = exports.AsyncLocalStorage = exports.TimeoutFailure = exports.TerminatedFailure = exports.TemporalFailure = exports.ServerFailure = exports.rootCause = exports.defaultPayloadConverter = exports.ChildWorkflowFailure = exports.CancelledFailure = exports.ApplicationFailure = exports.ActivityFailure = exports.ActivityCancellationType = void 0;
var common_1 = __webpack_require__(/*! @temporalio/common */ "./node_modules/@temporalio/common/lib/index.js");
Object.defineProperty(exports, "ActivityCancellationType", ({ enumerable: true, get: function () { return common_1.ActivityCancellationType; } }));
Object.defineProperty(exports, "ActivityFailure", ({ enumerable: true, get: function () { return common_1.ActivityFailure; } }));
Object.defineProperty(exports, "ApplicationFailure", ({ enumerable: true, get: function () { return common_1.ApplicationFailure; } }));
Object.defineProperty(exports, "CancelledFailure", ({ enumerable: true, get: function () { return common_1.CancelledFailure; } }));
Object.defineProperty(exports, "ChildWorkflowFailure", ({ enumerable: true, get: function () { return common_1.ChildWorkflowFailure; } }));
Object.defineProperty(exports, "defaultPayloadConverter", ({ enumerable: true, get: function () { return common_1.defaultPayloadConverter; } }));
Object.defineProperty(exports, "rootCause", ({ enumerable: true, get: function () { return common_1.rootCause; } }));
Object.defineProperty(exports, "ServerFailure", ({ enumerable: true, get: function () { return common_1.ServerFailure; } }));
Object.defineProperty(exports, "TemporalFailure", ({ enumerable: true, get: function () { return common_1.TemporalFailure; } }));
Object.defineProperty(exports, "TerminatedFailure", ({ enumerable: true, get: function () { return common_1.TerminatedFailure; } }));
Object.defineProperty(exports, "TimeoutFailure", ({ enumerable: true, get: function () { return common_1.TimeoutFailure; } }));
__exportStar(__webpack_require__(/*! @temporalio/common/lib/errors */ "./node_modules/@temporalio/common/lib/errors.js"), exports);
__exportStar(__webpack_require__(/*! @temporalio/common/lib/workflow-handle */ "./node_modules/@temporalio/common/lib/workflow-handle.js"), exports);
__exportStar(__webpack_require__(/*! @temporalio/common/lib/workflow-options */ "./node_modules/@temporalio/common/lib/workflow-options.js"), exports);
var cancellation_scope_1 = __webpack_require__(/*! ./cancellation-scope */ "./node_modules/@temporalio/workflow/lib/cancellation-scope.js");
Object.defineProperty(exports, "AsyncLocalStorage", ({ enumerable: true, get: function () { return cancellation_scope_1.AsyncLocalStorage; } }));
Object.defineProperty(exports, "CancellationScope", ({ enumerable: true, get: function () { return cancellation_scope_1.CancellationScope; } }));
__exportStar(__webpack_require__(/*! ./errors */ "./node_modules/@temporalio/workflow/lib/errors.js"), exports);
__exportStar(__webpack_require__(/*! ./interceptors */ "./node_modules/@temporalio/workflow/lib/interceptors.js"), exports);
var interfaces_1 = __webpack_require__(/*! ./interfaces */ "./node_modules/@temporalio/workflow/lib/interfaces.js");
Object.defineProperty(exports, "ChildWorkflowCancellationType", ({ enumerable: true, get: function () { return interfaces_1.ChildWorkflowCancellationType; } }));
Object.defineProperty(exports, "ContinueAsNew", ({ enumerable: true, get: function () { return interfaces_1.ContinueAsNew; } }));
Object.defineProperty(exports, "ParentClosePolicy", ({ enumerable: true, get: function () { return interfaces_1.ParentClosePolicy; } }));
var trigger_1 = __webpack_require__(/*! ./trigger */ "./node_modules/@temporalio/workflow/lib/trigger.js");
Object.defineProperty(exports, "Trigger", ({ enumerable: true, get: function () { return trigger_1.Trigger; } }));
__exportStar(__webpack_require__(/*! ./workflow */ "./node_modules/@temporalio/workflow/lib/workflow.js"), exports);


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/interceptors.js":
/*!***************************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/interceptors.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Type definitions and generic helpers for interceptors.
 *
 * The Workflow specific interceptors are defined here.
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/interfaces.js":
/*!*************************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/interfaces.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParentClosePolicy = exports.ChildWorkflowCancellationType = exports.ContinueAsNew = void 0;
const type_helpers_1 = __webpack_require__(/*! @temporalio/common/lib/type-helpers */ "./node_modules/@temporalio/common/lib/type-helpers.js");
/**
 * Not an actual error, used by the Workflow runtime to abort execution when {@link continueAsNew} is called
 */
let ContinueAsNew = class ContinueAsNew extends Error {
    constructor(command) {
        super('Workflow continued as new');
        this.command = command;
    }
};
ContinueAsNew = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('ContinueAsNew')
], ContinueAsNew);
exports.ContinueAsNew = ContinueAsNew;
/**
 * Specifies:
 * - whether cancellation requests are sent to the Child
 * - whether and when a {@link CanceledFailure} is thrown from {@link executeChild} or
 *   {@link ChildWorkflowHandle.result}
 *
 * @default {@link ChildWorkflowCancellationType.WAIT_CANCELLATION_COMPLETED}
 */
var ChildWorkflowCancellationType;
(function (ChildWorkflowCancellationType) {
    /**
     * Don't send a cancellation request to the Child.
     */
    ChildWorkflowCancellationType[ChildWorkflowCancellationType["ABANDON"] = 0] = "ABANDON";
    /**
     * Send a cancellation request to the Child. Immediately throw the error.
     */
    ChildWorkflowCancellationType[ChildWorkflowCancellationType["TRY_CANCEL"] = 1] = "TRY_CANCEL";
    /**
     * Send a cancellation request to the Child. The Child may respect cancellation, in which case an error will be thrown
     * when cancellation has completed, and {@link isCancellation}(error) will be true. On the other hand, the Child may
     * ignore the cancellation request, in which case an error might be thrown with a different cause, or the Child may
     * complete successfully.
     *
     * @default
     */
    ChildWorkflowCancellationType[ChildWorkflowCancellationType["WAIT_CANCELLATION_COMPLETED"] = 2] = "WAIT_CANCELLATION_COMPLETED";
    /**
     * Send a cancellation request to the Child. Throw the error once the Server receives the Child cancellation request.
     */
    ChildWorkflowCancellationType[ChildWorkflowCancellationType["WAIT_CANCELLATION_REQUESTED"] = 3] = "WAIT_CANCELLATION_REQUESTED";
})(ChildWorkflowCancellationType = exports.ChildWorkflowCancellationType || (exports.ChildWorkflowCancellationType = {}));
(0, type_helpers_1.checkExtends)();
(0, type_helpers_1.checkExtends)();
/**
 * How a Child Workflow reacts to the Parent Workflow reaching a Closed state.
 *
 * @see {@link https://docs.temporal.io/concepts/what-is-a-parent-close-policy/ | Parent Close Policy}
 */
var ParentClosePolicy;
(function (ParentClosePolicy) {
    /**
     * If a `ParentClosePolicy` is set to this, or is not set at all, the server default value will be used.
     */
    ParentClosePolicy[ParentClosePolicy["PARENT_CLOSE_POLICY_UNSPECIFIED"] = 0] = "PARENT_CLOSE_POLICY_UNSPECIFIED";
    /**
     * When the Parent is Closed, the Child is Terminated.
     *
     * @default
     */
    ParentClosePolicy[ParentClosePolicy["PARENT_CLOSE_POLICY_TERMINATE"] = 1] = "PARENT_CLOSE_POLICY_TERMINATE";
    /**
     * When the Parent is Closed, nothing is done to the Child.
     */
    ParentClosePolicy[ParentClosePolicy["PARENT_CLOSE_POLICY_ABANDON"] = 2] = "PARENT_CLOSE_POLICY_ABANDON";
    /**
     * When the Parent is Closed, the Child is Cancelled.
     */
    ParentClosePolicy[ParentClosePolicy["PARENT_CLOSE_POLICY_REQUEST_CANCEL"] = 3] = "PARENT_CLOSE_POLICY_REQUEST_CANCEL";
})(ParentClosePolicy = exports.ParentClosePolicy || (exports.ParentClosePolicy = {}));
(0, type_helpers_1.checkExtends)();
(0, type_helpers_1.checkExtends)();


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/internals.js":
/*!************************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/internals.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getActivator = exports.maybeGetActivator = exports.Activator = exports.LocalActivityDoBackoff = void 0;
const common_1 = __webpack_require__(/*! @temporalio/common */ "./node_modules/@temporalio/common/lib/index.js");
const interceptors_1 = __webpack_require__(/*! @temporalio/common/lib/interceptors */ "./node_modules/@temporalio/common/lib/interceptors.js");
const type_helpers_1 = __webpack_require__(/*! @temporalio/common/lib/type-helpers */ "./node_modules/@temporalio/common/lib/type-helpers.js");
const alea_1 = __webpack_require__(/*! ./alea */ "./node_modules/@temporalio/workflow/lib/alea.js");
const cancellation_scope_1 = __webpack_require__(/*! ./cancellation-scope */ "./node_modules/@temporalio/workflow/lib/cancellation-scope.js");
const errors_1 = __webpack_require__(/*! ./errors */ "./node_modules/@temporalio/workflow/lib/errors.js");
const interfaces_1 = __webpack_require__(/*! ./interfaces */ "./node_modules/@temporalio/workflow/lib/interfaces.js");
const stack_helpers_1 = __webpack_require__(/*! ./stack-helpers */ "./node_modules/@temporalio/workflow/lib/stack-helpers.js");
const pkg_1 = __importDefault(__webpack_require__(/*! ./pkg */ "./node_modules/@temporalio/workflow/lib/pkg.js"));
const global_attributes_1 = __webpack_require__(/*! ./global-attributes */ "./node_modules/@temporalio/workflow/lib/global-attributes.js");
var StartChildWorkflowExecutionFailedCause;
(function (StartChildWorkflowExecutionFailedCause) {
    StartChildWorkflowExecutionFailedCause[StartChildWorkflowExecutionFailedCause["START_CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_UNSPECIFIED"] = 0] = "START_CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_UNSPECIFIED";
    StartChildWorkflowExecutionFailedCause[StartChildWorkflowExecutionFailedCause["START_CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_WORKFLOW_ALREADY_EXISTS"] = 1] = "START_CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_WORKFLOW_ALREADY_EXISTS";
})(StartChildWorkflowExecutionFailedCause || (StartChildWorkflowExecutionFailedCause = {}));
(0, type_helpers_1.checkExtends)();
(0, type_helpers_1.checkExtends)();
/**
 * A class that acts as a marker for this special result type
 */
let LocalActivityDoBackoff = class LocalActivityDoBackoff extends Error {
    constructor(backoff) {
        super();
        this.backoff = backoff;
    }
};
LocalActivityDoBackoff = __decorate([
    (0, type_helpers_1.SymbolBasedInstanceOfError)('LocalActivityDoBackoff')
], LocalActivityDoBackoff);
exports.LocalActivityDoBackoff = LocalActivityDoBackoff;
/**
 * Keeps all of the Workflow runtime state like pending completions for activities and timers.
 *
 * Implements handlers for all workflow activation jobs.
 */
class Activator {
    constructor({ info, now, showStackTraceSources, sourceMap, getTimeOfDay, randomnessSeed, patches, registeredActivityNames, }) {
        /**
         * Cache for modules - referenced in reusable-vm.ts
         */
        this.moduleCache = new Map();
        /**
         * Map of task sequence to a Completion
         */
        this.completions = {
            timer: new Map(),
            activity: new Map(),
            childWorkflowStart: new Map(),
            childWorkflowComplete: new Map(),
            signalWorkflow: new Map(),
            cancelWorkflow: new Map(),
        };
        /**
         * Holds buffered signal calls until a handler is registered
         */
        this.bufferedSignals = Array();
        /**
         * Holds buffered query calls until a handler is registered.
         *
         * **IMPORTANT** queries are only buffered until workflow is started.
         * This is required because async interceptors might block workflow function invocation
         * which delays query handler registration.
         */
        this.bufferedQueries = Array();
        /**
         * Mapping of signal name to handler
         */
        this.signalHandlers = new Map();
        this.promiseStackStore = {
            promiseToStack: new Map(),
            childToParent: new Map(),
        };
        this.rootScope = new cancellation_scope_1.RootCancellationScope();
        /**
         * Mapping of query name to handler
         */
        this.queryHandlers = new Map([
            [
                '__stack_trace',
                () => {
                    return this.getStackTraces()
                        .map((s) => s.formatted)
                        .join('\n\n');
                },
            ],
            [
                '__enhanced_stack_trace',
                () => {
                    const { sourceMap } = this;
                    const sdk = { name: 'typescript', version: pkg_1.default.version };
                    const stacks = this.getStackTraces().map(({ structured: locations }) => ({ locations }));
                    const sources = {};
                    if (this.showStackTraceSources) {
                        for (const { locations } of stacks) {
                            for (const { filePath } of locations) {
                                if (!filePath)
                                    continue;
                                const content = sourceMap?.sourcesContent?.[sourceMap?.sources.indexOf(filePath)];
                                if (!content)
                                    continue;
                                sources[filePath] = [
                                    {
                                        content,
                                        lineOffset: 0,
                                    },
                                ];
                            }
                        }
                    }
                    return { sdk, stacks, sources };
                },
            ],
        ]);
        /**
         * Loaded in {@link initRuntime}
         */
        this.interceptors = { inbound: [], outbound: [], internals: [] };
        /**
         * Buffer that stores all generated commands, reset after each activation
         */
        this.commands = [];
        /**
         * Stores all {@link condition}s that haven't been unblocked yet
         */
        this.blockedConditions = new Map();
        /**
         * Is this Workflow completed?
         *
         * A Workflow will be considered completed if it generates a command that the
         * system considers as a final Workflow command (e.g.
         * completeWorkflowExecution or failWorkflowExecution).
         */
        this.completed = false;
        /**
         * Was this Workflow cancelled?
         */
        this.cancelled = false;
        /**
         * This is tracked to allow buffering queries until a workflow function is called.
         * TODO(bergundy): I don't think this makes sense since queries run last in an activation and must be responded to in
         * the same activation.
         */
        this.workflowFunctionWasCalled = false;
        /**
         * The next (incremental) sequence to assign when generating completable commands
         */
        this.nextSeqs = {
            timer: 1,
            activity: 1,
            childWorkflow: 1,
            signalWorkflow: 1,
            cancelWorkflow: 1,
            condition: 1,
            // Used internally to keep track of active stack traces
            stack: 1,
        };
        this.payloadConverter = common_1.defaultPayloadConverter;
        this.failureConverter = common_1.defaultFailureConverter;
        /**
         * Patches we know the status of for this workflow, as in {@link patched}
         */
        this.knownPresentPatches = new Set();
        /**
         * Patches we sent to core {@link patched}
         */
        this.sentPatches = new Set();
        /**
         * Buffered sink calls per activation
         */
        this.sinkCalls = Array();
        this.getTimeOfDay = getTimeOfDay;
        this.info = info;
        this.now = now;
        this.showStackTraceSources = showStackTraceSources;
        this.sourceMap = sourceMap;
        this.random = (0, alea_1.alea)(randomnessSeed);
        this.registeredActivityNames = registeredActivityNames;
        if (info.unsafe.isReplaying) {
            for (const patchId of patches) {
                this.notifyHasPatch({ patchId });
            }
        }
    }
    getStackTraces() {
        const { childToParent, promiseToStack } = this.promiseStackStore;
        const internalNodes = [...childToParent.values()].reduce((acc, curr) => {
            for (const p of curr) {
                acc.add(p);
            }
            return acc;
        }, new Set());
        const stacks = new Map();
        for (const child of childToParent.keys()) {
            if (!internalNodes.has(child)) {
                const stack = promiseToStack.get(child);
                if (!stack || !stack.formatted)
                    continue;
                stacks.set(stack.formatted, stack);
            }
        }
        // Not 100% sure where this comes from, just filter it out
        stacks.delete('    at Promise.then (<anonymous>)');
        stacks.delete('    at Promise.then (<anonymous>)\n');
        return [...stacks].map(([_, stack]) => stack);
    }
    getAndResetSinkCalls() {
        const { sinkCalls } = this;
        this.sinkCalls = [];
        return sinkCalls;
    }
    /**
     * Buffer a Workflow command to be collected at the end of the current activation.
     *
     * Prevents commands from being added after Workflow completion.
     */
    pushCommand(cmd, complete = false) {
        // Only query responses may be sent after completion
        if (this.completed && !cmd.respondToQuery)
            return;
        this.commands.push(cmd);
        if (complete) {
            this.completed = true;
        }
    }
    getAndResetCommands() {
        const commands = this.commands;
        this.commands = [];
        return commands;
    }
    async startWorkflowNextHandler({ args }) {
        const { workflow } = this;
        if (workflow === undefined) {
            throw new common_1.IllegalStateError('Workflow uninitialized');
        }
        let promise;
        try {
            promise = workflow(...args);
        }
        finally {
            // Guarantee this runs even if there was an exception when invoking the Workflow function
            // Otherwise this Workflow will now be queryable.
            this.workflowFunctionWasCalled = true;
            // Empty the buffer
            const buffer = this.bufferedQueries.splice(0);
            for (const activation of buffer) {
                this.queryWorkflow(activation);
            }
        }
        return await promise;
    }
    startWorkflow(activation) {
        const execute = (0, interceptors_1.composeInterceptors)(this.interceptors.inbound, 'execute', this.startWorkflowNextHandler.bind(this));
        (0, stack_helpers_1.untrackPromise)(execute({
            headers: activation.headers ?? {},
            args: (0, common_1.arrayFromPayloads)(this.payloadConverter, activation.arguments),
        }).then(this.completeWorkflow.bind(this), this.handleWorkflowFailure.bind(this)));
    }
    cancelWorkflow(_activation) {
        this.cancelled = true;
        this.rootScope.cancel();
    }
    fireTimer(activation) {
        // Timers are a special case where their completion might not be in Workflow state,
        // this is due to immediate timer cancellation that doesn't go wait for Core.
        const completion = this.maybeConsumeCompletion('timer', getSeq(activation));
        completion?.resolve(undefined);
    }
    resolveActivity(activation) {
        if (!activation.result) {
            throw new TypeError('Got ResolveActivity activation with no result');
        }
        const { resolve, reject } = this.consumeCompletion('activity', getSeq(activation));
        if (activation.result.completed) {
            const completed = activation.result.completed;
            const result = completed.result ? this.payloadConverter.fromPayload(completed.result) : undefined;
            resolve(result);
        }
        else if (activation.result.failed) {
            const { failure } = activation.result.failed;
            const err = failure ? this.failureToError(failure) : undefined;
            reject(err);
        }
        else if (activation.result.cancelled) {
            const { failure } = activation.result.cancelled;
            const err = failure ? this.failureToError(failure) : undefined;
            reject(err);
        }
        else if (activation.result.backoff) {
            reject(new LocalActivityDoBackoff(activation.result.backoff));
        }
    }
    resolveChildWorkflowExecutionStart(activation) {
        const { resolve, reject } = this.consumeCompletion('childWorkflowStart', getSeq(activation));
        if (activation.succeeded) {
            resolve(activation.succeeded.runId);
        }
        else if (activation.failed) {
            if (activation.failed.cause !==
                StartChildWorkflowExecutionFailedCause.START_CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_WORKFLOW_ALREADY_EXISTS) {
                throw new common_1.IllegalStateError('Got unknown StartChildWorkflowExecutionFailedCause');
            }
            if (!(activation.seq && activation.failed.workflowId && activation.failed.workflowType)) {
                throw new TypeError('Missing attributes in activation job');
            }
            reject(new common_1.WorkflowExecutionAlreadyStartedError('Workflow execution already started', activation.failed.workflowId, activation.failed.workflowType));
        }
        else if (activation.cancelled) {
            if (!activation.cancelled.failure) {
                throw new TypeError('Got no failure in cancelled variant');
            }
            reject(this.failureToError(activation.cancelled.failure));
        }
        else {
            throw new TypeError('Got ResolveChildWorkflowExecutionStart with no status');
        }
    }
    resolveChildWorkflowExecution(activation) {
        if (!activation.result) {
            throw new TypeError('Got ResolveChildWorkflowExecution activation with no result');
        }
        const { resolve, reject } = this.consumeCompletion('childWorkflowComplete', getSeq(activation));
        if (activation.result.completed) {
            const completed = activation.result.completed;
            const result = completed.result ? this.payloadConverter.fromPayload(completed.result) : undefined;
            resolve(result);
        }
        else if (activation.result.failed) {
            const { failure } = activation.result.failed;
            if (failure === undefined || failure === null) {
                throw new TypeError('Got failed result with no failure attribute');
            }
            reject(this.failureToError(failure));
        }
        else if (activation.result.cancelled) {
            const { failure } = activation.result.cancelled;
            if (failure === undefined || failure === null) {
                throw new TypeError('Got cancelled result with no failure attribute');
            }
            reject(this.failureToError(failure));
        }
    }
    // Intentionally not made function async so this handler doesn't show up in the stack trace
    queryWorkflowNextHandler({ queryName, args }) {
        const fn = this.queryHandlers.get(queryName);
        if (fn === undefined) {
            const knownQueryTypes = [...this.queryHandlers.keys()].join(' ');
            // Fail the query
            return Promise.reject(new ReferenceError(`Workflow did not register a handler for ${queryName}. Registered queries: [${knownQueryTypes}]`));
        }
        try {
            const ret = fn(...args);
            if (ret instanceof Promise) {
                return Promise.reject(new errors_1.DeterminismViolationError('Query handlers should not return a Promise'));
            }
            return Promise.resolve(ret);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    queryWorkflow(activation) {
        if (!this.workflowFunctionWasCalled) {
            this.bufferedQueries.push(activation);
            return;
        }
        const { queryType, queryId, headers } = activation;
        if (!(queryType && queryId)) {
            throw new TypeError('Missing query activation attributes');
        }
        const execute = (0, interceptors_1.composeInterceptors)(this.interceptors.inbound, 'handleQuery', this.queryWorkflowNextHandler.bind(this));
        execute({
            queryName: queryType,
            args: (0, common_1.arrayFromPayloads)(this.payloadConverter, activation.arguments),
            queryId,
            headers: headers ?? {},
        }).then((result) => this.completeQuery(queryId, result), (reason) => this.failQuery(queryId, reason));
    }
    async signalWorkflowNextHandler({ signalName, args }) {
        const fn = this.signalHandlers.get(signalName);
        if (fn) {
            return await fn(...args);
        }
        else if (this.defaultSignalHandler) {
            return await this.defaultSignalHandler(signalName, ...args);
        }
        else {
            throw new common_1.IllegalStateError(`No registered signal handler for signal ${signalName}`);
        }
    }
    signalWorkflow(activation) {
        const { signalName, headers } = activation;
        if (!signalName) {
            throw new TypeError('Missing activation signalName');
        }
        if (!this.signalHandlers.has(signalName) && !this.defaultSignalHandler) {
            this.bufferedSignals.push(activation);
            return;
        }
        const execute = (0, interceptors_1.composeInterceptors)(this.interceptors.inbound, 'handleSignal', this.signalWorkflowNextHandler.bind(this));
        execute({
            args: (0, common_1.arrayFromPayloads)(this.payloadConverter, activation.input),
            signalName,
            headers: headers ?? {},
        }).catch(this.handleWorkflowFailure.bind(this));
    }
    dispatchBufferedSignals() {
        const bufferedSignals = this.bufferedSignals;
        while (bufferedSignals.length) {
            if (this.defaultSignalHandler) {
                // We have a default signal handler, so all signals are dispatchable
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.signalWorkflow(bufferedSignals.shift());
            }
            else {
                const foundIndex = bufferedSignals.findIndex((signal) => this.signalHandlers.has(signal.signalName ?? ''));
                if (foundIndex === -1)
                    break;
                const [signal] = bufferedSignals.splice(foundIndex, 1);
                this.signalWorkflow(signal);
            }
        }
    }
    resolveSignalExternalWorkflow(activation) {
        const { resolve, reject } = this.consumeCompletion('signalWorkflow', getSeq(activation));
        if (activation.failure) {
            reject(this.failureToError(activation.failure));
        }
        else {
            resolve(undefined);
        }
    }
    resolveRequestCancelExternalWorkflow(activation) {
        const { resolve, reject } = this.consumeCompletion('cancelWorkflow', getSeq(activation));
        if (activation.failure) {
            reject(this.failureToError(activation.failure));
        }
        else {
            resolve(undefined);
        }
    }
    updateRandomSeed(activation) {
        if (!activation.randomnessSeed) {
            throw new TypeError('Expected activation with randomnessSeed attribute');
        }
        this.random = (0, alea_1.alea)(activation.randomnessSeed.toBytes());
    }
    notifyHasPatch(activation) {
        if (!activation.patchId) {
            throw new TypeError('Notify has patch missing patch name');
        }
        this.knownPresentPatches.add(activation.patchId);
    }
    removeFromCache() {
        throw new common_1.IllegalStateError('removeFromCache activation job should not reach workflow');
    }
    /**
     * Transforms failures into a command to be sent to the server.
     * Used to handle any failure emitted by the Workflow.
     */
    async handleWorkflowFailure(error) {
        if (this.cancelled && (0, errors_1.isCancellation)(error)) {
            this.pushCommand({ cancelWorkflowExecution: {} }, true);
        }
        else if (error instanceof interfaces_1.ContinueAsNew) {
            this.pushCommand({ continueAsNewWorkflowExecution: error.command }, true);
        }
        else {
            if (!(error instanceof common_1.TemporalFailure)) {
                // This results in an unhandled rejection which will fail the activation
                // preventing it from completing.
                throw error;
            }
            this.pushCommand({
                failWorkflowExecution: {
                    failure: this.errorToFailure(error),
                },
            }, true);
        }
    }
    completeQuery(queryId, result) {
        this.pushCommand({
            respondToQuery: { queryId, succeeded: { response: this.payloadConverter.toPayload(result) } },
        });
    }
    failQuery(queryId, error) {
        this.pushCommand({
            respondToQuery: {
                queryId,
                failed: this.errorToFailure((0, common_1.ensureTemporalFailure)(error)),
            },
        });
    }
    /** Consume a completion if it exists in Workflow state */
    maybeConsumeCompletion(type, taskSeq) {
        const completion = this.completions[type].get(taskSeq);
        if (completion !== undefined) {
            this.completions[type].delete(taskSeq);
        }
        return completion;
    }
    /** Consume a completion if it exists in Workflow state, throws if it doesn't */
    consumeCompletion(type, taskSeq) {
        const completion = this.maybeConsumeCompletion(type, taskSeq);
        if (completion === undefined) {
            throw new common_1.IllegalStateError(`No completion for taskSeq ${taskSeq}`);
        }
        return completion;
    }
    completeWorkflow(result) {
        this.pushCommand({
            completeWorkflowExecution: {
                result: this.payloadConverter.toPayload(result),
            },
        }, true);
    }
    errorToFailure(err) {
        return this.failureConverter.errorToFailure(err, this.payloadConverter);
    }
    failureToError(failure) {
        return this.failureConverter.failureToError(failure, this.payloadConverter);
    }
}
exports.Activator = Activator;
function maybeGetActivator() {
    return (0, global_attributes_1.maybeGetActivatorUntyped)();
}
exports.maybeGetActivator = maybeGetActivator;
function getActivator() {
    const activator = maybeGetActivator();
    if (activator === undefined) {
        throw new common_1.IllegalStateError('Workflow uninitialized');
    }
    return activator;
}
exports.getActivator = getActivator;
function getSeq(activation) {
    const seq = activation.seq;
    if (seq === undefined || seq === null) {
        throw new TypeError(`Got activation with no seq attribute`);
    }
    return seq;
}


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/pkg.js":
/*!******************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/pkg.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// ../package.json is outside of the TS project rootDir which causes TS to complain about this import.
// We do not want to change the rootDir because it messes up the output structure.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const package_json_1 = __importDefault(__webpack_require__(/*! ../package.json */ "./node_modules/@temporalio/workflow/package.json"));
exports["default"] = package_json_1.default;


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/stack-helpers.js":
/*!****************************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/stack-helpers.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.untrackPromise = void 0;
const global_attributes_1 = __webpack_require__(/*! ./global-attributes */ "./node_modules/@temporalio/workflow/lib/global-attributes.js");
/**
 * Helper function to remove a promise from being tracked for stack trace query purposes
 */
function untrackPromise(promise) {
    const store = (0, global_attributes_1.maybeGetActivatorUntyped)()?.promiseStackStore;
    if (!store)
        return;
    store.childToParent.delete(promise);
    store.promiseToStack.delete(promise);
}
exports.untrackPromise = untrackPromise;


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/trigger.js":
/*!**********************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/trigger.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Trigger = void 0;
const cancellation_scope_1 = __webpack_require__(/*! ./cancellation-scope */ "./node_modules/@temporalio/workflow/lib/cancellation-scope.js");
const stack_helpers_1 = __webpack_require__(/*! ./stack-helpers */ "./node_modules/@temporalio/workflow/lib/stack-helpers.js");
/**
 * A `PromiseLike` helper which exposes its `resolve` and `reject` methods.
 *
 * Trigger is CancellationScope-aware: it is linked to the current scope on
 * construction and throws when that scope is cancelled.
 *
 * Useful for e.g. waiting for unblocking a Workflow from a Signal.
 *
 * @example
 * <!--SNIPSTART typescript-trigger-workflow-->
 * <!--SNIPEND-->
 */
class Trigger {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            const scope = cancellation_scope_1.CancellationScope.current();
            if (scope.consideredCancelled || scope.cancellable) {
                (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(reject));
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.resolve = resolve;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.reject = reject;
        });
        // Avoid unhandled rejections
        (0, stack_helpers_1.untrackPromise)(this.promise.catch(() => undefined));
    }
    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
}
exports.Trigger = Trigger;


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/worker-interface.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/worker-interface.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dispose = exports.shouldUnblockConditions = exports.tryUnblockConditions = exports.getAndResetSinkCalls = exports.concludeActivation = exports.activate = exports.initRuntime = exports.overrideGlobals = void 0;
/**
 * Exported functions for the Worker to interact with the Workflow isolate
 *
 * @module
 */
const common_1 = __webpack_require__(/*! @temporalio/common */ "./node_modules/@temporalio/common/lib/index.js");
const time_1 = __webpack_require__(/*! @temporalio/common/lib/time */ "./node_modules/@temporalio/common/lib/time.js");
const interceptors_1 = __webpack_require__(/*! @temporalio/common/lib/interceptors */ "./node_modules/@temporalio/common/lib/interceptors.js");
const cancellation_scope_1 = __webpack_require__(/*! ./cancellation-scope */ "./node_modules/@temporalio/workflow/lib/cancellation-scope.js");
const errors_1 = __webpack_require__(/*! ./errors */ "./node_modules/@temporalio/workflow/lib/errors.js");
const internals_1 = __webpack_require__(/*! ./internals */ "./node_modules/@temporalio/workflow/lib/internals.js");
const global_attributes_1 = __webpack_require__(/*! ./global-attributes */ "./node_modules/@temporalio/workflow/lib/global-attributes.js");
const global = globalThis;
const OriginalDate = globalThis.Date;
function overrideGlobals() {
    // Mock any weak reference because GC is non-deterministic and the effect is observable from the Workflow.
    // Workflow developer will get a meaningful exception if they try to use these.
    global.WeakRef = function () {
        throw new errors_1.DeterminismViolationError('WeakRef cannot be used in Workflows because v8 GC is non-deterministic');
    };
    global.FinalizationRegistry = function () {
        throw new errors_1.DeterminismViolationError('FinalizationRegistry cannot be used in Workflows because v8 GC is non-deterministic');
    };
    global.Date = function (...args) {
        if (args.length > 0) {
            return new OriginalDate(...args);
        }
        return new OriginalDate((0, internals_1.getActivator)().now);
    };
    global.Date.now = function () {
        return (0, internals_1.getActivator)().now;
    };
    global.Date.parse = OriginalDate.parse.bind(OriginalDate);
    global.Date.UTC = OriginalDate.UTC.bind(OriginalDate);
    global.Date.prototype = OriginalDate.prototype;
    /**
     * @param ms sleep duration -  number of milliseconds. If given a negative number, value will be set to 1.
     */
    global.setTimeout = function (cb, ms, ...args) {
        const activator = (0, internals_1.getActivator)();
        ms = Math.max(1, ms);
        const seq = activator.nextSeqs.timer++;
        // Create a Promise for AsyncLocalStorage to be able to track this completion using promise hooks.
        new Promise((resolve, reject) => {
            activator.completions.timer.set(seq, { resolve, reject });
            activator.pushCommand({
                startTimer: {
                    seq,
                    startToFireTimeout: (0, time_1.msToTs)(ms),
                },
            });
        }).then(() => cb(...args), () => undefined /* ignore cancellation */);
        return seq;
    };
    global.clearTimeout = function (handle) {
        const activator = (0, internals_1.getActivator)();
        activator.nextSeqs.timer++;
        activator.completions.timer.delete(handle);
        activator.pushCommand({
            cancelTimer: {
                seq: handle,
            },
        });
    };
    // activator.random is mutable, don't hardcode its reference
    Math.random = () => (0, internals_1.getActivator)().random();
}
exports.overrideGlobals = overrideGlobals;
/**
 * Initialize the isolate runtime.
 *
 * Sets required internal state and instantiates the workflow and interceptors.
 */
function initRuntime(options) {
    const info = fixPrototypes(options.info);
    info.unsafe.now = OriginalDate.now;
    const activator = new internals_1.Activator({ ...options, info });
    // There's on activator per workflow instance, set it globally on the context.
    // We do this before importing any user code so user code can statically reference @temporalio/workflow functions
    // as well as Date and Math.random.
    (0, global_attributes_1.setActivatorUntyped)(activator);
    // webpack alias to payloadConverterPath
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const customPayloadConverter = (__webpack_require__(/*! __temporal_custom_payload_converter */ "?2065").payloadConverter);
    // The `payloadConverter` export is validated in the Worker
    if (customPayloadConverter != null) {
        activator.payloadConverter = customPayloadConverter;
    }
    // webpack alias to failureConverterPath
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const customFailureConverter = (__webpack_require__(/*! __temporal_custom_failure_converter */ "?31ff").failureConverter);
    // The `failureConverter` export is validated in the Worker
    if (customFailureConverter != null) {
        activator.failureConverter = customFailureConverter;
    }
    const { importWorkflows, importInterceptors } = global.__TEMPORAL__;
    if (importWorkflows === undefined || importInterceptors === undefined) {
        throw new common_1.IllegalStateError('Workflow bundle did not register import hooks');
    }
    const interceptors = importInterceptors();
    for (const mod of interceptors) {
        const factory = mod.interceptors;
        if (factory !== undefined) {
            if (typeof factory !== 'function') {
                throw new TypeError(`Failed to initialize workflows interceptors: expected a function, but got: '${factory}'`);
            }
            const interceptors = factory();
            activator.interceptors.inbound.push(...(interceptors.inbound ?? []));
            activator.interceptors.outbound.push(...(interceptors.outbound ?? []));
            activator.interceptors.internals.push(...(interceptors.internals ?? []));
        }
    }
    const mod = importWorkflows();
    const workflowFn = mod[info.workflowType];
    const defaultWorkflowFn = mod['default'];
    if (typeof workflowFn === 'function') {
        activator.workflow = workflowFn;
    }
    else if (typeof defaultWorkflowFn === 'function') {
        activator.workflow = defaultWorkflowFn;
    }
    else {
        const details = workflowFn === undefined
            ? 'no such function is exported by the workflow bundle'
            : `expected a function, but got: '${typeof workflowFn}'`;
        throw new TypeError(`Failed to initialize workflow of type '${info.workflowType}': ${details}`);
    }
}
exports.initRuntime = initRuntime;
/**
 * Objects transfered to the VM from outside have prototypes belonging to the
 * outer context, which means that instanceof won't work inside the VM. This
 * function recursively walks over the content of an object, and recreate some
 * of these objects (notably Array, Date and Objects).
 */
function fixPrototypes(obj) {
    if (obj != null && typeof obj === 'object') {
        switch (Object.getPrototypeOf(obj)?.constructor?.name) {
            case 'Array':
                return Array.from(obj.map(fixPrototypes));
            case 'Date':
                return new Date(obj);
            default:
                return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fixPrototypes(v)]));
        }
    }
    else
        return obj;
}
/**
 * Run a chunk of activation jobs
 * @returns a boolean indicating whether job was processed or ignored
 */
function activate(activation, batchIndex) {
    const activator = (0, internals_1.getActivator)();
    const intercept = (0, interceptors_1.composeInterceptors)(activator.interceptors.internals, 'activate', ({ activation, batchIndex }) => {
        if (batchIndex === 0) {
            if (!activation.jobs) {
                throw new TypeError('Got activation with no jobs');
            }
            if (activation.timestamp != null) {
                // timestamp will not be updated for activation that contain only queries
                activator.now = (0, time_1.tsToMs)(activation.timestamp);
            }
            if (activation.historyLength == null) {
                throw new TypeError('Got activation with no historyLength');
            }
            activator.info.unsafe.isReplaying = activation.isReplaying ?? false;
            activator.info.historyLength = activation.historyLength;
        }
        // Cast from the interface to the class which has the `variant` attribute.
        // This is safe because we know that activation is a proto class.
        const jobs = activation.jobs;
        for (const job of jobs) {
            if (job.variant === undefined) {
                throw new TypeError('Expected job.variant to be defined');
            }
            const variant = job[job.variant];
            if (!variant) {
                throw new TypeError(`Expected job.${job.variant} to be set`);
            }
            // The only job that can be executed on a completed workflow is a query.
            // We might get other jobs after completion for instance when a single
            // activation contains multiple jobs and the first one completes the workflow.
            if (activator.completed && job.variant !== 'queryWorkflow') {
                return;
            }
            activator[job.variant](variant /* TS can't infer this type */);
            if (shouldUnblockConditions(job)) {
                tryUnblockConditions();
            }
        }
    });
    intercept({
        activation,
        batchIndex,
    });
}
exports.activate = activate;
/**
 * Conclude a single activation.
 * Should be called after processing all activation jobs and queued microtasks.
 *
 * Activation failures are handled in the main Node.js isolate.
 */
function concludeActivation() {
    const activator = (0, internals_1.getActivator)();
    const intercept = (0, interceptors_1.composeInterceptors)(activator.interceptors.internals, 'concludeActivation', (input) => input);
    const { info } = activator;
    const { commands } = intercept({ commands: activator.getAndResetCommands() });
    return {
        runId: info.runId,
        successful: { commands },
    };
}
exports.concludeActivation = concludeActivation;
function getAndResetSinkCalls() {
    return (0, internals_1.getActivator)().getAndResetSinkCalls();
}
exports.getAndResetSinkCalls = getAndResetSinkCalls;
/**
 * Loop through all blocked conditions, evaluate and unblock if possible.
 *
 * @returns number of unblocked conditions.
 */
function tryUnblockConditions() {
    let numUnblocked = 0;
    for (;;) {
        const prevUnblocked = numUnblocked;
        for (const [seq, cond] of (0, internals_1.getActivator)().blockedConditions.entries()) {
            if (cond.fn()) {
                cond.resolve();
                numUnblocked++;
                // It is safe to delete elements during map iteration
                (0, internals_1.getActivator)().blockedConditions.delete(seq);
            }
        }
        if (prevUnblocked === numUnblocked) {
            break;
        }
    }
    return numUnblocked;
}
exports.tryUnblockConditions = tryUnblockConditions;
/**
 * Predicate used to prevent triggering conditions for non-query and non-patch jobs.
 */
function shouldUnblockConditions(job) {
    return !job.queryWorkflow && !job.notifyHasPatch;
}
exports.shouldUnblockConditions = shouldUnblockConditions;
function dispose() {
    const dispose = (0, interceptors_1.composeInterceptors)((0, internals_1.getActivator)().interceptors.internals, 'dispose', async () => {
        (0, cancellation_scope_1.disableStorage)();
    });
    dispose({});
}
exports.dispose = dispose;


/***/ }),

/***/ "./node_modules/@temporalio/workflow/lib/workflow.js":
/*!***********************************************************!*\
  !*** ./node_modules/@temporalio/workflow/lib/workflow.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.log = exports.enhancedStackTraceQuery = exports.stackTraceQuery = exports.upsertSearchAttributes = exports.setDefaultSignalHandler = exports.setHandler = exports.defineQuery = exports.defineSignal = exports.condition = exports.deprecatePatch = exports.patched = exports.uuid4 = exports.continueAsNew = exports.makeContinueAsNewFunc = exports.proxySinks = exports.inWorkflowContext = exports.workflowInfo = exports.executeChild = exports.startChild = exports.getExternalWorkflowHandle = exports.proxyLocalActivities = exports.proxyActivities = exports.NotAnActivityMethod = exports.scheduleLocalActivity = exports.scheduleActivity = exports.sleep = exports.addDefaultWorkflowOptions = void 0;
const common_1 = __webpack_require__(/*! @temporalio/common */ "./node_modules/@temporalio/common/lib/index.js");
const type_helpers_1 = __webpack_require__(/*! @temporalio/common/lib/type-helpers */ "./node_modules/@temporalio/common/lib/type-helpers.js");
const time_1 = __webpack_require__(/*! @temporalio/common/lib/time */ "./node_modules/@temporalio/common/lib/time.js");
const interceptors_1 = __webpack_require__(/*! @temporalio/common/lib/interceptors */ "./node_modules/@temporalio/common/lib/interceptors.js");
const proto_1 = __webpack_require__(/*! @temporalio/proto */ "./node_modules/@temporalio/proto/protos/index.js");
const cancellation_scope_1 = __webpack_require__(/*! ./cancellation-scope */ "./node_modules/@temporalio/workflow/lib/cancellation-scope.js");
const interfaces_1 = __webpack_require__(/*! ./interfaces */ "./node_modules/@temporalio/workflow/lib/interfaces.js");
const internals_1 = __webpack_require__(/*! ./internals */ "./node_modules/@temporalio/workflow/lib/internals.js");
const stack_helpers_1 = __webpack_require__(/*! ./stack-helpers */ "./node_modules/@temporalio/workflow/lib/stack-helpers.js");
// Avoid a circular dependency
(0, cancellation_scope_1.registerSleepImplementation)(sleep);
/**
 * Adds default values to `workflowId` and `workflowIdReusePolicy` to given workflow options.
 */
function addDefaultWorkflowOptions(opts) {
    const { args, workflowId, ...rest } = opts;
    return {
        workflowId: workflowId ?? uuid4(),
        args: args ?? [],
        cancellationType: interfaces_1.ChildWorkflowCancellationType.WAIT_CANCELLATION_COMPLETED,
        ...rest,
    };
}
exports.addDefaultWorkflowOptions = addDefaultWorkflowOptions;
/**
 * Push a startTimer command into state accumulator and register completion
 */
function timerNextHandler(input) {
    const activator = (0, internals_1.getActivator)();
    return new Promise((resolve, reject) => {
        const scope = cancellation_scope_1.CancellationScope.current();
        if (scope.consideredCancelled) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(reject));
            return;
        }
        if (scope.cancellable) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch((err) => {
                if (!activator.completions.timer.delete(input.seq)) {
                    return; // Already resolved or never scheduled
                }
                activator.pushCommand({
                    cancelTimer: {
                        seq: input.seq,
                    },
                });
                reject(err);
            }));
        }
        activator.pushCommand({
            startTimer: {
                seq: input.seq,
                startToFireTimeout: (0, time_1.msToTs)(input.durationMs),
            },
        });
        activator.completions.timer.set(input.seq, {
            resolve,
            reject,
        });
    });
}
/**
 * Asynchronous sleep.
 *
 * Schedules a timer on the Temporal service.
 *
 * @param ms sleep duration - number of milliseconds or {@link https://www.npmjs.com/package/ms | ms-formatted string}.
 * If given a negative number or 0, value will be set to 1.
 */
function sleep(ms) {
    const activator = assertInWorkflowContext('Workflow.sleep(...) may only be used from a Workflow Execution');
    const seq = activator.nextSeqs.timer++;
    const durationMs = Math.max(1, (0, time_1.msToNumber)(ms));
    const execute = (0, interceptors_1.composeInterceptors)(activator.interceptors.outbound, 'startTimer', timerNextHandler);
    return execute({
        durationMs,
        seq,
    });
}
exports.sleep = sleep;
function validateActivityOptions(options) {
    if (options.scheduleToCloseTimeout === undefined && options.startToCloseTimeout === undefined) {
        throw new TypeError('Required either scheduleToCloseTimeout or startToCloseTimeout');
    }
}
// Use same validation we use for normal activities
const validateLocalActivityOptions = validateActivityOptions;
/**
 * Push a scheduleActivity command into activator accumulator and register completion
 */
function scheduleActivityNextHandler({ options, args, headers, seq, activityType }) {
    const activator = (0, internals_1.getActivator)();
    validateActivityOptions(options);
    return new Promise((resolve, reject) => {
        const scope = cancellation_scope_1.CancellationScope.current();
        if (scope.consideredCancelled) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(reject));
            return;
        }
        if (scope.cancellable) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(() => {
                if (!activator.completions.activity.has(seq)) {
                    return; // Already resolved or never scheduled
                }
                activator.pushCommand({
                    requestCancelActivity: {
                        seq,
                    },
                });
            }));
        }
        activator.pushCommand({
            scheduleActivity: {
                seq,
                activityId: options.activityId ?? `${seq}`,
                activityType,
                arguments: (0, common_1.toPayloads)(activator.payloadConverter, ...args),
                retryPolicy: options.retry ? (0, common_1.compileRetryPolicy)(options.retry) : undefined,
                taskQueue: options.taskQueue || activator.info?.taskQueue,
                heartbeatTimeout: (0, time_1.msOptionalToTs)(options.heartbeatTimeout),
                scheduleToCloseTimeout: (0, time_1.msOptionalToTs)(options.scheduleToCloseTimeout),
                startToCloseTimeout: (0, time_1.msOptionalToTs)(options.startToCloseTimeout),
                scheduleToStartTimeout: (0, time_1.msOptionalToTs)(options.scheduleToStartTimeout),
                headers,
                cancellationType: options.cancellationType,
                doNotEagerlyExecute: !(options.allowEagerDispatch ?? true),
                versioningIntent: versioningIntentToProto(options.versioningIntent),
            },
        });
        activator.completions.activity.set(seq, {
            resolve,
            reject,
        });
    });
}
/**
 * Push a scheduleActivity command into state accumulator and register completion
 */
async function scheduleLocalActivityNextHandler({ options, args, headers, seq, activityType, attempt, originalScheduleTime, }) {
    const activator = (0, internals_1.getActivator)();
    // Eagerly fail the local activity (which will in turn fail the workflow task.
    // Do not fail on replay where the local activities may not be registered on the replay worker.
    if (!workflowInfo().unsafe.isReplaying && !activator.registeredActivityNames.has(activityType)) {
        throw new ReferenceError(`Local activity of type '${activityType}' not registered on worker`);
    }
    validateLocalActivityOptions(options);
    return new Promise((resolve, reject) => {
        const scope = cancellation_scope_1.CancellationScope.current();
        if (scope.consideredCancelled) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(reject));
            return;
        }
        if (scope.cancellable) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(() => {
                if (!activator.completions.activity.has(seq)) {
                    return; // Already resolved or never scheduled
                }
                activator.pushCommand({
                    requestCancelLocalActivity: {
                        seq,
                    },
                });
            }));
        }
        activator.pushCommand({
            scheduleLocalActivity: {
                seq,
                attempt,
                originalScheduleTime,
                // Intentionally not exposing activityId as an option
                activityId: `${seq}`,
                activityType,
                arguments: (0, common_1.toPayloads)(activator.payloadConverter, ...args),
                retryPolicy: options.retry ? (0, common_1.compileRetryPolicy)(options.retry) : undefined,
                scheduleToCloseTimeout: (0, time_1.msOptionalToTs)(options.scheduleToCloseTimeout),
                startToCloseTimeout: (0, time_1.msOptionalToTs)(options.startToCloseTimeout),
                scheduleToStartTimeout: (0, time_1.msOptionalToTs)(options.scheduleToStartTimeout),
                localRetryThreshold: (0, time_1.msOptionalToTs)(options.localRetryThreshold),
                headers,
                cancellationType: options.cancellationType,
            },
        });
        activator.completions.activity.set(seq, {
            resolve,
            reject,
        });
    });
}
/**
 * Schedule an activity and run outbound interceptors
 * @hidden
 */
function scheduleActivity(activityType, args, options) {
    const activator = assertInWorkflowContext('Workflow.scheduleActivity(...) may only be used from a Workflow Execution');
    if (options === undefined) {
        throw new TypeError('Got empty activity options');
    }
    const seq = activator.nextSeqs.activity++;
    const execute = (0, interceptors_1.composeInterceptors)(activator.interceptors.outbound, 'scheduleActivity', scheduleActivityNextHandler);
    return execute({
        activityType,
        headers: {},
        options,
        args,
        seq,
    });
}
exports.scheduleActivity = scheduleActivity;
/**
 * Schedule an activity and run outbound interceptors
 * @hidden
 */
async function scheduleLocalActivity(activityType, args, options) {
    const activator = assertInWorkflowContext('Workflow.scheduleLocalActivity(...) may only be used from a Workflow Execution');
    if (options === undefined) {
        throw new TypeError('Got empty activity options');
    }
    let attempt = 1;
    let originalScheduleTime = undefined;
    for (;;) {
        const seq = activator.nextSeqs.activity++;
        const execute = (0, interceptors_1.composeInterceptors)(activator.interceptors.outbound, 'scheduleLocalActivity', scheduleLocalActivityNextHandler);
        try {
            return (await execute({
                activityType,
                headers: {},
                options,
                args,
                seq,
                attempt,
                originalScheduleTime,
            }));
        }
        catch (err) {
            if (err instanceof internals_1.LocalActivityDoBackoff) {
                await sleep((0, time_1.tsToMs)(err.backoff.backoffDuration));
                if (typeof err.backoff.attempt !== 'number') {
                    throw new TypeError('Invalid backoff attempt type');
                }
                attempt = err.backoff.attempt;
                originalScheduleTime = err.backoff.originalScheduleTime ?? undefined;
            }
            else {
                throw err;
            }
        }
    }
}
exports.scheduleLocalActivity = scheduleLocalActivity;
function startChildWorkflowExecutionNextHandler({ options, headers, workflowType, seq, }) {
    const activator = (0, internals_1.getActivator)();
    const workflowId = options.workflowId ?? uuid4();
    const startPromise = new Promise((resolve, reject) => {
        const scope = cancellation_scope_1.CancellationScope.current();
        if (scope.consideredCancelled) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(reject));
            return;
        }
        if (scope.cancellable) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(() => {
                const complete = !activator.completions.childWorkflowComplete.has(seq);
                if (!complete) {
                    activator.pushCommand({
                        cancelChildWorkflowExecution: { childWorkflowSeq: seq },
                    });
                }
                // Nothing to cancel otherwise
            }));
        }
        activator.pushCommand({
            startChildWorkflowExecution: {
                seq,
                workflowId,
                workflowType,
                input: (0, common_1.toPayloads)(activator.payloadConverter, ...options.args),
                retryPolicy: options.retry ? (0, common_1.compileRetryPolicy)(options.retry) : undefined,
                taskQueue: options.taskQueue || activator.info?.taskQueue,
                workflowExecutionTimeout: (0, time_1.msOptionalToTs)(options.workflowExecutionTimeout),
                workflowRunTimeout: (0, time_1.msOptionalToTs)(options.workflowRunTimeout),
                workflowTaskTimeout: (0, time_1.msOptionalToTs)(options.workflowTaskTimeout),
                namespace: workflowInfo().namespace,
                headers,
                cancellationType: options.cancellationType,
                workflowIdReusePolicy: options.workflowIdReusePolicy,
                parentClosePolicy: options.parentClosePolicy,
                cronSchedule: options.cronSchedule,
                searchAttributes: options.searchAttributes
                    ? (0, common_1.mapToPayloads)(common_1.searchAttributePayloadConverter, options.searchAttributes)
                    : undefined,
                memo: options.memo && (0, common_1.mapToPayloads)(activator.payloadConverter, options.memo),
                versioningIntent: versioningIntentToProto(options.versioningIntent),
            },
        });
        activator.completions.childWorkflowStart.set(seq, {
            resolve,
            reject,
        });
    });
    // We construct a Promise for the completion of the child Workflow before we know
    // if the Workflow code will await it to capture the result in case it does.
    const completePromise = new Promise((resolve, reject) => {
        // Chain start Promise rejection to the complete Promise.
        (0, stack_helpers_1.untrackPromise)(startPromise.catch(reject));
        activator.completions.childWorkflowComplete.set(seq, {
            resolve,
            reject,
        });
    });
    (0, stack_helpers_1.untrackPromise)(startPromise);
    (0, stack_helpers_1.untrackPromise)(completePromise);
    // Prevent unhandled rejection because the completion might not be awaited
    (0, stack_helpers_1.untrackPromise)(completePromise.catch(() => undefined));
    const ret = new Promise((resolve) => resolve([startPromise, completePromise]));
    (0, stack_helpers_1.untrackPromise)(ret);
    return ret;
}
function signalWorkflowNextHandler({ seq, signalName, args, target, headers }) {
    const activator = (0, internals_1.getActivator)();
    return new Promise((resolve, reject) => {
        const scope = cancellation_scope_1.CancellationScope.current();
        if (scope.consideredCancelled) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(reject));
            return;
        }
        if (scope.cancellable) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(() => {
                if (!activator.completions.signalWorkflow.has(seq)) {
                    return;
                }
                activator.pushCommand({ cancelSignalWorkflow: { seq } });
            }));
        }
        activator.pushCommand({
            signalExternalWorkflowExecution: {
                seq,
                args: (0, common_1.toPayloads)(activator.payloadConverter, ...args),
                headers,
                signalName,
                ...(target.type === 'external'
                    ? {
                        workflowExecution: {
                            namespace: activator.info.namespace,
                            ...target.workflowExecution,
                        },
                    }
                    : {
                        childWorkflowId: target.childWorkflowId,
                    }),
            },
        });
        activator.completions.signalWorkflow.set(seq, { resolve, reject });
    });
}
/**
 * Symbol used in the return type of proxy methods to mark that an attribute on the source type is not a method.
 *
 * @see {@link ActivityInterfaceFor}
 * @see {@link proxyActivities}
 * @see {@link proxyLocalActivities}
 */
exports.NotAnActivityMethod = Symbol.for('__TEMPORAL_NOT_AN_ACTIVITY_METHOD');
/**
 * Configure Activity functions with given {@link ActivityOptions}.
 *
 * This method may be called multiple times to setup Activities with different options.
 *
 * @return a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy | Proxy} for
 *         which each attribute is a callable Activity function
 *
 * @example
 * ```ts
 * import { proxyActivities } from '@temporalio/workflow';
 * import * as activities from '../activities';
 *
 * // Setup Activities from module exports
 * const { httpGet, otherActivity } = proxyActivities<typeof activities>({
 *   startToCloseTimeout: '30 minutes',
 * });
 *
 * // Setup Activities from an explicit interface (e.g. when defined by another SDK)
 * interface JavaActivities {
 *   httpGetFromJava(url: string): Promise<string>
 *   someOtherJavaActivity(arg1: number, arg2: string): Promise<string>;
 * }
 *
 * const {
 *   httpGetFromJava,
 *   someOtherJavaActivity
 * } = proxyActivities<JavaActivities>({
 *   taskQueue: 'java-worker-taskQueue',
 *   startToCloseTimeout: '5m',
 * });
 *
 * export function execute(): Promise<void> {
 *   const response = await httpGet("http://example.com");
 *   // ...
 * }
 * ```
 */
function proxyActivities(options) {
    if (options === undefined) {
        throw new TypeError('options must be defined');
    }
    // Validate as early as possible for immediate user feedback
    validateActivityOptions(options);
    return new Proxy({}, {
        get(_, activityType) {
            if (typeof activityType !== 'string') {
                throw new TypeError(`Only strings are supported for Activity types, got: ${String(activityType)}`);
            }
            return function activityProxyFunction(...args) {
                return scheduleActivity(activityType, args, options);
            };
        },
    });
}
exports.proxyActivities = proxyActivities;
/**
 * Configure Local Activity functions with given {@link LocalActivityOptions}.
 *
 * This method may be called multiple times to setup Activities with different options.
 *
 * @return a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy | Proxy}
 *         for which each attribute is a callable Activity function
 *
 * @experimental
 *
 * @see {@link proxyActivities} for examples
 */
function proxyLocalActivities(options) {
    if (options === undefined) {
        throw new TypeError('options must be defined');
    }
    // Validate as early as possible for immediate user feedback
    validateLocalActivityOptions(options);
    return new Proxy({}, {
        get(_, activityType) {
            if (typeof activityType !== 'string') {
                throw new TypeError(`Only strings are supported for Activity types, got: ${String(activityType)}`);
            }
            return function localActivityProxyFunction(...args) {
                return scheduleLocalActivity(activityType, args, options);
            };
        },
    });
}
exports.proxyLocalActivities = proxyLocalActivities;
// TODO: deprecate this patch after "enough" time has passed
const EXTERNAL_WF_CANCEL_PATCH = '__temporal_internal_connect_external_handle_cancel_to_scope';
// This generic name of this patch comes from an attempt to build a generic internal patching mechanism.
// That effort has been abandoned in favor of a newer WorkflowTaskCompletedMetadata based mechanism.
const CONDITION_0_PATCH = '__sdk_internal_patch_number:1';
/**
 * Returns a client-side handle that can be used to signal and cancel an existing Workflow execution.
 * It takes a Workflow ID and optional run ID.
 */
function getExternalWorkflowHandle(workflowId, runId) {
    const activator = assertInWorkflowContext('Workflow.getExternalWorkflowHandle(...) may only be used from a Workflow Execution. Consider using Client.workflow.getHandle(...) instead.)');
    return {
        workflowId,
        runId,
        cancel() {
            return new Promise((resolve, reject) => {
                // Connect this cancel operation to the current cancellation scope.
                // This is behavior was introduced after v0.22.0 and is incompatible
                // with histories generated with previous SDK versions and thus requires
                // patching.
                //
                // We try to delay patching as much as possible to avoid polluting
                // histories unless strictly required.
                const scope = cancellation_scope_1.CancellationScope.current();
                if (scope.cancellable) {
                    (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch((err) => {
                        if (patched(EXTERNAL_WF_CANCEL_PATCH)) {
                            reject(err);
                        }
                    }));
                }
                if (scope.consideredCancelled) {
                    if (patched(EXTERNAL_WF_CANCEL_PATCH)) {
                        return;
                    }
                }
                const seq = activator.nextSeqs.cancelWorkflow++;
                activator.pushCommand({
                    requestCancelExternalWorkflowExecution: {
                        seq,
                        workflowExecution: {
                            namespace: activator.info.namespace,
                            workflowId,
                            runId,
                        },
                    },
                });
                activator.completions.cancelWorkflow.set(seq, { resolve, reject });
            });
        },
        signal(def, ...args) {
            return (0, interceptors_1.composeInterceptors)(activator.interceptors.outbound, 'signalWorkflow', signalWorkflowNextHandler)({
                seq: activator.nextSeqs.signalWorkflow++,
                signalName: typeof def === 'string' ? def : def.name,
                args,
                target: {
                    type: 'external',
                    workflowExecution: { workflowId, runId },
                },
                headers: {},
            });
        },
    };
}
exports.getExternalWorkflowHandle = getExternalWorkflowHandle;
async function startChild(workflowTypeOrFunc, options) {
    const activator = assertInWorkflowContext('Workflow.startChild(...) may only be used from a Workflow Execution. Consider using Client.workflow.start(...) instead.)');
    const optionsWithDefaults = addDefaultWorkflowOptions(options ?? {});
    const workflowType = (0, common_1.extractWorkflowType)(workflowTypeOrFunc);
    const execute = (0, interceptors_1.composeInterceptors)(activator.interceptors.outbound, 'startChildWorkflowExecution', startChildWorkflowExecutionNextHandler);
    const [started, completed] = await execute({
        seq: activator.nextSeqs.childWorkflow++,
        options: optionsWithDefaults,
        headers: {},
        workflowType,
    });
    const firstExecutionRunId = await started;
    return {
        workflowId: optionsWithDefaults.workflowId,
        firstExecutionRunId,
        async result() {
            return (await completed);
        },
        async signal(def, ...args) {
            return (0, interceptors_1.composeInterceptors)(activator.interceptors.outbound, 'signalWorkflow', signalWorkflowNextHandler)({
                seq: activator.nextSeqs.signalWorkflow++,
                signalName: typeof def === 'string' ? def : def.name,
                args,
                target: {
                    type: 'child',
                    childWorkflowId: optionsWithDefaults.workflowId,
                },
                headers: {},
            });
        },
    };
}
exports.startChild = startChild;
async function executeChild(workflowTypeOrFunc, options) {
    const activator = assertInWorkflowContext('Workflow.executeChild(...) may only be used from a Workflow Execution. Consider using Client.workflow.execute(...) instead.');
    const optionsWithDefaults = addDefaultWorkflowOptions(options ?? {});
    const workflowType = (0, common_1.extractWorkflowType)(workflowTypeOrFunc);
    const execute = (0, interceptors_1.composeInterceptors)(activator.interceptors.outbound, 'startChildWorkflowExecution', startChildWorkflowExecutionNextHandler);
    const execPromise = execute({
        seq: activator.nextSeqs.childWorkflow++,
        options: optionsWithDefaults,
        headers: {},
        workflowType,
    });
    (0, stack_helpers_1.untrackPromise)(execPromise);
    const completedPromise = execPromise.then(([_started, completed]) => completed);
    (0, stack_helpers_1.untrackPromise)(completedPromise);
    return completedPromise;
}
exports.executeChild = executeChild;
/**
 * Get information about the current Workflow.
 *
 * ⚠️ We recommend calling `workflowInfo()` whenever accessing {@link WorkflowInfo} fields. Some WorkflowInfo fields
 * change during the lifetime of an Execution—like {@link WorkflowInfo.historyLength} and
 * {@link WorkflowInfo.searchAttributes}—and some may be changeable in the future—like {@link WorkflowInfo.taskQueue}.
 *
 * ```ts
 * // GOOD
 * function myWorkflow() {
 *   doSomething(workflowInfo().searchAttributes)
 *   ...
 *   doSomethingElse(workflowInfo().searchAttributes)
 * }
 * ```
 *
 * ```ts
 * // BAD
 * function myWorkflow() {
 *   const attributes = workflowInfo().searchAttributes
 *   doSomething(attributes)
 *   ...
 *   doSomethingElse(attributes)
 * }
 */
function workflowInfo() {
    const activator = assertInWorkflowContext('Workflow.workflowInfo(...) may only be used from a Workflow Execution.');
    return activator.info;
}
exports.workflowInfo = workflowInfo;
/**
 * Returns whether or not code is executing in workflow context
 */
function inWorkflowContext() {
    return (0, internals_1.maybeGetActivator)() !== undefined;
}
exports.inWorkflowContext = inWorkflowContext;
/**
 * Get a reference to Sinks for exporting data out of the Workflow.
 *
 * These Sinks **must** be registered with the Worker in order for this
 * mechanism to work.
 *
 * @example
 * ```ts
 * import { proxySinks, Sinks } from '@temporalio/workflow';
 *
 * interface MySinks extends Sinks {
 *   logger: {
 *     info(message: string): void;
 *     error(message: string): void;
 *   };
 * }
 *
 * const { logger } = proxySinks<MyDependencies>();
 * logger.info('setting up');
 *
 * export function myWorkflow() {
 *   return {
 *     async execute() {
 *       logger.info("hey ho");
 *       logger.error("lets go");
 *     }
 *   };
 * }
 * ```
 */
function proxySinks() {
    return new Proxy({}, {
        get(_, ifaceName) {
            return new Proxy({}, {
                get(_, fnName) {
                    return (...args) => {
                        const activator = assertInWorkflowContext('Proxied sinks functions may only be used from a Workflow Execution.');
                        const info = workflowInfo();
                        activator.sinkCalls.push({
                            ifaceName: ifaceName,
                            fnName: fnName,
                            // Only available from node 17.
                            args: globalThis.structuredClone ? globalThis.structuredClone(args) : args,
                            // Clone the workflowInfo object so that any further mutations to it does not get reflected in sink
                            workflowInfo: {
                                ...info,
                                // Make sure to clone any sub-property that may get mutated during the lifespan of an activation
                                searchAttributes: { ...info.searchAttributes },
                                memo: info.memo ? { ...info.memo } : undefined,
                            },
                        });
                    };
                },
            });
        },
    });
}
exports.proxySinks = proxySinks;
/**
 * Returns a function `f` that will cause the current Workflow to ContinueAsNew when called.
 *
 * `f` takes the same arguments as the Workflow function supplied to typeparam `F`.
 *
 * Once `f` is called, Workflow Execution immediately completes.
 */
function makeContinueAsNewFunc(options) {
    const activator = assertInWorkflowContext('Workflow.continueAsNew(...) and Workflow.makeContinueAsNewFunc(...) may only be used from a Workflow Execution.');
    const info = activator.info;
    const { workflowType, taskQueue, ...rest } = options ?? {};
    const requiredOptions = {
        workflowType: workflowType ?? info.workflowType,
        taskQueue: taskQueue ?? info.taskQueue,
        ...rest,
    };
    return (...args) => {
        const fn = (0, interceptors_1.composeInterceptors)(activator.interceptors.outbound, 'continueAsNew', async (input) => {
            const { headers, args, options } = input;
            throw new interfaces_1.ContinueAsNew({
                workflowType: options.workflowType,
                arguments: (0, common_1.toPayloads)(activator.payloadConverter, ...args),
                headers,
                taskQueue: options.taskQueue,
                memo: options.memo && (0, common_1.mapToPayloads)(activator.payloadConverter, options.memo),
                searchAttributes: options.searchAttributes
                    ? (0, common_1.mapToPayloads)(common_1.searchAttributePayloadConverter, options.searchAttributes)
                    : undefined,
                workflowRunTimeout: (0, time_1.msOptionalToTs)(options.workflowRunTimeout),
                workflowTaskTimeout: (0, time_1.msOptionalToTs)(options.workflowTaskTimeout),
                versioningIntent: versioningIntentToProto(options.versioningIntent),
            });
        });
        return fn({
            args,
            headers: {},
            options: requiredOptions,
        });
    };
}
exports.makeContinueAsNewFunc = makeContinueAsNewFunc;
/**
 * {@link https://docs.temporal.io/concepts/what-is-continue-as-new/ | Continues-As-New} the current Workflow Execution
 * with default options.
 *
 * Shorthand for `makeContinueAsNewFunc<F>()(...args)`. (See: {@link makeContinueAsNewFunc}.)
 *
 * @example
 *
 *```ts
 *import { continueAsNew } from '@temporalio/workflow';
 *
 *export async function myWorkflow(n: number): Promise<void> {
 *  // ... Workflow logic
 *  await continueAsNew<typeof myWorkflow>(n + 1);
 *}
 *```
 */
function continueAsNew(...args) {
    return makeContinueAsNewFunc()(...args);
}
exports.continueAsNew = continueAsNew;
/**
 * Generate an RFC compliant V4 uuid.
 * Uses the workflow's deterministic PRNG making it safe for use within a workflow.
 * This function is cryptographically insecure.
 * See the {@link https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid | stackoverflow discussion}.
 */
function uuid4() {
    // Return the hexadecimal text representation of number `n`, padded with zeroes to be of length `p`
    const ho = (n, p) => n.toString(16).padStart(p, '0');
    // Create a view backed by a 16-byte buffer
    const view = new DataView(new ArrayBuffer(16));
    // Fill buffer with random values
    view.setUint32(0, (Math.random() * 0x100000000) >>> 0);
    view.setUint32(4, (Math.random() * 0x100000000) >>> 0);
    view.setUint32(8, (Math.random() * 0x100000000) >>> 0);
    view.setUint32(12, (Math.random() * 0x100000000) >>> 0);
    // Patch the 6th byte to reflect a version 4 UUID
    view.setUint8(6, (view.getUint8(6) & 0xf) | 0x40);
    // Patch the 8th byte to reflect a variant 1 UUID (version 4 UUIDs are)
    view.setUint8(8, (view.getUint8(8) & 0x3f) | 0x80);
    // Compile the canonical textual form from the array data
    return `${ho(view.getUint32(0), 8)}-${ho(view.getUint16(4), 4)}-${ho(view.getUint16(6), 4)}-${ho(view.getUint16(8), 4)}-${ho(view.getUint32(10), 8)}${ho(view.getUint16(14), 4)}`;
}
exports.uuid4 = uuid4;
/**
 * Patch or upgrade workflow code by checking or stating that this workflow has a certain patch.
 *
 * See {@link https://docs.temporal.io/typescript/versioning | docs page} for info.
 *
 * If the workflow is replaying an existing history, then this function returns true if that
 * history was produced by a worker which also had a `patched` call with the same `patchId`.
 * If the history was produced by a worker *without* such a call, then it will return false.
 *
 * If the workflow is not currently replaying, then this call *always* returns true.
 *
 * Your workflow code should run the "new" code if this returns true, if it returns false, you
 * should run the "old" code. By doing this, you can maintain determinism.
 *
 * @param patchId An identifier that should be unique to this patch. It is OK to use multiple
 * calls with the same ID, which means all such calls will always return the same value.
 */
function patched(patchId) {
    return patchInternal(patchId, false);
}
exports.patched = patched;
/**
 * Indicate that a patch is being phased out.
 *
 * See {@link https://docs.temporal.io/typescript/versioning | docs page} for info.
 *
 * Workflows with this call may be deployed alongside workflows with a {@link patched} call, but
 * they must *not* be deployed while any workers still exist running old code without a
 * {@link patched} call, or any runs with histories produced by such workers exist. If either kind
 * of worker encounters a history produced by the other, their behavior is undefined.
 *
 * Once all live workflow runs have been produced by workers with this call, you can deploy workers
 * which are free of either kind of patch call for this ID. Workers with and without this call
 * may coexist, as long as they are both running the "new" code.
 *
 * @param patchId An identifier that should be unique to this patch. It is OK to use multiple
 * calls with the same ID, which means all such calls will always return the same value.
 */
function deprecatePatch(patchId) {
    patchInternal(patchId, true);
}
exports.deprecatePatch = deprecatePatch;
function patchInternal(patchId, deprecated) {
    const activator = assertInWorkflowContext('Workflow.patch(...) and Workflow.deprecatePatch may only be used from a Workflow Execution.');
    // Patch operation does not support interception at the moment, if it did,
    // this would be the place to start the interception chain
    if (activator.workflow === undefined) {
        throw new common_1.IllegalStateError('Patches cannot be used before Workflow starts');
    }
    const usePatch = !activator.info.unsafe.isReplaying || activator.knownPresentPatches.has(patchId);
    // Avoid sending commands for patches core already knows about.
    // This optimization enables development of automatic patching tools.
    if (usePatch && !activator.sentPatches.has(patchId)) {
        activator.pushCommand({
            setPatchMarker: { patchId, deprecated },
        });
        activator.sentPatches.add(patchId);
    }
    return usePatch;
}
async function condition(fn, timeout) {
    assertInWorkflowContext('Workflow.condition(...) may only be used from a Workflow Execution.');
    // Prior to 1.5.0, `condition(fn, 0)` was treated as equivalent to `condition(fn, undefined)`
    if (timeout === 0 && !patched(CONDITION_0_PATCH)) {
        return conditionInner(fn);
    }
    if (typeof timeout === 'number' || typeof timeout === 'string') {
        return cancellation_scope_1.CancellationScope.cancellable(async () => {
            try {
                return await Promise.race([sleep(timeout).then(() => false), conditionInner(fn).then(() => true)]);
            }
            finally {
                cancellation_scope_1.CancellationScope.current().cancel();
            }
        });
    }
    return conditionInner(fn);
}
exports.condition = condition;
function conditionInner(fn) {
    const activator = (0, internals_1.getActivator)();
    return new Promise((resolve, reject) => {
        const scope = cancellation_scope_1.CancellationScope.current();
        if (scope.consideredCancelled) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch(reject));
            return;
        }
        const seq = activator.nextSeqs.condition++;
        if (scope.cancellable) {
            (0, stack_helpers_1.untrackPromise)(scope.cancelRequested.catch((err) => {
                activator.blockedConditions.delete(seq);
                reject(err);
            }));
        }
        // Eager evaluation
        if (fn()) {
            resolve();
            return;
        }
        activator.blockedConditions.set(seq, { fn, resolve });
    });
}
/**
 * Define a signal method for a Workflow.
 *
 * Definitions are used to register handler in the Workflow via {@link setHandler} and to signal Workflows using a {@link WorkflowHandle}, {@link ChildWorkflowHandle} or {@link ExternalWorkflowHandle}.
 * Definitions can be reused in multiple Workflows.
 */
function defineSignal(name) {
    return {
        type: 'signal',
        name,
    };
}
exports.defineSignal = defineSignal;
/**
 * Define a query method for a Workflow.
 *
 * Definitions are used to register handler in the Workflow via {@link setHandler} and to query Workflows using a {@link WorkflowHandle}.
 * Definitions can be reused in multiple Workflows.
 */
function defineQuery(name) {
    return {
        type: 'query',
        name,
    };
}
exports.defineQuery = defineQuery;
/**
 * Set a handler function for a Workflow query or signal.
 *
 * If this function is called multiple times for a given signal or query name the last handler will overwrite any previous calls.
 *
 * @param def a {@link SignalDefinition} or {@link QueryDefinition} as returned by {@link defineSignal} or {@link defineQuery} respectively.
 * @param handler a compatible handler function for the given definition or `undefined` to unset the handler.
 */
function setHandler(def, handler) {
    const activator = assertInWorkflowContext('Workflow.setHandler(...) may only be used from a Workflow Execution.');
    if (def.type === 'signal') {
        if (typeof handler === 'function') {
            activator.signalHandlers.set(def.name, handler);
            activator.dispatchBufferedSignals();
        }
        else if (handler == null) {
            activator.signalHandlers.delete(def.name);
        }
        else {
            throw new TypeError(`Expected handler to be either a function or 'undefined'. Got: '${typeof handler}'`);
        }
    }
    else if (def.type === 'query') {
        if (typeof handler === 'function') {
            activator.queryHandlers.set(def.name, handler);
        }
        else if (handler == null) {
            activator.queryHandlers.delete(def.name);
        }
        else {
            throw new TypeError(`Expected handler to be either a function or 'undefined'. Got: '${typeof handler}'`);
        }
    }
    else {
        throw new TypeError(`Invalid definition type: ${def.type}`);
    }
}
exports.setHandler = setHandler;
/**
 * Set a signal handler function that will handle signals calls for non-registered signal names.
 *
 * Signals are dispatched to the default signal handler in the order that they were accepted by the server.
 *
 * If this function is called multiple times for a given signal or query name the last handler will overwrite any previous calls.
 *
 * @param handler a function that will handle signals for non-registered signal names, or `undefined` to unset the handler.
 */
function setDefaultSignalHandler(handler) {
    const activator = assertInWorkflowContext('Workflow.setDefaultSignalHandler(...) may only be used from a Workflow Execution.');
    if (typeof handler === 'function') {
        activator.defaultSignalHandler = handler;
        activator.dispatchBufferedSignals();
    }
    else if (handler == null) {
        activator.defaultSignalHandler = undefined;
    }
    else {
        throw new TypeError(`Expected handler to be either a function or 'undefined'. Got: '${typeof handler}'`);
    }
}
exports.setDefaultSignalHandler = setDefaultSignalHandler;
/**
 * Updates this Workflow's Search Attributes by merging the provided `searchAttributes` with the existing Search
 * Attributes, `workflowInfo().searchAttributes`.
 *
 * For example, this Workflow code:
 *
 * ```ts
 * upsertSearchAttributes({
 *   CustomIntField: [1],
 *   CustomBoolField: [true]
 * });
 * upsertSearchAttributes({
 *   CustomIntField: [42],
 *   CustomKeywordField: ['durable code', 'is great']
 * });
 * ```
 *
 * would result in the Workflow having these Search Attributes:
 *
 * ```ts
 * {
 *   CustomIntField: [42],
 *   CustomBoolField: [true],
 *   CustomKeywordField: ['durable code', 'is great']
 * }
 * ```
 *
 * @param searchAttributes The Record to merge. Use a value of `[]` to clear a Search Attribute.
 */
function upsertSearchAttributes(searchAttributes) {
    const activator = assertInWorkflowContext('Workflow.upsertSearchAttributes(...) may only be used from a Workflow Execution.');
    const mergedSearchAttributes = { ...activator.info.searchAttributes, ...searchAttributes };
    if (!mergedSearchAttributes) {
        throw new Error('searchAttributes must be a non-null SearchAttributes');
    }
    activator.pushCommand({
        upsertWorkflowSearchAttributes: {
            searchAttributes: (0, common_1.mapToPayloads)(common_1.searchAttributePayloadConverter, searchAttributes),
        },
    });
    activator.info.searchAttributes = mergedSearchAttributes;
}
exports.upsertSearchAttributes = upsertSearchAttributes;
exports.stackTraceQuery = defineQuery('__stack_trace');
exports.enhancedStackTraceQuery = defineQuery('__enhanced_stack_trace');
const loggerSinks = proxySinks();
/**
 * Symbol used by the SDK logger to extract a timestamp from log attributes.
 * Also defined in `worker/logger.ts` - intentionally not shared.
 */
const LogTimestamp = Symbol.for('log_timestamp');
/**
 * Default workflow logger.
 * This logger is replay-aware and will omit log messages on workflow replay.
 * The messages emitted by this logger are funnelled to the worker's `defaultSinks`, which are installed by default.
 *
 * Note that since sinks are used to power this logger, any log attributes must be transferable via the
 * {@link https://nodejs.org/api/worker_threads.html#worker_threads_port_postmessage_value_transferlist | postMessage}
 * API.
 *
 * `defaultSinks` accepts a user logger and defaults to the `Runtime`'s logger.
 *
 * See the documentation for `WorkerOptions`, `defaultSinks`, and `Runtime` for more information.
 */
exports.log = Object.fromEntries(['trace', 'debug', 'info', 'warn', 'error'].map((level) => {
    return [
        level,
        (message, attrs) => {
            const activator = assertInWorkflowContext('Workflow.log(...) may only be used from a Workflow Execution.');
            const getLogAttributes = (0, interceptors_1.composeInterceptors)(activator.interceptors.outbound, 'getLogAttributes', (a) => a);
            return loggerSinks.defaultWorkerLogger[level](message, {
                // Inject the call time in nanosecond resolution as expected by the worker logger.
                [LogTimestamp]: activator.getTimeOfDay(),
                ...getLogAttributes({}),
                ...attrs,
            });
        },
    ];
}));
function assertInWorkflowContext(message) {
    const activator = (0, internals_1.maybeGetActivator)();
    if (activator == null)
        throw new common_1.IllegalStateError(message);
    return activator;
}
function versioningIntentToProto(intent) {
    switch (intent) {
        case 'DEFAULT':
            return proto_1.coresdk.common.VersioningIntent.DEFAULT;
        case 'COMPATIBLE':
            return proto_1.coresdk.common.VersioningIntent.COMPATIBLE;
        case undefined:
            return proto_1.coresdk.common.VersioningIntent.UNSPECIFIED;
        default:
            (0, type_helpers_1.assertNever)('Unexpected VersioningIntent', intent);
    }
}


/***/ }),

/***/ "./node_modules/protobufjs/light.js":
/*!******************************************!*\
  !*** ./node_modules/protobufjs/light.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// light library entry point.


module.exports = __webpack_require__(/*! ./src/index-light */ "./node_modules/protobufjs/src/index-light.js");

/***/ }),

/***/ "./node_modules/protobufjs/src/converter.js":
/*!**************************************************!*\
  !*** ./node_modules/protobufjs/src/converter.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * Runtime message from/to plain object converters.
 * @namespace
 */
var converter = exports;

var Enum = __webpack_require__(/*! ./enum */ "./node_modules/protobufjs/src/enum.js"),
    util = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

/**
 * Generates a partial value fromObject conveter.
 * @param {Codegen} gen Codegen instance
 * @param {Field} field Reflected field
 * @param {number} fieldIndex Field index
 * @param {string} prop Property reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genValuePartial_fromObject(gen, field, fieldIndex, prop) {
    var defaultAlreadyEmitted = false;
    /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
    if (field.resolvedType) {
        if (field.resolvedType instanceof Enum) { gen
            ("switch(d%s){", prop);
            for (var values = field.resolvedType.values, keys = Object.keys(values), i = 0; i < keys.length; ++i) {
                // enum unknown values passthrough
                if (values[keys[i]] === field.typeDefault && !defaultAlreadyEmitted) { gen
                    ("default:")
                        ("if(typeof(d%s)===\"number\"){m%s=d%s;break}", prop, prop, prop);
                    if (!field.repeated) gen // fallback to default value only for
                                             // arrays, to avoid leaving holes.
                        ("break");           // for non-repeated fields, just ignore
                    defaultAlreadyEmitted = true;
                }
                gen
                ("case%j:", keys[i])
                ("case %i:", values[keys[i]])
                    ("m%s=%j", prop, values[keys[i]])
                    ("break");
            } gen
            ("}");
        } else gen
            ("if(typeof d%s!==\"object\")", prop)
                ("throw TypeError(%j)", field.fullName + ": object expected")
            ("m%s=types[%i].fromObject(d%s)", prop, fieldIndex, prop);
    } else {
        var isUnsigned = false;
        switch (field.type) {
            case "double":
            case "float": gen
                ("m%s=Number(d%s)", prop, prop); // also catches "NaN", "Infinity"
                break;
            case "uint32":
            case "fixed32": gen
                ("m%s=d%s>>>0", prop, prop);
                break;
            case "int32":
            case "sint32":
            case "sfixed32": gen
                ("m%s=d%s|0", prop, prop);
                break;
            case "uint64":
                isUnsigned = true;
                // eslint-disable-line no-fallthrough
            case "int64":
            case "sint64":
            case "fixed64":
            case "sfixed64": gen
                ("if(util.Long)")
                    ("(m%s=util.Long.fromValue(d%s)).unsigned=%j", prop, prop, isUnsigned)
                ("else if(typeof d%s===\"string\")", prop)
                    ("m%s=parseInt(d%s,10)", prop, prop)
                ("else if(typeof d%s===\"number\")", prop)
                    ("m%s=d%s", prop, prop)
                ("else if(typeof d%s===\"object\")", prop)
                    ("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", prop, prop, prop, isUnsigned ? "true" : "");
                break;
            case "bytes": gen
                ("if(typeof d%s===\"string\")", prop)
                    ("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)
                ("else if(d%s.length >= 0)", prop)
                    ("m%s=d%s", prop, prop);
                break;
            case "string": gen
                ("m%s=String(d%s)", prop, prop);
                break;
            case "bool": gen
                ("m%s=Boolean(d%s)", prop, prop);
                break;
            /* default: gen
                ("m%s=d%s", prop, prop);
                break; */
        }
    }
    return gen;
    /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
}

/**
 * Generates a plain object to runtime message converter specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
converter.fromObject = function fromObject(mtype) {
    /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
    var fields = mtype.fieldsArray;
    var gen = util.codegen(["d"], mtype.name + "$fromObject")
    ("if(d instanceof this.ctor)")
        ("return d");
    if (!fields.length) return gen
    ("return new this.ctor");
    gen
    ("var m=new this.ctor");
    for (var i = 0; i < fields.length; ++i) {
        var field  = fields[i].resolve(),
            prop   = util.safeProp(field.name);

        // Map fields
        if (field.map) { gen
    ("if(d%s){", prop)
        ("if(typeof d%s!==\"object\")", prop)
            ("throw TypeError(%j)", field.fullName + ": object expected")
        ("m%s={}", prop)
        ("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", prop);
            genValuePartial_fromObject(gen, field, /* not sorted */ i, prop + "[ks[i]]")
        ("}")
    ("}");

        // Repeated fields
        } else if (field.repeated) { gen
    ("if(d%s){", prop)
        ("if(!Array.isArray(d%s))", prop)
            ("throw TypeError(%j)", field.fullName + ": array expected")
        ("m%s=[]", prop)
        ("for(var i=0;i<d%s.length;++i){", prop);
            genValuePartial_fromObject(gen, field, /* not sorted */ i, prop + "[i]")
        ("}")
    ("}");

        // Non-repeated fields
        } else {
            if (!(field.resolvedType instanceof Enum)) gen // no need to test for null/undefined if an enum (uses switch)
    ("if(d%s!=null){", prop); // !== undefined && !== null
        genValuePartial_fromObject(gen, field, /* not sorted */ i, prop);
            if (!(field.resolvedType instanceof Enum)) gen
    ("}");
        }
    } return gen
    ("return m");
    /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
};

/**
 * Generates a partial value toObject converter.
 * @param {Codegen} gen Codegen instance
 * @param {Field} field Reflected field
 * @param {number} fieldIndex Field index
 * @param {string} prop Property reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genValuePartial_toObject(gen, field, fieldIndex, prop) {
    /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
    if (field.resolvedType) {
        if (field.resolvedType instanceof Enum) gen
            ("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", prop, fieldIndex, prop, prop, fieldIndex, prop, prop);
        else gen
            ("d%s=types[%i].toObject(m%s,o)", prop, fieldIndex, prop);
    } else {
        var isUnsigned = false;
        switch (field.type) {
            case "double":
            case "float": gen
            ("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", prop, prop, prop, prop);
                break;
            case "uint64":
                isUnsigned = true;
                // eslint-disable-line no-fallthrough
            case "int64":
            case "sint64":
            case "fixed64":
            case "sfixed64": gen
            ("if(typeof m%s===\"number\")", prop)
                ("d%s=o.longs===String?String(m%s):m%s", prop, prop, prop)
            ("else") // Long-like
                ("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", prop, prop, prop, prop, isUnsigned ? "true": "", prop);
                break;
            case "bytes": gen
            ("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", prop, prop, prop, prop, prop);
                break;
            default: gen
            ("d%s=m%s", prop, prop);
                break;
        }
    }
    return gen;
    /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
}

/**
 * Generates a runtime message to plain object converter specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
converter.toObject = function toObject(mtype) {
    /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
    var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
    if (!fields.length)
        return util.codegen()("return {}");
    var gen = util.codegen(["m", "o"], mtype.name + "$toObject")
    ("if(!o)")
        ("o={}")
    ("var d={}");

    var repeatedFields = [],
        mapFields = [],
        normalFields = [],
        i = 0;
    for (; i < fields.length; ++i)
        if (!fields[i].partOf)
            ( fields[i].resolve().repeated ? repeatedFields
            : fields[i].map ? mapFields
            : normalFields).push(fields[i]);

    if (repeatedFields.length) { gen
    ("if(o.arrays||o.defaults){");
        for (i = 0; i < repeatedFields.length; ++i) gen
        ("d%s=[]", util.safeProp(repeatedFields[i].name));
        gen
    ("}");
    }

    if (mapFields.length) { gen
    ("if(o.objects||o.defaults){");
        for (i = 0; i < mapFields.length; ++i) gen
        ("d%s={}", util.safeProp(mapFields[i].name));
        gen
    ("}");
    }

    if (normalFields.length) { gen
    ("if(o.defaults){");
        for (i = 0; i < normalFields.length; ++i) {
            var field = normalFields[i],
                prop  = util.safeProp(field.name);
            if (field.resolvedType instanceof Enum) gen
        ("d%s=o.enums===String?%j:%j", prop, field.resolvedType.valuesById[field.typeDefault], field.typeDefault);
            else if (field.long) gen
        ("if(util.Long){")
            ("var n=new util.Long(%i,%i,%j)", field.typeDefault.low, field.typeDefault.high, field.typeDefault.unsigned)
            ("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", prop)
        ("}else")
            ("d%s=o.longs===String?%j:%i", prop, field.typeDefault.toString(), field.typeDefault.toNumber());
            else if (field.bytes) {
                var arrayDefault = "[" + Array.prototype.slice.call(field.typeDefault).join(",") + "]";
                gen
        ("if(o.bytes===String)d%s=%j", prop, String.fromCharCode.apply(String, field.typeDefault))
        ("else{")
            ("d%s=%s", prop, arrayDefault)
            ("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", prop, prop)
        ("}");
            } else gen
        ("d%s=%j", prop, field.typeDefault); // also messages (=null)
        } gen
    ("}");
    }
    var hasKs2 = false;
    for (i = 0; i < fields.length; ++i) {
        var field = fields[i],
            index = mtype._fieldsArray.indexOf(field),
            prop  = util.safeProp(field.name);
        if (field.map) {
            if (!hasKs2) { hasKs2 = true; gen
    ("var ks2");
            } gen
    ("if(m%s&&(ks2=Object.keys(m%s)).length){", prop, prop)
        ("d%s={}", prop)
        ("for(var j=0;j<ks2.length;++j){");
            genValuePartial_toObject(gen, field, /* sorted */ index, prop + "[ks2[j]]")
        ("}");
        } else if (field.repeated) { gen
    ("if(m%s&&m%s.length){", prop, prop)
        ("d%s=[]", prop)
        ("for(var j=0;j<m%s.length;++j){", prop);
            genValuePartial_toObject(gen, field, /* sorted */ index, prop + "[j]")
        ("}");
        } else { gen
    ("if(m%s!=null&&m.hasOwnProperty(%j)){", prop, field.name); // !== undefined && !== null
        genValuePartial_toObject(gen, field, /* sorted */ index, prop);
        if (field.partOf) gen
        ("if(o.oneofs)")
            ("d%s=%j", util.safeProp(field.partOf.name), field.name);
        }
        gen
    ("}");
    }
    return gen
    ("return d");
    /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
};


/***/ }),

/***/ "./node_modules/protobufjs/src/decoder.js":
/*!************************************************!*\
  !*** ./node_modules/protobufjs/src/decoder.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = decoder;

var Enum    = __webpack_require__(/*! ./enum */ "./node_modules/protobufjs/src/enum.js"),
    types   = __webpack_require__(/*! ./types */ "./node_modules/protobufjs/src/types.js"),
    util    = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

function missing(field) {
    return "missing required '" + field.name + "'";
}

/**
 * Generates a decoder specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
function decoder(mtype) {
    /* eslint-disable no-unexpected-multiline */
    var gen = util.codegen(["r", "l"], mtype.name + "$decode")
    ("if(!(r instanceof Reader))")
        ("r=Reader.create(r)")
    ("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (mtype.fieldsArray.filter(function(field) { return field.map; }).length ? ",k,value" : ""))
    ("while(r.pos<c){")
        ("var t=r.uint32()");
    if (mtype.group) gen
        ("if((t&7)===4)")
            ("break");
    gen
        ("switch(t>>>3){");

    var i = 0;
    for (; i < /* initializes */ mtype.fieldsArray.length; ++i) {
        var field = mtype._fieldsArray[i].resolve(),
            type  = field.resolvedType instanceof Enum ? "int32" : field.type,
            ref   = "m" + util.safeProp(field.name); gen
            ("case %i: {", field.id);

        // Map fields
        if (field.map) { gen
                ("if(%s===util.emptyObject)", ref)
                    ("%s={}", ref)
                ("var c2 = r.uint32()+r.pos");

            if (types.defaults[field.keyType] !== undefined) gen
                ("k=%j", types.defaults[field.keyType]);
            else gen
                ("k=null");

            if (types.defaults[type] !== undefined) gen
                ("value=%j", types.defaults[type]);
            else gen
                ("value=null");

            gen
                ("while(r.pos<c2){")
                    ("var tag2=r.uint32()")
                    ("switch(tag2>>>3){")
                        ("case 1: k=r.%s(); break", field.keyType)
                        ("case 2:");

            if (types.basic[type] === undefined) gen
                            ("value=types[%i].decode(r,r.uint32())", i); // can't be groups
            else gen
                            ("value=r.%s()", type);

            gen
                            ("break")
                        ("default:")
                            ("r.skipType(tag2&7)")
                            ("break")
                    ("}")
                ("}");

            if (types.long[field.keyType] !== undefined) gen
                ("%s[typeof k===\"object\"?util.longToHash(k):k]=value", ref);
            else gen
                ("%s[k]=value", ref);

        // Repeated fields
        } else if (field.repeated) { gen

                ("if(!(%s&&%s.length))", ref, ref)
                    ("%s=[]", ref);

            // Packable (always check for forward and backward compatiblity)
            if (types.packed[type] !== undefined) gen
                ("if((t&7)===2){")
                    ("var c2=r.uint32()+r.pos")
                    ("while(r.pos<c2)")
                        ("%s.push(r.%s())", ref, type)
                ("}else");

            // Non-packed
            if (types.basic[type] === undefined) gen(field.resolvedType.group
                    ? "%s.push(types[%i].decode(r))"
                    : "%s.push(types[%i].decode(r,r.uint32()))", ref, i);
            else gen
                    ("%s.push(r.%s())", ref, type);

        // Non-repeated
        } else if (types.basic[type] === undefined) gen(field.resolvedType.group
                ? "%s=types[%i].decode(r)"
                : "%s=types[%i].decode(r,r.uint32())", ref, i);
        else gen
                ("%s=r.%s()", ref, type);
        gen
                ("break")
            ("}");
        // Unknown fields
    } gen
            ("default:")
                ("r.skipType(t&7)")
                ("break")

        ("}")
    ("}");

    // Field presence
    for (i = 0; i < mtype._fieldsArray.length; ++i) {
        var rfield = mtype._fieldsArray[i];
        if (rfield.required) gen
    ("if(!m.hasOwnProperty(%j))", rfield.name)
        ("throw util.ProtocolError(%j,{instance:m})", missing(rfield));
    }

    return gen
    ("return m");
    /* eslint-enable no-unexpected-multiline */
}


/***/ }),

/***/ "./node_modules/protobufjs/src/encoder.js":
/*!************************************************!*\
  !*** ./node_modules/protobufjs/src/encoder.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = encoder;

var Enum     = __webpack_require__(/*! ./enum */ "./node_modules/protobufjs/src/enum.js"),
    types    = __webpack_require__(/*! ./types */ "./node_modules/protobufjs/src/types.js"),
    util     = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

/**
 * Generates a partial message type encoder.
 * @param {Codegen} gen Codegen instance
 * @param {Field} field Reflected field
 * @param {number} fieldIndex Field index
 * @param {string} ref Variable reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genTypePartial(gen, field, fieldIndex, ref) {
    return field.resolvedType.group
        ? gen("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", fieldIndex, ref, (field.id << 3 | 3) >>> 0, (field.id << 3 | 4) >>> 0)
        : gen("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", fieldIndex, ref, (field.id << 3 | 2) >>> 0);
}

/**
 * Generates an encoder specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
function encoder(mtype) {
    /* eslint-disable no-unexpected-multiline, block-scoped-var, no-redeclare */
    var gen = util.codegen(["m", "w"], mtype.name + "$encode")
    ("if(!w)")
        ("w=Writer.create()");

    var i, ref;

    // "when a message is serialized its known fields should be written sequentially by field number"
    var fields = /* initializes */ mtype.fieldsArray.slice().sort(util.compareFieldsById);

    for (var i = 0; i < fields.length; ++i) {
        var field    = fields[i].resolve(),
            index    = mtype._fieldsArray.indexOf(field),
            type     = field.resolvedType instanceof Enum ? "int32" : field.type,
            wireType = types.basic[type];
            ref      = "m" + util.safeProp(field.name);

        // Map fields
        if (field.map) {
            gen
    ("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field.name) // !== undefined && !== null
        ("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref)
            ("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field.id << 3 | 2) >>> 0, 8 | types.mapKey[field.keyType], field.keyType);
            if (wireType === undefined) gen
            ("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", index, ref); // can't be groups
            else gen
            (".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type, ref);
            gen
        ("}")
    ("}");

            // Repeated fields
        } else if (field.repeated) { gen
    ("if(%s!=null&&%s.length){", ref, ref); // !== undefined && !== null

            // Packed repeated
            if (field.packed && types.packed[type] !== undefined) { gen

        ("w.uint32(%i).fork()", (field.id << 3 | 2) >>> 0)
        ("for(var i=0;i<%s.length;++i)", ref)
            ("w.%s(%s[i])", type, ref)
        ("w.ldelim()");

            // Non-packed
            } else { gen

        ("for(var i=0;i<%s.length;++i)", ref);
                if (wireType === undefined)
            genTypePartial(gen, field, index, ref + "[i]");
                else gen
            ("w.uint32(%i).%s(%s[i])", (field.id << 3 | wireType) >>> 0, type, ref);

            } gen
    ("}");

        // Non-repeated
        } else {
            if (field.optional) gen
    ("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", ref, field.name); // !== undefined && !== null

            if (wireType === undefined)
        genTypePartial(gen, field, index, ref);
            else gen
        ("w.uint32(%i).%s(%s)", (field.id << 3 | wireType) >>> 0, type, ref);

        }
    }

    return gen
    ("return w");
    /* eslint-enable no-unexpected-multiline, block-scoped-var, no-redeclare */
}


/***/ }),

/***/ "./node_modules/protobufjs/src/enum.js":
/*!*********************************************!*\
  !*** ./node_modules/protobufjs/src/enum.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Enum;

// extends ReflectionObject
var ReflectionObject = __webpack_require__(/*! ./object */ "./node_modules/protobufjs/src/object.js");
((Enum.prototype = Object.create(ReflectionObject.prototype)).constructor = Enum).className = "Enum";

var Namespace = __webpack_require__(/*! ./namespace */ "./node_modules/protobufjs/src/namespace.js"),
    util = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

/**
 * Constructs a new enum instance.
 * @classdesc Reflected enum.
 * @extends ReflectionObject
 * @constructor
 * @param {string} name Unique name within its namespace
 * @param {Object.<string,number>} [values] Enum values as an object, by name
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] The comment for this enum
 * @param {Object.<string,string>} [comments] The value comments for this enum
 * @param {Object.<string,Object<string,*>>|undefined} [valuesOptions] The value options for this enum
 */
function Enum(name, values, options, comment, comments, valuesOptions) {
    ReflectionObject.call(this, name, options);

    if (values && typeof values !== "object")
        throw TypeError("values must be an object");

    /**
     * Enum values by id.
     * @type {Object.<number,string>}
     */
    this.valuesById = {};

    /**
     * Enum values by name.
     * @type {Object.<string,number>}
     */
    this.values = Object.create(this.valuesById); // toJSON, marker

    /**
     * Enum comment text.
     * @type {string|null}
     */
    this.comment = comment;

    /**
     * Value comment texts, if any.
     * @type {Object.<string,string>}
     */
    this.comments = comments || {};

    /**
     * Values options, if any
     * @type {Object<string, Object<string, *>>|undefined}
     */
    this.valuesOptions = valuesOptions;

    /**
     * Reserved ranges, if any.
     * @type {Array.<number[]|string>}
     */
    this.reserved = undefined; // toJSON

    // Note that values inherit valuesById on their prototype which makes them a TypeScript-
    // compatible enum. This is used by pbts to write actual enum definitions that work for
    // static and reflection code alike instead of emitting generic object definitions.

    if (values)
        for (var keys = Object.keys(values), i = 0; i < keys.length; ++i)
            if (typeof values[keys[i]] === "number") // use forward entries only
                this.valuesById[ this.values[keys[i]] = values[keys[i]] ] = keys[i];
}

/**
 * Enum descriptor.
 * @interface IEnum
 * @property {Object.<string,number>} values Enum values
 * @property {Object.<string,*>} [options] Enum options
 */

/**
 * Constructs an enum from an enum descriptor.
 * @param {string} name Enum name
 * @param {IEnum} json Enum descriptor
 * @returns {Enum} Created enum
 * @throws {TypeError} If arguments are invalid
 */
Enum.fromJSON = function fromJSON(name, json) {
    var enm = new Enum(name, json.values, json.options, json.comment, json.comments);
    enm.reserved = json.reserved;
    return enm;
};

/**
 * Converts this enum to an enum descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IEnum} Enum descriptor
 */
Enum.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "options"       , this.options,
        "valuesOptions" , this.valuesOptions,
        "values"        , this.values,
        "reserved"      , this.reserved && this.reserved.length ? this.reserved : undefined,
        "comment"       , keepComments ? this.comment : undefined,
        "comments"      , keepComments ? this.comments : undefined
    ]);
};

/**
 * Adds a value to this enum.
 * @param {string} name Value name
 * @param {number} id Value id
 * @param {string} [comment] Comment, if any
 * @param {Object.<string, *>|undefined} [options] Options, if any
 * @returns {Enum} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If there is already a value with this name or id
 */
Enum.prototype.add = function add(name, id, comment, options) {
    // utilized by the parser but not by .fromJSON

    if (!util.isString(name))
        throw TypeError("name must be a string");

    if (!util.isInteger(id))
        throw TypeError("id must be an integer");

    if (this.values[name] !== undefined)
        throw Error("duplicate name '" + name + "' in " + this);

    if (this.isReservedId(id))
        throw Error("id " + id + " is reserved in " + this);

    if (this.isReservedName(name))
        throw Error("name '" + name + "' is reserved in " + this);

    if (this.valuesById[id] !== undefined) {
        if (!(this.options && this.options.allow_alias))
            throw Error("duplicate id " + id + " in " + this);
        this.values[name] = id;
    } else
        this.valuesById[this.values[name] = id] = name;

    if (options) {
        if (this.valuesOptions === undefined)
            this.valuesOptions = {};
        this.valuesOptions[name] = options || null;
    }

    this.comments[name] = comment || null;
    return this;
};

/**
 * Removes a value from this enum
 * @param {string} name Value name
 * @returns {Enum} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If `name` is not a name of this enum
 */
Enum.prototype.remove = function remove(name) {

    if (!util.isString(name))
        throw TypeError("name must be a string");

    var val = this.values[name];
    if (val == null)
        throw Error("name '" + name + "' does not exist in " + this);

    delete this.valuesById[val];
    delete this.values[name];
    delete this.comments[name];
    if (this.valuesOptions)
        delete this.valuesOptions[name];

    return this;
};

/**
 * Tests if the specified id is reserved.
 * @param {number} id Id to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Enum.prototype.isReservedId = function isReservedId(id) {
    return Namespace.isReservedId(this.reserved, id);
};

/**
 * Tests if the specified name is reserved.
 * @param {string} name Name to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Enum.prototype.isReservedName = function isReservedName(name) {
    return Namespace.isReservedName(this.reserved, name);
};


/***/ }),

/***/ "./node_modules/protobufjs/src/field.js":
/*!**********************************************!*\
  !*** ./node_modules/protobufjs/src/field.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Field;

// extends ReflectionObject
var ReflectionObject = __webpack_require__(/*! ./object */ "./node_modules/protobufjs/src/object.js");
((Field.prototype = Object.create(ReflectionObject.prototype)).constructor = Field).className = "Field";

var Enum  = __webpack_require__(/*! ./enum */ "./node_modules/protobufjs/src/enum.js"),
    types = __webpack_require__(/*! ./types */ "./node_modules/protobufjs/src/types.js"),
    util  = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

var Type; // cyclic

var ruleRe = /^required|optional|repeated$/;

/**
 * Constructs a new message field instance. Note that {@link MapField|map fields} have their own class.
 * @name Field
 * @classdesc Reflected message field.
 * @extends FieldBase
 * @constructor
 * @param {string} name Unique name within its namespace
 * @param {number} id Unique id within its namespace
 * @param {string} type Value type
 * @param {string|Object.<string,*>} [rule="optional"] Field rule
 * @param {string|Object.<string,*>} [extend] Extended type if different from parent
 * @param {Object.<string,*>} [options] Declared options
 */

/**
 * Constructs a field from a field descriptor.
 * @param {string} name Field name
 * @param {IField} json Field descriptor
 * @returns {Field} Created field
 * @throws {TypeError} If arguments are invalid
 */
Field.fromJSON = function fromJSON(name, json) {
    return new Field(name, json.id, json.type, json.rule, json.extend, json.options, json.comment);
};

/**
 * Not an actual constructor. Use {@link Field} instead.
 * @classdesc Base class of all reflected message fields. This is not an actual class but here for the sake of having consistent type definitions.
 * @exports FieldBase
 * @extends ReflectionObject
 * @constructor
 * @param {string} name Unique name within its namespace
 * @param {number} id Unique id within its namespace
 * @param {string} type Value type
 * @param {string|Object.<string,*>} [rule="optional"] Field rule
 * @param {string|Object.<string,*>} [extend] Extended type if different from parent
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] Comment associated with this field
 */
function Field(name, id, type, rule, extend, options, comment) {

    if (util.isObject(rule)) {
        comment = extend;
        options = rule;
        rule = extend = undefined;
    } else if (util.isObject(extend)) {
        comment = options;
        options = extend;
        extend = undefined;
    }

    ReflectionObject.call(this, name, options);

    if (!util.isInteger(id) || id < 0)
        throw TypeError("id must be a non-negative integer");

    if (!util.isString(type))
        throw TypeError("type must be a string");

    if (rule !== undefined && !ruleRe.test(rule = rule.toString().toLowerCase()))
        throw TypeError("rule must be a string rule");

    if (extend !== undefined && !util.isString(extend))
        throw TypeError("extend must be a string");

    /**
     * Field rule, if any.
     * @type {string|undefined}
     */
    if (rule === "proto3_optional") {
        rule = "optional";
    }
    this.rule = rule && rule !== "optional" ? rule : undefined; // toJSON

    /**
     * Field type.
     * @type {string}
     */
    this.type = type; // toJSON

    /**
     * Unique field id.
     * @type {number}
     */
    this.id = id; // toJSON, marker

    /**
     * Extended type if different from parent.
     * @type {string|undefined}
     */
    this.extend = extend || undefined; // toJSON

    /**
     * Whether this field is required.
     * @type {boolean}
     */
    this.required = rule === "required";

    /**
     * Whether this field is optional.
     * @type {boolean}
     */
    this.optional = !this.required;

    /**
     * Whether this field is repeated.
     * @type {boolean}
     */
    this.repeated = rule === "repeated";

    /**
     * Whether this field is a map or not.
     * @type {boolean}
     */
    this.map = false;

    /**
     * Message this field belongs to.
     * @type {Type|null}
     */
    this.message = null;

    /**
     * OneOf this field belongs to, if any,
     * @type {OneOf|null}
     */
    this.partOf = null;

    /**
     * The field type's default value.
     * @type {*}
     */
    this.typeDefault = null;

    /**
     * The field's default value on prototypes.
     * @type {*}
     */
    this.defaultValue = null;

    /**
     * Whether this field's value should be treated as a long.
     * @type {boolean}
     */
    this.long = util.Long ? types.long[type] !== undefined : /* istanbul ignore next */ false;

    /**
     * Whether this field's value is a buffer.
     * @type {boolean}
     */
    this.bytes = type === "bytes";

    /**
     * Resolved type if not a basic type.
     * @type {Type|Enum|null}
     */
    this.resolvedType = null;

    /**
     * Sister-field within the extended type if a declaring extension field.
     * @type {Field|null}
     */
    this.extensionField = null;

    /**
     * Sister-field within the declaring namespace if an extended field.
     * @type {Field|null}
     */
    this.declaringField = null;

    /**
     * Internally remembers whether this field is packed.
     * @type {boolean|null}
     * @private
     */
    this._packed = null;

    /**
     * Comment for this field.
     * @type {string|null}
     */
    this.comment = comment;
}

/**
 * Determines whether this field is packed. Only relevant when repeated and working with proto2.
 * @name Field#packed
 * @type {boolean}
 * @readonly
 */
Object.defineProperty(Field.prototype, "packed", {
    get: function() {
        // defaults to packed=true if not explicity set to false
        if (this._packed === null)
            this._packed = this.getOption("packed") !== false;
        return this._packed;
    }
});

/**
 * @override
 */
Field.prototype.setOption = function setOption(name, value, ifNotSet) {
    if (name === "packed") // clear cached before setting
        this._packed = null;
    return ReflectionObject.prototype.setOption.call(this, name, value, ifNotSet);
};

/**
 * Field descriptor.
 * @interface IField
 * @property {string} [rule="optional"] Field rule
 * @property {string} type Field type
 * @property {number} id Field id
 * @property {Object.<string,*>} [options] Field options
 */

/**
 * Extension field descriptor.
 * @interface IExtensionField
 * @extends IField
 * @property {string} extend Extended type
 */

/**
 * Converts this field to a field descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IField} Field descriptor
 */
Field.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "rule"    , this.rule !== "optional" && this.rule || undefined,
        "type"    , this.type,
        "id"      , this.id,
        "extend"  , this.extend,
        "options" , this.options,
        "comment" , keepComments ? this.comment : undefined
    ]);
};

/**
 * Resolves this field's type references.
 * @returns {Field} `this`
 * @throws {Error} If any reference cannot be resolved
 */
Field.prototype.resolve = function resolve() {

    if (this.resolved)
        return this;

    if ((this.typeDefault = types.defaults[this.type]) === undefined) { // if not a basic type, resolve it
        this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type);
        if (this.resolvedType instanceof Type)
            this.typeDefault = null;
        else // instanceof Enum
            this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]]; // first defined
    } else if (this.options && this.options.proto3_optional) {
        // proto3 scalar value marked optional; should default to null
        this.typeDefault = null;
    }

    // use explicitly set default value if present
    if (this.options && this.options["default"] != null) {
        this.typeDefault = this.options["default"];
        if (this.resolvedType instanceof Enum && typeof this.typeDefault === "string")
            this.typeDefault = this.resolvedType.values[this.typeDefault];
    }

    // remove unnecessary options
    if (this.options) {
        if (this.options.packed === true || this.options.packed !== undefined && this.resolvedType && !(this.resolvedType instanceof Enum))
            delete this.options.packed;
        if (!Object.keys(this.options).length)
            this.options = undefined;
    }

    // convert to internal data type if necesssary
    if (this.long) {
        this.typeDefault = util.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u");

        /* istanbul ignore else */
        if (Object.freeze)
            Object.freeze(this.typeDefault); // long instances are meant to be immutable anyway (i.e. use small int cache that even requires it)

    } else if (this.bytes && typeof this.typeDefault === "string") {
        var buf;
        if (util.base64.test(this.typeDefault))
            util.base64.decode(this.typeDefault, buf = util.newBuffer(util.base64.length(this.typeDefault)), 0);
        else
            util.utf8.write(this.typeDefault, buf = util.newBuffer(util.utf8.length(this.typeDefault)), 0);
        this.typeDefault = buf;
    }

    // take special care of maps and repeated fields
    if (this.map)
        this.defaultValue = util.emptyObject;
    else if (this.repeated)
        this.defaultValue = util.emptyArray;
    else
        this.defaultValue = this.typeDefault;

    // ensure proper value on prototype
    if (this.parent instanceof Type)
        this.parent.ctor.prototype[this.name] = this.defaultValue;

    return ReflectionObject.prototype.resolve.call(this);
};

/**
 * Decorator function as returned by {@link Field.d} and {@link MapField.d} (TypeScript).
 * @typedef FieldDecorator
 * @type {function}
 * @param {Object} prototype Target prototype
 * @param {string} fieldName Field name
 * @returns {undefined}
 */

/**
 * Field decorator (TypeScript).
 * @name Field.d
 * @function
 * @param {number} fieldId Field id
 * @param {"double"|"float"|"int32"|"uint32"|"sint32"|"fixed32"|"sfixed32"|"int64"|"uint64"|"sint64"|"fixed64"|"sfixed64"|"string"|"bool"|"bytes"|Object} fieldType Field type
 * @param {"optional"|"required"|"repeated"} [fieldRule="optional"] Field rule
 * @param {T} [defaultValue] Default value
 * @returns {FieldDecorator} Decorator function
 * @template T extends number | number[] | Long | Long[] | string | string[] | boolean | boolean[] | Uint8Array | Uint8Array[] | Buffer | Buffer[]
 */
Field.d = function decorateField(fieldId, fieldType, fieldRule, defaultValue) {

    // submessage: decorate the submessage and use its name as the type
    if (typeof fieldType === "function")
        fieldType = util.decorateType(fieldType).name;

    // enum reference: create a reflected copy of the enum and keep reuseing it
    else if (fieldType && typeof fieldType === "object")
        fieldType = util.decorateEnum(fieldType).name;

    return function fieldDecorator(prototype, fieldName) {
        util.decorateType(prototype.constructor)
            .add(new Field(fieldName, fieldId, fieldType, fieldRule, { "default": defaultValue }));
    };
};

/**
 * Field decorator (TypeScript).
 * @name Field.d
 * @function
 * @param {number} fieldId Field id
 * @param {Constructor<T>|string} fieldType Field type
 * @param {"optional"|"required"|"repeated"} [fieldRule="optional"] Field rule
 * @returns {FieldDecorator} Decorator function
 * @template T extends Message<T>
 * @variation 2
 */
// like Field.d but without a default value

// Sets up cyclic dependencies (called in index-light)
Field._configure = function configure(Type_) {
    Type = Type_;
};


/***/ }),

/***/ "./node_modules/protobufjs/src/index-light.js":
/*!****************************************************!*\
  !*** ./node_modules/protobufjs/src/index-light.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var protobuf = module.exports = __webpack_require__(/*! ./index-minimal */ "./node_modules/protobufjs/src/index-minimal.js");

protobuf.build = "light";

/**
 * A node-style callback as used by {@link load} and {@link Root#load}.
 * @typedef LoadCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Root} [root] Root, if there hasn't been an error
 * @returns {undefined}
 */

/**
 * Loads one or multiple .proto or preprocessed .json files into a common root namespace and calls the callback.
 * @param {string|string[]} filename One or multiple files to load
 * @param {Root} root Root namespace, defaults to create a new one if omitted.
 * @param {LoadCallback} callback Callback function
 * @returns {undefined}
 * @see {@link Root#load}
 */
function load(filename, root, callback) {
    if (typeof root === "function") {
        callback = root;
        root = new protobuf.Root();
    } else if (!root)
        root = new protobuf.Root();
    return root.load(filename, callback);
}

/**
 * Loads one or multiple .proto or preprocessed .json files into a common root namespace and calls the callback.
 * @name load
 * @function
 * @param {string|string[]} filename One or multiple files to load
 * @param {LoadCallback} callback Callback function
 * @returns {undefined}
 * @see {@link Root#load}
 * @variation 2
 */
// function load(filename:string, callback:LoadCallback):undefined

/**
 * Loads one or multiple .proto or preprocessed .json files into a common root namespace and returns a promise.
 * @name load
 * @function
 * @param {string|string[]} filename One or multiple files to load
 * @param {Root} [root] Root namespace, defaults to create a new one if omitted.
 * @returns {Promise<Root>} Promise
 * @see {@link Root#load}
 * @variation 3
 */
// function load(filename:string, [root:Root]):Promise<Root>

protobuf.load = load;

/**
 * Synchronously loads one or multiple .proto or preprocessed .json files into a common root namespace (node only).
 * @param {string|string[]} filename One or multiple files to load
 * @param {Root} [root] Root namespace, defaults to create a new one if omitted.
 * @returns {Root} Root namespace
 * @throws {Error} If synchronous fetching is not supported (i.e. in browsers) or if a file's syntax is invalid
 * @see {@link Root#loadSync}
 */
function loadSync(filename, root) {
    if (!root)
        root = new protobuf.Root();
    return root.loadSync(filename);
}

protobuf.loadSync = loadSync;

// Serialization
protobuf.encoder          = __webpack_require__(/*! ./encoder */ "./node_modules/protobufjs/src/encoder.js");
protobuf.decoder          = __webpack_require__(/*! ./decoder */ "./node_modules/protobufjs/src/decoder.js");
protobuf.verifier         = __webpack_require__(/*! ./verifier */ "./node_modules/protobufjs/src/verifier.js");
protobuf.converter        = __webpack_require__(/*! ./converter */ "./node_modules/protobufjs/src/converter.js");

// Reflection
protobuf.ReflectionObject = __webpack_require__(/*! ./object */ "./node_modules/protobufjs/src/object.js");
protobuf.Namespace        = __webpack_require__(/*! ./namespace */ "./node_modules/protobufjs/src/namespace.js");
protobuf.Root             = __webpack_require__(/*! ./root */ "./node_modules/protobufjs/src/root.js");
protobuf.Enum             = __webpack_require__(/*! ./enum */ "./node_modules/protobufjs/src/enum.js");
protobuf.Type             = __webpack_require__(/*! ./type */ "./node_modules/protobufjs/src/type.js");
protobuf.Field            = __webpack_require__(/*! ./field */ "./node_modules/protobufjs/src/field.js");
protobuf.OneOf            = __webpack_require__(/*! ./oneof */ "./node_modules/protobufjs/src/oneof.js");
protobuf.MapField         = __webpack_require__(/*! ./mapfield */ "./node_modules/protobufjs/src/mapfield.js");
protobuf.Service          = __webpack_require__(/*! ./service */ "./node_modules/protobufjs/src/service.js");
protobuf.Method           = __webpack_require__(/*! ./method */ "./node_modules/protobufjs/src/method.js");

// Runtime
protobuf.Message          = __webpack_require__(/*! ./message */ "./node_modules/protobufjs/src/message.js");
protobuf.wrappers         = __webpack_require__(/*! ./wrappers */ "./node_modules/protobufjs/src/wrappers.js");

// Utility
protobuf.types            = __webpack_require__(/*! ./types */ "./node_modules/protobufjs/src/types.js");
protobuf.util             = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

// Set up possibly cyclic reflection dependencies
protobuf.ReflectionObject._configure(protobuf.Root);
protobuf.Namespace._configure(protobuf.Type, protobuf.Service, protobuf.Enum);
protobuf.Root._configure(protobuf.Type);
protobuf.Field._configure(protobuf.Type);


/***/ }),

/***/ "./node_modules/protobufjs/src/index-minimal.js":
/*!******************************************************!*\
  !*** ./node_modules/protobufjs/src/index-minimal.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var protobuf = exports;

/**
 * Build type, one of `"full"`, `"light"` or `"minimal"`.
 * @name build
 * @type {string}
 * @const
 */
protobuf.build = "minimal";

// Serialization
protobuf.Writer       = __webpack_require__(/*! ./writer */ "./node_modules/protobufjs/src/writer.js");
protobuf.BufferWriter = __webpack_require__(/*! ./writer_buffer */ "./node_modules/protobufjs/src/writer_buffer.js");
protobuf.Reader       = __webpack_require__(/*! ./reader */ "./node_modules/protobufjs/src/reader.js");
protobuf.BufferReader = __webpack_require__(/*! ./reader_buffer */ "./node_modules/protobufjs/src/reader_buffer.js");

// Utility
protobuf.util         = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");
protobuf.rpc          = __webpack_require__(/*! ./rpc */ "./node_modules/protobufjs/src/rpc.js");
protobuf.roots        = __webpack_require__(/*! ./roots */ "./node_modules/protobufjs/src/roots.js");
protobuf.configure    = configure;

/* istanbul ignore next */
/**
 * Reconfigures the library according to the environment.
 * @returns {undefined}
 */
function configure() {
    protobuf.util._configure();
    protobuf.Writer._configure(protobuf.BufferWriter);
    protobuf.Reader._configure(protobuf.BufferReader);
}

// Set up buffer utility according to the environment
configure();


/***/ }),

/***/ "./node_modules/protobufjs/src/mapfield.js":
/*!*************************************************!*\
  !*** ./node_modules/protobufjs/src/mapfield.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = MapField;

// extends Field
var Field = __webpack_require__(/*! ./field */ "./node_modules/protobufjs/src/field.js");
((MapField.prototype = Object.create(Field.prototype)).constructor = MapField).className = "MapField";

var types   = __webpack_require__(/*! ./types */ "./node_modules/protobufjs/src/types.js"),
    util    = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

/**
 * Constructs a new map field instance.
 * @classdesc Reflected map field.
 * @extends FieldBase
 * @constructor
 * @param {string} name Unique name within its namespace
 * @param {number} id Unique id within its namespace
 * @param {string} keyType Key type
 * @param {string} type Value type
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] Comment associated with this field
 */
function MapField(name, id, keyType, type, options, comment) {
    Field.call(this, name, id, type, undefined, undefined, options, comment);

    /* istanbul ignore if */
    if (!util.isString(keyType))
        throw TypeError("keyType must be a string");

    /**
     * Key type.
     * @type {string}
     */
    this.keyType = keyType; // toJSON, marker

    /**
     * Resolved key type if not a basic type.
     * @type {ReflectionObject|null}
     */
    this.resolvedKeyType = null;

    // Overrides Field#map
    this.map = true;
}

/**
 * Map field descriptor.
 * @interface IMapField
 * @extends {IField}
 * @property {string} keyType Key type
 */

/**
 * Extension map field descriptor.
 * @interface IExtensionMapField
 * @extends IMapField
 * @property {string} extend Extended type
 */

/**
 * Constructs a map field from a map field descriptor.
 * @param {string} name Field name
 * @param {IMapField} json Map field descriptor
 * @returns {MapField} Created map field
 * @throws {TypeError} If arguments are invalid
 */
MapField.fromJSON = function fromJSON(name, json) {
    return new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
};

/**
 * Converts this map field to a map field descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IMapField} Map field descriptor
 */
MapField.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "keyType" , this.keyType,
        "type"    , this.type,
        "id"      , this.id,
        "extend"  , this.extend,
        "options" , this.options,
        "comment" , keepComments ? this.comment : undefined
    ]);
};

/**
 * @override
 */
MapField.prototype.resolve = function resolve() {
    if (this.resolved)
        return this;

    // Besides a value type, map fields have a key type that may be "any scalar type except for floating point types and bytes"
    if (types.mapKey[this.keyType] === undefined)
        throw Error("invalid key type: " + this.keyType);

    return Field.prototype.resolve.call(this);
};

/**
 * Map field decorator (TypeScript).
 * @name MapField.d
 * @function
 * @param {number} fieldId Field id
 * @param {"int32"|"uint32"|"sint32"|"fixed32"|"sfixed32"|"int64"|"uint64"|"sint64"|"fixed64"|"sfixed64"|"bool"|"string"} fieldKeyType Field key type
 * @param {"double"|"float"|"int32"|"uint32"|"sint32"|"fixed32"|"sfixed32"|"int64"|"uint64"|"sint64"|"fixed64"|"sfixed64"|"bool"|"string"|"bytes"|Object|Constructor<{}>} fieldValueType Field value type
 * @returns {FieldDecorator} Decorator function
 * @template T extends { [key: string]: number | Long | string | boolean | Uint8Array | Buffer | number[] | Message<{}> }
 */
MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {

    // submessage value: decorate the submessage and use its name as the type
    if (typeof fieldValueType === "function")
        fieldValueType = util.decorateType(fieldValueType).name;

    // enum reference value: create a reflected copy of the enum and keep reuseing it
    else if (fieldValueType && typeof fieldValueType === "object")
        fieldValueType = util.decorateEnum(fieldValueType).name;

    return function mapFieldDecorator(prototype, fieldName) {
        util.decorateType(prototype.constructor)
            .add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
    };
};


/***/ }),

/***/ "./node_modules/protobufjs/src/message.js":
/*!************************************************!*\
  !*** ./node_modules/protobufjs/src/message.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Message;

var util = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

/**
 * Constructs a new message instance.
 * @classdesc Abstract runtime message.
 * @constructor
 * @param {Properties<T>} [properties] Properties to set
 * @template T extends object = object
 */
function Message(properties) {
    // not used internally
    if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            this[keys[i]] = properties[keys[i]];
}

/**
 * Reference to the reflected type.
 * @name Message.$type
 * @type {Type}
 * @readonly
 */

/**
 * Reference to the reflected type.
 * @name Message#$type
 * @type {Type}
 * @readonly
 */

/*eslint-disable valid-jsdoc*/

/**
 * Creates a new message of this type using the specified properties.
 * @param {Object.<string,*>} [properties] Properties to set
 * @returns {Message<T>} Message instance
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.create = function create(properties) {
    return this.$type.create(properties);
};

/**
 * Encodes a message of this type.
 * @param {T|Object.<string,*>} message Message to encode
 * @param {Writer} [writer] Writer to use
 * @returns {Writer} Writer
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.encode = function encode(message, writer) {
    return this.$type.encode(message, writer);
};

/**
 * Encodes a message of this type preceeded by its length as a varint.
 * @param {T|Object.<string,*>} message Message to encode
 * @param {Writer} [writer] Writer to use
 * @returns {Writer} Writer
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.encodeDelimited = function encodeDelimited(message, writer) {
    return this.$type.encodeDelimited(message, writer);
};

/**
 * Decodes a message of this type.
 * @name Message.decode
 * @function
 * @param {Reader|Uint8Array} reader Reader or buffer to decode
 * @returns {T} Decoded message
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.decode = function decode(reader) {
    return this.$type.decode(reader);
};

/**
 * Decodes a message of this type preceeded by its length as a varint.
 * @name Message.decodeDelimited
 * @function
 * @param {Reader|Uint8Array} reader Reader or buffer to decode
 * @returns {T} Decoded message
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.decodeDelimited = function decodeDelimited(reader) {
    return this.$type.decodeDelimited(reader);
};

/**
 * Verifies a message of this type.
 * @name Message.verify
 * @function
 * @param {Object.<string,*>} message Plain object to verify
 * @returns {string|null} `null` if valid, otherwise the reason why it is not
 */
Message.verify = function verify(message) {
    return this.$type.verify(message);
};

/**
 * Creates a new message of this type from a plain object. Also converts values to their respective internal types.
 * @param {Object.<string,*>} object Plain object
 * @returns {T} Message instance
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.fromObject = function fromObject(object) {
    return this.$type.fromObject(object);
};

/**
 * Creates a plain object from a message of this type. Also converts values to other types if specified.
 * @param {T} message Message instance
 * @param {IConversionOptions} [options] Conversion options
 * @returns {Object.<string,*>} Plain object
 * @template T extends Message<T>
 * @this Constructor<T>
 */
Message.toObject = function toObject(message, options) {
    return this.$type.toObject(message, options);
};

/**
 * Converts this message to JSON.
 * @returns {Object.<string,*>} JSON object
 */
Message.prototype.toJSON = function toJSON() {
    return this.$type.toObject(this, util.toJSONOptions);
};

/*eslint-enable valid-jsdoc*/

/***/ }),

/***/ "./node_modules/protobufjs/src/method.js":
/*!***********************************************!*\
  !*** ./node_modules/protobufjs/src/method.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Method;

// extends ReflectionObject
var ReflectionObject = __webpack_require__(/*! ./object */ "./node_modules/protobufjs/src/object.js");
((Method.prototype = Object.create(ReflectionObject.prototype)).constructor = Method).className = "Method";

var util = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

/**
 * Constructs a new service method instance.
 * @classdesc Reflected service method.
 * @extends ReflectionObject
 * @constructor
 * @param {string} name Method name
 * @param {string|undefined} type Method type, usually `"rpc"`
 * @param {string} requestType Request message type
 * @param {string} responseType Response message type
 * @param {boolean|Object.<string,*>} [requestStream] Whether the request is streamed
 * @param {boolean|Object.<string,*>} [responseStream] Whether the response is streamed
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] The comment for this method
 * @param {Object.<string,*>} [parsedOptions] Declared options, properly parsed into an object
 */
function Method(name, type, requestType, responseType, requestStream, responseStream, options, comment, parsedOptions) {

    /* istanbul ignore next */
    if (util.isObject(requestStream)) {
        options = requestStream;
        requestStream = responseStream = undefined;
    } else if (util.isObject(responseStream)) {
        options = responseStream;
        responseStream = undefined;
    }

    /* istanbul ignore if */
    if (!(type === undefined || util.isString(type)))
        throw TypeError("type must be a string");

    /* istanbul ignore if */
    if (!util.isString(requestType))
        throw TypeError("requestType must be a string");

    /* istanbul ignore if */
    if (!util.isString(responseType))
        throw TypeError("responseType must be a string");

    ReflectionObject.call(this, name, options);

    /**
     * Method type.
     * @type {string}
     */
    this.type = type || "rpc"; // toJSON

    /**
     * Request type.
     * @type {string}
     */
    this.requestType = requestType; // toJSON, marker

    /**
     * Whether requests are streamed or not.
     * @type {boolean|undefined}
     */
    this.requestStream = requestStream ? true : undefined; // toJSON

    /**
     * Response type.
     * @type {string}
     */
    this.responseType = responseType; // toJSON

    /**
     * Whether responses are streamed or not.
     * @type {boolean|undefined}
     */
    this.responseStream = responseStream ? true : undefined; // toJSON

    /**
     * Resolved request type.
     * @type {Type|null}
     */
    this.resolvedRequestType = null;

    /**
     * Resolved response type.
     * @type {Type|null}
     */
    this.resolvedResponseType = null;

    /**
     * Comment for this method
     * @type {string|null}
     */
    this.comment = comment;

    /**
     * Options properly parsed into an object
     */
    this.parsedOptions = parsedOptions;
}

/**
 * Method descriptor.
 * @interface IMethod
 * @property {string} [type="rpc"] Method type
 * @property {string} requestType Request type
 * @property {string} responseType Response type
 * @property {boolean} [requestStream=false] Whether requests are streamed
 * @property {boolean} [responseStream=false] Whether responses are streamed
 * @property {Object.<string,*>} [options] Method options
 * @property {string} comment Method comments
 * @property {Object.<string,*>} [parsedOptions] Method options properly parsed into an object
 */

/**
 * Constructs a method from a method descriptor.
 * @param {string} name Method name
 * @param {IMethod} json Method descriptor
 * @returns {Method} Created method
 * @throws {TypeError} If arguments are invalid
 */
Method.fromJSON = function fromJSON(name, json) {
    return new Method(name, json.type, json.requestType, json.responseType, json.requestStream, json.responseStream, json.options, json.comment, json.parsedOptions);
};

/**
 * Converts this method to a method descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IMethod} Method descriptor
 */
Method.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "type"           , this.type !== "rpc" && /* istanbul ignore next */ this.type || undefined,
        "requestType"    , this.requestType,
        "requestStream"  , this.requestStream,
        "responseType"   , this.responseType,
        "responseStream" , this.responseStream,
        "options"        , this.options,
        "comment"        , keepComments ? this.comment : undefined,
        "parsedOptions"  , this.parsedOptions,
    ]);
};

/**
 * @override
 */
Method.prototype.resolve = function resolve() {

    /* istanbul ignore if */
    if (this.resolved)
        return this;

    this.resolvedRequestType = this.parent.lookupType(this.requestType);
    this.resolvedResponseType = this.parent.lookupType(this.responseType);

    return ReflectionObject.prototype.resolve.call(this);
};


/***/ }),

/***/ "./node_modules/protobufjs/src/namespace.js":
/*!**************************************************!*\
  !*** ./node_modules/protobufjs/src/namespace.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Namespace;

// extends ReflectionObject
var ReflectionObject = __webpack_require__(/*! ./object */ "./node_modules/protobufjs/src/object.js");
((Namespace.prototype = Object.create(ReflectionObject.prototype)).constructor = Namespace).className = "Namespace";

var Field    = __webpack_require__(/*! ./field */ "./node_modules/protobufjs/src/field.js"),
    util     = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js"),
    OneOf    = __webpack_require__(/*! ./oneof */ "./node_modules/protobufjs/src/oneof.js");

var Type,    // cyclic
    Service,
    Enum;

/**
 * Constructs a new namespace instance.
 * @name Namespace
 * @classdesc Reflected namespace.
 * @extends NamespaceBase
 * @constructor
 * @param {string} name Namespace name
 * @param {Object.<string,*>} [options] Declared options
 */

/**
 * Constructs a namespace from JSON.
 * @memberof Namespace
 * @function
 * @param {string} name Namespace name
 * @param {Object.<string,*>} json JSON object
 * @returns {Namespace} Created namespace
 * @throws {TypeError} If arguments are invalid
 */
Namespace.fromJSON = function fromJSON(name, json) {
    return new Namespace(name, json.options).addJSON(json.nested);
};

/**
 * Converts an array of reflection objects to JSON.
 * @memberof Namespace
 * @param {ReflectionObject[]} array Object array
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {Object.<string,*>|undefined} JSON object or `undefined` when array is empty
 */
function arrayToJSON(array, toJSONOptions) {
    if (!(array && array.length))
        return undefined;
    var obj = {};
    for (var i = 0; i < array.length; ++i)
        obj[array[i].name] = array[i].toJSON(toJSONOptions);
    return obj;
}

Namespace.arrayToJSON = arrayToJSON;

/**
 * Tests if the specified id is reserved.
 * @param {Array.<number[]|string>|undefined} reserved Array of reserved ranges and names
 * @param {number} id Id to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Namespace.isReservedId = function isReservedId(reserved, id) {
    if (reserved)
        for (var i = 0; i < reserved.length; ++i)
            if (typeof reserved[i] !== "string" && reserved[i][0] <= id && reserved[i][1] > id)
                return true;
    return false;
};

/**
 * Tests if the specified name is reserved.
 * @param {Array.<number[]|string>|undefined} reserved Array of reserved ranges and names
 * @param {string} name Name to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Namespace.isReservedName = function isReservedName(reserved, name) {
    if (reserved)
        for (var i = 0; i < reserved.length; ++i)
            if (reserved[i] === name)
                return true;
    return false;
};

/**
 * Not an actual constructor. Use {@link Namespace} instead.
 * @classdesc Base class of all reflection objects containing nested objects. This is not an actual class but here for the sake of having consistent type definitions.
 * @exports NamespaceBase
 * @extends ReflectionObject
 * @abstract
 * @constructor
 * @param {string} name Namespace name
 * @param {Object.<string,*>} [options] Declared options
 * @see {@link Namespace}
 */
function Namespace(name, options) {
    ReflectionObject.call(this, name, options);

    /**
     * Nested objects by name.
     * @type {Object.<string,ReflectionObject>|undefined}
     */
    this.nested = undefined; // toJSON

    /**
     * Cached nested objects as an array.
     * @type {ReflectionObject[]|null}
     * @private
     */
    this._nestedArray = null;
}

function clearCache(namespace) {
    namespace._nestedArray = null;
    return namespace;
}

/**
 * Nested objects of this namespace as an array for iteration.
 * @name NamespaceBase#nestedArray
 * @type {ReflectionObject[]}
 * @readonly
 */
Object.defineProperty(Namespace.prototype, "nestedArray", {
    get: function() {
        return this._nestedArray || (this._nestedArray = util.toArray(this.nested));
    }
});

/**
 * Namespace descriptor.
 * @interface INamespace
 * @property {Object.<string,*>} [options] Namespace options
 * @property {Object.<string,AnyNestedObject>} [nested] Nested object descriptors
 */

/**
 * Any extension field descriptor.
 * @typedef AnyExtensionField
 * @type {IExtensionField|IExtensionMapField}
 */

/**
 * Any nested object descriptor.
 * @typedef AnyNestedObject
 * @type {IEnum|IType|IService|AnyExtensionField|INamespace|IOneOf}
 */

/**
 * Converts this namespace to a namespace descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {INamespace} Namespace descriptor
 */
Namespace.prototype.toJSON = function toJSON(toJSONOptions) {
    return util.toObject([
        "options" , this.options,
        "nested"  , arrayToJSON(this.nestedArray, toJSONOptions)
    ]);
};

/**
 * Adds nested objects to this namespace from nested object descriptors.
 * @param {Object.<string,AnyNestedObject>} nestedJson Any nested object descriptors
 * @returns {Namespace} `this`
 */
Namespace.prototype.addJSON = function addJSON(nestedJson) {
    var ns = this;
    /* istanbul ignore else */
    if (nestedJson) {
        for (var names = Object.keys(nestedJson), i = 0, nested; i < names.length; ++i) {
            nested = nestedJson[names[i]];
            ns.add( // most to least likely
                ( nested.fields !== undefined
                ? Type.fromJSON
                : nested.values !== undefined
                ? Enum.fromJSON
                : nested.methods !== undefined
                ? Service.fromJSON
                : nested.id !== undefined
                ? Field.fromJSON
                : Namespace.fromJSON )(names[i], nested)
            );
        }
    }
    return this;
};

/**
 * Gets the nested object of the specified name.
 * @param {string} name Nested object name
 * @returns {ReflectionObject|null} The reflection object or `null` if it doesn't exist
 */
Namespace.prototype.get = function get(name) {
    return this.nested && this.nested[name]
        || null;
};

/**
 * Gets the values of the nested {@link Enum|enum} of the specified name.
 * This methods differs from {@link Namespace#get|get} in that it returns an enum's values directly and throws instead of returning `null`.
 * @param {string} name Nested enum name
 * @returns {Object.<string,number>} Enum values
 * @throws {Error} If there is no such enum
 */
Namespace.prototype.getEnum = function getEnum(name) {
    if (this.nested && this.nested[name] instanceof Enum)
        return this.nested[name].values;
    throw Error("no such enum: " + name);
};

/**
 * Adds a nested object to this namespace.
 * @param {ReflectionObject} object Nested object to add
 * @returns {Namespace} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If there is already a nested object with this name
 */
Namespace.prototype.add = function add(object) {

    if (!(object instanceof Field && object.extend !== undefined || object instanceof Type  || object instanceof OneOf || object instanceof Enum || object instanceof Service || object instanceof Namespace))
        throw TypeError("object must be a valid nested object");

    if (!this.nested)
        this.nested = {};
    else {
        var prev = this.get(object.name);
        if (prev) {
            if (prev instanceof Namespace && object instanceof Namespace && !(prev instanceof Type || prev instanceof Service)) {
                // replace plain namespace but keep existing nested elements and options
                var nested = prev.nestedArray;
                for (var i = 0; i < nested.length; ++i)
                    object.add(nested[i]);
                this.remove(prev);
                if (!this.nested)
                    this.nested = {};
                object.setOptions(prev.options, true);

            } else
                throw Error("duplicate name '" + object.name + "' in " + this);
        }
    }
    this.nested[object.name] = object;
    object.onAdd(this);
    return clearCache(this);
};

/**
 * Removes a nested object from this namespace.
 * @param {ReflectionObject} object Nested object to remove
 * @returns {Namespace} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If `object` is not a member of this namespace
 */
Namespace.prototype.remove = function remove(object) {

    if (!(object instanceof ReflectionObject))
        throw TypeError("object must be a ReflectionObject");
    if (object.parent !== this)
        throw Error(object + " is not a member of " + this);

    delete this.nested[object.name];
    if (!Object.keys(this.nested).length)
        this.nested = undefined;

    object.onRemove(this);
    return clearCache(this);
};

/**
 * Defines additial namespaces within this one if not yet existing.
 * @param {string|string[]} path Path to create
 * @param {*} [json] Nested types to create from JSON
 * @returns {Namespace} Pointer to the last namespace created or `this` if path is empty
 */
Namespace.prototype.define = function define(path, json) {

    if (util.isString(path))
        path = path.split(".");
    else if (!Array.isArray(path))
        throw TypeError("illegal path");
    if (path && path.length && path[0] === "")
        throw Error("path must be relative");

    var ptr = this;
    while (path.length > 0) {
        var part = path.shift();
        if (ptr.nested && ptr.nested[part]) {
            ptr = ptr.nested[part];
            if (!(ptr instanceof Namespace))
                throw Error("path conflicts with non-namespace objects");
        } else
            ptr.add(ptr = new Namespace(part));
    }
    if (json)
        ptr.addJSON(json);
    return ptr;
};

/**
 * Resolves this namespace's and all its nested objects' type references. Useful to validate a reflection tree, but comes at a cost.
 * @returns {Namespace} `this`
 */
Namespace.prototype.resolveAll = function resolveAll() {
    var nested = this.nestedArray, i = 0;
    while (i < nested.length)
        if (nested[i] instanceof Namespace)
            nested[i++].resolveAll();
        else
            nested[i++].resolve();
    return this.resolve();
};

/**
 * Recursively looks up the reflection object matching the specified path in the scope of this namespace.
 * @param {string|string[]} path Path to look up
 * @param {*|Array.<*>} filterTypes Filter types, any combination of the constructors of `protobuf.Type`, `protobuf.Enum`, `protobuf.Service` etc.
 * @param {boolean} [parentAlreadyChecked=false] If known, whether the parent has already been checked
 * @returns {ReflectionObject|null} Looked up object or `null` if none could be found
 */
Namespace.prototype.lookup = function lookup(path, filterTypes, parentAlreadyChecked) {

    /* istanbul ignore next */
    if (typeof filterTypes === "boolean") {
        parentAlreadyChecked = filterTypes;
        filterTypes = undefined;
    } else if (filterTypes && !Array.isArray(filterTypes))
        filterTypes = [ filterTypes ];

    if (util.isString(path) && path.length) {
        if (path === ".")
            return this.root;
        path = path.split(".");
    } else if (!path.length)
        return this;

    // Start at root if path is absolute
    if (path[0] === "")
        return this.root.lookup(path.slice(1), filterTypes);

    // Test if the first part matches any nested object, and if so, traverse if path contains more
    var found = this.get(path[0]);
    if (found) {
        if (path.length === 1) {
            if (!filterTypes || filterTypes.indexOf(found.constructor) > -1)
                return found;
        } else if (found instanceof Namespace && (found = found.lookup(path.slice(1), filterTypes, true)))
            return found;

    // Otherwise try each nested namespace
    } else
        for (var i = 0; i < this.nestedArray.length; ++i)
            if (this._nestedArray[i] instanceof Namespace && (found = this._nestedArray[i].lookup(path, filterTypes, true)))
                return found;

    // If there hasn't been a match, try again at the parent
    if (this.parent === null || parentAlreadyChecked)
        return null;
    return this.parent.lookup(path, filterTypes);
};

/**
 * Looks up the reflection object at the specified path, relative to this namespace.
 * @name NamespaceBase#lookup
 * @function
 * @param {string|string[]} path Path to look up
 * @param {boolean} [parentAlreadyChecked=false] Whether the parent has already been checked
 * @returns {ReflectionObject|null} Looked up object or `null` if none could be found
 * @variation 2
 */
// lookup(path: string, [parentAlreadyChecked: boolean])

/**
 * Looks up the {@link Type|type} at the specified path, relative to this namespace.
 * Besides its signature, this methods differs from {@link Namespace#lookup|lookup} in that it throws instead of returning `null`.
 * @param {string|string[]} path Path to look up
 * @returns {Type} Looked up type
 * @throws {Error} If `path` does not point to a type
 */
Namespace.prototype.lookupType = function lookupType(path) {
    var found = this.lookup(path, [ Type ]);
    if (!found)
        throw Error("no such type: " + path);
    return found;
};

/**
 * Looks up the values of the {@link Enum|enum} at the specified path, relative to this namespace.
 * Besides its signature, this methods differs from {@link Namespace#lookup|lookup} in that it throws instead of returning `null`.
 * @param {string|string[]} path Path to look up
 * @returns {Enum} Looked up enum
 * @throws {Error} If `path` does not point to an enum
 */
Namespace.prototype.lookupEnum = function lookupEnum(path) {
    var found = this.lookup(path, [ Enum ]);
    if (!found)
        throw Error("no such Enum '" + path + "' in " + this);
    return found;
};

/**
 * Looks up the {@link Type|type} or {@link Enum|enum} at the specified path, relative to this namespace.
 * Besides its signature, this methods differs from {@link Namespace#lookup|lookup} in that it throws instead of returning `null`.
 * @param {string|string[]} path Path to look up
 * @returns {Type} Looked up type or enum
 * @throws {Error} If `path` does not point to a type or enum
 */
Namespace.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path) {
    var found = this.lookup(path, [ Type, Enum ]);
    if (!found)
        throw Error("no such Type or Enum '" + path + "' in " + this);
    return found;
};

/**
 * Looks up the {@link Service|service} at the specified path, relative to this namespace.
 * Besides its signature, this methods differs from {@link Namespace#lookup|lookup} in that it throws instead of returning `null`.
 * @param {string|string[]} path Path to look up
 * @returns {Service} Looked up service
 * @throws {Error} If `path` does not point to a service
 */
Namespace.prototype.lookupService = function lookupService(path) {
    var found = this.lookup(path, [ Service ]);
    if (!found)
        throw Error("no such Service '" + path + "' in " + this);
    return found;
};

// Sets up cyclic dependencies (called in index-light)
Namespace._configure = function(Type_, Service_, Enum_) {
    Type    = Type_;
    Service = Service_;
    Enum    = Enum_;
};


/***/ }),

/***/ "./node_modules/protobufjs/src/object.js":
/*!***********************************************!*\
  !*** ./node_modules/protobufjs/src/object.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = ReflectionObject;

ReflectionObject.className = "ReflectionObject";

var util = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

var Root; // cyclic

/**
 * Constructs a new reflection object instance.
 * @classdesc Base class of all reflection objects.
 * @constructor
 * @param {string} name Object name
 * @param {Object.<string,*>} [options] Declared options
 * @abstract
 */
function ReflectionObject(name, options) {

    if (!util.isString(name))
        throw TypeError("name must be a string");

    if (options && !util.isObject(options))
        throw TypeError("options must be an object");

    /**
     * Options.
     * @type {Object.<string,*>|undefined}
     */
    this.options = options; // toJSON

    /**
     * Parsed Options.
     * @type {Array.<Object.<string,*>>|undefined}
     */
    this.parsedOptions = null;

    /**
     * Unique name within its namespace.
     * @type {string}
     */
    this.name = name;

    /**
     * Parent namespace.
     * @type {Namespace|null}
     */
    this.parent = null;

    /**
     * Whether already resolved or not.
     * @type {boolean}
     */
    this.resolved = false;

    /**
     * Comment text, if any.
     * @type {string|null}
     */
    this.comment = null;

    /**
     * Defining file name.
     * @type {string|null}
     */
    this.filename = null;
}

Object.defineProperties(ReflectionObject.prototype, {

    /**
     * Reference to the root namespace.
     * @name ReflectionObject#root
     * @type {Root}
     * @readonly
     */
    root: {
        get: function() {
            var ptr = this;
            while (ptr.parent !== null)
                ptr = ptr.parent;
            return ptr;
        }
    },

    /**
     * Full name including leading dot.
     * @name ReflectionObject#fullName
     * @type {string}
     * @readonly
     */
    fullName: {
        get: function() {
            var path = [ this.name ],
                ptr = this.parent;
            while (ptr) {
                path.unshift(ptr.name);
                ptr = ptr.parent;
            }
            return path.join(".");
        }
    }
});

/**
 * Converts this reflection object to its descriptor representation.
 * @returns {Object.<string,*>} Descriptor
 * @abstract
 */
ReflectionObject.prototype.toJSON = /* istanbul ignore next */ function toJSON() {
    throw Error(); // not implemented, shouldn't happen
};

/**
 * Called when this object is added to a parent.
 * @param {ReflectionObject} parent Parent added to
 * @returns {undefined}
 */
ReflectionObject.prototype.onAdd = function onAdd(parent) {
    if (this.parent && this.parent !== parent)
        this.parent.remove(this);
    this.parent = parent;
    this.resolved = false;
    var root = parent.root;
    if (root instanceof Root)
        root._handleAdd(this);
};

/**
 * Called when this object is removed from a parent.
 * @param {ReflectionObject} parent Parent removed from
 * @returns {undefined}
 */
ReflectionObject.prototype.onRemove = function onRemove(parent) {
    var root = parent.root;
    if (root instanceof Root)
        root._handleRemove(this);
    this.parent = null;
    this.resolved = false;
};

/**
 * Resolves this objects type references.
 * @returns {ReflectionObject} `this`
 */
ReflectionObject.prototype.resolve = function resolve() {
    if (this.resolved)
        return this;
    if (this.root instanceof Root)
        this.resolved = true; // only if part of a root
    return this;
};

/**
 * Gets an option value.
 * @param {string} name Option name
 * @returns {*} Option value or `undefined` if not set
 */
ReflectionObject.prototype.getOption = function getOption(name) {
    if (this.options)
        return this.options[name];
    return undefined;
};

/**
 * Sets an option.
 * @param {string} name Option name
 * @param {*} value Option value
 * @param {boolean} [ifNotSet] Sets the option only if it isn't currently set
 * @returns {ReflectionObject} `this`
 */
ReflectionObject.prototype.setOption = function setOption(name, value, ifNotSet) {
    if (!ifNotSet || !this.options || this.options[name] === undefined)
        (this.options || (this.options = {}))[name] = value;
    return this;
};

/**
 * Sets a parsed option.
 * @param {string} name parsed Option name
 * @param {*} value Option value
 * @param {string} propName dot '.' delimited full path of property within the option to set. if undefined\empty, will add a new option with that value
 * @returns {ReflectionObject} `this`
 */
ReflectionObject.prototype.setParsedOption = function setParsedOption(name, value, propName) {
    if (!this.parsedOptions) {
        this.parsedOptions = [];
    }
    var parsedOptions = this.parsedOptions;
    if (propName) {
        // If setting a sub property of an option then try to merge it
        // with an existing option
        var opt = parsedOptions.find(function (opt) {
            return Object.prototype.hasOwnProperty.call(opt, name);
        });
        if (opt) {
            // If we found an existing option - just merge the property value
            var newValue = opt[name];
            util.setProperty(newValue, propName, value);
        } else {
            // otherwise, create a new option, set it's property and add it to the list
            opt = {};
            opt[name] = util.setProperty({}, propName, value);
            parsedOptions.push(opt);
        }
    } else {
        // Always create a new option when setting the value of the option itself
        var newOpt = {};
        newOpt[name] = value;
        parsedOptions.push(newOpt);
    }
    return this;
};

/**
 * Sets multiple options.
 * @param {Object.<string,*>} options Options to set
 * @param {boolean} [ifNotSet] Sets an option only if it isn't currently set
 * @returns {ReflectionObject} `this`
 */
ReflectionObject.prototype.setOptions = function setOptions(options, ifNotSet) {
    if (options)
        for (var keys = Object.keys(options), i = 0; i < keys.length; ++i)
            this.setOption(keys[i], options[keys[i]], ifNotSet);
    return this;
};

/**
 * Converts this instance to its string representation.
 * @returns {string} Class name[, space, full name]
 */
ReflectionObject.prototype.toString = function toString() {
    var className = this.constructor.className,
        fullName  = this.fullName;
    if (fullName.length)
        return className + " " + fullName;
    return className;
};

// Sets up cyclic dependencies (called in index-light)
ReflectionObject._configure = function(Root_) {
    Root = Root_;
};


/***/ }),

/***/ "./node_modules/protobufjs/src/oneof.js":
/*!**********************************************!*\
  !*** ./node_modules/protobufjs/src/oneof.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = OneOf;

// extends ReflectionObject
var ReflectionObject = __webpack_require__(/*! ./object */ "./node_modules/protobufjs/src/object.js");
((OneOf.prototype = Object.create(ReflectionObject.prototype)).constructor = OneOf).className = "OneOf";

var Field = __webpack_require__(/*! ./field */ "./node_modules/protobufjs/src/field.js"),
    util  = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

/**
 * Constructs a new oneof instance.
 * @classdesc Reflected oneof.
 * @extends ReflectionObject
 * @constructor
 * @param {string} name Oneof name
 * @param {string[]|Object.<string,*>} [fieldNames] Field names
 * @param {Object.<string,*>} [options] Declared options
 * @param {string} [comment] Comment associated with this field
 */
function OneOf(name, fieldNames, options, comment) {
    if (!Array.isArray(fieldNames)) {
        options = fieldNames;
        fieldNames = undefined;
    }
    ReflectionObject.call(this, name, options);

    /* istanbul ignore if */
    if (!(fieldNames === undefined || Array.isArray(fieldNames)))
        throw TypeError("fieldNames must be an Array");

    /**
     * Field names that belong to this oneof.
     * @type {string[]}
     */
    this.oneof = fieldNames || []; // toJSON, marker

    /**
     * Fields that belong to this oneof as an array for iteration.
     * @type {Field[]}
     * @readonly
     */
    this.fieldsArray = []; // declared readonly for conformance, possibly not yet added to parent

    /**
     * Comment for this field.
     * @type {string|null}
     */
    this.comment = comment;
}

/**
 * Oneof descriptor.
 * @interface IOneOf
 * @property {Array.<string>} oneof Oneof field names
 * @property {Object.<string,*>} [options] Oneof options
 */

/**
 * Constructs a oneof from a oneof descriptor.
 * @param {string} name Oneof name
 * @param {IOneOf} json Oneof descriptor
 * @returns {OneOf} Created oneof
 * @throws {TypeError} If arguments are invalid
 */
OneOf.fromJSON = function fromJSON(name, json) {
    return new OneOf(name, json.oneof, json.options, json.comment);
};

/**
 * Converts this oneof to a oneof descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IOneOf} Oneof descriptor
 */
OneOf.prototype.toJSON = function toJSON(toJSONOptions) {
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "options" , this.options,
        "oneof"   , this.oneof,
        "comment" , keepComments ? this.comment : undefined
    ]);
};

/**
 * Adds the fields of the specified oneof to the parent if not already done so.
 * @param {OneOf} oneof The oneof
 * @returns {undefined}
 * @inner
 * @ignore
 */
function addFieldsToParent(oneof) {
    if (oneof.parent)
        for (var i = 0; i < oneof.fieldsArray.length; ++i)
            if (!oneof.fieldsArray[i].parent)
                oneof.parent.add(oneof.fieldsArray[i]);
}

/**
 * Adds a field to this oneof and removes it from its current parent, if any.
 * @param {Field} field Field to add
 * @returns {OneOf} `this`
 */
OneOf.prototype.add = function add(field) {

    /* istanbul ignore if */
    if (!(field instanceof Field))
        throw TypeError("field must be a Field");

    if (field.parent && field.parent !== this.parent)
        field.parent.remove(field);
    this.oneof.push(field.name);
    this.fieldsArray.push(field);
    field.partOf = this; // field.parent remains null
    addFieldsToParent(this);
    return this;
};

/**
 * Removes a field from this oneof and puts it back to the oneof's parent.
 * @param {Field} field Field to remove
 * @returns {OneOf} `this`
 */
OneOf.prototype.remove = function remove(field) {

    /* istanbul ignore if */
    if (!(field instanceof Field))
        throw TypeError("field must be a Field");

    var index = this.fieldsArray.indexOf(field);

    /* istanbul ignore if */
    if (index < 0)
        throw Error(field + " is not a member of " + this);

    this.fieldsArray.splice(index, 1);
    index = this.oneof.indexOf(field.name);

    /* istanbul ignore else */
    if (index > -1) // theoretical
        this.oneof.splice(index, 1);

    field.partOf = null;
    return this;
};

/**
 * @override
 */
OneOf.prototype.onAdd = function onAdd(parent) {
    ReflectionObject.prototype.onAdd.call(this, parent);
    var self = this;
    // Collect present fields
    for (var i = 0; i < this.oneof.length; ++i) {
        var field = parent.get(this.oneof[i]);
        if (field && !field.partOf) {
            field.partOf = self;
            self.fieldsArray.push(field);
        }
    }
    // Add not yet present fields
    addFieldsToParent(this);
};

/**
 * @override
 */
OneOf.prototype.onRemove = function onRemove(parent) {
    for (var i = 0, field; i < this.fieldsArray.length; ++i)
        if ((field = this.fieldsArray[i]).parent)
            field.parent.remove(field);
    ReflectionObject.prototype.onRemove.call(this, parent);
};

/**
 * Decorator function as returned by {@link OneOf.d} (TypeScript).
 * @typedef OneOfDecorator
 * @type {function}
 * @param {Object} prototype Target prototype
 * @param {string} oneofName OneOf name
 * @returns {undefined}
 */

/**
 * OneOf decorator (TypeScript).
 * @function
 * @param {...string} fieldNames Field names
 * @returns {OneOfDecorator} Decorator function
 * @template T extends string
 */
OneOf.d = function decorateOneOf() {
    var fieldNames = new Array(arguments.length),
        index = 0;
    while (index < arguments.length)
        fieldNames[index] = arguments[index++];
    return function oneOfDecorator(prototype, oneofName) {
        util.decorateType(prototype.constructor)
            .add(new OneOf(oneofName, fieldNames));
        Object.defineProperty(prototype, oneofName, {
            get: util.oneOfGetter(fieldNames),
            set: util.oneOfSetter(fieldNames)
        });
    };
};


/***/ }),

/***/ "./node_modules/protobufjs/src/reader.js":
/*!***********************************************!*\
  !*** ./node_modules/protobufjs/src/reader.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Reader;

var util      = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

var BufferReader; // cyclic

var LongBits  = util.LongBits,
    utf8      = util.utf8;

/* istanbul ignore next */
function indexOutOfRange(reader, writeLength) {
    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
}

/**
 * Constructs a new reader instance using the specified buffer.
 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 * @param {Uint8Array} buffer Buffer to read from
 */
function Reader(buffer) {

    /**
     * Read buffer.
     * @type {Uint8Array}
     */
    this.buf = buffer;

    /**
     * Read buffer position.
     * @type {number}
     */
    this.pos = 0;

    /**
     * Read buffer length.
     * @type {number}
     */
    this.len = buffer.length;
}

var create_array = typeof Uint8Array !== "undefined"
    ? function create_typed_array(buffer) {
        if (buffer instanceof Uint8Array || Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    }
    /* istanbul ignore next */
    : function create_array(buffer) {
        if (Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    };

var create = function create() {
    return util.Buffer
        ? function create_buffer_setup(buffer) {
            return (Reader.create = function create_buffer(buffer) {
                return util.Buffer.isBuffer(buffer)
                    ? new BufferReader(buffer)
                    /* istanbul ignore next */
                    : create_array(buffer);
            })(buffer);
        }
        /* istanbul ignore next */
        : create_array;
};

/**
 * Creates a new reader using the specified buffer.
 * @function
 * @param {Uint8Array|Buffer} buffer Buffer to read from
 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
 * @throws {Error} If `buffer` is not a valid buffer
 */
Reader.create = create();

Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;

/**
 * Reads a varint as an unsigned 32 bit value.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.uint32 = (function read_uint32_setup() {
    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
    return function read_uint32() {
        value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

        /* istanbul ignore if */
        if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
        }
        return value;
    };
})();

/**
 * Reads a varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
};

/**
 * Reads a zig-zag encoded varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
};

/* eslint-disable no-invalid-this */

function readLongVarint() {
    // tends to deopt with local vars for octet etc.
    var bits = new LongBits(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) { // fast route (lo)
        for (; i < 4; ++i) {
            // 1st..4th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 5th
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
        if (this.buf[this.pos++] < 128)
            return bits;
        i = 0;
    } else {
        for (; i < 3; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 1st..3th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 4th
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
    }
    if (this.len - this.pos > 4) { // fast route (hi)
        for (; i < 5; ++i) {
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    } else {
        for (; i < 5; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    }
    /* istanbul ignore next */
    throw Error("invalid varint encoding");
}

/* eslint-enable no-invalid-this */

/**
 * Reads a varint as a signed 64 bit value.
 * @name Reader#int64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as an unsigned 64 bit value.
 * @name Reader#uint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a zig-zag encoded varint as a signed 64 bit value.
 * @name Reader#sint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as a boolean.
 * @returns {boolean} Value read
 */
Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
};

function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
    return (buf[end - 4]
          | buf[end - 3] << 8
          | buf[end - 2] << 16
          | buf[end - 1] << 24) >>> 0;
}

/**
 * Reads fixed 32 bits as an unsigned 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.fixed32 = function read_fixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4);
};

/**
 * Reads fixed 32 bits as a signed 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.sfixed32 = function read_sfixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4) | 0;
};

/* eslint-disable no-invalid-this */

function readFixed64(/* this: Reader */) {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);

    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}

/* eslint-enable no-invalid-this */

/**
 * Reads fixed 64 bits.
 * @name Reader#fixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads zig-zag encoded fixed 64 bits.
 * @name Reader#sfixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a float (32 bit) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.float = function read_float() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
};

/**
 * Reads a double (64 bit float) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.double = function read_double() {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @returns {Uint8Array} Value read
 */
Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(),
        start  = this.pos,
        end    = this.pos + length;

    /* istanbul ignore if */
    if (end > this.len)
        throw indexOutOfRange(this, length);

    this.pos += length;
    if (Array.isArray(this.buf)) // plain array
        return this.buf.slice(start, end);
    return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
        ? new this.buf.constructor(0)
        : this._slice.call(this.buf, start, end);
};

/**
 * Reads a string preceeded by its byte length as a varint.
 * @returns {string} Value read
 */
Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8.read(bytes, 0, bytes.length);
};

/**
 * Skips the specified number of bytes if specified, otherwise skips a varint.
 * @param {number} [length] Length if known, otherwise a varint is assumed
 * @returns {Reader} `this`
 */
Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
        /* istanbul ignore if */
        if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
        this.pos += length;
    } else {
        do {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
    }
    return this;
};

/**
 * Skips the next element of the specified wire type.
 * @param {number} wireType Wire type received
 * @returns {Reader} `this`
 */
Reader.prototype.skipType = function(wireType) {
    switch (wireType) {
        case 0:
            this.skip();
            break;
        case 1:
            this.skip(8);
            break;
        case 2:
            this.skip(this.uint32());
            break;
        case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
                this.skipType(wireType);
            }
            break;
        case 5:
            this.skip(4);
            break;

        /* istanbul ignore next */
        default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
};

Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;
    Reader.create = create();
    BufferReader._configure();

    var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
    util.merge(Reader.prototype, {

        int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
        },

        uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
        },

        sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
        },

        fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
        },

        sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
        }

    });
};


/***/ }),

/***/ "./node_modules/protobufjs/src/reader_buffer.js":
/*!******************************************************!*\
  !*** ./node_modules/protobufjs/src/reader_buffer.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = BufferReader;

// extends Reader
var Reader = __webpack_require__(/*! ./reader */ "./node_modules/protobufjs/src/reader.js");
(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;

var util = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

/**
 * Constructs a new buffer reader instance.
 * @classdesc Wire format reader using node buffers.
 * @extends Reader
 * @constructor
 * @param {Buffer} buffer Buffer to read from
 */
function BufferReader(buffer) {
    Reader.call(this, buffer);

    /**
     * Read buffer.
     * @name BufferReader#buf
     * @type {Buffer}
     */
}

BufferReader._configure = function () {
    /* istanbul ignore else */
    if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
};


/**
 * @override
 */
BufferReader.prototype.string = function read_string_buffer() {
    var len = this.uint32(); // modifies pos
    return this.buf.utf8Slice
        ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len))
        : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @name BufferReader#bytes
 * @function
 * @returns {Buffer} Value read
 */

BufferReader._configure();


/***/ }),

/***/ "./node_modules/protobufjs/src/root.js":
/*!*********************************************!*\
  !*** ./node_modules/protobufjs/src/root.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Root;

// extends Namespace
var Namespace = __webpack_require__(/*! ./namespace */ "./node_modules/protobufjs/src/namespace.js");
((Root.prototype = Object.create(Namespace.prototype)).constructor = Root).className = "Root";

var Field   = __webpack_require__(/*! ./field */ "./node_modules/protobufjs/src/field.js"),
    Enum    = __webpack_require__(/*! ./enum */ "./node_modules/protobufjs/src/enum.js"),
    OneOf   = __webpack_require__(/*! ./oneof */ "./node_modules/protobufjs/src/oneof.js"),
    util    = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

var Type,   // cyclic
    parse,  // might be excluded
    common; // "

/**
 * Constructs a new root namespace instance.
 * @classdesc Root namespace wrapping all types, enums, services, sub-namespaces etc. that belong together.
 * @extends NamespaceBase
 * @constructor
 * @param {Object.<string,*>} [options] Top level options
 */
function Root(options) {
    Namespace.call(this, "", options);

    /**
     * Deferred extension fields.
     * @type {Field[]}
     */
    this.deferred = [];

    /**
     * Resolved file names of loaded files.
     * @type {string[]}
     */
    this.files = [];
}

/**
 * Loads a namespace descriptor into a root namespace.
 * @param {INamespace} json Nameespace descriptor
 * @param {Root} [root] Root namespace, defaults to create a new one if omitted
 * @returns {Root} Root namespace
 */
Root.fromJSON = function fromJSON(json, root) {
    if (!root)
        root = new Root();
    if (json.options)
        root.setOptions(json.options);
    return root.addJSON(json.nested);
};

/**
 * Resolves the path of an imported file, relative to the importing origin.
 * This method exists so you can override it with your own logic in case your imports are scattered over multiple directories.
 * @function
 * @param {string} origin The file name of the importing file
 * @param {string} target The file name being imported
 * @returns {string|null} Resolved path to `target` or `null` to skip the file
 */
Root.prototype.resolvePath = util.path.resolve;

/**
 * Fetch content from file path or url
 * This method exists so you can override it with your own logic.
 * @function
 * @param {string} path File path or url
 * @param {FetchCallback} callback Callback function
 * @returns {undefined}
 */
Root.prototype.fetch = util.fetch;

// A symbol-like function to safely signal synchronous loading
/* istanbul ignore next */
function SYNC() {} // eslint-disable-line no-empty-function

/**
 * Loads one or multiple .proto or preprocessed .json files into this root namespace and calls the callback.
 * @param {string|string[]} filename Names of one or multiple files to load
 * @param {IParseOptions} options Parse options
 * @param {LoadCallback} callback Callback function
 * @returns {undefined}
 */
Root.prototype.load = function load(filename, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    var self = this;
    if (!callback)
        return util.asPromise(load, self, filename, options);

    var sync = callback === SYNC; // undocumented

    // Finishes loading by calling the callback (exactly once)
    function finish(err, root) {
        /* istanbul ignore if */
        if (!callback)
            return;
        var cb = callback;
        callback = null;
        if (sync)
            throw err;
        cb(err, root);
    }

    // Bundled definition existence checking
    function getBundledFileName(filename) {
        var idx = filename.lastIndexOf("google/protobuf/");
        if (idx > -1) {
            var altname = filename.substring(idx);
            if (altname in common) return altname;
        }
        return null;
    }

    // Processes a single file
    function process(filename, source) {
        try {
            if (util.isString(source) && source.charAt(0) === "{")
                source = JSON.parse(source);
            if (!util.isString(source))
                self.setOptions(source.options).addJSON(source.nested);
            else {
                parse.filename = filename;
                var parsed = parse(source, self, options),
                    resolved,
                    i = 0;
                if (parsed.imports)
                    for (; i < parsed.imports.length; ++i)
                        if (resolved = getBundledFileName(parsed.imports[i]) || self.resolvePath(filename, parsed.imports[i]))
                            fetch(resolved);
                if (parsed.weakImports)
                    for (i = 0; i < parsed.weakImports.length; ++i)
                        if (resolved = getBundledFileName(parsed.weakImports[i]) || self.resolvePath(filename, parsed.weakImports[i]))
                            fetch(resolved, true);
            }
        } catch (err) {
            finish(err);
        }
        if (!sync && !queued)
            finish(null, self); // only once anyway
    }

    // Fetches a single file
    function fetch(filename, weak) {
        filename = getBundledFileName(filename) || filename;

        // Skip if already loaded / attempted
        if (self.files.indexOf(filename) > -1)
            return;
        self.files.push(filename);

        // Shortcut bundled definitions
        if (filename in common) {
            if (sync)
                process(filename, common[filename]);
            else {
                ++queued;
                setTimeout(function() {
                    --queued;
                    process(filename, common[filename]);
                });
            }
            return;
        }

        // Otherwise fetch from disk or network
        if (sync) {
            var source;
            try {
                source = util.fs.readFileSync(filename).toString("utf8");
            } catch (err) {
                if (!weak)
                    finish(err);
                return;
            }
            process(filename, source);
        } else {
            ++queued;
            self.fetch(filename, function(err, source) {
                --queued;
                /* istanbul ignore if */
                if (!callback)
                    return; // terminated meanwhile
                if (err) {
                    /* istanbul ignore else */
                    if (!weak)
                        finish(err);
                    else if (!queued) // can't be covered reliably
                        finish(null, self);
                    return;
                }
                process(filename, source);
            });
        }
    }
    var queued = 0;

    // Assembling the root namespace doesn't require working type
    // references anymore, so we can load everything in parallel
    if (util.isString(filename))
        filename = [ filename ];
    for (var i = 0, resolved; i < filename.length; ++i)
        if (resolved = self.resolvePath("", filename[i]))
            fetch(resolved);

    if (sync)
        return self;
    if (!queued)
        finish(null, self);
    return undefined;
};
// function load(filename:string, options:IParseOptions, callback:LoadCallback):undefined

/**
 * Loads one or multiple .proto or preprocessed .json files into this root namespace and calls the callback.
 * @function Root#load
 * @param {string|string[]} filename Names of one or multiple files to load
 * @param {LoadCallback} callback Callback function
 * @returns {undefined}
 * @variation 2
 */
// function load(filename:string, callback:LoadCallback):undefined

/**
 * Loads one or multiple .proto or preprocessed .json files into this root namespace and returns a promise.
 * @function Root#load
 * @param {string|string[]} filename Names of one or multiple files to load
 * @param {IParseOptions} [options] Parse options. Defaults to {@link parse.defaults} when omitted.
 * @returns {Promise<Root>} Promise
 * @variation 3
 */
// function load(filename:string, [options:IParseOptions]):Promise<Root>

/**
 * Synchronously loads one or multiple .proto or preprocessed .json files into this root namespace (node only).
 * @function Root#loadSync
 * @param {string|string[]} filename Names of one or multiple files to load
 * @param {IParseOptions} [options] Parse options. Defaults to {@link parse.defaults} when omitted.
 * @returns {Root} Root namespace
 * @throws {Error} If synchronous fetching is not supported (i.e. in browsers) or if a file's syntax is invalid
 */
Root.prototype.loadSync = function loadSync(filename, options) {
    if (!util.isNode)
        throw Error("not supported");
    return this.load(filename, options, SYNC);
};

/**
 * @override
 */
Root.prototype.resolveAll = function resolveAll() {
    if (this.deferred.length)
        throw Error("unresolvable extensions: " + this.deferred.map(function(field) {
            return "'extend " + field.extend + "' in " + field.parent.fullName;
        }).join(", "));
    return Namespace.prototype.resolveAll.call(this);
};

// only uppercased (and thus conflict-free) children are exposed, see below
var exposeRe = /^[A-Z]/;

/**
 * Handles a deferred declaring extension field by creating a sister field to represent it within its extended type.
 * @param {Root} root Root instance
 * @param {Field} field Declaring extension field witin the declaring type
 * @returns {boolean} `true` if successfully added to the extended type, `false` otherwise
 * @inner
 * @ignore
 */
function tryHandleExtension(root, field) {
    var extendedType = field.parent.lookup(field.extend);
    if (extendedType) {
        var sisterField = new Field(field.fullName, field.id, field.type, field.rule, undefined, field.options);
        //do not allow to extend same field twice to prevent the error
        if (extendedType.get(sisterField.name)) {
            return true;
        }
        sisterField.declaringField = field;
        field.extensionField = sisterField;
        extendedType.add(sisterField);
        return true;
    }
    return false;
}

/**
 * Called when any object is added to this root or its sub-namespaces.
 * @param {ReflectionObject} object Object added
 * @returns {undefined}
 * @private
 */
Root.prototype._handleAdd = function _handleAdd(object) {
    if (object instanceof Field) {

        if (/* an extension field (implies not part of a oneof) */ object.extend !== undefined && /* not already handled */ !object.extensionField)
            if (!tryHandleExtension(this, object))
                this.deferred.push(object);

    } else if (object instanceof Enum) {

        if (exposeRe.test(object.name))
            object.parent[object.name] = object.values; // expose enum values as property of its parent

    } else if (!(object instanceof OneOf)) /* everything else is a namespace */ {

        if (object instanceof Type) // Try to handle any deferred extensions
            for (var i = 0; i < this.deferred.length;)
                if (tryHandleExtension(this, this.deferred[i]))
                    this.deferred.splice(i, 1);
                else
                    ++i;
        for (var j = 0; j < /* initializes */ object.nestedArray.length; ++j) // recurse into the namespace
            this._handleAdd(object._nestedArray[j]);
        if (exposeRe.test(object.name))
            object.parent[object.name] = object; // expose namespace as property of its parent
    }

    // The above also adds uppercased (and thus conflict-free) nested types, services and enums as
    // properties of namespaces just like static code does. This allows using a .d.ts generated for
    // a static module with reflection-based solutions where the condition is met.
};

/**
 * Called when any object is removed from this root or its sub-namespaces.
 * @param {ReflectionObject} object Object removed
 * @returns {undefined}
 * @private
 */
Root.prototype._handleRemove = function _handleRemove(object) {
    if (object instanceof Field) {

        if (/* an extension field */ object.extend !== undefined) {
            if (/* already handled */ object.extensionField) { // remove its sister field
                object.extensionField.parent.remove(object.extensionField);
                object.extensionField = null;
            } else { // cancel the extension
                var index = this.deferred.indexOf(object);
                /* istanbul ignore else */
                if (index > -1)
                    this.deferred.splice(index, 1);
            }
        }

    } else if (object instanceof Enum) {

        if (exposeRe.test(object.name))
            delete object.parent[object.name]; // unexpose enum values

    } else if (object instanceof Namespace) {

        for (var i = 0; i < /* initializes */ object.nestedArray.length; ++i) // recurse into the namespace
            this._handleRemove(object._nestedArray[i]);

        if (exposeRe.test(object.name))
            delete object.parent[object.name]; // unexpose namespaces

    }
};

// Sets up cyclic dependencies (called in index-light)
Root._configure = function(Type_, parse_, common_) {
    Type   = Type_;
    parse  = parse_;
    common = common_;
};


/***/ }),

/***/ "./node_modules/protobufjs/src/roots.js":
/*!**********************************************!*\
  !*** ./node_modules/protobufjs/src/roots.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";

module.exports = {};

/**
 * Named roots.
 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
 * Can also be used manually to make roots available across modules.
 * @name roots
 * @type {Object.<string,Root>}
 * @example
 * // pbjs -r myroot -o compiled.js ...
 *
 * // in another module:
 * require("./compiled.js");
 *
 * // in any subsequent module:
 * var root = protobuf.roots["myroot"];
 */


/***/ }),

/***/ "./node_modules/protobufjs/src/rpc.js":
/*!********************************************!*\
  !*** ./node_modules/protobufjs/src/rpc.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


/**
 * Streaming RPC helpers.
 * @namespace
 */
var rpc = exports;

/**
 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
 * @typedef RPCImpl
 * @type {function}
 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
 * @param {Uint8Array} requestData Request data
 * @param {RPCImplCallback} callback Callback function
 * @returns {undefined}
 * @example
 * function rpcImpl(method, requestData, callback) {
 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
 *         throw Error("no such method");
 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
 *         callback(err, responseData);
 *     });
 * }
 */

/**
 * Node-style callback as used by {@link RPCImpl}.
 * @typedef RPCImplCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
 * @returns {undefined}
 */

rpc.Service = __webpack_require__(/*! ./rpc/service */ "./node_modules/protobufjs/src/rpc/service.js");


/***/ }),

/***/ "./node_modules/protobufjs/src/rpc/service.js":
/*!****************************************************!*\
  !*** ./node_modules/protobufjs/src/rpc/service.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Service;

var util = __webpack_require__(/*! ../util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

// Extends EventEmitter
(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;

/**
 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
 *
 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
 * @typedef rpc.ServiceMethodCallback
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {TRes} [response] Response message
 * @returns {undefined}
 */

/**
 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
 * @typedef rpc.ServiceMethod
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
 */

/**
 * Constructs a new RPC service instance.
 * @classdesc An RPC service as returned by {@link Service#create}.
 * @exports rpc.Service
 * @extends util.EventEmitter
 * @constructor
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 */
function Service(rpcImpl, requestDelimited, responseDelimited) {

    if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");

    util.EventEmitter.call(this);

    /**
     * RPC implementation. Becomes `null` once the service is ended.
     * @type {RPCImpl|null}
     */
    this.rpcImpl = rpcImpl;

    /**
     * Whether requests are length-delimited.
     * @type {boolean}
     */
    this.requestDelimited = Boolean(requestDelimited);

    /**
     * Whether responses are length-delimited.
     * @type {boolean}
     */
    this.responseDelimited = Boolean(responseDelimited);
}

/**
 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
 * @param {Constructor<TReq>} requestCtor Request constructor
 * @param {Constructor<TRes>} responseCtor Response constructor
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
 * @returns {undefined}
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 */
Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

    if (!request)
        throw TypeError("request must be specified");

    var self = this;
    if (!callback)
        return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

    if (!self.rpcImpl) {
        setTimeout(function() { callback(Error("already ended")); }, 0);
        return undefined;
    }

    try {
        return self.rpcImpl(
            method,
            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {

                if (err) {
                    self.emit("error", err, method);
                    return callback(err);
                }

                if (response === null) {
                    self.end(/* endedByRPC */ true);
                    return undefined;
                }

                if (!(response instanceof responseCtor)) {
                    try {
                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                    } catch (err) {
                        self.emit("error", err, method);
                        return callback(err);
                    }
                }

                self.emit("data", response, method);
                return callback(null, response);
            }
        );
    } catch (err) {
        self.emit("error", err, method);
        setTimeout(function() { callback(err); }, 0);
        return undefined;
    }
};

/**
 * Ends this service and emits the `end` event.
 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
 * @returns {rpc.Service} `this`
 */
Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
        if (!endedByRPC) // signal end to rpcImpl
            this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
    }
    return this;
};


/***/ }),

/***/ "./node_modules/protobufjs/src/service.js":
/*!************************************************!*\
  !*** ./node_modules/protobufjs/src/service.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Service;

// extends Namespace
var Namespace = __webpack_require__(/*! ./namespace */ "./node_modules/protobufjs/src/namespace.js");
((Service.prototype = Object.create(Namespace.prototype)).constructor = Service).className = "Service";

var Method = __webpack_require__(/*! ./method */ "./node_modules/protobufjs/src/method.js"),
    util   = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js"),
    rpc    = __webpack_require__(/*! ./rpc */ "./node_modules/protobufjs/src/rpc.js");

/**
 * Constructs a new service instance.
 * @classdesc Reflected service.
 * @extends NamespaceBase
 * @constructor
 * @param {string} name Service name
 * @param {Object.<string,*>} [options] Service options
 * @throws {TypeError} If arguments are invalid
 */
function Service(name, options) {
    Namespace.call(this, name, options);

    /**
     * Service methods.
     * @type {Object.<string,Method>}
     */
    this.methods = {}; // toJSON, marker

    /**
     * Cached methods as an array.
     * @type {Method[]|null}
     * @private
     */
    this._methodsArray = null;
}

/**
 * Service descriptor.
 * @interface IService
 * @extends INamespace
 * @property {Object.<string,IMethod>} methods Method descriptors
 */

/**
 * Constructs a service from a service descriptor.
 * @param {string} name Service name
 * @param {IService} json Service descriptor
 * @returns {Service} Created service
 * @throws {TypeError} If arguments are invalid
 */
Service.fromJSON = function fromJSON(name, json) {
    var service = new Service(name, json.options);
    /* istanbul ignore else */
    if (json.methods)
        for (var names = Object.keys(json.methods), i = 0; i < names.length; ++i)
            service.add(Method.fromJSON(names[i], json.methods[names[i]]));
    if (json.nested)
        service.addJSON(json.nested);
    service.comment = json.comment;
    return service;
};

/**
 * Converts this service to a service descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IService} Service descriptor
 */
Service.prototype.toJSON = function toJSON(toJSONOptions) {
    var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "options" , inherited && inherited.options || undefined,
        "methods" , Namespace.arrayToJSON(this.methodsArray, toJSONOptions) || /* istanbul ignore next */ {},
        "nested"  , inherited && inherited.nested || undefined,
        "comment" , keepComments ? this.comment : undefined
    ]);
};

/**
 * Methods of this service as an array for iteration.
 * @name Service#methodsArray
 * @type {Method[]}
 * @readonly
 */
Object.defineProperty(Service.prototype, "methodsArray", {
    get: function() {
        return this._methodsArray || (this._methodsArray = util.toArray(this.methods));
    }
});

function clearCache(service) {
    service._methodsArray = null;
    return service;
}

/**
 * @override
 */
Service.prototype.get = function get(name) {
    return this.methods[name]
        || Namespace.prototype.get.call(this, name);
};

/**
 * @override
 */
Service.prototype.resolveAll = function resolveAll() {
    var methods = this.methodsArray;
    for (var i = 0; i < methods.length; ++i)
        methods[i].resolve();
    return Namespace.prototype.resolve.call(this);
};

/**
 * @override
 */
Service.prototype.add = function add(object) {

    /* istanbul ignore if */
    if (this.get(object.name))
        throw Error("duplicate name '" + object.name + "' in " + this);

    if (object instanceof Method) {
        this.methods[object.name] = object;
        object.parent = this;
        return clearCache(this);
    }
    return Namespace.prototype.add.call(this, object);
};

/**
 * @override
 */
Service.prototype.remove = function remove(object) {
    if (object instanceof Method) {

        /* istanbul ignore if */
        if (this.methods[object.name] !== object)
            throw Error(object + " is not a member of " + this);

        delete this.methods[object.name];
        object.parent = null;
        return clearCache(this);
    }
    return Namespace.prototype.remove.call(this, object);
};

/**
 * Creates a runtime service using the specified rpc implementation.
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 * @returns {rpc.Service} RPC service. Useful where requests and/or responses are streamed.
 */
Service.prototype.create = function create(rpcImpl, requestDelimited, responseDelimited) {
    var rpcService = new rpc.Service(rpcImpl, requestDelimited, responseDelimited);
    for (var i = 0, method; i < /* initializes */ this.methodsArray.length; ++i) {
        var methodName = util.lcFirst((method = this._methodsArray[i]).resolve().name).replace(/[^$\w_]/g, "");
        rpcService[methodName] = util.codegen(["r","c"], util.isReserved(methodName) ? methodName + "_" : methodName)("return this.rpcCall(m,q,s,r,c)")({
            m: method,
            q: method.resolvedRequestType.ctor,
            s: method.resolvedResponseType.ctor
        });
    }
    return rpcService;
};


/***/ }),

/***/ "./node_modules/protobufjs/src/type.js":
/*!*********************************************!*\
  !*** ./node_modules/protobufjs/src/type.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Type;

// extends Namespace
var Namespace = __webpack_require__(/*! ./namespace */ "./node_modules/protobufjs/src/namespace.js");
((Type.prototype = Object.create(Namespace.prototype)).constructor = Type).className = "Type";

var Enum      = __webpack_require__(/*! ./enum */ "./node_modules/protobufjs/src/enum.js"),
    OneOf     = __webpack_require__(/*! ./oneof */ "./node_modules/protobufjs/src/oneof.js"),
    Field     = __webpack_require__(/*! ./field */ "./node_modules/protobufjs/src/field.js"),
    MapField  = __webpack_require__(/*! ./mapfield */ "./node_modules/protobufjs/src/mapfield.js"),
    Service   = __webpack_require__(/*! ./service */ "./node_modules/protobufjs/src/service.js"),
    Message   = __webpack_require__(/*! ./message */ "./node_modules/protobufjs/src/message.js"),
    Reader    = __webpack_require__(/*! ./reader */ "./node_modules/protobufjs/src/reader.js"),
    Writer    = __webpack_require__(/*! ./writer */ "./node_modules/protobufjs/src/writer.js"),
    util      = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js"),
    encoder   = __webpack_require__(/*! ./encoder */ "./node_modules/protobufjs/src/encoder.js"),
    decoder   = __webpack_require__(/*! ./decoder */ "./node_modules/protobufjs/src/decoder.js"),
    verifier  = __webpack_require__(/*! ./verifier */ "./node_modules/protobufjs/src/verifier.js"),
    converter = __webpack_require__(/*! ./converter */ "./node_modules/protobufjs/src/converter.js"),
    wrappers  = __webpack_require__(/*! ./wrappers */ "./node_modules/protobufjs/src/wrappers.js");

/**
 * Constructs a new reflected message type instance.
 * @classdesc Reflected message type.
 * @extends NamespaceBase
 * @constructor
 * @param {string} name Message name
 * @param {Object.<string,*>} [options] Declared options
 */
function Type(name, options) {
    Namespace.call(this, name, options);

    /**
     * Message fields.
     * @type {Object.<string,Field>}
     */
    this.fields = {};  // toJSON, marker

    /**
     * Oneofs declared within this namespace, if any.
     * @type {Object.<string,OneOf>}
     */
    this.oneofs = undefined; // toJSON

    /**
     * Extension ranges, if any.
     * @type {number[][]}
     */
    this.extensions = undefined; // toJSON

    /**
     * Reserved ranges, if any.
     * @type {Array.<number[]|string>}
     */
    this.reserved = undefined; // toJSON

    /*?
     * Whether this type is a legacy group.
     * @type {boolean|undefined}
     */
    this.group = undefined; // toJSON

    /**
     * Cached fields by id.
     * @type {Object.<number,Field>|null}
     * @private
     */
    this._fieldsById = null;

    /**
     * Cached fields as an array.
     * @type {Field[]|null}
     * @private
     */
    this._fieldsArray = null;

    /**
     * Cached oneofs as an array.
     * @type {OneOf[]|null}
     * @private
     */
    this._oneofsArray = null;

    /**
     * Cached constructor.
     * @type {Constructor<{}>}
     * @private
     */
    this._ctor = null;
}

Object.defineProperties(Type.prototype, {

    /**
     * Message fields by id.
     * @name Type#fieldsById
     * @type {Object.<number,Field>}
     * @readonly
     */
    fieldsById: {
        get: function() {

            /* istanbul ignore if */
            if (this._fieldsById)
                return this._fieldsById;

            this._fieldsById = {};
            for (var names = Object.keys(this.fields), i = 0; i < names.length; ++i) {
                var field = this.fields[names[i]],
                    id = field.id;

                /* istanbul ignore if */
                if (this._fieldsById[id])
                    throw Error("duplicate id " + id + " in " + this);

                this._fieldsById[id] = field;
            }
            return this._fieldsById;
        }
    },

    /**
     * Fields of this message as an array for iteration.
     * @name Type#fieldsArray
     * @type {Field[]}
     * @readonly
     */
    fieldsArray: {
        get: function() {
            return this._fieldsArray || (this._fieldsArray = util.toArray(this.fields));
        }
    },

    /**
     * Oneofs of this message as an array for iteration.
     * @name Type#oneofsArray
     * @type {OneOf[]}
     * @readonly
     */
    oneofsArray: {
        get: function() {
            return this._oneofsArray || (this._oneofsArray = util.toArray(this.oneofs));
        }
    },

    /**
     * The registered constructor, if any registered, otherwise a generic constructor.
     * Assigning a function replaces the internal constructor. If the function does not extend {@link Message} yet, its prototype will be setup accordingly and static methods will be populated. If it already extends {@link Message}, it will just replace the internal constructor.
     * @name Type#ctor
     * @type {Constructor<{}>}
     */
    ctor: {
        get: function() {
            return this._ctor || (this.ctor = Type.generateConstructor(this)());
        },
        set: function(ctor) {

            // Ensure proper prototype
            var prototype = ctor.prototype;
            if (!(prototype instanceof Message)) {
                (ctor.prototype = new Message()).constructor = ctor;
                util.merge(ctor.prototype, prototype);
            }

            // Classes and messages reference their reflected type
            ctor.$type = ctor.prototype.$type = this;

            // Mix in static methods
            util.merge(ctor, Message, true);

            this._ctor = ctor;

            // Messages have non-enumerable default values on their prototype
            var i = 0;
            for (; i < /* initializes */ this.fieldsArray.length; ++i)
                this._fieldsArray[i].resolve(); // ensures a proper value

            // Messages have non-enumerable getters and setters for each virtual oneof field
            var ctorProperties = {};
            for (i = 0; i < /* initializes */ this.oneofsArray.length; ++i)
                ctorProperties[this._oneofsArray[i].resolve().name] = {
                    get: util.oneOfGetter(this._oneofsArray[i].oneof),
                    set: util.oneOfSetter(this._oneofsArray[i].oneof)
                };
            if (i)
                Object.defineProperties(ctor.prototype, ctorProperties);
        }
    }
});

/**
 * Generates a constructor function for the specified type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
Type.generateConstructor = function generateConstructor(mtype) {
    /* eslint-disable no-unexpected-multiline */
    var gen = util.codegen(["p"], mtype.name);
    // explicitly initialize mutable object/array fields so that these aren't just inherited from the prototype
    for (var i = 0, field; i < mtype.fieldsArray.length; ++i)
        if ((field = mtype._fieldsArray[i]).map) gen
            ("this%s={}", util.safeProp(field.name));
        else if (field.repeated) gen
            ("this%s=[]", util.safeProp(field.name));
    return gen
    ("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)") // omit undefined or null
        ("this[ks[i]]=p[ks[i]]");
    /* eslint-enable no-unexpected-multiline */
};

function clearCache(type) {
    type._fieldsById = type._fieldsArray = type._oneofsArray = null;
    delete type.encode;
    delete type.decode;
    delete type.verify;
    return type;
}

/**
 * Message type descriptor.
 * @interface IType
 * @extends INamespace
 * @property {Object.<string,IOneOf>} [oneofs] Oneof descriptors
 * @property {Object.<string,IField>} fields Field descriptors
 * @property {number[][]} [extensions] Extension ranges
 * @property {number[][]} [reserved] Reserved ranges
 * @property {boolean} [group=false] Whether a legacy group or not
 */

/**
 * Creates a message type from a message type descriptor.
 * @param {string} name Message name
 * @param {IType} json Message type descriptor
 * @returns {Type} Created message type
 */
Type.fromJSON = function fromJSON(name, json) {
    var type = new Type(name, json.options);
    type.extensions = json.extensions;
    type.reserved = json.reserved;
    var names = Object.keys(json.fields),
        i = 0;
    for (; i < names.length; ++i)
        type.add(
            ( typeof json.fields[names[i]].keyType !== "undefined"
            ? MapField.fromJSON
            : Field.fromJSON )(names[i], json.fields[names[i]])
        );
    if (json.oneofs)
        for (names = Object.keys(json.oneofs), i = 0; i < names.length; ++i)
            type.add(OneOf.fromJSON(names[i], json.oneofs[names[i]]));
    if (json.nested)
        for (names = Object.keys(json.nested), i = 0; i < names.length; ++i) {
            var nested = json.nested[names[i]];
            type.add( // most to least likely
                ( nested.id !== undefined
                ? Field.fromJSON
                : nested.fields !== undefined
                ? Type.fromJSON
                : nested.values !== undefined
                ? Enum.fromJSON
                : nested.methods !== undefined
                ? Service.fromJSON
                : Namespace.fromJSON )(names[i], nested)
            );
        }
    if (json.extensions && json.extensions.length)
        type.extensions = json.extensions;
    if (json.reserved && json.reserved.length)
        type.reserved = json.reserved;
    if (json.group)
        type.group = true;
    if (json.comment)
        type.comment = json.comment;
    return type;
};

/**
 * Converts this message type to a message type descriptor.
 * @param {IToJSONOptions} [toJSONOptions] JSON conversion options
 * @returns {IType} Message type descriptor
 */
Type.prototype.toJSON = function toJSON(toJSONOptions) {
    var inherited = Namespace.prototype.toJSON.call(this, toJSONOptions);
    var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
    return util.toObject([
        "options"    , inherited && inherited.options || undefined,
        "oneofs"     , Namespace.arrayToJSON(this.oneofsArray, toJSONOptions),
        "fields"     , Namespace.arrayToJSON(this.fieldsArray.filter(function(obj) { return !obj.declaringField; }), toJSONOptions) || {},
        "extensions" , this.extensions && this.extensions.length ? this.extensions : undefined,
        "reserved"   , this.reserved && this.reserved.length ? this.reserved : undefined,
        "group"      , this.group || undefined,
        "nested"     , inherited && inherited.nested || undefined,
        "comment"    , keepComments ? this.comment : undefined
    ]);
};

/**
 * @override
 */
Type.prototype.resolveAll = function resolveAll() {
    var fields = this.fieldsArray, i = 0;
    while (i < fields.length)
        fields[i++].resolve();
    var oneofs = this.oneofsArray; i = 0;
    while (i < oneofs.length)
        oneofs[i++].resolve();
    return Namespace.prototype.resolveAll.call(this);
};

/**
 * @override
 */
Type.prototype.get = function get(name) {
    return this.fields[name]
        || this.oneofs && this.oneofs[name]
        || this.nested && this.nested[name]
        || null;
};

/**
 * Adds a nested object to this type.
 * @param {ReflectionObject} object Nested object to add
 * @returns {Type} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If there is already a nested object with this name or, if a field, when there is already a field with this id
 */
Type.prototype.add = function add(object) {

    if (this.get(object.name))
        throw Error("duplicate name '" + object.name + "' in " + this);

    if (object instanceof Field && object.extend === undefined) {
        // NOTE: Extension fields aren't actual fields on the declaring type, but nested objects.
        // The root object takes care of adding distinct sister-fields to the respective extended
        // type instead.

        // avoids calling the getter if not absolutely necessary because it's called quite frequently
        if (this._fieldsById ? /* istanbul ignore next */ this._fieldsById[object.id] : this.fieldsById[object.id])
            throw Error("duplicate id " + object.id + " in " + this);
        if (this.isReservedId(object.id))
            throw Error("id " + object.id + " is reserved in " + this);
        if (this.isReservedName(object.name))
            throw Error("name '" + object.name + "' is reserved in " + this);

        if (object.parent)
            object.parent.remove(object);
        this.fields[object.name] = object;
        object.message = this;
        object.onAdd(this);
        return clearCache(this);
    }
    if (object instanceof OneOf) {
        if (!this.oneofs)
            this.oneofs = {};
        this.oneofs[object.name] = object;
        object.onAdd(this);
        return clearCache(this);
    }
    return Namespace.prototype.add.call(this, object);
};

/**
 * Removes a nested object from this type.
 * @param {ReflectionObject} object Nested object to remove
 * @returns {Type} `this`
 * @throws {TypeError} If arguments are invalid
 * @throws {Error} If `object` is not a member of this type
 */
Type.prototype.remove = function remove(object) {
    if (object instanceof Field && object.extend === undefined) {
        // See Type#add for the reason why extension fields are excluded here.

        /* istanbul ignore if */
        if (!this.fields || this.fields[object.name] !== object)
            throw Error(object + " is not a member of " + this);

        delete this.fields[object.name];
        object.parent = null;
        object.onRemove(this);
        return clearCache(this);
    }
    if (object instanceof OneOf) {

        /* istanbul ignore if */
        if (!this.oneofs || this.oneofs[object.name] !== object)
            throw Error(object + " is not a member of " + this);

        delete this.oneofs[object.name];
        object.parent = null;
        object.onRemove(this);
        return clearCache(this);
    }
    return Namespace.prototype.remove.call(this, object);
};

/**
 * Tests if the specified id is reserved.
 * @param {number} id Id to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Type.prototype.isReservedId = function isReservedId(id) {
    return Namespace.isReservedId(this.reserved, id);
};

/**
 * Tests if the specified name is reserved.
 * @param {string} name Name to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
Type.prototype.isReservedName = function isReservedName(name) {
    return Namespace.isReservedName(this.reserved, name);
};

/**
 * Creates a new message of this type using the specified properties.
 * @param {Object.<string,*>} [properties] Properties to set
 * @returns {Message<{}>} Message instance
 */
Type.prototype.create = function create(properties) {
    return new this.ctor(properties);
};

/**
 * Sets up {@link Type#encode|encode}, {@link Type#decode|decode} and {@link Type#verify|verify}.
 * @returns {Type} `this`
 */
Type.prototype.setup = function setup() {
    // Sets up everything at once so that the prototype chain does not have to be re-evaluated
    // multiple times (V8, soft-deopt prototype-check).

    var fullName = this.fullName,
        types    = [];
    for (var i = 0; i < /* initializes */ this.fieldsArray.length; ++i)
        types.push(this._fieldsArray[i].resolve().resolvedType);

    // Replace setup methods with type-specific generated functions
    this.encode = encoder(this)({
        Writer : Writer,
        types  : types,
        util   : util
    });
    this.decode = decoder(this)({
        Reader : Reader,
        types  : types,
        util   : util
    });
    this.verify = verifier(this)({
        types : types,
        util  : util
    });
    this.fromObject = converter.fromObject(this)({
        types : types,
        util  : util
    });
    this.toObject = converter.toObject(this)({
        types : types,
        util  : util
    });

    // Inject custom wrappers for common types
    var wrapper = wrappers[fullName];
    if (wrapper) {
        var originalThis = Object.create(this);
        // if (wrapper.fromObject) {
            originalThis.fromObject = this.fromObject;
            this.fromObject = wrapper.fromObject.bind(originalThis);
        // }
        // if (wrapper.toObject) {
            originalThis.toObject = this.toObject;
            this.toObject = wrapper.toObject.bind(originalThis);
        // }
    }

    return this;
};

/**
 * Encodes a message of this type. Does not implicitly {@link Type#verify|verify} messages.
 * @param {Message<{}>|Object.<string,*>} message Message instance or plain object
 * @param {Writer} [writer] Writer to encode to
 * @returns {Writer} writer
 */
Type.prototype.encode = function encode_setup(message, writer) {
    return this.setup().encode(message, writer); // overrides this method
};

/**
 * Encodes a message of this type preceeded by its byte length as a varint. Does not implicitly {@link Type#verify|verify} messages.
 * @param {Message<{}>|Object.<string,*>} message Message instance or plain object
 * @param {Writer} [writer] Writer to encode to
 * @returns {Writer} writer
 */
Type.prototype.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
};

/**
 * Decodes a message of this type.
 * @param {Reader|Uint8Array} reader Reader or buffer to decode from
 * @param {number} [length] Length of the message, if known beforehand
 * @returns {Message<{}>} Decoded message
 * @throws {Error} If the payload is not a reader or valid buffer
 * @throws {util.ProtocolError<{}>} If required fields are missing
 */
Type.prototype.decode = function decode_setup(reader, length) {
    return this.setup().decode(reader, length); // overrides this method
};

/**
 * Decodes a message of this type preceeded by its byte length as a varint.
 * @param {Reader|Uint8Array} reader Reader or buffer to decode from
 * @returns {Message<{}>} Decoded message
 * @throws {Error} If the payload is not a reader or valid buffer
 * @throws {util.ProtocolError} If required fields are missing
 */
Type.prototype.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof Reader))
        reader = Reader.create(reader);
    return this.decode(reader, reader.uint32());
};

/**
 * Verifies that field values are valid and that required fields are present.
 * @param {Object.<string,*>} message Plain object to verify
 * @returns {null|string} `null` if valid, otherwise the reason why it is not
 */
Type.prototype.verify = function verify_setup(message) {
    return this.setup().verify(message); // overrides this method
};

/**
 * Creates a new message of this type from a plain object. Also converts values to their respective internal types.
 * @param {Object.<string,*>} object Plain object to convert
 * @returns {Message<{}>} Message instance
 */
Type.prototype.fromObject = function fromObject(object) {
    return this.setup().fromObject(object);
};

/**
 * Conversion options as used by {@link Type#toObject} and {@link Message.toObject}.
 * @interface IConversionOptions
 * @property {Function} [longs] Long conversion type.
 * Valid values are `String` and `Number` (the global types).
 * Defaults to copy the present value, which is a possibly unsafe number without and a {@link Long} with a long library.
 * @property {Function} [enums] Enum value conversion type.
 * Only valid value is `String` (the global type).
 * Defaults to copy the present value, which is the numeric id.
 * @property {Function} [bytes] Bytes value conversion type.
 * Valid values are `Array` and (a base64 encoded) `String` (the global types).
 * Defaults to copy the present value, which usually is a Buffer under node and an Uint8Array in the browser.
 * @property {boolean} [defaults=false] Also sets default values on the resulting object
 * @property {boolean} [arrays=false] Sets empty arrays for missing repeated fields even if `defaults=false`
 * @property {boolean} [objects=false] Sets empty objects for missing map fields even if `defaults=false`
 * @property {boolean} [oneofs=false] Includes virtual oneof properties set to the present field's name, if any
 * @property {boolean} [json=false] Performs additional JSON compatibility conversions, i.e. NaN and Infinity to strings
 */

/**
 * Creates a plain object from a message of this type. Also converts values to other types if specified.
 * @param {Message<{}>} message Message instance
 * @param {IConversionOptions} [options] Conversion options
 * @returns {Object.<string,*>} Plain object
 */
Type.prototype.toObject = function toObject(message, options) {
    return this.setup().toObject(message, options);
};

/**
 * Decorator function as returned by {@link Type.d} (TypeScript).
 * @typedef TypeDecorator
 * @type {function}
 * @param {Constructor<T>} target Target constructor
 * @returns {undefined}
 * @template T extends Message<T>
 */

/**
 * Type decorator (TypeScript).
 * @param {string} [typeName] Type name, defaults to the constructor's name
 * @returns {TypeDecorator<T>} Decorator function
 * @template T extends Message<T>
 */
Type.d = function decorateType(typeName) {
    return function typeDecorator(target) {
        util.decorateType(target, typeName);
    };
};


/***/ }),

/***/ "./node_modules/protobufjs/src/types.js":
/*!**********************************************!*\
  !*** ./node_modules/protobufjs/src/types.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


/**
 * Common type constants.
 * @namespace
 */
var types = exports;

var util = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

var s = [
    "double",   // 0
    "float",    // 1
    "int32",    // 2
    "uint32",   // 3
    "sint32",   // 4
    "fixed32",  // 5
    "sfixed32", // 6
    "int64",    // 7
    "uint64",   // 8
    "sint64",   // 9
    "fixed64",  // 10
    "sfixed64", // 11
    "bool",     // 12
    "string",   // 13
    "bytes"     // 14
];

function bake(values, offset) {
    var i = 0, o = {};
    offset |= 0;
    while (i < values.length) o[s[i + offset]] = values[i++];
    return o;
}

/**
 * Basic type wire types.
 * @type {Object.<string,number>}
 * @const
 * @property {number} double=1 Fixed64 wire type
 * @property {number} float=5 Fixed32 wire type
 * @property {number} int32=0 Varint wire type
 * @property {number} uint32=0 Varint wire type
 * @property {number} sint32=0 Varint wire type
 * @property {number} fixed32=5 Fixed32 wire type
 * @property {number} sfixed32=5 Fixed32 wire type
 * @property {number} int64=0 Varint wire type
 * @property {number} uint64=0 Varint wire type
 * @property {number} sint64=0 Varint wire type
 * @property {number} fixed64=1 Fixed64 wire type
 * @property {number} sfixed64=1 Fixed64 wire type
 * @property {number} bool=0 Varint wire type
 * @property {number} string=2 Ldelim wire type
 * @property {number} bytes=2 Ldelim wire type
 */
types.basic = bake([
    /* double   */ 1,
    /* float    */ 5,
    /* int32    */ 0,
    /* uint32   */ 0,
    /* sint32   */ 0,
    /* fixed32  */ 5,
    /* sfixed32 */ 5,
    /* int64    */ 0,
    /* uint64   */ 0,
    /* sint64   */ 0,
    /* fixed64  */ 1,
    /* sfixed64 */ 1,
    /* bool     */ 0,
    /* string   */ 2,
    /* bytes    */ 2
]);

/**
 * Basic type defaults.
 * @type {Object.<string,*>}
 * @const
 * @property {number} double=0 Double default
 * @property {number} float=0 Float default
 * @property {number} int32=0 Int32 default
 * @property {number} uint32=0 Uint32 default
 * @property {number} sint32=0 Sint32 default
 * @property {number} fixed32=0 Fixed32 default
 * @property {number} sfixed32=0 Sfixed32 default
 * @property {number} int64=0 Int64 default
 * @property {number} uint64=0 Uint64 default
 * @property {number} sint64=0 Sint32 default
 * @property {number} fixed64=0 Fixed64 default
 * @property {number} sfixed64=0 Sfixed64 default
 * @property {boolean} bool=false Bool default
 * @property {string} string="" String default
 * @property {Array.<number>} bytes=Array(0) Bytes default
 * @property {null} message=null Message default
 */
types.defaults = bake([
    /* double   */ 0,
    /* float    */ 0,
    /* int32    */ 0,
    /* uint32   */ 0,
    /* sint32   */ 0,
    /* fixed32  */ 0,
    /* sfixed32 */ 0,
    /* int64    */ 0,
    /* uint64   */ 0,
    /* sint64   */ 0,
    /* fixed64  */ 0,
    /* sfixed64 */ 0,
    /* bool     */ false,
    /* string   */ "",
    /* bytes    */ util.emptyArray,
    /* message  */ null
]);

/**
 * Basic long type wire types.
 * @type {Object.<string,number>}
 * @const
 * @property {number} int64=0 Varint wire type
 * @property {number} uint64=0 Varint wire type
 * @property {number} sint64=0 Varint wire type
 * @property {number} fixed64=1 Fixed64 wire type
 * @property {number} sfixed64=1 Fixed64 wire type
 */
types.long = bake([
    /* int64    */ 0,
    /* uint64   */ 0,
    /* sint64   */ 0,
    /* fixed64  */ 1,
    /* sfixed64 */ 1
], 7);

/**
 * Allowed types for map keys with their associated wire type.
 * @type {Object.<string,number>}
 * @const
 * @property {number} int32=0 Varint wire type
 * @property {number} uint32=0 Varint wire type
 * @property {number} sint32=0 Varint wire type
 * @property {number} fixed32=5 Fixed32 wire type
 * @property {number} sfixed32=5 Fixed32 wire type
 * @property {number} int64=0 Varint wire type
 * @property {number} uint64=0 Varint wire type
 * @property {number} sint64=0 Varint wire type
 * @property {number} fixed64=1 Fixed64 wire type
 * @property {number} sfixed64=1 Fixed64 wire type
 * @property {number} bool=0 Varint wire type
 * @property {number} string=2 Ldelim wire type
 */
types.mapKey = bake([
    /* int32    */ 0,
    /* uint32   */ 0,
    /* sint32   */ 0,
    /* fixed32  */ 5,
    /* sfixed32 */ 5,
    /* int64    */ 0,
    /* uint64   */ 0,
    /* sint64   */ 0,
    /* fixed64  */ 1,
    /* sfixed64 */ 1,
    /* bool     */ 0,
    /* string   */ 2
], 2);

/**
 * Allowed types for packed repeated fields with their associated wire type.
 * @type {Object.<string,number>}
 * @const
 * @property {number} double=1 Fixed64 wire type
 * @property {number} float=5 Fixed32 wire type
 * @property {number} int32=0 Varint wire type
 * @property {number} uint32=0 Varint wire type
 * @property {number} sint32=0 Varint wire type
 * @property {number} fixed32=5 Fixed32 wire type
 * @property {number} sfixed32=5 Fixed32 wire type
 * @property {number} int64=0 Varint wire type
 * @property {number} uint64=0 Varint wire type
 * @property {number} sint64=0 Varint wire type
 * @property {number} fixed64=1 Fixed64 wire type
 * @property {number} sfixed64=1 Fixed64 wire type
 * @property {number} bool=0 Varint wire type
 */
types.packed = bake([
    /* double   */ 1,
    /* float    */ 5,
    /* int32    */ 0,
    /* uint32   */ 0,
    /* sint32   */ 0,
    /* fixed32  */ 5,
    /* sfixed32 */ 5,
    /* int64    */ 0,
    /* uint64   */ 0,
    /* sint64   */ 0,
    /* fixed64  */ 1,
    /* sfixed64 */ 1,
    /* bool     */ 0
]);


/***/ }),

/***/ "./node_modules/protobufjs/src/util.js":
/*!*********************************************!*\
  !*** ./node_modules/protobufjs/src/util.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Various utility functions.
 * @namespace
 */
var util = module.exports = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

var roots = __webpack_require__(/*! ./roots */ "./node_modules/protobufjs/src/roots.js");

var Type, // cyclic
    Enum;

util.codegen = __webpack_require__(/*! @protobufjs/codegen */ "./node_modules/@protobufjs/codegen/index.js");
util.fetch   = __webpack_require__(/*! @protobufjs/fetch */ "./node_modules/@protobufjs/fetch/index.js");
util.path    = __webpack_require__(/*! @protobufjs/path */ "./node_modules/@protobufjs/path/index.js");

/**
 * Node's fs module if available.
 * @type {Object.<string,*>}
 */
util.fs = util.inquire("fs");

/**
 * Converts an object's values to an array.
 * @param {Object.<string,*>} object Object to convert
 * @returns {Array.<*>} Converted array
 */
util.toArray = function toArray(object) {
    if (object) {
        var keys  = Object.keys(object),
            array = new Array(keys.length),
            index = 0;
        while (index < keys.length)
            array[index] = object[keys[index++]];
        return array;
    }
    return [];
};

/**
 * Converts an array of keys immediately followed by their respective value to an object, omitting undefined values.
 * @param {Array.<*>} array Array to convert
 * @returns {Object.<string,*>} Converted object
 */
util.toObject = function toObject(array) {
    var object = {},
        index  = 0;
    while (index < array.length) {
        var key = array[index++],
            val = array[index++];
        if (val !== undefined)
            object[key] = val;
    }
    return object;
};

var safePropBackslashRe = /\\/g,
    safePropQuoteRe     = /"/g;

/**
 * Tests whether the specified name is a reserved word in JS.
 * @param {string} name Name to test
 * @returns {boolean} `true` if reserved, otherwise `false`
 */
util.isReserved = function isReserved(name) {
    return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(name);
};

/**
 * Returns a safe property accessor for the specified property name.
 * @param {string} prop Property name
 * @returns {string} Safe accessor
 */
util.safeProp = function safeProp(prop) {
    if (!/^[$\w_]+$/.test(prop) || util.isReserved(prop))
        return "[\"" + prop.replace(safePropBackslashRe, "\\\\").replace(safePropQuoteRe, "\\\"") + "\"]";
    return "." + prop;
};

/**
 * Converts the first character of a string to upper case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.ucFirst = function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
};

var camelCaseRe = /_([a-z])/g;

/**
 * Converts a string to camel case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.camelCase = function camelCase(str) {
    return str.substring(0, 1)
         + str.substring(1)
               .replace(camelCaseRe, function($0, $1) { return $1.toUpperCase(); });
};

/**
 * Compares reflected fields by id.
 * @param {Field} a First field
 * @param {Field} b Second field
 * @returns {number} Comparison value
 */
util.compareFieldsById = function compareFieldsById(a, b) {
    return a.id - b.id;
};

/**
 * Decorator helper for types (TypeScript).
 * @param {Constructor<T>} ctor Constructor function
 * @param {string} [typeName] Type name, defaults to the constructor's name
 * @returns {Type} Reflected type
 * @template T extends Message<T>
 * @property {Root} root Decorators root
 */
util.decorateType = function decorateType(ctor, typeName) {

    /* istanbul ignore if */
    if (ctor.$type) {
        if (typeName && ctor.$type.name !== typeName) {
            util.decorateRoot.remove(ctor.$type);
            ctor.$type.name = typeName;
            util.decorateRoot.add(ctor.$type);
        }
        return ctor.$type;
    }

    /* istanbul ignore next */
    if (!Type)
        Type = __webpack_require__(/*! ./type */ "./node_modules/protobufjs/src/type.js");

    var type = new Type(typeName || ctor.name);
    util.decorateRoot.add(type);
    type.ctor = ctor; // sets up .encode, .decode etc.
    Object.defineProperty(ctor, "$type", { value: type, enumerable: false });
    Object.defineProperty(ctor.prototype, "$type", { value: type, enumerable: false });
    return type;
};

var decorateEnumIndex = 0;

/**
 * Decorator helper for enums (TypeScript).
 * @param {Object} object Enum object
 * @returns {Enum} Reflected enum
 */
util.decorateEnum = function decorateEnum(object) {

    /* istanbul ignore if */
    if (object.$type)
        return object.$type;

    /* istanbul ignore next */
    if (!Enum)
        Enum = __webpack_require__(/*! ./enum */ "./node_modules/protobufjs/src/enum.js");

    var enm = new Enum("Enum" + decorateEnumIndex++, object);
    util.decorateRoot.add(enm);
    Object.defineProperty(object, "$type", { value: enm, enumerable: false });
    return enm;
};


/**
 * Sets the value of a property by property path. If a value already exists, it is turned to an array
 * @param {Object.<string,*>} dst Destination object
 * @param {string} path dot '.' delimited path of the property to set
 * @param {Object} value the value to set
 * @returns {Object.<string,*>} Destination object
 */
util.setProperty = function setProperty(dst, path, value) {
    function setProp(dst, path, value) {
        var part = path.shift();
        if (part === "__proto__" || part === "prototype") {
          return dst;
        }
        if (path.length > 0) {
            dst[part] = setProp(dst[part] || {}, path, value);
        } else {
            var prevValue = dst[part];
            if (prevValue)
                value = [].concat(prevValue).concat(value);
            dst[part] = value;
        }
        return dst;
    }

    if (typeof dst !== "object")
        throw TypeError("dst must be an object");
    if (!path)
        throw TypeError("path must be specified");

    path = path.split(".");
    return setProp(dst, path, value);
};

/**
 * Decorator root (TypeScript).
 * @name util.decorateRoot
 * @type {Root}
 * @readonly
 */
Object.defineProperty(util, "decorateRoot", {
    get: function() {
        return roots["decorated"] || (roots["decorated"] = new (__webpack_require__(/*! ./root */ "./node_modules/protobufjs/src/root.js"))());
    }
});


/***/ }),

/***/ "./node_modules/protobufjs/src/util/longbits.js":
/*!******************************************************!*\
  !*** ./node_modules/protobufjs/src/util/longbits.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = LongBits;

var util = __webpack_require__(/*! ../util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

/**
 * Constructs new long bits.
 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
 * @memberof util
 * @constructor
 * @param {number} lo Low 32 bits, unsigned
 * @param {number} hi High 32 bits, unsigned
 */
function LongBits(lo, hi) {

    // note that the casts below are theoretically unnecessary as of today, but older statically
    // generated converter code might still call the ctor with signed 32bits. kept for compat.

    /**
     * Low bits.
     * @type {number}
     */
    this.lo = lo >>> 0;

    /**
     * High bits.
     * @type {number}
     */
    this.hi = hi >>> 0;
}

/**
 * Zero bits.
 * @memberof util.LongBits
 * @type {util.LongBits}
 */
var zero = LongBits.zero = new LongBits(0, 0);

zero.toNumber = function() { return 0; };
zero.zzEncode = zero.zzDecode = function() { return this; };
zero.length = function() { return 1; };

/**
 * Zero hash.
 * @memberof util.LongBits
 * @type {string}
 */
var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

/**
 * Constructs new long bits from the specified number.
 * @param {number} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
        return zero;
    var sign = value < 0;
    if (sign)
        value = -value;
    var lo = value >>> 0,
        hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
                hi = 0;
        }
    }
    return new LongBits(lo, hi);
};

/**
 * Constructs new long bits from a number, long or string.
 * @param {Long|number|string} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.from = function from(value) {
    if (typeof value === "number")
        return LongBits.fromNumber(value);
    if (util.isString(value)) {
        /* istanbul ignore else */
        if (util.Long)
            value = util.Long.fromString(value);
        else
            return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
};

/**
 * Converts this long bits to a possibly unsafe JavaScript number.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {number} Possibly unsafe number
 */
LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0,
            hi = ~this.hi     >>> 0;
        if (!lo)
            hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
};

/**
 * Converts this long bits to a long.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long} Long
 */
LongBits.prototype.toLong = function toLong(unsigned) {
    return util.Long
        ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
        /* istanbul ignore next */
        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
};

var charCodeAt = String.prototype.charCodeAt;

/**
 * Constructs new long bits from the specified 8 characters long hash.
 * @param {string} hash Hash
 * @returns {util.LongBits} Bits
 */
LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
        return zero;
    return new LongBits(
        ( charCodeAt.call(hash, 0)
        | charCodeAt.call(hash, 1) << 8
        | charCodeAt.call(hash, 2) << 16
        | charCodeAt.call(hash, 3) << 24) >>> 0
    ,
        ( charCodeAt.call(hash, 4)
        | charCodeAt.call(hash, 5) << 8
        | charCodeAt.call(hash, 6) << 16
        | charCodeAt.call(hash, 7) << 24) >>> 0
    );
};

/**
 * Converts this long bits to a 8 characters long hash.
 * @returns {string} Hash
 */
LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(
        this.lo        & 255,
        this.lo >>> 8  & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24      ,
        this.hi        & 255,
        this.hi >>> 8  & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
    );
};

/**
 * Zig-zag encodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzEncode = function zzEncode() {
    var mask =   this.hi >> 31;
    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
    return this;
};

/**
 * Zig-zag decodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
    return this;
};

/**
 * Calculates the length of this longbits when encoded as a varint.
 * @returns {number} Length
 */
LongBits.prototype.length = function length() {
    var part0 =  this.lo,
        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
        part2 =  this.hi >>> 24;
    return part2 === 0
         ? part1 === 0
           ? part0 < 16384
             ? part0 < 128 ? 1 : 2
             : part0 < 2097152 ? 3 : 4
           : part1 < 16384
             ? part1 < 128 ? 5 : 6
             : part1 < 2097152 ? 7 : 8
         : part2 < 128 ? 9 : 10;
};


/***/ }),

/***/ "./node_modules/protobufjs/src/util/minimal.js":
/*!*****************************************************!*\
  !*** ./node_modules/protobufjs/src/util/minimal.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var util = exports;

// used to return a Promise where callback is omitted
util.asPromise = __webpack_require__(/*! @protobufjs/aspromise */ "./node_modules/@protobufjs/aspromise/index.js");

// converts to / from base64 encoded strings
util.base64 = __webpack_require__(/*! @protobufjs/base64 */ "./node_modules/@protobufjs/base64/index.js");

// base class of rpc.Service
util.EventEmitter = __webpack_require__(/*! @protobufjs/eventemitter */ "./node_modules/@protobufjs/eventemitter/index.js");

// float handling accross browsers
util.float = __webpack_require__(/*! @protobufjs/float */ "./node_modules/@protobufjs/float/index.js");

// requires modules optionally and hides the call from bundlers
util.inquire = __webpack_require__(/*! @protobufjs/inquire */ "./node_modules/@protobufjs/inquire/index.js");

// converts to / from utf8 encoded strings
util.utf8 = __webpack_require__(/*! @protobufjs/utf8 */ "./node_modules/@protobufjs/utf8/index.js");

// provides a node-like buffer pool in the browser
util.pool = __webpack_require__(/*! @protobufjs/pool */ "./node_modules/@protobufjs/pool/index.js");

// utility to work with the low and high bits of a 64 bit value
util.LongBits = __webpack_require__(/*! ./longbits */ "./node_modules/protobufjs/src/util/longbits.js");

/**
 * Whether running within node or not.
 * @memberof util
 * @type {boolean}
 */
util.isNode = Boolean(typeof __webpack_require__.g !== "undefined"
                   && __webpack_require__.g
                   && __webpack_require__.g.process
                   && __webpack_require__.g.process.versions
                   && __webpack_require__.g.process.versions.node);

/**
 * Global object reference.
 * @memberof util
 * @type {Object}
 */
util.global = util.isNode && __webpack_require__.g
           || typeof window !== "undefined" && window
           || typeof self   !== "undefined" && self
           || this; // eslint-disable-line no-invalid-this

/**
 * An immuable empty array.
 * @memberof util
 * @type {Array.<*>}
 * @const
 */
util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

/**
 * An immutable empty object.
 * @type {Object}
 * @const
 */
util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

/**
 * Tests if the specified value is an integer.
 * @function
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is an integer
 */
util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

/**
 * Tests if the specified value is a string.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a string
 */
util.isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
};

/**
 * Tests if the specified value is a non-null object.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a non-null object
 */
util.isObject = function isObject(value) {
    return value && typeof value === "object";
};

/**
 * Checks if a property on a message is considered to be present.
 * This is an alias of {@link util.isSet}.
 * @function
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isset =

/**
 * Checks if a property on a message is considered to be present.
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isSet = function isSet(obj, prop) {
    var value = obj[prop];
    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
    return false;
};

/**
 * Any compatible Buffer instance.
 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
 * @interface Buffer
 * @extends Uint8Array
 */

/**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */
util.Buffer = (function() {
    try {
        var Buffer = util.inquire("buffer").Buffer;
        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
    } catch (e) {
        /* istanbul ignore next */
        return null;
    }
})();

// Internal alias of or polyfull for Buffer.from.
util._Buffer_from = null;

// Internal alias of or polyfill for Buffer.allocUnsafe.
util._Buffer_allocUnsafe = null;

/**
 * Creates a new buffer of whatever type supported by the environment.
 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
 * @returns {Uint8Array|Buffer} Buffer
 */
util.newBuffer = function newBuffer(sizeOrArray) {
    /* istanbul ignore next */
    return typeof sizeOrArray === "number"
        ? util.Buffer
            ? util._Buffer_allocUnsafe(sizeOrArray)
            : new util.Array(sizeOrArray)
        : util.Buffer
            ? util._Buffer_from(sizeOrArray)
            : typeof Uint8Array === "undefined"
                ? sizeOrArray
                : new Uint8Array(sizeOrArray);
};

/**
 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
 * @type {Constructor<Uint8Array>}
 */
util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

/**
 * Any compatible Long instance.
 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
 * @interface Long
 * @property {number} low Low bits
 * @property {number} high High bits
 * @property {boolean} unsigned Whether unsigned or not
 */

/**
 * Long.js's Long class if available.
 * @type {Constructor<Long>}
 */
util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long
         || /* istanbul ignore next */ util.global.Long
         || util.inquire("long");

/**
 * Regular expression used to verify 2 bit (`bool`) map keys.
 * @type {RegExp}
 * @const
 */
util.key2Re = /^true|false|0|1$/;

/**
 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

/**
 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

/**
 * Converts a number or long to an 8 characters long hash string.
 * @param {Long|number} value Value to convert
 * @returns {string} Hash
 */
util.longToHash = function longToHash(value) {
    return value
        ? util.LongBits.from(value).toHash()
        : util.LongBits.zeroHash;
};

/**
 * Converts an 8 characters long hash string to a long or number.
 * @param {string} hash Hash
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long|number} Original value
 */
util.longFromHash = function longFromHash(hash, unsigned) {
    var bits = util.LongBits.fromHash(hash);
    if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
    return bits.toNumber(Boolean(unsigned));
};

/**
 * Merges the properties of the source object into the destination object.
 * @memberof util
 * @param {Object.<string,*>} dst Destination object
 * @param {Object.<string,*>} src Source object
 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
 * @returns {Object.<string,*>} Destination object
 */
function merge(dst, src, ifNotSet) { // used by converters
    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === undefined || !ifNotSet)
            dst[keys[i]] = src[keys[i]];
    return dst;
}

util.merge = merge;

/**
 * Converts the first character of a string to lower case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.lcFirst = function lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Creates a custom error constructor.
 * @memberof util
 * @param {string} name Error name
 * @returns {Constructor<Error>} Custom error constructor
 */
function newError(name) {

    function CustomError(message, properties) {

        if (!(this instanceof CustomError))
            return new CustomError(message, properties);

        // Error.call(this, message);
        // ^ just returns a new error instance because the ctor can be called as a function

        Object.defineProperty(this, "message", { get: function() { return message; } });

        /* istanbul ignore next */
        if (Error.captureStackTrace) // node
            Error.captureStackTrace(this, CustomError);
        else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });

        if (properties)
            merge(this, properties);
    }

    CustomError.prototype = Object.create(Error.prototype, {
        constructor: {
            value: CustomError,
            writable: true,
            enumerable: false,
            configurable: true,
        },
        name: {
            get: function get() { return name; },
            set: undefined,
            enumerable: false,
            // configurable: false would accurately preserve the behavior of
            // the original, but I'm guessing that was not intentional.
            // For an actual error subclass, this property would
            // be configurable.
            configurable: true,
        },
        toString: {
            value: function value() { return this.name + ": " + this.message; },
            writable: true,
            enumerable: false,
            configurable: true,
        },
    });

    return CustomError;
}

util.newError = newError;

/**
 * Constructs a new protocol error.
 * @classdesc Error subclass indicating a protocol specifc error.
 * @memberof util
 * @extends Error
 * @template T extends Message<T>
 * @constructor
 * @param {string} message Error message
 * @param {Object.<string,*>} [properties] Additional properties
 * @example
 * try {
 *     MyMessage.decode(someBuffer); // throws if required fields are missing
 * } catch (e) {
 *     if (e instanceof ProtocolError && e.instance)
 *         console.log("decoded so far: " + JSON.stringify(e.instance));
 * }
 */
util.ProtocolError = newError("ProtocolError");

/**
 * So far decoded message instance.
 * @name util.ProtocolError#instance
 * @type {Message<T>}
 */

/**
 * A OneOf getter as returned by {@link util.oneOfGetter}.
 * @typedef OneOfGetter
 * @type {function}
 * @returns {string|undefined} Set field name, if any
 */

/**
 * Builds a getter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfGetter} Unbound getter
 */
util.oneOfGetter = function getOneOf(fieldNames) {
    var fieldMap = {};
    for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;

    /**
     * @returns {string|undefined} Set field name, if any
     * @this Object
     * @ignore
     */
    return function() { // eslint-disable-line consistent-return
        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
                return keys[i];
    };
};

/**
 * A OneOf setter as returned by {@link util.oneOfSetter}.
 * @typedef OneOfSetter
 * @type {function}
 * @param {string|undefined} value Field name
 * @returns {undefined}
 */

/**
 * Builds a setter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfSetter} Unbound setter
 */
util.oneOfSetter = function setOneOf(fieldNames) {

    /**
     * @param {string} name Field name
     * @returns {undefined}
     * @this Object
     * @ignore
     */
    return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
                delete this[fieldNames[i]];
    };
};

/**
 * Default conversion options used for {@link Message#toJSON} implementations.
 *
 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
 *
 * - Longs become strings
 * - Enums become string keys
 * - Bytes become base64 encoded strings
 * - (Sub-)Messages become plain objects
 * - Maps become plain objects with all string keys
 * - Repeated fields become arrays
 * - NaN and Infinity for float and double fields become strings
 *
 * @type {IConversionOptions}
 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
 */
util.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: true
};

// Sets up buffer utility according to the environment (called in index-minimal)
util._configure = function() {
    var Buffer = util.Buffer;
    /* istanbul ignore if */
    if (!Buffer) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
    }
    // because node 4.x buffers are incompatible & immutable
    // see: https://github.com/dcodeIO/protobuf.js/pull/665
    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
        /* istanbul ignore next */
        function Buffer_from(value, encoding) {
            return new Buffer(value, encoding);
        };
    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
        /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
            return new Buffer(size);
        };
};


/***/ }),

/***/ "./node_modules/protobufjs/src/verifier.js":
/*!*************************************************!*\
  !*** ./node_modules/protobufjs/src/verifier.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = verifier;

var Enum      = __webpack_require__(/*! ./enum */ "./node_modules/protobufjs/src/enum.js"),
    util      = __webpack_require__(/*! ./util */ "./node_modules/protobufjs/src/util.js");

function invalid(field, expected) {
    return field.name + ": " + expected + (field.repeated && expected !== "array" ? "[]" : field.map && expected !== "object" ? "{k:"+field.keyType+"}" : "") + " expected";
}

/**
 * Generates a partial value verifier.
 * @param {Codegen} gen Codegen instance
 * @param {Field} field Reflected field
 * @param {number} fieldIndex Field index
 * @param {string} ref Variable reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genVerifyValue(gen, field, fieldIndex, ref) {
    /* eslint-disable no-unexpected-multiline */
    if (field.resolvedType) {
        if (field.resolvedType instanceof Enum) { gen
            ("switch(%s){", ref)
                ("default:")
                    ("return%j", invalid(field, "enum value"));
            for (var keys = Object.keys(field.resolvedType.values), j = 0; j < keys.length; ++j) gen
                ("case %i:", field.resolvedType.values[keys[j]]);
            gen
                    ("break")
            ("}");
        } else {
            gen
            ("{")
                ("var e=types[%i].verify(%s);", fieldIndex, ref)
                ("if(e)")
                    ("return%j+e", field.name + ".")
            ("}");
        }
    } else {
        switch (field.type) {
            case "int32":
            case "uint32":
            case "sint32":
            case "fixed32":
            case "sfixed32": gen
                ("if(!util.isInteger(%s))", ref)
                    ("return%j", invalid(field, "integer"));
                break;
            case "int64":
            case "uint64":
            case "sint64":
            case "fixed64":
            case "sfixed64": gen
                ("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", ref, ref, ref, ref)
                    ("return%j", invalid(field, "integer|Long"));
                break;
            case "float":
            case "double": gen
                ("if(typeof %s!==\"number\")", ref)
                    ("return%j", invalid(field, "number"));
                break;
            case "bool": gen
                ("if(typeof %s!==\"boolean\")", ref)
                    ("return%j", invalid(field, "boolean"));
                break;
            case "string": gen
                ("if(!util.isString(%s))", ref)
                    ("return%j", invalid(field, "string"));
                break;
            case "bytes": gen
                ("if(!(%s&&typeof %s.length===\"number\"||util.isString(%s)))", ref, ref, ref)
                    ("return%j", invalid(field, "buffer"));
                break;
        }
    }
    return gen;
    /* eslint-enable no-unexpected-multiline */
}

/**
 * Generates a partial key verifier.
 * @param {Codegen} gen Codegen instance
 * @param {Field} field Reflected field
 * @param {string} ref Variable reference
 * @returns {Codegen} Codegen instance
 * @ignore
 */
function genVerifyKey(gen, field, ref) {
    /* eslint-disable no-unexpected-multiline */
    switch (field.keyType) {
        case "int32":
        case "uint32":
        case "sint32":
        case "fixed32":
        case "sfixed32": gen
            ("if(!util.key32Re.test(%s))", ref)
                ("return%j", invalid(field, "integer key"));
            break;
        case "int64":
        case "uint64":
        case "sint64":
        case "fixed64":
        case "sfixed64": gen
            ("if(!util.key64Re.test(%s))", ref) // see comment above: x is ok, d is not
                ("return%j", invalid(field, "integer|Long key"));
            break;
        case "bool": gen
            ("if(!util.key2Re.test(%s))", ref)
                ("return%j", invalid(field, "boolean key"));
            break;
    }
    return gen;
    /* eslint-enable no-unexpected-multiline */
}

/**
 * Generates a verifier specific to the specified message type.
 * @param {Type} mtype Message type
 * @returns {Codegen} Codegen instance
 */
function verifier(mtype) {
    /* eslint-disable no-unexpected-multiline */

    var gen = util.codegen(["m"], mtype.name + "$verify")
    ("if(typeof m!==\"object\"||m===null)")
        ("return%j", "object expected");
    var oneofs = mtype.oneofsArray,
        seenFirstField = {};
    if (oneofs.length) gen
    ("var p={}");

    for (var i = 0; i < /* initializes */ mtype.fieldsArray.length; ++i) {
        var field = mtype._fieldsArray[i].resolve(),
            ref   = "m" + util.safeProp(field.name);

        if (field.optional) gen
        ("if(%s!=null&&m.hasOwnProperty(%j)){", ref, field.name); // !== undefined && !== null

        // map fields
        if (field.map) { gen
            ("if(!util.isObject(%s))", ref)
                ("return%j", invalid(field, "object"))
            ("var k=Object.keys(%s)", ref)
            ("for(var i=0;i<k.length;++i){");
                genVerifyKey(gen, field, "k[i]");
                genVerifyValue(gen, field, i, ref + "[k[i]]")
            ("}");

        // repeated fields
        } else if (field.repeated) { gen
            ("if(!Array.isArray(%s))", ref)
                ("return%j", invalid(field, "array"))
            ("for(var i=0;i<%s.length;++i){", ref);
                genVerifyValue(gen, field, i, ref + "[i]")
            ("}");

        // required or present fields
        } else {
            if (field.partOf) {
                var oneofProp = util.safeProp(field.partOf.name);
                if (seenFirstField[field.partOf.name] === 1) gen
            ("if(p%s===1)", oneofProp)
                ("return%j", field.partOf.name + ": multiple values");
                seenFirstField[field.partOf.name] = 1;
                gen
            ("p%s=1", oneofProp);
            }
            genVerifyValue(gen, field, i, ref);
        }
        if (field.optional) gen
        ("}");
    }
    return gen
    ("return null");
    /* eslint-enable no-unexpected-multiline */
}

/***/ }),

/***/ "./node_modules/protobufjs/src/wrappers.js":
/*!*************************************************!*\
  !*** ./node_modules/protobufjs/src/wrappers.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


/**
 * Wrappers for common types.
 * @type {Object.<string,IWrapper>}
 * @const
 */
var wrappers = exports;

var Message = __webpack_require__(/*! ./message */ "./node_modules/protobufjs/src/message.js");

/**
 * From object converter part of an {@link IWrapper}.
 * @typedef WrapperFromObjectConverter
 * @type {function}
 * @param {Object.<string,*>} object Plain object
 * @returns {Message<{}>} Message instance
 * @this Type
 */

/**
 * To object converter part of an {@link IWrapper}.
 * @typedef WrapperToObjectConverter
 * @type {function}
 * @param {Message<{}>} message Message instance
 * @param {IConversionOptions} [options] Conversion options
 * @returns {Object.<string,*>} Plain object
 * @this Type
 */

/**
 * Common type wrapper part of {@link wrappers}.
 * @interface IWrapper
 * @property {WrapperFromObjectConverter} [fromObject] From object converter
 * @property {WrapperToObjectConverter} [toObject] To object converter
 */

// Custom wrapper for Any
wrappers[".google.protobuf.Any"] = {

    fromObject: function(object) {

        // unwrap value type if mapped
        if (object && object["@type"]) {
             // Only use fully qualified type name after the last '/'
            var name = object["@type"].substring(object["@type"].lastIndexOf("/") + 1);
            var type = this.lookup(name);
            /* istanbul ignore else */
            if (type) {
                // type_url does not accept leading "."
                var type_url = object["@type"].charAt(0) === "." ?
                    object["@type"].slice(1) : object["@type"];
                // type_url prefix is optional, but path seperator is required
                if (type_url.indexOf("/") === -1) {
                    type_url = "/" + type_url;
                }
                return this.create({
                    type_url: type_url,
                    value: type.encode(type.fromObject(object)).finish()
                });
            }
        }

        return this.fromObject(object);
    },

    toObject: function(message, options) {

        // Default prefix
        var googleApi = "type.googleapis.com/";
        var prefix = "";
        var name = "";

        // decode value if requested and unmapped
        if (options && options.json && message.type_url && message.value) {
            // Only use fully qualified type name after the last '/'
            name = message.type_url.substring(message.type_url.lastIndexOf("/") + 1);
            // Separate the prefix used
            prefix = message.type_url.substring(0, message.type_url.lastIndexOf("/") + 1);
            var type = this.lookup(name);
            /* istanbul ignore else */
            if (type)
                message = type.decode(message.value);
        }

        // wrap value if unmapped
        if (!(message instanceof this.ctor) && message instanceof Message) {
            var object = message.$type.toObject(message, options);
            var messageName = message.$type.fullName[0] === "." ?
                message.$type.fullName.slice(1) : message.$type.fullName;
            // Default to type.googleapis.com prefix if no prefix is used
            if (prefix === "") {
                prefix = googleApi;
            }
            name = prefix + messageName;
            object["@type"] = name;
            return object;
        }

        return this.toObject(message, options);
    }
};


/***/ }),

/***/ "./node_modules/protobufjs/src/writer.js":
/*!***********************************************!*\
  !*** ./node_modules/protobufjs/src/writer.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Writer;

var util      = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

var BufferWriter; // cyclic

var LongBits  = util.LongBits,
    base64    = util.base64,
    utf8      = util.utf8;

/**
 * Constructs a new writer operation instance.
 * @classdesc Scheduled writer operation.
 * @constructor
 * @param {function(*, Uint8Array, number)} fn Function to call
 * @param {number} len Value byte length
 * @param {*} val Value to write
 * @ignore
 */
function Op(fn, len, val) {

    /**
     * Function to call.
     * @type {function(Uint8Array, number, *)}
     */
    this.fn = fn;

    /**
     * Value byte length.
     * @type {number}
     */
    this.len = len;

    /**
     * Next operation.
     * @type {Writer.Op|undefined}
     */
    this.next = undefined;

    /**
     * Value to write.
     * @type {*}
     */
    this.val = val; // type varies
}

/* istanbul ignore next */
function noop() {} // eslint-disable-line no-empty-function

/**
 * Constructs a new writer state instance.
 * @classdesc Copied writer state.
 * @memberof Writer
 * @constructor
 * @param {Writer} writer Writer to copy state from
 * @ignore
 */
function State(writer) {

    /**
     * Current head.
     * @type {Writer.Op}
     */
    this.head = writer.head;

    /**
     * Current tail.
     * @type {Writer.Op}
     */
    this.tail = writer.tail;

    /**
     * Current buffer length.
     * @type {number}
     */
    this.len = writer.len;

    /**
     * Next state.
     * @type {State|null}
     */
    this.next = writer.states;
}

/**
 * Constructs a new writer instance.
 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 */
function Writer() {

    /**
     * Current length.
     * @type {number}
     */
    this.len = 0;

    /**
     * Operations head.
     * @type {Object}
     */
    this.head = new Op(noop, 0, 0);

    /**
     * Operations tail
     * @type {Object}
     */
    this.tail = this.head;

    /**
     * Linked forked states.
     * @type {Object|null}
     */
    this.states = null;

    // When a value is written, the writer calculates its byte length and puts it into a linked
    // list of operations to perform when finish() is called. This both allows us to allocate
    // buffers of the exact required size and reduces the amount of work we have to do compared
    // to first calculating over objects and then encoding over objects. In our case, the encoding
    // part is just a linked list walk calling operations with already prepared values.
}

var create = function create() {
    return util.Buffer
        ? function create_buffer_setup() {
            return (Writer.create = function create_buffer() {
                return new BufferWriter();
            })();
        }
        /* istanbul ignore next */
        : function create_array() {
            return new Writer();
        };
};

/**
 * Creates a new writer.
 * @function
 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
 */
Writer.create = create();

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */
Writer.alloc = function alloc(size) {
    return new util.Array(size);
};

// Use Uint8Array buffer pool in the browser, just like node does with buffers
/* istanbul ignore else */
if (util.Array !== Array)
    Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);

/**
 * Pushes a new operation to the queue.
 * @param {function(Uint8Array, number, *)} fn Function to call
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @returns {Writer} `this`
 * @private
 */
Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
};

function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
}

function writeVarint32(val, buf, pos) {
    while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
    }
    buf[pos] = val;
}

/**
 * Constructs a new varint writer operation instance.
 * @classdesc Scheduled varint writer operation.
 * @extends Op
 * @constructor
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @ignore
 */
function VarintOp(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
}

VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;

/**
 * Writes an unsigned 32 bit value as a varint.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.uint32 = function write_uint32(value) {
    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
    // uint32 is by far the most frequently used operation and benefits significantly from this.
    this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0)
                < 128       ? 1
        : value < 16384     ? 2
        : value < 2097152   ? 3
        : value < 268435456 ? 4
        :                     5,
    value)).len;
    return this;
};

/**
 * Writes a signed 32 bit value as a varint.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.int32 = function write_int32(value) {
    return value < 0
        ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) // 10 bytes per spec
        : this.uint32(value);
};

/**
 * Writes a 32 bit value as a varint, zig-zag encoded.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
};

function writeVarint64(val, buf, pos) {
    while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
    }
    while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
}

/**
 * Writes an unsigned 64 bit value as a varint.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a signed 64 bit value as a varint.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.int64 = Writer.prototype.uint64;

/**
 * Writes a signed 64 bit value as a varint, zig-zag encoded.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a boolish value as a varint.
 * @param {boolean} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
};

function writeFixed32(val, buf, pos) {
    buf[pos    ] =  val         & 255;
    buf[pos + 1] =  val >>> 8   & 255;
    buf[pos + 2] =  val >>> 16  & 255;
    buf[pos + 3] =  val >>> 24;
}

/**
 * Writes an unsigned 32 bit value as fixed 32 bits.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
};

/**
 * Writes a signed 32 bit value as fixed 32 bits.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sfixed32 = Writer.prototype.fixed32;

/**
 * Writes an unsigned 64 bit value as fixed 64 bits.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};

/**
 * Writes a signed 64 bit value as fixed 64 bits.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sfixed64 = Writer.prototype.fixed64;

/**
 * Writes a float (32 bit).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.float = function write_float(value) {
    return this._push(util.float.writeFloatLE, 4, value);
};

/**
 * Writes a double (64 bit float).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.double = function write_double(value) {
    return this._push(util.float.writeDoubleLE, 8, value);
};

var writeBytes = util.Array.prototype.set
    ? function writeBytes_set(val, buf, pos) {
        buf.set(val, pos); // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytes_for(val, buf, pos) {
        for (var i = 0; i < val.length; ++i)
            buf[pos + i] = val[i];
    };

/**
 * Writes a sequence of bytes.
 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
 * @returns {Writer} `this`
 */
Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
        return this._push(writeByte, 1, 0);
    if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
};

/**
 * Writes a string.
 * @param {string} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len
        ? this.uint32(len)._push(utf8.write, len, value)
        : this._push(writeByte, 1, 0);
};

/**
 * Forks this writer's state by pushing it to a stack.
 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
 * @returns {Writer} `this`
 */
Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
};

/**
 * Resets this instance to the last state.
 * @returns {Writer} `this`
 */
Writer.prototype.reset = function reset() {
    if (this.states) {
        this.head   = this.states.head;
        this.tail   = this.states.tail;
        this.len    = this.states.len;
        this.states = this.states.next;
    } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len  = 0;
    }
    return this;
};

/**
 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
 * @returns {Writer} `this`
 */
Writer.prototype.ldelim = function ldelim() {
    var head = this.head,
        tail = this.tail,
        len  = this.len;
    this.reset().uint32(len);
    if (len) {
        this.tail.next = head.next; // skip noop
        this.tail = tail;
        this.len += len;
    }
    return this;
};

/**
 * Finishes the write operation.
 * @returns {Uint8Array} Finished buffer
 */
Writer.prototype.finish = function finish() {
    var head = this.head.next, // skip noop
        buf  = this.constructor.alloc(this.len),
        pos  = 0;
    while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
    }
    // this.head = this.tail = null;
    return buf;
};

Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
    Writer.create = create();
    BufferWriter._configure();
};


/***/ }),

/***/ "./node_modules/protobufjs/src/writer_buffer.js":
/*!******************************************************!*\
  !*** ./node_modules/protobufjs/src/writer_buffer.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = BufferWriter;

// extends Writer
var Writer = __webpack_require__(/*! ./writer */ "./node_modules/protobufjs/src/writer.js");
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;

var util = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

/**
 * Constructs a new buffer writer instance.
 * @classdesc Wire format writer using node buffers.
 * @extends Writer
 * @constructor
 */
function BufferWriter() {
    Writer.call(this);
}

BufferWriter._configure = function () {
    /**
     * Allocates a buffer of the specified size.
     * @function
     * @param {number} size Buffer size
     * @returns {Buffer} Buffer
     */
    BufferWriter.alloc = util._Buffer_allocUnsafe;

    BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set"
        ? function writeBytesBuffer_set(val, buf, pos) {
          buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
          // also works for plain array values
        }
        /* istanbul ignore next */
        : function writeBytesBuffer_copy(val, buf, pos) {
          if (val.copy) // Buffer values
            val.copy(buf, pos, 0, val.length);
          else for (var i = 0; i < val.length;) // plain array values
            buf[pos++] = val[i++];
        };
};


/**
 * @override
 */
BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
    if (util.isString(value))
        value = util._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
    return this;
};

function writeStringBuffer(val, buf, pos) {
    if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
        util.utf8.write(val, buf, pos);
    else if (buf.utf8Write)
        buf.utf8Write(val, pos);
    else
        buf.write(val, pos);
}

/**
 * @override
 */
BufferWriter.prototype.string = function write_string_buffer(value) {
    var len = util.Buffer.byteLength(value);
    this.uint32(len);
    if (len)
        this._push(writeStringBuffer, len, value);
    return this;
};


/**
 * Finishes the write operation.
 * @name BufferWriter#finish
 * @function
 * @returns {Buffer} Finished buffer
 */

BufferWriter._configure();


/***/ }),

/***/ "./src/workflows.ts":
/*!**************************!*\
  !*** ./src/workflows.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   example: () => (/* binding */ example)
/* harmony export */ });
/* harmony import */ var _temporalio_workflow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @temporalio/workflow */ "./node_modules/@temporalio/workflow/lib/index.js");
/* harmony import */ var _temporalio_workflow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_temporalio_workflow__WEBPACK_IMPORTED_MODULE_0__);
// @@@SNIPSTART typescript-hello-workflow

const { greet } = (0,_temporalio_workflow__WEBPACK_IMPORTED_MODULE_0__.proxyActivities)({
    startToCloseTimeout: '1 minute'
});
/** A workflow that simply calls an activity */ async function example(name) {
    return await greet(name);
} // @@@SNIPEND


/***/ }),

/***/ "?31ff":
/*!*****************************************************!*\
  !*** __temporal_custom_failure_converter (ignored) ***!
  \*****************************************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?2065":
/*!*****************************************************!*\
  !*** __temporal_custom_payload_converter (ignored) ***!
  \*****************************************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "./node_modules/@temporalio/common/node_modules/ms/dist/index.cjs":
/*!************************************************************************!*\
  !*** ./node_modules/@temporalio/common/node_modules/ms/dist/index.cjs ***!
  \************************************************************************/
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
// Helpers.
const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;
function ms(value, options) {
    try {
        if (typeof value === 'string' && value.length > 0) {
            return parse(value);
        }
        else if (typeof value === 'number' && isFinite(value)) {
            return options?.long ? fmtLong(value) : fmtShort(value);
        }
        throw new Error('Value is not a string or number.');
    }
    catch (error) {
        const message = isError(error)
            ? `${error.message}. value=${JSON.stringify(value)}`
            : 'An unknown error has occured.';
        throw new Error(message);
    }
}
/**
 * Parse the given `str` and return milliseconds.
 */
function parse(str) {
    str = String(str);
    if (str.length > 100) {
        throw new Error('Value exceeds the maximum length of 100 characters.');
    }
    const match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
        return NaN;
    }
    const n = parseFloat(match[1]);
    const type = (match[2] || 'ms').toLowerCase();
    switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y;
        case 'weeks':
        case 'week':
        case 'w':
            return n * w;
        case 'days':
        case 'day':
        case 'd':
            return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n;
        default:
            // This should never occur.
            throw new Error(`The unit ${type} was matched, but no matching case exists.`);
    }
}
exports["default"] = ms;
/**
 * Short format for `ms`.
 */
function fmtShort(ms) {
    const msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return `${Math.round(ms / d)}d`;
    }
    if (msAbs >= h) {
        return `${Math.round(ms / h)}h`;
    }
    if (msAbs >= m) {
        return `${Math.round(ms / m)}m`;
    }
    if (msAbs >= s) {
        return `${Math.round(ms / s)}s`;
    }
    return `${ms}ms`;
}
/**
 * Long format for `ms`.
 */
function fmtLong(ms) {
    const msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
    }
    return `${ms} ms`;
}
/**
 * Pluralization helper.
 */
function plural(ms, msAbs, n, name) {
    const isPlural = msAbs >= n * 1.5;
    return `${Math.round(ms / n)} ${name}${isPlural ? 's' : ''}`;
}
/**
 * A type guard for errors.
 */
function isError(error) {
    return typeof error === 'object' && error !== null && 'message' in error;
}
module.exports = exports.default;
module.exports["default"] = exports.default;


/***/ }),

/***/ "./node_modules/long/umd/index.js":
/*!****************************************!*\
  !*** ./node_modules/long/umd/index.js ***!
  \****************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// GENERATED FILE. DO NOT EDIT.
var Long = (function(exports) {
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = void 0;
  
  /**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   */
  // WebAssembly optimizations to do native i64 multiplication and divide
  var wasm = null;
  
  try {
    wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;
  } catch (e) {// no wasm support :(
  }
  /**
   * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
   *  See the from* functions below for more convenient ways of constructing Longs.
   * @exports Long
   * @class A Long class for representing a 64 bit two's-complement integer value.
   * @param {number} low The low (signed) 32 bits of the long
   * @param {number} high The high (signed) 32 bits of the long
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @constructor
   */
  
  
  function Long(low, high, unsigned) {
    /**
     * The low 32 bits as a signed value.
     * @type {number}
     */
    this.low = low | 0;
    /**
     * The high 32 bits as a signed value.
     * @type {number}
     */
  
    this.high = high | 0;
    /**
     * Whether unsigned or not.
     * @type {boolean}
     */
  
    this.unsigned = !!unsigned;
  } // The internal representation of a long is the two given signed, 32-bit values.
  // We use 32-bit pieces because these are the size of integers on which
  // Javascript performs bit-operations.  For operations like addition and
  // multiplication, we split each number into 16 bit pieces, which can easily be
  // multiplied within Javascript's floating-point representation without overflow
  // or change in sign.
  //
  // In the algorithms below, we frequently reduce the negative case to the
  // positive case by negating the input(s) and then post-processing the result.
  // Note that we must ALWAYS check specially whether those values are MIN_VALUE
  // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
  // a positive number, it overflows back into a negative).  Not handling this
  // case would often result in infinite recursion.
  //
  // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
  // methods on which they depend.
  
  /**
   * An indicator used to reliably determine if an object is a Long or not.
   * @type {boolean}
   * @const
   * @private
   */
  
  
  Long.prototype.__isLong__;
  Object.defineProperty(Long.prototype, "__isLong__", {
    value: true
  });
  /**
   * @function
   * @param {*} obj Object
   * @returns {boolean}
   * @inner
   */
  
  function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
  }
  /**
   * @function
   * @param {*} value number
   * @returns {number}
   * @inner
   */
  
  
  function ctz32(value) {
    var c = Math.clz32(value & -value);
    return value ? 31 - c : c;
  }
  /**
   * Tests if the specified object is a Long.
   * @function
   * @param {*} obj Object
   * @returns {boolean}
   */
  
  
  Long.isLong = isLong;
  /**
   * A cache of the Long representations of small integer values.
   * @type {!Object}
   * @inner
   */
  
  var INT_CACHE = {};
  /**
   * A cache of the Long representations of small unsigned integer values.
   * @type {!Object}
   * @inner
   */
  
  var UINT_CACHE = {};
  /**
   * @param {number} value
   * @param {boolean=} unsigned
   * @returns {!Long}
   * @inner
   */
  
  function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
  
    if (unsigned) {
      value >>>= 0;
  
      if (cache = 0 <= value && value < 256) {
        cachedObj = UINT_CACHE[value];
        if (cachedObj) return cachedObj;
      }
  
      obj = fromBits(value, 0, true);
      if (cache) UINT_CACHE[value] = obj;
      return obj;
    } else {
      value |= 0;
  
      if (cache = -128 <= value && value < 128) {
        cachedObj = INT_CACHE[value];
        if (cachedObj) return cachedObj;
      }
  
      obj = fromBits(value, value < 0 ? -1 : 0, false);
      if (cache) INT_CACHE[value] = obj;
      return obj;
    }
  }
  /**
   * Returns a Long representing the given 32 bit integer value.
   * @function
   * @param {number} value The 32 bit integer in question
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {!Long} The corresponding Long value
   */
  
  
  Long.fromInt = fromInt;
  /**
   * @param {number} value
   * @param {boolean=} unsigned
   * @returns {!Long}
   * @inner
   */
  
  function fromNumber(value, unsigned) {
    if (isNaN(value)) return unsigned ? UZERO : ZERO;
  
    if (unsigned) {
      if (value < 0) return UZERO;
      if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
    } else {
      if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
      if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
    }
  
    if (value < 0) return fromNumber(-value, unsigned).neg();
    return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
  }
  /**
   * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
   * @function
   * @param {number} value The number in question
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {!Long} The corresponding Long value
   */
  
  
  Long.fromNumber = fromNumber;
  /**
   * @param {number} lowBits
   * @param {number} highBits
   * @param {boolean=} unsigned
   * @returns {!Long}
   * @inner
   */
  
  function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
  }
  /**
   * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
   *  assumed to use 32 bits.
   * @function
   * @param {number} lowBits The low 32 bits
   * @param {number} highBits The high 32 bits
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {!Long} The corresponding Long value
   */
  
  
  Long.fromBits = fromBits;
  /**
   * @function
   * @param {number} base
   * @param {number} exponent
   * @returns {number}
   * @inner
   */
  
  var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)
  
  /**
   * @param {string} str
   * @param {(boolean|number)=} unsigned
   * @param {number=} radix
   * @returns {!Long}
   * @inner
   */
  
  function fromString(str, unsigned, radix) {
    if (str.length === 0) throw Error('empty string');
  
    if (typeof unsigned === 'number') {
      // For goog.math.long compatibility
      radix = unsigned;
      unsigned = false;
    } else {
      unsigned = !!unsigned;
    }
  
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity") return unsigned ? UZERO : ZERO;
    radix = radix || 10;
    if (radix < 2 || 36 < radix) throw RangeError('radix');
    var p;
    if ((p = str.indexOf('-')) > 0) throw Error('interior hyphen');else if (p === 0) {
      return fromString(str.substring(1), unsigned, radix).neg();
    } // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
  
    var radixToPower = fromNumber(pow_dbl(radix, 8));
    var result = ZERO;
  
    for (var i = 0; i < str.length; i += 8) {
      var size = Math.min(8, str.length - i),
          value = parseInt(str.substring(i, i + size), radix);
  
      if (size < 8) {
        var power = fromNumber(pow_dbl(radix, size));
        result = result.mul(power).add(fromNumber(value));
      } else {
        result = result.mul(radixToPower);
        result = result.add(fromNumber(value));
      }
    }
  
    result.unsigned = unsigned;
    return result;
  }
  /**
   * Returns a Long representation of the given string, written using the specified radix.
   * @function
   * @param {string} str The textual representation of the Long
   * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
   * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
   * @returns {!Long} The corresponding Long value
   */
  
  
  Long.fromString = fromString;
  /**
   * @function
   * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
   * @param {boolean=} unsigned
   * @returns {!Long}
   * @inner
   */
  
  function fromValue(val, unsigned) {
    if (typeof val === 'number') return fromNumber(val, unsigned);
    if (typeof val === 'string') return fromString(val, unsigned); // Throws for non-objects, converts non-instanceof Long:
  
    return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
  }
  /**
   * Converts the specified value to a Long using the appropriate from* function for its type.
   * @function
   * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {!Long}
   */
  
  
  Long.fromValue = fromValue; // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
  // no runtime penalty for these.
  
  /**
   * @type {number}
   * @const
   * @inner
   */
  
  var TWO_PWR_16_DBL = 1 << 16;
  /**
   * @type {number}
   * @const
   * @inner
   */
  
  var TWO_PWR_24_DBL = 1 << 24;
  /**
   * @type {number}
   * @const
   * @inner
   */
  
  var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
  /**
   * @type {number}
   * @const
   * @inner
   */
  
  var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
  /**
   * @type {number}
   * @const
   * @inner
   */
  
  var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
  /**
   * @type {!Long}
   * @const
   * @inner
   */
  
  var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
  /**
   * @type {!Long}
   * @inner
   */
  
  var ZERO = fromInt(0);
  /**
   * Signed zero.
   * @type {!Long}
   */
  
  Long.ZERO = ZERO;
  /**
   * @type {!Long}
   * @inner
   */
  
  var UZERO = fromInt(0, true);
  /**
   * Unsigned zero.
   * @type {!Long}
   */
  
  Long.UZERO = UZERO;
  /**
   * @type {!Long}
   * @inner
   */
  
  var ONE = fromInt(1);
  /**
   * Signed one.
   * @type {!Long}
   */
  
  Long.ONE = ONE;
  /**
   * @type {!Long}
   * @inner
   */
  
  var UONE = fromInt(1, true);
  /**
   * Unsigned one.
   * @type {!Long}
   */
  
  Long.UONE = UONE;
  /**
   * @type {!Long}
   * @inner
   */
  
  var NEG_ONE = fromInt(-1);
  /**
   * Signed negative one.
   * @type {!Long}
   */
  
  Long.NEG_ONE = NEG_ONE;
  /**
   * @type {!Long}
   * @inner
   */
  
  var MAX_VALUE = fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0, false);
  /**
   * Maximum signed value.
   * @type {!Long}
   */
  
  Long.MAX_VALUE = MAX_VALUE;
  /**
   * @type {!Long}
   * @inner
   */
  
  var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF | 0, 0xFFFFFFFF | 0, true);
  /**
   * Maximum unsigned value.
   * @type {!Long}
   */
  
  Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
  /**
   * @type {!Long}
   * @inner
   */
  
  var MIN_VALUE = fromBits(0, 0x80000000 | 0, false);
  /**
   * Minimum signed value.
   * @type {!Long}
   */
  
  Long.MIN_VALUE = MIN_VALUE;
  /**
   * @alias Long.prototype
   * @inner
   */
  
  var LongPrototype = Long.prototype;
  /**
   * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
   * @this {!Long}
   * @returns {number}
   */
  
  LongPrototype.toInt = function toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
  };
  /**
   * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
   * @this {!Long}
   * @returns {number}
   */
  
  
  LongPrototype.toNumber = function toNumber() {
    if (this.unsigned) return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
    return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
  };
  /**
   * Converts the Long to a string written in the specified radix.
   * @this {!Long}
   * @param {number=} radix Radix (2-36), defaults to 10
   * @returns {string}
   * @override
   * @throws {RangeError} If `radix` is out of range
   */
  
  
  LongPrototype.toString = function toString(radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix) throw RangeError('radix');
    if (this.isZero()) return '0';
  
    if (this.isNegative()) {
      // Unsigned Longs are never negative
      if (this.eq(MIN_VALUE)) {
        // We need to change the Long value before it can be negated, so we remove
        // the bottom-most digit in this base and then recurse to do the rest.
        var radixLong = fromNumber(radix),
            div = this.div(radixLong),
            rem1 = div.mul(radixLong).sub(this);
        return div.toString(radix) + rem1.toInt().toString(radix);
      } else return '-' + this.neg().toString(radix);
    } // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
  
  
    var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
        rem = this;
    var result = '';
  
    while (true) {
      var remDiv = rem.div(radixToPower),
          intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
          digits = intval.toString(radix);
      rem = remDiv;
      if (rem.isZero()) return digits + result;else {
        while (digits.length < 6) digits = '0' + digits;
  
        result = '' + digits + result;
      }
    }
  };
  /**
   * Gets the high 32 bits as a signed integer.
   * @this {!Long}
   * @returns {number} Signed high bits
   */
  
  
  LongPrototype.getHighBits = function getHighBits() {
    return this.high;
  };
  /**
   * Gets the high 32 bits as an unsigned integer.
   * @this {!Long}
   * @returns {number} Unsigned high bits
   */
  
  
  LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
    return this.high >>> 0;
  };
  /**
   * Gets the low 32 bits as a signed integer.
   * @this {!Long}
   * @returns {number} Signed low bits
   */
  
  
  LongPrototype.getLowBits = function getLowBits() {
    return this.low;
  };
  /**
   * Gets the low 32 bits as an unsigned integer.
   * @this {!Long}
   * @returns {number} Unsigned low bits
   */
  
  
  LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
    return this.low >>> 0;
  };
  /**
   * Gets the number of bits needed to represent the absolute value of this Long.
   * @this {!Long}
   * @returns {number}
   */
  
  
  LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
    if (this.isNegative()) // Unsigned Longs are never negative
      return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    var val = this.high != 0 ? this.high : this.low;
  
    for (var bit = 31; bit > 0; bit--) if ((val & 1 << bit) != 0) break;
  
    return this.high != 0 ? bit + 33 : bit + 1;
  };
  /**
   * Tests if this Long's value equals zero.
   * @this {!Long}
   * @returns {boolean}
   */
  
  
  LongPrototype.isZero = function isZero() {
    return this.high === 0 && this.low === 0;
  };
  /**
   * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
   * @returns {boolean}
   */
  
  
  LongPrototype.eqz = LongPrototype.isZero;
  /**
   * Tests if this Long's value is negative.
   * @this {!Long}
   * @returns {boolean}
   */
  
  LongPrototype.isNegative = function isNegative() {
    return !this.unsigned && this.high < 0;
  };
  /**
   * Tests if this Long's value is positive or zero.
   * @this {!Long}
   * @returns {boolean}
   */
  
  
  LongPrototype.isPositive = function isPositive() {
    return this.unsigned || this.high >= 0;
  };
  /**
   * Tests if this Long's value is odd.
   * @this {!Long}
   * @returns {boolean}
   */
  
  
  LongPrototype.isOdd = function isOdd() {
    return (this.low & 1) === 1;
  };
  /**
   * Tests if this Long's value is even.
   * @this {!Long}
   * @returns {boolean}
   */
  
  
  LongPrototype.isEven = function isEven() {
    return (this.low & 1) === 0;
  };
  /**
   * Tests if this Long's value equals the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  
  LongPrototype.equals = function equals(other) {
    if (!isLong(other)) other = fromValue(other);
    if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1) return false;
    return this.high === other.high && this.low === other.low;
  };
  /**
   * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  
  LongPrototype.eq = LongPrototype.equals;
  /**
   * Tests if this Long's value differs from the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  LongPrototype.notEquals = function notEquals(other) {
    return !this.eq(
    /* validates */
    other);
  };
  /**
   * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  
  LongPrototype.neq = LongPrototype.notEquals;
  /**
   * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  LongPrototype.ne = LongPrototype.notEquals;
  /**
   * Tests if this Long's value is less than the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  LongPrototype.lessThan = function lessThan(other) {
    return this.comp(
    /* validates */
    other) < 0;
  };
  /**
   * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  
  LongPrototype.lt = LongPrototype.lessThan;
  /**
   * Tests if this Long's value is less than or equal the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
    return this.comp(
    /* validates */
    other) <= 0;
  };
  /**
   * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  
  LongPrototype.lte = LongPrototype.lessThanOrEqual;
  /**
   * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  LongPrototype.le = LongPrototype.lessThanOrEqual;
  /**
   * Tests if this Long's value is greater than the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  LongPrototype.greaterThan = function greaterThan(other) {
    return this.comp(
    /* validates */
    other) > 0;
  };
  /**
   * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  
  LongPrototype.gt = LongPrototype.greaterThan;
  /**
   * Tests if this Long's value is greater than or equal the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
    return this.comp(
    /* validates */
    other) >= 0;
  };
  /**
   * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  
  LongPrototype.gte = LongPrototype.greaterThanOrEqual;
  /**
   * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {boolean}
   */
  
  LongPrototype.ge = LongPrototype.greaterThanOrEqual;
  /**
   * Compares this Long's value with the specified's.
   * @this {!Long}
   * @param {!Long|number|string} other Other value
   * @returns {number} 0 if they are the same, 1 if the this is greater and -1
   *  if the given one is greater
   */
  
  LongPrototype.compare = function compare(other) {
    if (!isLong(other)) other = fromValue(other);
    if (this.eq(other)) return 0;
    var thisNeg = this.isNegative(),
        otherNeg = other.isNegative();
    if (thisNeg && !otherNeg) return -1;
    if (!thisNeg && otherNeg) return 1; // At this point the sign bits are the same
  
    if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1; // Both are positive if at least one is unsigned
  
    return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
  };
  /**
   * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
   * @function
   * @param {!Long|number|string} other Other value
   * @returns {number} 0 if they are the same, 1 if the this is greater and -1
   *  if the given one is greater
   */
  
  
  LongPrototype.comp = LongPrototype.compare;
  /**
   * Negates this Long's value.
   * @this {!Long}
   * @returns {!Long} Negated Long
   */
  
  LongPrototype.negate = function negate() {
    if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
    return this.not().add(ONE);
  };
  /**
   * Negates this Long's value. This is an alias of {@link Long#negate}.
   * @function
   * @returns {!Long} Negated Long
   */
  
  
  LongPrototype.neg = LongPrototype.negate;
  /**
   * Returns the sum of this and the specified Long.
   * @this {!Long}
   * @param {!Long|number|string} addend Addend
   * @returns {!Long} Sum
   */
  
  LongPrototype.add = function add(addend) {
    if (!isLong(addend)) addend = fromValue(addend); // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
  
    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;
    var b48 = addend.high >>> 16;
    var b32 = addend.high & 0xFFFF;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 0xFFFF;
    var c48 = 0,
        c32 = 0,
        c16 = 0,
        c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
  };
  /**
   * Returns the difference of this and the specified Long.
   * @this {!Long}
   * @param {!Long|number|string} subtrahend Subtrahend
   * @returns {!Long} Difference
   */
  
  
  LongPrototype.subtract = function subtract(subtrahend) {
    if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
    return this.add(subtrahend.neg());
  };
  /**
   * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
   * @function
   * @param {!Long|number|string} subtrahend Subtrahend
   * @returns {!Long} Difference
   */
  
  
  LongPrototype.sub = LongPrototype.subtract;
  /**
   * Returns the product of this and the specified Long.
   * @this {!Long}
   * @param {!Long|number|string} multiplier Multiplier
   * @returns {!Long} Product
   */
  
  LongPrototype.multiply = function multiply(multiplier) {
    if (this.isZero()) return this;
    if (!isLong(multiplier)) multiplier = fromValue(multiplier); // use wasm support if present
  
    if (wasm) {
      var low = wasm["mul"](this.low, this.high, multiplier.low, multiplier.high);
      return fromBits(low, wasm["get_high"](), this.unsigned);
    }
  
    if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
    if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
  
    if (this.isNegative()) {
      if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());else return this.neg().mul(multiplier).neg();
    } else if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg(); // If both longs are small, use float multiplication
  
  
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned); // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.
  
    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;
    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 0xFFFF;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 0xFFFF;
    var c48 = 0,
        c32 = 0,
        c16 = 0,
        c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
  };
  /**
   * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
   * @function
   * @param {!Long|number|string} multiplier Multiplier
   * @returns {!Long} Product
   */
  
  
  LongPrototype.mul = LongPrototype.multiply;
  /**
   * Returns this Long divided by the specified. The result is signed if this Long is signed or
   *  unsigned if this Long is unsigned.
   * @this {!Long}
   * @param {!Long|number|string} divisor Divisor
   * @returns {!Long} Quotient
   */
  
  LongPrototype.divide = function divide(divisor) {
    if (!isLong(divisor)) divisor = fromValue(divisor);
    if (divisor.isZero()) throw Error('division by zero'); // use wasm support if present
  
    if (wasm) {
      // guard against signed division overflow: the largest
      // negative number / -1 would be 1 larger than the largest
      // positive number, due to two's complement.
      if (!this.unsigned && this.high === -0x80000000 && divisor.low === -1 && divisor.high === -1) {
        // be consistent with non-wasm code path
        return this;
      }
  
      var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(this.low, this.high, divisor.low, divisor.high);
      return fromBits(low, wasm["get_high"](), this.unsigned);
    }
  
    if (this.isZero()) return this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
  
    if (!this.unsigned) {
      // This section is only relevant for signed longs and is derived from the
      // closure library as a whole.
      if (this.eq(MIN_VALUE)) {
        if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) return MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
        else if (divisor.eq(MIN_VALUE)) return ONE;else {
          // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
          var halfThis = this.shr(1);
          approx = halfThis.div(divisor).shl(1);
  
          if (approx.eq(ZERO)) {
            return divisor.isNegative() ? ONE : NEG_ONE;
          } else {
            rem = this.sub(divisor.mul(approx));
            res = approx.add(rem.div(divisor));
            return res;
          }
        }
      } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
  
      if (this.isNegative()) {
        if (divisor.isNegative()) return this.neg().div(divisor.neg());
        return this.neg().div(divisor).neg();
      } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
  
      res = ZERO;
    } else {
      // The algorithm below has not been made for unsigned longs. It's therefore
      // required to take special care of the MSB prior to running it.
      if (!divisor.unsigned) divisor = divisor.toUnsigned();
      if (divisor.gt(this)) return UZERO;
      if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
        return UONE;
      res = UZERO;
    } // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
  
  
    rem = this;
  
    while (rem.gte(divisor)) {
      // Approximate the result of division. This may be a little greater or
      // smaller than the actual value.
      approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber())); // We will tweak the approximate result by changing it in the 48-th digit or
      // the smallest non-fractional digit, whichever is larger.
  
      var log2 = Math.ceil(Math.log(approx) / Math.LN2),
          delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48),
          // Decrease the approximation until it is smaller than the remainder.  Note
      // that if it is too large, the product overflows and is negative.
      approxRes = fromNumber(approx),
          approxRem = approxRes.mul(divisor);
  
      while (approxRem.isNegative() || approxRem.gt(rem)) {
        approx -= delta;
        approxRes = fromNumber(approx, this.unsigned);
        approxRem = approxRes.mul(divisor);
      } // We know the answer can't be zero... and actually, zero would cause
      // infinite recursion since we would make no progress.
  
  
      if (approxRes.isZero()) approxRes = ONE;
      res = res.add(approxRes);
      rem = rem.sub(approxRem);
    }
  
    return res;
  };
  /**
   * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
   * @function
   * @param {!Long|number|string} divisor Divisor
   * @returns {!Long} Quotient
   */
  
  
  LongPrototype.div = LongPrototype.divide;
  /**
   * Returns this Long modulo the specified.
   * @this {!Long}
   * @param {!Long|number|string} divisor Divisor
   * @returns {!Long} Remainder
   */
  
  LongPrototype.modulo = function modulo(divisor) {
    if (!isLong(divisor)) divisor = fromValue(divisor); // use wasm support if present
  
    if (wasm) {
      var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(this.low, this.high, divisor.low, divisor.high);
      return fromBits(low, wasm["get_high"](), this.unsigned);
    }
  
    return this.sub(this.div(divisor).mul(divisor));
  };
  /**
   * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
   * @function
   * @param {!Long|number|string} divisor Divisor
   * @returns {!Long} Remainder
   */
  
  
  LongPrototype.mod = LongPrototype.modulo;
  /**
   * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
   * @function
   * @param {!Long|number|string} divisor Divisor
   * @returns {!Long} Remainder
   */
  
  LongPrototype.rem = LongPrototype.modulo;
  /**
   * Returns the bitwise NOT of this Long.
   * @this {!Long}
   * @returns {!Long}
   */
  
  LongPrototype.not = function not() {
    return fromBits(~this.low, ~this.high, this.unsigned);
  };
  /**
   * Returns count leading zeros of this Long.
   * @this {!Long}
   * @returns {!number}
   */
  
  
  LongPrototype.countLeadingZeros = function countLeadingZeros() {
    return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
  };
  /**
   * Returns count leading zeros. This is an alias of {@link Long#countLeadingZeros}.
   * @function
   * @param {!Long}
   * @returns {!number}
   */
  
  
  LongPrototype.clz = LongPrototype.countLeadingZeros;
  /**
   * Returns count trailing zeros of this Long.
   * @this {!Long}
   * @returns {!number}
   */
  
  LongPrototype.countTrailingZeros = function countTrailingZeros() {
    return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
  };
  /**
   * Returns count trailing zeros. This is an alias of {@link Long#countTrailingZeros}.
   * @function
   * @param {!Long}
   * @returns {!number}
   */
  
  
  LongPrototype.ctz = LongPrototype.countTrailingZeros;
  /**
   * Returns the bitwise AND of this Long and the specified.
   * @this {!Long}
   * @param {!Long|number|string} other Other Long
   * @returns {!Long}
   */
  
  LongPrototype.and = function and(other) {
    if (!isLong(other)) other = fromValue(other);
    return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
  };
  /**
   * Returns the bitwise OR of this Long and the specified.
   * @this {!Long}
   * @param {!Long|number|string} other Other Long
   * @returns {!Long}
   */
  
  
  LongPrototype.or = function or(other) {
    if (!isLong(other)) other = fromValue(other);
    return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
  };
  /**
   * Returns the bitwise XOR of this Long and the given one.
   * @this {!Long}
   * @param {!Long|number|string} other Other Long
   * @returns {!Long}
   */
  
  
  LongPrototype.xor = function xor(other) {
    if (!isLong(other)) other = fromValue(other);
    return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
  };
  /**
   * Returns this Long with bits shifted to the left by the given amount.
   * @this {!Long}
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */
  
  
  LongPrototype.shiftLeft = function shiftLeft(numBits) {
    if (isLong(numBits)) numBits = numBits.toInt();
    if ((numBits &= 63) === 0) return this;else if (numBits < 32) return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);else return fromBits(0, this.low << numBits - 32, this.unsigned);
  };
  /**
   * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */
  
  
  LongPrototype.shl = LongPrototype.shiftLeft;
  /**
   * Returns this Long with bits arithmetically shifted to the right by the given amount.
   * @this {!Long}
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */
  
  LongPrototype.shiftRight = function shiftRight(numBits) {
    if (isLong(numBits)) numBits = numBits.toInt();
    if ((numBits &= 63) === 0) return this;else if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);else return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
  };
  /**
   * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */
  
  
  LongPrototype.shr = LongPrototype.shiftRight;
  /**
   * Returns this Long with bits logically shifted to the right by the given amount.
   * @this {!Long}
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */
  
  LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
    if (isLong(numBits)) numBits = numBits.toInt();
    if ((numBits &= 63) === 0) return this;
    if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
    if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
    return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
  };
  /**
   * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */
  
  
  LongPrototype.shru = LongPrototype.shiftRightUnsigned;
  /**
   * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Shifted Long
   */
  
  LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
  /**
   * Returns this Long with bits rotated to the left by the given amount.
   * @this {!Long}
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Rotated Long
   */
  
  LongPrototype.rotateLeft = function rotateLeft(numBits) {
    var b;
    if (isLong(numBits)) numBits = numBits.toInt();
    if ((numBits &= 63) === 0) return this;
    if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
  
    if (numBits < 32) {
      b = 32 - numBits;
      return fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned);
    }
  
    numBits -= 32;
    b = 32 - numBits;
    return fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned);
  };
  /**
   * Returns this Long with bits rotated to the left by the given amount. This is an alias of {@link Long#rotateLeft}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Rotated Long
   */
  
  
  LongPrototype.rotl = LongPrototype.rotateLeft;
  /**
   * Returns this Long with bits rotated to the right by the given amount.
   * @this {!Long}
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Rotated Long
   */
  
  LongPrototype.rotateRight = function rotateRight(numBits) {
    var b;
    if (isLong(numBits)) numBits = numBits.toInt();
    if ((numBits &= 63) === 0) return this;
    if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
  
    if (numBits < 32) {
      b = 32 - numBits;
      return fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned);
    }
  
    numBits -= 32;
    b = 32 - numBits;
    return fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned);
  };
  /**
   * Returns this Long with bits rotated to the right by the given amount. This is an alias of {@link Long#rotateRight}.
   * @function
   * @param {number|!Long} numBits Number of bits
   * @returns {!Long} Rotated Long
   */
  
  
  LongPrototype.rotr = LongPrototype.rotateRight;
  /**
   * Converts this Long to signed.
   * @this {!Long}
   * @returns {!Long} Signed long
   */
  
  LongPrototype.toSigned = function toSigned() {
    if (!this.unsigned) return this;
    return fromBits(this.low, this.high, false);
  };
  /**
   * Converts this Long to unsigned.
   * @this {!Long}
   * @returns {!Long} Unsigned long
   */
  
  
  LongPrototype.toUnsigned = function toUnsigned() {
    if (this.unsigned) return this;
    return fromBits(this.low, this.high, true);
  };
  /**
   * Converts this Long to its byte representation.
   * @param {boolean=} le Whether little or big endian, defaults to big endian
   * @this {!Long}
   * @returns {!Array.<number>} Byte representation
   */
  
  
  LongPrototype.toBytes = function toBytes(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
  };
  /**
   * Converts this Long to its little endian byte representation.
   * @this {!Long}
   * @returns {!Array.<number>} Little endian byte representation
   */
  
  
  LongPrototype.toBytesLE = function toBytesLE() {
    var hi = this.high,
        lo = this.low;
    return [lo & 0xff, lo >>> 8 & 0xff, lo >>> 16 & 0xff, lo >>> 24, hi & 0xff, hi >>> 8 & 0xff, hi >>> 16 & 0xff, hi >>> 24];
  };
  /**
   * Converts this Long to its big endian byte representation.
   * @this {!Long}
   * @returns {!Array.<number>} Big endian byte representation
   */
  
  
  LongPrototype.toBytesBE = function toBytesBE() {
    var hi = this.high,
        lo = this.low;
    return [hi >>> 24, hi >>> 16 & 0xff, hi >>> 8 & 0xff, hi & 0xff, lo >>> 24, lo >>> 16 & 0xff, lo >>> 8 & 0xff, lo & 0xff];
  };
  /**
   * Creates a Long from its byte representation.
   * @param {!Array.<number>} bytes Byte representation
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @param {boolean=} le Whether little or big endian, defaults to big endian
   * @returns {Long} The corresponding Long value
   */
  
  
  Long.fromBytes = function fromBytes(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
  };
  /**
   * Creates a Long from its little endian byte representation.
   * @param {!Array.<number>} bytes Little endian byte representation
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {Long} The corresponding Long value
   */
  
  
  Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
    return new Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
  };
  /**
   * Creates a Long from its big endian byte representation.
   * @param {!Array.<number>} bytes Big endian byte representation
   * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
   * @returns {Long} The corresponding Long value
   */
  
  
  Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
    return new Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
  };
  
  var _default = Long;
  exports.default = _default;
  return "default" in exports ? exports.default : exports;
})({});
if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() { return Long; }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
else {}


/***/ }),

/***/ "./node_modules/@temporalio/workflow/package.json":
/*!********************************************************!*\
  !*** ./node_modules/@temporalio/workflow/package.json ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@temporalio/workflow","version":"1.8.2","description":"Temporal.io SDK Workflow sub-package","keywords":["temporal","workflow","isolate"],"bugs":{"url":"https://github.com/temporalio/sdk-typescript/issues"},"repository":{"type":"git","url":"git+https://github.com/temporalio/sdk-typescript.git","directory":"packages/workflow"},"homepage":"https://github.com/temporalio/sdk-typescript/tree/main/packages/workflow","license":"MIT","author":"Temporal Technologies Inc. <sdk@temporal.io>","main":"lib/index.js","types":"lib/index.d.ts","scripts":{},"dependencies":{"@temporalio/common":"1.8.2","@temporalio/proto":"1.8.2"},"devDependencies":{"source-map":"^0.7.4"},"publishConfig":{"access":"public"},"files":["src","lib"],"gitHead":"d85bf54da757741b438f8d39a0e7265b80d4f0d6"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = globalThis.__webpack_module_cache__;
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!****************************************************!*\
  !*** ./src/workflows-autogenerated-entrypoint.cjs ***!
  \****************************************************/

const api = __webpack_require__(/*! @temporalio/workflow/lib/worker-interface.js */ "./node_modules/@temporalio/workflow/lib/worker-interface.js");

api.overrideGlobals();

exports.api = api;

exports.importWorkflows = function importWorkflows() {
  return __webpack_require__(/* webpackMode: "eager" */ /*! ./src/workflows.ts */ "./src/workflows.ts");
}

exports.importInterceptors = function importInterceptors() {
  return [
    __webpack_require__(/* webpackMode: "eager" */ /*! ./node_modules/@temporalio/worker/lib/workflow-log-interceptor.js */ "./node_modules/@temporalio/worker/lib/workflow-log-interceptor.js")
  ];
}

})();

__TEMPORAL__ = __webpack_exports__;
/******/ })()
;