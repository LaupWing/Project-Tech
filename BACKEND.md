# Backend
In this document you can find my code for the subject Backend of Project Tech for the HVA. 

## 1.0 Project Introduction
This project is about making a full stack dating app using node. Every student has to choose **one** job story to round out/work on. Eventually all the job stories will be combined to one fully fletched dating app.

## 2.0 My Job Story
I have chosen the Job Story 

>**_When I'm single, I want to signup for an dating site easily and give my preference, So i can find my true love._**

As you can see the i mainly focus on the signup part and login part of the whole application.

### 2.1 Goals
What are my goals for this project(what do i want to show eventually), and what do want to do if i feel extra motivated.
#### 2.1.1 Must Have
*   Signup Page
    *   Progressivley enhanced Signup
    *   Saving Users to the Mongo via signup form
*   Login Page
    *   Correctly loggin Users in

#### 2.1.2 Should Have(extra stuff)
*   Matching(matching mechanisme)
*   Showing Users to match
*   Chatting

### 2.2 Technologies
What are the technologies that will make the process of making my job story easier?
#### Must Have (part)
These technologies are use mainly for the Signup and Login Page
| Name        | Type           | What does it do  |
| ------------- |:-------------:| -------------------------------:|
| Nodemon      | Dev |For hot reloading it saves time to automatically see changes |
| env-cmd      | Dev |Loading my .env files so i can use them during development |
| Bcrypt      | Prod      | Saving the user valuable information encrypted |
| JWT | Prod      | Making tokens to confirm the user. User can use this token to login |
| Express | Prod    | Server where my apps run on |
| BodyParser | Prod    | Parsing the info that the user has sended via the signup |
| Mongoose | Prod    | Library for using mongodb to save users |
| Multer | Prod    | Loading user files (mainly for images) |
| Validator | Prod    | Validate diffrent kinds of data types |
| form-data | Prod    | Express cant use formdata so i need this package to parse it for me |
| jsonwebtoken | Prod    | generate token for user login |
| pug | Prod    | templating engine, for generating html pages from the server |
| node-fetch | Prod    | So i can use fetch syntax for node |
#### Should Have (part, extra stuff)
These technologies are use mainly for the Mathing, Chatting and stuff.
| Name        | Type           | What does it do  |
| ------------- |:-------------:| -------------------------------:|
| Socketio      | Prod |Realtime data, so that user can chat in realtime and see matches in realtime |
