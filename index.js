import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://couple-todos-default-rtdb.europe-west1.firebasedatabase.app/"
}

// DB = database
// LS = localstorage


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
const removeBtn = document.getElementById("remove-btn")


if (JSON.parse(localStorage.getItem("groupNameLS")) === null) {
    localStorage.setItem("groupNameLS", JSON.stringify("0"))
}

let isUserLoggedInGroup = JSON.parse(localStorage.getItem("isUserLogged"))
userNameEl.value = JSON.parse(localStorage.getItem("userNameLS"))

const usersInGroupEl = document.getElementById('people-dropdown-menu')
let usersInGroubOnlineInDB = ""
let userIDinDB = ""
const usersInGroupDB = ref(database, `${groupNameLS}NkvAEtqN5`)
const itemsListInDB = ref(database, groupNameLS)
let groupArrayDB = []
const itemColors = ["#FFFDF8", "#FFC0D9", "#6DB9EF", "#ED8C35"]






// const mainColor = document.documentElement.style.getPropertyValue("--main-bg-color")
// const mainHoverColor = document.documentElement.style.getPropertyValue("--main-bg-hover-color")
const changeColorsBtn = document.getElementById("main-colors-btn")
const changeBgColorsBtn = document.getElementById("background-colors-btn")
changeColorsBtn.addEventListener("click", changeMainColor)
changeBgColorsBtn.addEventListener("click", changeMainBgColor)

// list of lists, first color is the main color of buttons, second is the hover color
const mainColors = [["#29ADB2", "#0766AD"], ["#005B41", "#232D3F"], ["#000000", "#000000"]]
const mainBgColors = [["#EEF0F4", "#ffffff"], ["#161A30", "#31304D"], ["#092635", "#1B4242"]]



if (JSON.parse(localStorage.getItem("mainColorIndex")) === null) {
    localStorage.setItem("mainColorIndex", JSON.stringify(0))
}
if (JSON.parse(localStorage.getItem("mainBgColorIndex")) === null) {
    localStorage.setItem("mainBgColorIndex", JSON.stringify(0))
}

let mainColorIndex = JSON.parse(localStorage.getItem("mainColorIndex"))
let mainBgColorIndex = JSON.parse(localStorage.getItem("mainBgColorIndex"))

let mainColor = mainColors[mainColorIndex][0]
let mainHoverColor = mainColors[mainColorIndex][1]

let mainBgColor = mainBgColors[mainBgColorIndex][0]
let mainBgSecondColor = mainBgColors[mainBgColorIndex][1]

document.documentElement.style.setProperty("--main-color", mainColor)
document.documentElement.style.setProperty("--main-hover-color", mainHoverColor)

document.documentElement.style.setProperty("--main-bg-color", mainBgColor)
document.documentElement.style.setProperty("--main-bg-second-color", mainBgSecondColor)


function changeMainBgColor() {
    let newIndex = mainBgColorIndex + 1
    if (newIndex > mainBgColors.length - 1) {
        newIndex = 0
    }
    localStorage.setItem("mainBgColorIndex", JSON.stringify(newIndex))
    window.location.replace(window.location.href)
    // history.pushState({}, "", window.location.href)
}

function changeMainColor() {
    let newIndex = mainColorIndex + 1
    if (newIndex > mainColors.length - 1) {
        newIndex = 0
    }
    localStorage.setItem("mainColorIndex", JSON.stringify(newIndex))
    window.location.replace(window.location.href)
    // history.pushState({}, "", window.location.href)
}






enterGroupButtonEl.addEventListener("click", enterGroup)
newGroupButtonEl.addEventListener("click", addGroupInDB)
groupExitButtonEl.addEventListener("click", exitGroupInLS)
document.getElementById("exit-login-window").addEventListener("click", function(e) {
    loginWindow.style.display = "none"
})

window.addEventListener("keypress", function(keyPressed) {
    if (keyPressed.key == "Enter") {
        addItemToList()
    }
})
addButtonEl.addEventListener("click", addItemToList)

userNameEl.addEventListener("change", function() {
    setUserNameLS(userNameEl.value)
    const userNameLS = JSON.parse(localStorage.getItem("userNameLS"))
    userNameEl.value = userNameLS
})

openLoginWindow.addEventListener("click", function() {
    if (userNameEl.value) {
        setUserNameLS(userNameEl.value)
        loginWindow.style.display = "block"
    } else {
        changeBgColorAndBack(userNameEl, "#F97272", "#DCE1EB")
    }
})


    
function removeOnlineUserFromGroupDB(gName) {
    let exactUserLocationInDB = ref(database, `${gName}NkvAEtqN5/${userIDinDB}`)
    remove(exactUserLocationInDB)
}

function addUserOnlineInGroupDB(gName) {
    if (userNameEl.value) {
        let usersInGroupDB = ref(database, `${gName}NkvAEtqN5`)
        push(usersInGroupDB, userNameEl.value)
    }
}

onValue(usersInGroupDB, function(snapshot) {
    if (snapshot.exists()) {
        usersInGroubOnlineInDB = Object.entries(snapshot.val())
        let allUsers = []
        for (let i = 0; i < usersInGroubOnlineInDB.length; i++) {
            if (usersInGroubOnlineInDB[i][1] == userNameEl.value) {
                userIDinDB = usersInGroubOnlineInDB[i][0]
            }
            allUsers.push(usersInGroubOnlineInDB[i][1])
        }
        if (isUserLoggedInGroup) {
            changeBgColorAndBack(peopleInGroupButtonEl, "wheat", mainColor)
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

function setUserNameLS(name="0") {
    localStorage.setItem("userNameLS", JSON.stringify(name))
}

onValue(groupsInDB, function(snapshot) {
    if (snapshot.exists()) {
        groupArrayDB = Object.values(snapshot.val())
    }
})

function addGroupInDB() {
    if (checkGroupExistsInDB(groupNameFieldEl.value)) {
        loginErrorInfoEl.textContent = "Group already exists"
        changeBgColorAndBack(loginErrorInfoEl, "#F97272", "#ffffff")
    } else if (testNameAndPassword(groupNameFieldEl.value, passwordFieldEl.value)) {
        push(groupsInDB, [groupNameFieldEl.value, passwordFieldEl.value])
        enterGroup()
    } else {
        loginErrorInfoEl.innerHTML = "Group name and password length must be between 4 characters and 14, no whitespaces"
        changeBgColorAndBack(loginErrorInfoEl, "#F97272", "#ffffff")
    }
}

function testNameAndPassword(group, password) {
    if (15 > group.length && group.length > 3 && !(/\s/).test(group) && password.length > 3 && !(/\s/).test(password)) {
        return true
    }
}

function isGroupMatchingPassword(group, password) {
    for (let groupCredentials of groupArrayDB) {
        if (groupCredentials[0] === group && groupCredentials[1] === password) {
            return true
        }
    }
    return false
}

function enterGroup() {
    let groupNameValue = groupNameFieldEl.value.trim()
    if (checkGroupExistsInDB(groupNameValue) && isGroupMatchingPassword(groupNameValue, passwordFieldEl.value)) {

        changeVisualAfterLogIn(groupNameValue)
        logInUserAndGroupLS(groupNameValue)
        closeLoginWindow()
        addUserOnlineInGroupDB(groupNameValue)
        // location.reload()
        window.location.replace(window.location.href)

    } else {
        loginErrorInfoEl.textContent = "Group doesn't exist or password is incorect"
        changeBgColorAndBack(loginErrorInfoEl, "#F97272", "#ffffff")
    }
}

function checkGroupExistsInDB(groupName) {
    for (let i = 0; i < groupArrayDB.length; i++) {
        let curGroupName = groupArrayDB[i][0]
        if (groupName == curGroupName) {
            return true
        }
    }
    return false
}

function logInUserAndGroupLS(groupName) {
    localStorage.setItem("isUserLogged", JSON.stringify(true))
    localStorage.setItem("groupNameLS", JSON.stringify(groupName))
}

function changeVisualAfterLogIn(name="Login group") {
    openLoginWindow.textContent = name
    groupNameFieldEl.value = ""
    passwordFieldEl.value = ""
}

function changeVisualEfterExit() {
    openLoginWindow.textContent = "Login group"
    groupNameFieldEl.value = ""
    passwordFieldEl.value = ""
}

function exitGroupInLS() {
    closeLoginWindow()
    localStorage.setItem("isUserLogged", JSON.stringify(false))
    localStorage.setItem("groupNameLS", JSON.stringify("0"))
    // location.reload()
    window.location.replace(window.location.href)
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


function addItemToList() {
    if (inputFieldEl.value.length > 27 || !inputFieldEl.value) {
        changeBgColorAndBack(inputFieldEl, "#F97272", "#DCE1EB")
    } else if (isUserLoggedInGroup == true && userNameEl.value && inputFieldEl.value) {
        let inputValue = {name: inputFieldEl.value, color: "#FFFDF8", index: 0}
        push(itemsListInDB, inputValue)
        changeBgColorAndBack(addButtonEl, mainHoverColor, mainColor)
        clearInputFieldEl()
    } else if (!userNameEl.value) {
        changeBgColorAndBack(userNameEl, "#F97272", "#DCE1EB")
    } else {
        groupListEl.textContent = "You need to enter a group..."
        changeBgColorAndBack(groupListEl, "#F97272", "#EEF0F4")
    }
}

function clearGroupListEl() {
    groupListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

onValue(itemsListInDB, function(snapshot) {
    if (snapshot.exists() && isUserLoggedInGroup == true) {
        let itemsArray = Object.entries(snapshot.val())
        clearGroupListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendToGroupListEl(currentItem)
        }    
    } else {
        groupListEl.innerHTML = "No items... yet"
    }
})

window.addEventListener("click", function(e) {
    if (e.target.localName === "button" || e.target.localName === "label" || e.target.localName === "span") {
        const elem = document.getElementById(e.target.id)
        playElAnimation(elem)
    }
})

function playElAnimation(elem) {
    elem.classList.add("expand")
    setTimeout(function() {
        elem.classList.remove("expand")
    }, 210)
}


function appendToGroupListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    // if (typeof itemValue === 'string' || itemValue instanceof String) {
        // newEl.textContent = itemValue
    // } else {
    newEl.textContent = itemValue.name
    newEl.style.backgroundColor = itemValue.color
    // }
   
    newEl.addEventListener("click", function() {
        playElAnimation(newEl)
        if (removeBtn.checked) {
            let exactItemLocationInDB = ref(database, `${groupNameLS}/${itemID}`) 
            remove(exactItemLocationInDB)
        } else {
            let newIndex = itemValue.index + 1
            if (newIndex > itemColors.length - 1) {
                newIndex = 0
            }
            let exactItemLocationInDB = ref(database, `${groupNameLS}/${itemID}`)
            update(exactItemLocationInDB, {color: itemColors[newIndex], index: newIndex})
        }
    })
    groupListEl.append(newEl)
}

