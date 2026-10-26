let tasks = [
  { id: 1, title: "Study calculus", status: 'todo', priority: 1, tag: 'Study', date: '2026-06-01' },
  { id: 2, title: 'Make money', status: 'todo', priority: 3, tag: 'Work', date: '2026-06-02' },
  { id: 3, title: 'Get rich', status: 'todo', priority: 2, tag: 'Work', date: '2026-06-03' },
  { id: 4, title: 'Buy a house', status: 'todo', priority: 1, tag: 'Life', date: '2026-06-04' },
  { id: 5, title: 'Relax', status: 'in-progress', priority: 2, tag: 'Life', date: '2026-06-05' },
  { id: 6, title: 'Make music', status: 'in-progress', priority: 3, tag: 'Life', date: '2026-06-06' },
  { id: 7, title: 'Go to gym', status: 'done', priority: 1, tag: 'Life', date: '2026-06-07' },
  { id: 8, title: 'Watch a movie', status: 'done', priority: 2, tag: 'Life', date: '2026-06-08' },
  { id: 9, title: 'Complete homework', status: 'todo', priority: 3, tag: 'Study', date: '2026-06-09' },
  { id: 10, title: 'Prepare for defense', status: 'todo', priority: 1, tag: 'Study', date: '2026-06-10' }
];

const todoContainer = document.getElementById('todo-tasks');
const inProgressContainer = document.getElementById('in-progress-tasks');
const doneContainer = document.getElementById('done-tasks');
const boardContainer = document.getElementById('kanban-board');
const searchInput = document.getElementById('search-input');
const tagFilter = document.getElementById('tag-filter');
const sortBtn = document.getElementById('sort-btn');
const filterMessage = document.getElementById('filter-message');
const totalCounterEl = document.getElementById('total-counter');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

let sortDirection = 'asc';

function render() {
  todoContainer.innerHTML = '';
  inProgressContainer.innerHTML = '';
  doneContainer.innerHTML = '';

  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const selectedTag = tagFilter ? tagFilter.value : '';
  let visibleCount = 0;

  let totalTasksCount = 0;
  let doneCount = 0;
  for (let i = 0; i < tasks.length; i++) {
    totalTasksCount++;
    if (tasks[i].status === 'done') {
      doneCount++;
    }
  }

  if (totalCounterEl) {
    totalCounterEl.textContent = `Total tasks: ${totalTasksCount}`;
  }

  let progressPercent = totalTasksCount > 0 ? Math.round((doneCount / totalTasksCount) * 100) : 0;
  if (progressFill && progressText) {
    progressFill.style.width = progressPercent + '%';
    progressText.textContent = `Completed: ${progressPercent}% (${doneCount}/${totalTasksCount})`;
  }

  let sortedTasks = [...tasks].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.priority - b.priority;
    } else {
      return b.priority - a.priority;
    }
  });

  for (let task of sortedTasks) {
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm)) {
      continue;
    }
    if (selectedTag && task.tag !== selectedTag) {
      continue;
    }
    visibleCount++;

    const card = document.createElement('div');
    card.classList.add('task-card');
    card.dataset.id = task.id;

    const titleEl = document.createElement('h4');
    titleEl.textContent = task.title;

    const tagEl = document.createElement('span');
    tagEl.classList.add('tag-badge');
    tagEl.textContent = task.tag;

    const infoEl = document.createElement('p');
    infoEl.textContent = `Priority: ${task.priority} | Date: ${task.date}`;

    card.appendChild(titleEl);
    card.appendChild(tagEl);
    card.appendChild(infoEl);

    if (task.status === 'todo') {
      const btn = document.createElement('button');
      btn.textContent = 'In progress ➔';
      btn.dataset.action = 'move-to-inprogress';
      card.appendChild(btn);
      todoContainer.appendChild(card);
    } else if (task.status === 'in-progress') {
      const btnLeft = document.createElement('button');
      btnLeft.textContent = '⬅ Back';
      btnLeft.dataset.action = 'move-to-todo';

      const btnRight = document.createElement('button');
      btnRight.textContent = 'Done ➔';
      btnRight.dataset.action = 'move-to-done';

      card.appendChild(btnLeft);
      card.appendChild(btnRight);
      inProgressContainer.appendChild(card);
    } else if (task.status === 'done') {
      const btn = document.createElement('button');
      btn.textContent = '⬅ In progress';
      btn.dataset.action = 'move-to-inprogress';
      card.appendChild(btn);
      doneContainer.appendChild(card);
    }
  }

  if (filterMessage) {
    filterMessage.textContent = visibleCount === 0 ? 'Not found' : '';
  }
}

boardContainer.addEventListener('click', (event) => {
  if (event.target.tagName !== 'BUTTON') return;

  const action = event.target.dataset.action;
  const card = event.target.closest('.task-card');
  const taskId = Number(card.dataset.id);

  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  if (action === 'move-to-inprogress') {
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    if (inProgressCount >= 3 && task.status !== 'in-progress') {
      alert('Error: Limit of 3 tasks in progress reached.');
      return;
    }
    task.status = 'in-progress';
  } else if (action === 'move-to-todo') {
    task.status = 'todo';
  } else if (action === 'move-to-done') {
    task.status = 'done';
  }

  render();
});

if (searchInput) searchInput.addEventListener('input', render);
if (tagFilter) tagFilter.addEventListener('change', render);

if (sortBtn) {
  sortBtn.addEventListener('click', () => {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    sortBtn.textContent = `Sort by Priority (${sortDirection.toUpperCase()})`;
    render();
  });
}

render();
