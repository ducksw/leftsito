import mongoose from "mongoose";
const { Schema, model } = mongoose;

const RankedScheme = new Schema({
  //code: { type: String, unique: true, required: true },
  players: [{ steamId: String, displayName: String, avatar: String }],
  rankedA: { players: [{ steamId: String, displayName: String, avatar: String }], points: { type: String, default: "0" } },
  rankedB: { players: [{ steamId: String, displayName: String, avatar: String }], points: { type: String, default: "0" } }
});

export default model('RankedModel', RankedScheme);