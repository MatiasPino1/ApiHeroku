const {tokenVerify} = require("../utils/handleJWT")
const isAuth = async(req,res,next)=>{
    try {
        if(!req.headers.authorization){  //en caso de que no se ingrese ningun valor en el header crea error 401.
            let error=new Error("No token");
            error.status = 401;
            return next(error)
        }
        
         const token = req.headers.authorization.split(" ").pop()//si viene un token se lo separa del bearer
         const tokenStatus=await tokenVerify(token) //se lo verifica
        if(tokenStatus instanceof Error){ //si el token al ser comparado con la contraseña demuestra no ser original devuelve un error.
            error.message="Token expired";
            error.status= 403;
            return next(error)
        }
        req.user= tokenStatus     //si el token es original lo asigna al req.token y lo devuelve
        next()
    } catch (error) {
       error.message="Internal Error Server"     //si hay problema con el servidor se comunica.
       return next(error)

    }
}

module.exports={isAuth}