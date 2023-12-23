let express = require('express');
let router = express.Router();

let User = require('../../src/Models/User')
let News = require('../../src/Models/News');
let Plan = require('../../src/Models/Plans');
let License = require('../../src/Models/Licenses');

router.post('/user/enable', async(req, res, next) => {
    if (req.session.username) {
        if (await User.getRank(req.session.username)) {
            let username = req.body.username;

            if (username) {
                User.enable(username).then(data => {
                    switch(data) {
                        case 'enabled':
                            res.json({
                                message: "user enabled"
                            })
                        break
                    }
                })
            }
        }
    }
})

router.post('/user/disable', async(req, res, next) => {
    if (req.session.username) {
        let username = req.body.username;

        if (await User.getRank(req.session.username)) {
            if (username) {
                User.disable(username).then(data => {
                    switch(data) {
                        case 'disabled':
                            res.json({
                                message: 'user disabled'
                            })
                        break;
                    }
                })
            }
        }
    }
})

router.post('/license/create', async (req, res, next) => {
    if (req.session.username) {
        let plan = req.body.plan;
        let amount = req.body.amount;

        if (await User.getRank(req.session.username)) {
            License.create(plan, amount).then(data => {
                switch(data) {
                    case 'created':
                        res.json({
                            message: "licenses created"
                        })
                    break
                }
            })
        }
    }
})

router.post('/license/delete', async (req, res, next) => {
    if (req.session.username) {
        let ID = req.body.ID;
        if (await User.getRank(req.session.username)) {
            License.destroy(ID).then(data => {
                switch(data) {
                    case 'deleted':
                        res.json({
                            message: 'deleted'
                        })
                    break;
                }
            })
        }
    }
})

router.post('/news/delete', async(req, res, next) => {
    if (req.session.username) {
        let ID = req.body.ID;

        if (await User.getRank(req.session.username)) {
            News.destroy(ID).then(data => {
                switch(data) {
                    case 'destroyed':
                        res.json({
                            message: "article deleted"
                        })
                    break;
                }
            })
        }
    }
})

router.post('/news/create', async(req, res, next) => {
    if (req.session.username) {
        let title = req.body.title;
        let body = req.body.body;

        if (await User.getRank(req.session.username)) {
            News.post(title, body).then(data => {
                switch(data) {
                    case 'created':
                        res.json({
                            message: "post added"
                        })
                    break
                }
            })
        }
    }
})

router.post('/plans/create', async (req, res, next) => {
    if (req.session.username) {
        let name = req.body.name;
        let time = req.body.time;

        if (await User.getRank(req.session.username)) {
            Plan.create(name, time).then(data => {
                switch (data) {
                    case 'created':
                        res.json({
                            message: 'plan created'
                        })
                    break;
                }
            })
        }
    } else {
        res.redirect('/login')
    }
})

router.post('/plans/delete', async (req, res, next) => {
    if (req.session.username) {
        let ID = req.body.ID;

        if (await User.getRank(req.session.username)) {
            Plan.destroy(ID).then(data => {
                switch(data) {
                    case 'deleted':
                        res.json({
                            message: "deleted"
                        })
                    break;
                }
            })
        }
    }
})

module.exports = router;
