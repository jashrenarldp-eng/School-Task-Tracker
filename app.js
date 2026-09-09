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
  renderTaskGrid(); // Refresh UI
}

function unarchiveTask(taskId) {
  let archived = getArchivedTasks();
  archived = archived.filter(item => item.id !== taskId);
  localStorage.setItem('takeitdoit_archived', JSON.stringify(archived));
  renderTaskGrid();
  renderArchivedModal();
}

// ==========================================
// 2. MIDDLE: Firestore Listener & Task Renderer
// ==========================================
db.collection("tasks").onSnapshot((snapshot) => {
  const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // --- INSERT FILTER HERE ---
  const archivedList = getArchivedTasks();
  const archivedIds = archivedList.map(item => item.id);
  const activeTasks = allTasks.filter(task => !archivedIds.includes(task.id));
  
  // Pass activeTasks to your HTML generator
  renderCards(activeTasks);
});

// ==========================================
// 3. CARD TEMPLATE: Inside your HTML string builder
// ==========================================
function createCardHTML(task) {
  return `
    <div class="task-card">
      <h3>${task.title}</h3>
      <p>${task.subject}</p>
      <!-- Add click trigger for archiving -->
      <button onclick="archiveTask('${task.id}')" class="btn-archive">
        📦 Archive
      </button>
    </div>
  `;
}
// Expose functions globally so HTML inline onclick buttons can see them
window.archiveTask = archiveTask;
window.unarchiveTask = unarchiveTask;
