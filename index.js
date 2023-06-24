require ('dotenv').config();

const { leerInput, 
        inquirerMenu, 
        pausa, 
        listarLugares,
        mostrarHistorial
} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

require('colors')

const main = async() => {
    let opt;
    const busquedas = new Busquedas();

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const terminoBusqueda = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad( terminoBusqueda );

                // Sleccionar el lugar
                const id = await listarLugares(lugares);
                if ( id !== 0 ) {
                    const { name, lat, lng } = lugares.find( l => l.id === id );
                    // Clima
                    const clima = await busquedas.climaLugar(lat, lng);

                    // Agregar en la BD
                    busquedas.agregarHistorial(name);
    
                    // Mostrar resultados
                    console.log('\nInformación de la ciudad\n'.rainbow);
                    console.log('Ciudad:', name.green );
                    console.log('Lat:', lat );
                    console.log('Lng:', lng );
                    console.log('Temperatura:', clima.temp, '°C');
                    console.log('Mínima:', clima.min, '°C' );
                    console.log('Máxima:', clima.max, '°C' ); 
                    console.log('¿Como esta el clima?: ', clima.desc);    
                                        
                }
            break;
    
            case 2: 
                busquedas.historialCapitalizado.forEach( (place, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ place }`);
                })
                // mostrarHistorial(historial);
               
            break;
        }
        if ( opt !== 0 ) await pausa();
    } while (opt !== 0);

}

main();
