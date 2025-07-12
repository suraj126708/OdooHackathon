# StackIt - Q&A Platform

A modern Q&A platform built for the Odoo Hackathon, featuring user authentication, question management, admin dashboard, and more.

## Features

- 🔐 User Authentication & Authorization
- ❓ Ask & Answer Questions
- 🏷️ Tag-based Question Organization
- 👍 Voting System
- 👑 Admin Dashboard
- 🔔 Real-time Notifications
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

### 2. Set Up Environment

Create a `.env` file in the server directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/odoo-hackathon
JWT_SECRET=your-secret-key-here
PORT=8080
```

### 3. Set Up Admin User

```bash
# Create the first admin user
npm run setup-admin
```

This creates a default admin user:

- Email: `admin@stackit.com`
- Username: `admin`
- Password: `admin123`

### 4. Start the Application

```bash
# Start both server and client simultaneously
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - Start server
npm run server

# Terminal 2 - Start client
npm run client
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/ping

## Screenshots & Demo

### Application Demo Video

<video width="100%" controls>
  <source src="./ProjectImges/recording.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Homepage

![Homepage](<./ProjectImges/Screenshot%20(34).png>)

### User Authentication

![Login Page](<./ProjectImges/Screenshot%20(35).png>)
![Registration Page](<./ProjectImges/Screenshot%20(36).png>)

### Question Management

![Ask Question](<./ProjectImges/Screenshot%20(37).png>)
![Question Detail](<./ProjectImges/Screenshot%20(38).png>)
![Question List](<./ProjectImges/Screenshot%20(39).png>)

### User Profile & Settings

![User Profile](<./ProjectImges/Screenshot%20(40).png>)
![Profile Settings](<./ProjectImges/Screenshot%20(41).png>)

### Admin Dashboard

![Admin Dashboard](<./ProjectImges/Screenshot%20(42).png>)
![User Management](<./ProjectImges/Screenshot%20(43).png>)

### Notifications & UI

![Notifications](<./ProjectImges/Screenshot%20(44).png>)
![Responsive Design](<./ProjectImges/Screenshot%20(45).png>)

## Project Structure

```
OdooHackathon/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── Pages/         # Page components
│   │   ├── services/      # API services
│   │   └── Authorisation/ # Auth context & config
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   └── package.json
└── package.json          # Root package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Questions

- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Answers

- `POST /api/questions/:questionId/answers` - Create answer
- `PUT /api/questions/:questionId/answers/:answerId` - Update answer
- `DELETE /api/questions/:questionId/answers/:answerId` - Delete answer

### Admin (Admin only)

- `GET /api/admin/users` - Get all users
- `POST /api/auth/users/:userId/promote` - Promote user to admin
- `POST /api/auth/users/:userId/demote` - Demote admin to user
- `POST /api/admin/users/:userId/ban` - Ban user
- `POST /api/admin/users/:userId/unban` - Unban user

## Admin Features

Once logged in as an admin, you can:

1. **Access Admin Dashboard**: Navigate to `/admin` in the frontend
2. **Manage Users**: Promote/demote admins, ban/unban users
3. **Moderate Content**: Delete inappropriate questions and answers
4. **View Reports**: Handle user-submitted reports
5. **Monitor Statistics**: View platform usage statistics

## Development

### Adding New Features

1. **Backend**: Add routes in `server/routes/`, controllers in `server/controllers/`
2. **Frontend**: Add components in `client/src/components/`, pages in `client/src/Pages/`
3. **Database**: Add models in `server/models/`

### Database Seeding

```bash
# Seed the database with sample data
npm run seed
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in server/.env
2. **MongoDB connection failed**: Check your MongoDB connection string
3. **CORS errors**: Ensure the server is running on the correct port
4. **Admin access denied**: Run `npm run setup-admin` to create admin user

### Logs

- **Server logs**: Check terminal running the server
- **Client logs**: Check browser console (F12)
- **Database logs**: Check MongoDB logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
