let searchBtn = $("#search-button");

searchBtn.on("click", function () {
  let searchTerm = $("#search-value").val();

  $("#search-value").val("");

  searchWeather(searchTerm);
});

$(".history").on("click", "li", function () {
  searchWeather($(this).text());
});

function makeRow(text) {
  let li = $("<li>")
    .addClass("list-group-item list-group-item-action")
    .text(text);
  $(".history").append(li);
}

function searchWeather(searchValue) {
  let APIKey = "d67d379f19decbcad97f1f7549ca59f8";
  let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${APIKey}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then((response) => {
    makeRow(searchValue);

    // clear any old conent
    $("#weather-dashboard").empty();

    // create html content for weather
    let tempFar = ((response.main.temp - 273.15) * (9 / 5) + 32).toFixed(2);
    let name = $("<h3>")
      .addClass("card-title")
      .text(response.name + " (" + new Date().toLocaleDateString() + ")");
    let card = $("<div>").addClass("card");
    let cardBody = $("<div>").addClass("card-body");
    let temp = $("<p>")
      .addClass("card-text")
      .text("Temperature: " + tempFar + " °F");
    let humidity = $("<p>")
      .addClass("card-text")
      .text("Humidity: " + response.main.humidity + "%");
    let windSpeed = $("<p>")
      .addClass("card-text")
      .text("Wind Speed: " + response.wind.speed + " MPH");
    let UVIndex;
    let lat = response.coord.lat;
    let lon = response.coord.lon;
    let img = $("<img>").attr(
      "src",
      "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );

    // add to weather-dashboard
    name.append(img);
    cardBody.append(name, temp, humidity, windSpeed);
    card.append(cardBody);
    $("#weather-dashboard").append(card);

    // fetch forecast from weather API
    let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;

    $.ajax({
      url: forecastUrl,
      method: "GET",
    }).then((data) => {
      console.log(data);

      $("#forecast")
        .html('<h4 class="mt-3">5-Day Forecast:</h4>')
        .append('<div class="row">');

      for (let i = 0; i < 5; i++) {
        let forecast = data.daily[i];
        console.log(forecast);

        let forecastDates = new Date(forecast.dt * 1000).toLocaleDateString();
        console.log(forecastDates);

        let forecastDateEl = $("<h5>")
          .addClass("card-title")
          .text(forecastDates);
        let forecastWeather = $("<p>")
          .addClass("card-text")
          .text("Temp: " + forecast.temp.day + "°F");
        let humdityEl = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + forecast.humidity + "%");
        let forecastIcon = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png"
        );

        var col = $("<div>").addClass("col-md-2");
        var card = $("<div>").addClass("card bg-primary text-white");
        var body = $("<div>").addClass("card-body p-2");

        // merge together and put on page
        col.append(
          card.append(
            body.append(
              forecastDateEl,
              forecastIcon,
              forecastWeather,
              humdityEl
            )
          )
        );

        $("#forecast .row").append(col);
      }
    });
  });
}
