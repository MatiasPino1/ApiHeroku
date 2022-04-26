const router = require("express").Router()
const {addOne,listAll} = require("./postsController")
const {isAuth} = require("../middlewares/isAuth")
const validatorCreatePost = require("../validators/posts")

router.post("/",isAuth,validatorCreatePost ,addOne)  //solo se deja agregar un post en caso de que el token sea original.

router.get("/",listAll,(req,res)=>{

})
module.exports=router;