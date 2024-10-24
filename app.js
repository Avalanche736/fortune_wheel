let tg = window.Telegram.WebApp;
let parent_element = document.getElementById("buttonSpin");
parent_element.textContent = tg;
let randomDegree = 0;
let randomTurns = 0;
let actualDeg = 0;
let chance = [10, 10, 10, 70];

function spin() {
    const wheel = document.getElementById("wheel");
    const resultDisplay = document.getElementById("result");

    // Определяем случайное количество градусов вращения (от 3 до 8 оборотов)
    // randomDegreeModulo = randomDegree % 360;
    let randomChance = Math.floor(Math.random() * 100); // 0 : 99
    let chanceSum = 0;
    for (let i = 0; i < chance.length; i++) {
        if (randomChance >= chanceSum && randomChance < chanceSum + chance[i]) {
            randomDegree = (i * 360 / chance.length) + Math.floor(Math.random() * (360 / chance.length));
            break;
        } else {
            chanceSum += chance[i];
        }
    }
    randomTurns += Math.floor(Math.random() * 4) * 360 + 720;
    wheel.style.transition = "transform 5s ease-out";
    wheel.style.transform = `rotate(${randomTurns + randomDegree}deg)`;

    setTimeout(() => {
        // Высчитываем остаток градусов после полной остановки
        actualDeg = randomDegree % 360;


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

    }, 5000);
}
