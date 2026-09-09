// Global memory cache for Firestore tasks
let cachedAllTasks = [];

// ==========================================
// 1. STATE & HELPER FUNCTIONS
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

// Expose functions globally for inline onclick handlers
window.archiveTask = archiveTask;
window.unarchiveTask = unarchiveTask;
window.renderArchivedModal = renderArchivedModal;

// ==========================================
// 2. FIRESTORE REAL-TIME LISTENER
// ==========================================
// Supports both Firebase v8 (db.collection) and Firebase v9/v10 Modular
if (typeof db !== "undefined") {
  if (typeof db.collection === "function") {
    // Firebase v8 / Compat SDK
    db.collection("tasks").onSnapshot((snapshot) => {
      cachedAllTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderTaskGrid();
    });
  } else {
    // Firebase v9+ Modular SDK (if collection and onSnapshot are imported)
    try {
      onSnapshot(collection(db, "tasks"), (snapshot) => {
        cachedAllTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTaskGrid();
      });
    } catch (e) {
      console.warn("Firestore listener fallback: ensure collection/onSnapshot are imported.", e);
    }
  }
}

// ==========================================
// 3. RENDER FUNCTIONS
// ==========================================
function renderTaskGrid() {
  const taskGrid = document.getElementById("taskGrid");
  if (!taskGrid) return;

  const archivedList = getArchivedTasks();
  const archivedIds = archivedList.map(item => item.id);
  const activeTasks = cachedAllTasks.filter(task => !archivedIds.includes(task.id));

  if (activeTasks.length === 0) {
    taskGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted, #888);">
        No active tasks remaining.
      </div>`;
    return;
  }

  taskGrid.innerHTML = activeTasks.map(createCardHTML).join('');
}

function renderArchivedModal() {
  const archiveListEl = document.getElementById("archiveList");
  if (!archiveListEl) return;

  const archivedList = getArchivedTasks();
  const archivedIds = archivedList.map(item => item.id);
  
  // Match archived IDs against Firestore cached tasks
  const archivedTasks = cachedAllTasks.filter(task => archivedIds.includes(task.id));

  if (archivedTasks.length === 0) {
    archiveListEl.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-muted, #888);">
        No archived tasks found.
      </div>`;
    return;
  }

  archiveListEl.innerHTML = archivedTasks.map(task => `
    <div class="archive-item">
      <div>
        <span class="badge" style="font-size: 0.75rem;">${(task.subject || 'GENERAL').toUpperCase()}</span>
        <strong style="display: block; margin-top: 4px;">${task.title || 'Untitled Task'}</strong>
      </div>
      <button onclick="unarchiveTask('${task.id}')" class="btn-unarchive">
        ↩️ Restore
      </button>
    </div>
  `).join('');
}

function createCardHTML(task) {
  return `
    <div class="task-card">
      <span class="badge">${(task.subject || 'GENERAL').toUpperCase()}</span>
      <h3>${task.title || 'Untitled Task'}</h3>
      <p>${task.dueDate || ''}</p>
      <button onclick="archiveTask('${task.id}')" class="btn-archive">
        📦 Archive
      </button>
    </div>
  `;
}

// ==========================================
// 4. SAFE EVENT LISTENER ATTACHMENT
// ==========================================
function initArchiveEventListeners() {
  const btnOpenArchive = document.getElementById("btnOpenArchive");
  const btnCloseArchive = document.getElementById("btnCloseArchive");
  const archiveModal = document.getElementById("archiveModal");

  if (btnOpenArchive) {
    btnOpenArchive.onclick = () => {
      renderArchivedModal();
      archiveModal?.classList.add("active");
    };
  } else {
    console.warn("Element #btnOpenArchive not found in DOM.");
  }

  if (btnCloseArchive) {
    btnCloseArchive.onclick = () => {
      archiveModal?.classList.remove("active");
    };
  }

  // Close modal when clicking dark backdrop
  if (archiveModal) {
    archiveModal.onclick = (e) => {
      if (e.target === archiveModal) {
        archiveModal.classList.remove("active");
      }
    };
  }
}

// Run listener attachment whether DOM is already loaded or pending
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initArchiveEventListeners);
} else {
  initArchiveEventListeners();
}
