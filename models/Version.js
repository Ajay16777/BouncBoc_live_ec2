const mongooes = require("mongoose");
const Schema = mongooes.Schema;

const VersionSchema = new Schema(
  {
    versionName: {
      type: String,
      required: true,
    },
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    previousVersion_id: {
      type: Schema.Types.ObjectId,
      ref: "Version",
    },
    version_comment: {
      type: String,
      required: true,
    },

    // version_folder_path: {
    //   type: String,
    // },

    Version_Bounces: [
      {
        Etag: {
          type: String,
        },
        VersionId: {
          type: String,
        },
        Location: {
          type: String,
        },
        Key: {
          type: String,
        },
        Bucket: {
          type: String,
        },
      },
    ],

    Version_Samples: [
      {
        Etag: {
          type: String,
        },
        VersionId: {
          type: String,
        },
        Location: {
          type: String,
        },
        Key: {
          type: String,
        },
        Bucket: {
          type: String,
        },
      },
    ]


 
  },
  {
    timestamps: true,
  }
);

const Version = mongooes.model("Version", VersionSchema);
module.exports = Version;
