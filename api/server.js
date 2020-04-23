const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const restricted = require('../auth/restricted');
const usersRouter = require('../api/routes/Users/users-router');
const authRouter = require('../auth/auth-router');

const server = express();

const sessionConfig = {
	name: 'pepperoni-pizza',
	secret: 'ILoveCoding',
	cookie: {
		maxAge: 3600 * 1000,
		secure: false,
		httpOnly: true,
	},
	resave: false,
	saveUninitialized: false,

	store: new knexSessionStore({
		knex: require('../data/db-config'),
		tablename: 'sessions',
		sidfieldname: 'sid',
		createtable: true,
		clearInterval: 3600 * 1000,
	}),
};

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionConfig));

server.use('/api/users', restricted, usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
	res.status(200).json({ api: true });
});

module.exports = server;
