const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');
const sequelize = require("sequelize")

const {userSchema} = require("../schema_validator/userSchema")
const crypto = require ("crypto");


const algorithm = "aes-256-cbc"; 

// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);

// secret key generate 32 bytes of random data
const Securitykey = crypto.randomBytes(32);



//create and save a user
exports.create = async(req,res) => {
    try{
    const result = await userSchema.validateAsync(req.body)
    const user = {
        name:result.name,
        age:result.age,
        mobileNumber:result.mobileNumber,
        eMail:result.eMail,
        pwd:result.pwd,
        photo:result.photo,
        makeAdmin: result.makeAdmin?result.makeAdmin:false
    }

// protected password
const passwordTobeProtected  = user.pwd;

// the cipher function
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

// encrypt the message
// input encoding
// output encoding
let encryptedData = cipher.update(passwordTobeProtected, "utf-8", "hex");

encryptedData += cipher.final("hex");

console.log("Encrypted password: " + encryptedData);

user.pwd=encryptedData;


    User.create(user).then((data) => res.send(data))

    }catch(error){
        
            res.status(500).send({message:error.message|| "Some error occured while creating user"})

    }   
}

//View all users

exports.viewAll = (req,res) => {
    const name = req.query.name;
    var condition = name?{name:{[Op.like]:`%${name}%`}}:null;
    

    User.findAll({where:condition}).then((data) => res.send(data)).catch((err) => {
        res.send({
            message:err.message|| "Some error occured while retrieving users"
        })
    })

}

//View one user using ID

exports.viewOne = (req,res) => {
    const id = req.params.id;

    User.findByPk(id)
    .then((data)=> {
        if(data !== null){
            res.send(data)
        }else{
            res.status(404).send({message:`No user exists with the given id:${id} to view`})
        }
    })
    .catch((err) => {
        res.status(500).send(error)
        res.status(500).send({
            message:err.message||"Error while retriving details with id: " + id
        })
    })
}


//Edit a user using ID

exports.updateOne = (req,res) =>{
    const id = req.params.id;

    User.update(req.body,{
        where:{id:id}
    }).then((num) => {
        console.log(num)
        if(num == 1){
            res.send(`User with id: ${id} updated successfully`)
        }else{
            res.status(404).send({
                message:`No user exists with the given id:${id} to update`
            })
        }
    }).catch((err) => {
            res.status(500).send({
                message:err.message || "Error while updating user with id: " +id
            })
    })

}


//delete a user using ID

exports.deleteOne = (req,res) => {
    const id = req.params.id;

    User.destroy({
        where:{id:id}
    }).then((num) => {
        if (num == 1){
            res.send({
                message:`user with id: ${id} deleted successfully`
            })

        }else{
            res.status(404).send({
                message:`No user exists with the given id:${id} to delete`
            })
        }
    }).catch((err) => {
        res.status(500).send({
            message:err.message||`There is an error while deleting the user with id: ${id}`
        })
    })

}


//Login 
exports.loginUser = async(req,res) => {
        eMail = req.body.eMail,
        pwd = req.body.pwd,



    await db.sequelize.query(
        'SELECT pwd FROM user_mgmt.users WHERE eMail = :eMail',
        {
          replacements: {eMail: eMail},
          type: QueryTypes.SELECT
        }
      ).then((data) => {
        if(data.length>0){
            // the decipher function
            const encryptedpwd = data[0].pwd
const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
let decryptedData = decipher.update(encryptedpwd, "hex", "utf-8");
decryptedData += decipher.final("utf8");
res.send(decryptedData)
console.log("Decrypted message: " + decryptedData);
// if(decryptedData === pwd){
//     res.send("Login successful")
// }else{
//     res.status(500).send("Invalid email/ password comination!")

// }
        }else{
            res.send("No user found registered with the provided e-mail")
        }
      }).catch((err) => console.log(err))
}