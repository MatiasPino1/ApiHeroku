const users=require("../db/config")
const { getAll, getOne,addOne,deleteUserById,patchUserById,loginUser} = require("./userModel")
const notNumber=require("../utils/notNumber")
const {encrypt,compare} = require("../utils/handlePassword")
const {matchedData}= require("express-validator")
const url= process.env.public_url
const {tokenSign, tokenVerify} = require("../utils/handleJWT") //importamos las funciones del jsonwebtoken para generar token de autorizacion.
const nodemailer= require("nodemailer")

const listAll=async(req,res,next)=>{                                          
const dbResponse= await getAll()
if(dbResponse instanceof Error)return next(dbResponse)//si la dbresponse  es una instancia del objeto tipo error va hacia el handle error del tipo 500.
const responseUser= dbResponse.map((elemento)=>{ //para mostrar solos los campos name email y file del array de cada user hacemos un map.
const filteredUser={
    name:elemento.name,
    email:elemento.email,
    file:elemento.file
  }
  return filteredUser
})
dbResponse.length ? res.status(200).json(responseUser) : next() //si la dbresponse viene un objeto vacio,entonces se debe considerar error aunque no haya sido creada una instancia del tipo error,por lo tanto va hacia el handle errors 404 que no pide un objeto de la instancia error para entrar.
}

const listOne=async(req,res,next)=>{      
  if(notNumber(req.params.id,next)){return} //retorna al principio de la funcion listOne a espera de otra request.                                                                                                                                                                      
  const dbResponse=await getOne(+req.params.id)     
  if(dbResponse instanceof Error)return next(dbResponse)
  
  if(!dbResponse.length){ //si al pedir por el usuario el objeto viene vacio mando un 404
    return next()
}
  const{ id, name, email, file} = dbResponse[0] //se crea una variable del usuario sin la password para mayor seguridad.
  const responseUser = {
    id,
    name,
    email,
    file
  }
  dbResponse.length ? res.status(200).json(responseUser) : next()                
 }                                                                                

 const register=async(req,res,next)=>{ 
 const cleanBody=matchedData(req.body)//Metodo de express validator para que solo deje pasar los datos que pueden entrar en la db y no dejar informacion que no es permitida(por ej crear una tabla de mas con info).
 const file =`${url}/${req.file.filename}`
 const hashedPassword=await encrypt(req.body.password)
 const dbResponse=await addOne({...req.body, password: hashedPassword,file:file})        
 if(dbResponse instanceof Error){ return next(dbResponse)}
 else{
 const user= {//se crea un objeto para el jwt,con el name y el email de la variable de express validator cleanBody.
  id: cleanBody.id,
  name: cleanBody.name,  
   email: cleanBody.email
 }
const token = await tokenSign(user,"1h") //se firma un token jwt.
res.status(201).json({message:"User created",JWT: token}) 
}
}
const login=async(req,res,next)=>{
  const dbResponse = await loginUser(req.body.email)
  if(!dbResponse.length) return next(); //si no esta en la db es un usuario no registrado por ende lo mandamos a un 404.
 if(await compare(req.body.password, dbResponse[0].password))//se compara la password que pasa el usuario con la password la hipotetica password de la db ya que puede ser incorrecta o si coincidir con la de la database,por eso se utiliza el metodo compare de bscrypt para desencriptar y comparar.
 {
  const user = {
    id: dbResponse[0].id,
    name: dbResponse[0].name,
    email: dbResponse[0].email
 }
const token = await tokenSign(user,"1h")
res.status(200).json({message:"User login",JWT: token})
 }
 else{
   let error = new Error("Unauthorized") //error en caso de que el email exista pero la contraseña es incorrecta.
   error.status = 401;
   next(error)
 }
}


var transport = nodemailer.createTransport({ //transporte de email para mailtrap.
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.mail_user,
    pass: process.env.mail_pass
  }
});


const forgot = async(req,res,next) => {//metodo para reestablecer contraseña.
  const dbResponse = await loginUser(req.body.email)
  if(!dbResponse.length){return next()}//404 si no encuentra el email en la db retorna hasta que sea un email valido.
  const user = { //se crea payload para generar un token necesario para reestablecer contraseña
    id: dbResponse[0].id,
    name:dbResponse[0].name,
    email:dbResponse[0].email
  }
  const token = await tokenSign(user,'15m') //Se firma el token para que sea autentico
  const link = `${url}/users/reset/${token}`//link para resetear contraseña,utilizando el token como generador de link unico para reseteo.

  let mailDetails = {
    from: "tech.support@mydream.com",
    to:user.email,
    subject: "Link de recuperacion de email",
    html:`<h2>Link de recuperacion de Password:</h2>
    <p>Para resetear su contraseña clickee en el siguiente texto:</p>
    <a href="${link}">Link de Reseteo</a>`

  }
  transport.sendMail(mailDetails,(error)=>{ //variable de transporte y metodo de mailtrap para enviar mail a mailtrap.
    if(error) {                          
      error.message = error.code    //en caso de error de servidor
      next(error)
    } else{
      res.status(200).json({message:`Hola ${user.name},te hemos mandado un email con las instrucciones para resetear tu contraseña a ${user.email}`})
    }//si esta bien un codigo 200. con mensaje de instruccion para que el usuario vaya a la pagina de reestablecer contraseña.
  })
}

//Formulario para resetear la password.
const reset = async(req,res,next)=>{
const {token} = req.params //al estar el token en el parametro se puede capturar para verificar que el token sea autentico.
const tokenStatus= await tokenVerify(token)
if(tokenStatus instanceof Error){
  res.send(tokenStatus)
   } else {
     res.render("reset",{tokenStatus, token}) //se le pasa el tokenStatus que contiene el payload y tambien se le pasa el token
   }
}

const saveNewPass = async(req,res,next)=>{
  const {token} = req.params //hacemos una variable donde guardamos el token para verificar que sea autentico y no hayan accedido a cambiar una contraseña con un link falso.
  const tokenStatus = await tokenVerify(token)
  if (tokenStatus instanceof Error) return res.send(tokenStatus)//si el token es falso se manda el estado de token
  const newPassword = await encrypt(req.body.password_1)//si el token es autentico encripta la password para reemplazarla en la database.
  const dbResponse= await patchUserById(tokenStatus.id,{password:newPassword}) //se utiliza la funcion para editar info del usuario,pasandole el id que esta en el payload del token en la propiedad id,y ademas otro objeto con la informacion a cambiar en el password de la database.
  dbResponse instanceof Error ? next(dbResponse) : res.status(200).json({message:`Password cambiada para el usuario ${tokenStatus.name}`})
}



const editOne=async(req,res,next)=>{
    if(notNumber(req.params.id,next)){return}
    const file =`${url}/${req.file.filename}`
    const dbResponse=await patchUserById(+req.params.id, {...req.body,file:file})
    if(dbResponse instanceof Error)return next(dbResponse)  
    dbResponse.affectedRows ? res.status(200).json({message: "Usuario modificado."}) : next()        //affected rows sirve en las operaciones donde el dato se modifica.
         
                                                              
}
const deleteOne=async(req,res,next)=>{                
if(notNumber(req.params.id,next)){return}
const dbResponse=await deleteUserById(+req.params.id)
if(dbResponse instanceof Error)return next(dbResponse) 
!dbResponse.affectedRows ? next() : res.status(204) //si la funcion corre,va a afectar las filas,por ende funciona(204),pero si no afecto nada del objeto pasa a next porque es error.

}
module.exports={ listAll,listOne,register,deleteOne,editOne,login,forgot,reset, saveNewPass}