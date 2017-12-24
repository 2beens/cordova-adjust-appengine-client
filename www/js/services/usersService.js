function getAllUsers(callback) {
	cordovaHTTP.get(TASKS_SERVER_BASE + "/user", {
        action: "all-json"
    }, { Authorization: "OAuth2: token" }, function(response) {
        console.log('get all users as json status: ' + response.status);
        callback(response.data);
    }, function(response) {
    	if(response.error) {
        	console.error(response.error);
    	} else if(response) {    		
    		console.error(response);
    	} else { 	
    		console.error('cannot get users json list');
    	}

    	callback('{"error":"cannot get users json list"}');
    });
}

function getUsersList(callback) {
	// Execute a GET request. Takes a URL, parameters, and headers.
	cordovaHTTP.get(TASKS_SERVER_BASE + "/user", {
        action: "all"
    }, { Authorization: "OAuth2: token" }, function(response) {
        console.log('get all users status: ' + response.status);
        callback(response.data);
    }, function(response) {
    	if(response.error) {
        	console.error(response.error);
    	} else if(response) {    		
    		console.error(response);
    	} else { 	
    		console.error('cannot get users string list');
    	}

    	callback('{"error":"cannot get users string list"}');
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
		if(response && response.error) {
		    // prints 403
		    console.log(response.status);
		    
		    //prints Permission denied 
		    console.log(response.error);

		    callback(response.error);
		} else {
			callback('cannot persist user');
		}
	});
}