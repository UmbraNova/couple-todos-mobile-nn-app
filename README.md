APP link: http://couple-todos-mobile-nonnative-app.netlify.app/

# Collaborative Group Organizer

note*
```
// DB = database
// LS = localstorage
```

**Welcome to Collaborative Group Organizer**, a non-native mobile app built using *JavaScript*, *CSS*, and *HTML*. This app leverages Firebase Realtime Database to provide seamless, real-time collaboration for creating and managing shared lists within groups. Whether it's organizing a shopping list, planning for an event, or managing tasks, this app allows multiple users to collaborate in real-time.

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

### Contributing:
Contributions are welcome! If you have ideas for improvements or find any issues, feel free to open an issue or submit a pull request.

### TODO's so far:
```
TODO:
- 

```