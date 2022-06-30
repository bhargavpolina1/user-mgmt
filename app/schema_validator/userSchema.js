const { number } = require("joi");
const Joi = require("joi");

const userSchema = Joi.object({
    name:Joi.string().required().lowercase().trim(),
    age:Joi.number().required(),
    mobileNumber:Joi.number().min(1000000000).required(),
    eMail:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','in'] } }).required().lowercase(),
    pwd:Joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^"&*-]).{8,}$/)).required(),
    photo:Joi.any().optional(),
    makeAdmin:Joi.bool().optional().default(false)
})

const loginSchema = Joi.object({
    eMail:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','in'] } }).required().lowercase(),
    pwd:Joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#"?!@$%^&*-]).{8,}$/)).required(),
})

const editUserSchema = Joi.object({
    name:Joi.string().optional().lowercase().trim(),
    age:Joi.number().optional(),
    mobileNumber:Joi.number().min(1000000000).optional(),
    eMail:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','in'] } }).optional().lowercase(),
    makeAdmin:Joi.bool().optional()
})

module.exports = {
    userSchema,
    loginSchema,
    editUserSchema  
}