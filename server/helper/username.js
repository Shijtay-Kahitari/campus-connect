import { nanoid } from "nanoid";
import User from "../models/User.js";
export const genereteUsername = async (email) => {
  let username = email.split("@")[0];
  console.log(`Initial username: ${username}`);

  try {
    const usernameNotUnique = await User.findOne({
      "profile.username": username,
    });


    if (usernameNotUnique) {
      username += nanoid().substring(0, 5);
      console.log(`Updated username: ${username}`);
    }

    return username;
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    throw new Error("Error generating username");
  }
};
