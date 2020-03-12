# Project Tech
Here you can find everything related to Project Tech from the HVA. 

**What is Project Tech??**

This project is about all about  web development from frontend to the backend. During this project we are going to make a backend project with the help of Node. Every student choses his/her job story to work on during the whole project.

My Job story:
> When I'm single, I want to signup for an dating site easily and give my preference, So i can find my true love.

## What can i find in this README?
In this README you can find the details of my final product. I will describe what for features it got and how to work with it. To find how the process went per week you can click [here](http://google.com) to see the full log. Or go the the [Tabel of contents](http://google.com) in this README and choose the week you want to see.

## Table of contents
Below you can see 2 table contents. One is mend for the README you are currently on and the other is for the external logs, which lives in my wiki.

### Table of contents (this readme)
* [App](http://google.com)
* [Project Log](http://google.com)
* [Week 1](http://google.com)
* [Week 2](http://google.com)
* [Week 3](http://google.com)
* [Week 4](http://google.com)

### Table of contents (external)
* [App](http://google.com)
* [Project Log](http://google.com)
* [Week 1](http://google.com)
* [Week 2](http://google.com)
* [Week 3](http://google.com)
* [Week 4](http://google.com)

## Run this project on your own pc
```pc
[git clone] this repo

[npm install] in this directory

NOTE: Before you can even run the next command you need to set up your own config directory with an .env file which holds the next information: PORT, MONGODB_URL and your JWT_SECRET

[npm run dev] to start up this project

visit localhost:3000 to see the website in action
```

## Visit the live link
[Click here to visit the websites live link]()

## My App
My main job for this project is working on the signup and login page. But because I got more time and prior experience with building fullstack applications I added an matching page an also an chat page to this application.

__**Note:** To see a more technical explaination of this application go the Backend README or click [here]()__

### Homepage
If you visit the page for the first time or you didnt logged in in prior sessions you will be greeted with an login/signup page. The user cant visit the actually dating interface unless he/she is logged in. This is done with the help of JWT (Json Web Tokens)

#### Login
As you can see below the Login page is quite basic. You can login with your email and password. If your password and email doesnt match with the data in the database you will get an error message.
Below the login field you see an link where you can signup if you dont have an account yet.

**_Login_**
![Login](https://github.com/LaupWing/Project-Tech/blob/master/READMEImages/login.png?raw=true)
**_Login Error_**
![Login Error](https://github.com/LaupWing/Project-Tech/blob/master/READMEImages/login.png?raw=true)

#### Signup
The signup page is quite a bit more complex than the login page. It is more progressively enhanced by the use of css and javascript. THe signup page is acutally one big form but split up in multple sections(fields). You can navigate through the form by either clicking `next` or `back`. There are two indicators to show on which section you are; on the top of the website which shows the current and total steps, and on the bottom which does the same but has more detail on each steps. When you are finished with the form the `submit` button will be visible for the user to click on. The `submit` button is only activated when all the steps indicators on the bottom are green. If you dont know why one of the steps isnt green yet, you can click on it to have more information why it isnt green yet.

**_Signup_**
![Signup](https://github.com/LaupWing/Project-Tech/blob/master/READMEImages/signup.png?raw=true)

**_Progress Indicator bottom_**

_As you can see below the purple colored hearth shows the current step you are on. Above the hearth is the information that exists within this step. By the color you can see if it is either faulty or its is finished. Green hearth means that you are done and red means that there is something wrong. If the text above the hearth is purple it means it is finished and nothing wrong with it, if it is red there is something wrong with it. You can click on the current step to see more info_

**_Just progressbar_**
![Progress1](https://github.com/LaupWing/Project-Tech/blob/master/READMEImages/signup_progress1.png?raw=true)
**_Progressbar: Something went wrong_**
![Progress2](https://github.com/LaupWing/Project-Tech/blob/master/READMEImages/signup_progress_faulty.png?raw=true)
**_Progressbar: Everything is finished_**
![Progress3](https://github.com/LaupWing/Project-Tech/blob/master/READMEImages/signup_progress_finish.png?raw=true)
**_Progressbar: Click to see more info_**
![Progress4](https://github.com/LaupWing/Project-Tech/blob/master/READMEImages/signup_more_info.gif?raw=true)

## Todos
- [x] When user accept or denied it needs to be updated for every user at that moment in the socket(realtime update)
- [x] Dont rerender whole list when one thing changes
- [x] When first send add highlight
- [ ] Reactive Label
- [ ] Dont update unread when chat is open
- [x] Add field for gender preference (server)
- [x] Server can receive gender preference (server)
- [ ] Connect Cloud Database
- [x] Split up cliend side javascript
- [x] Split up server side javascript
- [x] Render files seperate (client side)
- [x] Change the button panel classname to correspond with the panel container itself