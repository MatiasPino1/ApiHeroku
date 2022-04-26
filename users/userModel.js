const connection =require("../db/config")


const getAll=async() => {
    const query= "SELECT * FROM users"
    try {
       return await connection.query(query)
    } catch (error) {
       error.message = error.code   //se crea un objeto de la instancia del tipo Error.
       return error
    }
}

const getOne=async(id)=>{
    const query=`SELECT * FROM users WHERE id = ${id}`
    try {
        return await connection.query(query)
    } catch (error) {
        error.message = error.code  
        return error
    }
}

const addOne=async(body)=>{
    const query =`INSERT INTO users SET ?`
    try {
        return await connection.query(query, body)
    } catch (error) {
        error.message = error.code   
        return error
    }
}

const loginUser=async(email)=>{
const query= `SELECT * FROM users WHERE email = '${email}' LIMIT 1`
try {
    return await connection.query(query)
} catch (error) {
    error.message = error.code   
        return error
}
}

const deleteUserById=async(id)=>{
const query=`DELETE FROM users WHERE id = ${id}`
try {
    return await connection.query(query)
} catch (error) {
    error.message = error.code   
    return error
}
}

const patchUserById=async(id,user)=>{
    const query=`UPDATE users SET ? WHERE id = ${id}`
    try {
        return await connection.query(query, user)
    } catch (error) {
        error.message = error.code   
        return error
    }
}
module.exports={getAll,getOne,addOne,deleteUserById,patchUserById,loginUser}