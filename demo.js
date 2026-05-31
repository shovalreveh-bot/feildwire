window.addEventListener('DOMContentLoaded', function () {

  /* ══════════════════════════════════════════
     PROJECTS PAGE
  ══════════════════════════════════════════ */
  var projectsPage   = document.querySelector('[data-projects-page]');
  var boardPage      = document.querySelector('[data-board-page]');
  var newProjModal   = document.querySelector('[data-new-project-modal]');
  var newProjInput   = document.querySelector('[data-new-project-name]');
  var createProjBtn  = document.querySelector('[data-create-project]');
  var projGrid       = document.querySelector('[data-proj-grid]');
  var projCountEl    = document.querySelector('[data-proj-count]');

  var projects = [
    { name: 'house',              members: 3 },
    { name: 'Sample project - SRE', members: 7 }
  ];

  function memberIcon() {
    return '<svg width="14" height="12" viewBox="0 0 16 13" fill="none"><circle cx="6" cy="4" r="2.5" stroke="#9ca5ae" stroke-width="1.4"/><path d="M1 12c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#9ca5ae" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="4" r="2" stroke="#9ca5ae" stroke-width="1.3"/><path d="M14 12c0-2-1.3-3.7-3-4.4" stroke="#9ca5ae" stroke-width="1.3" stroke-linecap="round"/></svg>';
  }

  function crownIcon() {
    return '<svg width="14" height="12" viewBox="0 0 16 13" fill="none"><path d="M2 10h12M2 10L1 4l4 3 3-5 3 5 4-3-1 6H2z" stroke="#c8cdd2" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  }

  function starIcon() {
    return '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><polygon points="8,2 10,6.5 15,7.2 11.5,10.5 12.5,15.5 8,13 3.5,15.5 4.5,10.5 1,7.2 6,6.5" stroke="#c8cdd2" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  }

  function dotsIcon() {
    return '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="3.5" r="1.2" fill="#9ca5ae"/><circle cx="8" cy="8" r="1.2" fill="#9ca5ae"/><circle cx="8" cy="12.5" r="1.2" fill="#9ca5ae"/></svg>';
  }

  function renderProjects() {
    if (!projGrid) return;
    if (projCountEl) projCountEl.textContent = projects.length;

    var html = projects.map(function (p) {
      return '<div class="proj-card" data-open-project="' + p.name.replace(/"/g, '&quot;') + '">' +
        '<div class="proj-card-top">' +
          '<span class="proj-card-name">' + p.name + '</span>' +
          '<div class="proj-card-icons">' +
            '<button class="proj-icon-btn" type="button" title="Admin">' + crownIcon() + '</button>' +
            '<button class="proj-icon-btn" type="button" title="Star">' + starIcon() + '</button>' +
            '<button class="proj-icon-btn" type="button" title="More">' + dotsIcon() + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="proj-card-bottom">' +
          '<span class="proj-members">' + p.members + ' ' + memberIcon() + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    html += '<div class="proj-card proj-card--new" data-open-new-project>' +
      '<span class="proj-new-label">+ New project</span>' +
    '</div>';

    projGrid.innerHTML = html;
  }

  function openProject(name) {
    var headerName = document.querySelector('.project-header strong');
    if (headerName) headerName.textContent = name;
    if (projectsPage) projectsPage.hidden = true;
    if (boardPage)    boardPage.hidden    = false;
    document.documentElement.classList.add('board-open');
  }

  function showNewProjModal() {
    if (!newProjModal) return;
    newProjModal.hidden = false;
    if (newProjInput) { newProjInput.value = ''; newProjInput.focus(); }
    if (createProjBtn) createProjBtn.disabled = true;
  }

  function hideNewProjModal() {
    if (newProjModal) newProjModal.hidden = true;
  }

  function doCreateProject() {
    if (!newProjInput) return;
    var name = newProjInput.value.trim();
    if (!name) return;
    projects.push({ name: name, members: 1 });
    renderProjects();
    hideNewProjModal();
  }

  // Input → enable/disable create button
  if (newProjInput) {
    newProjInput.addEventListener('input', function () {
      if (createProjBtn) createProjBtn.disabled = newProjInput.value.trim() === '';
    });
    newProjInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doCreateProject();
    });
  }

  if (createProjBtn) createProjBtn.addEventListener('click', doCreateProject);

  // Back to projects: click sidebar project header
  var projHeader = document.querySelector('.project-header');
  if (projHeader) {
    projHeader.style.cursor = 'pointer';
    projHeader.title = 'Back to projects';
    projHeader.addEventListener('click', function () {
      if (boardPage)    boardPage.hidden    = true;
      if (projectsPage) projectsPage.hidden = false;
    });
  }

  renderProjects();

  /* ══════════════════════════════════════════
     NAV ITEMS — click to set active
  ══════════════════════════════════════════ */
  var taskSection = document.getElementById('task-section');
  var taskDivider = document.getElementById('task-divider');

  function setTaskSectionVisible(visible) {
    if (taskSection) taskSection.style.display = visible ? '' : 'none';
    if (taskDivider) taskDivider.style.display = visible ? '' : 'none';
  }

  document.querySelectorAll('.nav-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.remove('active'); });
      item.classList.add('active');
      setTaskSectionVisible(item.dataset.nav === 'tasks');
    });
  });

  /* ══════════════════════════════════════════
     TASK FILTER ITEMS — click to set selected
  ══════════════════════════════════════════ */
  document.querySelectorAll('#task-section .team-wrapper').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('#task-section li').forEach(function (li) { li.classList.remove('selected'); });
      link.closest('li').classList.add('selected');
    });
  });

  /* ══════════════════════════════════════════
     PROJECT MANAGEMENT COLLAPSIBLE SECTION
  ══════════════════════════════════════════ */
  var pmHeader  = document.querySelector('[data-pm-header]');
  var pmContent = document.querySelector('[data-pm-content]');
  if (pmHeader && pmContent) {
    pmHeader.addEventListener('click', function () {
      var collapsed = pmContent.classList.toggle('collapsed');
      pmHeader.classList.toggle('collapsed', collapsed);
    });
  }

  /* ══════════════════════════════════════════
     COUNT SYNC
  ══════════════════════════════════════════ */
  function syncCounts() {
    document.querySelectorAll('.board .column').forEach(function (col) {
      var count = col.querySelectorAll('.task-card').length;
      var countEl = col.querySelector('.header-count');
      if (countEl) countEl.textContent = '(' + count + ')';
    });
    var total       = document.querySelectorAll('.board .task-card').length;
    var myEl        = document.querySelector('[data-my-tasks-count]');
    var watchedEl   = document.querySelector('[data-watched-tasks-count]');
    var allEl       = document.querySelector('[data-all-tasks-count]');
    if (myEl)      myEl.textContent      = total;
    if (watchedEl) watchedEl.textContent = total;
    if (allEl)     allEl.textContent     = total;
  }

  syncCounts();

  /* ══════════════════════════════════════════
     MODAL — OPEN / CLOSE
  ══════════════════════════════════════════ */
  var backdrop       = document.querySelector('[data-task-modal]');
  var closeBtn       = document.querySelector('[data-close-task-modal]');
  var modalTitleSpan = document.querySelector('[data-modal-task-title]');
  var modalTitleEditText = document.querySelector('[data-modal-title-edit-text]');
  var modalTitleInput= document.querySelector('[data-modal-title-input]');
  var modalMetaEl    = document.querySelector('[data-modal-task-meta]');
  var pinContainer   = backdrop && backdrop.querySelector('[data-modal-pin-container]');
  var pinLabel       = backdrop && backdrop.querySelector('[data-pin-team-label]');
  var activityFeed   = document.querySelector('[data-modal-activity]');
  var checklistEl    = document.querySelector('[data-modal-checklist]');

  var TYPE_CONFIG = {
    safety:    { label: 'Safety',     color: '#ff4f4f', shape: 'triangle', isSafety: true  },
    p1:        { label: 'Priority 1', color: '#ff4f4f', shape: 'square',   isSafety: false },
    p2:        { label: 'Priority 2', color: '#ff8a32', shape: 'square',   isSafety: false },
    p3:        { label: 'Priority 3', color: '#ffd149', shape: 'pin',      isSafety: false },
    completed: { label: 'Completed',  color: '#4caf50', shape: 'square',   isSafety: false },
    verified:  { label: 'Verified',   color: '#64b5f6', shape: 'square',   isSafety: false },
  };

  function makePinSVG(shape, color) {
    if (shape === 'triangle') {
      return '<svg class="modal-pin-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><polygon points="30,4 56,56 4,56" fill="' + color + '"/></svg>';
    }
    if (shape === 'pin') {
      return '<svg class="modal-pin-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M51.49,26.61C51.76,20.24 49.52,14.60 45.64,10.57C41.74,6.51 36.18,4.08 29.87,4.13C23.78,4.13 18.22,6.49 14.29,10.62C10.57,14.54 8.33,20.04 8.5,26.63C8.5,34.97 15.72,45.85 30,59.31C44.64,45.34 51.87,34.47 51.49,26.61Z" fill="' + color + '"/></svg>';
    }
    return '<svg class="modal-pin-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-opacity="0.25"><g transform="translate(9,9)" stroke="#1A1D21" fill="' + color + '"><rect x="0.5" y="0.5" width="41" height="41"/></g></g></svg>';
  }

  function openTaskModal(title, type) {
    title = title || 'New task';
    type  = type  || 'p2';
    var cfg = TYPE_CONFIG[type] || TYPE_CONFIG.p2;

    backdrop.hidden = false;

    if (modalTitleSpan)     modalTitleSpan.textContent     = title;
    if (modalTitleEditText) modalTitleEditText.textContent = title;

    document.querySelectorAll('[data-modal-status]').forEach(function (el) {
      el.textContent = cfg.label;
    });

    // highlight the matching status option
    document.querySelectorAll('.status-option').forEach(function (o) { o.classList.remove('is-active'); });
    var activeOpt = document.querySelector('[data-status-option="' + cfg.label + '"]');
    if (activeOpt) activeOpt.classList.add('is-active');

    if (pinContainer) pinContainer.innerHTML = makePinSVG(cfg.shape, cfg.color);
    if (pinLabel) {
      pinLabel.hidden = cfg.isSafety;
    }

    // Toggle the safety-mode skin on the modal
    backdrop.classList.toggle('is-safety', cfg.isSafety);

    // Close any open attr dropdowns
    document.querySelectorAll('.attr-dropdown').forEach(function (d) { d.hidden = true; });
  }

  /* ── Per-task data persistence ── */
  var taskDataMap = new Map();

  function saveCurrentTaskData() {
    var card = modalTaskCards[modalCurrentIdx];
    if (!card) return;
    var data = {};

    var descEl = document.querySelector('.modal-description');
    data.description = descEl ? descEl.value : '';

    var floorTextEl = document.querySelector('[data-floor-text]');
    var roomTextEl  = document.querySelector('[data-room-text]');
    data.floor = floorTextEl ? floorTextEl.textContent : 'Floor';
    data.room  = roomTextEl  ? roomTextEl.textContent  : 'Room / Area';

    data.attrs = {};
    document.querySelectorAll('[data-attr]').forEach(function (row) {
      var valueEl = row.querySelector('[data-attr-value]');
      if (valueEl) data.attrs[row.dataset.attr] = valueEl.innerHTML;
    });

    // Save any in-progress inline input value too
    document.querySelectorAll('.attr-inline-input').forEach(function (inp) {
      var row = inp.closest('[data-attr]');
      if (row && inp.value.trim()) data.attrs[row.dataset.attr] = inp.value.trim() + ' <i class="caret"></i>';
    });

    taskDataMap.set(card, data);
  }

  function loadTaskData(card) {
    var data = taskDataMap.get(card);
    if (!data) return;

    var descEl = document.querySelector('.modal-description');
    if (descEl) descEl.value = data.description || '';

    var floorTextEl = document.querySelector('[data-floor-text]');
    var roomTextEl  = document.querySelector('[data-room-text]');
    var floorBtnEl  = document.querySelector('[data-location-dropdown="floor"]');
    var roomBtnEl   = document.querySelector('[data-location-dropdown="room"]');
    if (floorTextEl && data.floor) {
      floorTextEl.textContent = data.floor;
      if (data.floor !== 'Floor' && floorBtnEl) floorBtnEl.classList.add('has-value');
    }
    if (roomTextEl && data.room) {
      roomTextEl.textContent = data.room;
      if (data.room !== 'Room / Area' && roomBtnEl) roomBtnEl.classList.add('has-value');
    }

    if (data.attrs) {
      document.querySelectorAll('[data-attr]').forEach(function (row) {
        var attr = row.dataset.attr;
        if (data.attrs[attr] !== undefined) {
          var valueEl = row.querySelector('[data-attr-value]');
          if (valueEl) valueEl.innerHTML = data.attrs[attr];
        }
      });
    }
  }

  function closeModal() {
    saveCurrentTaskData();
    if (backdrop) backdrop.hidden = true;
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  /* ══════════════════════════════════════════
     OPEN MODAL FROM TASK CARD CLICK
  ══════════════════════════════════════════ */
  var modalTaskCards   = [];
  var modalCurrentIdx  = -1;

  function cardType(card) {
    if (card.dataset.currentStatus) {
      var map = {
        'Safety': 'safety', 'Priority 1': 'p1', 'Priority 2': 'p2',
        'Priority 3': 'p3', 'Completed': 'completed', 'Verified': 'verified'
      };
      return map[card.dataset.currentStatus] || 'p2';
    }
    if (card.closest('.safety-column')) return 'safety';
    if (card.querySelector('.pin.red') || card.querySelector('.red-square')) return 'p1';
    if (card.querySelector('.pin.yellow')) return 'p3';
    return 'p2';
  }

  function openModalForCard(card) {
    modalTaskCards  = Array.from(document.querySelectorAll('.board .task-card'));
    modalCurrentIdx = modalTaskCards.indexOf(card);

    var metaEl  = card.querySelector('.task-data');
    var titleEl = card.querySelector('.fw-task-title');
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
      el.hidden = false;
    });

    // Remove any in-progress inline attribute inputs
    document.querySelectorAll('.attr-inline-input').forEach(function (inp) { inp.remove(); });

    // Reset description textarea
    var descEl = document.querySelector('.modal-description');
    if (descEl) descEl.value = '';

    // Reset photo previews
    var photosPreviewEl = document.querySelector('[data-photos-preview]');
    if (photosPreviewEl) photosPreviewEl.innerHTML = '';

    // Reset location picker to defaults
    var floorTextEl = document.querySelector('[data-floor-text]');
    var roomTextEl  = document.querySelector('[data-room-text]');
    var floorBtnEl  = document.querySelector('[data-location-dropdown="floor"]');
    var roomBtnEl   = document.querySelector('[data-location-dropdown="room"]');
    var floorMenuEl = document.querySelector('[data-floor-menu]');
    var roomMenuEl  = document.querySelector('[data-room-menu]');
    if (floorTextEl) floorTextEl.textContent = 'Floor';
    if (roomTextEl)  roomTextEl.textContent  = 'Room / Area';
    if (floorBtnEl)  floorBtnEl.classList.remove('has-value', 'is-open');
    if (roomBtnEl)   roomBtnEl.classList.remove('has-value', 'is-open');
    if (floorMenuEl) floorMenuEl.hidden = true;
    if (roomMenuEl)  roomMenuEl.hidden  = true;

    // Show Completed / Verified only from the second visit onwards
    var sd = document.querySelector('[data-status-dropdown]');
    if (sd) sd.classList.toggle('show-advanced', !!card.dataset.visited);
    card.dataset.visited = 'true';

    openTaskModal(titleText, cardType(card));

    // Restore previously saved data for this task (overrides the defaults above)
    loadTaskData(card);
  }

  /* ── Task selection checkboxes ── */
  function addSelectBox(card) {
    if (card.querySelector('.task-select-box')) return;
    var nameEl = card.querySelector('.name');
    if (!nameEl) return;
    var cb = document.createElement('div');
    cb.className = 'task-select-box';
    cb.setAttribute('data-select-cb', '');
    nameEl.appendChild(cb);
  }

  function updateActionsCount() {
    var count = document.querySelectorAll('.task-card.is-selected').length;
    var badge = document.querySelector('[data-actions-count]');
    if (badge) {
      badge.textContent = count;
      badge.hidden = count === 0;
    }
  }

  document.querySelectorAll('.task-card').forEach(addSelectBox);

  var board = document.querySelector('.board');
  if (board) {
    board.addEventListener('click', function (e) {
      if (e.target.closest('.new-task-form') || e.target.closest('.fw-safety-bottom-new-task')) return;
      var selectCb = e.target.closest('[data-select-cb]');
      if (selectCb) {
        e.stopPropagation();
        selectCb.closest('.task-card').classList.toggle('is-selected');
        updateActionsCount();
        return;
      }
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

  var priorityE2E = {
    p1: 'task-priority-header-text-PRIORITY_1',
    p2: 'task-priority-header-text-PRIORITY_2',
    p3: 'task-priority-header-text-PRIORITY_3'
  };

  document.querySelectorAll('[data-task-type]').forEach(function (opt) {
    opt.addEventListener('click', function () {
      taskTypeMenu.hidden = true;
      var type = opt.dataset.taskType;
      var col;

      if (type === 'safety') {
        col = document.querySelector('.safety-column');
      } else if (priorityE2E[type]) {
        var header = document.querySelector('[data-e2e="' + priorityE2E[type] + '"]');
        col = header && header.closest('.column');
      }

      if (col) {
        var link = col.querySelector('.fw-safety-bottom-new-task');
        if (link) {
          col.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          link.click();
        }
      }
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
      saveCurrentTaskData();
      modalTaskCards = Array.from(document.querySelectorAll('.board .task-card'));
      if (!modalTaskCards.length) return;
      modalCurrentIdx = (modalCurrentIdx - 1 + modalTaskCards.length) % modalTaskCards.length;
      openModalForCard(modalTaskCards[modalCurrentIdx]);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      saveCurrentTaskData();
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

    var statusShapes = {
      'Safety':     '<svg class="fw-shape" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><polygon points="30,5 55,55 5,55" fill="#FF4F4F"/></svg>',
      'Priority 1': '<svg class="fw-shape" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="9.5" y="9.5" width="41" height="41" fill="#FF4F4F" stroke="#1A1D21" stroke-opacity="0.25"/></svg>',
      'Priority 2': '<svg class="fw-shape" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="9.5" y="9.5" width="41" height="41" fill="#FA8B34" stroke="#1A1D21" stroke-opacity="0.25"/></svg>',
      'Priority 3': '<svg class="fw-shape" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M51.49,26.61C51.76,20.24 49.52,14.60 45.64,10.57C41.74,6.51 36.18,4.08 29.87,4.13C23.78,4.13 18.22,6.49 14.29,10.62C10.57,14.54 8.33,20.04 8.5,26.63C8.5,34.97 15.72,45.85 30,59.31C44.64,45.34 51.87,34.47 51.49,26.61Z" fill="#FFD149"/></svg>',
      'Completed':  '<svg class="fw-shape" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="9.5" y="9.5" width="41" height="41" fill="#4caf50" stroke="#1A1D21" stroke-opacity="0.25"/></svg>',
      'Verified':   '<svg class="fw-shape" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="9.5" y="9.5" width="41" height="41" fill="#64b5f6" stroke="#1A1D21" stroke-opacity="0.25"/></svg>'
    };

    var statusColMap = {
      'Safety':     '.safety-column',
      'Priority 1': '[data-e2e="task-priority-header-text-PRIORITY_1"]',
      'Priority 2': '[data-e2e="task-priority-header-text-PRIORITY_2"]',
      'Priority 3': '[data-e2e="task-priority-header-text-PRIORITY_3"]',
      'Completed':  '[data-e2e="task-priority-header-text-COMPLETED"]',
      'Verified':   '[data-e2e="task-priority-header-text-VERIFIED"]'
    };

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

        // Update card icon and move to correct column
        var card = modalTaskCards[modalCurrentIdx];
        if (card) {
          card.dataset.currentStatus = newStatus;
          var pinCol = card.querySelector('.fw-pin-col');
          if (pinCol && statusShapes[newStatus]) pinCol.innerHTML = statusShapes[newStatus];

          var selector = statusColMap[newStatus];
          var targetCol = selector && (selector.startsWith('.') ?
            document.querySelector(selector) :
            (document.querySelector(selector) && document.querySelector(selector).closest('.column')));
          if (targetCol && card.closest('.column') !== targetCol) {
            var link = targetCol.querySelector('.fw-safety-bottom-new-task');
            targetCol.insertBefore(card, link || null);
            syncCounts();
          }

          if (newStatus === 'Verified') {
            setTimeout(function () {
              closeModal();
              card.classList.add('is-completing');
              card.addEventListener('animationend', function () {
                card.remove();
                syncCounts();
              }, { once: true });
            }, 600);
          }
        }
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
  var sendBtn   = document.querySelector('[data-modal-send]');

  function sendMessage() {
    if (!msgInput || !activityFeed) return;
    var text = msgInput.value.trim();
    if (!text) {
      // Flash the input border to signal that text is required
      msgInput.style.outline = '2px solid #e53935';
      setTimeout(function () { msgInput.style.outline = ''; }, 700);
      msgInput.focus();
      return;
    }

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
    // Scroll the entity panel so the activity feed is visible
    var scrollArea = document.querySelector('.entity-scroll-area');
    if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
    msgInput.value = '';
    if (msgInput.tagName === 'TEXTAREA') { msgInput.style.height = ''; }
  }

  var cancelBtn = document.querySelector('[data-modal-cancel]');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      if (msgInput) {
        msgInput.value = '';
        if (msgInput.tagName === 'TEXTAREA') msgInput.style.height = '';
      }
    });
  }

  if (sendBtn)  sendBtn.addEventListener('click', sendMessage);
  if (msgInput) {
    msgInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    if (msgInput.tagName === 'TEXTAREA') {
      msgInput.addEventListener('input', function () {
        msgInput.style.height = 'auto';
        msgInput.style.height = msgInput.scrollHeight + 'px';
      });
    }
  }

  /* Share dropdown */
  var shareDropdown = document.querySelector('[data-share-dropdown]');
  if (shareBtn && shareDropdown) {
    shareBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      shareDropdown.hidden = !shareDropdown.hidden;
    });

    shareDropdown.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-share-action]');
      if (!btn || btn.disabled) return;
      var action = btn.dataset.shareAction;
      if (action === 'clipboard') {
        var taskTitle = document.querySelector('[data-modal-title]');
        var text = taskTitle ? taskTitle.textContent.trim() : window.location.href;
        navigator.clipboard && navigator.clipboard.writeText(text);
        btn.textContent = '✓ Copied!';
        setTimeout(function () {
          btn.innerHTML = '<i class="fa fa-clone"></i> Copy to clipboard';
        }, 1500);
      }
      if (action !== 'clipboard') shareDropdown.hidden = true;
    });

    document.addEventListener('click', function (e) {
      if (shareDropdown && !shareDropdown.hidden && !shareBtn.contains(e.target) && !shareDropdown.contains(e.target)) {
        shareDropdown.hidden = true;
      }
    });
  }

  /* ── Attach dropdown ── */
  var attachBtn       = document.querySelector('[data-attach-btn]');
  var attachDropdown  = document.querySelector('[data-attach-dropdown]');
  var attachFileInput = document.querySelector('[data-attach-file-input]');
  if (attachBtn && attachDropdown) {
    attachBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      attachDropdown.hidden = !attachDropdown.hidden;
    });
    document.addEventListener('click', function (e) {
      if (!attachDropdown.hidden && !attachBtn.contains(e.target) && !attachDropdown.contains(e.target)) {
        attachDropdown.hidden = true;
      }
    });
  }

  /* Photo/File option → open file picker */
  var attachPhotoFileBtn = document.querySelector('[data-attach-photo-file]');
  if (attachPhotoFileBtn && attachFileInput) {
    attachPhotoFileBtn.addEventListener('click', function () {
      attachDropdown.hidden = true;
      attachFileInput.value = '';
      attachFileInput.click();
    });
    attachFileInput.addEventListener('change', function () {
      var files = Array.from(attachFileInput.files);
      if (!files.length) return;
      var feed = document.querySelector('[data-modal-activity]');
      if (!feed) return;
      files.forEach(function (file) {
        var entry = document.createElement('div');
        entry.className = 'log-entry';
        var isImage = file.type.startsWith('image/');
        if (isImage) {
          var reader = new FileReader();
          reader.onload = function (ev) {
            var img = document.createElement('img');
            img.src = ev.target.result;
            img.style.cssText = 'max-width:100%;max-height:180px;border-radius:4px;margin-top:6px;display:block;';
            entry.innerHTML = '<span class="log-label">📎 ' + file.name + '</span>';
            entry.appendChild(img);
          };
          reader.readAsDataURL(file);
        } else {
          entry.innerHTML = '<span class="log-label">📎 ' + file.name + '</span>';
        }
        feed.appendChild(entry);
      });
    });
  }

  /* ══════════════════════════════════════════
     PHOTO UPLOAD — preview images
  ══════════════════════════════════════════ */
  var photoUpload = document.querySelector('[data-photo-upload]');
  var photosPreview = document.querySelector('[data-photos-preview]');
  if (photoUpload && photosPreview) {
    photoUpload.addEventListener('change', function () {
      Array.from(photoUpload.files).forEach(function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var img = document.createElement('img');
          img.src = e.target.result;
          img.title = file.name;
          photosPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
      photoUpload.value = '';
    });
  }

  /* ══════════════════════════════════════════
     INLINE NEW-TASK FORM (column + New task links)
  ══════════════════════════════════════════ */
  document.querySelectorAll('.fw-safety-bottom-new-task').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.new-task-form').forEach(function (f) { f.remove(); });
      document.querySelectorAll('.fw-safety-bottom-new-task').forEach(function (b) { b.style.display = ''; });
      btn.style.display = 'none';

      var isSafety = !!btn.closest('.safety-column');

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

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && input.value.trim()) confirmBtn.click();
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
        card.className = 'task-card';
        var pinSVG = isSafety
          ? '<svg class="fw-shape" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><polygon points="30,5 55,55 5,55" fill="#FF4F4F"/></svg>'
          : '<svg class="fw-shape" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="9.5" y="9.5" width="41" height="41" fill="#FA8B34" stroke="#1A1D21" stroke-opacity="0.25"/></svg>';
        card.innerHTML =
          '<div class="fw-pin-col">' + pinSVG + '</div>' +
          '<div class="name">' +
            '<div class="heading truncate"><span class="task-data">#' + taskNum + ' | @SRE</span></div>' +
            '<div class="fw-task-title">' + title + '</div>' +
          '</div>';
        form.remove();
        btn.style.display = '';
        addSelectBox(card);
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
      contextMenu.style.left = e.pageX + 'px';
      contextMenu.style.top  = e.pageY + 'px';
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
    // projects page — open project card
    var projCard = e.target.closest('[data-open-project]');
    if (projCard && !e.target.closest('.proj-icon-btn')) {
      openProject(projCard.dataset.openProject);
      return;
    }
    // projects page — open new project modal
    if (e.target.closest('[data-open-new-project]')) {
      showNewProjModal();
      return;
    }
    // close new project modal
    if (e.target.closest('[data-close-new-project]') || e.target === newProjModal) {
      hideNewProjModal();
      return;
    }
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

  /* ══════════════════════════════════════════
     LOCATION PICKER
  ══════════════════════════════════════════ */
  var floorBtn  = document.querySelector('[data-location-dropdown="floor"]');
  var roomBtn   = document.querySelector('[data-location-dropdown="room"]');
  var floorMenu = document.querySelector('[data-floor-menu]');
  var roomMenu  = document.querySelector('[data-room-menu]');
  var floorText = document.querySelector('[data-floor-text]');
  var roomText  = document.querySelector('[data-room-text]');

  function closeLocationMenus() {
    if (floorMenu) floorMenu.hidden = true;
    if (roomMenu)  roomMenu.hidden  = true;
    if (floorBtn)  floorBtn.classList.remove('is-open');
    if (roomBtn)   roomBtn.classList.remove('is-open');
  }

  if (floorBtn && floorMenu) {
    floorBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = !floorMenu.hidden;
      closeLocationMenus();
      if (!isOpen) { floorMenu.hidden = false; floorBtn.classList.add('is-open'); }
    });
    floorMenu.addEventListener('change', function (e) {
      var radio = e.target.closest('[data-floor-option]');
      if (!radio) return;
      if (radio.dataset.floorOption === '') {
        floorText.textContent = 'Floor';
        floorBtn.classList.remove('has-value');
      } else {
        floorText.textContent = radio.dataset.floorOption;
        floorBtn.classList.add('has-value');
      }
      closeLocationMenus();
    });
  }

  if (roomBtn && roomMenu) {
    roomBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = !roomMenu.hidden;
      closeLocationMenus();
      if (!isOpen) { roomMenu.hidden = false; roomBtn.classList.add('is-open'); }
    });
    roomMenu.addEventListener('change', function (e) {
      var radio = e.target.closest('[data-room-option]');
      if (!radio) return;
      if (radio.dataset.roomOption === '') {
        roomText.textContent = 'Room / Area';
        roomBtn.classList.remove('has-value');
      } else {
        roomText.textContent = radio.dataset.roomOption;
        roomBtn.classList.add('has-value');
      }
      closeLocationMenus();
    });
  }

  document.addEventListener('click', function (e) {
    if (floorMenu && !floorMenu.hidden && floorBtn && !floorBtn.contains(e.target) && !floorMenu.contains(e.target)) closeLocationMenus();
    if (roomMenu  && !roomMenu.hidden  && roomBtn  && !roomBtn.contains(e.target)  && !roomMenu.contains(e.target))  closeLocationMenus();
  });

});
