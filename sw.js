// Масив для збереження виборів
let choices = JSON.parse(localStorage.getItem('choices')) || [];

// Елемент для відображення списку імен
const nameList = document.getElementById('nameList');

// Функція для оновлення таблиці результатів
function renderResults() {
  const resultsTable = document.getElementById('resultsTable').querySelector('tbody');
  resultsTable.innerHTML = ''; // Очищення таблиці
  choices.forEach((choice, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${choice.name}</td>
      <td>${choice.day}</td>
      <td>${choice.dish}</td>
      <td>${choice.dishName}</td>
      <td>${choice.suggestedDishes || 'Keine Vorschläge'}</td>
      <td>
        <button class="delete-btn" data-index="${index}">Löschen</button>
      </td>
    `;
    resultsTable.appendChild(row);
  });

  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index');
      choices.splice(index, 1); // Видалення запису
      localStorage.setItem('choices', JSON.stringify(choices));
      renderResults();
      renderSummary();
      updateNameList();
    });
  });

  renderSummary();
  updateNameList();
}

// Функція для оновлення підсумків
function renderSummary() {
  const summaryTable = document.getElementById('summaryTable').querySelector('tbody');
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

// Функція для оновлення списку імен
function updateNameList() {
  if (choices.length === 0) {
    nameList.innerHTML = '<p>Niemand ist derzeit angemeldet.</p>';
  } else {
    const uniqueNames = [...new Set(choices.map(choice => choice.name))];
    nameList.innerHTML = `
      <ul>
        ${uniqueNames.map(name => `<li>${name}</li>`).join('')}
      </ul>
    `;
  }
}

// Додавання нового вибору
const form = document.getElementById('dishForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const day = document.getElementById('day').value;
  const dish = document.getElementById('dish').value;
  const dishName = document.getElementById('dishName').value.trim();
  const suggestedDishes = document.getElementById('suggestedDishes').value.trim();

  if (name && dishName) {
    choices.push({ name, day, dish, dishName, suggestedDishes });
    localStorage.setItem('choices', JSON.stringify(choices));
    form.reset();
    renderResults();
  }
});

// Капіталізація першої літери
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Завантаження даних при старті
renderResults();