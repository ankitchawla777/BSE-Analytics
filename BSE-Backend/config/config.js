var env = process.env.NODE_ENV || 'development'
console.log("***env:", env)


if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://developer:password777@ds149672.mlab.com:49672/learning-genie-dev";
}
else if (env === 'production') {
    process.env.MONGODB_URI = "mongodb://admin:password777@ds012578.mlab.com:12578/learning-genie";
}

process.logger = function (msg, err) {
    if (env === 'development') {
        if (err) {
            console.log(JSON.stringify(err, null, 2));
        } else {
            console.log(JSON.stringify(msg, null, 2));
        }
    }
}

let session = require('express-session');
let sess_secret = '0dc529ba-5051-4cd6-8b67-c9a901bb8bdf';
module.exports = {
    session,
    sess_secret
}