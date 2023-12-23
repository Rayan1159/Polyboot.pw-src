let express = require('express');
let router = express.Router();

let User = require('../../src/Models/User')
let News = require('../../src/Models/News');
let Plan = require('../../src/Models/Plans');
let License = require('../../src/Models/Licenses');


router.get('/user/edit', async (req, res, next) => {
    let ID = req.query.ID;

    if (req.session.username) {
        if (await User.getRank(req.session.username)) {
            if (ID) {
                if (await User.existsID(ID)) {
                    res.render('admin/edit-user', {
                        username: await User.getNameByID(ID)
                    });
                } else {
                    res.redirect('/admin/users');
                }
            } else {
                res.redirect('/admin/users');
            }
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/login');
    }

})

router.get('/users', async (req, res, next) => {
    if (req.session.username) {
        if (await User.getRank(req.session.username)) {
            let users = await User.getAll()

            res.render('admin/users', {
                user: users
            });
        } else {
            res.redirect('/dashboard')
        }
    } else {
        res.redirect('/login')
    }
})

router.get('/licenses', async (req, res, next) => {
    if (req.session.username) {
        if (await User.getRank(req.session.username)) {
            let plans = await Plan.getAll();
            let licenses = await License.getAll();

            res.render('admin/licenses', {
                plan: plans,
                license: licenses
            });
        } else {
            res.redirect('/dashboard')
        }
    } else {
        res.redirect('/login')
    }
})

router.get('/dashboard', async (req, res, next) => {
    if (req.session.username) {
        if (await User.getRank(req.session.username)) {
            res.render('admin/dashboard');
        } else {
            res.redirect('/dashboard');
        }
    } else {
        res.redirect('/login');
    }
})

router.get('/news', async (req, res, next) => {
    if (req.session.username) {
        if (await User.getRank(req.session.username)) {
            let news = await News.getAll();

            res.render('admin/news', {
                news: news
            });
        } else {
            res.redirect('/dashboard');
        }
    } else {
        res.redirect('/login');
    }
})

router.get('/plans', async (req, res, next) => {
    if (req.session.username) {
        if (await User.getRank(req.session.username)) {
            let getPlans = await Plan.getAll();

            res.render('admin/plans', {
                plan: getPlans
            })
        } else {
            res.redirect('/dashboard')
        }
    } else {
        res.redirect('/login');
    }
})

module.exports = router;
