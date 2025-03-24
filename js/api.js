// api.js - Handles data persistence using localStorage

class ReminderAPI {
    constructor() {
        this.reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    }

    // Get all reminders from storage
    getAllReminders() {
        return this.reminders;
    }

    // Add a new reminder
    addReminder(reminder) {
        // Generate a unique ID
        reminder.id = Date.now().toString();
        reminder.completed = false;
        reminder.createdAt = new Date().toISOString();
        
        // Add to array and save
        this.reminders.push(reminder);
        this._saveReminders();
        return reminder;
    }

    // Delete a reminder
    deleteReminder(id) {
        this.reminders = this.reminders.filter(reminder => reminder.id !== id);
        this._saveReminders();
    }

    // Toggle reminder completion status
    toggleComplete(id) {
        this.reminders = this.reminders.map(reminder => {
            if (reminder.id === id) {
                reminder.completed = !reminder.completed;
            }
            return reminder;
        });
        this._saveReminders();
    }

    // Update a reminder
    updateReminder(id, updatedReminder) {
        this.reminders = this.reminders.map(reminder => {
            if (reminder.id === id) {
                return { ...reminder, ...updatedReminder };
            }
            return reminder;
        });
        this._saveReminders();
    }

    // Filter reminders by priority
    filterByPriority(priority) {
        if (priority === 'all') {
            return this.reminders;
        }
        return this.reminders.filter(reminder => reminder.priority === priority);
    }

    // Save reminders to localStorage
    _saveReminders() {
        localStorage.setItem('reminders', JSON.stringify(this.reminders));
    }
}