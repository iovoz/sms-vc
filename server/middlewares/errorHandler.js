// CATCH UP ALL ERRORS FROM SYSTEM EXCLUDE PROXY ERROR

export default function errorHandler(error, req, res, next) {
    const ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
    console.error(`Client IP: ${ip}, RequestUrl: ${req.originalUrl}`);
    console.error(error.stack);

    const response = error.response;

    if (response && response.status === 401 && req.session && req.session.userToken) {
        req.session.destroy();
    }

    // AJAX REQUEST
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        if (!response) {
            res.status(500).json({ message: "INTERNAL SERVER ERROR" });
        } else {
            res.status(response.status).json(response.data);
        }
    } else {
        if (!response) {
            res.status(500);
            res.render('error');
        } else {
            switch (response.status) {
                case 401:
                case 400:
                case 404: {
                    res.status(response.status);
                    res.render('error');
                    break;
                }

                default: {
                    res.status(500);
                    res.render('error');
                    break;
                }
            }
        }
    }
}
