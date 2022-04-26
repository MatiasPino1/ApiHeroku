const notNumber = (id, next) => {
if(isNaN(Number(id)) || Number(id) < 1){
    let error = new Error("Debe escribir un numero entero positivo mayor a 0")
    error.status=400
    next(error)
    return true //manda el error al handle errors con el status 400 y con un true para que no siga la linea de codigo del controlador.
}else {
    return false
}
}

module.exports=notNumber



