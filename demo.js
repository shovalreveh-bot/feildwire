window.addEventListener("DOMContentLoaded", () => {
  const taskModalBackdrop = document.querySelector("[data-task-modal]");
  const closeTaskModalButton = document.querySelector("[data-close-task-modal]");
  const modalTitleElements = document.querySelectorAll("[data-modal-task-title]");
  const modalTitleEditElements = document.querySelectorAll("[data-modal-task-title-edit]");
  const modalCommentElement = document.querySelector("[data-modal-task-comment]");
  const safetyTriangle = taskModalBackdrop?.querySelector(".modal-safety-triangle");
  const pinLabel = taskModalBackdrop?.querySelector(".pin-team-label");
  const taskTypeMenu = document.querySelector("[data-task-type-menu]");
  const newTaskBtn = document.querySelector("[data-new-task-btn]");

  const TYPE_CONFIG = {
    safety: { label: "Safety", pinClass: null, isSafety: true },
    p1:     { label: "Priority 1", pinClass: "red",    isSafety: false },
    p2:     { label: "Priority 2", pinClass: "orange",  isSafety: false },
    p3:     { label: "Priority 3", pinClass: "yellow",  isSafety: false },
  };

  const openTaskModal = (title = "New task", type = "p2") => {
    if (!taskModalBackdrop) return;
    const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.p2;

    taskModalBackdrop.hidden = false;
    modalTitleElements.forEach((el) => { el.textContent = title; });
    modalTitleEditElements.forEach((el) => { el.textContent = title; });
    if (modalCommentElement) modalCommentElement.textContent = "";

    document.querySelectorAll("[data-modal-status]").forEach((el) => {
      el.textContent = cfg.label;
    });

    if (safetyTriangle) safetyTriangle.hidden = !cfg.isSafety;
    if (pinLabel) {
      pinLabel.hidden = cfg.isSafety;
      pinLabel.className = `pin pin-team-label${cfg.pinClass ? " " + cfg.pinClass : ""}`;
    }
  };

  const closeTaskModal = () => {
    if (!taskModalBackdrop) return;
    taskModalBackdrop.hidden = true;
  };

  const closeTypeMenu = () => {
    if (taskTypeMenu) taskTypeMenu.hidden = true;
  };

  closeTaskModalButton?.addEventListener("click", closeTaskModal);

  newTaskBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (taskTypeMenu) taskTypeMenu.hidden = !taskTypeMenu.hidden;
  });

  document.querySelectorAll("[data-task-type]").forEach((opt) => {
    opt.addEventListener("click", () => {
      const type = opt.dataset.taskType;
      closeTypeMenu();
      openTaskModal("New task", type);
    });
  });

  document.addEventListener("click", (e) => {
    if (taskTypeMenu && !taskTypeMenu.hidden && !taskTypeMenu.contains(e.target) && e.target !== newTaskBtn) {
      closeTypeMenu();
    }
  });

  document.querySelectorAll("[data-mobile-new-task]").forEach((button) => {
    button.addEventListener("click", () => openTaskModal("New task", "p2"));
  });
});

window.addEventListener('DOMContentLoaded', function() {
document.querySelectorAll('.new-task-link').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.new-task-form').forEach(function(f) { f.remove(); });
    document.querySelectorAll('.new-task-link').forEach(function(b) { b.style.display = ''; });

    btn.style.display = 'none';

    var form = document.createElement('div');
    form.className = 'new-task-form';

    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter title';

    var confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-confirm';
    confirmBtn.innerHTML = '✓';
    confirmBtn.disabled = true;

    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-cancel';
    cancelBtn.innerHTML = '✕';

    input.addEventListener('input', function() {
      confirmBtn.disabled = input.value.trim() === '';
    });

    cancelBtn.addEventListener('click', function() {
      form.remove();
      btn.style.display = '';
    });

    confirmBtn.addEventListener('click', function() {
      var title = input.value.trim();
      if (!title) return;
      var allCards = document.querySelectorAll('.task-card');
      var taskNum = allCards.length + 1;
      var card = document.createElement('div');
      card.className = 'task-card compact';
      card.innerHTML = '<div class="square"></div><div><div class="meta">#' + taskNum + ' | @SRE</div><div>' + title + '</div></div>';
      form.remove();
      btn.style.display = '';
      btn.parentElement.insertBefore(card, btn);
      syncCounts();
    });

    var buttons = document.createElement('div');
    buttons.className = 'form-buttons';
    buttons.appendChild(confirmBtn);
    buttons.appendChild(cancelBtn);
    form.appendChild(input);
    form.appendChild(buttons);
    btn.parentElement.insertBefore(form, btn.nextSibling);
    input.focus();
});
  });
});

function syncCounts() {
  document.querySelectorAll('.board .column').forEach(function(col) {
    var count = col.querySelectorAll('.task-card').length;
    var countEl = col.querySelector('.header-count');
    if (countEl) countEl.textContent = '(' + count + ')';
  });
  var total = document.querySelectorAll('.board .task-card').length;
  var myTasksEl = document.querySelector('[data-my-tasks-count]');
  if (myTasksEl) myTasksEl.textContent = total;
}

document.addEventListener('DOMContentLoaded', syncCounts);
