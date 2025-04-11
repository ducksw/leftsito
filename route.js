import express from 'express';
import PLAYER from './controllers/PlayerController.js';
import VIDEO from './controllers/VideoController.js';

const router = express.Router();

// default 

router.get('/home', (req, res) => {
	res.render('index');
});

router.get('/', (req, res) => {
	res.redirect('/home');
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/rules', (req, res) => {
	res.render('rules');
})

router.get('/about', (req, res) => {
	res.render('about');
})

router.get('/champions', (req, res) => {
	res.render('champions');
})

// with controllers

router.get('/leaderboard', PLAYER.leaderboard);
router.get('/clips', VIDEO.allVideo);
router.post('/clips', VIDEO.video_create);
router.get('/clips/:id', VIDEO.video_view);

export default (app) => {
	app.use(router);
};
