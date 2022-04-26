const { check ,validationResult} = require("express-validator")

const validatorCreateUser = [
check("name")
.exists().withMessage("Name field required")
.trim()
.isLength({min:2,max:90}).withMessage("Character count:min 2,max:90")
.isAlpha('es-ES',{ignore:' '}).withMessage("Only letters")
,
check("email")
.exists().withMessage("Email must be required")
.trim()
.isEmail().withMessage("Must be valid email adress")
.normalizeEmail()
,
check("password")
.exists().withMessage("Password field required")
.trim()
.isLength({min: 2, max:90}).withMessage("Character count:min 2,max:90"),
(req,res,next)=>{
    try {
        validationResult(req).throw()//throw tira el resultado en caso de no pasar la validacion para ser atajado por el catch
        return next() //una vez pasado el test sigue hacia el controlador.
    } catch (error) {
        res.status(400).json({errors:error.array()})
    }
}


]
const validatorEditUser = [ //validacion para el edit que no necesita pedir password por ende se borra del validador el pass.
    check("name")
    .exists().withMessage("Name field required")
    .trim()
    .isLength({min:2,max:90}).withMessage("Character count:min 2,max:90")
    .isAlpha('es-ES',{ignore:' '}).withMessage("Only letters")
    ,
    check("email")
    .exists().withMessage("Email must be required")
    .trim()
    .isEmail().withMessage("Must be valid email adress")
    .normalizeEmail()
    ,
    (req,res,next)=> {
        try {
            validationResult(req).throw()//throw tira el resultado en caso de no pasar la validacion para ser atajado por el catch
            return next() //una vez pasado el test sigue hacia el controlador.
        } catch (error) {
            res.status(400).json({errors:error.array()})
        }
    }
    ]

const validatorResetPassword = [
    check("password_1")//check de password
    .exists()
    .notEmpty().withMessage("Password cannot be empty")
    .isLength({min:8,max:15}).withMessage("Character count:min 2,max:90")
    .trim(),
    check("password_2")//check confirmar password
   
    .custom(async (password_2,{req})=>{//metodo para verificar la password 2 matchee con la password 1
     const password_1 = req.body.password_1 //guardo la password_1 en una variable por que no esta en los params de la funcion
     if(password_1 !== password_2){ //pregunto si pass_1 es distinta a pass_2
    throw new Error("Passwords must be identical") //Tira error si las contraseñas no son iguales,hasta que sean iguales y sigue la validacion.
     }
    }),
    (req,res,next)=>{
          const token = req.params.token //El token que viene del link de forgot_password,se va a perder a menos de guardarlo por que
          //solo viene en el link de recuperacion,fue creado en otra funcion y guardandolo en la variable nos aseguramos de tenerla
          //para darsela al usuario cuando pase la validacion,RECORDAR:Cada vez que uno se registra(esto cuenta como registro)se genera un token
          //esta vez,no se genera si no que se le devuelve el token ya creado cuando se registro por primera vez.
          
          const errors = validationResult(req)//si las contraseñas son identicas pero no se cumplen algunos de los metodos del validador,crea un objeto con los errores y los renderiza
          if(!errors.isEmpty()){ //
              const arrWarnings = errors.array()
              res.render("reset", { arrWarnings, token}) //se renderiza el front con los mensajes de errores y el token en el link para que no se resetee el link sin el token.
          }else return next()//si no hay errores sigue el proceso de usersRoute 
    }
]
    

module.exports={validatorCreateUser,validatorEditUser,validatorResetPassword}