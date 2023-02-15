'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('materis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mataPelajaran: {
        type: Sequelize.STRING,
        allowNull : false,

      },
      kelas: {
        type: Sequelize.STRING,
        allowNull : false,

      },
      materi: {
        type: Sequelize.STRING,
        allowNull : false,
        
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull : false,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "users",
          key : "id",
          as : "userID"
        }
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
    await queryInterface.dropTable('materis');
  }
};