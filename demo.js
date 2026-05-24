window.addEventListener('DOMContentLoaded', function () {

  /* ── Counts ── */
  function syncCounts() {
    document.querySelectorAll('.board .column').forEach(function (col) {
      var count = col.querySelectorAll('.task-card').length;
      var countEl = col.querySelector('.header-count');
      if (countEl) countEl.textContent = '(' + count + ')';
    });
    var total = document.querySelectorAll('.board .task-card').length;
    var myEl = document.querySelector('[data-my-tasks-count]');
    if (myEl) myEl.textContent = total;
    var allEl = document.querySelector('[data-all-tasks-count]');
    if (allEl) allEl.textContent = total;
  }

  syncCounts();

  /* ── New-task type picker (blue toolbar button) ── */
  var taskModalBackdrop   = document.querySelector('[data-task-modal]');
  var closeTaskModalBtn   = document.querySelector('[data-close-task-modal]');
  var modalTitleEls       = document.querySelectorAll('[data-modal-task-title]');
  var modalTitleEditEls   = document.querySelectorAll('[data-modal-task-title-edit]');
  var modalCommentEl      = document.querySelector('[data-modal-task-comment]');
  var safetyTriangle      = taskModalBackdrop && taskModalBackdrop.querySelector('.modal-safety-triangle');
  var pinLabel            = taskModalBackdrop && taskModalBackdrop.querySelector('.pin-team-label');
  var taskTypeMenu        = document.querySelector('[data-task-type-menu]');
  var newTaskBtn          = document.querySelector('[data-new-task-btn]');

  var TYPE_CONFIG = {
    safety: { label: 'Safety',     pinClass: null,     isSafety: true  },
    p1:     { label: 'Priority 1', pinClass: 'red',    isSafety: false },
    p2:     { label: 'Priority 2', pinClass: 'orange', isSafety: false },
    p3:     { label: 'Priority 3', pinClass: 'yellow', isSafety: false },
  };

  function openTaskModal(title, type) {
    title = title || 'New task';
    type  = type  || 'p2';
    if (!taskModalBackdrop) return;
    var cfg = TYPE_CONFIG[type] || TYPE_CONFIG.p2;

    taskModalBackdrop.hidden = false;
    modalTitleEls.forEach(function (el) { el.textContent = title; });
    modalTitleEditEls.forEach(function (el) { el.textContent = title; });
    if (modalCommentEl) modalCommentEl.textContent = '';

    document.querySelectorAll('[data-modal-status]').forEach(function (el) {
      el.textContent = cfg.label;
    });

    if (safetyTriangle) safetyTriangle.hidden = !cfg.isSafety;
    if (pinLabel) {
      pinLabel.hidden = cfg.isSafety;
      pinLabel.className = 'pin pin-team-label' + (cfg.pinClass ? ' ' + cfg.pinClass : '');
    }
  }

  if (closeTaskModalBtn) {
    closeTaskModalBtn.addEventListener('click', function () {
      taskModalBackdrop.hidden = true;
    });
  }

  if (newTaskBtn) {
    newTaskBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      taskTypeMenu.hidden = !taskTypeMenu.hidden;
    });
  }

  document.querySelectorAll('[data-task-type]').forEach(function (opt) {
    opt.addEventListener('click', function () {
      taskTypeMenu.hidden = true;
      openTaskModal('New task', opt.dataset.taskType);
    });
  });

  document.querySelectorAll('[data-mobile-new-task]').forEach(function (btn) {
    btn.addEventListener('click', function () { openTaskModal('New task', 'p2'); });
  });

  /* ── Inline new-task form (column "+ New task" links) ── */
  document.querySelectorAll('.new-task-link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.new-task-form').forEach(function (f) { f.remove(); });
      document.querySelectorAll('.new-task-link').forEach(function (b) { b.style.display = ''; });
      btn.style.display = 'none';

      var form       = document.createElement('div');
      form.className = 'new-task-form';

      var input         = document.createElement('input');
      input.type        = 'text';
      input.placeholder = 'Enter title';

      var confirmBtn         = document.createElement('button');
      confirmBtn.className   = 'btn-confirm';
      confirmBtn.innerHTML   = '✓';
      confirmBtn.disabled    = true;

      var cancelBtn       = document.createElement('button');
      cancelBtn.className = 'btn-cancel';
      cancelBtn.innerHTML = '✕';

      input.addEventListener('input', function () {
        confirmBtn.disabled = input.value.trim() === '';
      });

      cancelBtn.addEventListener('click', function () {
        form.remove();
        btn.style.display = '';
      });

      confirmBtn.addEventListener('click', function () {
        var title = input.value.trim();
        if (!title) return;
        var taskNum = document.querySelectorAll('.task-card').length + 1;
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

  /* ── Context menu (right-click on task card) ── */
  var contextMenu   = document.querySelector('[data-task-context-menu]');
  var contextTarget = null;

  var board = document.querySelector('.board');
  if (board && contextMenu) {
    board.addEventListener('contextmenu', function (e) {
      var card = e.target.closest('.task-card');
      if (!card) return;
      e.preventDefault();
      contextTarget = card;
      var zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      contextMenu.style.left = (e.pageX / zoom) + 'px';
      contextMenu.style.top  = (e.pageY / zoom) + 'px';
      contextMenu.hidden = false;
    });
  }

  document.addEventListener('click', function (e) {
    if (contextMenu && !contextMenu.hidden && !contextMenu.contains(e.target)) {
      contextMenu.hidden = true;
    }
    if (taskTypeMenu && !taskTypeMenu.hidden && e.target !== newTaskBtn && !taskTypeMenu.contains(e.target)) {
      taskTypeMenu.hidden = true;
    }
  });

  var deleteBtn = document.querySelector('[data-delete-task]');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
      if (contextTarget) {
        contextTarget.remove();
        contextTarget = null;
        syncCounts();
      }
      if (contextMenu) contextMenu.hidden = true;
    });
  }

});
