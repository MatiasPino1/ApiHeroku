const {getAllPosts,addNewPost, getPostWith} = require("./postsModel")
const {matchedData} = require("express-validator")

const listAll=async(req,res,next)=>{
let dbResponse = null;
if (req.query.title){
    dbResponse = await getPostWith(req.query.title);
}else{
    dbResponse=await getAllPosts();
};
if (dbResponse instanceof Error) return next(dbResponse); //error 500 en caso de que el model haya ido por el catch;
dbResponse.length ? res.status(200).json(dbResponse) : res.status(404).json({message:"No funciona el handler 404 pero es un 404"});  //si todo ok status 200 con la info y si no 404.
}

const addOne=async(req,res,next)=>{
const cleanBody=matchedData(req) //metodo que comprueba los datos segun el middleware inyectado en postsRoute exportado de  (../validators/posts)
const dbResponse= addNewPost({ userid: req.user.id,...cleanBody})//se le pasa el id para que se sepa de quien es el post y luego todos los datos de cleanbody pero esparcidos.
dbResponse instanceof Error ? next(dbResponse) : res.status(201).json({message:`Post created by ${req.user.name}`})
}

module.exports={addOne,listAll}