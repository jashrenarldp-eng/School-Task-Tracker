// Global memory cache for Firestore tasks
let cachedAllTasks = [];

// ==========================================
// 1. TOP OF FILE: State & Helper Functions
// ==========================================
function getArchivedTasks() {
  return JSON.parse(localStorage.getItem('takeitdoit_archived')) || [];
}

function archiveTask(taskId) {
  const archived = getArchivedTasks();
  if (!archived.some(item => item.id === taskId)) {
    archived.push({ id: taskId, archivedAt: Date.now() });
    localStorage.setItem('takeitdoit_archived', JSON.stringify(archived));
  }
  renderTaskGrid();
}

function unarchiveTask(taskId) {
  let archived = getArchivedTasks();
  archived = archived.filter(item => item.id !== taskId);
  localStorage.setItem('takeitdoit_archived', JSON.stringify(archived));
  renderTaskGrid();
  renderArchivedModal();
}

// ==========================================
// 2. FIRESTORE LISTENER & GRID RENDERER
// ==========================================
db.collection("tasks").onSnapshot((snapshot) => {
  cachedAllTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderTaskGrid();
});

function renderTaskGrid() {
  const taskGrid = document.getElementById("taskGrid");
  if (!taskGrid) return;

  const archivedList = getArchivedTasks();
  const archivedIds = archivedList.map(item => item.id);
  const activeTasks = cachedAllTasks.filter(task => !archivedIds.includes(task.id));

  if (activeTasks.length === 0) {
    taskGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        No active tasks remaining.
      </div>`;
    return;
  }

  taskGrid.innerHTML = activeTasks.map(createCardHTML).join('');
}

// ==========================================
// 3. ARCHIVE MODAL RENDERER
// ==========================================
function renderArchivedModal() {
  const archiveListEl = document.getElementById("archiveList");
  if (!archiveListEl) return;

  const archivedList = getArchivedTasks();
  const archivedIds = archivedList.map(item => item.id);
  
  // Cross-reference archived IDs with cached Firestore data
  const archivedTasks = cachedAllTasks.filter(task => archivedIds.includes(task.id));

  if (archivedTasks.length === 0) {
    archiveListEl.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-muted);">
        No archived tasks.
      </div>`;
    return;
  }

  archiveListEl.innerHTML = archivedTasks.map(task => `
    <div class="archive-item">
      <div>
        <span class="badge" style="font-size: 0.7rem;">${(task.subject || 'GENERAL').toUpperCase()}</span>
        <strong style="display: block; margin-top: 4px;">${task.title || 'Untitled Task'}</strong>
      </div>
      <button onclick="unarchiveTask('${task.id}')" class="btn-unarchive">
        ↩️ Restore
      </button>
    </div>
  `).join('');
}

// ==========================================
// 4. CARD TEMPLATE
// ==========================================
function createCardHTML(task) {
  return `
    <div class="task-card">
      <span class="badge">${(task.subject || 'GENERAL').toUpperCase()}</span>
      <h3>${task.title}</h3>
      <p>${task.dueDate || ''}</p>
      <button onclick="archiveTask('${task.id}')" class="btn-archive">
        📦 Archive
      </button>
    </div>
  `;
}

// ==========================================
// 5. EVENT LISTENERS & GLOBAL EXPORTS
// ==========================================
document.getElementById("btnOpenArchive")?.addEventListener("click", () => {
  renderArchivedModal();
  document.getElementById("archiveModal")?.classList.add("active");
});

document.getElementById("btnCloseArchive")?.addEventListener("click", () => {
  document.getElementById("archiveModal")?.classList.remove("active");
});

window.archiveTask = archiveTask;
window.unarchiveTask = unarchiveTask;
window.renderArchivedModal = renderArchivedModal;
