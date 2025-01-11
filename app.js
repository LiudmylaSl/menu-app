// Отримуємо елементи з DOM
const form = document.getElementById('dishForm');
const resultsTable = document.getElementById('resultsTable').querySelector('tbody');
const summaryTable = document.getElementById('summaryTable').querySelector('tbody');
const nameList = document.getElementById('nameList'); // Список імен

// Масив для збереження виборів
let choices = JSON.parse(localStorage.getItem('choices')) || [];

// Функція для оновлення таблиці результатів
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

  // Додавання функціоналу для кнопок "Редагувати" і "Видалити"
  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = event.target.getAttribute('data-index');
      choices.splice(index, 1); // Видаляємо вибір
      localStorage.setItem('choices', JSON.stringify(choices)); // Зберігаємо зміни
      renderResults(); // Оновлюємо таблицю
      renderSummary(); // Оновлюємо підсумок
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
      choices.splice(index, 1); // Видаляємо старий запис для редагування
      localStorage.setItem('choices', JSON.stringify(choices));
      renderResults();
      renderSummary();
      updateNameList(); // Оновлюємо список імен
    });
  });

  renderSummary(); // Оновлюємо підсумок
  updateNameList(); // Оновлюємо список імен
}

// Функція для підрахунку підсумків
function renderSummary() {
  const summary = {
    monday: { regular: 0, vegetarian: 0 },
    tuesday: { regular: 0, vegetarian: 0 },
    wednesday: { regular: 0, vegetarian: 0 },
    thursday: { regular: 0, vegetarian: 0 },
    friday: { regular: 0, vegetarian: 0 }
  };

  // Підрахунок виборів за типами
  choices.forEach((choice) => {
    summary[choice.day][choice.dish]++;
  });

  summaryTable.innerHTML = ''; // Очищення таблиці підсумків
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

// Функція для формування списку імен
function updateNameList() {
  if (choices.length === 0) {
    // Якщо записів немає
    nameList.innerHTML = '<p>Поки що ніхто не записаний.</p>';
  } else {
    // Витягуємо унікальні імена
    const uniqueNames = [...new Set(choices.map(choice => choice.name))];
    nameList.innerHTML = `
      <ul>
        ${uniqueNames.map(name => `<li>${name}</li>`).join('')}
      </ul>
    `;
  }
}

// Допоміжна функція для капіталізації першої літери
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Функція для додавання нового вибору
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Запобігаємо перезавантаженню сторінки
  const name = document.getElementById('name').value.trim();
  const day = document.getElementById('day').value;
  const dish = document.getElementById('dish').value;
  const dishName = document.getElementById('dishName').value.trim();
  if (name && dishName) { // Перевірка на порожні поля
    choices.push({ name, day, dish, dishName }); // Додаємо запис
    localStorage.setItem('choices', JSON.stringify(choices)); // Зберігаємо дані
    form.reset(); // Очищуємо форму
    renderResults(); // Оновлюємо таблицю результатів
  }
});

// Оновлення таблиці та списків при завантаженні сторінки
renderResults();