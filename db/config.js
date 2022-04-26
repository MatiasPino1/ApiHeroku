const mysql=require("mysql")
const util=require("util")

const pool=mysql.createPool({
host:process.env.db_host,
database:process.env.db_name,
user:process.env.db_user,
pass:process.env.db_pass
})

pool.getConnection((err)=>{
    err?console.log(`Error encontrado:${err}`):console.log("Conexion establecida.")
})

pool.query=util.promisify(connection.query)

module.exports=pool