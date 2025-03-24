// app.js - Main application entry point

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app components
    const api = new ReminderAPI();
    const reminderManager = new ReminderManager(api);
    const ui = new ReminderUI(reminderManager);
    
    // Set today's date as the default date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('date').value = formattedDate;
    
    // Set current time as default time (rounded to nearest hour)
    const hours = today.getHours();
    const minutes = today.getMinutes() >= 30 ? '30' : '00';
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
    document.getElementById('time').value = formattedTime;
    
    console.log('Reminder App initialized successfully!');
});