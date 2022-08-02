
const OPCIONES_AGREGAR = document.querySelector('#agregarOpciones')
const BUSCADOR = document.querySelector('#buscador')
const FORM_BUSCADOR = document.querySelector('#formBuscador')
const CONTENEDOR_RESULTADO = document.querySelector('#contenedorResultados')

const SECCION_CALENDARIO = document.querySelector('#calendario')
const FORM_CREAR_NOTA = document.querySelector('#formNota')
const FORM_CREAR_EVENTO = document.querySelector('#formEvento')
const CATEGORIA_EVENTO = document.querySelector('#categoriaEvento')
const OPCIONES_SELECCIONAR = document.querySelector('#opcionesCategorias')

const CONTENEDOR_NOTAS = document.createElement('div')
const CONTENEDOR_EVENTOS = document.createElement('div')
const NADA_CREADO = document.createElement('div')

const SECCION_NOTAS = document.querySelector('#notas')
const SECCION_EVENTOS = document.querySelector('#eventos')

const BTN_SECCION_EVENTOS = document.querySelector('#seccionEventos')
const BTN_SECCION_NOTAS = document.querySelector('#seccionNotas')

let notas = JSON.parse(localStorage.getItem('nota')) || []
let eventos = JSON.parse(localStorage.getItem('evento')) || []

CONTENEDOR_NOTAS.id = 'contenedorNotas'
CONTENEDOR_EVENTOS.id = 'contenedorEventos'
NADA_CREADO.id = 'nadaCreado'

mostrarNotas()

document.onkeydown = ({altKey,keyCode}) =>{
    if (altKey == true && keyCode == 78) {
        window.location.href = "#crearNotaNueva"
    } else if (altKey == true && keyCode == 69) {
        window.location.href = "#crearEventoNuevo"
        return false
    }else if(keyCode == 27){
        window.location.href = "#"
    }

}
document.onclick = ({target}) => {
    target.id == 'agregar' ? OPCIONES_AGREGAR.style.display = "block": OPCIONES_AGREGAR.style.display = "none"
}

OPCIONES_SELECCIONAR.onclick = ({target}) =>{
    CATEGORIA_EVENTO.value = target.value 
    OPCIONES_SELECCIONAR.style.pointerEvents = 'none'
    setTimeout(() =>{
        OPCIONES_SELECCIONAR.style.pointerEvents = 'all'
    },100)
}
FORM_CREAR_NOTA.onsubmit = e => {
    e.preventDefault()

    let tituloNota = document.querySelector('#tituloNota').value
    let descripcionNota = document.querySelector('#descripcionNota').value

    descripcionNota = validarExpresiones(descripcionNota)

    if(tituloNota.trim() == '' && descripcionNota.trim() == ''){
        notificacion('La nota debe tener título o descripción')
    }else {
        let nuevoId = 'N-' + Math.random().toString(36).substr(2)          
        let datosNota = [tituloNota, descripcionNota,nuevoId]
        crearNota(datosNota)
        FORM_CREAR_NOTA.reset()

        let ordenNotas = localStorage.getItem('ordenNotas');
        ordenNotas = ordenNotas ? ordenNotas.split('|') : []
        ordenNotas.unshift(nuevoId)
        localStorage.setItem('ordenNotas', ordenNotas.join('|'));

        BTN_SECCION_NOTAS.onclick()
        window.location.href = '#notas'
    }
}
FORM_CREAR_EVENTO.onsubmit = e => {
    e.preventDefault()

    let tituloEvento = document.querySelector('#tituloEvento').value
    let descripcionEvento = document.querySelector('#descripcionEvento').value
    let fechaEvento = document.querySelector('#fechaEvento').value
    let horaInicio = document.querySelector('#horaInicio').value
    let horaFin = document.querySelector('#horaFin').value

    let categoriaEvento = [
        ['Trabajo', '#cd0101'],
        ['Personal', '#7800e3'],
        ['Cumpleaños', '#40c100'],
        ['Estudios', '#1872fa']
    ]
    for(let e of categoriaEvento){
        if(e[0] == CATEGORIA_EVENTO.value){
            categoriaEvento = e
            break
        }else{
            categoriaEvento = [[]]
        }
    }

    if(fechaEvento == '' || horaInicio == '' || horaFin == ''){
        notificacion('El evento debe tener fecha y hora de cuando será')
    }else {
        if(tituloEvento == ''){
            tituloEvento = '(Sin título)'
        }
        let nuevoId = 'E-' + Math.random().toString(36).substr(2)          

        let datosEvento = [tituloEvento,descripcionEvento,fechaEvento,horaInicio,horaFin,categoriaEvento,nuevoId]
        crearEvento(datosEvento)
        FORM_CREAR_EVENTO.reset()
        BTN_SECCION_EVENTOS.onclick()
        window.location.href = '#eventos'
    }

}
BTN_SECCION_EVENTOS.onclick = () => {

    BTN_SECCION_EVENTOS.className = 'seccionActual'
    BTN_SECCION_NOTAS.className = ''
    SECCION_NOTAS.style.display = 'none'
    SECCION_EVENTOS.style.display = 'block'
    SECCION_CALENDARIO.className = 'calendarioVisible'
    mostrarEventos()
    actualizarCalendario(numeroMes,anio)
}
BTN_SECCION_NOTAS.onclick = () => {

    BTN_SECCION_NOTAS.className = 'seccionActual'
    BTN_SECCION_EVENTOS.className = ''
    SECCION_NOTAS.style.display = 'block'
    SECCION_EVENTOS.style.display = 'none'
    SECCION_CALENDARIO.className = 'calendarioOculto'
    mostrarNotas()
}
FORM_BUSCADOR.onsubmit = e => {
    e.preventDefault()
    let buscar = BUSCADOR.value.trim().toLowerCase()
    buscar != '' ? buscador(buscar) : CONTENEDOR_RESULTADO.innerHTML = '<span>El resultado de la busqueda se verá ahí</span>'
}
BUSCADOR.onkeyup = () => {
    let buscar = BUSCADOR.value.trim().toLowerCase()
    buscar != '' ? buscador(buscar) : CONTENEDOR_RESULTADO.innerHTML = '<span>El resultado de la busqueda se verá ahí</span>'
}

function crearNota(datosNota) {
    class Notas {
        constructor(datos) {
            this.titulo = datos[0]
            this.descripcion = datos[1]
            this.id = datos[2]
        }
    }
    const nota = new Notas(datosNota)
    guardar(['nota',[nota]])
    notificacion('¡Nota creada con éxito!')
}
function crearEvento(datosEvento) {
    class Eventos {
        constructor(datos) {
            this.titulo = datos[0]
            this.descripcion = datos[1]
            this.fecha = datos[2]
            this.horaInicio = datos[3]
            this.horaFin = datos[4]
            this.categoria = datos[5]
            this.id = datos[6]
        }  
    }
    const evento = new Eventos(datosEvento)
    guardar(['evento',[evento]])
    notificacion('¡Evento creado con éxito!')
}
function guardar(datosGuardar){
    let notaEventoJson = JSON.stringify(datosGuardar[1])

    if(localStorage.getItem(datosGuardar[0]) != null){

        let notaEventosGuardados = JSON.parse(localStorage.getItem(datosGuardar[0]))

        notaEventosGuardados.forEach( e => {
            datosGuardar[1].push(e)
        })
        notaEventoJson = JSON.stringify(datosGuardar[1])

        localStorage.setItem(datosGuardar[0],notaEventoJson)
    }else{
        localStorage.setItem(datosGuardar[0],notaEventoJson)
    }
}
function mostrarNotas(){
    notas = JSON.parse(localStorage.getItem('nota')) || []
    CONTENEDOR_NOTAS.innerHTML = ''

    if(notas.length == 0){
        CONTENEDOR_NOTAS.remove()

        NADA_CREADO.innerHTML = `
        <h4>No hay <span>notas</span> creadas</h4>
        <p>Puedes crear una con el boton <span class="spanCrear">CREAR <i class="fas fa-plus"></i></span></p>
        `
        SECCION_NOTAS.append(NADA_CREADO)
    }else {
        NADA_CREADO.remove()

        let ordenNotas =  localStorage.getItem('ordenNotas');
        ordenNotas = ordenNotas ? ordenNotas.split('|') : [];
        ordenNotas.forEach(e => { 
            notas.forEach(j => {
                if(j.id == e){
                    CONTENEDOR_NOTAS.innerHTML += `
                    <div class="nota" id="${j.id}" data-id="${j.id}">
                        <h2>${j.titulo}</h2>
                        <p>${j.descripcion}</p>
                        <div class="eliminar">
                            <span>Eliminar</span>
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                    `
                }   
            })
        })
        SECCION_NOTAS.append(CONTENEDOR_NOTAS)
        const ELIMINAR = document.querySelectorAll('.eliminar')
        ELIMINAR.forEach(e => {
            eliminar(e)
        })
        detalleNotas()
    }
}
function mostrarEventos(){
    eventos = JSON.parse(localStorage.getItem('evento')) || []
    CONTENEDOR_EVENTOS.innerHTML = ''

    if(eventos.length == 0){
        CONTENEDOR_EVENTOS.remove()

        NADA_CREADO.innerHTML = `
        <h4>No hay <span>eventos</span> creados</h4>
        <p>Puedes crear uno con el boton <span class="spanCrear">CREAR <i class="fas fa-plus"></i></span></p>
        `
        SECCION_EVENTOS.append(NADA_CREADO)
    }else {
        NADA_CREADO.remove()
        eventos.forEach(e => {
            CONTENEDOR_EVENTOS.innerHTML += `
            <div class="evento" id="${e.id}">
                <h2>${e.titulo}</h2>
                <p>${descripcion.replace(/\n/g, "<br />")}</p>
                <span class="indicadorTipoEvento" style="background:${e.categoria[1]};">${e.categoria[0]}</span>
                <span class="horaEvento">${e.horaInicio} - ${e.horaFin}<!--<i class="far fa-bell"></i>--></span>
                <div class="eliminar">
                    <span>Eliminar</span>
                    <i class="fas fa-times"></i>
                </div>
            </div>
            `
        })
        SECCION_EVENTOS.append(CONTENEDOR_EVENTOS)
        const ELIMINAR = document.querySelectorAll('.eliminar')
        ELIMINAR.forEach(e => {
            eliminar(e)
        })
    }
    
}
function buscador(datosBuscar){
    CONTENEDOR_RESULTADO.innerHTML = ''
    let titulosABuscar = [...notas,...eventos]
    let resultado = titulosABuscar.filter(({titulo}) => titulo.toLowerCase().includes(datosBuscar)) 
    resultado.length > 0 ? resultado.forEach(e => {CONTENEDOR_RESULTADO.innerHTML += `<div class="resultadoBusqueda" id="${e.id}">${e.titulo}</div>`}) : CONTENEDOR_RESULTADO.innerHTML = `<span>No se encontró nada con "${datosBuscar}"</span>`

}
function notificacion(notificar){
    const NOTIFICACION = document.querySelector('#notificacion')
    let span = document.createElement('span')
    span.innerText = notificar
    NOTIFICACION.append(span)

    setTimeout(()=>{
        span.remove()        
    } , 2500)
}
function eliminar(eliminar){
    eliminar.onclick = () =>{
        let guardados = ''
        let identificador = eliminar.parentNode.id
        identificador.charAt(0) == 'E' ? guardados = 'evento' : guardados = 'nota'

        let eventoNota = JSON.parse(localStorage.getItem(guardados))        
        if(eventoNota != null){
            for(let i = 0; i < eventoNota.length; i++){
                if(identificador == eventoNota[i].id){
                    let tituloAEliminar = eventoNota[i].titulo || '(Sin título)'
                    eventoNota.splice(i,1)
                    let eventoNotaJson = JSON.stringify(eventoNota)
                    localStorage.setItem(guardados,eventoNotaJson)
                    guardados == 'evento' ? notificacion(`Evento "${tituloAEliminar}" eliminado`) : notificacion(`Nota "${tituloAEliminar}" eliminada`)
                    guardados == 'evento' ?  mostrarEventos() : mostrarNotas()
                }
            }
        }
    }
}
function validarExpresiones(descripcion){
    descripcion = descripcion.replace(/\n/g, " <br> ")

    let arrayDescripcion = descripcion.split(/\s+/g) 
    let expresion = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    descripcion = ''
    arrayDescripcion.forEach(e => { descripcion += e.replace(expresion,'<a rel="nofollow" target="_blank" href="mailto:'+e+'"> '+e+' </a>') + ' '});
    return descripcion
}