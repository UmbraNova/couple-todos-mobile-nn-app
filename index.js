import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://couple-todos-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)


const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// DB = database
// LS = localstorage

const groupsInDB = ref(database, "groupCredentials")
const enterGroupButtonEl = document.getElementById("enter-group-button")
const newGroupButtonEl = document.getElementById("new-group-button")
const groupNameFieldEl = document.getElementById("group-name-field")
const passwordFieldEl = document.getElementById("password-field")
const groupExitButtonEl = document.getElementById("exit-group-button")

let groupExistsEl = document.getElementById("group-exists-el")

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
        groupExistsEl.textContent = "Group already exists"
    } else {
        push(groupsInDB, [groupNameFieldEl.value, passwordFieldEl.value])
        enterGroup()
    }   
}

function enterGroup() {
    let groupNameValue = groupNameFieldEl.value
    if (checkGroupExistsInDB(groupNameValue)) {
        changeVisualAfterLogIn(groupNameValue)
        logInUserLS(groupNameValue)
        closeLoginWindow()
        location.reload()
    } else {
        groupExistsEl.textContent = "Group doesn't exist or password is incorect"
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
    groupNameLS = "0"
    shoppingListEl.innerHTML = "No items... yet"
    changeVisualEfterExit()
    location.reload()
}

const openLoginWindow = document.getElementById("open-login-window-btn")
const loginWindow = document.getElementById("login-window")

openLoginWindow.addEventListener("click", function(event) {
    event.preventDefault()
    loginWindow.style.display = "block"
})

function closeLoginWindow() {
    loginWindow.style.display = "none"
    groupExistsEl.textContent = ""
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
// $(":root").css("--category-multiply", "4")


// =========================================== Experimental
// =========================================== Experimental

addButtonEl.addEventListener("click", function() {
    if (isUserLoggedInGroup == true) {
        let inputValue = inputFieldEl.value
        push(itemsListInDB, inputValue)
        changeBGColorOnMobile(addButtonEl)
        clearInputFieldEl()
    } else {
        shoppingListEl.innerHTML = "You need to enter a group..."
    }
})

onValue(itemsListInDB, function(snapshot) {
    if (snapshot.exists() && isUserLoggedInGroup == true) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            // let currentItemID = currentItem[0]
            // let currentItemValue = currentItem[1] 
            appendToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactItemLocationInDB = ref(database, `${groupNameLS}/${itemID}`) 
        remove(exactItemLocationInDB)
    })
    shoppingListEl.append(newEl)
}
