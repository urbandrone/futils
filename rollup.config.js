import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';


const BANNER = `/* @banner futils | www.npmjs.com/package/futils */`;

const CONFIG_BABEL = {
    exclude: ['node_modules/**', '*.json']
};
const CONFIG_UGLYF = {
    output: {
        comments(_, c) {
            if (c.type === "comment2") {
                return /@banner|@cc_on/.test(c.value);
            }
        }
    }
};

export default [{
    entry: 'src/__main.js',
    dest: 'futils.min.js',
    format: 'umd',
    moduleName: 'futils',
    sourceMap: false,
    banner: BANNER,
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLYF)]
}, {
    entry: 'src/adt.js',
    dest: 'adt.js',
    format: 'cjs',
    sourceMap: false,
    banner: BANNER,
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLYF)]
}, {
    entry: 'src/lambda/__export.js',
    dest: 'lambda.js',
    format: 'cjs',
    sourceMap: false,
    banner: BANNER,
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLYF)]
}, {
    entry: 'src/generics/__export.js',
    dest: 'generics.js',
    format: 'cjs',
    sourceMap: false,
    banner: BANNER,
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLYF)]
}, {
    entry: 'src/data/__export.js',
    dest: 'data.js',
    format: 'cjs',
    sourceMap: false,
    banner: BANNER,
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLYF)]
}]