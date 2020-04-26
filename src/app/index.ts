import Generator from 'yeoman-generator';
import * as C from 'case';
import path from 'path';
interface PromptAnswers {
    webapp: boolean;
    webpack?: boolean;
    react?: boolean;
    d3: boolean;
    canvasTest?: boolean;
    name: string;
    desc: string;
    author: string;
    license: string;
    scoped: boolean;
    scopeName: boolean;
}
class RubyGen extends Generator {
    answers: PromptAnswers;
    constructor(args?, opts?) {
        super(args, opts);
    }
    async prompting() {
        this.log('Hello');

        const answer: PromptAnswers = await this.prompt([
            {
                type: 'confirm',
                message: 'Is this a WebApp?',
                name: 'webapp',
                default: false,
            },
            {
                type: 'confirm',
                message: 'Add Webpack',
                name: 'webpack',
                default: true,
                when: ({ webapp }) => webapp,
            },
            {
                type: 'confirm',
                message: 'Add React',
                name: 'react',
                default: false,
                when: ({ webapp }) => webapp,
            },
            {
                type: 'confirm',
                message: 'Add D3',
                name: 'd3',
                default: true,
            },
            {
                type: 'confirm',
                message: 'setup a canvas enrioment for testing?',
                name: 'canvasTest',
                default: false,
                when: ({ webapp }) => !webapp,
            },
            {
                type: 'confirm',
                message: 'setup a canvas enrioment for testing?',
                name: 'canvasTest',
                default: false,
                when: ({ webapp }) => !webapp,
            },
            {
                type: 'input',
                message: 'what is the name of this project',
                name: 'name',
                validate: (input: string) => {
                    const valid =
                        input.length < 200 &&
                        /^[^A-Z]+$/.test(input) &&
                        !/^[\.-]/.test(input);

                    return valid
                        ? true
                        : 'Name must not contain capital letters or begin with a dash or dot';
                },
                default: C.kebab(path.basename(this.destinationRoot())),
            },
            {
                type: 'input',
                message: 'description?',
                name: 'desc',
                default: 'A new project by Ruby!',
            },
            {
                type: 'input',
                message: 'author?',
                name: 'author',
                default: 'Ruby Quail <ruby@rubyquail.design>',
            },
            {
                type: 'input',
                message: 'license?',
                name: 'license',
                default: 'MIT',
            },
            {
                type: 'confirm',
                message: 'scope to username?',
                name: 'scoped',
                default: false,
            },
            {
                type: 'input',
                message: 'What scope name?',
                name: 'scopeName',
                default: 'rupertofly',
                validate: (input: string) => {
                    const valid =
                        input.length < 64 && /^[^A-Z,@]+$/.test(input);

                    return valid ? true : 'no caps or dot';
                },
                when: ({ scoped }) => scoped,
                store: true,
            },
            {
                type: 'confirm',
                message: 'run gitHub create',
                name: 'create',
                default: false,
            },
        ]);

        console.log(path.basename(this.destinationRoot()));
        console.log(answer);
        this.answers = answer;
    }
    async writing() {
        this.log('copying Files');
        const ROOT = this.destinationRoot();
        const dP = this.destinationPath;
        const tP = this.templatePath;

        dP.bind(this);
        tP.bind(this);
    }
    async install() {
        this.log('installing yarn stuff');
    }
}
export default RubyGen;
const x = new RubyGen();
