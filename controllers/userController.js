import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, username, password, confirmpassword, gender } = req.body;
    if (!fullname || !username || !password || !confirmpassword || !gender) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password !== confirmpassword) {
      return res.status(404).json({ message: "passwords are not match" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ message: "Username already exists try different" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const profilePhotoPathmale = `https://avatar.iran.liara.run/public/boy?username=${username}`;

    const profilePhotoPathfemale = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    await User.create({
      fullname,
      username,
      password: hashPassword,
      profilePhoto:
        gender === "male" ? profilePhotoPathmale : profilePhotoPathfemale,
      gender,
    });
    return res.status(200).json({
      message: "register successfully",
      fullname: fullname,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).jason({ message: "All fields are required." });
    }
    const user = await User.findOne({ username });
    // console.log(user);
    if (!user) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    // console.log(tokenData);
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    // console.log(token);
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "strict",
      })
      .json({
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        profilePhoto: user.profilePhoto,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", " ", { maxAge: 0 })
      .json({ message: "Come back soon" });
  } catch (error) {
    console.log(error);
  }
};

export const getOtherUser = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const otherUser = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    return res.status(200).json({
      otherUser,
    });
  } catch (error) {
    console.log(error);
  }
};
