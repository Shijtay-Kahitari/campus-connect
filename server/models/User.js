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

const UserSchema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    student_id: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    academic_year: { type: String },
    passing_year: { type: String },
    dob: { type: Date },
    phone_number: { type: Date },
    department: { type: String, default: "Datta Meghe Collge Of Enginering" },
    college_name: { type: String },
    password: { type: String },
    bio: {
      type: String,
      maxlength: [200, "Bio should not be more than 200"],
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
    },
    resume: {
      type: [Schema.Types.ObjectId],
      ref: "resume",
    },
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
    posts: {
      type: [Schema.Types.ObjectId],
      ref: "post",
    },

    completedProfile: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
    },
  }
);

export default mongoose.model("User", UserSchema);
