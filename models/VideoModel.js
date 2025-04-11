import mongoose from "mongoose";
const { Schema, model } = mongoose;

const videoSchema = new Schema({
  title: { type: String },
  link: { type: String, trim: true, match: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/ },
  thumbnail_url: { type: String },
  creator: { id: { type: String }, name: { type: String } },
  timestamp: { type: Date, default: Date.now },
});

videoSchema.pre('save', function(next) {
  if (this.link) {
    const videoIdMatch = this.link.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[^\w]|\?|$)/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      this.link = `https://www.youtube.com/embed/${videoId}`;
      this.thumbnail_url = videoId;
    }
  }
  next();
});

export default model('VideoModel', videoSchema); 