import RankedModel  from '../models/RankedModels.js';
import Steam from '../models/UserSteamModels.js';
import Game from '../models/GameModels.js';
import Clip from '../models/VideoModel.js';

const rk = {};

rk.joinRankedQueue = async (req, res) => {
  const { steamId, displayName, avatar } = req.session;
  if (!steamId || !displayName || !avatar) {
    return res.send("No estás logueado.");
  }

  // Obtener la única cola activa (o crearla si no existe)
  let ranked = await RankedModel.findOne();
  if (!ranked) {
    ranked = new RankedModel({ players: [], rankedA: { players: [] }, rankedB: { players: [] } });
  }

  // Verificar si el jugador ya está en la cola
  const exists = ranked.players.some(p => p.steamId === steamId);
  if (exists) {
    //return res.send("Ya estás en la cola. Espera a que se llene.");
    return res.redirect('/cola?alert=ya_estás_en_la_cola');
  }

  // Agregar jugador a la cola
  ranked.players.push({ steamId, displayName, avatar });
  await ranked.save();

  // Verificar si hay 8 para formar equipos
  if (ranked.players.length === 8) {
    // Separar en dos equipos
    ranked.rankedA.players = ranked.players.slice(0, 4);
    ranked.rankedB.players = ranked.players.slice(4, 8);
    await ranked.save();
    console.log("Partida RANKED lista");

    // Puedes guardar en sesión para mostrar la partida actual
    req.session.rankedReady = true;
  }

  res.redirect('/cola');
}

rk.leaveQueue = async (req, res) => {
  const { steamId } = req.session;
  if (!steamId) return res.redirect('/ranked/cola?alert=not_logged');

  const ranked = await RankedModel.findOne();
  if (!ranked) return res.redirect('/ranked/cola?alert=no_queue');

  // Filtramos al jugador fuera de la cola
  ranked.players = ranked.players.filter(player => player.steamId !== steamId);

  // También lo sacamos de los equipos si ya estaba asignado
  ranked.rankedA.players = ranked.rankedA.players.filter(player => player.steamId !== steamId);
  ranked.rankedB.players = ranked.rankedB.players.filter(player => player.steamId !== steamId);

  await ranked.save();

  console.log(`${steamId} salió de la cola`);

  res.redirect('/home');
}

rk.viewRankedMatch = async (req, res) => {
  let user;
  const { steamId } = req.session;

  // buscar ranked
  const ranked = await RankedModel.findOne();

  // ver todo los objetos
  const rankeds = await RankedModel.find();
  const steam = await Steam.find();
  const game = await Game.find();
  const clip = await Clip.find();

  const lengthSteam = steam.length
  const lengthGame = game.length
  const lengthClip = clip.length
  const lengthRanked = rankeds.length

  // ver la cantidad de jugadores que se unieron
  const rankedPlayers = ranked.players.length;

  // ver quien tiene mas elo
  steam.sort((a, b) => (b.elo || 800) - (a.elo || 800));

  if (!ranked) return res.send("No hay partida activa.");

  if (steamId) {
    user = await Steam.findOne({user});
  }

  const inMatch = ranked.rankedA.players.concat(ranked.rankedB.players).some(p => p.steamId === steamId);
  const inQueue = ranked.players.some(p => p.steamId === steamId);

  if (!inQueue && !inMatch) {
    return res.send("No estás en la cola ni en una partida.");
  }

  console.log("PLAYER RANKED", rankedPlayers, "/ 8");

  res.render('cola', {
    queue: ranked.players,
    teamA: ranked.rankedA.players,
    teamB: ranked.rankedB.players,
    rankedPlayers,
    elo: user?.elo,
    lengthSteam,
    lengthGame,
    lengthClip,
    lengthRanked,
    steam
  });
}

export default rk;
