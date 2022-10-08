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

    })
}