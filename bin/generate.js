"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.generate = void 0;
var fs = require("fs");
var path = require("path");
var imports_1 = require("./imports");
function generate() {
    return __awaiter(this, void 0, void 0, function () {
        var typesDir, outDir, factories;
        return __generator(this, function (_a) {
            if (!process.env.USEDAPP_TYPES_DIR)
                throw new Error('Missing USEDAPP_TYPES_DIR');
            if (!process.env.USEDAPP_OUT_DIR)
                throw new Error('Missing USEDAPP_OUT_DIR');
            typesDir = path.join(process.cwd(), process.env.USEDAPP_TYPES_DIR);
            outDir = path.join(process.cwd(), process.env.USEDAPP_OUT_DIR);
            factories = require(typesDir).factories;
            fs.mkdirSync(outDir, { recursive: true });
            Object.keys(factories).forEach(function (factoryName) {
                var contractName = factoryName.split('_')[0];
                var filename = "".concat(outDir, "/").concat(contractName, ".ts");
                var output = imports_1.commonImports + (0, imports_1.imports)({ typesDir: typesDir, outDir: outDir, contractName: contractName });
                console.log("Processing ".concat(contractName));
                var factory = factories[factoryName];
                var Interface = factory.createInterface();
                var abi = factory.abi;
                Object.keys(Interface.functions).forEach(function (fn) {
                    var functionName = fn.split('(')[0];
                    var fnABI = abi.find(function (a) { return a.name === functionName; });
                    if (['view', 'pure'].includes(fnABI === null || fnABI === void 0 ? void 0 : fnABI.stateMutability)) {
                        output += "\nexport const use".concat(contractName, "_").concat(functionName, " = (\n  contractAddress: Falsy | string,\n  args: Falsy | Params<").concat(contractName, ", '").concat(functionName, "'>,\n  queryParams: QueryParams = {}\n) => {\n  return useCall<").concat(contractName, ", '").concat(functionName, "'>(\n    contractAddress\n      && args\n      && {\n        contract: new Contract(contractAddress, ").concat(contractName, "Interface) as ").concat(contractName, ",\n        method: '").concat(functionName, "',\n        args\n      }, queryParams\n  )\n}\n\n");
                    }
                    else { // Non-View function
                        output += "\nexport const use".concat(contractName, "_").concat(functionName, " = (\n  contractAddress: Falsy | string,\n  options?: TransactionOptions\n) => {\n  return useContractFunction<").concat(contractName, ", '").concat(functionName, "'>(\n    contractAddress && new Contract(contractAddress, ").concat(contractName, "Interface) as ").concat(contractName, ",\n    '").concat(functionName, "',\n    options\n  )\n}\n");
                    }
                });
                output += "\nexport const use".concat(contractName, " = {\n  ").concat(Object.keys(Interface.functions)
                    .map(function (fn) { return fn.split('(')[0]; })
                    .map(function (fn) { return "".concat(fn, ": use").concat(contractName, "_").concat(fn); })
                    .join(",\n  "), "\n}\n");
                fs.writeFileSync(filename, output);
            });
            return [2 /*return*/];
        });
    });
}
exports.generate = generate;
