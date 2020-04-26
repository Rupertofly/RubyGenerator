import Generator from 'yeoman-generator';

class RubyGen extends Generator {
    constructor(args?, opts?) {
        super(args, opts);
        this.log('hey boi');
        this.prompt([{ type: 'input', name: 'baz' }]);
    }
    copyFiles() {}
}
export default RubyGen;
const x = new RubyGen();
