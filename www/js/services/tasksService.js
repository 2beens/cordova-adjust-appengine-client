function getUserTasks(userName, callback) {
	cordovaHTTP.get(TASKS_SERVER_BASE + "/user", {
        userName: userName
    }, { Authorization: "OAuth2: token" }, function(response) {
        console.log('get user [' + userName + '] status: ' + response.status);
        var userJson = JSON.parse(response.data);
        callback(userJson.tasks);
    }, function(response) {
    	if(response.error) {
        	console.error(response.error);
    	} else if(response) {    		
    		console.error(response);
    	} else { 	
    		console.error('cannot get user: ' + userName);
    	}

    	callback('{"error":"cannot get user: ' + userName + '"}');
    });
}

function addNewTaskToDb(user, newTaskText, callback) {
    cordovaHTTP.post(TASKS_SERVER_BASE + "/tasks", {
        userName: user,
        text: newTaskText
    }, { Authorization: "OAuth2: token" }, function(response) {
        console.log(response.status);
        var rasponseJson = JSON.parse(response.data);
        callback(rasponseJson);
    }, function(response) {
        if(response && response.error) {
            console.log(response.status);
            console.log(response.error);
            callback(response.error);
        } else {
            callback({"success":0, "message":"new task not added"});
        }
    });
}
