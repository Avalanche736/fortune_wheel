let tg = window.Telegram.WebApp;
console.log(tg)

let number_of_prizes = 0;
let prize_names = [];
let is_spinned = 0;
let is_data_done = 0;
let data;

url = "https://69cd-94-250-252-189.ngrok-free.app/"
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

        }

        wheel.style.background = backgorund_str;


        // food_items = xhr.response['food'];
        // additions_items = xhr.response['additions']
        // additions_lists_items = xhr.response['additions_lists'];
        // for (const item of food_items) {
        //     //console.log(item);
        //     if (item['in_stock'] < 1) {
        //         continue;
        //     }
        //     let item_copy = item;
        //     //Добавить в список товаров на главной странице
        //     copyItemToMainPageProductsList(item_copy, item['category']);
        //     //Добавить в популярное
        //     if (item['is_popular'] == 1) {
        //         copyItemToMainPageProductsList(item_copy, "Популярное");
        //     }
        // }
    } else {
        console.log(`Error: ${xhr.status}`);
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
    xhr.send();
    xhr.responseType = "json";
    let randomDegree;

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let number_of_prize = 0;
            for (let i = 0; i < number_of_prizes; i++) {
                if (xhr.response['name'] === prize_names[i]) {
                    number_of_prize = i;
                }
            }
            randomDegree = (number_of_prize / number_of_prizes) * 360 + Math.floor(Math.random() * 360 / number_of_prizes) + Math.floor(Math.random() * 4) * 360 + 720;

            wheel.style.transition = "transform 5s ease-out";
            wheel.style.transform = `rotate(${randomDegree}deg)`;

            console.log(number_of_prize);
            console.log(randomDegree);

            setTimeout(() => {
                resultDisplay.textContent = `Результат: ${xhr.response['name']} ${number_of_prize} ${randomDegree}`;
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

function close() {
    console.log('try to close');
    if (is_data_done == 1) {
        tg.sendData(JSON.stringify(data));
    }
}
