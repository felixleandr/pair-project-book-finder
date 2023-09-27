'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Favorites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProfileId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Profiles',
          },
          key: 'id'
        },
      },
      BookId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Books',
          },
          key: 'id'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Favorites');
  }
};