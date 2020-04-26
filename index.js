"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yeoman_generator_1 = tslib_1.__importDefault(require("yeoman-generator"));
class RubyGen extends yeoman_generator_1.default {
    constructor(args, opts) {
        super(args, opts);
        this.log('hey boi');
        this.prompt([{ type: 'input', name: 'baz' }]);
    }
    copyFiles() { }
}
exports.default = RubyGen;
const x = new RubyGen();
//# sourceMappingURL=index.js.map