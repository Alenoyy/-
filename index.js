const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config/db');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(bodyParser.json);

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true  } );

mongoose.connection.on('connected', function () {
    console.log("К БД подключение выполнено успешно");
});

mongoose.connection.on('error', function (err) {
    console.log("Подключение к БД не выполнено");
});

app.post('/reg', function (req,res) {
    let newUser = new User({
        name: req.body.name,
        email:req.body.email,
    login: req.body.login,
    password: req.body.password
    });

    User.addUser(newUser, function (err, user) {
        if(err)
            res.json({success: false, msg: "ошибка"});
        else
            res.json({success: true, msg: "пользователь добавлен"});
    });
});

app.get('/input', function (req,res) {
    const login =req.body.login;
    const password =req.body.password;

    User.getUserByLogin(login, function (err, user){
        if (err) throw err;
        if (!user)
            return req.json({success: false, msg: "пользователь не найден"});

        User.comparePass(password, user.password, function (err, isMatch){
            if (err) throw err;
            if (isMatch){
const token = jwt.sign(user,config.secret, {
    expiresIn: 3600 * 24
});
res.json({
    success: true,
    token: 'JWT' + token,
    user: {
        id: user._id,
        name: user.name,
        login: user.login,
        email: user.email
    }
});
            }
            else {
                return req.json({success: false, msg: "пользователь не найден"});
        }
        });
    });
});

app.get('/room', passport.authenticate(jwt,{session: false}), function (req,res) {
    res.send('Личный кабинет');
});
app.listen(port, function () {
    console.log("Получилось!");
});