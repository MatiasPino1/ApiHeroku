require("dotenv").config()
require("./db/config")
const express = require("express")
const hbs = require("express-handlebars") //requiero hbs para renderizar el front end de reseteo de password.
const path =  require("path")//path para marcarle el directorio de los archivos.
const PORT= process.env.PORT
const server=express()
server.use(express.json()) 
server.use(express.urlencoded({ extended:true})) 
server.use(express.static("storage")) //se le asigna a la carpeta storage el directorio para subir archivos staticos como por ej fotos.

//archivos staticos de bootstrap
server.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))//para utilizar archivos de css y js se crea un atajo.(clase 9 2:51:00)
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
//handlebars
server.set("view engine","hbs")//seteo el motor de plantillas de hbs.
server.set("views",path.join(__dirname, "./views"))//se le indica donde estaran las vistas
server.engine("hbs", hbs.engine({ extname: "hbs" }))


server.listen(process.env.PORT,(err)=>{
    err? console.log(`Hubo un error:${err}`) : console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
//welcome endpoint
server.get("/",(req,res)=>{
    const content=`<h1>Nuestra API con Express</h1>
    <pre>Bienvenidos a nuestra API construida con Node Js y el framework Express</pre>`
    res.send(content)
})
//Enrutador de users.

server.use("/users", require("./users/usersRoute"))

//Enrutador de posts para dejar hacer una accion solo en caso de que tenga token.
server.use("/posts",require("./posts/postsRoute"))


//Cualquier ruta distinta (error 404) // cuando se pone un .use sin un directorio quiere decir que agarra cualquier ruta que no sea ninguna registrada.
server.use((req,res,next)=>{//Controlador que recibe errores 404 y que crea la instancia de tipo error en caso de que sea un error que no se atajo en el manejador de errores.
    let error = new Error("Resource not found") //se crea una variable que es una instancia de la clase Error(al igual que se crea automaticamente en el catch de usermodel.) y se le asigna un mensaje.
    error.status = 404 //se le asgina error.status 404 al objeto del tipo Error.
    next(error)//procede a bajar en el codigo para seguir con la logica siguiente.
})
//Manejador de errores
server.use((error,req,res,next)=>{//Controlador que recibe todas las intancias de tipo Error que hayan sido creada en el userModel.
if(!error.status){//Se le asigna el estado de error 500.
error.status=500
}
res.status(error.status)//sin embargo si entro el error 404 a esta funcion,va a esquivar el IF y el estado de error en esta linea de codigo va a variar entre 404 o 500.
res.json({status:error.status,message:error.message})//se muestra el estado de error (500 o 404) y el mensaje de respectivo numero.
})







