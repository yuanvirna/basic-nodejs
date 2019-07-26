/*jshint esversion: 6 */

function buatLogger(req,res, next) {
    console.log('sedang log gan ..!');
    next();
    
}
module.exports = buatLogger;