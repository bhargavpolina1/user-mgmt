const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const express = require("express");
const fileUpload = require("express-fileUpload");
const { QueryTypes } = require('sequelize');

const app = express();
app.use(express.json({ limit: "10000kb", extended: true }));
app.use(express.urlencoded({ limit: "10000kb", extended: true }));
app.use(fileUpload());


const {userSchema,loginSchema} = require("../schema_validator/userSchema")
const crypto = require ("crypto");

const iv = "1234567812345678";

//crypto.randomBytes(16).toString("hex").slice(0, 16);
const secretKey = "12345678123456781234567812345678";

//create and save a user
exports.create = async(req,res) => {
  
    try{
    const result = await userSchema.validateAsync(req.body);

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
const passwordTobeProtected  = user.pwd.trim();

// the cipher function
const encrypter = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
let encryptedMsg = encrypter.update(passwordTobeProtected, "utf8", "hex");
encryptedMsg += encrypter.final("hex");
user.pwd=encryptedMsg;
console.log(encryptedMsg);

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
        res.status(500).send(err)
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
        if(num === 1){
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
        if (num === 1){
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
    const result = await loginSchema.validateAsync(req.body);

    const userDetails = {
        eMail: result.eMail,
        pwd :result.pwd,

    }
        
        console.log(`Entered mail from API:${userDetails.eMail}`)
        console.log(`Entered password from API:${userDetails.pwd}`)



    await db.sequelize.query(
        'SELECT * FROM user_mgmt.users WHERE eMail = :eMail',
        {
          replacements: {eMail: userDetails.eMail},
          type: QueryTypes.SELECT
        }
      ).then((data) => {
        if(data.length>0){
            // the decipher function
            const Encryptedpwd = data[0].pwd
            console.log(Encryptedpwd);
            const decrypter = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
            let decryptedMsg = decrypter.update(Encryptedpwd, "hex", "utf8");
            decryptedMsg += decrypter.final("utf8").trim();

            console.log(`Decrypted password: ${decryptedMsg}`)
            
            console.log(decryptedMsg.length, userDetails.pwd.length)

            console.log(`Entered pwd: ${userDetails.pwd}`);
            console.log(typeof decryptedMsg);
            console.log(typeof userDetails.pwd);

            if(decryptedMsg === userDetails.pwd){
            res.send(data)
            }else{
            res.status(500).send("Invalid email/ password comination!")
            }
                    }else{
                        res.status(404).send("No user registered with the provided e-mail")
                    }
                }).catch((err) => res.status(500).send(err))
            }