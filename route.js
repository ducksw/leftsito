import express from 'express';
import PLAYER from './controllers/PlayerController.js';
import VIDEO from './controllers/VideoController.js';
import GAME from './controllers/GameController.js';
import MAIN from './controllers/MainController.js';
import RANKED from './controllers/RankedController.js';

const router = express.Router();

// default 

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

router.get('/home', MAIN.index);
router.get('/leaderboard', PLAYER.leaderboard);
router.get('/clips', VIDEO.allVideo);
router.post('/clips', VIDEO.video_create);
router.get('/clips/:id', VIDEO.video_view);
router.get('/champions/private', GAME.viewGame);
router.post('/createGame', GAME.createGame);

// rankeds
router.post('/join-queue', RANKED.joinRankedQueue);
router.get('/cola', RANKED.viewRankedMatch);
router.post('/leave-queue', RANKED.leaveQueue);


export default (app) => {
	app.use(router);
};
