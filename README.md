﻿# Daily Reminder App

A web application that helps users manage important daily tasks by setting reminders for activities like taking medication, drinking water, or making important calls.

## Features

- Create reminders
- Set frequency (daily, weekly, specific days)
- Mark reminders as complete
- View history of completed reminders
- Sort and filter reminders
- Time synchronization with WorldTime API
- Optional notifications via Novu API

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- APIs:
  - [WorldTime API](http://worldtimeapi.org/) - For time synchronization
  - [Novu](https://novu.co/) - For notifications

## Local Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/reminder-app.git
   cd reminder-app
   ```

2. Create .env file with your API keys
   ```bash
   cp .env.example .env
   # Edit .env file with your API keys
   ```

3. Open index.html in your browser or use a local server
   ```bash
   # If you have Python installed
   python -m http.server 8000
   # Then open http://localhost:8000 in your browser
   ```

## Deployment

### Server Requirements
- Web server (Apache/Nginx)
- Environment variables for API keys

### Deployment Steps

#### For Web Servers (Web01 and Web02)

1. Connect via SSH
   ```bash
   ssh username@webserver
   ```

2. Create application directory
   ```bash
   mkdir -p /var/www/reminder-app
   ```

3. Copy application files
   ```bash
   git clone https://github.com/yourusername/reminder-app.git /var/www/reminder-app
   ```

4. Configure environment variables
   ```bash
   cp .env.example .env
   nano .env
   # Add your API keys
   ```

5. Configure web server
   - For Apache, create a virtual host in `/etc/apache2/sites-available/`
   - For Nginx, create a server block in `/etc/nginx/sites-available/`

6. Enable site and restart server
   ```bash
   # For Apache
   sudo a2ensite reminder-app.conf
   sudo systemctl restart apache2
   
   # For Nginx
   sudo ln -s /etc/nginx/sites-available/reminder-app /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

#### Load Balancer Configuration (Lb01)

1. Install Nginx
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. Configure as load balancer
   ```bash
   sudo nano /etc/nginx/sites-available/reminder-app
   ```
   
   Use the following configuration:
   ```
   upstream reminder_servers {
       server web01;
       server web02;
   }
   
   server {
       listen 80;
       server_name reminder-app.yourdomain.com;
       
       location / {
           proxy_pass http://reminder_servers;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Enable and restart Nginx
   ```bash
   sudo ln -s /etc/nginx/sites-available/reminder-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Challenges and Solutions

### Challenge 1: API Rate Limiting
Initially faced rate limiting with the Novu API. Solved by implementing a queuing system for notifications and spreading out API calls.

### Challenge 2: Time Zone Handling
Users in different time zones experienced inconsistent reminder times. Fixed by using the WorldTime API to synchronize times and storing all times in UTC format.

## API Attribution

- [WorldTime API](http://worldtimeapi.org/) - Free time zone API used for synchronizing reminder times
- [Novu](https://novu.co/) - Open-source notification infrastructure used for sending notifications

## License

MIT
