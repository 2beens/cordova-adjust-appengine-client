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

function persistNewUser(newUserName, callback) {
	if(newUserName === null || newUserName === undefined || newUserName.length === 0) {
		callback('username cannot be null/undefined/empty');
		return;
	}

	// http://localhost:8080/user?userName={newUserName}
	cordovaHTTP.post(TASKS_SERVER_BASE + "/user", {
	    userName: newUserName
	}, { Authorization: "OAuth2: token" }, function(response) {
	    // prints 200
	    console.log(response.status);
	    callback(response.data);
	}, function(response) {
	    // prints 403
	    console.log(response.status);
	    
	    //prints Permission denied 
	    console.log(response.error);

	    callback(response.error);
	});
}