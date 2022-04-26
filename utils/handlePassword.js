const bcrypt= require("bcrypt");
const saltRounds= 10;  //para que en caso de que se creen 2 contraseñas iguales no se encripten exactamente iguales.

const encrypt= async(passwordPlain)=> {
return await bcrypt.hash(passwordPlain,saltRounds)
}

const compare=async(passwordPlain,hashedPassword)=>{
return await bcrypt.compare(passwordPlain,hashedPassword)
}
module.exports={encrypt,compare}
