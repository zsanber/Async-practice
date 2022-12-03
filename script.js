'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
//AJAX calls
///////////////////////////////////////

//oldschool way

const getCountryData = function(country) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
    request.send();

    request.addEventListener('load', function(){
        //console.log(this.responseText);

        const [data] = JSON.parse(this.responseText);  //eq. const data = JSON.parse(this.responseText).data
        console.log(data);
        //console.log(data.currencies.USD.name) 
        //console.log(data.currencies.USD.symbol) 
        //console.log(data.currencies[Object.keys(data.currencies)[0]])
        //console.log(data.currencies[object.keys(Object.values(data.currencies)[0])[0]])


        const html = `
        <article class="country">
            <img class="country__img" src="${data.flags.png}" />
            <div class="country__data">
                <h3 class="country__name">${data.name.official}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(+data.population/1000000).toFixed(1)} people</p>
                <p class="country__row"><span>🗣️</span>${data.languages[Object.keys(data.languages)[0]]}</p>
                <p class="country__row"><span>💰</span>${2}</p>
            </div>
        </article>
    `;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;

    })
}

getCountryData('hungary');
getCountryData('usa');