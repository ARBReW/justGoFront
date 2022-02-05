# Project Title
    Just Go: A user-friendly, innovative web application that allows users explore local areas using geolocation to find places recommended by locals.

# Project Description
     The motivation behind this project was to provide both travelers and visitors a curated, 5 stop location itinerary that allows users to explore and get to know local neighborhoods. The app's primary focus is to provide users with a manageable itinerary that can be accomplished in less than a day. When users login to the app they are presented with various routes that contain 5 stops, all within a certain radius and walking distance. Users can choose which route to take by pressing the 'Just Go' button and begin their exploration of a neighborhood. To alleviate the stress of navigating through an unknown area, the app includes three key functionalities to assist the user getting from location to location: geolocation, real-time street view, and user friendly directions . Currently, the app is specific to the Tokyo area, but with goals to expand to more locations.   

## Requirements
    Before continuing, ensure that the latest version of node is installed: v16.13.2

## Getting Started 

- Install npm packages: npm install
- Clone repo: git clone https://github.com/brianlee9090/CC24-seniorprojectfront
- Start frontend: npm run dev
- Start backend: npm start:dev
   
### Test Break down:

- backend: npm run test
    The test in the backend use Jest to verify that the URLs are retrieving the correct data from the database and passed to the front end.

## Tech-stack:

    This project uses the React and Next.js frameworks. Next.js provides various features to optomize production: hybrid & static server rendering, Typescript support, smart bundling, route pre-fetching, and more with no config needed. And for design, we incorporated the Chakra UI component library to build our React application. 

- Frontend:
    - React.js
    - Next.js
    - Chakra UI
- Server:
    - Nestjs
- ORM
    - Mongoose
- Database
    - MongoDB
- Deployment
    - Frontend: Vercel
    - Backend: Heroku


# Features 
    The key feature of 'Just Go' is to provide the user with the ability to navigate an unknown area by: (1) accessing the users geolocation; (2) using and continuously accessing the user's geolocation to provide a real-time street view as they navigate through a neighborhood; and (3) provide the user with up-to-date directions as their geolocation changes

# Usage 

# Contributing
    If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thank you.

    Fork the Project
    Create your Feature Branch (git checkout -b feature/AmazingFeature)
    Commit your Changes (git commit -m 'Add some AmazingFeature')
    Push to the Branch (git push origin feature/AmazingFeature)
    Open a Pull Request

# Credits 
- Brian Lee
- Ana Scuturici
- Wesley Lee
- Richard Beavis
- Roman Montoya
