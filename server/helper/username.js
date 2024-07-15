import { nanoid } from "nanoid";
import User from "../models/User.js";
export const genereteUsername = async (email) => {
  let username = email.split("@")[0];
  console.log(`Initial username: ${username}`);

  try {
    const usernameNotUnique = await User.findOne({
      username,
    });

    if (usernameNotUnique) {
      username += nanoid().substring(0, 5);
      console.log(`Updated username: ${username}`);
    }
    let sanitizedUsername = username.toLowerCase();
    sanitizedUsername = sanitizedUsername.replace(/\s+/g, '');

    return sanitizedUsername;
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    throw new Error("Error generating username");
  }
};
