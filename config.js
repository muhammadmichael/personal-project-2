const fs = require('fs')
var key = fs.readFileSync('C:/Users/Profesor/Desktop/personal-project-2/certs/key.pem');

module.exports = {
    secret: key
}