const mongooes = require("mongoose");
const Schema = mongooes.Schema;

const ProjectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    version_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Version",
      },
    ],
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    project_comment: {
      type: String,
    },


    tags: [
      {
        name :{
          type: String,
        },
        colour : {
          type: String,
          default: "black",
        },
        
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongooes.model("Project", ProjectSchema);
module.exports = Project;
