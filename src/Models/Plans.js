let DataTypes = require('sequelize');
let sequelize = require('../sequelize');

let User = require('../../src/Models/User');

let Plan = sequelize.define('plans', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    attack_time: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
})

let destroy = async (ID) => {
    return new Promise((resolve, reject) => {
        Plan.destroy({
            where: {
                ID: ID
            }
        }).then(data => {
            if (data) {
                resolve('deleted');
            }
        })
    })
}

let create = async (name, attack_time) => {
    return new Promise((resolve, reject) => {
        Plan.create({
            name: name,
            attack_time: attack_time
        }).then(data => {
            if (data) {
                resolve('created');
            }
        })
    })
}

let getAll = async () => {
    return new Promise((resolve, reject) => {
        Plan.findAll().then(data => {
            if (data) {
                resolve(data);
            }
        });
    })
}

let getAttackTime = (name) => {
    return new Promise((resolve, reject) => {
        Plan.findOne({
            where: {
                name: name
            }
        }).then(data => {
            if (data) {
                resolve(data.dataValues.attack_time)
            }
        }).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    create: (name, attack_time) => {
        return create(name, attack_time);
    },
    getAttackTime: (name) => {
        return getAttackTime(name);
    },
    getAll: () => {
        return getAll();
    },
    destroy: (ID) => {
        return destroy(ID);
    }
}