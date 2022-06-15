
let cantidadNotas = parseInt(prompt('Igresa la cantidad de notas para calcular el promedio'))
let valorTotal = 0

for(let i = 1; i <= cantidadNotas; i++){
    let notas = parseFloat(prompt('Nota ' + i ))
    valorTotal = valorTotal + notas
}

let promedio = valorTotal / cantidadNotas

alert(promedio)