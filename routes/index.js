const express = require('express');
const router = express.Router();

let User = require('../src/Models/User');
let Attacks = require('../src/Models/Attacks');
let News = require('../src/Models/News');
let Plan = require('../src/Models/Plans')

let generateCode = (length) => {
  let result           = [];
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
}

router.get('/', async(req, res, next) => {
  if (req.session.username) {
    let hasMembership = await User.hasMembership(req.session.username);
    let userCount = await User.countAll();
    let userRank = await User.getRank(req.session.username);
    let totalAttacks = await Attacks.count();
    let getNews = await News.getAll();
    let membership;

    if (hasMembership == "yes") {
      membership = true;
    } else {
      membership = false;
    }

    res.render('dashboard', {
      username: req.session.username.trim(),
      membership: membership,
      userCount: userCount,
      attacks: totalAttacks,
      news: getNews,
      rank: userRank
    });
  } else {
    res.redirect('/login');
  }
})

/* GET home page. */
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/register', (req, res, next) => {
  req.session.captcha = generateCode(7)

  res.render('register', {
    captcha: req.session.captcha
  });
})

router.get('/claim', async(req, res, next) => {
  if (req.session.username) {
    let userRank = await User.getRank(req.session.username);

    res.render('claim', {
      rank: userRank
    });
  } else {
    res.redirect('/login');
  }
})

router.get('/profile', async(req, res, next) => {
  if (req.session.username) {
    let userRank = await User.getRank(req.session.username);

    res.render('profile', {
      rank: userRank,
      username: req.session.username,
      plan: await User.getPlan(req.session.username)
    });
  } else {
    res.redirect('/login')
  }
})

router.get('/stresser', async(req, res, next) => {
  if (req.session.username) {
    let userRank = await User.getRank(req.session.username);
    let getAttacks = await Attacks.getAllUser(req.session.username);
    let isRunning = await Attacks.isRunning(req.session.username);
    let hasMembership = await User.hasMembership(req.session.username);
    let getRunningUser = await Attacks.getRunningUser(req.session.username);
    let getTime = await Plan.getAttackTime(await User.getPlan(req.session.username));
    let membership;

    if (hasMembership == "yes") {
      membership = true;
    } else {
      membership = false;
    }

    res.render('stresser', {
      rank: userRank,
      username: req.session.username,
      attack: getAttacks,
      isRunning: isRunning,
      membership: membership,
      runningAttack: getRunningUser,
      attackTime: getTime
    });
  } else {
    res.redirect('/login');
  }
})

router.get('/pricing', async (req, res, next) => {
  if (req.session.username) {
    let userRank = await User.getRank(req.session.username);

    res.render('pricing', {
      rank: userRank
    })
  } else {
    res.redirect('/login')
  }
})

router.get('/dashboard', async (req, res, next) => {
  if (req.session.username) {
    let hasMembership = await User.hasMembership(req.session.username);
    let userCount = await User.countAll();
    let userRank = await User.getRank(req.session.username);
    let totalAttacks = await Attacks.count();
    let getNews = await News.getAll();
    let membership;

    if (hasMembership == "yes") {
      membership = true;
    } else {
      membership = false;
    }

    res.render('dashboard', {
      username: req.session.username.trim(),
      membership: membership,
      userCount: userCount,
      attacks: totalAttacks,
      news: getNews,
      rank: userRank
    });
  } else {
    res.redirect('/login');
  }
})

router.get('/faq', async (req, res, next) => {
  if (req.session.username) {
    let userRank = await User.getRank(req.session.username);

    res.render('faq', {
      rank: userRank
    });
  } else {
    res.redirect('/login');
  }
})


module.exports = router;
