'use strict';
const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
    }
    isValidPassword(password) {
      // console.log(password, this.password)
    return bcrypt.compareSync(password, this.password);
    }

  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true  
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,  
      // set(value) {
      //   const hash = bcrypt.hashSync(value, 10);  
      //   this.setDataValue('password', hash);
      // }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, 
      unique: true,      
      validate: {
        isEmail: true    
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,       
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user) => {
        user.password = bcrypt.hashSync(user.password, 10); 
      },
      afterCreate: (user, options) => {
        return sequelize.models.Profile.create({ 
          name: user.username, 
          phoneNumber: '', 
          UserId: user.id  
        });
      }
    }
  });
  
  return User;
};