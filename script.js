'use strict';

const countriesContainer = document.querySelector('.countries');

const renderError = function(msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    //countriesContainer.style.opacity = 1;
}

const renderCountry = function (data, className = '') {
    const html = `
        <article class="country ${className}">
            <img class="country__img" src="${data.flags.png}" />
            <div class="country__data">
                <h3 class="country__name">${data.name.official}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(+data.population/1000000).toFixed(1)} people</p>
                <p class="country__row"><span>🗣️</span>${data.languages[Object.keys(data.languages)[0]]}</p>
                <p class="country__row"><span>💰</span>${data.currencies[Object.keys(data.currencies)[0]].name}</p>
            </div>
        </article>
        `;
        countriesContainer.insertAdjacentHTML('beforeend', html);
        countriesContainer.style.opacity = 1;
};

const getCountryData = function(country) {
    fetch(`https://restcountries.com/v3.1/name/${country}`) //fetch-returning promise 
        .then(response => {
            if(!response.ok)
                throw new Error(`Country not found (${response.status})`
            )
            return response.json(); //the response will be transformed to JSON, return promise
        })
        .then(data => {
            renderCountry(data[0]); //we render it to the DOM
            const neighbours = data[0].borders;

            if (!neighbours || neighbours.length == 0) return;

            neighbours.forEach(neighbour => {
                fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)
                    .then(response => response.json())
                    .then(data => {
                        renderCountry(data[0], 'neighbour')
                    })
            })
        })

        //.catch(err=>alert(err)) - enough to put the catch once, at the end of the line
        .catch(err=> {
            console.error(`${err}`);
            renderError(`Something went wrong: ${err.message}. Try again!`)
        })
        
        //finally - it will allways happen
        .finally(()=>{
            countriesContainer.style.opacity = 1;
        });
};

//  Geolocation API

const getPosition = function () {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

getPosition().then(pos => console.log(pos));

const whereAmI = function () {
    document.querySelector('.countries').innerHTML = "";
    getPosition()
      .then(pos => {
        return fetch(`https://geocode.xyz/${pos.coords.latitude},${pos.coords.longitude}?geoit=json`);
      })
      .then(res => {
        if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log(`You are in ${data.city}, ${data.country}`);
  
        return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
      })
      .then(res => {
        if (!res.ok) throw new Error(`Country not found (${res.status})`);
  
        return res.json();
      })
      .then(data => renderCountry(data[0]))
      .catch(err => console.error(`${err.message}`));
  };
  
document.querySelector('.btn-country').addEventListener('click', whereAmI);

//CHOOSE A COUNTRY DIRECTLY:
document.querySelector('#submit').addEventListener('click', function(){
    document.querySelector('.countries').innerHTML = "";
    var choosenCountry = document.querySelector('#choosenCountry').value;
    getCountryData(choosenCountry);
})