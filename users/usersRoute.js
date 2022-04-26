const router=require("express").Router()
const { listAll ,listOne, register, deleteOne, editOne, login, forgot, reset, saveNewPass } = require("./userController")
const {validatorCreateUser,validatorEditUser,validatorResetPassword}=require("../validators/users")
const uploadFile=require("../utils/handleStorage")



//get all users
router.get("/",listAll)

//get user by id
router.get("/:id",listOne)

//post user
router.post("/register",uploadFile.single("file"),validatorCreateUser ,register) 

//login
router.post("/login", login)

//forgot password
router.post("/forgot-password",forgot) //manda el link por email para resetear la password.

//Link de reseteo
router.get("/reset/:token", reset) //renderiza el frontend con hbs para resetear la pass.

router.post("/reset/:token",validatorResetPassword, saveNewPass)//el usuario manda la nueva contraseña pasando por el validador.

//delete user by id
router.delete("/:id",deleteOne)

//edit user by id
router.patch("/:id",uploadFile.single("file"),validatorEditUser,editOne)

module.exports=router