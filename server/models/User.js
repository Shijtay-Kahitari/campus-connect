import mongoose from "mongoose";

let profile_imgs_name_list = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];
let profile_imgs_collections_list = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  profile: {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bio: {
      type: String,
      maxlength: [200, "Bio should not be more than 200"],
      default: "",
    },
    resume: { type: String },
    skills: [String],
    interests: [String],
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
    },
    placed: { type: Boolean, default: false },
  },
  experience: String,
  verified: { type: Boolean, default: false },
  social_links: {
    youtube: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
  },
  profilePicture: {
    type: String,
    default: () => {
      return `https://api.dicebear.com/6.x/${
        profile_imgs_collections_list[
          Math.floor(Math.random() * profile_imgs_collections_list.length)
        ]
      }/svg?seed=${
        profile_imgs_name_list[
          Math.floor(Math.random() * profile_imgs_name_list.length)
        ]
      }`;
    },
  },
  posts: [
    {
      text: { type: String },
      imageUrl: { type: String },
    },
  ],

  completedProfile: { type: Boolean, default: false },
});

export default mongoose.model("User", UserSchema);
