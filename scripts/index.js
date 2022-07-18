
const OPCIONES_AGREGAR = document.querySelector('#agregarOpciones')
const BUSCADOR = document.querySelector('#buscador')
const FORM_BUSCADOR = document.querySelector('#formBuscador')
const CONTENEDOR_RESULTADO = document.querySelector('#contenedorResultados')

const CALENDARIO = document.querySelector('#calendario')
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

document.onkeydown = e =>{
    if (e.altKey == true && e.keyCode == 78) {
        window.location.href = "#crearNotaNueva"
    } else if ( e.altKey == true && e.keyCode == 69) {
        window.location.href = "#crearEventoNuevo"
        return false
    }else if(e.keyCode == 27){
        window.location.href = "#"
    }

}
document.onclick = e => {
    if(e.target.id == 'agregar'){
        OPCIONES_AGREGAR.style.display = "block"
    }else{
        OPCIONES_AGREGAR.style.display = "none"
    }
}

OPCIONES_SELECCIONAR.onclick = e =>{
    CATEGORIA_EVENTO.value = e.target.value 
    OPCIONES_SELECCIONAR.style.pointerEvents = 'none'
    setTimeout(() =>{
        OPCIONES_SELECCIONAR.style.pointerEvents = 'all'
    },100)
}
FORM_CREAR_NOTA.onsubmit = e => {
    e.preventDefault()

    let tituloNota = document.querySelector('#tituloNota').value
    let descripcionNota = document.querySelector('#descripcionNota').value

    if(tituloNota == '' && descripcionNota == ''){
        notificacion('La nota debe tener título o descripción')
    }else {
        let id = JSON.parse(localStorage.getItem('nota'))
        if(id != null){
            id = 'n'+id.length
        }else{
            id = 'n0'
        }
        let datosNota = [tituloNota, descripcionNota,id]
        crearNota(datosNota)
        document.querySelector('#formNota').reset()

        BTN_SECCION_NOTAS.onclick()
        location.href = '#notas'
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
    categoriaEvento.forEach(e => {
        if(e[0] == CATEGORIA_EVENTO.value){
            categoriaEvento = e
        }
    }) 

    if(fechaEvento == '' || horaInicio == '' || horaFin == ''){
        notificacion('El evento debe tener fecha y hora de cuendo será')
    }else {
        if(tituloEvento == ''){
            tituloEvento = '(Sin título)'
        }
        let id = JSON.parse(localStorage.getItem('evento'))
        if(id != null){
            id = 'e'+id.length
        }else{
            id = 'e0'
        }
        let datosEvento = [tituloEvento,descripcionEvento,fechaEvento,horaInicio,horaFin,categoriaEvento,id]
        crearEvento(datosEvento)
        document.querySelector('#formEvento').reset()
        
        BTN_SECCION_EVENTOS.onclick()
        location.href = '#eventos'
    }

}
BTN_SECCION_EVENTOS.onclick = () => {

    BTN_SECCION_EVENTOS.className = 'seccionActual'
    BTN_SECCION_NOTAS.className = ''
    SECCION_EVENTOS.style.display = 'block'
    SECCION_NOTAS.style.display = 'none' 
    CALENDARIO.className = 'calendarioVisible'
    mostrarEventos()
}
BTN_SECCION_NOTAS.onclick = () => {

    BTN_SECCION_NOTAS.className = 'seccionActual'
    BTN_SECCION_EVENTOS.className = ''
    SECCION_NOTAS.style.display = 'block'
    SECCION_EVENTOS.style.display = 'none'
    CALENDARIO.className = 'calendarioOculto'
    mostrarNotas()
}
FORM_BUSCADOR.onsubmit = e => {
    e.preventDefault()
    let buscar = BUSCADOR.value.trim().toLowerCase()
    if(buscar != ''){
        buscador(buscar)
    }else{
        CONTENEDOR_RESULTADO.innerHTML = '<span>El resultado de la busqueda se verá ahí</span>'
    }
}
BUSCADOR.onkeyup = () => {
    let buscar = BUSCADOR.value.trim().toLowerCase()

    if(buscar != ''){
        buscador(buscar)
    }else{
        CONTENEDOR_RESULTADO.innerHTML = '<span>El resultado de la busqueda se verá ahí</span>'
    }
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

        notas.forEach(e => {
            CONTENEDOR_NOTAS.innerHTML += `
            <div class="nota ${e.id}">
                <h2>${e.titulo}</h2>
                <div class="imgNota"></div>
                <p>${e.descripcion}</p>
                <div class="eliminar ${e.id}">
                    <span>Eliminar</span>
                    <i class="fas fa-times"></i>
                </div>
            </div>
            `
        })
        SECCION_NOTAS.append(CONTENEDOR_NOTAS)
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
            <div class="evento ${e.id}">
                <h2>${e.titulo}</h2>
                <p>${e.descripcion}</p>
                <span class="indicadorTipoEvento" style="background:${e.categoria[1]};">${e.categoria[0]}</span>
                <span class="horaEvento">${e.horaInicio} - ${e.horaFin}<!--<i class="far fa-bell"></i>--></span>
                <div class="eliminar ${e.id}">
                    <span>Eliminar</span>
                    <i class="fas fa-times"></i>
                </div>
            </div>
            `
        })
        SECCION_EVENTOS.append(CONTENEDOR_EVENTOS)
    }
    
}
function buscador(datosBuscar){
    CONTENEDOR_RESULTADO.innerHTML = ''
    let resultado = []

    let resultadoNotas = notas.filter(e => e.titulo.toLowerCase().includes(datosBuscar)) 
    if(resultadoNotas.length != 0){
        resultado.push(resultadoNotas)
    }

    let resultadoEventos = eventos.filter(e => e.titulo.toLowerCase().includes(datosBuscar)) 
    if(resultadoEventos.length != 0){
        resultado.push(resultadoEventos)
    }

    if(resultado.length > 0){
        resultado.forEach(e => {
            e.forEach(e => CONTENEDOR_RESULTADO.innerHTML += `<div class="resultadoBusqueda" id="${e.id}">${e.titulo}</div>`)
        })    
    }else{
        CONTENEDOR_RESULTADO.innerHTML = `<span>No se encontró nada con "${datosBuscar}"</span>`
    }
}
function notificacion(notificar){
    const NOTIFICACION = document.querySelector('#notificacion')
    NOTIFICACION.style.bottom = '40px'
    NOTIFICACION.innerText = notificar

    setTimeout(() =>{
        NOTIFICACION.style.bottom = '-110px'
        NOTIFICACION.innerText = ''
    },2000)
}
