const path = require('path');
const globby = require('globby');
const fs = require('fs');
const md5File = require('md5-file');
const url = require('url');
const config = require('./config');
const moment = require('moment');

function getPathFromUrl(url) {
    return url.split(/[?#]/)[0];
}

function hashFile(filePath) {
    try {
        return md5File.sync(getPathFromUrl(filePath));
    }
    catch (e) {
        return '';
    }
}

function appendQueryString(url, dict) {
    let queryString = '';
    for (let key in dict) {
        if (dict.hasOwnProperty(key) && dict[key]) {
            queryString += ['&', key, '=', dict[key]].join('');
        }
    }

    if (!queryString) {
        return url;
    }

    const isExistedQueryString = url.indexOf('?') >= 0;
    if (!isExistedQueryString) {
        url += '?';

        queryString = queryString.substring(1); // remove '&'' character
    }

    return url + queryString;
}

const matchers = [
    // script with quoted src
    { pattern: /(<script\s[^>]*?src=["'])([\s\S]+?)(["'][^>]*>\s*<\/script>)/gi },

    // script with unquoted src
    { pattern: /(<script\s[^>]*?src=)([\s\S]+?)((?:>|\s[^>]*>)\s*<\/script>)/gi },
    //
    // link with quoted href and optional end tag
    { pattern: /(<link\s[^>]*?href=["'])([\s\S]+?)(["'][^>]*>(?:\s*<\/link>)?)/gi },
    //
    // link with unquoted href and optional end tag
    { pattern: /(<link\s[^>]*?href=)([\s\S]+?)((?:>|\s[^>]*>)(?:\s*<\/link>)?)/gi },

    // img with quoted src
    { pattern: /(<img\s[^>]*?src=["'])(.+?)(["'][^>]*>)/gi },
    // img with unquoted src
    { pattern: /(<img\s[^>]*?src=)(.+?)((?:>|\s[^>]*>))/gi },

    // URL matcher for CSS
    { pattern: /(url\(['"]?)(.+?)(['"]?\))/gi },

    // HTML TEMPLATE ROUTES
    { pattern: /('|")([^\'\"\n]+\.html)([^\'\"\n]+)?('|")/gi },

    // OTHERS URL
    { pattern: /(["'\(])\s*([\w\_\/\.\-]*\.(jpg|jpeg|png|gif|js|css|swf))[^\)"']*\s*([\)"'])/gi }
];

(async () => {
    const paths = await globby([
        './build/server/views/**/*.ejs',

        './build/public/js/components/*.js',
        './build/app.bundle.js',

        './build/public/css/*.css',
        './build/app.css'
    ]);

    const asset = 'build/public';
    const assetAbsolute = path.resolve(asset);

    paths.forEach(function (file) {

        const mainPath = path.dirname(file);

        fs.readFile(file, 'utf-8', function (error, contents) {
            if (error) {
                console.log(error);

                throw error;
            }

            for (let index = 0; index < matchers.length; index++) {
                contents = contents.replace(matchers[index].pattern, function (match, pre, filePath) {

                    filePath = filePath.replace(/'/g, '').replace(/\"/g, '');

                    let relative;
                    if (/^\//.test(filePath)) {
                        relative = filePath.replace(/^\//, '');
                    } else if (mainPath.indexOf(assetAbsolute) !== -1) {
                        relative = path.relative(asset, path.resolve(asset, mainPath, filePath));
                    }
                    else {
                        relative = filePath;
                    }

                    // Check file existed
                    let hash = hashFile(path.join(asset, relative));
                    if (!hash) {
                        // try again
                        relative = path.relative(asset, path.resolve(asset, mainPath.substr(0, mainPath.lastIndexOf('\\')), filePath));

                        hash = hashFile(path.join(asset, relative));
                        if (!hash) {
                            return match;
                        }
                    }

                    /*
                    if (match.indexOf('hash=') === -1) {
                        relative = appendQueryString(relative, { hash: hash });
                    }
                    */

                    return relative ? match.replace(filePath, url.resolve(`${config.cloudinary.assetUrlPrefix}/v${moment().format('YYYYMMDDHHMMSS')}/${config.cloudinary.assetFolder}/public/`, relative)) : match;
                });
            }

            fs.writeFile(file, contents, function (err) {
                if (err) {
                    console.log('Write file error');
                    console.log(err);

                    throw err;
                }
            });
        })
    });
})();
