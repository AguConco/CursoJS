
let descripcionEditar = document.querySelector('#descripcionNotaEditar')
let tituloEditar = document.querySelector('#tituloNotaEditar')

tituloEditar.onkeyup = () =>{
    editarNota()
}
descripcionEditar.onkeyup = () =>{
    editarNota()
}

function detalleNotas(){
    const NOTAS = document.querySelectorAll('.nota')

    NOTAS.forEach(e => {
        e.onclick = ({target}) =>{
            let notas = JSON.parse(localStorage.getItem('nota'))
            sessionStorage.setItem('nota', target.id)

            let resultado = notas.find(({id}) => id == target.id)
            if(target.className == 'nota'){
                window.location.href = "#detalleNota"
                tituloEditar.value = resultado.titulo
                descripcionEditar.innerHTML = resultado.descripcion
            }
        }
    })
}
function editarNota(){
    let idNotaEditar = sessionStorage.getItem('nota')
    let notasGuardadas = JSON.parse(localStorage.getItem('nota')) 
    for(let i = 0; i < notasGuardadas.length; i++){
        if(notasGuardadas[i].id == idNotaEditar){
            notasGuardadas.splice(i,1,{
                titulo: tituloEditar.value,
                descripcion: validarExpresiones(descripcionEditar.innerText),
                id: idNotaEditar
            })
            let notasEditadas = JSON.stringify(notasGuardadas)
            localStorage.setItem('nota', notasEditadas)
            mostrarNotas()
        }
    }
}