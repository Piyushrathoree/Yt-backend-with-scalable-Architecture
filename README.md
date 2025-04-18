# VideoTube Backend

This is the backend for the VideoTube application, a video-sharing platform. The backend is built using Node.js, Express, and MongoDB. It provides APIs for user authentication, video management, playlists, subscriptions, likes, comments, and more.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Video Routes](#video-routes)
  - [Playlist Routes](#playlist-routes)
  - [Subscription Routes](#subscription-routes)
  - [Like Routes](#like-routes)
  - [Comment Routes](#comment-routes)
  - [Tweet Routes](#tweet-routes)
  - [Dashboard Routes](#dashboard-routes)
  - [Healthcheck Route](#healthcheck-route)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)

---

## Features

- User authentication (register, login, logout, refresh tokens)
- Video upload, update, delete, and view
- Playlist creation and management
- Subscriptions to channels
- Like and comment on videos, tweets, and comments
- Dashboard for channel statistics
- Healthcheck endpoint for server status

---

## Technologies Used

- **Node.js**: Backend runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **Cloudinary**: Media storage
- **JWT**: Authentication
- **Multer**: File uploads

---

## Project Structure

---

## API Endpoints

### User Routes

**Base URL**: `/api/v1/users`

| Method | Endpoint                  | Description                  | Example Input                                                                 | Example Output                                                                 |
|--------|---------------------------|------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| POST   | `/register`               | Register a new user          | `{ "fullName": "John Doe", "email": "john@example.com", "password": "1234" }` | `{ "success": true, "message": "user registered successfully" }`              |
| POST   | `/login`                  | Login a user                 | `{ "email": "john@example.com", "password": "1234" }`                        | `{ "success": true, "accessToken": "token", "refreshToken": "token" }`         |
| POST   | `/logout`                 | Logout a user                | -                                                                            | `{ "success": true, "message": "user logged out" }`                            |
| POST   | `/refresh-token`          | Refresh access token         | `{ "refreshToken": "token" }`                                                | `{ "success": true, "accessToken": "newToken" }`                               |
| GET    | `/get-user`               | Get current user details     | -                                                                            | `{ "success": true, "data": { "username": "john", "email": "john@example.com" } }` |
| PATCH  | `/change-account-details` | Update user account details  | `{ "fullName": "John Smith", "email": "johnsmith@example.com" }`             | `{ "success": true, "message": "Account details updated successfully" }`      |

---

### Video Routes

**Base URL**: `/api/v1/videos`

| Method | Endpoint                  | Description                  | Example Input                                                                 | Example Output                                                                 |
|--------|---------------------------|------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| GET    | `/`                       | Get all videos               | `?page=1&limit=10`                                                           | `{ "success": true, "data": [ { "title": "Video 1" }, { "title": "Video 2" } ] }` |
| POST   | `/`                       | Upload a new video           | FormData with `videoFile` and `thumbnail`                                    | `{ "success": true, "message": "Video uploaded successfully" }`               |
| GET    | `/:videoId`               | Get video by ID              | -                                                                            | `{ "success": true, "data": { "title": "Video 1", "views": 100 } }`           |
| DELETE | `/:videoId`               | Delete a video               | -                                                                            | `{ "success": true, "message": "Video deleted successfully" }`                |
| PATCH  | `/:videoId`               | Update video details         | `{ "title": "New Title", "description": "Updated description" }`             | `{ "success": true, "message": "Video updated successfully" }`                |

---

### Playlist Routes

**Base URL**: `/api/v1/playlist`

| Method | Endpoint                  | Description                  | Example Input                                                                 | Example Output                                                                 |
|--------|---------------------------|------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| POST   | `/`                       | Create a new playlist        | `{ "name": "My Playlist", "description": "Favorite videos" }`                | `{ "success": true, "message": "Playlist created successfully" }`             |
| GET    | `/user/:userId`           | Get user playlists           | -                                                                            | `{ "success": true, "data": [ { "name": "Playlist 1" }, { "name": "Playlist 2" } ] }` |
| PATCH  | `/add/:videoId/:playlistId` | Add video to playlist        | -                                                                            | `{ "success": true, "message": "Video added to playlist successfully" }`      |
| PATCH  | `/remove/:videoId/:playlistId` | Remove video from playlist | -                                                                            | `{ "success": true, "message": "Video removed from playlist successfully" }`   |

---

### Subscription Routes

**Base URL**: `/api/v1/subscriptions`

| Method | Endpoint                  | Description                  | Example Input                                                                 | Example Output                                                                 |
|--------|---------------------------|------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| POST   | `/c/:channelId`           | Subscribe to a channel       | -                                                                            | `{ "success": true, "message": "Subscription added successfully" }`           |
| GET    | `/c/:channelId`           | Get subscribed channels      | -                                                                            | `{ "success": true, "data": [ { "channelName": "Channel 1" } ] }`             |

---

### Like Routes

**Base URL**: `/api/v1/likes`

| Method | Endpoint                  | Description                  | Example Input                                                                 | Example Output                                                                 |
|--------|---------------------------|------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| POST   | `/toggle/v/:videoId`      | Like/unlike a video          | -                                                                            | `{ "success": true, "message": "Video liked successfully" }`                  |
| POST   | `/toggle/c/:commentId`    | Like/unlike a comment        | -                                                                            | `{ "success": true, "message": "Comment liked successfully" }`                |

---

### Comment Routes

**Base URL**: `/api/v1/comments`

| Method | Endpoint                  | Description                  | Example Input                                                                 | Example Output                                                                 |
|--------|---------------------------|------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| GET    | `/:videoId`               | Get comments for a video     | -                                                                            | `{ "success": true, "data": [ { "content": "Nice video!" } ] }`               |
| POST   | `/:videoId`               | Add a comment to a video     | `{ "comment": "Great video!" }`                                              | `{ "success": true, "message": "Comment added successfully" }`                |

---

### Tweet Routes

**Base URL**: `/api/v1/tweets`

| Method | Endpoint                  | Description                  | Example Input                                                                 | Example Output                                                                 |
|--------|---------------------------|------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| POST   | `/`                       | Create a new tweet           | `{ "title": "My Tweet", "content": "This is a tweet" }`                      | `{ "success": true, "message": "Tweet created successfully" }`                |
| GET    | `/user/:userId`           | Get tweets by user           | -                                                                            | `{ "success": true, "data": [ { "title": "Tweet 1" } ] }`                     |

---

### Dashboard Routes

**Base URL**: `/api/v1/dashboard`

| Method | Endpoint                  | Description                  | Example Input                                                                 | Example Output                                                                 |
|--------|---------------------------|------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| GET    | `/stats`                  | Get channel stats            | `{ "channelId": "12345" }`                                                   | `{ "success": true, "data": { "videoCount": 10, "subscriberCount": 100 } }`   |
| GET    | `/videos`                 | Get channel videos           | `{ "channelId": "12345" }`                                                   | `{ "success": true, "data": [ { "title": "Video 1" } ] }`                     |

---

### Healthcheck Route

**Base URL**: `/api/v1/healthcheck`

| Method | Endpoint                  | Description                  | Example Input                                                                 | Example Output                                                                 |
|--------|---------------------------|------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| GET    | `/`                       | Check server health          | -                                                                            | `{ "success": true, "message": "OK" }`                                        |

---

## Setup Instructions

1. Clone the repository:
   ```bash
    git clone https://github.com/your-repo/videotube-backend.git
    cd videotube-backend
    npm install
    npm run dev

### Env setup
```bash PORT=8000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=videotube
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
CLOUDINARY_CLOUD_NAME=yourcloudname
CLOUDINARY_API_KEY=yourapikey
CLOUDINARY_API_SECRET=yourapisecret
CORS_ORIGIN=http://localhost:3000