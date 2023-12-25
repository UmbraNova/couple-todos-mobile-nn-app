APP link: http://couple-todos-mobile-nonnative-app.netlify.app/

# Collaborative Group Organizer

<sup>note*</sup>
```
// DB = database
// LS = localstorage
```

**Welcome to Collaborative Group Organizer**, a non-native mobile app built using *JavaScript*, *CSS*, and *HTML*. This app leverages Firebase Realtime Database to provide seamless, real-time collaboration for creating and managing shared lists within groups. Whether it's organizing a shopping list, planning for an event, or managing tasks, this app allows multiple users to collaborate in real-time.

<sup>note*</sup>
<sub>*Remember! This is a personal project for learning purposes, maybe some refactoring is necessary. Also, idk why but this is my favorite function*</sub>

```javascript
function changeBgColorAndBack(elem, color1, color2) {
    elem.style.backgroundColor = color1
    setTimeout(function() {
        elem.style.backgroundColor = color2
    }, 150)
}
```


### Features:

* Realtime Updates: Experience the power of Firebase Realtime Database for instant updates. Every change made within the group is instantly reflected across all devices.

* User-friendly Interface: Simple and intuitive interface for adding, removing, and marking items as done. Anyone in the group can see the changes as they happen.

* Customizable Colors: Personalize items in your group by assigning different colors. Easily distinguish tasks or items assigned to different people. The changes are synchronized with everyone in the group.

* Dynamic Color Palette: Tailor the app to your preferences by customizing the color palette, background color, and main colors.

* Multi-user Collaboration: Invite others to your group by sharing the group name and password. Collaborate in real-time on tasks, events, or shopping lists.

### How to Use:
Create or Join Groups: Start by creating your own group or join an existing one by entering the group name and password.

* Add Items: Begin adding items to the group list, whether they are to-dos, shopping items, or tasks. Everyone in the group can see and interact with the items.

* Customize Colors: Personalize the group by assigning specific colors to items. This helps in easily identifying who is responsible for a particular task or item. All changes are synchronized across all devices.

* Change Color Palette: Customize the overall look of the app by changing the color palette, background color, and main colors. 

* Collaborate with Others: Share the group name and password with others to collaborate on group activities. Everyone can contribute and see real-time updates.

### Getting Started:

* How to import
```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
```

* How to initialize
```javascript
const appSettings = {
    databaseURL: "https://couple-todos-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
```


### Clone the repository:

```bash
git clone https://github.com/your-username/your-repository.git
```

* Open the project in your preferred code editor.

* Open index.html in a web browser or deploy the app to a web server.

* Access the app on your mobile device or desktop by adding it to the home screen in the browser settings, using the provided link.

### Deployment with Netlify:

* This app is deployed and hosted on Netlify, a cloud platform that simplifies the deployment and hosting process. Netlify offers a seamless experience for continuous deployment, making it an ideal choice for hosting this small app.

* Why Netlify?
Ease of Use: Netlify provides a straightforward and user-friendly platform for deploying web applications. With just a few clicks, you can connect your GitHub repository and have your app live in no time.

* Automatic Deployments: Netlify automatically deploys your app whenever changes are pushed to the connected GitHub repository. This ensures that the latest version is always available to users.

* Free Hosting: Netlify offers a generous free hosting plan, making it a cost-effective solution for hosting personal projects and small applications.

* Serverless Functions: If your app requires serverless functionality, Netlify provides serverless functions that can be easily integrated into your project.

*By choosing Netlify, I aimed to provide a hassle-free deployment experience while keeping the hosting cost-effective. The simplicity and automation provided by Netlify align well with the goals of this collaborative group organizer.

### Contributing:
Contributions are welcome! If you have ideas for improvements or find any issues, feel free to open an issue or submit a pull request.

### TODO so far:

- [ ] ability to chat with other participants in the group, live chat with messages that last 48h
- [ ] add deleted items feed?
- [ ] add ONE EventListener for every interaction instead of 8
- [x] remove previous commented old testing code
- [ ] add a normal message with what went wrong in the enterGroup() function
- [x] change groupExistsInDB to simply return true or false in the checkGroupExistsInDB() function
- [x] restriction about creating a group with whitespaces
- [x] add check password function to check in DB if is matching group name and password, not only group name
- [ ] modify testNameAndPassword() function to return error code to display for user
- [x] add changeBgAndBack(elem, color1, color2) function to incorporate all the cases in one function
- [x] add clarification text in login window to make sure the user understands what to do
- [ ] add popup window with indications and notes about what is the app, what it does and how to use it, with photos. Var in LS
- [x] group all important buttons and inputs in container to free some space on the screen
- [x] add label with checkbox input to be able to color items and remove them by checking the "remove" button
- [x] ability to select color/icon for the item in the list, from the array of colors
- [ ] add report a bug button with function in the login window, create the bug-reports in the database
- [x] add darkmode OR select background color and contrast/main colors from an array of predetermined color palettes. Use LS to store this data
- [ ] add posibility to modify your color in the "people in group" section?
- [x] fix the height of buttons and inputs, if you look very close on mobile, it is not aligned. Maybe 1px