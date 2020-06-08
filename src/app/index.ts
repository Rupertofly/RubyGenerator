import Generator from 'yeoman-generator';
// @ts-ignore
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
    scopeName: string;
    sb: boolean;
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
            },
            {
                type: 'confirm',
                message: 'Add D3',
                name: 'd3',
                default: true,
            },
            {
                type: 'confirm',
                message: 'Add Storybook?',
                name: 'sb',
                default: false,
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
        ]);

        console.log(path.basename(this.destinationRoot()));
        console.log(answer);
        this.answers = answer;
    }
    async writing() {
        this.log('copying Files', this.templatePath('_package.json'));
        const ROOT = this.destinationRoot();
        const tP = (d) => this.templatePath(d);
        const dP = (d) => this.destinationPath(d);

        this.sourceRoot(path.join(__dirname, '../templates'));
        this.fs.copyTpl(tP('_package.json'), dP('package.json'), this.answers);
        this.fs.copy(tP('.eslintrc.json'), dP('.eslintrc.json'));
        this.fs.copy(tP('_tsconfig.json'), dP('tsconfig.json'));
        this.fs.copy(tP('_.gitignore'), dP('.gitignore'));
        this.fs.write(dP('src/index.ts'), '');
        this.fs.write(dP('test/test.ts'), '');

        if (this.answers.webpack) {
            this.fs.copy(tP('_webpack.common.js'), dP('webpack.common.js'));
            this.fs.copy(tP('_webpack.dev.js'), dP('webpack.dev.js'));
            this.fs.copyTpl(tP('index.pug'), dP('src/index.pug'), {
                title: C.pascal(this.answers.name),
            });
        }
        if (this.answers.sb) {
            this.fs.copy(tP('_main.js'), dP('.storybook/main.js'));
            this.fs.write(dP('stories/main.stories.tsx'), `import '';`);
        }
        const scripts: { [name: string]: string } = {
            test: 'ts-node test/test.ts',
        };

        if (this.answers.webapp)
            scripts.chrome =
                '/Applications/Chromium.app/Contents/MacOS/chromium --remote-debugging-port=9222 --app="http://localhost:8080"';
        else {
            scripts.build = 'tsc';
            scripts.watch = 'tsc -w';
        }
        if (this.answers.webpack) {
            scripts.build = 'webpack --config webpack.prod.js';
            scripts.dev = 'webpack-dev-server --config webpack.dev.js';
        }
        if (this.answers.sb) scripts.storybook = 'start-storybook';
        this.fs.extendJSON(dP('package.json'), {
            scripts,
        });
    }
    async install() {
        this.log('installing yarn stuff');
        const devDeps = [
            '@typescript-eslint/eslint-plugin',
            '@typescript-eslint/parser',
            'eslint',
            'typescript',
            'tslib',
            'tape',
            'ts-node',
            'prettier',
            'eslint-config-prettier',
            'eslint-plugin-prettier',
            'eslint-plugin-tsdoc',
        ];
        const deps: string[] = [];

        if (this.answers.react) deps.push('react', 'react-dom');
        if (this.answers.d3) deps.push('d3');

        if (this.answers.webpack)
            devDeps.push(
                'webpack',
                'webpack-merge',
                'ts-loader',
                'css-loader',
                'sass-loader',
                'style-loader',
                'html-webpack-plugin',
                'mini-css-extract-plugin',
                'pug',
                'pug-loader'
            );
        if (this.answers.sb) {
            devDeps.push(
                '@storybook/preset-typescript',
                '@storybook/react',
                'babel-loader',
                '@babel/core'
            );
        }
        this.yarnInstall(deps, {});
        this.yarnInstall(devDeps, { dev: true });
    }
}
export default RubyGen;
