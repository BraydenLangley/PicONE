var actions = {
    response: function(res, status_code, error_message, response_message) {
        res.status(status_code);
        res.json({
            status: status_code,
            error: error_message,
            response: response_message
        });
    }
}

module.exports = actions;
