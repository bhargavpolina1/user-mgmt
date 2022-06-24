module.exports = (app) => {
    const users = require("../controllers/controller.js");
    var router = require("express").Router();
    //View all users
    router.get("/",users.viewAll)

    //View a user
    //router.get("/:id",users.viewOne)
    
    // Create a new user
    router.post("/", users.create);

    // Update a user
    router.put('/:id',users.updateOne)

    // Delete a user
    router.delete('/:id',users.deleteOne)

    // login
    router.get('/login',users.loginUser)
    
    app.use('/api/users', router);

}