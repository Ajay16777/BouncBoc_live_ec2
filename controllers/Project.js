const Project = require("../models/Project");
const { User } = require("../models/User");

//create a new project
async function createProject(req, res) {
  let user_id = req.userId;

  const projectData = req.body;
  projectData.user_id = user_id;
  try {
    const project = await new Project(projectData);
    if (project) {
      const user = await User.findByIdAndUpdate(
        user_id,
        {
          $push: { project_id: project._id },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await project.save();
      res.send(project);
    }
  } catch (error) {
    res.json(error);
  }
}

// getAllProjects
async function getAllProjects(req, res) {
  let user_id = req.userId;
  try {
    const projects = await Project.find({ user_id });
    res.send(projects);
  } catch (error) {
    res.json(error);
  }
}

//getProjectById
async function getProjectById(req, res) {
  let user_id = req.userId;
  let project_id = req.params.id;
  try {
    const project = await Project.findById(project_id);
    if (project) {
      res.send(project);
    } else {
      res.status(404).send({ message: "Project not found" });
    }
  } catch (error) {
    res.json(error);
  }
}

//updateProjectById
async function updateProjectById(req, res) {
  let user_id = req.userId;
  let project_id = req.params.id;
  const projectData = req.body;
  try {
    const project = await Project.findByIdAndUpdate(project_id, projectData, {
      new: true,
      runValidators: true,
    });
    if (project) {
      res.send(project);
    } else {
      res.status(404).send({ message: "Project not found" });
    }
  } catch (error) {
    res.json(error);
  }
}

// deleteProjectById
async function deleteProjectById(req, res) {
  let user_id = req.userId;
  let project_id = req.params.id;
  try {
    const project = await Project.findByIdAndDelete(project_id);
    if (project) {
      const user = await User.findByIdAndUpdate(
        user_id,
        {
          $pull: { project_id: project_id },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.json({ message: "Project deleted", project });
    } else {
      res.status(404).send({ message: "Project not found" });
    }
  } catch (error) {
    res.json(error);
  }
}

//sendCollaboratorRequest
async function sendCollaboratorRequest(req, res) {
  let user_id = req.userId;
  let project_id = req.params.id;
  try {
    let collaborator = await User.findOne({
      email: req.body.collaborator_email,
    });
    if (collaborator) {
      let project_access_request = {
        user_id: user_id,
        project_id: project_id,
        collaborator_id: collaborator._id,
        message: req.body.message,
      };
      const user = await User.findByIdAndUpdate(
        collaborator._id,
        {
          $push: { project_access_request: project_access_request },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      const project = await Project.findByIdAndUpdate(
        project_id,
        {
          $push: { collaborator_requests: collaborator._id },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.json({ message: "Collaborator request sent", user, project });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.json(error);
  }
}

// deleteCollaborator
async function deleteCollaborator(req, res) {
  let user_id = req.userId;
  let project_id = req.params.id;
  let collaborator_id = req.params.collaborator_id;
  try {
    const project = await Project.findByIdAndUpdate(
      project_id,
      {
        $pull: { collaborator_requests: collaborator_id },
        $pull: { collaborators: collaborator_id },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (project) {
      res.json({ message: "Collaborator deleted", user, project });
    } else {
      res.status(404).send({ message: "Project not found" });
    }
  } catch (error) {
    res.json(error);
  }
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  sendCollaboratorRequest,
  deleteCollaborator,
};
