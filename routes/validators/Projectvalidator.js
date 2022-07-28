const Project = require("../../models/Project");
const { User } = require("../../models/User");

//create a new project
async function createProject(req, res, next) {
  const projectData = req.body;
  try {
    //if project name is not provided, use the project id
    if (!projectData.projectName) {
      res.status(400).send({
        message: "Project name is required",
        required_field: "projectName",
      });
    } else {
      //check if project name is already in use
      const project = await Project.findOne({
        projectName: projectData.projectName,
      });
      if (project) {
        res.status(400).send({ message: "Project name already in use" });
      } else {
        next();
      }
    }
  } catch (error) {
    res.json(error);
  }
}

//verify project access
async function verifyProjectAccess(req, res, next) {
  const id = req.params.id;
  try {
    const project = await Project.findById(id);
    if (project) {
      //check if user is the owner of the project or collaborator
      if (project.user_id.toString() === req.userId) {
        next();
      } else if (project.collaborators.includes(req.userId)) {
        next();
        // } else if  user is admin, allow access
      } else if (req.IsAdmin === true) {
        next();
      } else {
        res.status(403).send({ message: "You are not authorized" });
      }
    } else {
      res.status(404).send({ message: "Project not found" });
    }
  } catch (error) {
    res.json(error);
  }
}

//version create
async function createVersion(req, res, next) {
  const versionData = req.body;
  let project_id = req.params.id;
  let user = await User.findById(req.userId);
  try {
    //check comments and previousVersion_id are provided
    if (!versionData.comments) {
      console.log("comments not provided");
      res.status(400).send({
        message: "Comments are required",
        required_field: "comments",
      });
    } else {
      //generate a new version name
      const project = await Project.findById(project_id);

      if (project) {
        let versionName = `Version_${project.version_id.length + 1}`;
        req.body.versionName = versionName;
        req.body.project_id = project_id;
        req.body.key = `${user.firstName}/${project.projectName}/${versionName}`;
        next();
      } else {
        res.status(404).send({ message: "Project not found" });
      }
    }
  } catch (error) {
    res.json(error);
  }
}

//check if user is owner of the project
async function checkOwner(req, res, next) {
  const id = req.params.id;
  try {
    const project = await Project.findById(id);
    if (project) {
      if (project.user_id.toString() === req.userId) {
        next();
      } else {
        res.status(403).send({ message: "You are not authorized" });
      }
    } else {
      res.status(404).send({ message: "Project not found" });
    }
  } catch (error) {
    res.json(error);
  }
}


module.exports = {
  createProject,
  verifyProjectAccess,
  createVersion,
  checkOwner,
};
