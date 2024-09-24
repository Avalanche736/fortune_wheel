let randomDegree = 0;

function spin() {
    const wheel = document.getElementById("wheel");
    const resultDisplay = document.getElementById("result");

    // Определяем случайное количество градусов вращения (от 3 до 8 оборотов)

    randomDegree = Math.floor(Math.random() * 1080) + 1080;
    wheel.style.transition = "transform 5s ease-out";
    wheel.style.transform = `rotate(${randomDegree}deg)`;

    setTimeout(() => {
        // Высчитываем остаток градусов после полной остановки
        const actualDeg = randomDegree % 360;

        // Определяем результат в зависимости от угла
        let result;
        if (actualDeg <= 90) {
            result = "Приз 1 (Жёлтый)";
        } else if (actualDeg <= 180) {
            result = "Приз 2 (Синий)";
        } else if (actualDeg <= 270) {
            result = "Приз 3 (Зелёный)";
        } else {
            result = "Приз 4 (Красный)";
        }

        resultDisplay.textContent = `Результат: ${result}`;
        console.log(randomDegree);
    }, 5000);
}
