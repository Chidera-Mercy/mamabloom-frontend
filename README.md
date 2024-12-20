# Mamabloom

Mamabloom is a web application designed to support parents by providing parenting resources, personalized child growth tracking, and a community forum. This project is the final submission for my Web Technologies class, built using **React**, **Tailwind CSS**, and **PHP**.

---

## Features

### 1. Personalized Growth Tracker
- **Description**: Allows parents to track their child's growth milestones, vaccinations, and health records.
- **Functionalities**:
  - **Create**: Add new milestones or health updates.
  - **Read**: View a timeline of recorded growth milestones.
  - **Update**: Edit milestone or health record entries.
  - **Delete**: Remove outdated or incorrect entries.
- **Admin Privileges**: Manage global suggestions for milestones and default templates for records.

### 2. Community Forum
- **Description**: A discussion board where parents can share experiences, ask questions, and seek advice.
- **Functionalities**:
  - **Create**: Start new discussion threads.
  - **Read**: View discussion threads and replies.
  - **Update**: Edit user-specific posts.
  - **Delete**: Remove posts (user-specific or admin-controlled for inappropriate content).
- **Admin Privileges**: Moderate discussions, pin important threads, or ban users violating guidelines.

### 3. Parenting Resources Hub
- **Description**: A curated library of articles, tips, and guides about parenting and childcare.
- **Functionalities**:
  - **Create**: Upload new articles or resources.
  - **Read**: Browse or search for relevant articles.
  - **Update**: Edit articles (admin-only).
  - **Delete**: Remove outdated or irrelevant articles (admin-only).
- **Admin Privileges**: Full control over content curation.

---

## Tech Stack

### Frontend
- **React**: For building the interactive user interface.
- **Tailwind CSS**: For styling and ensuring a responsive design.

### Backend
- **PHP**: For server-side scripting and API development.

### Database
- **MySQL**: To store user information, milestones, forum threads, and parenting resources.

---

## Installation Guide

### Prerequisites
Ensure the following are installed on your machine:
- Node.js (v16+)
- PHP (v8+)
- MySQL
- Composer (for PHP dependencies)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/mamabloom.git
   cd mamabloom
   ```

2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd ../backend
   composer install
   ```

4. **Set Up Environment Variables**:
   - Create a `.env` file in the `backend` directory with the following:
     ```env
     DB_HOST=localhost
     DB_NAME=mamabloom
     DB_USER=root
     DB_PASSWORD=yourpassword
     ```

5. **Run Database Migrations**:
   - Import the `database/mamabloom.sql` file into your MySQL server:
     ```bash
     mysql -u root -p mamabloom < database/mamabloom.sql
     ```

6. **Start the Backend Server**:
   ```bash
   php -S localhost:8000 -t public
   ```

7. **Start the Frontend Development Server**:
   ```bash
   cd frontend
   npm start
   ```

---

## Usage
1. Navigate to `http://localhost:3000` to access the application.
2. Sign up or log in as a parent to explore the personalized growth tracker and parenting resources.
3. Join discussions in the community forum to connect with other parents.
4. Admin users can log in to manage content and moderate forums.

---

## Folder Structure
```
mamabloom/
├── backend/
│   ├── public/            # PHP entry points
│   ├── src/               # Backend logic
│   ├── database/          # Database migration files
│   └── .env.example       # Example environment file
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── utils/         # Helper functions
│   └── tailwind.config.js # Tailwind configuration
└── README.md              # Project documentation
```

---

## Screenshots

### 1. Personalized Growth Tracker
![Growth Tracker Screenshot](https://via.placeholder.com/600x400)

### 2. Community Forum
![Forum Screenshot](https://via.placeholder.com/600x400)

### 3. Parenting Resources Hub
![Resources Screenshot](https://via.placeholder.com/600x400)

---

## Future Enhancements
- Add push notifications for milestone reminders.
- Implement user authentication with OAuth.
- Enhance the forum with real-time chat functionality.

---

## License
This project is for academic purposes only and is not intended for commercial use.

