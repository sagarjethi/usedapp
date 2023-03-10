"use strict";
exports.__esModule = true;
exports.imports = exports.commonImports = void 0;
var path = require("path");
exports.commonImports = "\nimport { Falsy, Params, QueryParams, TransactionOptions, useCall, useContractFunction } from '@usedapp/core'\nimport { Contract, utils } from 'ethers'\n";
var imports = function (_a) {
    var typesDir = _a.typesDir, outDir = _a.outDir, contractName = _a.contractName;
    return "\nimport { ".concat(contractName, ", ").concat(contractName, "__factory } from '").concat(path.relative(outDir, typesDir), "'\nconst ").concat(contractName, "Interface = new utils.Interface(").concat(contractName, "__factory.abi)\n\n");
};
exports.imports = imports;
