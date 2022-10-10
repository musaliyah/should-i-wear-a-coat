var apiKey = "7b0cb6b05833e4f392297ec0ca158aea";
var searchHistory = [];
var today = moment().format("MMM Do, YYYY"); 

function todaysWeather(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: apiUrl,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        
        $("#weatherBars").css("display", "block");
        $('#cityInfo').empty();

        var icon = response.weather[0].icon;
        var iconsUrl = `https://openweathermap.org/img/w/${icon}.png`;

        var presentSearch = $(`
            <h2 id= "presentSearch">
                $(response.name) ${today} <img src="${iconsURL}" />
            </h2>

            <p>Temperature: ${response.main.temp}</p>
            <p>Humidity: ${response.main.humidity}</p>
            <p>Wind Speed: ${response.wind.speed}</p>
        `);

        $("#cityInfo").append(presentSearch);

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uviURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        $.ajax({
            url: uviURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var uvi = response.value;
            var uviDisplay = $(`<p>UV Index: <span id="uviColor class="px-2 py-2 rounded">${uvi}</span></p>`);

            $("cityInfo").append(uviDisplay);

            week(lat, lon);


            if(uvi >= 0 && uvi <=2) {
                $("#uviColor").css("background-color", "green").css("color", "white");
            } else if (uvi >= 3 && uvi <= 5) {
                $("#uviColor").css("background-color", "yellow");
            } else if (uvi >= 6 && uvi <= 7) {
                $("#uviColor").css("background-color", "orange");
            } else if (uvi >= 8 && uvi <= 10) {
                $("#uviColor").css("background-color", "red").css("color", "white");
            } else {
                $("#uviColor").css("background-color", "purple").css("color", "white");
            };
        });
    });
}

function week(lat, lon) {
    var weekURL= `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

    $ajax({
        url: weekURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $('#weatherWeek').empty();

        for(let i=1; i<6; i++) {
            var cityWeather  = {
                date: response.daily[i].dt,
                temp: response.daily[i].weather[0].icon,
                icon: response.daily[i].temp.day,
                humidity: response.daily[i].humidity
            };

            var weatherIcon = `<img src="https://openweathermap.org/img/w/${cityWeather.icon}.png" alt="${response.daily[i].weather[0].main}" />`

            var weatherCard = $(`
            <div class="pl-3">
                <div class="card pl-3 pt-3 mb-3 bg-primary" style="width: 12rem;>
                    <div class="card-body">
                        <p>${weatherIcon}</p>
                        <p>Temp: ${cityWeather.temp}</p>
                        <p>Humidity: ${cityWeather.humidity}</p>
                    </div>
                <div>
            </div>
            `);
            $('#weatherWeek').append(weatherCard);
        }
    });
}

$("searchBtn").on("click", function(event) {
    event.preventDefault();
    
    var city = $('#citySearch').val().trim();
    todaysWeather(city);

    if(!searchHistory.includes(city)) {
        searchHistory.push(city);
        var input = $(`<li class="list-group-item">${city}</li>`);
    }
        localStorage.setItem("city", JSON.stringify(searchHistory));
        console.log(searchHistory); 
});

$(document).on("click", ".list-group-item", function() {
    var pastCity = $(this).text();
    todaysWeather(pastCity);
});

$(document).ready(function() {
    var pastSearchesArr = JSON.parse(localStorage.getItem("city"));

    if(pastSearchesArr !== null) {
        var searchLocation = pastSearchesArr.length -1;
        var searchCity = pastSearchesArr[searchLocation];
        todaysWeather(searchCity);
        console.log(`Most recently searched: ${searchCity}`);
    }
});