module.exports = function(err, req, res, next) {
    console.log("express error: ", err);
    if(err.apiCode >= 400){
        res.status().json({
            apiCode: err.apiCode, apiMessage: err.apiMessage
        });
    } else {
        next();
    }
}