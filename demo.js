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

    // Safety badge — count safety column tasks
    var safetyCount = document.querySelectorAll('.safety-column .task-card').length;
    var safetyBadge = document.querySelector('[data-safety-badge]');
    if (safetyBadge) {
      safetyBadge.textContent = safetyCount;
      safetyBadge.hidden = safetyCount === 0;
    }

    // Update analytics chart if it's visible
    if (analyticsView && !analyticsView.hidden) updateAnalyticsChart();
  }

  syncCounts();

  /* ══════════════════════════════════════════
     SAFETY TASK TRACKING — localStorage
  ══════════════════════════════════════════ */
  var SAFETY_KEY = 'fw_safety_history';

  function getSafetyHistory() {
    try { return JSON.parse(localStorage.getItem(SAFETY_KEY) || 'null') || []; }
    catch(e) { return []; }
  }
  function saveSafetyHistory(h) {
    try { localStorage.setItem(SAFETY_KEY, JSON.stringify(h)); } catch(e) {}
  }

  // Pre-populate historical resolved tasks on first run (matches chart bars)
  (function() {
    if (localStorage.getItem(SAFETY_KEY)) return;
    var d = function(iso, plusMs) { return new Date(iso).getTime() + (plusMs || 0); };
    saveSafetyHistory([
      { id:'h1', title:'היסטורי', openedAt:d('2024-04-19'), closedAt:null },
      { id:'h2', title:'היסטורי', openedAt:d('2024-05-03'), closedAt:d('2024-05-03', 1800000)   }, // 30m
      { id:'h3', title:'היסטורי', openedAt:d('2024-05-17'), closedAt:d('2024-05-17', 28800000)  }, // 8h
      { id:'h4', title:'היסטורי', openedAt:d('2024-05-17', 3600000), closedAt:d('2024-05-17', 18000000) }, // 4h
      { id:'h5', title:'היסטורי', openedAt:d('2024-05-31'), closedAt:null },
    ]);
  })();

  function safetyTaskId(card) {
    var id = card.getAttribute('data-safety-id');
    if (!id) {
      id = 'st_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      card.setAttribute('data-safety-id', id);
    }
    return id;
  }

  function recordSafetyOpened(card) {
    var id = safetyTaskId(card);
    var h = getSafetyHistory();
    var existing = h.find(function(t) { return t.id === id; });
    if (existing) {
      // If card is back in safety column but was previously closed, reopen it
      if (existing.closedAt !== null) {
        existing.closedAt = null;
        saveSafetyHistory(h);
      }
      renderSafetyLog();
      return;
    }
    var titleEl = card.querySelector('.fw-task-title');
    h.push({ id: id, title: titleEl ? titleEl.textContent.trim() : '', openedAt: Date.now(), closedAt: null });
    saveSafetyHistory(h);
    renderSafetyLog();
    renderSafetyTaskCharts();
  }

  function recordSafetyClosed(card) {
    var id = card.getAttribute('data-safety-id');
    if (!id) return;
    var h = getSafetyHistory();
    var task = h.find(function(t) { return t.id === id; });
    if (task && !task.closedAt) {
      task.closedAt = Date.now();
      saveSafetyHistory(h);
      renderSafetyLog();
      renderSafetyTaskCharts();
    }
  }

  function formatResolution(ms) {
    if (!ms || ms <= 0) return '—';
    var totalMin = Math.floor(ms / 60000);
    var hours = Math.floor(totalMin / 60);
    var mins  = totalMin % 60;
    var days  = Math.floor(hours / 24);
    hours = hours % 24;
    if (days > 0) return days + 'd' + (hours > 0 ? ' ' + hours + 'h' : '');
    if (hours > 0) return hours + 'h' + (mins > 0 ? ' ' + mins + 'm' : '');
    return totalMin + 'm';
  }

  // Initialize existing hardcoded safety cards
  document.querySelectorAll('.safety-column .task-card').forEach(recordSafetyOpened);

  // Watch safety column — detect tasks opening and closing
  var safetyColEl = document.querySelector('.safety-column');
  if (safetyColEl) {
    new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.classList.contains('task-card')) recordSafetyOpened(node);
        });
        m.removedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.classList.contains('task-card')) recordSafetyClosed(node);
        });
      });
    }).observe(safetyColEl, { childList: true, subtree: true });
  }

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

    // Show/hide status options based on task type
    document.querySelectorAll('.status-safety-only').forEach(function (el) {
      el.style.display = cfg.isSafety ? 'block' : 'none';
    });
    document.querySelectorAll('.status-priority-only').forEach(function (el) {
      el.style.display = cfg.isSafety ? 'none' : 'block';
    });

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

  /* ══════════════════════════════════════════
     CONFIRMATION DIALOG
  ══════════════════════════════════════════ */
  var confirmOverlay  = document.querySelector('[data-confirm-overlay]');
  var confirmMsgEl    = document.querySelector('[data-confirm-message]');
  var confirmOkBtn    = document.querySelector('[data-confirm-ok]');
  var confirmCancelBtn = document.querySelector('[data-confirm-cancel]');
  var confirmCallback = null;

  function showConfirm(message, onContinue) {
    if (!confirmOverlay) { onContinue(); return; }
    if (confirmMsgEl) confirmMsgEl.textContent = message;
    confirmCallback = onContinue;
    confirmOverlay.hidden = false;
  }

  if (confirmOkBtn) {
    confirmOkBtn.addEventListener('click', function () {
      confirmOverlay.hidden = true;
      if (confirmCallback) { var cb = confirmCallback; confirmCallback = null; cb(); }
    });
  }
  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', function () {
      confirmOverlay.hidden = true;
      confirmCallback = null;
    });
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
    // Detect type from the column the card lives in
    var col = card.closest('.column');
    var header = col && col.querySelector('[data-e2e]');
    var e2e = header && header.dataset.e2e;
    if (e2e === 'task-priority-header-text-PRIORITY_1') return 'p1';
    if (e2e === 'task-priority-header-text-PRIORITY_3') return 'p3';
    if (e2e === 'task-priority-header-text-COMPLETED')  return 'completed';
    if (e2e === 'task-priority-header-text-VERIFIED')   return 'verified';
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

    // Reset photo and file previews
    var photosPreviewEl = document.querySelector('[data-photos-preview]');
    if (photosPreviewEl) photosPreviewEl.innerHTML = '';
    var filesPreviewEl = document.querySelector('[data-files-preview]');
    if (filesPreviewEl) filesPreviewEl.innerHTML = '';

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

  /* ── Task selection checkbox ── */
  function ensureSelectBox(card) {
    if (card.querySelector('.task-select-box')) return;
    var nameEl = card.querySelector('.name');
    if (!nameEl) return;
    var box = document.createElement('div');
    box.className = 'task-select-box';
    nameEl.appendChild(box);
  }

  function updateActionsCount() {
    var count = document.querySelectorAll('.task-card.is-selected').length;
    var badge = document.querySelector('[data-actions-count]');
    if (badge) { badge.textContent = count; badge.hidden = count === 0; }
  }

  /* ── Actions dropdown ── */
  var actionsBtn      = document.querySelector('[data-actions-btn]');
  var actionsDropdown = document.querySelector('[data-actions-dropdown]');
  if (actionsBtn && actionsDropdown) {
    actionsBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      actionsDropdown.hidden = !actionsDropdown.hidden;
    });
    document.addEventListener('click', function (e) {
      if (!actionsDropdown.hidden && !actionsBtn.contains(e.target) && !actionsDropdown.contains(e.target)) {
        actionsDropdown.hidden = true;
      }
    });
    actionsDropdown.addEventListener('click', function (e) {
      var item = e.target.closest('[data-action]');
      if (!item) return;
      var action = item.getAttribute('data-action');
      var cards = document.querySelectorAll('.board .task-card');
      if (action === 'select-all') {
        cards.forEach(function (c) { c.classList.add('is-selected'); });
        updateActionsCount();
      } else if (action === 'deselect-all') {
        cards.forEach(function (c) { c.classList.remove('is-selected'); });
        updateActionsCount();
      } else if (action === 'delete') {
        var selected = document.querySelectorAll('.task-card.is-selected');
        selected.forEach(function (c) { c.remove(); });
        updateActionsCount();
        syncCounts();
      }
      actionsDropdown.hidden = true;
    });
  }

  document.querySelectorAll('.task-card').forEach(ensureSelectBox);

  var board = document.querySelector('.board');
  if (board) {
    board.addEventListener('click', function (e) {
      if (e.target.closest('.new-task-form') || e.target.closest('.fw-safety-bottom-new-task')) return;
      var card = e.target.closest('.task-card');
      if (!card) return;
      if (e.target.closest('.task-select-box')) {
        card.classList.toggle('is-selected');
        updateActionsCount();
        return;
      }
      openModalForCard(card);
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

      // Always sync visibility right before showing the dropdown
      var isSafety = backdrop.classList.contains('is-safety');
      statusDropdown.querySelectorAll('.status-safety-only').forEach(function (el) {
        el.style.display = isSafety ? 'block' : 'none';
      });
      statusDropdown.querySelectorAll('.status-priority-only').forEach(function (el) {
        el.style.display = isSafety ? 'none' : 'block';
      });

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

    function applyStatusChange(newStatus, opt) {
      var nowSafety = newStatus === 'Safety';
      document.querySelectorAll('.status-safety-only').forEach(function (el) {
        el.style.display = nowSafety ? 'block' : 'none';
      });
      document.querySelectorAll('.status-priority-only').forEach(function (el) {
        el.style.display = nowSafety ? 'none' : 'block';
      });

      document.querySelectorAll('[data-modal-status]').forEach(function (el) {
        el.textContent = newStatus;
      });
      statusDropdown.querySelectorAll('.status-option').forEach(function (o) { o.classList.remove('is-active'); });
      if (opt) opt.classList.add('is-active');
      backdrop.classList.toggle('is-safety', newStatus === 'Safety');
      statusDropdown.hidden = true;

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

      }
    }

    statusDropdown.querySelectorAll('[data-status-option]').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var newStatus = opt.dataset.statusOption;
        statusDropdown.hidden = true;

        if (newStatus === 'Safety') {
          showConfirm('Are you sure you want to change to Safety?', function () {
            applyStatusChange(newStatus, opt);
          });
          return;
        }

        if (opt.hasAttribute('data-confirm-change')) {
          showConfirm('Are you sure you want to change to general task?', function () {
            applyStatusChange(newStatus, opt);
          });
          return;
        }

        if (opt.classList.contains('status-priority-only')) {
          showConfirm('Are you sure you want to change to ' + newStatus + '?', function () {
            applyStatusChange(newStatus, opt);
          });
          return;
        }

        applyStatusChange(newStatus, opt);
      });
    });

    var deleteFromStatus = statusDropdown.querySelector('[data-status-delete]');
    if (deleteFromStatus) {
      deleteFromStatus.addEventListener('click', function () {
        statusDropdown.hidden = true;
        showConfirm('Are you sure you want to delete this task?', function () {
          var card = modalTaskCards[modalCurrentIdx];
          if (card) { card.remove(); syncCounts(); }
          closeModal();
        });
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
      setTypingState(false);
    });
  }

  var msgBox = document.querySelector('.message-box');

  function setTypingState(typing) {
    if (!msgBox) return;
    if (typing) {
      msgBox.classList.add('is-typing');
    } else {
      msgBox.classList.remove('is-typing');
    }
  }

  if (sendBtn)  sendBtn.addEventListener('click', sendMessage);
  if (msgInput) {
    msgInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    msgInput.addEventListener('focus', function () { setTypingState(true); });
    msgInput.addEventListener('blur', function () {
      if (!msgInput.value.trim()) setTypingState(false);
    });
    if (msgInput.tagName === 'TEXTAREA') {
      msgInput.addEventListener('input', function () {
        msgInput.style.height = 'auto';
        msgInput.style.height = msgInput.scrollHeight + 'px';
        setTypingState(!!msgInput.value.trim());
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

    var shareBtnDefaultHTML = shareBtn.innerHTML;
    var shareSavedTimer = null;
    function flashSharedSaved() {
      shareBtn.innerHTML = '✓ Saved';
      shareBtn.classList.add('is-saved');
      if (shareSavedTimer) clearTimeout(shareSavedTimer);
      shareSavedTimer = setTimeout(function () {
        shareBtn.innerHTML = shareBtnDefaultHTML;
        shareBtn.classList.remove('is-saved');
      }, 2000);
    }

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
      flashSharedSaved();
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
     FILE UPLOAD — preview file list
  ══════════════════════════════════════════ */
  var fileUpload = document.querySelector('[data-file-upload]');
  var filesPreview = document.querySelector('[data-files-preview]');
  if (fileUpload && filesPreview) {
    fileUpload.addEventListener('change', function () {
      Array.from(fileUpload.files).forEach(function (file) {
        var item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML =
          '<svg class="file-item-icon" width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M2 1h7l3 3v11H2V1z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
            '<path d="M9 1v3h3" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
          '</svg>' +
          '<span class="file-item-name" title="' + file.name + '">' + file.name + '</span>' +
          '<button class="file-item-remove" type="button" aria-label="Remove">&times;</button>';
        item.querySelector('.file-item-remove').addEventListener('click', function () {
          item.remove();
        });
        filesPreview.appendChild(item);
      });
      fileUpload.value = '';
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
        btn.parentElement.insertBefore(card, btn);
        ensureSelectBox(card);
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

  /* ── View-mode toggle: Kanban / Calendar / Gantt / Analytics ── */
  var boardSection    = document.querySelector('.board');
  var analyticsView   = document.querySelector('.fw-analytics-view');
  var segBtns         = document.querySelectorAll('.fw-seg-btn');

  function activateView(label) {
    segBtns.forEach(function (b) {
      b.classList.toggle('fw-seg-btn-active', b.getAttribute('aria-label') === label);
    });
    var showAnalytics = (label === 'Analytics');
    if (boardSection)  boardSection.hidden  = showAnalytics;
    if (analyticsView) analyticsView.hidden = !showAnalytics;
    if (showAnalytics) { updateAnalyticsChart(); renderSafetyLog(); renderSafetyTaskCharts(); }
  }

  segBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateView(btn.getAttribute('aria-label'));
    });
  });

  /* ══════════════════════════════════════════
     ANALYTICS CHART — dynamic update
  ══════════════════════════════════════════ */
  function updateAnalyticsChart() {
    function colCount(e2e) {
      var h = document.querySelector('[data-e2e="' + e2e + '"]');
      return h ? h.closest('.column').querySelectorAll('.task-card').length : 0;
    }
    var s  = document.querySelectorAll('.safety-column .task-card').length;
    var p1 = colCount('task-priority-header-text-PRIORITY_1');
    var p2 = colCount('task-priority-header-text-PRIORITY_2');
    var p3 = colCount('task-priority-header-text-PRIORITY_3');
    var cp = colCount('task-priority-header-text-COMPLETED');
    var vr = colCount('task-priority-header-text-VERIFIED');
    var total = s + p1 + p2 + p3 + cp + vr;
    if (total === 0) return;

    /* ── Bar chart ── */
    var BAR_W = 500, x = 50;
    [['bar-safety', s], ['bar-p1', p1], ['bar-p2', p2],
     ['bar-p3', p3], ['bar-completed', cp], ['bar-verified', vr]
    ].forEach(function(seg) {
      var el = document.getElementById(seg[0]);
      if (!el) return;
      var w = (seg[1] / total) * BAR_W;
      el.setAttribute('x', x);
      el.setAttribute('width', w > 0 ? w : 0);
      if (seg[0] === 'bar-safety') {
        var tri = document.getElementById('safety-tri-icon');
        if (tri) {
          if (w > 0) {
            var cx = x + w / 2, cy = 118;
            tri.setAttribute('points', cx+','+( cy-14)+' '+(cx+12)+','+(cy+11)+' '+(cx-12)+','+(cy+11));
            tri.setAttribute('visibility', 'visible');
          } else {
            tri.setAttribute('visibility', 'hidden');
          }
        }
      }
      x += w;
    });

    /* ── Donut chart ── */
    var CIRC = 2 * Math.PI * 44; // ≈ 276.46
    var offset = 0;
    [['donut-safety', s], ['donut-p1', p1], ['donut-p2', p2],
     ['donut-p3', p3], ['donut-completed', cp], ['donut-verified', vr]
    ].forEach(function(seg) {
      var el = document.getElementById(seg[0]);
      if (!el) return;
      var arc = (seg[1] / total) * CIRC;
      el.setAttribute('stroke-dasharray', arc + ' ' + (CIRC - arc));
      el.setAttribute('stroke-dashoffset', -offset);
      offset += arc;
    });

    /* ── Donut safety triangle ── */
    var dTri = document.getElementById('donut-safety-tri');
    if (dTri) {
      if (s > 0) {
        var safetyArc = (s / total) * CIRC;
        var midAngle = -Math.PI / 2 + safetyArc / (2 * 44);
        var tx = 65 + 44 * Math.cos(midAngle);
        var ty = 65 + 44 * Math.sin(midAngle);
        var tr = 5;
        var p1x = tx + tr * Math.cos(midAngle),         p1y = ty + tr * Math.sin(midAngle);
        var p2x = tx + tr * Math.cos(midAngle + 2.094), p2y = ty + tr * Math.sin(midAngle + 2.094);
        var p3x = tx + tr * Math.cos(midAngle - 2.094), p3y = ty + tr * Math.sin(midAngle - 2.094);
        dTri.setAttribute('points', p1x+','+p1y+' '+p2x+','+p2y+' '+p3x+','+p3y);
        dTri.setAttribute('visibility', 'visible');
      } else {
        dTri.setAttribute('visibility', 'hidden');
      }
    }

    var totalEl = document.getElementById('donut-total');
    if (totalEl) totalEl.textContent = total;

    /* ── Sync sidebar stats across all chart panels ── */
    function setEl(id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val;
    }
    var openCount = s + p1 + p2 + p3;

    // Lifetime Tasks
    setEl('lt-open',      openCount);
    setEl('lt-completed', cp);
    setEl('lt-verified',  vr);

    // Safety Tasks — live stats from localStorage
    setEl('st-open', s);
    var safetyHist  = getSafetyHistory();
    var closedTasks = safetyHist.filter(function(t) { return t.closedAt; });
    var totalResMs  = closedTasks.reduce(function(sum, t) { return sum + (t.closedAt - t.openedAt); }, 0);
    var avgResMs    = closedTasks.length ? totalResMs / closedTasks.length : 0;
    setEl('st-avg-res',  formatResolution(avgResMs));
    setEl('st-resolved', closedTasks.length);

    // In Progress
    setEl('ip-open-rate',      openCount);
    setEl('ip-completed-rate', cp);
    setEl('ip-verified-rate',  vr);

    // In Progress line chart — update last (current) data point
    // Y scale: 0 tasks→y=260, 10 tasks→y=10; 1 task = 25px
    function ipY(n) { return Math.max(10, Math.min(260, 260 - n * 25)); }
    var openLine = document.getElementById('ip-open-line');
    if (openLine) {
      var pts = openLine.getAttribute('points').trim().split(' ');
      pts[pts.length - 1] = '550,' + ipY(openCount);
      openLine.setAttribute('points', pts.join(' '));
    }
    var cpLine = document.getElementById('ip-completed-line');
    if (cpLine) {
      var cpts = cpLine.getAttribute('points').trim().split(' ');
      cpts[cpts.length - 1] = '550,' + ipY(cp);
      cpLine.setAttribute('points', cpts.join(' '));
    }

    renderSafetyLog();
    renderSafetyTaskCharts();
  }

  /* ══════════════════════════════════════════
     SAFETY TASK LOG — render table
  ══════════════════════════════════════════ */
  function renderSafetyLog() {
    var tbody = document.getElementById('safety-log-body');
    var countBadge = document.getElementById('safety-log-count');
    if (!tbody) return;

    var fmtDate = function(ts) {
      var d = new Date(ts);
      return d.toLocaleDateString('he-IL', { day:'2-digit', month:'2-digit', year:'2-digit' }) +
             ' ' + d.toLocaleTimeString('he-IL', { hour:'2-digit', minute:'2-digit' });
    };

    // Show only real tracked tasks (filter out pre-populated historical placeholders)
    var rows = getSafetyHistory()
      .filter(function(t) { return !/^h\d+$/.test(t.id); })
      .sort(function(a, b) { return b.openedAt - a.openedAt; });

    if (countBadge) countBadge.textContent = rows.length + ' משימות';

    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="log-empty">אין משימות בטיחות מתועדות עדיין</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map(function(t) {
      var dur    = t.closedAt ? formatResolution(t.closedAt - t.openedAt) : '—';
      var closed = t.closedAt ? fmtDate(t.closedAt) : '—';
      var badge  = t.closedAt
        ? '<span class="log-badge log-resolved">✓ נסגר</span>'
        : '<span class="log-badge log-open">● פתוח</span>';
      return '<tr>' +
        '<td class="log-title">' + (t.title || '(ללא שם)') + '</td>' +
        '<td class="log-date">' + fmtDate(t.openedAt) + '</td>' +
        '<td class="log-date">' + closed + '</td>' +
        '<td class="log-dur">'  + dur    + '</td>' +
        '<td>' + badge + '</td>' +
      '</tr>';
    }).join('');
  }

  /* ══════════════════════════════════════════
     SAFETY TASKS — line charts (dynamic)
     Reads localStorage safety history and re-plots the two split charts.
  ══════════════════════════════════════════ */
  function renderSafetyTaskCharts() {
    var openedGroup = document.getElementById('st-opened-data');
    var timeGroup   = document.getElementById('st-time-data');
    if (!openedGroup || !timeGroup) return;

    var SVGNS = 'http://www.w3.org/2000/svg';
    var svgEl = function(name, attrs) {
      var el = document.createElementNS(SVGNS, name);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      return el;
    };
    var svgText = function(attrs, text) {
      var el = svgEl('text', attrs);
      el.textContent = text;
      return el;
    };
    var clear = function(node) { while (node.firstChild) node.removeChild(node.firstChild); };

    clear(openedGroup);
    clear(timeGroup);

    var history = getSafetyHistory();
    if (history.length === 0) return;

    // Group by local calendar date (YYYY-MM-DD)
    var byDate = {};
    history.forEach(function(t) {
      var d = new Date(t.openedAt);
      var key = d.getFullYear() + '-' +
                ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
                ('0' + d.getDate()).slice(-2);
      if (!byDate[key]) byDate[key] = { opened: 0, resolutions: [] };
      byDate[key].opened++;
      if (t.closedAt) byDate[key].resolutions.push(t.closedAt - t.openedAt);
    });

    // Keep last up-to-6 dates
    var dates = Object.keys(byDate).sort();
    if (dates.length > 6) dates = dates.slice(-6);
    var n = dates.length;
    if (n === 0) return;

    // X positions spread evenly across plot area
    var xStart = 60, xEnd = 270;
    var xPos = n > 1
      ? dates.map(function(_, i) { return xStart + i * (xEnd - xStart) / (n - 1); })
      : [(xStart + xEnd) / 2];

    var fmtLabel = function(iso) { return iso.slice(5, 7) + '/' + iso.slice(8, 10); };

    /* ── Chart 1: Tasks Opened ── */
    var maxOpened = 3;
    dates.forEach(function(d) { if (byDate[d].opened > maxOpened) maxOpened = byDate[d].opened; });
    if (maxOpened % 3 !== 0) maxOpened = Math.ceil(maxOpened / 3) * 3;
    var y1 = document.getElementById('st-opened-y1');
    var y2 = document.getElementById('st-opened-y2');
    var y3 = document.getElementById('st-opened-y3');
    if (y1) y1.textContent = maxOpened / 3;
    if (y2) y2.textContent = (maxOpened * 2 / 3);
    if (y3) y3.textContent = maxOpened;
    var yForOpened = function(v) { return 200 - (v / maxOpened) * 160; };

    var openedPoints = dates.map(function(d, i) { return xPos[i] + ',' + yForOpened(byDate[d].opened); }).join(' ');
    openedGroup.appendChild(svgEl('polyline', {
      points: openedPoints, fill: 'none', stroke: '#FF4F4F',
      'stroke-width': '1.2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }));
    dates.forEach(function(d, i) {
      openedGroup.appendChild(svgEl('circle', {
        cx: xPos[i], cy: yForOpened(byDate[d].opened), r: '2.5', fill: '#FF4F4F'
      }));
    });
    dates.forEach(function(d, i) {
      openedGroup.appendChild(svgText(
        { x: xPos[i], y: 220, 'text-anchor': 'middle', 'font-size': '10', fill: '#aaa' },
        fmtLabel(d)
      ));
    });

    /* ── Chart 2: Time to Resolve ── */
    var timeData = dates.map(function(d, i) {
      var res = byDate[d].resolutions;
      if (res.length === 0) return null;
      var avgMs = res.reduce(function(a, b) { return a + b; }, 0) / res.length;
      return { x: xPos[i], avgMs: avgMs };
    }).filter(function(t) { return t !== null; });

    var maxHours = 24;
    timeData.forEach(function(t) {
      var h = t.avgMs / 3600000;
      if (h > maxHours) maxHours = h;
    });

    var fmtHours = function(h) {
      if (h >= 24) {
        var days = Math.floor(h / 24);
        var rem  = Math.round(h - days * 24);
        return rem > 0 ? days + 'd ' + rem + 'h' : days + 'd';
      }
      if (h >= 1) return Math.round(h) + 'h';
      return Math.round(h * 60) + 'm';
    };
    var t1 = document.getElementById('st-time-y1');
    var t2 = document.getElementById('st-time-y2');
    var t3 = document.getElementById('st-time-y3');
    var t4 = document.getElementById('st-time-y4');
    if (t1) t1.textContent = fmtHours(maxHours / 4);
    if (t2) t2.textContent = fmtHours(maxHours / 2);
    if (t3) t3.textContent = fmtHours(maxHours * 3 / 4);
    if (t4) t4.textContent = fmtHours(maxHours);
    var yForHours = function(h) { return 200 - (h / maxHours) * 160; };

    if (timeData.length > 0) {
      var timePoints = timeData.map(function(t) { return t.x + ',' + yForHours(t.avgMs / 3600000); }).join(' ');
      timeGroup.appendChild(svgEl('polyline', {
        points: timePoints, fill: 'none', stroke: '#0d5bff',
        'stroke-width': '1.2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
      }));
      timeData.forEach(function(t) {
        var y = yForHours(t.avgMs / 3600000);
        timeGroup.appendChild(svgEl('circle', { cx: t.x, cy: y, r: '2.5', fill: '#0d5bff' }));
        timeGroup.appendChild(svgText(
          { x: t.x, y: (y - 7), 'text-anchor': 'middle', 'font-size': '9', fill: '#0d5bff' },
          formatResolution(t.avgMs)
        ));
      });
    }
    dates.forEach(function(d, i) {
      timeGroup.appendChild(svgText(
        { x: xPos[i], y: 220, 'text-anchor': 'middle', 'font-size': '10', fill: '#aaa' },
        fmtLabel(d)
      ));
    });
  }

});

