import Steam from '../models/UserSteamModels.js';
import Game from '../models/GameModels.js';
import Clip from '../models/VideoModel.js';
import Ranked from '../models/RankedModels.js';

const mn = {};

mn.index = async (req, res) => {
  let user 
  const steamId = req.session.steamId;

  if (steamId) {
    user = await Steam.findOne({user});
  }

  // find data
  const steam = await Steam.find();
  const game = await Game.find();
  const clip = await Clip.find();
  const ranked = await Ranked.find();

  const lengthSteam = steam.length
  const lengthGame = game.length
  const lengthClip = clip.length
  const lengthRanked = ranked.length

  steam.sort((a, b) => (b.elo || 800) - (a.elo || 800));

  res.render('index', { steam, lengthGame, lengthSteam, lengthClip, elo: user?.elo, lengthRanked });
}

export default mn;
