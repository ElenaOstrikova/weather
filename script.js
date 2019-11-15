
window.onload = function() {
    let input_form = document.getElementById("input-form");
    input_form.addEventListener("submit", onSubmit)
};

function onSubmit(event){
    event.preventDefault();

    let request = new XMLHttpRequest();

    let city_name = event.currentTarget[0].value;

    let request_param = "https://api.openweathermap.org/data/2.5/weather" +
        "?q=" + city_name +
        "&appid=f59d11cd1cbf21b585ceaf6740b123a4" +
        "&units=metric" +
        "&lang=en";
    request.open("GET", request_param);
    request.responseType = "json";

    request.onload = function () {
        if(request.status == 200){
            let data = getData(request.response);
            showWeather(data);
        }
        else {
            showError(request.response.message);
        }

    };

    request.send();
}

function getData(response){
    const size = 128;

    let data =
        {
            parameters:
                [
                    {
                        name: "Temperature",
                        value: response.main.temp,
                        units: "&deg;C",
                        icon : 'icons/temperature.png'
                    },
                    {
                        name: "Pressure",
                        value: response.main.pressure,
                        units: "hPa",
                        icon : 'icons/pressure.png'
                    },
                    {
                        name: "Humidity",
                        value: response.main.humidity,
                        units: "%",
                        icon : 'icons/humidity.png'
                    },
                    {
                        name: "Clouds",
                        value: response.clouds.all,
                        units: "%",
                        icon : 'icons/cloud.png'
                    },
                    {
                        name: "Wind speed",
                        value: response.wind.speed,
                        units: "m/s",
                        icon : 'icons/wind.png'
                    },
                ],
        };

    return data;
}

function showWeather(data) {
    let source = document.getElementById("data-template").innerHTML;
    let template = Handlebars.compile(source);
    let html = template(data);

    document.getElementById("error-container").innerHTML = "";
    document.getElementById("data-container").innerHTML = html;
}

function showError(message) {
    let source = document.getElementById("error-template").innerHTML;
    let template = Handlebars.compile(source);

    let context = { message : message };
    let html = template(context);

    document.getElementById("error-container").innerHTML = html;
    document.getElementById("data-container").innerHTML = "";
}


