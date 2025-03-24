// ui.js - Handles UI rendering and user interactions

class ReminderUI {
    constructor(reminderManager) {
        this.reminderManager = reminderManager;
        this.remindersList = document.getElementById('reminders-list');
        this.reminderForm = document.getElementById('reminder-form');
        this.filterPriority = document.getElementById('filter-priority');
        this.toggleCompletedBtn = document.getElementById('toggle-completed');
        
        this.initEventListeners();
        this.renderReminders();
    }

    // Set up event listeners
    initEventListeners() {
        // Form submission
        this.reminderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddReminder();
        });
        
        // Filter change
        this.filterPriority.addEventListener('change', () => {
            this.renderReminders();
        });
        
        // Toggle completed reminders
        this.toggleCompletedBtn.addEventListener('click', () => {
            const showCompleted = this.reminderManager.toggleShowCompleted();
            this.toggleCompletedBtn.textContent = showCompleted ? 'Hide Completed' : 'Show Completed';
            this.renderReminders();
        });
    }

    // Handle form submission
    handleAddReminder() {
        const reminderData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            priority: document.getElementById('priority').value,
            recurring: document.getElementById('recurring').value
        };
        
        this.reminderManager.addReminder(reminderData);
        this.renderReminders();
        this.reminderForm.reset();
        this.showNotification('Reminder added successfully!');
    }

    // Render all reminders to the list
    renderReminders() {
        const priorityFilter = this.filterPriority.value;
        const reminders = this.reminderManager.getReminders(priorityFilter);
        
        this.remindersList.innerHTML = '';
        
        if (reminders.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        reminders.forEach(reminder => {
            this.renderReminderItem(reminder);
        });
    }

    // Render a single reminder item
    renderReminderItem(reminder) {
        const status = this.reminderManager.getReminderStatus(reminder);
        const reminderElement = document.createElement('div');
        reminderElement.className = `reminder-item ${reminder.priority}-priority`;
        
        if (reminder.completed) {
            reminderElement.classList.add('completed');
        }
        
        reminderElement.innerHTML = `
            <div class="reminder-content">
                <h3 class="reminder-title">${this.escapeHtml(reminder.title)}</h3>
                <p class="reminder-description">${this.escapeHtml(reminder.description) || '(No description)'}</p>
                <div class="reminder-meta">
                    <span class="${status}">
                        <i class="fas fa-calendar"></i> 
                        ${reminder.date} at ${reminder.time}
                    </span>
                    <span>
                        <i class="fas fa-sync-alt"></i> 
                        ${reminder.recurring !== 'none' ? this.capitalizeFirstLetter(reminder.recurring) : 'One-time'}
                    </span>
                    <span class="priority-badge priority-${reminder.priority}">
                        ${this.capitalizeFirstLetter(reminder.priority)}
                    </span>
                </div>
            </div>
            <div class="reminder-actions">
                <button class="action-btn complete-btn" data-id="${reminder.id}" title="Mark as ${reminder.completed ? 'incomplete' : 'complete'}">
                    <i class="fas ${reminder.completed ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button class="action-btn edit-btn" data-id="${reminder.id}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${reminder.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        this.remindersList.appendChild(reminderElement);
        
        // Add event listeners for buttons
        const completeBtn = reminderElement.querySelector('.complete-btn');
        const deleteBtn = reminderElement.querySelector('.delete-btn');
        const editBtn = reminderElement.querySelector('.edit-btn');
        
        completeBtn.addEventListener('click', () => {
            this.reminderManager.toggleComplete(reminder.id);
            this.renderReminders();
            this.showNotification(`Reminder marked as ${reminder.completed ? 'incomplete' : 'complete'}`);
        });
        
        deleteBtn.addEventListener('click', () => {
            this.reminderManager.deleteReminder(reminder.id);
            this.renderReminders();
            this.showNotification('Reminder deleted');
        });
        
        editBtn.addEventListener('click', () => {
            // For simplicity, we're not implementing edit functionality
            // But in a full app, this would open an edit form
            this.showNotification('Edit functionality coming soon!');
        });
    }

    // Show empty state when no reminders
    renderEmptyState() {
        this.remindersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No reminders to display</p>
            </div>
        `;
    }

    // Show notification
    showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        notificationText.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Helper methods
    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}