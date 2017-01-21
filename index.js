const Docma = require('docma');

const config = {
    src: [
        './sources/**/*.js',
        './README.md'
    ],
    dest: './output/docs'
};

Docma.create()
    .build(config)
    .catch(function (error) {
        console.log(error);
    });