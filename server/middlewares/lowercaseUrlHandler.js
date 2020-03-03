const url = require('url');

export default async function lowercaseUrlHandler(req, res, next) {
    if (req.method === 'GET' && req.path.toLowerCase() !== req.path) {
        const parsedUrl = url.parse(req.originalUrl);
        parsedUrl.pathname = parsedUrl.pathname.toLowerCase();

        return res.redirect(301, url.format(parsedUrl));
    } else {
        next()
    }
}
