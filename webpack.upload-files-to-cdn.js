const cloudinary = require('cloudinary');
const config = require('./config');
const recursive = require("recursive-readdir");

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

recursive("dist", ['*.ejs',
    '.DS_Store',
    'server',
    'locales',
    'app.bundle.js',
    'app.bundle.js.map'
], function (err, files) {
    // `files` is an array of file paths
    //console.log(files);

    for (let index = 0; index < files.length; index++) {
        cloudinary.v2.uploader.upload(files[index], {
            folder: config.cloudinary.assetFolder,
            use_filename: true,
            resource_type: 'raw',
            overwrite: true,
            public_id: files[index].replace('dist/', ''),
            invalidate: true
        }, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                console.log(`DONE: ${files[index]}`)
            }
        });
    }
});

