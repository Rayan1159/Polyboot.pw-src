let DataTypes = require('sequelize');
let sequelize = require('../sequelize');
let argon2 = require('argon2');

let User = sequelize.define('users', {
    ID: {
        type: DataTypes.STRING,
        allowNull: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expire: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: false
})

let enable = (username) => {
    return new Promise((resolve, reject) => {
        User.update({
            status: 0
        }, {
            where: {
                username: username
            }
        }).then(data => {
            if (data) {
                resolve('enabled');
            }
        })
    })
}

let disable = (username) => {
    return new Promise((resolve, reject) => {
        User.update({
            status: 1
        }, {
            where: {
                username: username
            }
        }).then(data => {
            if (data) {
                resolve('disabled');
            }
        })
    })
}

let hasMembership = async (username) => {
    return new Promise(async(resolve, reject) => {
        if (await exists(username)) {
            User.findOne({
                where: {
                    username: username
                }
            }).then(data => {
                if (data) {
                    if (data.dataValues.plan != 'None') {
                        resolve('yes')
                    } else {
                        resolve('no');
                    }
                }
            })
        }
    })
}

let getRank = async (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                username: username
            }
        }).then(data => {
            if (data) {
                resolve(data.dataValues.rank);
            }
        }).catch(err => {
            reject(err);
        })
    })
}

let setPlan = (username, plan_name) => {
    let timestamp = Math.round(new Date().getTime() / 1000);
    let end = timestamp += 2628000

    return new Promise(async (resolve, reject) => {
        if (await exists(username)) {
            User.update({
                plan: plan_name,
                expire: end
            }, {
                where: {
                    username: username
                }
            }).then(data => {
                if (data) {
                    resolve(data);
                }
            }).catch(err => {
                reject(err);
            })
        }
    })
}

let getExpire = async (username) => {
    if (await exists(username)) {
        return new Promise((resolve, reject) => {
            User.findOne({
                where: {
                    username: username
                }
            }).then(data => {
                if (data) {
                    resolve(data.dataValues.expire)
                } else {
                    resolve('no expire');
                }
            })
        })
    }
}

let setExpire = () => {
    return new Promise(async (resolve, reject) => {
        let current = Math.round(new Date().getTime() / 1000);

        User.findAll().then(data => {
            for (let i = 0; i < data.length; i++) {
                let ID = data[i].dataValues.ID;
                let expire = data[i].dataValues.expire;

                if (current > expire) {
                    User.update({
                        plan: "None",
                        expire: 0
                    }, {
                        where: {
                            ID: ID
                        }
                    }).then(data => {
                        resolve(data);
                    })
                }
            }
        })
    })
}

let getAll = () => {
    return new Promise((resolve, reject) => {
        User.findAll().then(data => {
            if (data) {
                resolve(data);
            }
        }).catch(err => {
            reject(err);
        })
    })
}

let countAll = () => {
    return new Promise((resolve, reject) => {
        User.findAll().then(data => {
            resolve(data.length);
        })
    })
}

let existsID = (ID) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                ID: ID
            }
        }).then(data => {
            if (data) {
                resolve(true)
            } else {
                resolve(false);
            }
        }).catch(err => {
            reject(err);
        })
    })
}

let exists = async (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                username: username
            }
        }).then(data => {
            if (data) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    })
}

let create = async (username, password) => {
    let userExists = await exists(username);
    let encoded_password = await argon2.hash(password);

    return new Promise((resolve, reject) => {
        if (!(userExists)) {
            User.create({
                username: username,
                password: encoded_password
            }).then(data => {
                if (data) {
                    resolve('created')
                }
            })
        } else {
            resolve('exists');
        }
    })
}

let getPassword = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                username: username
            }
        }).then(data => {
            if (data) {
                resolve(data.dataValues.password)
            }
        }).catch(err => {
            reject(err);
        })
    })
}

let updatePassword = async (username, password) => {
    let encoded_password = await argon2.hash(password);
    return new Promise((resolve, reject) => {
        User.update({
            password: encoded_password
        }, {
            where: {
                username: username
            }
        }).then(data => {
            if (data) {
                resolve('updated');
            }
        })
    })
}

let getPlan = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                username: username
            }
        }).then(data => {
            if (data) {
                resolve(data.dataValues.plan);
            }
        })
    })
}

let login = async (username, password) => {
    let userExists = await exists(username);

    return new Promise((resolve, reject) => {
        if (userExists) {
            User.findOne({
                where: {
                    username: username
                }
            }).then(async data => {
                if (data) {
                    if (await argon2.verify(data.dataValues.password, password)) {
                        resolve('ok')
                    } else {
                        resolve('invalid');
                    }
                }
            })
        } else {
            resolve('not found');
        }
    })
}

let isDisabled = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                username: username
            }
        }).then(data => {
            if (data.dataValues.status) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(err => {
            reject(err);
        })
    })
}

let getNameByID = (ID) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                ID: ID
            }
        }).then(data => {
            if (data) {
                resolve(data.dataValues.username);
            }
        }).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    getNameByID: (ID) => {
        return getNameByID(ID)
    },
    create: (username, password) => {
        return create(username, password);
    },
    login: (username, password) => {
        return login(username, password);
    },
    setPlan: (username, plan_name) => {
        return setPlan(username, plan_name);
    },
    getExpire: (username) => {
        return getExpire(username);
    },
    setExpire: () => {
        return setExpire();
    },
    hasMembership: (username) => {
        return hasMembership(username);
    },
    countAll: () => {
        return countAll();
    },
    getRank: (username) => {
        return getRank(username);
    },
    getPlan: (username) => {
        return getPlan(username);
    },
    getPassword: (username) => {
        return getPassword(username);
    },
    updatePassword: (username, password) => {
        return updatePassword(username, password);
    },
    disable: (username) => {
        return disable(username);
    },
    enable: (username) => {
        return enable(username);
    },
    getAll: () => {
        return getAll();
    },
    existsID: (ID) => {
        return existsID(ID);
    },
    isDisabled: (username) => {
        return isDisabled(username);
    }
}