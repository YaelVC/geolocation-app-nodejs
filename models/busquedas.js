const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './database/data.json';

    constructor() {
        this.leerBD();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsWeather() {
        return {
            'appid': process.env.OPEN_WEATHER_KEY,
            'units': 'metric',
            'lang' : 'es'
        }
    }

    async ciudad(city = '') {
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get();
            
            return resp.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }) );

        } catch (error) {
            console.log('No se encontró la ciudad que escribió');
            return [];
        }
    }

    async climaLugar( lat, lon ) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: this.paramsWeather
            })

            const resp = await instance.get();
            const { weather, main } = resp.data
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };
            
        } catch (error) {
            console.log(error);
          
        }

    }

    agregarHistorial( lugar='' ) {
        if ( this.historial.includes(lugar.toLocaleLowerCase() )) {
            return;
        }
        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify(payload) )
    }

    leerBD() {
        if ( !fs.existsSync(this.dbPath)) {
            return null
        } else {
            const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
            const data = JSON.parse(info);
            this.historial = [...data.historial];
        }
    }
}

module.exports = Busquedas;