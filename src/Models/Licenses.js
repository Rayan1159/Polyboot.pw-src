let DataTypes = require('sequelize');
let sequelize = require('../sequelize');

let User = require('./User');

let generateCode = (length) => {
    let result           = [];
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

let License = sequelize.define('licenses', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    plan_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
})

let claim = (username, license) => {
    return new Promise(async (resolve, reject) => {
        User.setPlan(username, await getPlanName(license)).then(data => {
            resolve('claimed');
        })
    })
}

let exists = (license) => {
    return new Promise((resolve, reject) => {
        License.findOne({
            where: {
                code: license
            }
        }).then(data => {
            if (data) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch(err => {
            reject(err);
        })
    })
}

let getPlanName = (license) => {
    return new Promise(async (resolve, reject) => {
        if (await exists(license)){
            License.findOne({
                where: {
                    code: license
                }
            }).then(data => {
                if (data) {
                    resolve(data.dataValues.plan_name);
                }
            })
        }
    })
}

let destroy = (license) => {
    return new Promise((resolve, reject) => {
        License.destroy({
            where: {
                code: license
            }
        }).then(data => {
            if (data) {
                resolve('deleted');
            }
        })
    })
}

let create = (plan, amount) => {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < amount; i++) {
            await License.create({
                code: generateCode(12),
                plan_name: plan
            }).catch(err => {
                reject(err);
            });
        }
        resolve('created');
    })
}

let getAll = () => {
    return new Promise((resolve, reject) => {
        License.findAll().then(data => {
            if (data) {
                resolve(data);
            }
        })
    })
}

module.exports = {
    create: (plan, amount) => {
        return create(plan, amount);
    },
    getAll: () => {
        return getAll();
    },
    destroy: (license) => {
        return destroy(license);
    },
    getPlanName: (license) => {
        return getPlanName(license);
    },
    claim: (username, license) => {
        return claim(username, license);
    },
    exists: (license) => {
        return exists(license);
    }
}

