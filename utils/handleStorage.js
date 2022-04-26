const multer= require("multer"); //dependencia para subir fotos
const storage= multer.diskStorage({//configuramos donde van a estar guardados los archivos y lo guardamos en un disco
    destination:(req, file , callback)=>{
        const pathStorage = `${__dirname}/../storage`;
        callback(null,pathStorage)
    },
    filename:(req,file,callback)=>{
        const ext= file.originalname.split(".").pop() //contiene solo la extension del archivo mandado por el usuario,utilizando primero split para separar las palabras por un "." y meterla en un arreglo y luego solo mostrar la ultima palabra del arreglo con el metodo pop.
        const filename= `file_${Date.now()}.${ext}`//Utilizamos la clase date y la funcion now para que nos de un nombre que nunca se va a repetir puesto a que el ahora nunca se repite.
        callback(null,filename) //retornamos el archivo con un nombre distinto por mas que dos usuarios hayan pensado el mismo nombre y ademas le contatenamos la extension.
    } 
}) 
//middleware
const uploadFile=multer({ storage })
module.exports=uploadFile

