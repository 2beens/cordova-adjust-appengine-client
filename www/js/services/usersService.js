function getUsersList(callback) {
	// Execute a GET request. Takes a URL, parameters, and headers.
	cordovaHTTP.get(TASKS_SERVER_BASE + "/user", {
        action: "all"
    }, { Authorization: "OAuth2: token" }, function(response) {
        console.log('get all users status: ' + response.status);
        callback(response.data);
    }, function(response) {
        console.error(response.error);
        callback('');
    });
}