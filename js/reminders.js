// reminders.js - Core reminder functionality

class ReminderManager {
    constructor(api) {
        this.api = api;
        this.showCompleted = false;
    }

    // Add a new reminder
    addReminder(reminderData) {
        return this.api.addReminder(reminderData);
    }

    // Delete a reminder
    deleteReminder(id) {
        this.api.deleteReminder(id);
    }

    // Toggle reminder completion status
    toggleComplete(id) {
        this.api.toggleComplete(id);
    }

    // Update an existing reminder
    updateReminder(id, data) {
        this.api.updateReminder(id, data);
    }

    // Get all reminders (filtered by completed status if needed)
    getReminders(priorityFilter = 'all') {
        let reminders = this.api.filterByPriority(priorityFilter);
        
        if (!this.showCompleted) {
            reminders = reminders.filter(reminder => !reminder.completed);
        }
        
        // Sort by date (most recent first)
        return reminders.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });
    }

    // Toggle showing completed reminders
    toggleShowCompleted() {
        this.showCompleted = !this.showCompleted;
        return this.showCompleted;
    }

    // Check if a reminder is due soon or overdue
    getReminderStatus(reminder) {
        const now = new Date();
        const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
        
        // Calculate difference in hours
        const diffHours = (reminderDate - now) / (1000 * 60 * 60);
        
        if (diffHours < 0) {
            return 'overdue';
        } else if (diffHours < 24) {
            return 'due-soon';
        }
        return 'upcoming';
    }
}