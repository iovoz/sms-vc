const app = require('./main.js');

// Temporary hack to ignore SSL certificates
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';

const port = process.env.PORT || 3001;
const host = process.env.HOST || 'localhost';

if (isProduction) {
    // Since the production app will be put behind a load balancer (Nginx) which terminates https connections,
    // we use http here. AND WE CANNOT USE app.listen(port, host, function()) since binding the host (to localhost)
    // will fail the health check by the load balancer which pings the Node instance by IP.
    app.listen(port, function () {
        console.log('Production server listening on port ' + port + '...');
    });

} else {
    app.listen(port, host, function () {
        console.log(`Server is running on http://${host}:${port} in ${environment} mode`);
    });
}
