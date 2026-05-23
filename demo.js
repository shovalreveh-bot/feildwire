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
      updateColumnCount(btn.parentElement);
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

function updateColumnCount(column) {
  var count = column.querySelectorAll('.task-card').length;
  var header = column.querySelector('h2');
  if (header) {
    header.innerHTML = header.innerHTML.replace(/\(\d+\)/, '(' + count + ')');  }
}
