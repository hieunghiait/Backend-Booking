'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("doctor_infors", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            doctorId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            priceId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            provinceId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            paymentId: {
                allowNull: false,
                type: Sequelize.STRING
            },
            addressClinic: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            nameClinic: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            note: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('doctor_infors');
    }
};