let searchBtnEl = document.querySelector("#search-button")
let searchInputEl = document.querySelector("#search-value")
let mainEl = document.querySelector("main")
let asideEl = document.querySelector("aside")
let bpmApi = {
    url: "https://api.getsongbpm.com/tempo/",
    api_key: "d6d1431d02fa9c2f938ab2a8074ef686"
}
let songInfoArr = []


////START WEATHER FUNCTION////

//Start Global Weater Variables
var weatherBtnEl = document.querySelector("#weather-button");
var weatherInputEl = document.querySelector("#weather-value");
var locationBtnEl = document.querySelector("#location-button");
var oneCallAPIKey = '9234bf92e34e7602754600bc3607c0dc';
var googleAPIKey = 'AIzaSyCfm9Ok_M-qzamFmAAcDIVFNVKKTjpRvis';
var searchCity;
var curentWeather;
var CityName;
var iconPath = "http://openweathermap.org/img/wn/";
var cityLocation;
var latitude;
var longitude;
var locationInformaiton;
//End Global Weather Variables

//Start Get Weather Information from User Location
function getWeatherFromLocation(){
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude +'&lon=' + longitude +'&units=imperial&excludeminutely,alerts&appid=' + oneCallAPIKey)
    .then(function(response){
        console.log(response);
        return response.json();
    }).then(function(weatherData){
        currentWeather = (weatherData.current);
        console.log(weatherData);
        console.log(currentWeather);
        populateWeather();
    })
}
//End Get Weather Information from User Location

//Start Get City Name from User Location
function getCityName() {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude +'&key=' + googleAPIKey)
    .then(function(response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function(locationInfo) {
                locationInformation =(locationInfo.results[0].address_components);
                cityName = locationInformation[2].long_name
                console.log(cityName);
                getWeatherFromLocation();
            });
        } else {
            alert("Something went wrong.  Please try again");
        }
    })
    .catch(function(error) {
        alert("Unable to complete City Search function")
    });
}
//End Get City Name from User Location

//Start Populate Weather Data
function populateWeather() {
    var uvIn = currentWeather.uvi;
    var iconCurrent = currentWeather.weather[0].icon;
    var currentIcon = $(document.createElement('img'));
    currentIcon.attr('src', iconPath + iconCurrent + ".png");
    currentIcon.addClass("iconImage");
    $('#weatherTitle').text(cityName + " Weather");
    $('#weatherTitle').append(currentIcon);
    $('#temp').text("Temp: " + currentWeather.temp +String.fromCharCode(176) + "F");
    $('#wind').text("Wind: " + currentWeather.wind_speed + " MPH");
    $('#humidity').text("Humidity: " + currentWeather.humidity + "%");
    var uvEl = $('#currentUV');
    uvEl.text(uvIn);
    if(uvIn < 6) {
        uvEl.removeClass("uVModerate uVHigh").addClass("uVLow");
    } else if (uvIn <8){
        uvEl.removeClass("uVLow uVHigh").addClass("uVModerate")
        } else {
            uvEl.removeClass("uVLow uVModerate").addClass("uVHigh")
        }
}
//End Populate Weather Data

//Start Get User Location
function getUserLocation (){
    var lcn =[];
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  
  } else { 
    windowAlert("Geolocation is not supported by this browser."); //NEEDS TO BECOME MODAL
  }
}
function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getCityName();
}
//End Get User Location

/////END WEATHER FUNCTION/////

//////////////: Global Variables Above ://////////////////////////

function searchBtnHandler() {
    fetch(`${bpmApi.url}?api_key=${bpmApi.api_key}&bpm=${searchInputEl.value}`)
    .then(response => {return response.json()})
    .then(data => {
        populateMainSection(data.tempo)
    })
    .catch(err => {console.error(err)});
}

function populateMainSection(songs) {

    let songList = ""
    let numOfSongs = 5
    for (let i=0; i<numOfSongs; i++) {

        let songInfo = {
            art : songs[i].artist.img,
            title: songs[i].song_title,
            artist: songs[i].artist.name
        }
        let tempSection = 
            `<section class="searchResults">
            <img class="main-album-art" src="${songs[i].artist.img}" onerror=this.src="./Assets/images/blank-album.jpeg">
            <div class="right-half">
                <div class="title-container">
                    <h3>${songs[i].song_title}</h3>
                    <p class="plus-button" id="plus-button-${i}">+</p>
                </div>
                <ul>
                    <li>Artist: <span>${songs[i].artist.name}</span></li>
                    <li>BPM: <span>${songs[i].tempo}</span></li>
                    <li>Genres: <span>${songs[i].artist.genres}</span></li>
                </ul>
            </div>
            </section>`
        songList = songList + tempSection
        songInfoArr.push(songInfo)
    }
    mainEl.innerHTML = songList
    let plusBtnElArr = document.querySelectorAll(".plus-button")
    plusBtnElArr.forEach((el) => {
        el.addEventListener("click", plusBtnHandler)
    })
    getUserLocation();
}

function plusBtnHandler(e) {

    let index = e.target.id.split("-").slice(-1)[0]
    let art = songInfoArr[index].art
    let title = songInfoArr[index].title
    let artist = songInfoArr[index].artist
    localStorage.setItem(localStorage.length, [art, title, artist])
    populateAsideSection()
}

function populateAsideSection() {

    let asideSongs = ''
    for (let i=0; i<localStorage.length; i++) {

        let asideTempSong =
        `<div class="saved-song uk-card uk-grid-collapse uk-child-width-1-2@s uk-margin saved-songs uk-grid>
            <div class="uk-card-media-left uk-cover-container song-repo">
                <img src="${localStorage.getItem(localStorage.key(i)[0]).split(",")[0]}" alt="" onerror=this.src="./Assets/images/blank-album.jpeg" class="sidebarImage">
                <div class="flex-container uk-card-body playlist-item">
                    <h3 class="uk-card-title">${localStorage.getItem(localStorage.key(i)[0]).split(",")[1]}</h3>
                    <p>${localStorage.getItem(localStorage.key(i)[0]).split(",")[2]}</p>
                </div>
            </div>      
        </div>`
        asideSongs = asideSongs + asideTempSong
    }
    asideEl.innerHTML = asideSongs
}

//////////////: Event Listeners Below ://////////////////////////

searchBtnEl.addEventListener("click", searchBtnHandler)
populateAsideSection()



//////////////// Gigi /////////////////
// Add real-time year
const date = dayjs(year.dataset.YYYY).format("YYYY");
const yearEl = document.querySelector("#year");
    yearEl.innerText = date;
    console.log(date);

////// Auto popup after 1 second ///////
const popup = document.querySelector("#popup");
const close = document.querySelector("#close");
const getStarted = document.querySelector("#getStarted");

window.onload = function() {
    setTimeOut(function() {
      popup.style.display = "block"
    }, 2000)
  }

// Modal disappears on click of Close button
close.addEventListener("click", () => {
  popup.style.display = "none";
});


// Modal disappears on click of Get Started button
getStarted.addEventListener("click", () => { 
        popup.style.display = "none";

  });

