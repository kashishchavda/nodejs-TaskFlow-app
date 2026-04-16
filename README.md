# 🚀 TaskFlow Pro - Cloud Task Management

A modern, beautiful task management application built with Node.js and Express, designed for deployment on AWS EC2 with Docker.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![AWS](https://img.shields.io/badge/AWS-EC2-orange)

## ✨ Features

- **Modern UI/UX**: Beautiful dark theme with glassmorphism effects and smooth animations
- **Real-time Stats**: Live dashboard showing task statistics
- **Task Management**: Create, update, delete, and filter tasks
- **Priority Levels**: Organize tasks by priority (Low, Medium, High)
- **Status Tracking**: Track task progress (Pending, In Progress, Completed)
- **RESTful API**: Clean API endpoints for all operations
- **Health Monitoring**: Built-in health check endpoint
- **Docker Ready**: Optimized Dockerfile for containerization
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Containerization**: Docker
- **Deployment**: AWS EC2
- **Fonts**: Google Fonts (Inter)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Docker (optional, for containerization)
- AWS Account (for EC2 deployment)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Nodejs_app_deployed_on_ec2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
npm start
```

## 🐳 Docker Deployment

### Using Docker

1. **Build the Docker image**
   ```bash
   docker build -t taskflow-pro .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 taskflow-pro
   ```

## ☁️ AWS EC2 Deployment

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Launch a new instance (Ubuntu 22.04 LTS recommended)
3. Choose instance type (t2.micro for free tier)
4. Configure security group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - Custom TCP (3000) - Anywhere
5. Create/select key pair
6. Launch instance

### Step 2: Connect to EC2

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 3: Install Docker on EC2

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Log out and log back in for group changes to take effect
exit
```

### Step 4: Deploy Application

```bash
# Clone your repository
git clone <your-repo-url>
cd Nodejs_app_deployed_on_ec2

# Build and run with Docker
docker build -t taskflow-pro .
docker run -d -p 3000:3000 --name taskflow taskflow-pro
```

### Step 5: Access Your Application

```
http://your-ec2-public-ip:3000
```

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

### Get All Tasks
```http
GET /api/tasks
```

### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description",
  "priority": "high"
}
```

### Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "status": "completed"
}
```

### Delete Task
```http
DELETE /api/tasks/:id
```

## 📁 Project Structure

```
Nodejs_app_deployed_on_ec2/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Styling with modern design
│   └── app.js              # Frontend JavaScript
├── server.js               # Express server
├── package.json            # Dependencies
├── Dockerfile              # Docker configuration
├── .dockerignore          # Docker ignore rules
├── .gitignore             # Git ignore rules
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🎨 Design Features

- **Dark Theme**: Eye-friendly dark color scheme
- **Glassmorphism**: Modern frosted glass effects
- **Gradients**: Beautiful color gradients throughout
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first responsive design
- **Typography**: Professional Inter font family

## 🔒 Security Features

- Non-root user in Docker container
- Environment variable support
- CORS enabled
- Input validation
- Health check monitoring

## 📊 Monitoring

The application includes:
- Health check endpoint (`/api/health`)
- Server uptime tracking
- Connection status indicator
- Docker health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for your videos and tutorials!

## 👨‍💻 Author

**Amitabh**
- YouTube: [Amitabh004](https://www.youtube.com/@Amitabh004)
- GitHub: [Amitabh-DevOps](https://github.com/Amitabh-DevOps)

## 🙏 Acknowledgments

- Built for AWS EC2 deployment tutorial
- Designed with modern web standards
- Optimized for Docker containerization

## 📺 Video Tutorial

Check out the full deployment tutorial on YouTube: [Nodejs App Deployed on EC2](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

---

**Made with ❤️ for the DevOps community**
