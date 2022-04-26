const mysql=require("mysql")
const util=require("util")

const connection=mysql.createConnection({
host:process.env.db_host,
database:process.env.db_name,
user:process.env.db_user,
pass:process.env.db_pass
})

connection.connect((err)=>{
    err?console.log(`Error encontrado:${err}`):console.log("Conexion establecida.")
})

connection.query=util.promisify(connection.query)

module.exports=connection