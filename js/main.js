let users = [];
let isAdd = true;
let currentId = null;

let tableBody = document.getElementById("table-info");
let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");
let nationality = document.getElementById("nationality");
let chekLogin = document.getElementById("chek-login");

function showUsersInfo(users){
    let out = "";
    let index = 1;
    for(let user of users){
        out +=`
            <tr>
                <th scope="row">${index}</th>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.nationality}</td>
                <td>
                    <button id="${user.id}" type="button" class="edit btn btn-primary">Edit</button>
                </td>
                <td>
                    <button id="${user.id}" type="button" class="delete btn btn-danger">Delete</button>
                </td>
            </tr>
        `;
        index ++;
    }
    tableBody.innerHTML = out;
    Array.from(document.getElementsByClassName('delete'))
    .map(btn => btn.addEventListener('click', deleteUser));

    Array.from(document.getElementsByClassName('edit'))
    .map(btn => btn.addEventListener('click', editUser));
}

// POST User in DB
function addNewUser(user){
    fetch("https://students-3d096.firebaseio.com/.json", {
        method:"POST",
        headers: {
            "Content-type": "application/json"
        }, 
        body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => { 
        users.push({...user, id: data.name});
        showUsersInfo(users);
    })
}

// Edit User in DB
function editUserInfo(user){
    fetch(`https://students-3d096.firebaseio.com/${user.id}.json`, {
        method:"PUT",
        headers: {
            "Content-type": "application/json"
        }, 
        body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
        debugger 
        users = users.map(user => {
            if(user.id == data.id) user = data;
            return user;
        })
        showUsersInfo(users);
        isAdd = true;
        currentId = null;
    })
}

// Delete User from DB
function deleteUser(event){
    let id = event.currentTarget.id;
    fetch(`https://students-3d096.firebaseio.com/${id}.json`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        users = users.filter(user => user.id != id);
        showUsersInfo(users);
    })
}

function editUser(event){
    debugger
    isAdd = false;
    currentId = event.currentTarget.id;
    user = [...users].filter(user => user.id == currentId)[0];
    username.value = user.username;
    email.value = user.email;
    password.value = user.password;
    nationality.value = user.nationality;
    chekLogin.checked = user.chekLogin;
    chekLogin.value = user.chekLogin;
}

document.getElementById('user-form').addEventListener('submit', handleForm);


function checkInputs(data){
    for(let inp of data){
        if(inp.id == "username" && !inp.value){
            return true;
        }

        if(inp.id == "email" && !inp.value){
            return true;
        }

        if(inp.id == "password" && !inp.value){
            return true;
        }

        if(inp.id == "nationality" && !inp.value){
            return true;
        }

        if(inp.id == "chek-login" && !inp.value){
            return true;
        }
    }
    return false;
}

function handleForm(event){
    event.preventDefault();
    let user ={
        username: null,
        email: null,
        password: null,
        nationality: null,
        chekLogin: null
    }

    if(checkInputs(event.currentTarget)) return;

    for(let item of event.currentTarget){
        if(item.id === "username"){
            user.username = item.value;
        }

        if(item.id === "email"){
            user.email = item.value;
        }

        if(item.id === "password"){
            user.password = item.value;
        }

        if(item.id === "nationality"){
            user.nationality = item.value;
        }

        if(item.id === "chek-login"){
            user.chekLogin = item.checked;
        }
    }
    debugger
    if(isAdd){
        addNewUser(user);
    } else {
        user.id = currentId;
        editUserInfo(user);
    }
   

    event.currentTarget.reset();
}


function getUsersInfo(){
    fetch('https://students-3d096.firebaseio.com/.json')
    .then(res => res.json())
    .then(data => {
        let arr = [];
        for(let key in data){
            arr.push({...data[key], id: key});
        }
        users = arr;
        showUsersInfo(users);
    })
}

getUsersInfo();


