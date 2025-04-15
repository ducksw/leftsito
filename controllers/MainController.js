import Steam from '../models/UserSteamModels.js'
import Game from '../models/GameModels.js'

const mn = {};

mn.index = async (req, res) => {
  // find data
  const steam = await Steam.find();
  console.log(steam);
  const game = await Game.find();

  const lengthSteam = steam.length
  const lengthGame = game.length
  console.log("length", lengthGame, lengthSteam);

  res.render('index', { steam, lengthGame, lengthSteam });
}

export default mn;