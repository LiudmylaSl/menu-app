self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('menu-app-cache').then((cache) => {
        return cache.addAll(['./index.html', './style.css', './app.js']);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  // Отримуємо елемент для списку імен
const nameList = document.getElementById('nameList');

// Функція для оновлення списку імен
function updateNameList() {
  const names = choices.map(choice => choice.name); // Витягуємо імена
  if (names.length === 0) {
    nameList.innerHTML = '<p>Поки що ніхто не записаний.</p>';
  } else {
    nameList.innerHTML = `
      <ul>
        ${names.map(name => `<li>${name}</li>`).join('')}
      </ul>
    `;
  }
}

// Оновлюємо список імен при кожному додаванні, редагуванні або видаленні
function renderResults() {
  resultsTable.innerHTML = ''; // Очищення таблиці
  choices.forEach((choice, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${choice.name}</td>
      <td>${choice.day}</td>
      <td>${choice.dish}</td>
      <td>${choice.dishName}</td>
      <td>
        <button class="edit-btn" data-index="${index}">Bearbeiten</button>
        <button class="delete-btn" data-index="${index}">Löschen</button>
      </td>
    `;
    resultsTable.appendChild(row);
  });

  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index');
      choices.splice(index, 1);
      localStorage.setItem('choices', JSON.stringify(choices));
      renderResults();
      renderSummary();
      updateNameList(); // Оновлюємо список імен
    });
  });

  document.querySelectorAll('.edit-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index');
      const choice = choices[index];
      document.getElementById('name').value = choice.name;
      document.getElementById('day').value = choice.day;
      document.getElementById('dish').value = choice.dish;
      document.getElementById('dishName').value = choice.dishName;
      choices.splice(index, 1);
      localStorage.setItem('choices', JSON.stringify(choices));
      renderResults();
      renderSummary();
      updateNameList(); // Оновлюємо список імен
    });
  });

  renderSummary();
  updateNameList(); // Оновлюємо список імен
}

// Додавання нового вибору
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const day = document.getElementById('day').value;
  const dish = document.getElementById('dish').value;
  const dishName = document.getElementById('dishName').value;
  choices.push({ name, day, dish, dishName });
  localStorage.setItem('choices', JSON.stringify(choices));
  form.reset();
  renderResults();
});