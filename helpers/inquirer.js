const inquirer = require('inquirer');
const { validate } = require('uuid');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: ` ${'1.'.green} Buscar ciudad`
            }, 
            {
                value: 2,
                name: `${'2.'.green} Historial`
            }, 
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
]

const inquirerMenu = async () => {
    console.clear();
    console.log('==================================='.rainbow);
    console.log('  Seleccione una opción del menu'.white);
    console.log('===================================\n'.rainbow);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
}

const pausa = async() => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `\nPresione ${'ENTER'.magenta} para continuar \n`
        }
    ]

    await inquirer.prompt(question);
}

const leerInput = async( message ) => {
    const question  = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor'                    
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;

}

const listarLugares = async( lugares = []) => {
    const choices = lugares.map( (lugar, i) => {
        const idx = `${ i + 1 }.`.green;
        return {
            value: lugar.id,
            name: `${ idx } ${ lugar.name }`
        }
    });

    choices.unshift({
        value: 0,
        name: '0'.green + ' Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccionar',
            choices
        }
    ]
    const { id } = await inquirer.prompt(preguntas);
    return id;
}

const confirmar = async( mensaje ) => {
    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            mensaje
        }
    ];

    const { ok } = await inquirer.prompt(pregunta);
    return ok;

}

const mostrarHistorial = async( tareas = []) => {
    // const choices = tareas.map( (tarea, i) => {
    //     const idx = `${ i + 1 }.`.green;
    //     return {
    //         value: tarea.id,
    //         name: `${ idx } ${ tarea.desc }`,
    //         checked: ( tarea.completadoEn ? true : false)
    //     }
    // });

    const pregunta = [
        {
            type: 'list',
            name: 'opcion',
            message: 'Selecciones',
            choices
        }
    ]
    // const { ids } = await inquirer.prompt(pregunta);
    return pregunta;
}

module.exports = {
    confirmar,
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    mostrarHistorial
}