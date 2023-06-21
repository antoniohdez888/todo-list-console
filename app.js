import { inquirerMenu, pausa, leerInput, listarTareasBorrar, confirmar, listarTareasChecklist } from './helpers/inquirer.js';
import { Tareas } from './models/tareas.js';
import { guardarDB, leerDB } from './helpers/guardarArchivo.js';

console.clear();

const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB(); 

    if( tareasDB ){
    
        tareas.cargarTareasFromArr( tareasDB );
    }

    do {
        // Esta función imprime el menú y retorna la opción que selecciona el usuario
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                // crear tarea
                const desc = await leerInput( 'Descripción: ' );
                tareas.crearTarea( desc );
            break;

            case '2':
                // listar tareas
                tareas.listadoCompleto();
            break;

            case '3':
                // listar tareas completadas
                tareas.listarPendientesCompletadas();
            break;

            case '4':
                // listar tareas pendientes
                tareas.listarPendientesCompletadas(false);
            break;

            case '5':
                // Completar tareas
                const ids = await listarTareasChecklist( tareas.listadoArr )
                tareas.toggleCompletadas( ids );
            break;

            case '6':
                // Borrar tareas
                const id = await listarTareasBorrar( tareas.listadoArr );

                // si id es igual a 0 entonces cancela la operación
                if( id !== 0 ){

                    // preguntar si esta seguro de borrar la tarea
                    const ok = await confirmar('¿Está seguro?');
                    if( ok ){
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada'.yellow);
                    } 
                }

            break;
        
            default:
            break;
        }

        guardarDB( tareas.listadoArr );

        await pausa();

    } while ( opt !== '0' );

}

main();