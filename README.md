# 🚀 Portify - Dynamic Portfolio Builder

**Portify** is a modern, full-stack web application that allows users to create and showcase beautiful, responsive portfolios. Built with React and Express.js, it provides an intuitive platform for developers, designers, and professionals to display their work and skills.

## ✨ Features

### 🎨 Portfolio Creation

- **Dynamic Portfolio Generation**: Create stunning portfolios with personalized URLs
- **Responsive Design**: Mobile-first approach ensuring great experience across all devices
- **Social Media Integration**: Connect GitHub, LinkedIn, Twitter, and other social platforms
- **Professional Sections**: About, Experience, Skills, Projects, and Contact sections

### 🔐 User Management

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **User Registration & Login**: Simple onboarding process
- **Protected Routes**: Secure dashboard and profile management
- **Role-based Access**: User and admin role support

### 📊 Portfolio Features

- **Project Showcase**: Display projects with descriptions, technologies, and links
- **Skills & Technologies**: Comprehensive skills listing with categorization
- **Professional Experience**: Timeline-based experience showcase
- **Contact Information**: Multiple contact methods and social links

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ajais-25/Portify.git
   cd Portify
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the `server` directory:

   ```env
   PORT=3000
   MONGODB_URI=YOUR_MONGO_URI
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRY=7d
   ```

5. **Start the development servers**

   **Backend** (from server directory):

   ```bash
   npm run dev
   ```

   **Frontend** (from client directory):

   ```bash
   npm run dev
   ```

## 🎯 Usage

1. **Register an Account**: Create your account with email and username
2. **Login**: Access your dashboard with credentials
3. **Build Your Portfolio**:
   - Add personal information and tagline
   - Upload projects with descriptions and links
   - List your skills and technologies
   - Add professional experience
   - Configure social media links
4. **Share Your Portfolio**: Your portfolio will be available at `/portfolio/[username]`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

⭐ **Star this repository if you find it helpful!**
