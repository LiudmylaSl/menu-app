// Отримуємо елементи з DOM
const form = document.getElementById('dishForm');
const resultsTable = document.getElementById('resultsTable').querySelector('tbody');
const summaryTable = document.getElementById('summaryTable').querySelector('tbody');

// Масив для збереження виборів
let choices = JSON.parse(localStorage.getItem('choices')) || [];

// Функція для відображення результатів
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
        <button class="edit-btn" data-index="${index}">Редагувати</button>
        <button class="delete-btn" data-index="${index}">Видалити</button>
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
    });
  });

  renderSummary();
}

// Функція для підрахунку виборів
function renderSummary() {
  const summary = {
    monday: { regular: 0, vegetarian: 0 },
    tuesday: { regular: 0, vegetarian: 0 },
    wednesday: { regular: 0, vegetarian: 0 },
    thursday: { regular: 0, vegetarian: 0 },
    friday: { regular: 0, vegetarian: 0 }
  };

  choices.forEach((choice) => {
    summary[choice.day][choice.dish]++;
  });

  summaryTable.innerHTML = '';
  Object.keys(summary).forEach((day) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${capitalizeFirstLetter(day)}</td>
      <td>${summary[day].regular}</td>
      <td>${summary[day].vegetarian}</td>
    `;
    summaryTable.appendChild(row);
  });
}

// Допоміжна функція для капіталізації першої літери
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

// Оновлення таблиці при завантаженні
renderResults();