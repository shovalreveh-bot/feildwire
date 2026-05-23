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
      card.innerHTML = '<div class="square"></div><div><div class="meta">#' + taskNum + ' | @SRE</div><div>' + title + '</div></div>';
      form.remove();
      btn.style.display = '';
      (btn.closest(".column") || btn.parentElement).insertBefore(card, btn);
      updateColumnCount(btn.closest(".column") || btn.parentElement);
      updateSidebarCounts();
      if (window.openTaskModal) window.openTaskModal(title);
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
  document.addEventListener("click", function(e) { var card = e.target.closest(".task-card"); if (card && window.openTaskModal) { var titleEl = card.querySelector("div > div:last-child"); var title = titleEl ? titleEl.textContent.trim() : "Task"; window.openTaskModal(title); } });
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
