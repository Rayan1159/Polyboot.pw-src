const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin/admin');
let adminRouterPost = require('./routes/admin/post');

const app = express();

let Attack = require('./src/Models/Attacks');
let User = require('./src/Models/User');


setInterval(async () => {
    await User.setExpire();
    Attack.stopAttack().then(data => {
        console.log(data);
    })
}, 2500);

app.use(session({
    secret: 'some code',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))

app.set('json spaces', 2);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/admin/post', adminRouterPost);
app.use('/post', usersRouter);

app.get('*', async (req, res, next) => {
    return res.render('404');
})

app.listen(80, async ()=> {
    console.log("Server started");
})

module.exports = app;
