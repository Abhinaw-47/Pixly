# PIXLY


**PIXLY** is a feature-rich, production-grade social media web application built with the **MERN (MongoDB, Express.js, React, Node.js) stack**. It's designed to be a modern, scalable, and secure platform with real-time capabilities, an immersive user interface, and advanced authentication features, including OTP email verification.

---

## ✨ Key Features

-   **🔒 Secure Authentication:** Full user authentication with JWT Access/Refresh tokens, Google OAuth 2.0, and OTP email verification via Nodemailer.
-   **📝 Full CRUD Functionality:** Users can create, read, update, and delete posts and comments.
-   **🖼️ Rich Media Support:** Seamless image and video uploads managed by a **Cloudinary** CDN pipeline.
-   **⚡ Real-Time Chat & Notifications:** A low-latency chat system and live notifications for likes, comments, and messages, all powered by **WebSockets (Socket.io)**.
-   **🚀 High Performance:** Near-instant feed loading times achieved with **API-side pagination**.
-   **🎨 Immersive & Responsive UI:** A stunning, fully responsive UI built with Material-UI, featuring a GPU-accelerated **WebGL** animated background and fluid animations with **Framer Motion**.
-   **🤖 AI-Enhanced Content:** **Google Gemini & Copilot** integration to help users create more engaging and interactive posts.
-   **👤 User Profiles & Social Graph:** View user profiles, liked posts, and search for content across the platform.

---

## 🛠️ Tech Stack & Architecture

The application is built on a modern, decoupled architecture with a React frontend and a Node.js backend API.

| Category      | Technology                                                                          |
| :------------ | :---------------------------------------------------------------------------------- |
| **Frontend** | React, Redux Toolkit, React Router, Axios, Material-UI, Framer Motion, Socket.io Client |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Socket.io, JSON Web Token (JWT), bcrypt, Nodemailer |
| **Cloud Services** | **Cloudinary** for media hosting, **Google OAuth** for federated identity |

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18.x or higher)
-   npm
-   MongoDB (local instance or a cloud URI from MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    cd your-repository-name
    ```

2.  **Setup the Backend:**
    -   Navigate to the `backend` directory: `cd backend`
    -   Install NPM packages: `npm install`
    -   Create a `.env` file in the `backend` root and add the following environment variables:
        ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_AcessSecret=your_jwt_access_secret
        JWT_RefreshSecret=your_jwt_refresh_secret

        # Nodemailer & Gmail
        GMAIL_USER=your-email@gmail.com
        GMAIL_APP_PASSWORD=your_16_character_gmail_app_password

        # Cloudinary
        CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
        CLOUDINARY_API_KEY=your_cloudinary_api_key
        CLOUDINARY_API_SECRET=your_cloudinary_api_secret
        ```
    -   Start the backend server: `npm start`
        The server will be running on `http://localhost:5000` (or your specified port).

3.  **Setup the Frontend:**
    -   Navigate to the `frontend` directory: `cd ../frontend`
    -   Install NPM packages: `npm install`
    -   Create a `.env` file in the `frontend` root and add the following:
        ```env
        # The URL of your backend server
        VITE_BACKEND_URL=http://localhost:5000
        
        # Your Google OAuth Client ID
        VITE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
        ```
    -   Start the frontend development server: `npm run dev`
        The application will be available at `http://localhost:3000` (or your specified port).

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

## 👤 Contact

Abhinaw Anand

-   **GitHub:** [@Abhinaw-47](https://github.com/Abhinaw-47)
-   **LinkedIn:** [Abhinaw Anand](https://www.linkedin.com/in/abhinaw-anand-04a64124a/)
-   **Twitter / X:** [@Abhinaw\_Anand96](https://x.com/Abhinaw_Anand96)