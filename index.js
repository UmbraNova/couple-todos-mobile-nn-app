import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://couple-todos-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// =========================================== Experimental
// =========================================== Experimental

// user credentials to LS and group to DB START
// DB = database
// LS = localstorage

const groupsInDB = ref(database, "groupCredentials")
const enterGroupButtonEl = document.getElementById("enter-group-button")
const newGroupButtonEl = document.getElementById("new-group-button")
const groupNameFieldEl = document.getElementById("group-name-field")
const passwordFieldEl = document.getElementById("password-field")
const groupExitButtonEl = document.getElementById("exit-group-button")

let groupExistsEl = document.getElementById("group-exists-el")


enterGroupButtonEl.addEventListener("click", enterGroup)
newGroupButtonEl.addEventListener("click", addGroupInDB)
groupExitButtonEl.addEventListener("click", exitGroupInLS)


let groupArray = []

onValue(groupsInDB, function(snapshot) {
    if (snapshot.exists()) {
        groupArray = Object.values(snapshot.val())        
    } else {
        console.log("no group exists yet in database")
    }
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
    } else {
        groupExistsEl.textContent = "Group doesn't exist or password is incorect"
    }
}

function checkGroupExistsInDB(groupName) {
    let groupExistsInDB = false
    for (let i = 0; i < groupArray.length; i++) {
        let curGroupName = groupArray[i][0]
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
    changeVisualEfterExit()
}

// Login pop-up window START
const openLoginWindow = document.getElementById("open-login-window-btn")
const loginWindow = document.getElementById("login-window")

// Show the pop-up window when the link is clicked
openLoginWindow.addEventListener("click", function(event) {
    event.preventDefault()
    loginWindow.style.display = "block"
})

// Hide the pop-up window when the close button is clicked and user logs in/sings in
function closeLoginWindow() {
    loginWindow.style.display = "none"
    groupExistsEl.textContent = ""
}
// Login pop-up window END


const isUserLoggedInGroup = JSON.parse( localStorage.getItem("isUserLogged"))
if (isUserLoggedInGroup == true) {
    // openLoginWindow.style.backgroundColor = "#232D3F"
    let groupNameLS = JSON.parse(localStorage.getItem("groupNameLS"))
    changeVisualAfterLogIn(groupNameLS)
}
// need another option... to check from DB


// user credentials to LS and group to DB END



// -------------------------------------------------------- ready section

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
    let inputValue = inputFieldEl.value
    push(shoppingListInDB, inputValue)
    changeBGColorOnMobile(addButtonEl)
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
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
        let exactItemLocationInDB = ref(database, `shoppingList/${itemID}`) 
        remove(exactItemLocationInDB)
    })
    shoppingListEl.append(newEl)
}
