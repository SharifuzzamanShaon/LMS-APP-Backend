# Learning Management App [Backend API]

A modern learning management system built with Node.js, Next.js, MongoDB, and Redis. This application provides a comprehensive platform for managing and delivering educational content, featuring real-time notifications, efficient data caching, and a user-friendly interface.

## Features

- **User Management**: Handles user roles, authentication, and authorization.
- **Course Management**: Enables creation, updating, and management of courses and content.
- **Real-time Notifications**: Keeps users updated with the latest information using WebSockets.
- **Conversation [Chats]: Connect with other students and group
- **Chatting Features**: Real-time chat functionality implemented with Socket.IO.
- **Efficient Caching**: Utilizes Redis for improved performance and scalability.
- **Modern UI**: Built with Next.js for a responsive and engaging user experience.
- **Email & OTP Verification**: Ensures secure account verification.

## Installation
   ### Backend
1. **Clone the Repository**

   ```bash
   git clone https://github.com/SharifuzzamanShaon/LMS_Tech_App.git
   cd learning-management-app


2. **Install npm**

   ```bash
   npm install

3. **ENV file in root dir**
    ```
    MONGO_URI=your_mongodb_connection_string
    REDIS_URL=your_redis_connection_string
    JWT_SECRET=your_jwt_secret

   
    SMTP_HOST = smtp-relay.brevo.com
    SMTP_USER = md*****@gmail.com
    SMTP_PASSWORD = ** *** *** *

    FROM_EMAIL = md********@gmail.com
    CLIENT_URL = http://*******

    CLOUD_NAME = daaxwtbba
    API_KEY = ************
    API_SECRET = CT9o3mEVvEQ0Dp1kbNNMFfg-BMI
    REDIS_URL = 'redis://   default:Ab****YzZmJlMmVkYzQ0ZjNlYjMyZjFiM2I4N2FmMzdhYXAxMA@strong-rabbit-***805.upstash.io:6379'

    ACC_ACTIVATION_SECRETKEY = 'MmVkYzQ0ZjNl'

    ACCESS_TOKEN_KEY= '***************'
    REFRESH_TOKEN_KEY = '**************'

    ACCESS_TOKEN_EXPIRE = 5 # define the hours
    REFRESH_TOKEN_EXPIRE = 3 # define the day

  ### Frontend
**Start the Frontend Application**

    
    cd client/my-app
    npm run dev
## Additional Information

- **Real-Time Communication**: This project includes real-time communication features developed with [Socket.IO](https://socket.io/) for enhanced interactivity and seamless data communication.
- **User Authentication**: Supports email and OTP verification to ensure account security.
- **UI Frameworks**: Built with [Tailwind CSS](https://tailwindcss.com/) and [Material UI](https://mui.com/) for a responsive and visually engaging interface.

## Deployment Link

Access the live application here: [SkillSage Live Application](https://skillsage-6v3g.onrender.com)

## Note

This project continuously evolves, and future updates will add new features.

---
# SkillSage Project

SkillSage is a platform for connecting freelance examiners, companies, and candidates. Below are the UML diagrams for the project:

Thank you for exploring
