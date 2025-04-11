import Video from '../models/VideoModel.js';

const vd = {};

vd.video_create = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.send("Debes iniciar sesión con Steam para subir clips");
    }

    const { title, link } = req.body;

    const newVideo = new Video({
      title,
      link,
      creator: {
        id: req.user.id,
        name: req.user.displayName
      }
    });

    console.log(newVideo);
    await newVideo.save();

    res.redirect('/clips');
  } catch (error) {
    console.log(error);
  }
}

vd.video_view = async (req, res) => {
  try {
    const video_id = req.params.id;
    const videos = await Video.findById(video_id);
    const all_clip = await Video.find();
    all_clip.reverse();

    res.render('viewClip', { videos, all_clip, video_id });
  } catch (error) {
    console.log(error);
  }
}

vd.allVideo = async (req, res) => {
  const clips = await Video.find();
  clips.reverse()
  console.log("TOTAL CLIPS", clips);

  res.render('clips', { clips });
}

export default vd;