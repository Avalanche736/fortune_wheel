let tg = window.Telegram.WebApp;
tg.expand();

let number_of_prizes = 0;
let prize_names = [];
let is_spinned = 0;
let is_data_done = 0;
let data;

let params = new URLSearchParams(document.location.search);
let user_id = params.get('id'); // 'key' – это имя целевого параметр

url = "https://c48f-45-114-62-71.ngrok-free.app/"
//fortune_wheel_get_prize_from_web_app
let xhr = new XMLHttpRequest();
xhr.open("GET", url + "fortune_wheel_get_prizes_data");
xhr.setRequestHeader('ngrok-skip-browser-warning', '0');
xhr.send();
xhr.responseType = "json";
xhr.onload = () => {
    let backgorund_str;
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.response);
        const wheel = document.getElementById("wheel");
        const wheel_container = document.getElementById("wheel-container");
        backgorund_str = "conic-gradient(";
        number_of_prizes = xhr.response['number_of_prizes'];
        const radius = 30; // Радиус в процентах от размера колеса
        for (let i = 0; i < number_of_prizes; i++) {
            prize_names.push(xhr.response['prizes_names'][i])
            //фон
            if (i % 2 === 0) {
                backgorund_str += "#ff9999 ";
            } else {
                backgorund_str += "#ffff99 ";
            }
            backgorund_str += ((i / number_of_prizes) * 360).toString() + "deg ";
            backgorund_str += (((i + 1) / number_of_prizes) * 360).toString() + "deg";
            if (i == (number_of_prizes - 1)) {
                backgorund_str += ")";
            } else {
                backgorund_str += ", ";
            }


            // TODO надпись c названием надо или не надо?
            const letterElement = document.createElement("div");
            letterElement.textContent = xhr.response['prizes_names'][i];
            letterElement.classList.add("letters");

            // Угол поворота в радианах
            //const angle = ((2 * (i - 1)) * 2 * Math.PI / (2 * n));
            const angle = i * 2 * Math.PI / number_of_prizes + Math.PI / number_of_prizes - Math.PI / 2;
            //const angle = 2 * Math.PI - ((2 * i + 1) * 2 * Math.PI / (2 * n));

            // Вычисление координат
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;

            // Установка стилей для позиции и поворота
            letterElement.style.left = `${x}%`;
            letterElement.style.top = `${y}%`;
            letterElement.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;

            // Добавление элемента в колесо
            wheel.appendChild(letterElement);
        }

        wheel.style.background = backgorund_str;
    } else {
        console.log(`Error: ${xhr.status}`);
    }
};

let xhr1 = new XMLHttpRequest();
xhr1.open("GET", url + "get_fortune_wheel_amount");
xhr1.setRequestHeader('ngrok-skip-browser-warning', '0');
xhr1.setRequestHeader('id', user_id);
xhr1.send();
xhr1.responseType = "json";
xhr1.onload = () => {
    if (xhr1.readyState == 4 && xhr.status == 200) {
        console.log("get_fortune_wheel_amount");
        console.log("Ваш баланс " + xhr1.response['user_amount'] + "/1000");
        const balance = document.getElementById("balance");
        //balance.style.color = tg.ThemeParams.text_color;
        balance.textContent = "Ваш баланс ";
        //parseInt(xhr1.response['user_amount']/1000);
        balance.textContent += Math.floor(xhr1.response['user_amount']/1000) + " ";
        let number_of_turns = Math.floor(xhr1.response['user_amount']/1000);
        if (number_of_turns % 100 >= 11 && number_of_turns % 100 <= 14) { // Особый случай для чисел от 11 до 14
            balance.textContent += "вращений";
        } else {
            const modulo = number_of_turns % 10;
            if (modulo === 1) {
                balance.textContent += "вращение";
            } else if (modulo >= 2 && modulo <= 4) {
                balance.textContent += "вращения";
            } else {
                balance.textContent += "вращений";
            }
        }
        balance.textContent += ", до следующего вращения " + xhr1.response['user_amount'] % 1000 + "/1000";
        if (xhr1.response['user_amount'] > 1000) {
            document.getElementById("buttonSpin").style.display = 'inline-block';
        }
    } else {
        console.log(`Error: ${xhr1.status}`);
    }
};


function spin() {
    //TODO УДАЛИТЬ КНОПКУ spin
    if (is_spinned == 1) {
        return 0;
    }
    is_spinned = 1;

    const wheel = document.getElementById("wheel");
    const resultDisplay = document.getElementById("result");

    //fortune_wheel_get_prize_from_web_app
    xhr.open("GET", url + "fortune_wheel_get_prize_from_web_app");
    xhr.setRequestHeader('ngrok-skip-browser-warning', '0');
    xhr.setRequestHeader('id', user_id);
    xhr.send();
    xhr.responseType = "json";
    let randomDegree;

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log("результат запроса");
            console.log(xhr.response);
            let number_of_prize = 0;
            for (let i = 0; i < number_of_prizes; i++) {
                if (xhr.response['name'] === prize_names[i]) {
                    number_of_prize = i;
                }
            }
            randomDegree = (number_of_prize / number_of_prizes) * 360 + Math.floor(Math.random() * 360 / number_of_prizes) + Math.floor(Math.random() * 4) * 360 + 720;

            wheel.style.transition = "transform 5s ease-out";
            wheel.style.transform = `rotate(${-randomDegree}deg)`;

            console.log(number_of_prize);
            console.log(randomDegree);

            setTimeout(() => {
                resultDisplay.textContent = `Результат: ${xhr.response['name']}`;
                data = xhr.response;
                is_data_done = 1;
                document.getElementById('buttonSpin').style.display = 'none';
                document.getElementById('buttonGet').style.display = 'inline-block';
            }, 5000);

        } else {
            console.log(`Error: ${xhr.status}`);
        }
    }
}

function get_prize_and_close() {
    console.log('try to close');
    if (is_data_done == 1) {
        tg.sendData(JSON.stringify(data));
    }
}

window.onbeforeunload = function() {
  tg.sendData(JSON.stringify(data));
  return "эй!"
};
