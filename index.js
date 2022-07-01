/*
let cantidadNotas = parseInt(prompt('Igresa la cantidad de notas para calcular el promedio'))
let valorTotal = 0

for(let i = 1; i <= cantidadNotas; i++){
    let notas = parseFloat(prompt('Nota ' + i ))
    valorTotal = valorTotal + notas
}

let promedio = valorTotal / cantidadNotas

alert(promedio)
*/

function crearNota(n) {
    if (n > 5) {
        alert('No puedes crear más de 5 notas al mismo tiempo');
    } else {

        class Notas {
            constructor(t, d) {
                this.titulo = t
                this.descripcion = d
            }
        }

        for (let i = 0; i < n; i++) {
            let titulo = prompt(`Título de la nota ${i + 1}`)
            let descripcion = prompt(`Descripción de la nota ${i + 1}`)
            const nota = new Notas(titulo, descripcion)
            arrayNotas.push(nota)
            console.log(`titulo:${arrayNotas[i].titulo}  
Descripción:${arrayNotas[i].descripcion}`)
    }
    }
    agregar()
}

function crearEvento(e) {
    if (e > 5) {
        alert('No puedes crear más de 5 eventos al mismo tiempo');
    } else {
        class Eventos {
            constructor(t, d, f) {
                this.titulo = t
                this.descripcion = d
                this.fecha = f
            }
        }

        for (let i = 0; i < e; i++) {
            let titulo = prompt(`Título del evento ${i + 1}`)
            let descripcion = prompt(`Descripción del evento ${i + 1}`)
            let fecha = prompt(`Fecha del evento ${i + 1}`)
            const evento = new Eventos(titulo, descripcion, fecha)
            arrayEvento.push(evento)  
            console.log(`titulo:${arrayEvento[i].titulo}  
Descripción:${arrayEvento[i].descripcion}  
Fecha:${arrayEvento[i].fecha}`)
        }
    }
    agregar()
}

function buscador() {

    if(arrayEvento.length != 0 || arrayNotas.length != 0){
        let buscar = prompt('buscar una nota/evento por su título')
        let resultado = []

        let resultadoNotas = arrayNotas.filter(titulosBusqueda => titulosBusqueda.titulo == buscar) 
        if(resultadoNotas.length != 0){
            resultado.push(resultadoNotas)
        }

        let resultadoEventos = arrayEvento.filter(titulosBusqueda => titulosBusqueda.titulo == buscar) 
        if(resultadoEventos.length != 0){
            resultado.push(resultadoEventos)
        }

        if(resultado.length > 0){
            resultado.forEach(e => {
                e.forEach(e => console.log(e))
            })    
        }else{
            alert(`No se encontro nada con ${buscar}`)
        }
    }else{
        alert(`No tiene notas o eventos para buscar`)
    }

    agregar()
}

function agregar() {
    do {
        crear = parseInt(prompt(`¿Crear nota o evento?
1 - Crear nota
2 - Crear evento
3 - Buscar nota/evento
4 - Salir`))
    } while (crear != 1 && crear != 2 && crear != 3 && crear != 4);

    switch (crear) {
        case 1:
            let cantidadNotas = parseInt(prompt('¿cuantas notas quieres crear?'))
            crearNota(cantidadNotas)
            break;
        case 2:
            let cantidadEvento = parseInt(prompt('¿cuantos eventos quieres crear?'))
            crearEvento(cantidadEvento)
            break;
        case 3:
            buscador()
            break;
        default:
            break;
    }
}



let crear = 0
let arrayNotas = []
let arrayEvento = []

agregar()
