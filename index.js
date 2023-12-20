import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://couple-todos-default-rtdb.europe-west1.firebasedatabase.app/"
}

// DB = database
// LS = localstorage


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// TODO: live chat with feed (objects?)
// TODO: ability to select/color/icon an item from list baset on your account
// TODO: fix the password required, when entering group


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



const app = initializeApp(appSettings)
const database = getDatabase(app)

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const groupListEl = document.getElementById("group-list")

const groupsInDB = ref(database, "groupCredentials")
const enterGroupButtonEl = document.getElementById("enter-group-button")
const newGroupButtonEl = document.getElementById("new-group-button")
const groupNameFieldEl = document.getElementById("group-name-field")
const passwordFieldEl = document.getElementById("password-field")
const groupExitButtonEl = document.getElementById("exit-group-button")

const openLoginWindow = document.getElementById("open-login-window-btn")
const loginWindow = document.getElementById("login-window")
let loginErrorInfoEl = document.getElementById("login-error-info-el")
const userNameEl = document.getElementById("user-name")
const peopleInGroupButtonEl = document.getElementById("people-in-group")

let groupNameLS = JSON.parse(localStorage.getItem("groupNameLS"))

if (JSON.parse(localStorage.getItem("groupNameLS")) === null) {
    localStorage.setItem("groupNameLS", JSON.stringify("0"))
}

let isUserLoggedInGroup = JSON.parse(localStorage.getItem("isUserLogged"))
userNameEl.value = JSON.parse(localStorage.getItem("userNameLS"))


const usersInGroupEl = document.getElementById('people-dropdown-menu')

let usersInGroubOnlineInDB = ""
let userIDinDB = ""

let usersInGroupDB = ref(database, `${groupNameLS}NkvAEtqN5`)

// const emergencyExitEl = document.getElementById("emergency-btn")
// emergencyExitEl.addEventListener("click", function() {
//     exitGroupInLS()
// })

function removeOnlineUserFromGroupDB(gName) {
    let exactUserLocationInDB = ref(database, `${gName}NkvAEtqN5/${userIDinDB}`)
    remove(exactUserLocationInDB)
}

function addUserOnlineInGroupDB(gName) {
    if (userNameEl.value) {
        usersInGroupDB = ref(database, `${gName}NkvAEtqN5`)
        push(usersInGroupDB, userNameEl.value)
    }
}

onValue(usersInGroupDB, function(snapshot) {
    if (snapshot.exists()) {
        usersInGroubOnlineInDB = Object.entries(snapshot.val())
        let allUsers = []
        for (let i = 0; i < usersInGroubOnlineInDB.length; i++) {
            if (usersInGroubOnlineInDB[i][1] == userNameEl.value) {
                // console.log(usersInGroubOnlineInDB[i])
                userIDinDB = usersInGroubOnlineInDB[i][0]
            }
            allUsers.push(usersInGroubOnlineInDB[i][1])
        }
        if (isUserLoggedInGroup) {
            changeBgColorAndBack(peopleInGroupButtonEl, "wheat", "#005B41")
            renderUserOnline(allUsers)
        }
    }
})


function renderUserOnline(users) {
    let totalUsersOnline = ""
    let usersCount = users.length
    for (let user of users) {
        totalUsersOnline += `<li><button disabled>${user}</button></li>`
    }
    usersInGroupEl.innerHTML = totalUsersOnline
    
    // Change the height of category baset on elements in it
    document.documentElement.style.setProperty("--group-multiply", usersCount)
}

function changeBgColorAndBack(elem, color1, color2) {
    elem.style.backgroundColor = color1
    setTimeout(function() {
        elem.style.backgroundColor = color2
    }, 150)
}


const itemsListInDB = ref(database, groupNameLS)

enterGroupButtonEl.addEventListener("click", enterGroup)
newGroupButtonEl.addEventListener("click", addGroupInDB)
groupExitButtonEl.addEventListener("click", exitGroupInLS)

let groupArrayDB = []

userNameEl.addEventListener("change", function() {
    setUserNameLS(userNameEl.value)
    const userNameLS = JSON.parse(localStorage.getItem("userNameLS"))
    userNameEl.value = userNameLS
})

openLoginWindow.addEventListener("click", function(event) {
    event.preventDefault()
    if (userNameEl.value) {
        setUserNameLS(userNameEl.value)
        loginWindow.style.display = "block"
    } else {
        changeBgColorAndBack(userNameEl, "#F97272", "#DCE1EB")
    }
})
        
function setUserNameLS(name="0") {
    localStorage.setItem("userNameLS", JSON.stringify(name))
}

onValue(groupsInDB, function(snapshot) {
    if (snapshot.exists()) {
        groupArrayDB = Object.values(snapshot.val())        
    } else {
        console.log("no group exists yet in database")
    }
})

function addGroupInDB() {
    if (checkGroupExistsInDB(groupNameFieldEl.value)) {
        loginErrorInfoEl.textContent = "Group already exists"
    } else if (testNameAndPassword(groupNameFieldEl.value, passwordFieldEl.value)) {
        push(groupsInDB, [groupNameFieldEl.value, passwordFieldEl.value])
        enterGroup()
    } else {
        loginErrorInfoEl.innerHTML = "Group name length must be between 4 characters and 14"
    }
}

function testNameAndPassword(group, password) {
    if (15 > group.length && group.length > 3 && !(/\s/).test(group) && password.length > 3 && !(/\s/).test(password)) {
        return true
    }
}

function enterGroup() {
    let groupNameValue = groupNameFieldEl.value.trim()
    if (checkGroupExistsInDB(groupNameValue)) {
        // no password check!!!
        // no password check!!!
        // no password check!!!
        // add password check!!!
        // add password check!!!
        // add password check!!!
        changeVisualAfterLogIn(groupNameValue)
        logInUserAndGroupLS(groupNameValue)
        closeLoginWindow()
        addUserOnlineInGroupDB(groupNameValue)
        location.reload()
    } else {
        loginErrorInfoEl.textContent = "Group doesn't exist or password is incorect"
    }
}

function checkGroupExistsInDB(groupName) {
    let groupExistsInDB = false
    for (let i = 0; i < groupArrayDB.length; i++) {
        let curGroupName = groupArrayDB[i][0]
        if (groupName == curGroupName) {
            groupExistsInDB = true
        }
    }
    return groupExistsInDB
}

function logInUserAndGroupLS(groupName) {
    localStorage.setItem("isUserLogged", JSON.stringify(true))
    localStorage.setItem("groupNameLS", JSON.stringify(groupName))
}

function changeVisualAfterLogIn(name="Login group") {
    openLoginWindow.textContent = name
    openLoginWindow.style.backgroundColor = "#232D3F"
    groupNameFieldEl.value = ""
    passwordFieldEl.value = ""
}

function changeVisualEfterExit() {
    openLoginWindow.textContent = "Login group"
    openLoginWindow.style.backgroundColor = "#005B41"
    groupNameFieldEl.value = ""
    passwordFieldEl.value = ""
}

function exitGroupInLS() {
    closeLoginWindow()
    localStorage.setItem("isUserLogged", JSON.stringify(false))
    localStorage.setItem("groupNameLS", JSON.stringify("0"))
    location.reload()
    groupListEl.innerHTML = "No items... yet"
    changeVisualEfterExit()
    removeOnlineUserFromGroupDB(groupNameLS)
    groupNameLS = "0"
}


function closeLoginWindow() {
    loginWindow.style.display = "none"
    loginErrorInfoEl.textContent = ""
}

if (isUserLoggedInGroup == true) {
    userNameEl.setAttribute("readonly", "")
    changeVisualAfterLogIn(groupNameLS)
} else {
    userNameEl.removeAttribute("readonly", "")
}

addButtonEl.addEventListener("click", function() {
    if (isUserLoggedInGroup == true && userNameEl.value && inputFieldEl.value) {
        let inputValue = inputFieldEl.value
        push(itemsListInDB, inputValue)
        // changeBgColorOnMobile(addButtonEl)
        changeBgColorAndBack(addButtonEl, "#232D3F", "#005B41")
        clearInputFieldEl()
    } else if (!userNameEl.value) {
        // userNameBgColorRed()
        changeBgColorAndBack(userNameEl, "#F97272", "#DCE1EB")
    } else if (!inputFieldEl.value) {
        // inputItemBgColorRed()
        changeBgColorAndBack(userNameEl, "#F97272", "#DCE1EB")
    } else {
        // if the input is empty and user is logged
        // this is to set everything to default in case of error in the data.
        localStorage.setItem("isUserLogged", JSON.stringify(false))
        localStorage.setItem("groupNameLS", JSON.stringify("0"))
        groupNameLS = "0"
        groupListEl.innerHTML = "You need to enter a group..."
    }
    })

onValue(itemsListInDB, function(snapshot) {
    if (snapshot.exists() && isUserLoggedInGroup == true) {
        let itemsArray = Object.entries(snapshot.val())
        clearGroupListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendToGroupListEl(currentItem)
        }    
    } else {
        // localStorage.setItem("isUserLogged", JSON.stringify(false))
        // localStorage.setItem("groupNameLS", JSON.stringify("0"))
        // groupNameLS = "0" 
        // DONE: fixed groupname set to 0 when 0 items in list, automatic loggout ex:  isUserLogged = false | groupNameLS = 0

        groupListEl.innerHTML = "No items... yet"
    }
})

function clearGroupListEl() {
    groupListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendToGroupListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    // let test = `
    // <select>
    //     <option value="">name1</option>
    //     <option value="">name2</option>
    //     <option value="">name3</option>
    //     <option value="">name4</option>
    // </select>
    // `
    
    newEl.addEventListener("click", function() {
        let exactItemLocationInDB = ref(database, `${groupNameLS}/${itemID}`) 
        remove(exactItemLocationInDB)
    })
    groupListEl.append(newEl)
}
