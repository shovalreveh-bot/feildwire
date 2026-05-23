window.addEventListener("DOMContentLoaded", () => {
  const taskModalBackdrop = document.querySelector("[data-task-modal]");
  const closeTaskModalButton = document.querySelector("[data-close-task-modal]");
  const modalTitleElements = document.querySelectorAll("[data-modal-task-title]");
  const modalTitleEditElements = document.querySelectorAll("[data-modal-task-title-edit]");
  const modalCommentElement = document.querySelector("[data-modal-task-comment]");
  const openTaskModal = (title = "New task") => {
    if (!taskModalBackdrop) return;
    taskModalBackdrop.hidden = false;
    modalTitleElements.forEach((el) => {
      el.textContent = title;
    });
    modalTitleEditElements.forEach((el) => {
      el.textContent = title;
    });
    if (modalCommentElement) {
      modalCommentElement.textContent = "";
    }
  };
  const closeTaskModal = () => {
    if (!taskModalBackdrop) return;
    taskModalBackdrop.hidden = true;
  };
  closeTaskModalButton?.addEventListener("click", closeTaskModal);
  document.querySelectorAll(".primary, [data-mobile-new-task]").forEach((button) => {
    button.addEventListener("click", () => openTaskModal("New task"));
  });
  window.openTaskModal = openTaskModal;
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
      var shapeClass = btn.closest(".safety-column") ? "triangle" : "square";
      card.innerHTML = "<div class=\"" + shapeClass + "\"></div><div><div class=\"meta\">#" + taskNum + " | @SRE</div><div>" + title + "</div></div></div>";
      form.remove();
      btn.style.display = '';
      (btn.closest(".column") || btn.parentElement).insertBefore(card, btn);
      updateColumnCount(btn.closest(".column") || btn.parentElement);
      updateSidebarCounts();
      if (window.openTaskModal) window.openTaskModal(title, !!card.closest(".safety-column"));
    });

    var buttons = document.createElement('div');
    buttons.className = 'form-buttons';
    buttons.appendChild(confirmBtn);
    buttons.appendChild(cancelBtn);
    form.appendChild(input);
    form.appendChild(buttons);
    (btn.closest(".column") || btn.parentElement).insertBefore(form, btn.nextSibling);
    input.focus();
});
  });
  document.addEventListener("click", function(e) { var card = e.target.closest(".task-card"); if (card && window.openTaskModal) { var titleEl = card.querySelector("div > div:last-child"); var title = titleEl ? titleEl.textContent.trim() : "Task"; window.openTaskModal(title, !!card.closest(".safety-column")); } });
});

function updateColumnCount(column) {
  var count = column.querySelectorAll('.task-card').length;
  var header = column.querySelector('h2');
  if (header) {
    header.innerHTML = header.innerHTML.replace(/\(\d+\)/, '(' + count + ')');  }
}

document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(function(i) { i.classList.remove('active'); });
    item.classList.add('active');
  });
});
document.querySelectorAll('.task-item').forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.task-item').forEach(function(i) { i.classList.remove('active'); });
    item.classList.add('active');
  });
});

function updateSidebarCounts() {
  var total = document.querySelectorAll('.task-card').length;
  document.querySelectorAll('.task-item').forEach(function(item) {
    var b = item.querySelector('b');
    if (!b) return;
    if (item.textContent.includes('All tasks')) b.textContent = total;
    if (item.textContent.includes('My tasks')) b.textContent = total;
    if (item.textContent.includes('Watched tasks')) b.textContent = Math.max(0, total - 2);
  });
}

window.addEventListener('DOMContentLoaded', function() {
  var orig = window.openTaskModal;
  if (!orig) return;
  window.openTaskModal = function(title, isSafety) {
    orig(title);
    var tri = document.querySelector('.modal-safety-triangle');
    if (tri) {
      if (isSafety) {
        tri.style.cssText = 'width:0;height:0;margin:0 auto;border-left:21px solid transparent;border-right:21px solid transparent;border-bottom:45px solid #ff4f4f;background:none;';
      } else {
        tri.style.cssText = 'width:34px;height:34px;margin:0;border:0;background:#45de67;';
      }
    }
    var hideIcons = ['category','plan','people','cost','tags','watchers'];
    var hideNames = ['Category','Plan','Manpower','Cost','Tags','Watchers'];
    document.querySelectorAll('.attribute.row.with-icon').forEach(function(row) {
      var icon = row.querySelector('.attr-icon');
      if (icon) row.style.display = (isSafety && hideIcons.some(function(c){return icon.classList.contains(c);})) ? 'none' : '';
    });
    document.querySelectorAll('.attribute.row:not(.with-icon)').forEach(function(row) {
      var txt = row.querySelector('span') ? row.querySelector('span').textContent.trim() : '';
      row.style.display = (isSafety && hideNames.indexOf(txt) >= 0) ? 'none' : '';
    });
  };
});

window.addEventListener('DOMContentLoaded', function() {
  var activeDropdown = null;
  var isSafetyCtx = false;

  function buildDropdown(isSafety) {
    var d = document.createElement('div');
    d.className = 'sdi-wrap';
    var options = [
      {s:'priority1', color:'#e53935', label:'Priority 1', safetyHide:true},
      {s:'priority2', color:'#ff9800', label:'Priority 2', safetyHide:true},
      {s:'priority3', color:'#fdd835', label:'Priority 3', safetyHide:true},
      {s:'completed', color:'#45de67', label:'Completed', safetyHide:false},
      {s:'verified',  color:'#81d4fa', label:'Verified',  safetyHide:false}
    ];
    options.forEach(function(o) {
      if (isSafety && o.safetyHide) return;
      var el = document.createElement('div');
      el.className = 'sdi-opt';
      el.innerHTML = '<span class="sdot2" style="background:'+o.color+'"></span>'+o.label;
      d.appendChild(el);
    });
    var hr = document.createElement('hr');
    hr.className = 'sdi-hr';
    d.appendChild(hr);
    var del = document.createElement('div');
    del.className = 'sdi-opt danger';
    del.innerHTML = '🗑 Delete task';
    d.appendChild(del);
    return d;
  }

  document.addEventListener('click', function(e) {
    var statusRow = e.target.closest('.attribute.row.with-icon');
    if (statusRow && statusRow.querySelector('.attr-icon.status')) {
      if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; return; }
      activeDropdown = buildDropdown(isSafetyCtx);
      statusRow.parentNode.insertBefore(activeDropdown, statusRow.nextSibling);
      e.stopPropagation();
      return;
    }
    if (activeDropdown && !e.target.closest('.sdi-wrap')) {
      activeDropdown.remove(); activeDropdown = null;
    }
  });

  var prevOpen = window.openTaskModal;
  if (prevOpen) {
    window.openTaskModal = function(title, isSafety) {
      isSafetyCtx = !!isSafety;
      if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
      prevOpen(title, isSafety);
    };
  }
});

window.addEventListener('DOMContentLoaded', function() {
  var lastCard = null;

  // Track which card was clicked
  document.addEventListener('click', function(e) {
    var card = e.target.closest('.task-card');
    if (card) lastCard = card;
  }, true);

  // Update status text when modal opens
  var prevOpen2 = window.openTaskModal;
  if (prevOpen2) {
    window.openTaskModal = function(title, isSafety) {
      prevOpen2(title, isSafety);
      var statusB = document.querySelector('.attribute.row.with-icon .attr-icon.status');
      if (statusB) {
        var row = statusB.closest('.attribute.row.with-icon');
        if (row) row.querySelector('b').innerHTML = 'In progress <i class="caret"></i>';
      }
    };
  }

  // Handle dropdown option clicks
  document.addEventListener('click', function(e) {
    var opt = e.target.closest('.sdi-opt');
    if (!opt) return;
    
    if (opt.classList.contains('danger')) {
      // Delete task
      if (lastCard) {
        var col = lastCard.closest('.column');
        lastCard.remove();
        if (col && typeof updateColumnCount === 'function') updateColumnCount(col);
        if (typeof updateSidebarCounts === 'function') updateSidebarCounts();
        lastCard = null;
      }
      var closeBtn = document.querySelector('[data-close-task-modal]');
      if (closeBtn) closeBtn.click();
    } else {
      // Update status
      var label = opt.textContent.trim();
      var statusRow = document.querySelector('.attribute.row.with-icon .attr-icon.status');
      if (statusRow) {
        var row = statusRow.closest('b') || statusRow.closest('.attribute.row.with-icon').querySelector('b');
        if (row) row.innerHTML = label + ' <i class="caret"></i>';
      }
    }

    // Close dropdown
    var wrap = document.querySelector('.sdi-wrap');
    if (wrap) wrap.remove();
  });
});

document.addEventListener('change', function(e) {
  if (e.target.id === 'photoInput') {
    var preview = document.getElementById('photosPreview');
    if (!preview) return;
    Array.from(e.target.files).forEach(function(file) {
      var reader = new FileReader();
      reader.onload = function(ev) {
        var img = document.createElement('img');
        img.src = ev.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }
});
