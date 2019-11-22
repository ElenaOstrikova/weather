
window.onload = function() {
    let inputForm = document.getElementById("input-form");
    inputForm.addEventListener("submit", onSubmit)
};

async function onSubmit(event){
    event.preventDefault();

    let [response, status] = await sendRequest(event.currentTarget[0].value);

    let data = transformData(response, status);

    showAnswer(data);

}

async function sendRequest(cityName, request){

    let response = await fetch("https://api.openweathermap.org/data/2.5/weather" +
        "?q=" + cityName +
        "&appid=f59d11cd1cbf21b585ceaf6740b123a4" +
        "&units=metric" +
        "&lang=en");

    let status = response.status;

   let data = await response.json();

   return [data, status];
}

function transformData(response, status){

    var data;

    if(status == 200){
        data =
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

    } else {
        data = {message: "city not found"}
    }
    
    return data;
}

function showAnswer(data, status) {
    let source = document.getElementById("data-template").innerHTML;
    let template = Handlebars.compile(source);

    let html = template(data);
    document.getElementById("data-container").innerHTML = html;
}



