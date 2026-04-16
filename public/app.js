// ============================================
// API Configuration
// ============================================
const API_BASE = window.location.origin;
const API_ENDPOINTS = {
    health: `${API_BASE}/api/health`,
    tasks: `${API_BASE}/api/tasks`
};

// ============================================
// State Management
// ============================================
let tasks = [];
let currentFilter = 'all';

// ============================================
// DOM Elements
// ============================================
const elements = {
    taskForm: document.getElementById('taskForm'),
    taskTitle: document.getElementById('taskTitle'),
    taskDescription: document.getElementById('taskDescription'),
    taskPriority: document.getElementById('taskPriority'),
    tasksList: document.getElementById('tasksList'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    statusBadge: document.getElementById('statusBadge'),
    serverUptime: document.getElementById('serverUptime'),
    toast: document.getElementById('toast'),
    // Stats
    totalTasks: document.getElementById('totalTasks'),
    inProgressTasks: document.getElementById('inProgressTasks'),
    completedTasks: document.getElementById('completedTasks'),
    pendingTasks: document.getElementById('pendingTasks')
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkServerHealth();
    setInterval(checkServerHealth, 30000); // Check every 30 seconds
});

async function initializeApp() {
    await fetchTasks();
    updateStats();
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Task form submission
    elements.taskForm.addEventListener('submit', handleTaskSubmit);

    // Filter buttons
    elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            elements.filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks();
        });
    });

    // Theme toggle (optional feature)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            showToast('Theme customization coming soon!', 'success');
        });
    }

    // API docs link
    const apiDocs = document.getElementById('apiDocs');
    if (apiDocs) {
        apiDocs.addEventListener('click', (e) => {
            e.preventDefault();
            showApiInfo();
        });
    }
}

// ============================================
// API Functions
// ============================================
async function fetchTasks() {
    try {
        const response = await fetch(API_ENDPOINTS.tasks);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        tasks = await response.json();
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showToast('Failed to load tasks', 'error');
    }
}

async function createTask(taskData) {
    try {
        const response = await fetch(API_ENDPOINTS.tasks, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) throw new Error('Failed to create task');

        const newTask = await response.json();
        tasks.push(newTask);
        renderTasks();
        updateStats();
        showToast('Task created successfully!', 'success');
        return newTask;
    } catch (error) {
        console.error('Error creating task:', error);
        showToast('Failed to create task', 'error');
        throw error;
    }
}

async function updateTask(taskId, updates) {
    try {
        const response = await fetch(`${API_ENDPOINTS.tasks}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        if (!response.ok) throw new Error('Failed to update task');

        const updatedTask = await response.json();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = updatedTask;
            renderTasks();
            updateStats();
        }
        showToast('Task updated!', 'success');
        return updatedTask;
    } catch (error) {
        console.error('Error updating task:', error);
        showToast('Failed to update task', 'error');
        throw error;
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_ENDPOINTS.tasks}/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete task');

        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
        updateStats();
        showToast('Task deleted!', 'success');
    } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Failed to delete task', 'error');
        throw error;
    }
}

async function checkServerHealth() {
    try {
        const response = await fetch(API_ENDPOINTS.health);
        if (!response.ok) throw new Error('Server unhealthy');

        const health = await response.json();
        updateServerStatus(true, health.uptime);
    } catch (error) {
        console.error('Health check failed:', error);
        updateServerStatus(false);
    }
}

// ============================================
// Event Handlers
// ============================================
async function handleTaskSubmit(e) {
    e.preventDefault();

    const taskData = {
        title: elements.taskTitle.value.trim(),
        description: elements.taskDescription.value.trim(),
        priority: elements.taskPriority.value
    };

    if (!taskData.title) {
        showToast('Please enter a task title', 'error');
        return;
    }

    try {
        await createTask(taskData);
        elements.taskForm.reset();
    } catch (error) {
        // Error already handled in createTask
    }
}

function handleTaskCheckbox(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(taskId, { status: newStatus });
}

function handleTaskStatusChange(taskId, newStatus) {
    updateTask(taskId, { status: newStatus });
}

function handleTaskDelete(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(taskId);
    }
}

// ============================================
// Rendering Functions
// ============================================
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        elements.tasksList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>No tasks found</h3>
                <p>Create your first task to get started!</p>
            </div>
        `;
        return;
    }

    elements.tasksList.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');

    // Attach event listeners to task elements
    filteredTasks.forEach(task => {
        const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
        if (!taskElement) return;

        // Checkbox
        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.addEventListener('click', () => handleTaskCheckbox(task.id));

        // Status select
        const statusSelect = taskElement.querySelector('.task-status-select');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                handleTaskStatusChange(task.id, e.target.value);
            });
        }

        // Delete button
        const deleteBtn = taskElement.querySelector('.task-btn.delete');
        deleteBtn.addEventListener('click', () => handleTaskDelete(task.id));
    });
}

function createTaskHTML(task) {
    const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return `
        <div class="task-item ${task.status}" data-task-id="${task.id}">
            <div class="task-checkbox"></div>
            <div class="task-content">
                <div class="task-header">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
                ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                <div class="task-meta">
                    <span class="task-status ${task.status}">
                        ${getStatusIcon(task.status)}
                        ${formatStatus(task.status)}
                    </span>
                    <span>•</span>
                    <span>Created ${createdDate}</span>
                </div>
            </div>
            <div class="task-actions">
                <select class="task-status-select task-btn" style="width: auto; padding: 0 8px;">
                    <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button class="task-btn delete" aria-label="Delete task">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function getFilteredTasks() {
    if (currentFilter === 'all') return tasks;
    return tasks.filter(task => task.status === currentFilter);
}

// ============================================
// Stats Update
// ============================================
function updateStats() {
    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length
    };

    animateValue(elements.totalTasks, parseInt(elements.totalTasks.textContent) || 0, stats.total, 500);
    animateValue(elements.pendingTasks, parseInt(elements.pendingTasks.textContent) || 0, stats.pending, 500);
    animateValue(elements.inProgressTasks, parseInt(elements.inProgressTasks.textContent) || 0, stats.inProgress, 500);
    animateValue(elements.completedTasks, parseInt(elements.completedTasks.textContent) || 0, stats.completed, 500);
}

// ============================================
// UI Helper Functions
// ============================================
function updateServerStatus(isHealthy, uptime) {
    if (isHealthy) {
        elements.statusBadge.innerHTML = `
            <span class="status-dot"></span>
            <span>Connected</span>
        `;

        if (uptime !== undefined) {
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            elements.serverUptime.textContent = `Uptime: ${hours}h ${minutes}m`;
        }
    } else {
        elements.statusBadge.innerHTML = `
            <span class="status-dot" style="background: var(--accent-orange);"></span>
            <span>Disconnected</span>
        `;
        elements.statusBadge.style.background = 'rgba(255, 107, 107, 0.1)';
        elements.statusBadge.style.borderColor = 'rgba(255, 107, 107, 0.3)';
        elements.statusBadge.style.color = 'var(--accent-orange)';
    }
}

function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

function showApiInfo() {
    const apiInfo = `
Available API Endpoints:

GET  /api/health - Server health check
GET  /api/tasks - Get all tasks
POST /api/tasks - Create new task
PUT  /api/tasks/:id - Update task
DELETE /api/tasks/:id - Delete task

Server: ${API_BASE}
    `.trim();

    alert(apiInfo);
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

function formatStatus(status) {
    return status.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function getStatusIcon(status) {
    const icons = {
        'pending': '⏳',
        'in-progress': '🔄',
        'completed': '✅'
    };
    return icons[status] || '📋';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Error Handling
// ============================================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('An unexpected error occurred', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An unexpected error occurred', 'error');
});

// ============================================
// Export for debugging (development only)
// ============================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.TaskFlowDebug = {
        tasks,
        API_ENDPOINTS,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask
    };
}
