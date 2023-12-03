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

const loginButtonEl = document.getElementById("login-button")
const singInButtonEl = document.getElementById("singin-button")

let usernameFieldEl = document.getElementById("username-field")
let passwordFieldEl = document.getElementById("password-field")

let usernameValue = ""
let passwordValue = ""


loginButtonEl.addEventListener("click", addUserInDB)
function addUserInDB() {
    usernameValue = usernameFieldEl.value
    passwordValue = passwordFieldEl.value
    push(usersInDB, [usernameValue, passwordValue])
    
    let exactUserLocationInDB = ""
    // exactUserLocationInDB = ref(database, `usersCredentials/${usernameValue, passwordValue}`)
    
    console.log(exactUserLocationInDB)
    if (exactUserLocationInDB) {
        console.log("The user already exists")
    }
    
    
    // remove(exactUserLocationInDB)
}


onValue(usersInDB, function(snapshot) {
    if (snapshot.exists()) {
        let usersArray = Object.entries(snapshot.val())
        // clearShoppingListEl()
        
        for (let i = 0; i < usersArray.length; i++) {
            let currentUser = usersArray[i]
            let currentUserID = currentUser[0]
            let currentUserValue = currentUser[1]     
            console.log(currentUserID)
            console.log(currentUserValue)
            // appendToShoppingListEl(currentItem)
        }    
    } else {
        console.log("idk... else")
    }
})
// user credentials to database END

// Login pop-up window START
const openLoginWindow = document.getElementById("open-login-window-btn")
const loginWindow = document.getElementById("login-window")
const loginButton = document.getElementById("login-button")

// Show the pop-up window when the link is clicked
openLoginWindow.addEventListener("click", function(event) {
    event.preventDefault()
    loginWindow.style.display = "block"
})

// Hide the pop-up window when the close button is clicked
loginButton.addEventListener("click", function() {
    loginWindow.style.display = "none"
})
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
