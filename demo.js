window.addEventListener('DOMContentLoaded', function () {

  /* ══════════════════════════════════════════
     COUNT SYNC
  ══════════════════════════════════════════ */
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

  /* ══════════════════════════════════════════
     MODAL — OPEN / CLOSE
  ══════════════════════════════════════════ */
  var backdrop       = document.querySelector('[data-task-modal]');
  var closeBtn       = document.querySelector('[data-close-task-modal]');
  var modalTitleSpan = document.querySelector('[data-modal-task-title]');
  var modalTitleInput= document.querySelector('[data-modal-title-input]');
  var modalMetaEl    = document.querySelector('[data-modal-task-meta]');
  var safetyTriangle = backdrop && backdrop.querySelector('.modal-safety-triangle');
  var pinLabel       = backdrop && backdrop.querySelector('.pin-team-label');
  var activityFeed   = document.querySelector('[data-modal-activity]');
  var checklistEl    = document.querySelector('[data-modal-checklist]');

  var TYPE_CONFIG = {
    safety: { label: 'Safety',     pinClass: null,     isSafety: true  },
    p1:     { label: 'Priority 1', pinClass: 'red',    isSafety: false },
    p2:     { label: 'Priority 2', pinClass: 'orange', isSafety: false },
    p3:     { label: 'Priority 3', pinClass: 'yellow', isSafety: false },
  };

  function openTaskModal(title, type) {
    title = title || 'New task';
    type  = type  || 'p2';
    var cfg = TYPE_CONFIG[type] || TYPE_CONFIG.p2;

    backdrop.hidden = false;

    if (modalTitleSpan)  modalTitleSpan.textContent  = title;
    if (modalTitleInput) { modalTitleInput.value = title; modalTitleInput.hidden = true; modalTitleSpan.hidden = false; }

    document.querySelectorAll('[data-modal-status]').forEach(function (el) {
      el.textContent = cfg.label;
    });

    // highlight the matching status option
    document.querySelectorAll('.status-option').forEach(function (o) { o.classList.remove('is-active'); });
    var activeOpt = document.querySelector('[data-status-option="' + cfg.label + '"]');
    if (activeOpt) activeOpt.classList.add('is-active');

    if (safetyTriangle) safetyTriangle.hidden = !cfg.isSafety;
    if (pinLabel) {
      pinLabel.hidden = cfg.isSafety;
      pinLabel.className = 'pin pin-team-label' + (cfg.pinClass ? ' ' + cfg.pinClass : '');
    }

    // Toggle the safety-mode skin on the modal
    backdrop.classList.toggle('is-safety', cfg.isSafety);

    // Close any open attr dropdowns
    document.querySelectorAll('.attr-dropdown').forEach(function (d) { d.hidden = true; });
  }

  function closeModal() {
    if (backdrop) backdrop.hidden = true;
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  /* ══════════════════════════════════════════
     OPEN MODAL FROM TASK CARD CLICK
  ══════════════════════════════════════════ */
  var modalTaskCards   = [];
  var modalCurrentIdx  = -1;

  function cardType(card) {
    if (card.closest('.safety-column')) return 'safety';
    if (card.querySelector('.pin.red') || card.querySelector('.red-square')) return 'p1';
    if (card.querySelector('.pin.yellow')) return 'p3';
    return 'p2';
  }

  function openModalForCard(card) {
    modalTaskCards  = Array.from(document.querySelectorAll('.board .task-card'));
    modalCurrentIdx = modalTaskCards.indexOf(card);

    var metaEl  = card.querySelector('.meta');
    var titleEl = card.querySelector('.title');
    var metaText  = metaEl  ? metaEl.textContent.trim()  : '';
    var titleText = titleEl ? titleEl.textContent.trim() : 'New task';
    if (titleText === 'Enter title') titleText = 'New task';

    if (modalMetaEl) modalMetaEl.textContent = metaText || '#? | @SRE';

    // Reset checklist & activity for each task
    if (checklistEl)  checklistEl.innerHTML  = '';
    if (activityFeed) activityFeed.innerHTML = '';

    // Reset attributes to defaults
    document.querySelectorAll('[data-attr-value]').forEach(function (el) {
      var row = el.closest('[data-attr]');
      if (!row) return;
      var attr = row.dataset.attr;
      if (attr === 'assignee') el.innerHTML = 'shoval <i class="caret"></i>';
      else if (attr === 'watchers') el.innerHTML = 'SRE <i class="caret"></i>';
      else if (attr === 'manpower' || attr === 'cost') el.innerHTML = '&mdash; <span class="attr-pencil">✎</span>';
      else el.innerHTML = '&mdash; <i class="caret"></i>';
    });

    openTaskModal(titleText, cardType(card));
  }

  var board = document.querySelector('.board');
  if (board) {
    board.addEventListener('click', function (e) {
      if (e.target.closest('.new-task-form') || e.target.closest('.new-task-link')) return;
      var card = e.target.closest('.task-card');
      if (card) openModalForCard(card);
    });
  }

  /* ══════════════════════════════════════════
     NEW TASK TYPE PICKER (blue toolbar button)
  ══════════════════════════════════════════ */
  var taskTypeMenu = document.querySelector('[data-task-type-menu]');
  var newTaskBtn   = document.querySelector('[data-new-task-btn]');

  if (newTaskBtn) {
    newTaskBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      taskTypeMenu.hidden = !taskTypeMenu.hidden;
    });
  }

  document.querySelectorAll('[data-task-type]').forEach(function (opt) {
    opt.addEventListener('click', function () {
      taskTypeMenu.hidden = true;
      if (modalMetaEl) modalMetaEl.textContent = '#new | @SRE';
      if (checklistEl)  checklistEl.innerHTML  = '';
      if (activityFeed) activityFeed.innerHTML = '';
      openTaskModal('New task', opt.dataset.taskType);
    });
  });

  document.querySelectorAll('[data-mobile-new-task]').forEach(function (btn) {
    btn.addEventListener('click', function () { openTaskModal('New task', 'p2'); });
  });

  /* ══════════════════════════════════════════
     MODAL NAVIGATION (prev / next)
  ══════════════════════════════════════════ */
  var prevBtn = document.querySelector('[data-modal-prev]');
  var nextBtn = document.querySelector('[data-modal-next]');

  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      modalTaskCards = Array.from(document.querySelectorAll('.board .task-card'));
      if (!modalTaskCards.length) return;
      modalCurrentIdx = (modalCurrentIdx - 1 + modalTaskCards.length) % modalTaskCards.length;
      openModalForCard(modalTaskCards[modalCurrentIdx]);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      modalTaskCards = Array.from(document.querySelectorAll('.board .task-card'));
      if (!modalTaskCards.length) return;
      modalCurrentIdx = (modalCurrentIdx + 1) % modalTaskCards.length;
      openModalForCard(modalTaskCards[modalCurrentIdx]);
    });
  }

  /* ══════════════════════════════════════════
     TITLE INLINE EDIT
  ══════════════════════════════════════════ */
  var pencilBtn = document.querySelector('[data-modal-edit-pencil]');

  if (pencilBtn && modalTitleSpan && modalTitleInput) {
    pencilBtn.addEventListener('click', function () {
      modalTitleInput.value = modalTitleSpan.textContent;
      modalTitleSpan.hidden = true;
      modalTitleInput.hidden = false;
      modalTitleInput.focus();
      modalTitleInput.select();
    });

    function saveTitle() {
      var val = modalTitleInput.value.trim();
      if (val) modalTitleSpan.textContent = val;
      modalTitleInput.hidden = true;
      modalTitleSpan.hidden  = false;
    }

    modalTitleInput.addEventListener('blur', saveTitle);
    modalTitleInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter')  saveTitle();
      if (e.key === 'Escape') { modalTitleInput.hidden = true; modalTitleSpan.hidden = false; }
    });
  }

  /* ══════════════════════════════════════════
     STATUS DROPDOWN
  ══════════════════════════════════════════ */
  var statusRow      = document.querySelector('[data-attr="status"]');
  var statusDropdown = document.querySelector('[data-status-dropdown]');

  if (statusRow && statusDropdown) {
    statusRow.addEventListener('click', function (e) {
      if (e.target.closest('[data-status-option]') || e.target.closest('[data-status-delete]')) return;
      statusDropdown.hidden = !statusDropdown.hidden;
    });

    statusDropdown.querySelectorAll('[data-status-option]').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var newStatus = opt.dataset.statusOption;
        document.querySelectorAll('[data-modal-status]').forEach(function (el) {
          el.textContent = newStatus;
        });
        // highlight the active option
        statusDropdown.querySelectorAll('.status-option').forEach(function (o) { o.classList.remove('is-active'); });
        opt.classList.add('is-active');
        // switch between safety / regular layouts when status changes
        backdrop.classList.toggle('is-safety', newStatus === 'Safety');
        statusDropdown.hidden = true;
      });
    });

    var deleteFromStatus = statusDropdown.querySelector('[data-status-delete]');
    if (deleteFromStatus) {
      deleteFromStatus.addEventListener('click', function () {
        var card = modalTaskCards[modalCurrentIdx];
        if (card) { card.remove(); syncCounts(); }
        statusDropdown.hidden = true;
        closeModal();
      });
    }
  }

  /* ══════════════════════════════════════════
     ASSIGNEE DROPDOWN
  ══════════════════════════════════════════ */
  var assigneeRow      = document.querySelector('[data-attr="assignee"]');
  var assigneeDropdown = document.querySelector('[data-assignee-dropdown]');

  if (assigneeRow && assigneeDropdown) {
    assigneeRow.addEventListener('click', function (e) {
      if (e.target.closest('[data-assignee]')) return;
      assigneeDropdown.hidden = !assigneeDropdown.hidden;
    });

    assigneeDropdown.querySelectorAll('[data-assignee]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var valueEl = assigneeRow.querySelector('[data-attr-value]');
        if (valueEl) valueEl.innerHTML = btn.dataset.assignee + ' <i class="caret"></i>';
        assigneeDropdown.hidden = true;
      });
    });
  }

  /* ══════════════════════════════════════════
     INLINE EDITABLE ATTRIBUTES (text / date)
  ══════════════════════════════════════════ */
  document.querySelectorAll('[data-attr-editable]').forEach(function (row) {
    row.addEventListener('click', function () {
      if (row.querySelector('.attr-inline-input')) return;
      var valueEl = row.querySelector('[data-attr-value]');
      if (!valueEl) return;

      var isDate    = row.dataset.attrEditable === 'date';
      var currentRaw = valueEl.textContent.replace('✎', '').replace('▾', '').replace('—', '').trim();

      var input = document.createElement('input');
      input.type      = isDate ? 'date' : 'text';
      input.className = 'attr-inline-input';
      input.value     = (currentRaw === '' || currentRaw === '—') ? '' : currentRaw;

      valueEl.hidden = true;
      row.appendChild(input);
      input.focus();

      function save() {
        var val = input.value.trim();
        var attr = row.dataset.attr;
        var hasPencil = attr === 'manpower' || attr === 'cost';
        var hasCaret  = !hasPencil && attr !== 'start-date' && attr !== 'end-date';
        if (val) {
          valueEl.innerHTML = val + (hasPencil ? ' <span class="attr-pencil">✎</span>' : hasCaret ? ' <i class="caret"></i>' : '');
        } else {
          valueEl.innerHTML = '&mdash;' + (hasPencil ? ' <span class="attr-pencil">✎</span>' : hasCaret ? ' <i class="caret"></i>' : '');
        }
        valueEl.hidden = false;
        input.remove();
      }

      input.addEventListener('blur', save);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter')  { input.blur(); }
        if (e.key === 'Escape') { valueEl.hidden = false; input.remove(); }
      });
    });
  });

  /* ══════════════════════════════════════════
     CHECKLIST — + NEW ITEM
  ══════════════════════════════════════════ */
  var addItemBtn = document.querySelector('[data-modal-add-item]');

  if (addItemBtn && checklistEl) {
    addItemBtn.addEventListener('click', function () {
      if (checklistEl.querySelector('.checklist-new-row')) return;

      var row = document.createElement('div');
      row.className = 'checklist-new-row';
      row.innerHTML = '<input type="text" class="checklist-text-input" placeholder="New item…"><button class="btn-confirm">✓</button><button class="btn-cancel">✕</button>';
      checklistEl.appendChild(row);
      row.querySelector('input').focus();

      row.querySelector('.btn-confirm').addEventListener('click', function () {
        var val = row.querySelector('input').value.trim();
        if (!val) return;
        var li = document.createElement('li');
        li.className = 'checklist-item';
        li.innerHTML = '<label><input type="checkbox"> <span>' + val + '</span></label>';
        checklistEl.insertBefore(li, row);
        row.remove();
      });

      row.querySelector('.btn-cancel').addEventListener('click', function () { row.remove(); });

      row.querySelector('input').addEventListener('keydown', function (e) {
        if (e.key === 'Enter')  row.querySelector('.btn-confirm').click();
        if (e.key === 'Escape') row.remove();
      });
    });
  }

  /* ══════════════════════════════════════════
     ACTIVITY — SEND MESSAGE
  ══════════════════════════════════════════ */
  var msgInput  = document.querySelector('[data-modal-message-input]');
  var shareBtn  = document.querySelector('[data-modal-share]');

  function sendMessage() {
    if (!msgInput || !activityFeed) return;
    var text = msgInput.value.trim();
    if (!text) return;

    var now     = new Date();
    var timeStr = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
    var bubble  = document.createElement('div');
    bubble.className = 'fw-bubble';
    bubble.innerHTML =
      '<div class="user">shoval revach</div>' +
      '<div class="highlight-box">' +
        '<time>' + timeStr + '</time>' +
        '<div class="comment">' + text + '</div>' +
      '</div>';
    activityFeed.appendChild(bubble);
    activityFeed.scrollTop = activityFeed.scrollHeight;
    msgInput.value = '';
  }

  if (shareBtn)  shareBtn.addEventListener('click', sendMessage);
  if (msgInput)  msgInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendMessage(); });

  /* ══════════════════════════════════════════
     INLINE NEW-TASK FORM (column + New task links)
  ══════════════════════════════════════════ */
  document.querySelectorAll('.new-task-link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.new-task-form').forEach(function (f) { f.remove(); });
      document.querySelectorAll('.new-task-link').forEach(function (b) { b.style.display = ''; });
      btn.style.display = 'none';

      var form = document.createElement('div');
      form.className = 'new-task-form';

      var input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Enter title';

      var confirmBtn = document.createElement('button');
      confirmBtn.className = 'btn-confirm';
      confirmBtn.innerHTML = '✓';
      confirmBtn.disabled  = true;

      var cancelBtn = document.createElement('button');
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
        card.innerHTML = '<div class="square"></div><div><div class="meta">#' + taskNum + ' | @SRE</div><div class="title">' + title + '</div></div>';
        form.remove();
        btn.style.display = '';
        btn.parentElement.insertBefore(card, btn);
        syncCounts();
      });

      var btns = document.createElement('div');
      btns.className = 'form-buttons';
      btns.appendChild(confirmBtn);
      btns.appendChild(cancelBtn);
      form.appendChild(input);
      form.appendChild(btns);
      btn.parentElement.insertBefore(form, btn.nextSibling);
      input.focus();
    });
  });

  /* ══════════════════════════════════════════
     CONTEXT MENU (right-click → delete)
  ══════════════════════════════════════════ */
  var contextMenu   = document.querySelector('[data-task-context-menu]');
  var contextTarget = null;

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

  var deleteBtn = document.querySelector('[data-delete-task]');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
      if (contextTarget) { contextTarget.remove(); contextTarget = null; syncCounts(); }
      if (contextMenu) contextMenu.hidden = true;
    });
  }

  /* ══════════════════════════════════════════
     GLOBAL CLICK — close floating menus
  ══════════════════════════════════════════ */
  document.addEventListener('click', function (e) {
    // close context menu
    if (contextMenu && !contextMenu.hidden && !contextMenu.contains(e.target)) {
      contextMenu.hidden = true;
    }
    // close type picker
    if (taskTypeMenu && !taskTypeMenu.hidden && e.target !== newTaskBtn && !taskTypeMenu.contains(e.target)) {
      taskTypeMenu.hidden = true;
    }
    // close attr dropdowns
    document.querySelectorAll('.attr-dropdown').forEach(function (d) {
      if (!d.hidden && !d.contains(e.target) && !d.parentElement.contains(e.target)) {
        d.hidden = true;
      }
    });
  });

  // Close modal by clicking the dark backdrop area
  if (backdrop) {
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });
  }

});
