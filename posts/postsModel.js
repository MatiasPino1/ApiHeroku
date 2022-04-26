const connection = require("../db/config")

const getAllPosts = () => {
const query = "select * from posts"
try {
    return connection.query(query)
} catch (error) {
    error.message = error.code
}
}

const getPostWith = (string) => {
    const query = ` select * from posts where title like '%${string}%'`
    try {
        return connection.query(query)
    } catch (error) {
        error.message = error.code
    }
    }
const addNewPost = (post) =>{ 
const query= "insert into posts set ?"
try {
    return connection.query(query,post)
} catch (error) {
    error.message = error.code
}
}

module.exports={getAllPosts,addNewPost,getPostWith}