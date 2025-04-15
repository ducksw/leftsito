import mongoose from "mongoose";
const { Schema, model } = mongoose;

const GameSchema = new Schema({ 
  code: { type: String, unique: true, required: true },
  players: [{ steamId: String, displayName: String, avatar: String }],
  teamA: { players: [{ steamId: String, displayName: String, avatar: String }], points: { type: String, default: "0" } },
  teamB: { players: [{ steamId: String, displayName: String, avatar: String }], points: { type: String, default: "0" } }
});

export default model('GameModel', GameSchema);

