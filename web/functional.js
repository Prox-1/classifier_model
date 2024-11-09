async function makePrediction(fileContent, className) {
  const classes = [
    "Самолет",
    "Автомобиль",
    "Птица",
    "Кот",
    "Олень",
    "Собака",
    "Лягушка",
    "Лошадь",
    "Лодка",
    "Грузовик",
  ];
  const result = await eel.make_pred(fileContent, className)();
  const res = classes[result[0]]; // Предсказанный класс
  const invertedProbabilities = result[1]; // Инвертированный массив вероятностей
  document.getElementById("pred").textContent = "Это: " + res;
  const probabilitiesDisplay = document.getElementById("class_probabilities");
  probabilitiesDisplay.innerHTML = "Вероятности:<br>"; // Начинаем с заголовка
  // Цикл для отображения вероятностей
  invertedProbabilities.forEach((prob, index) => {
    const percentage = prob; // То, что мы показываем, уже есть в prob
    // Создаем элемент для линии и задаем стили
    const line = document.createElement("div");
    line.style.width = `${percentage}%`; // Длина линии в зависимости от процента
    line.style.height = "15px"; // Высота линии
    line.style.backgroundColor = "#4CAF50"; // Цвет линии
    line.style.margin = "2px 0"; // Отступ между линиями
    line.style.borderRadius = "3px"; // Сглаженные углы
    // Добавляем текст с классом и процентом
    const label = document.createElement("span");
    label.textContent = `${classes[index]}: ${percentage.toFixed(2)}%`;
    label.style.marginRight = "10px"; // Отступ справа от текста
    label.style.verticalAlign = "middle"; // Центрирование текста по вертикали
    // Создаем контейнер для текста и линии
    const container = document.createElement("div");
    container.style.display = "flex"; // Используем flexbox для горизонтального выравнивания
    container.appendChild(label);
    container.appendChild(line);
    // Добавляем контейнер в вывод
    probabilitiesDisplay.appendChild(container);
  });
}

function setActiveButton(value) {
  // Убираем класс active с обеих кнопок
  document.getElementById("button1").classList.remove("active");
  document.getElementById("button2").classList.remove("active");

  // Устанавливаем новый активный класс нажатой кнопке
  if (value === "net") {
    document.getElementById("button1").classList.add("active");
  } else {
    document.getElementById("button2").classList.add("active");
  }

  // Изменение значения переменной
  className = value;
  console.log("Текущая активная кнопка:", activeValue);
}
let className = "";

document.getElementById("button1").addEventListener("click", function () {
  setActiveButton("net");
});
document.getElementById("button2").addEventListener("click", function () {
  setActiveButton("resnet");
});

document.getElementById("uploadButton").addEventListener("click", function () {
  if (className != "") {
    const fileInput = document.getElementById("fileUpload");
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const fileContent = event.target.result; // Читаем содержимое файла

        const uploadedImage = document.getElementById("uploadedImage");
        const pred_div = document.getElementById("pred_div");
        makePrediction(fileContent, className);
        uploadedImage.src = fileContent;
        pred_div.style.display = "flex";
      };

      reader.readAsDataURL(file); // Считываем файл как data URL
    } else {
      alert("Пожалуйста, выберите файл.");
    }
  } else {
    alert("Пожалуйста, выберите модель.");
  }
});

document.getElementById("fileUpload").addEventListener("change", function () {
  if (this.files.length > 0) {
    if (className != "") {
      const fileInput = document.getElementById("fileUpload");
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const fileContent = event.target.result; // Читаем содержимое файла

          const uploadedImage = document.getElementById("uploadedImage");
          const pred_div = document.getElementById("pred_div");
          makePrediction(fileContent, className);
          uploadedImage.src = fileContent;
          pred_div.style.display = "flex";
        };

        reader.readAsDataURL(file); // Считываем файл как data URL
      } else {
        alert("Пожалуйста, выберите файл.");
      }
    } else {
      alert("Пожалуйста, выберите модель.");
    }
  }
});
