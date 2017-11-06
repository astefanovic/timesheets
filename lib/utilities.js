var crypto = require('crypto');

exports.getSalt = () => {
    return crypto.randomBytes(32).toString('hex');
};

exports.hashPassword = (pass, salt) => {
    var hash = crypto.createHash('sha256');
    hash.update(pass);
    hash.update(salt);
    return hash.digest('hex');
};
