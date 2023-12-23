let DataTypes = require('sequelize');
let sequelize = require('../sequelize');

let News = sequelize.define('news', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
})

let post = async (title, body) => {
    return new Promise((resolve, reject) => {
        News.create({
            title: title,
            body: body
        }).then(data => {
            if (data) {
                resolve('created');
            }
        })
    })
}

let getAll = () => {
    return new Promise((resolve, reject) => {
        News.findAll().then(data => {
            if (data) {
                resolve(data)
            }
        });
    })
}

let destroy = (ID) => {
    return new Promise((resolve, reject) => {
        News.destroy({
            where: {
                ID: ID
            }
        }).then(data => {
            if (data) {
                resolve('destroyed')
            }
        }).catch(err => {
            reject(err);
        })
    })
}

module.exports = {
    post: (title, body) => {
        return post(title, body);
    },
    destroy: (ID) => {
        return destroy(ID);
    },
    getAll: () => {
        return getAll();
    }
}