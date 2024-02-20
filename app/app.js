const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const mysql = require('mysql2');

dotenv.config();

const app = express();

// 라우팅
const indexRouter = require('./src/routes/home/index');
const authRouter = require('./src/routes/home/auth');

// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(morgan('dev'));
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// 사용자 인증을 위한 LocalStrategy 설정
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        // 사용자 정보를 데이터베이스에서 찾음 (이 부분은 실제로는 데이터베이스에서 사용자 정보를 조회해야 함)
        const user = { id: 1, email: 'test@example.com', password: '$2b$10$O4OiBBL6kQW.Yhl0kiVX6.U2tjI.8Qz3n3Fo9nqj/KsXTZi.BfGbi' }; // 예시로 하드코딩된 사용자 정보
        if (!user) {
            return done(null, false, { message: '사용자를 찾을 수 없습니다.' });
        }
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// passport에 사용자 객체를 직렬화하여 세션에 저장
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// 세션에서 사용자 객체를 역직렬화
passport.deserializeUser((id, done) => {
    // 실제로는 데이터베이스에서 사용자 정보를 조회해야 함
    const user = { id: 1, email: 'test@example.com' }; // 예시로 하드코딩된 사용자 정보
    done(null, user);
});

app.use("/", indexRouter);
app.use('/auth', authRouter);
// app.use("/login",login);
// app.use("/register",register);
// app.use("/member",member);
// app.use("/comment",comment);
// app.use("/loginLog",loginLog);
// app.use("/testLog",testLog);
// app.use("/scores",scores);



// MySQL 연결 설정
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('MYSQL 연결문제:', err);
        return;
    }
    console.log('MYSQL에 연결되었습니다.');
});

// app 객체에 connection을 추가하여 다른 파일에서도 사용할 수 있도록 함
app.connection = connection;

module.exports = app;
