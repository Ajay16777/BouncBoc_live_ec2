const Version = require("../models/Version");
const Utils = require("../utils/utils");
const Project = require("../models/Project");
const Projectvalidator = require("../routes/validators/Projectvalidator");

//createVersion
async function createVersion(req, res) {
  try {
    let files = req.body.files;
    let dir1 = req.body.dir;
    let key = req.body.key;

    let upload_data = await Utils.uploadFiles(files, dir1, key);

    let versionData = req.body;

    versionData.version_file = upload_data;
    versionData.version_comment = req.body.comments;
    versionData.version_folder_path = key;

    let version = await Version.create(versionData);
    if (version) {
      //update project version_id
      let project = await Project.findByIdAndUpdate(
        req.params.id,
        {
          $push: { version_id: version._id },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.send(version);
    } else {
      res.status(400).send({ message: "Version not created" });
    }
  } catch (error) {
    res.json(error);
  }
}

// getAllVersions
async function getAllVersions(req, res) {
  try {
    let versions = await Version.find({ project_id: req.params.id });
    if (versions) {
      res.send(versions);
    } else {
      res.status(400).send({ message: "No versions found" });
    }
  } catch (error) {
    res.json(error);
  }
}

// getVersionById
async function getVersionById(req, res) {
  try {
    let id = req.params.version_id;
    console.log(id);
    let version = await Version.findById(id);
    //check project access permission
    if (version) {
      res.send(version);
    } else {
      res.status(400).send({ message: "No version found" });
    }
  } catch (error) {
    res.json(error);
  }
}

// deleteVersionById
async function deleteVersionById(req, res) {
  try {
    let id = req.params.version_id;
    let version = await Version.findById(id);
    console.log(version);
    let path = version.version_folder_path;
    //delete version folder
    let data = await Utils.deleteFolder(path);
    console.log("sdsf", data);
    if (data) {
      //delete version from project
      let project = await Project.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { version_id: id },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (project) {
        //delete version
        let version = await Version.findByIdAndDelete(id);
        if (version) {
          res.send({ message: "Version deleted" });
        } else {
          res.status(400).send({ message: "Version not deleted" });
        }
      } else {
        res.status(400).send({ message: "Version not deleted" });
      }
    } else {
      res.status(400).send({ message: "Version not deleted" });
    }
  } catch (error) {
    res.json(error);
  }
}

module.exports = {
  createVersion,
  getAllVersions,
  getVersionById,
  deleteVersionById,
};
