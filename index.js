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

// user credentials to database START
// DB = database
// LS = localstorage

const usersInDB = ref(database, "usersCredentials")
const logInButtonEl = document.getElementById("login-button")
const singInButtonEl = document.getElementById("singin-button")
const usernameFieldEl = document.getElementById("username-field")
const passwordFieldEl = document.getElementById("password-field")

let userExistsEl = document.getElementById("user-exists-el")


logInButtonEl.addEventListener("click", logUserInLS)
singInButtonEl.addEventListener("click", addUserInDB)


let usersArray

onValue(usersInDB, function(snapshot) {
    if (snapshot.exists()) {
        usersArray = Object.values(snapshot.val())        
    } else {
        console.log("no user exists yet in database")
    }
})

let usernameValue = usernameFieldEl.value
let passwordValue = passwordFieldEl.value

function checkUserExistsInDB() {
    let userExistsInDB = false
    for (let i = 0; i < usersArray.length; i++) {
        let curUserName = usersArray[i][0]
        let curUserPassword = usersArray[i][1]
        if (usernameFieldEl.value == curUserName && passwordFieldEl.value == curUserPassword) {
            userExistsInDB = true
        }
    }
    return userExistsInDB
}

function addUserInDB() {
    if (checkUserExistsInDB()) {
        userExistsEl.textContent = "User already exists"
    } else {
        push(usersInDB, [usernameFieldEl.value, passwordFieldEl.value])
        localStorage.setItem("isUserLogged", JSON.stringify(true))
        openLoginWindow.textContent = usernameFieldEl.value
        closeLoginWindow()
    }   
}

function logUserInLS() {
    if (checkUserExistsInDB()) {
        localStorage.setItem("isUserLogged", JSON.stringify(true))
        openLoginWindow.textContent = usernameFieldEl.value
        closeLoginWindow()
    } else {
        userExistsEl.textContent = "User doesn't exist or password is incorect"
    }
}

function checkUserLoggedInLS() {
    const isUserLoggedLS = JSON.parse(localStorage.getItem("isUserLogged"))
    if (isUserLoggedLS == true) {
        return true
    } else {
        return false
    }
}

// user credentials to database END

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
    if (checkUserLoggedInLS()) {
        loginWindow.style.display = "none"
    } else {
        userExistsEl.textContent = "Wrong password or username"
    }
}
// Login pop-up window END




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
