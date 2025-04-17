import Game from '../models/GameModels.js';
//import Steam from '../models/UserSteamModels.js';
import help from '../helpers/random.js';

const gm = {};

gm.viewGame = async (req, res) => {
  const { code } = req.query;

  let game = null;
  let isCreator = false;

  if (code) {
    game = await Game.findOne({code});
    if (game) {
      const userSteamId = req.session.steamId;
      isCreator = game.players.length > 0 && game.players[0].steamId === userSteamId;
    }
  }

  res.render('privateGame', { game, isCreator });
}

gm.createGame = async (req, res) => {
  // random code game
  const code = help.randomString();

  // session of steam
  const userSteamId = req.session.steamId;
  const displayName = req.session.displayName;
  const avatar = req.session.avatar;

  const player = { steamId: userSteamId, displayName, avatar };

  const newGame = new Game({
    code,
    players: [player],

    // se inicializa con 0 puntos
    teamA: { players: [], points: "0" },
    teamB: { players: [], points: "0" }
  });

  await newGame.save();
  console.log(`Partida creada (${code}) por ${displayName}`);

  res.redirect(`/champions/private?code=${code}`);
}

gm.joinGame = async (req, res) => {
  const { code } = req.body;
  const steamId = req.session.steamId;
  const displayName = req.session.displayName;
  const avatar = req.session.avatar;

  if (!steamId || !displayName || !avatar) {
    return res.send("ERROR: No estás logueado.");
  }

  console.log("codigo recibido", code);

  const game = await Game.findOne({code});

  if (!game) {
    return res.send("ERROR, CODIGO INVALIDO");
  }

  if (game.players.length >= 8) {
    return res.send("LA PARTIDA ESTA LLENA");
  }
  
  if (game.players.some(player => player.steamId === steamId)) {
    console.log(`${displayName} ya esta en la partida`);
  } else {
    game.players.push({steamId, displayName, avatar});
    await game.save();
    console.log(game.players.length,"/8");
    console.log(`${displayName} se unio a la partida ${code}`);
  }

  res.redirect(`/champions/private?code=${code}`);
}


export default gm;
