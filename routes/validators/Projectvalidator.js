const Project = require("../../models/Project");
const { User } = require("../../models/User");

//create a new project
async function createProject(req, res, next) {
  const projectData = req.body;
  try {
    if (req.files) {
      projectData.artWork = req.files.artWork.data;
      projectData.bounces = [];
      projectData.samples = [];
      let bounces = req.files.bounces;
      for (let i = 0; i < bounces.length; i++) {
        //  {
        //   name = bounces[i].originalname,
        //   data = bounces[i].data,
        //  }
        projectData.bounces[i] = {
          name: bounces[i].name,
          data: bounces[i].data,
        };
      }

      let samples = req.files.samples;
      for (let i = 0; i < samples.length; i++) {
        projectData.samples[i] = {
          name: samples[i].name,
          data: samples[i].data,
        };
      }
    }

    if (
      !projectData.projectName ||
      !projectData.artWork ||
      !projectData.artistName ||
      !projectData.bounces ||
      !projectData.samples ||
      !projectData.description
    ) {
      return res.status(400).json({
        message: {
          required_field: [
            "projectName",
            "artWork",
            "artistName",
            "bounces",
            "samples",
            "description",
          ],

          message: "All fields are required",
        },
      });
    }
    //check if project name is already in use by the user
    const project = await Project.findOne({
      projectName: projectData.projectName,
      user_id: req.userId,
    });
    if (project) {
      return res.status(400).json({
        message: "Project name already in use",
      });
    }
    next();
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
      console.log(project.user_id.toString());
      console.log(req.userId);
      //check if user is the owner of the project or collaborator
      if (project.user_id.toString() === req.userId.toString()) {
        next();
      } else if (project.collaborators.includes(req.userId)) {
        next();
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
  if(req.params.id === undefined){
   res.status(400).send({message: "Project id is required"})
  }


  let user = await User.findById(req.userId);
  try {
    //check comments , previousVersion_id , versionName , bounces , samples , project_id
    if(req.files){
      versionData.bounces = [];
      versionData.samples = [];
      let bounces = req.files.bounces;
      for (let i = 0; i < bounces.length; i++) {
        //  {
        //   name = bounces[i].originalname,
        //   data = bounces[i].data,
        //  }
        versionData.bounces[i] = {
          name: bounces[i].name,
          data: bounces[i].data,
        };
      }

      let samples = req.files.samples;
      for (let i = 0; i < samples.length; i++) {  
        versionData.samples[i] = {
          name: samples[i].name,
          data: samples[i].data,
        };
      }
      
      
      
    


    }

    if (
      !versionData.comments ||
      !versionData.previousVersion_id ||
      !versionData.versionName ||
      !versionData.bounces ||
      !versionData.samples
    ) {
      return res.status(400).json({
        message: {
          required_field: [
            "comments",
            "previousVersion_id",
            "versionName",
            "bounces",
            "samples"         
           ],

          message: "All fields are required",
        },
      });
    } else {
      //generate a new version name
      const project = await Project.findById(project_id);
      if (project) {
        next();
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

//project update validator
async function updateProject(req, res, next) {
  const projectData = req.body;
  //if user is send anythig other than this fields, it will be ignored
  const allowedFields = ["projectName", "artWork", "artistName", "description"];

  const fields = Object.keys(projectData);
  const isValidOperation = fields.every((field) =>
    allowedFields.includes(field)
  );
  if (!isValidOperation) {
    return res.status(400).send({ message: "Invalid updates" });
  }
  next();
}

module.exports = {
  createProject,
  verifyProjectAccess,
  createVersion,
  checkOwner,
  updateProject,
};
