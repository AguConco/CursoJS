
const FECHA = new Date();

const MES_CALENDARIO = document.querySelector('#mesCalendario')
const ANIO_CALENDARIO = document.querySelector('#anioCalendario')
const DIAS_SEMANA = document.querySelectorAll('.calendarioDiasSemana span')
const CALENDARIO = document.querySelector('.calendario')
const CALENDARIO_DIAS_NUMERO = document.querySelector('#calendarioDiasNumero')

let anio = FECHA.getFullYear()
let numeroMes = FECHA.getMonth()
let diasFeriados = []

feriados()

CALENDARIO.onclick = ({target}) => {
    if (target.id == 'mesAnterior') {
        numeroMes--
        if (numeroMes < 0) {
            numeroMes = 11
            anio--
        }
        if (anio < FECHA.getFullYear()) {
            anio = FECHA.getFullYear()
            numeroMes = 0
        }
        actualizarCalendario(numeroMes, anio)
    } else if (target.id == 'mesSiguiente') {
        numeroMes++
        if (numeroMes > 11) {
            numeroMes = 0
            anio++
        }
        actualizarCalendario(numeroMes, anio)
    } else if (target.id == 'volverHoy'){
        anio = FECHA.getFullYear()
        numeroMes = FECHA.getMonth()
        actualizarCalendario(numeroMes, anio)
    }
}

function actualizarCalendario(mes, anio) {

    const MES_LARGO = new Intl.DateTimeFormat('es', { month: 'long' }).format(new Date(anio, mes))
    const PRIMER_DIA_MES = new Date(anio, mes, 0).getDay()
    const CANTIDAD_DIAS = new Date(anio, mes + 1, 0).getDate()
    CALENDARIO_DIAS_NUMERO.innerHTML = ''
    
    for (let i = 0; i < DIAS_SEMANA.length; i++) {
        i == PRIMER_DIA_MES ? DIAS_SEMANA[i].className = "diaActual" : DIAS_SEMANA[i].className = ""
    }

    for (let i = 1; i <= CANTIDAD_DIAS; i++) {
        let div = document.createElement('div') 
        div.className= 'divDia'

        if (i == 1) {
            div.style.gridColumnStart = PRIMER_DIA_MES + 1
        }
        if (i == FECHA.getDate() && mes == FECHA.getMonth() && anio == FECHA.getFullYear()) {
            div.className = 'divDia diaActual'
        }
        mostrarFeriados(i,mes,div)
        div.innerHTML += i
        CALENDARIO_DIAS_NUMERO.append(div)
    }

    MES_CALENDARIO.innerText = MES_LARGO
    ANIO_CALENDARIO.innerText =  anio
}

async function feriados(){
    let respuesta 
    try {
        respuesta = await fetch('./feriadosArgApi.json')
        diasFeriados = await respuesta.json()

    } catch (error) {
        console.log(error)
    }

}

function mostrarFeriados(i,m,d){
    diasFeriados.forEach(e => {
        if(i == e.dia && m == e.mes){
            d.innerHTML += `
            <div class="contenedorEventosDias">
                <span style="background:${e.tipo[1]};"><h4>${e.evento} </h4>${e.tipo[0]}</span>
            </div>`
        }
    })
}
