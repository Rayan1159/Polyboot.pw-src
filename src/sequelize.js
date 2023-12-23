const { Sequelize, DataTypes } = require('sequelize');
let chalk = require('chalk');

let sequelize = new Sequelize('polyboot', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false
})

try {
    sequelize.authenticate().then(() => {
        console.log(chalk.red('Sequelize was authenticated!'));
    });
} catch (error) {
    console.log(error);
}

module.exports = sequelize;
