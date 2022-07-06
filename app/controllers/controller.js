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


const {userSchema,loginSchema,editUserSchema} = require("../schema_validator/userSchema")
const crypto = require ("crypto");

const secretKey = "12345678123456781234567812345678";

//create and save a user
exports.create = async(req,res) => {
  
    try{
    const result = await userSchema.validateAsync(req.body.values);

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

const hashedPassword = crypto.createHmac('sha256',secretKey).update(passwordTobeProtected).digest('hex');
user.pwd=hashedPassword;
console.log(hashedPassword);

User.create(user).then((data) => res.send(data))

    }catch(error){
        
        return res.status(500).send({message:error.message|| "Some error occured while creating user"})
    }   
}

//View all users

exports.viewAll = (req,res) => {
    const name = req.query.name;
    var condition = name?{name:{[Op.like]:`%${name}%`}}:null;
    

    User.findAll({where:condition}).then((data) => res.send(data)).catch((err) => {
        return res.send({
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
            return res.send(data)
        }else{
            return res.status(404).send({message:`No user exists with the given id:${id} to view`})
        }
    })
    .catch((err) => {
        return res.status(500).send({
            message:err.message||"Error while retriving details with id: " + id
        })
    })
}

//Edit a user using ID

exports.updateOne = async(req,res) =>{
    try{
        const result = await editUserSchema.validateAsync(req.body);
        const user = {
            name:result.name,
            age:result.age,
            mobileNumber:result.mobileNumber,
            eMail:result.eMail,
            makeAdmin: result.makeAdmin,
            pwd:result.pwd,
        }
        console.log(user)
        
        const id = req.params.id;
    
        User.update(user,{
            where:{id:id}
        }).then((num) => {
            if(num == 1){
                return res.send(`User with id: ${id} updated successfully`)
            }else{
                return res.status(404).send(`No user exists with the given id:${id} to update`)
            }
        })

    }catch(err){
            return res.status(500).send(err.message || "Error while updating user with id: " +id)
    }

}


//delete a user using ID

exports.deleteOne = (req,res) => {
    const id = req.params.id;

    User.destroy({
        where:{id:id}
    }).then((num) => {
        if (num == 1){
            return res.send({
                message:`user with id: ${id} deleted successfully`
            })

        }else{
            return res.status(404).send({
                message:`No user exists with the given id:${id} to delete`
            })
        }
    }).catch((err) => {
        return res.status(500).send({
            message:err.message||`There is an error while deleting the user with id: ${id}`
        })
    })
}


//Login 
exports.loginUser = async(req,res) => {
    try{
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

            const hashedPwdFromServer = data[0].pwd
            const hashedPassword = crypto.createHmac('sha256',secretKey).update(userDetails.pwd).digest('hex');

            if(hashedPwdFromServer === hashedPassword){
            console.log(data)
            return res.send(data)
            }else{
            return res.status(500).send("Invalid email/ password comination!")
            }
                    }else{
                        return res.status(404).send("No user registered with the provided e-mail")
                    }
                })

    }catch(err){
                    console.log(err)
                    return res.status(500).send(err.message)}
                }

exports.addBulk = async(req,res) => {
    let usersWithError = []
    try{
        const usersFromSheet = req.body.usersObject;
        let result = []
        for (let i=0;i<usersFromSheet.length;i++){
            try{
                const thisUser  = await userSchema.validateAsync(usersFromSheet[i]);
                result.push(thisUser)
            }catch(error) {
                const thisUserWithError = usersFromSheet[i]
                thisUserWithError["errorMessage"] = error.message
                usersWithError.push(thisUserWithError);
            }
        }

        result.map((eachUser) => {
            const pwd = eachUser.pwd;
            const hashedPassword = crypto.createHmac('sha256',secretKey).update(pwd).digest('hex');
            eachUser.pwd = hashedPassword
            return eachUser
        })
        return User.bulkCreate(result).then((data) => {
            if (usersWithError.length === 0){
               return res.send(data)
            }else{
                return res.status(500).send(usersWithError|| "Some error occured while creating user")
            }
            })
        }catch(error){
            return res.status(500).send(error.message|| "Some error occured while creating user")   
        }
}