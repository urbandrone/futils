import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';


const BANNER = `/* @banner futils | www.npmjs.com/package/futils */`;

export default {
    entry: 'sources/__main.js',
    plugins: [
        babel({
            exclude: ['node_modules/**', '*.json']
        }),
        uglify({
            output: {
                comments: function(_, c) {
                    if (c.type === "comment2") {
                        return /@banner|@cc_on/.test(c.value);
                    }
                }
            }
        })
    ],
    targets: [{
        dest: 'futils.js',
        format: 'umd',
        moduleName: 'futils',
        sourceMap: false,
        banner: BANNER
    }]
};