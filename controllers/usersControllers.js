import * as fs from "node:fs/promises";
import path from "node:path";
import jimp from "jimp"; 
import User from "../models/userModel.js";

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (!user.avatarURL) { 
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(path.resolve("public/avatars", user.avatarURL));
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    const file = await jimp.read(req.file.path);
    await file.resize(250, 250).writeAsync(req.file.path);

    const newAvatarName = `${req.user.id}-${Date.now()}${path.extname(req.file.originalname)}`;
    const newAvatarPath = path.resolve("public/avatars", newAvatarName);
    
    await fs.rename(req.file.path, newAvatarPath);

    const avatarURL = `/avatars/${newAvatarName}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

export default { getAvatar, uploadAvatar };
