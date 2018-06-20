import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'iife';
const compress = process.env.UGLIFY === 'true';

const babelOptions = {
    exclude: 'node_modules/**',
    presets: [['es2015', { modules: false }], 'stage-0'],
    babelrc: false,
};

const dest = {
    amd: `dist/amd/i18nextLocalStorageBackend${compress ? '.min' : ''}.js`,
    umd: `dist/umd/i18nextLocalStorageBackend${compress ? '.min' : ''}.js`,
    iife: `dist/iife/i18nextLocalStorageBackend${compress ? '.min' : ''}.js`,
}[format];

const uglifyPlugin = uglify({
    cache: true,
    parallel: true,
    sourceMap: false,
    uglifyOptions: {
        mangle: true,
        dead_code: true,
        keep_fnames: false,
        keep_classnames: false,
        compress: {
            drop_console: true,
        },
        output: {
            comments: false,
            beautify: false,
        },
    },
});

export default {
    input: 'src/index.js',
    plugins: [
        babel(babelOptions),
        nodeResolve({ jsnext: true }),
        // no-wrap
    ].concat(compress ? uglifyPlugin : []),
    // moduleId: 'i18nextLocalStorageCache',
    output: {
        format,
        file: dest,
        name: 'i18nextLocalStorageBackend',
    },
};
