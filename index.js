import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-b667d-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// =========================================== Experimental
// =========================================== Experimental

// DB = database
// LS = localstorage




localStorage.setItem("isUserLogged", JSON.stringify("false"))
const isUserLoggedLS = (JSON.parse(localStorage.getItem("isUserLogged")))
let usernameFieldEl = document.getElementById("username-field")
let passwordFieldEl = document.getElementById("password-field")
const loginButtonEl = document.getElementById("login-button")


if (isUserLoggedLS === "false") {
    let loginContainerEl = document.getElementById("login-container")
    loginContainerEl.innerHTML = `
    <div>
        <img src="assets/cloud.png">
        <input type="text" id="username-field" placeholder="Username...">
        <input type="text" id="password-field" placeholder="Username...">
        <button id="login-button">Login</button>
    </div>
    `
    if (!userLogin()) {
        alert("true user login")
        loginContainerEl.innerHTML = ""
        loginContainerEl.style.float
        loginContainerEl.zIndex = "-1"
    }
}

loginButtonEl.addEventListener("click", function() {
    userLogin(usernameFieldEl.value, passwordFieldEl.value)
})


function userLogin(userName, userPassword) {
    console.log("sending data to firebase database")
    let isUserInDatabase = checkUserCredentials(userName, userPassword)
    if (isUserInDatabase) {
        console.log("IF is user in database, returned true")
        return true
    } else {
        console.log("IF user isn't in database, returned false")
        return false
    }
}


function checkUserCredentials(x, z) {
    // send data to database and check if it's a match
    // if it is, return true else return false
    return true
}






// =========================================== Experimental
// =========================================== Experimental

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}

// =============================
