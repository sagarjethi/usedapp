"use strict";
exports.__esModule = true;
var generate_1 = require("./generate");
// TS-Node is required because we need to be importing typechain files.
require('ts-node/register/transpile-only');
console.log('EXPERIMENTAL: UseDApp automatic hook generation tool');
var usage = function () {
    console.log("\n  Usage:\n  \n  USEDAPP_OUT_DIR=<destination directory>   USEDAPP_TYPES_DIR=<typechain files>   usedapp-generate-hooks\n  ");
};
if (!process.env.USEDAPP_OUT_DIR || !process.env.USEDAPP_TYPES_DIR) {
    usage();
    process.exit(-1);
}
(0, generate_1.generate)()
    .then(function () { return console.log('✅ All done.'); })["catch"](function (e) {
    console.error(e);
    process.exit(1);
});
