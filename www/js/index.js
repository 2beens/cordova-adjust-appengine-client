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
                alert('Cannot populate users dropdown. Received null/undefined.');
                return;
            }

            var usersDropDown = document.getElementById('myDropdown');
            while (usersDropDown.firstChild) {
                usersDropDown.removeChild(usersDropDown.firstChild);
            }

            var usersListJson = JSON.parse(usersList);

            for (var i = 0; i < usersListJson.length; i++){
                var user = usersListJson[i];
                var userName = user['userName'];

                var userNameNode = document.createElement('p');
                userNameNode.innerHTML = userName;
                usersDropDown.appendChild(userNameNode);
            }
        });
    }
};

document.getElementById('getAllUsers').addEventListener('click', getAllusers);
document.getElementById('addUser').addEventListener('click', addNewUser);
document.getElementById('select-user-list').addEventListener('click', selectUserListHandler);

function getAllusers() {
    getUsersList(function(usersList) {
        alert(usersList);    
    });
}

function addNewUser() {
    var newUserName = document.getElementById('newUserNameInput').value;
    persistNewUser(newUserName, function(response) {
        alert(response);
        document.getElementById('newUserNameInput').value = '';
    });
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function selectUserListHandler() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

app.initialize();