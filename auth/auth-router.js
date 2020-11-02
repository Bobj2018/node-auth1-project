const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../api/routes/Users/users-model');

router.post('/register', (req, res) => {
	const user = req.body;
	const hash = bcrypt.hashSync(user.password, 8);
	user.password = hash;

	Users.add(user)
		.then((saved) => {
			res.status(201).json(saved);
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

router.post('/login', (req, res) => {
	let { username, password } = req.body;
	console.log(username);

	Users.findBy({ username })
		.first()
		.then((user) => {
			console.log(user);
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.user = user.username;
				res.status(200).json({ message: `Welcome ${username}!` });
			} else {
				res.status(401).json({ message: 'invalid credentials' });
			}
		})
		.catch((error) => {
			res.status(500).json({ message: 'Server Error', msg: error.message });
			console.log(error.message);
		});
});

router.delete('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				res.status(400).json({ message: 'error logging out:', error: err });
			} else {
				res.json({ message: 'logged out' });
			}
		});
	} else {
		res.end();
	}
});

module.exports = router;
