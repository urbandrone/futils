import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';


const BANNER = `/* @banner futils | www.npmjs.com/package/futils */`;

const CONFIG_BABEL = {
    exclude: ['node_modules/**', '*.json']
};
const CONFIG_UGLIFY = {
    output: {
        comments(_, c) {
            if (c.type === "comment2") {
                return /@banner|@cc_on/.test(c.value);
            }
        }
    }
};

export default [{
    input: 'src/__export.js',
    output: {
        file: 'dist/futils.min.js',
        format: 'umd',
        name: 'futils',
        sourcemap: false,
        banner: BANNER
    },
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLIFY)]
}, {
    input: 'src/adt.js',
    output: {
        file: 'dist/adt.js',
        format: 'cjs',
        sourcemap: false,
        banner: BANNER
    },
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLIFY)]
}, {
    input: 'src/lambda/__export.js',
    output: {
        file: 'dist/lambda.js',
        format: 'cjs',
        sourcemap: false,
        banner: BANNER
    },
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLIFY)]
}, {
    input: 'src/generics/__export.js',
    output: {
        file: 'dist/generics.js',
        format: 'cjs',
        sourcemap: false,
        banner: BANNER
    },
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLIFY)]
}, {
    input: 'src/data/__export.js',
    output: {
        file: 'dist/data.js',
        format: 'cjs',
        sourcemap: false,
        banner: BANNER
    },
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLIFY)]
}, {
    input: 'src/monoid/__export.js',
    output: {
        file: 'dist/monoid.js',
        format: 'cjs',
        sourcemap: false,
        banner: BANNER
    },
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLIFY)]
}, {
    input: 'src/optic/__export.js',
    output: {
        file: 'dist/optic.js',
        format: 'cjs',
        sourcemap: false,
        banner: BANNER
    },
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLIFY)]
}]