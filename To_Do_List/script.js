// ===== Estado da Aplicação =====
let tasks = [];
let currentFilter = 'todas';
let currentSort = 'data';
let isDarkMode = false;

// ===== Elementos do DOM =====
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskCategorySelect = document.getElementById('task-category');
const taskPrioritySelect = document.getElementById('task-priority');
const taskDateInput = document.getElementById('task-date');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const filterCategory = document.getElementById('filter-category');
const sortBy = document.getElementById('sort-by');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const themeToggle = document.getElementById('theme-toggle');

// ===== Inicialização =====
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateStats();
    setMinDate();
});

// ===== Funções Principais =====

// Define a data mínima como hoje
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    taskDateInput.setAttribute('min', today);
}

// Carregar tarefas do localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Salvar tarefas no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Renderizar tarefas na tela
function renderTasks() {
    let filteredTasks = filterTasks(tasks);
    let sortedTasks = sortTasks(filteredTasks);
    
    taskList.innerHTML = '';
    
    if (sortedTasks.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        sortedTasks.forEach(task => {
            const taskCard = createTaskCard(task);
            taskList.appendChild(taskCard);
        });
    }
    
    updateStats();
}

// Criar card de tarefa
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card priority-${task.priority} ${task.completed ? 'completed' : ''}`;
    card.dataset.id = task.id;
    
    const formattedDate = formatDate(task.date);
    const categoryIcon = getCategoryIcon(task.category);
    
    card.innerHTML = `
        <div class="task-header">
            <span class="task-name">${escapeHtml(task.name)}</span>
            <span class="task-priority ${task.priority}">${getPriorityLabel(task.priority)}</span>
        </div>
        <div class="task-details">
            <span class="task-category ${task.category}">
                ${categoryIcon} ${getCategoryLabel(task.category)}
            </span>
            <span class="task-date">📅 ${formattedDate}</span>
        </div>
        <div class="task-actions">
            <button class="btn-action btn-complete" onclick="toggleComplete(${task.id})">
                ${task.completed ? '↩️ Desfazer' : '✅ Concluir'}
            </button>
            <button class="btn-action btn-delete" onclick="deleteTask(${task.id})">
                🗑️ Excluir
            </button>
        </div>
    `;
    
    return card;
}

// Filtrar tarefas por categoria
function filterTasks(tasksToFilter) {
    if (currentFilter === 'todas') {
        return tasksToFilter;
    }
    return tasksToFilter.filter(task => task.category === currentFilter);
}

// Ordenar tarefas
function sortTasks(tasksToSort) {
    const priorityOrder = { alta: 3, media: 2, baixa: 1 };
    
    if (currentSort === 'prioridade') {
        return [...tasksToSort].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else {
        // Ordenar por data (mais próxima primeiro)
        return [...tasksToSort].sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}

// Atualizar contador de tarefas
function updateStats() {
    const pending = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;
    
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

// ===== Event Listeners =====

// Adicionar nova tarefa
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const taskName = taskNameInput.value.trim();
    const taskCategory = taskCategorySelect.value;
    const taskPriority = taskPrioritySelect.value;
    const taskDate = taskDateInput.value;
    
    // Validação
    if (!taskName || !taskCategory || !taskPriority || !taskDate) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        name: taskName,
        category: taskCategory,
        priority: taskPriority,
        date: taskDate,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    // Limpar formulário
    taskForm.reset();
});

// Filtrar por categoria
filterCategory.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderTasks();
});

// Ordenar tarefas
sortBy.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTasks();
});

// Alternar modo escuro/claro
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    }
    
    localStorage.setItem('darkMode', isDarkMode);
});

// Verificar modo escuro salvo
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    isDarkMode = true;
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

// ===== Funções Auxiliares =====

// Marcar/desmarcar tarefa como concluída
function toggleComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Excluir tarefa
function deleteTask(taskId) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
    }
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Obter ícone da categoria
function getCategoryIcon(category) {
    const icons = {
        trabalho: '💼',
        estudos: '📚',
        pessoal: '🏠'
    };
    return icons[category] || '📌';
}

// Obter nome da categoria
function getCategoryLabel(category) {
    const labels = {
        trabalho: 'Trabalho',
        estudos: 'Estudos',
        pessoal: 'Pessoal'
    };
    return labels[category] || category;
}

// Obter nome da prioridade
function getPriorityLabel(priority) {
    const labels = {
        alta: 'Alta',
        media: 'Média',
        baixa: 'Baixa'
    };
    return labels[priority] || priority;
}

// Escapar HTML para evitar XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

