'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');



///////////////////////////////////////
//AJAX calls
///////////////////////////////////////


//oldschool way - XMLHttpRequest

/* const getCountryData = function(country) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
    request.send();

    request.addEventListener('load', function(){
        //console.log(this.responseText);

        const [data] = JSON.parse(this.responseText);  //eq. const data = JSON.parse(this.responseText).data
        console.log(data);

        const html = `
        <article class="country">
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

    })
}

getCountryData('hungary');
getCountryData('usa');
getCountryData('germany'); */



///////////////////////////////////////
//CALLCACK HELL 
///////////////////////////////////////

const renderCountry = function (data, className = '') {
    console.log(data);
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
    
}
/*
const getCountryAndNeighbour = function(country) {

    //AJAX call country 1
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
    request.send();

    request.addEventListener('load', function(){
        const [data] = JSON.parse(this.responseText);
        //console.log(data);

        //render country
        renderCountry(data)

        //get neighbour country 2
        const [neighbour] = data.borders;
        if(!neighbour) return;

        //AJAX call country 2
        const request2 = new XMLHttpRequest();
        request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
        request2.send();

        request2.addEventListener('load', function(){
            //console.log(this.responseText)
            const [data2] = JSON.parse(this.responseText);
            //console.log(data2)

        renderCountry(data2, 'neighbour')
        })
    })
}
 
getCountryAndNeighbour('usa');
*/



///////////////////////////////////////
//FETCH  (.then)
///////////////////////////////////////

/* longer version
const request = fetch('https://restcountries.com/v3.1/name/hungary');

const getCountryData = function(country) {
    fetch(`https://restcountries.com/v3.1/name/${country}`) //fetch-returning promise  
    .then(function(resp){ //we handle the promise with then
        console.log(resp)
        return resp.json();
    })
    .then(function(data){ //we got acces to the
        console.log(data)
    })
}
getCountryData('hungary')*/


const getCountryData = function(country) {

    fetch(`https://restcountries.com/v3.1/name/${country}`) //fetch-returning promise 
        .then(res => res.json()) //the response will be transformed to JSON, return promise
        .then(data => {
            renderCountry(data[0]); //we render it to the DOM
            const neighbours = data[0].borders;

            if (!neighbours || neighbours.length == 0) return;

            neighbours.forEach(neighbour => {
                fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)
                    .then(response => response.json())
                    .then(data => {
                        renderCountry(data[0], 'neighbour')
                    });
            });
        })    
};

const countriesChoose = function (choosenCountry) {
    getCountryData(choosenCountry) 
}

getCountryData('hungary') 