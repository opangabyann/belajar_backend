'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('artikels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull : false,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "users",
          key : "id",
          as : "userId"
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull : false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull : false
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('artikels');
  }
};