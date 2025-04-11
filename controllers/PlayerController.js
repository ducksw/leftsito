import Steam from '../models/UserSteamModels.js';

const pl = {};

pl.leaderboard = async (req, res) => {
  const search = req.query.search?.trim();

  // almacena los datos
  let steam = [];

  if (search) {
    steam = await Steam.find({ displayName: { $regex: new RegExp(search, 'i') } });
  } else {
    steam = await Steam.find();
  }

  steam.sort((a, b) => (b.elo || 800) - (a.elo || 800));

  res.render('leaderboard', { steam, search });
}


export default pl;