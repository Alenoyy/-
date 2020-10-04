const express = require('express');
const router = express.Router();

router.get('/input', function (req,res) {
    res.send('Вход');
});

router.get('/room', function (req,res) {
    res.send('Личный кабинет');
});


