import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'sources/__main.js',
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        uglify()
    ],
    targets: [{
        dest: 'futils.js',
        format: 'umd',
        moduleName: 'futils',
        sourceMap: false,
        banner: `// futils -- https://www.npmjs.com/package/futils`
    }]
};