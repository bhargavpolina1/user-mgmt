module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      name: {
        type: Sequelize.STRING,
       allowNull:false
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      mobileNumber: {
        type: Sequelize.BIGINT,
        allowNull:false

      },
      eMail: {
        type: Sequelize.STRING,
        allowNull:false
      },
    pwd: {
      type: Sequelize.STRING,
      allowNull:false
    },
    photo:{
      type: Sequelize.TEXT('long'),
    },
    makeAdmin:{
      type: Sequelize.BOOLEAN,
    }
    });
    return User;
  };