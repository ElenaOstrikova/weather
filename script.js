
window.onload = function() {
    let inputForm = document.getElementById("input-form");
    inputForm.addEventListener("submit", onSubmit)
};

function onSubmit(event){
    event.preventDefault();

    let request = new XMLHttpRequest();

    openRequest(event.currentTarget[0].value, request);

    request.onload = function () {
        if(request.status == 200){
            let data = transformData(request.response);
            showAnswer(data, request.status);
        }
        else {
            let data = { message : request.response.message };
            showAnswer(data, request.status);
        }

    };

    request.send();
}

function openRequest(cityName, request){

    let requestParam = "https://api.openweathermap.org/data/2.5/weather" +
        "?q=" + cityName +
        "&appid=f59d11cd1cbf21b585ceaf6740b123a4" +
        "&units=metric" +
        "&lang=en";
    request.open("GET", requestParam);
    request.responseType = "json";

}

function transformData(response){

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

function showAnswer(data, status) {
    let source = document.getElementById("data-template").innerHTML;
    let template = Handlebars.compile(source);

    let html = template(data);
    document.getElementById("data-container").innerHTML = html;
}



