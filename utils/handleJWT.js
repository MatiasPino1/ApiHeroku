const jwt=require("jsonwebtoken")
const jwt_key=process.env.jwt_secret  //contraseña que firma los tokens para que sean originales.

const tokenSign = async(user, time)=> { //metodo para firmar los tokens,se le pasa el payload y el tiempo de expiracion de token.
    return  jwt.sign(user, jwt_key, {expiresIn:time}) //devuelve el token firmado utilizando el payload,la contraseña y el tiempo de exp.
}


const tokenVerify= async(token)=>{  //metodo para verificar token,se le pasa el token como parametro
    try {
return jwt.verify(token,jwt_key)          //retorna el token verificado,pasandole el token sin bearer y la contraseña.
    } catch (error) {
        return error          //error en caso de que el token no sea original.
    }
}

module.exports = {tokenSign,tokenVerify}