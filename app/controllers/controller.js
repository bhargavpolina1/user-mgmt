const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const express = require("express");
const fileUpload = require("express-fileUpload");
const path = require("path");
const util = require("util");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload());






const { QueryTypes } = require('sequelize');
const sequelize = require("sequelize")

const {userSchema} = require("../schema_validator/userSchema")
const crypto = require ("crypto");
const { Console } = require("console");
const { response } = require("express");


const algorithm = "aes-256-cbc";


const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
const secretKey = "12345678123456781234567812345678";

//create and save a user
exports.create = async(req,res) => {
  
    try{
    console.log(`The body of request is: ${Object.keys(req.body)}`);
    const result = await userSchema.validateAsync(req.body);
    console.log(req.body)
    console.log("")
    console.log("")
    console.log(result)

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
console.log(`USER photo:${user.photo}`);
const passwordTobeProtected  = user.pwd;

// the cipher function
const encrypter = crypto.createCipheriv(algorithm, secretKey, iv);
let encryptedMsg = encrypter.update(passwordTobeProtected, "utf8", "hex");
encryptedMsg += encrypter.final("hex");
user.pwd=encryptedMsg;
console.log(encryptedMsg);

const file = user.photo;
console.log(req.body);
console.log(`file name: ${file.name}`)
const fileName = file.name;
const size = file.data.length;
const extension = path.extname(fileName);

const permittedExtensions = /png|jpg|jpeg/

if(!permittedExtensions.test(extension)){
    throw "Unsupported File format"
}

if (size > 5000000) throw "File must be less than 5 MB"



const md5 = file.md5;
const URL = "/uploads/"+md5+extension;


await util.promisify(file.mv)("./uploads" + URL);

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
            const receivedEncryptedpwd = data[0].pwd
            const decrypter = crypto.createDecipheriv(algorithm, secretKey, iv);
            decrypter.setAutoPadding(false);
            let decryptedMsg = decrypter.update(receivedEncryptedpwd, "hex", "utf8");
            decryptedMsg += decrypter.final("utf8");
            console.log(decryptedMsg)

if(decryptedMsg === pwd){
res.send("Login successful")
}else{
   res.status(500).send("Invalid email/ password comination!")

 }
        }else{
            res.send("No user found registered with the provided e-mail")
        }
      }).catch((err) => console.log(err))
}