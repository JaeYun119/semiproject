const express = require('express');
const passport = require('passport');
const router = express.Router();

// 로그인 페이지 렌더링
router.get('/login', (req, res) => {
    res.render('login');
});

// 로그인 요청 처리
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

// 로그아웃 처리
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
