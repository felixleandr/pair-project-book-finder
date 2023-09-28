'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Publisher)
    }
  }
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg:"Title is required"
        },
        notEmpty: {
          args: true,
          msg:"Title is required"
        }
      }
    }, 
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg:"Author is required"
        },
        notEmpty: {
          args: true,
          msg:"Author is required"
        }
      }
    }, 
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg:"Image URL is required"
        },
        notEmpty: {
          args: true,
          msg:"Image URL is required"
        }
      }
    }, 
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg:"Link to shop is required"
        },
        notEmpty: {
          args: true,
          msg:"Link to shop is required"
        }
      }
    }, 
    PublisherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg:"Publisher is required"
        },
        notEmpty: {
          args: true,
          msg:"Publisher is required"
        }
      }
    }, 
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg:"ISBN is required"
        },
        notEmpty: {
          args: true,
          msg:"ISBN is required"
        }
      }
    }, 
    descriptions: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg:"Please give some descriptions to this book"
        },
        notEmpty: {
          args: true,
          msg:"Please give some descriptions to this book"
        }
      }
    }, 
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};