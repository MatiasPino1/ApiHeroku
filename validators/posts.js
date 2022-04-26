const { check,validationResult} = require("express-validator")

const validatorCreatePost=[
    check(`title`)
    .exists()
    .notEmpty()
    .isLength({ min:3, max:124})
    ,
    check(`body`)
    .exists()
    .notEmpty(),
    (req,res,next)=>{
        const err = validationResult(req) //metodo de express validator que valida que todo lo que indicamos arriba y devuelve un objeto con los errores en caso de haber.
        if(!err.isEmpty()) res.status(400).json({errors:err.array()})
        else next()
    }
]
module.exports=validatorCreatePost
