async function makePrediction(fileContent) {
    const classes = ['Самолет','Автомобиль','Птица','Кот','Олень','Собака','Лягушка','Лошадь','Лодка','Грузовик'];
    const result = await eel.make_pred(fileContent)();
    const res = classes[result[0]];  // Предсказанный класс
    const invertedProbabilities = result[1];  // Инвертированный массив вероятностей
    document.getElementById('pred').textContent = "Предсказан класс: " + res;
    const probabilitiesDisplay = document.getElementById('class_probabilities');
    probabilitiesDisplay.innerHTML = "Вероятности:<br>"; // Начинаем с заголовка
    // Цикл для отображения вероятностей
    invertedProbabilities.forEach((prob, index) => {
        const percentage = prob; // То, что мы показываем, уже есть в prob
        // Создаем элемент для линии и задаем стили
        const line = document.createElement('div');
        line.style.width = `${percentage}%`; // Длина линии в зависимости от процента
        line.style.height = '15px'; // Высота линии
        line.style.backgroundColor = '#4CAF50'; // Цвет линии
        line.style.margin = '2px 0'; // Отступ между линиями
        line.style.borderRadius = '3px'; // Сглаженные углы
        // Добавляем текст с классом и процентом
        const label = document.createElement('span');
        label.textContent = `${classes[index]}: ${percentage.toFixed(2)}%`;
        label.style.marginRight = '10px'; // Отступ справа от текста
        label.style.verticalAlign = 'middle'; // Центрирование текста по вертикали
        // Создаем контейнер для текста и линии
        const container = document.createElement('div');
        container.style.display = 'flex'; // Используем flexbox для горизонтального выравнивания
        container.appendChild(label);
        container.appendChild(line);
        // Добавляем контейнер в вывод
        probabilitiesDisplay.appendChild(container);
    })
}

document.getElementById('uploadButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileContent = event.target.result; // Читаем содержимое файла
            
            const uploadedImage = document.getElementById('uploadedImage');
            uploadedImage.src = fileContent; 
            uploadedImage.style.display = 'inline'//!!!!!!!!!!!!!!!!!!!!!!!; 
            makePrediction(fileContent);
        };

        reader.readAsDataURL(file); // Считываем файл как data URL
    } else {
        alert("Пожалуйста, выберите файл.");
    }
});