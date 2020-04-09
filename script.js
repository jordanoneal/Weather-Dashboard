//API Key
var APIKey = "&appid=d67d379f19decbcad97f1f7549ca59f8"
var city = "Salt Lake City"
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + APIKey

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(response);
    console.log(response.name);

    var currentDay = moment().format("L");
    var tempFar = (response.main.temp - 273.15) * 9 / 5 + 32;
    var tempFar = tempFar.toFixed(2);

    $("#city").text(response.name + " " + currentDay);
    $("#temp").text("Temperature: " + tempFar + "°F")
    $("#humid").text("Humidity: " + response.main.humidity + "%")
    $("#wind").text("Wind speed: " + response.wind.speed + " MPH")
    $("#index").text()

    var long = response.coord.lon
    console.log(long)
    var lat = response.coord.lat
    console.log(lat);

    var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + APIKey

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (forecast) {
        console.log(forecast);
        console.log(forecast.daily[0].temp.day)

        for (var i = 1; i < 6; i++) {

            var forecastWeather = (forecast.daily[i].temp.day - 273.15) * 9 / 5 + 32;
            var forecastWeather = forecastWeather.toFixed(2);

            var forecastDate = new Date(forecast.daily[i].dt * 1000);
            console.log(forecastDate);
            var forecastDate = moment(forecastDate).format('l');

            var weatherIcon = "http://openweathermap.org/img/w/" + forecast.daily[i].weather[0].icon + ".png";

            //card div
            var cardEl = $("<div>");
            cardEl.addClass("card");
            $("#forecastDiv").append(cardEl);

            //creating card body
            var cardBody = $("<div>");
            cardBody.addClass("card-body");
            cardEl.append(cardBody);

            //creating card contents to append to card body
            var cardDate = $("<p>");
            cardDate.addClass("card-title");
            cardDate.text(forecastDate);
            cardBody.append(cardDate);

            var cardWeather = $("<img>")
            cardWeather.addClass("weather-icon");
            cardWeather.attr("src", weatherIcon);
            cardBody.append(cardWeather);

            var cardTemp = $("<p>");
            cardTemp.addClass("card-text");
            cardTemp.text("Temp: " + forecastWeather + "°F")
            cardBody.append(cardTemp);

            var cardHumid = $("<p>");
            cardHumid.addClass("card-text");
            cardHumid.text("Humidity: " + forecast.daily[i].humidity + "%");
            cardBody.append(cardHumid);

            //set index text
            $("#index").text("UV Index: " + forecast.current.uvi)

        }

    })

})

$("#saveBtn").on("click", function(event) {
    event.preventDefault()
    var search = $("#city-input").val().trim();
    console.log(search)
})