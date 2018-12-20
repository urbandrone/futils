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
        file: 'dist/futils.js',
        format: 'umd',
        name: 'futils',
        sourcemap: false,
        banner: BANNER
    },
    plugins: [babel(CONFIG_BABEL), uglify(CONFIG_UGLIFY)]
}]