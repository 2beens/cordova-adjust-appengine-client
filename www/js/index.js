/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    selectedUser: null,
    selectedUserName: null,

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        this.populateUsersDropdown();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    populateUsersDropdown: function() {
        getAllUsers(function(usersList) {
            if(usersList === null && usersList === undefined) {
                app.showSimpleDialog('Users dropdown error', 'Cannot populate users dropdown. Received null/undefined.');
                return;
            }

            var usersDropDown = document.getElementById('users-list-dropdown');
            while (usersDropDown.firstChild) {
                usersDropDown.removeChild(usersDropDown.firstChild);
            }

            for (var i = 0; i < usersList.length; i++){
                var user = usersList[i];
                var userName = user['userName'];

                var userNameButton = document.createElement('INPUT');
                userNameButton.setAttribute('type', 'button');
                userNameButton.setAttribute('value', userName);
                userNameButton.setAttribute('id', userName);
                userNameButton.addEventListener('click', function(event){
                    closeUsersListDropDown();
                    app.selectedUserName = event.currentTarget.id;
                    document.getElementById('selected-user-name').innerHTML = app.selectedUserName;

                    // get user
                    getUser(app.selectedUserName, function(user) {
                        app.selectedUser = user;
                        app.populateSelectedUserTasks();
                    });

                    // app.refreshSelectedUser();
                    // app.populateSelectedUserTasks();
                });

                usersDropDown.appendChild(userNameButton);
            }
        });
    },

    // refreshSelectedUser: function() {
    //     getUser(app.selectedUserName, function(user) {
    //         app.selectedUser = user;
    //     });
    // },

    populateSelectedUserTasks: function() {
        var tasks = app.selectedUser.tasks;
        var tasksDiv = document.getElementById('tasks-list');
        while (tasksDiv.firstChild) {
            tasksDiv.removeChild(tasksDiv.firstChild);
        }
        
        for (var i = 0; i < tasks.length; i++){
            var task = tasks[i];
            var taskDiv = document.createElement('DIV');
            taskDiv.setAttribute('class', 'task-div');
            taskDiv.innerHTML = task.text;
            tasksDiv.appendChild(taskDiv);
        }
    },

    showDialog: function(title, message, buttonText, callback) {
        navigator.notification.alert(message, alertCallback, title, buttonText);
        function alertCallback() {
            if(callback) {
                callback();
            }
        }
    },

    showSimpleDialog: function(title, message) {
        navigator.notification.alert(message, null, title, 'Close');
    },

    promptDialog: function(title, message, buttonLabels, promptCallback) {
        var message = "Am I Prompt Dialog?";
        var title = "PROMPT";
        var buttonLabels = ["YES","NO"];
        var defaultText = "Default"
        navigator.notification.prompt(message, promptCallback, 
            title, buttonLabels, defaultText);

        function promptCallback(result) {
            console.log("You clicked " + result.buttonIndex + " button! \n" + 
            "You entered " +  result.input1);
        }
    }
};

document.getElementById('getAllUsers').addEventListener('click', getAllusersHandler);
document.getElementById('addUser').addEventListener('click', addNewUserHandler);
document.getElementById('select-user-list').addEventListener('click', selectUserListHandler);
document.getElementById('addNewTask').addEventListener('click', addNewTaskHandler);

function getAllusersHandler() {
    getUsersList(function(usersList) {
        app.showDialog('Users List', usersList, 'Close');
    });
}

function addNewUserHandler() {
    var newUserName = document.getElementById('newUserNameInput').value;
    persistNewUser(newUserName, function(response) {
        app.showSimpleDialog('Add new user', response);
        document.getElementById('newUserNameInput').value = '';
    });
}

function addNewTaskHandler() {
    if(app.selectedUser === null || app.selectedUser === undefined) {
        app.showSimpleDialog('Error!', 'Select the user first!');
        return;
    }

    navigator.notification.prompt('Enter task text:', promptCallback, 
        'Add New Task', ['Add', 'Cancel'], 'Task text here...');

    function promptCallback(result) {
        if(result.buttonIndex === 1) {
            if(result.input1 === null || result.input1 === undefined || result.input1.length === 0) {
                app.showSimpleDialog('Error', 'Task text cannot be empty!');
                return;
            }

            // add new task
            var newTaskText = result.input1;
            addNewTaskToDb(app.selectedUser.userName, newTaskText, function(response) {
                if(response.success && response.success === 1) {
                    app.showSimpleDialog('New Task Added', response.message);
                    getUser(app.selectedUserName, function(user) {
                        app.selectedUser = user;
                        app.populateSelectedUserTasks();
                    });
                } else if(response.success && response.success === 0) {
                    app.showSimpleDialog('Task not added!', response.message);
                } else if(response) {
                    app.showSimpleDialog('Task not added!', response);
                } else {
                    app.showSimpleDialog('Error! Task not added!', 'Response from server is null!');
                }
            });            
        }
    }
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function selectUserListHandler() {
    document.getElementById("users-list-dropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        closeUsersListDropDown();
    }
}

function closeUsersListDropDown() {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
}

app.initialize();