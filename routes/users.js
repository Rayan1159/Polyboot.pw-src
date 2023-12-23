let express = require('express');
let router = express.Router();

let argon2 = require('argon2');

let User = require('../src/Models/User')
let License = require('../src/Models/Licenses');
let Attack = require('../src/Models/Attacks');
let Plan = require('../src/Models/Plans');


router.post('/attack/stop', (req, res, next) => {
    let username = req.body.username;

    if (username) {
        Attack.userStop(username).then(data => {
            res.json({
                message: "stopped"
            })
        })
    }
})

router.post('/attack', async (req, res, next) => {
    if (req.session.username) {
        let host = req.body.host;
        let port = req.body.port;
        let time = req.body.time;
        let method = req.body.method;
        let username = req.session.username;

        if (host && port && time && method) {
            console.log(await Attack.getAllRunning());
            if (await Attack.getAllRunning() < 6) {
                if (await Attack.getAllRunningUser(req.session.username) < 1) {
                    if (time <= await Plan.getAttackTime(await User.getPlan(req.session.username))) {
                        Attack.log(host, port, time, method, username).then(async data => {
                            if (await User.getPlan(req.session.username) != "None") {
                                await Attack.requestApiPremium(host, port, time, method, username);
                            } else {
                                await Attack.requestFreeApi(host, port, time, method, username)
                            }
                            res.json({
                                message: 'sent'
                            })
                        })
                    } else {
                        res.json({
                            message: "time exceeded"
                        })
                    }
                } else {
                    res.json({
                        message: 'max running'
                    })
                }
            } else {
                res.json({
                    message: "max global"
                })
            }
        }
    }
})

router.post('/claim', async (req, res, next) => {
    let license = req.body.license;
    let exists = await License.exists(license);

    if (req.session.username) {
        if (exists) {
            License.claim(req.session.username, license).then(async data => {
                switch(data) {
                    case 'claimed':
                        res.json({
                            message: "claimed"
                        })
                        await License.destroy(license);
                    break
                }
            })
        } else {
            res.json({
                message: "invalid license"
            })
        }
    }
})

router.post('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy();
    }
})

/* GET home page. */
router.post('/login',async  (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {

        let isDisabled = await User.isDisabled(username);

        console.log(isDisabled);

        if (isDisabled) {
            return res.json({
                message: 'user banned'
            })
        }

        User.login(username, password).then(data => {
            switch(data) {
                case 'ok':
                    res.json({
                        message: "ok"
                    })
                    req.session.username = username;
                    req.session.save();
                break;

                case 'invalid':
                    res.json({
                        message: "invalid password"
                    })
                break;

                case 'not found':
                    res.json({
                        message: "not found"
                    })
                break;
            }
        })
    }
})

router.post('/register', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let captcha = req.body.captcha;

    if (!(captcha == req.session.captcha)) {
        return res.json({
            message: "invalid captcha"
        })
    }

    if (username && password) {
        User.create(username, password).then(data => {
            switch(data) {
                case 'created':
                    res.json({
                        message: "user created"
                    })
                    req.session.username = username;
                    req.session.save();
                break;

                case 'exists':
                    res.json({
                        message: "user exists"
                    })
                break;
            }
        })
    }
})

router.post('/change-password',async  (req, res, next) => {
    let current = req.body.current;
    let new_password = req.body.new_password;

    if (await argon2.verify(await User.getPassword(req.session.username), current)) {
        User.updatePassword(req.session.username, new_password).then(data => {
            switch(data) {
                case 'updated':
                    res.json({
                        message: "password updated"
                    })
                break;
            }
        })
    } else {
        res.json({
            message: 'invalid password'
        })
    }
})


module.exports = router;
