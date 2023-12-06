import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

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

let isUserLoggedInGroup = JSON.parse( localStorage.getItem("isUserLogged"))
let groupNameLS = JSON.parse(localStorage.getItem("groupNameLS"))
const itemsListInDB = ref(database, groupNameLS)

enterGroupButtonEl.addEventListener("click", enterGroup)
newGroupButtonEl.addEventListener("click", addGroupInDB)
groupExitButtonEl.addEventListener("click", exitGroupInLS)

let groupArrayDB = []
// let groupKeysDB = []

onValue(groupsInDB, function(snapshot) {
    if (snapshot.exists()) {
        groupArrayDB = Object.values(snapshot.val())        
        // groupKeysDB = Object.keys(snapshot.val())
    } else {
        console.log("no group exists yet in database")
    }
    // console.log(groupKeysDB)
})

function addGroupInDB() {
    if (checkGroupExistsInDB(groupNameFieldEl.value)) {
        loginErrorInfoEl.textContent = "Group already exists"
    } else if (testNameAndPassword()) {
            push(groupsInDB, [groupNameFieldEl.value, passwordFieldEl.value])
            enterGroup()
    } else {
        loginErrorInfoEl.innerHTML = "Empty name and password, length must be 4 characters or more"
    }
}

function testNameAndPassword() {
    // if (groupNameFieldEl.value.length > 3 && /\S/.test(groupNameFieldEl.value) && passwordFieldEl.value.length > 3 && /\S/.test(passwordFieldEl.value)) {
        return true
    // }
}

function enterGroup() {
    let groupNameValue = groupNameFieldEl.value
    if (checkGroupExistsInDB(groupNameValue)) {
        location.reload()
        changeVisualAfterLogIn(groupNameValue)
        logInUserLS(groupNameValue)
        closeLoginWindow()
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

function logInUserLS(groupName) {
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
    groupNameLS = "0"
    groupListEl.innerHTML = "No items... yet"
    changeVisualEfterExit()
}

openLoginWindow.addEventListener("click", function(event) {
    event.preventDefault()
    loginWindow.style.display = "block"
})

function closeLoginWindow() {
    loginWindow.style.display = "none"
    loginErrorInfoEl.textContent = ""
}

if (isUserLoggedInGroup == true) {
    changeVisualAfterLogIn(groupNameLS)
}

// Change the background color on mobile devices
function changeBGColorOnMobile(changeElBG) {
    changeElBG.style.backgroundColor = "#232D3F"  // green | --main-bg-color
    setTimeout(changeBack, 200, changeElBG)
    function changeBack(changeElBG) {
        changeElBG.style.backgroundColor = "#005B41"  // dark blue | --main-bg-hover-color
    }
}

// Change the height of category baset on elements in it
document.documentElement.style.setProperty("--category-multiply", "4")


addButtonEl.style.color = "blue"

addButtonEl.addEventListener("click", function() {
    addButtonEl.style.color = "red"
})

// addButtonEl.addEventListener("click", function() {
//     addButtonEl.style.color = "red"
//     if (isUserLoggedInGroup == true) {
//         let inputValue = inputFieldEl.value
//         push(itemsListInDB, inputValue)
//         changeBGColorOnMobile(addButtonEl)
//         clearInputFieldEl()
//     } else {
//         // if the input is empty and user is logged
//         // this is to set everything to default in case of error in the data.
//         groupListEl.innerHTML = "You need to enter a group..."
//         localStorage.setItem("isUserLogged", JSON.stringify(false))
//         localStorage.setItem("groupNameLS", JSON.stringify("0"))
//         groupNameLS = "0"
//         location.reload()
//         groupListEl.innerHTML = "No items... yet"
//     }
// })

onValue(itemsListInDB, function(snapshot) {
    if (snapshot.exists() && isUserLoggedInGroup == true) {
        let itemsArray = Object.entries(snapshot.val())
        clearGroupListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            // let currentItemID = currentItem[0]
            // let currentItemValue = currentItem[1] 
            appendToGroupListEl(currentItem)
        }    
    } else {
        localStorage.setItem("isUserLogged", JSON.stringify(false))
        localStorage.setItem("groupNameLS", JSON.stringify("0"))
        groupNameLS = "0"
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
    
    newEl.addEventListener("click", function() {
        let exactItemLocationInDB = ref(database, `${groupNameLS}/${itemID}`) 
        remove(exactItemLocationInDB)
    })
    groupListEl.append(newEl)
}
