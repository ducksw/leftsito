import Steam from '../models/UserSteamModels.js';

const aldoId = "76561199153288700";
const ducksId = "76561199093444412";
console.log("aldoid", aldoId, "ducksid", ducksId);

export const steamUserMiddleware = async (req, res, next) => {
  const userId = req.session.steamId;
  let steamUser = null;

  if (userId) {
    steamUser = await Steam.findOne({ steamId: userId });
  }

  res.locals.adminAccess = (userId === aldoId || userId === ducksId);
  res.locals.displayName = steamUser?.displayName || null;
  res.locals.profileurl = steamUser?.profileurl || null;

  next();
}

