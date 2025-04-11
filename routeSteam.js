import express from 'express';
import passport from 'passport';
const router = express.Router();

export default (app) => {
	router.get("/auth/steam", passport.authenticate("steam"));

	router.get("/auth/steam/return",  
		passport.authenticate("steam", { failureRedirect: "/" }),
		(req, res) => {
			if (req.user) {
				req.session.steamId = req.user.steamId;
				req.session.displayName = req.user.displayName;
				req.session.avatar = req.user.avatar;
				req.session.profileurl = req.user.profileurl;
			}
			res.redirect("/home");
		}
	);

	router.get("/logout", (req, res, next) => {
		req.logout((err) => { 
			if (err) {
				console.error("Error al cerrar sesión:", err);
				return next(err);
			}
			req.session.destroy(() => {
				res.redirect("/home");
			});
		});
	});

	app.use(router);
}