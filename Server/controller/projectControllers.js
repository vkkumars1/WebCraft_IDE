const { Project }  = require("../models/projectModals.js");
const { User } = require("../models/userModals.js");





module.exports.Project = async (req, res) => {
  const { userId, title } = req.body;
  try {
    const user = await User.findOne({ _id:userId });

    // Check if user exists
    if (user) {
         // Create a new user with hashed password
    const newProject = await new Project({ title, createdBy:userId });

    // Save the user to the database
    await newProject.save();

    // Send success response with new user info
    return res.status(201).json({
      message: "Project Created successfully",
      newProject: {
        id: newProject._id,
        title: newProject.title
      },
    });
         }


  } catch (error) {
    // Handle server errors
    return res.status(500).json({ error: error.message });
  }
};
module.exports.getProjects = async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await User.findOne({ _id:userId });
  
      // Check if user exists
      if (user) {
          
      const getProjects = await Project.find({createdBy:userId});
  
  
      // Send success response with new user info
      return res.status(201).json({
        message: "Projects Fetched successfully",
        projects:getProjects
      });
           }
  
  
    } catch (error) {
      // Handle server errors
      return res.status(500).json({ error: error.message });
    }
  };

module.exports.delProjects = async (req, res) => {
    const { userId,projId } = req.body;
    try {
      const user = await User.findOne({ _id:userId });
  
      // Check if user exists
      if (user) {
           // Create a new user with hashed password
      await Project.findOneAndDelete({_id:projId});
  
  
      // Send success response with new user info
      return res.status(200).json({
        message: "Project Deleted successfully",
        
      });
           }
  
  
    } catch (error) {
      // Handle server errors
      return res.status(500).json({ error: error.message });
    }
  };
  
  module.exports.getCode = async (req, res) => {
    const { userId,projId } = req.body;
    try {
      const user = await User.findOne({ _id:userId });
  
      // Check if user exists
      if (user) {
          
      const getCode = await Project.findOne({_id:projId});
  
  
      // Send success response with new user info
      return res.status(200).json({
        message: "Project Fetched successfully",
        project:getCode
      });
           }
  
  
    } catch (error) {
      // Handle server errors
      return res.status(500).json({ error: error.message });
    }
  };

  module.exports.updateCode = async (req, res) => {
    const { userId,projId,html,css,js } = req.body;
    try {
      const user = await User.findOne({ _id:userId });
  
      // Check if user exists
      if (user) {
          
      const updateCode = await Project.findOneAndUpdate({_id:projId},{
        html:html,
        css:css,
        js:js
      });
  
  
      // Send success response with new user info
      return res.status(200).json({
        message: "Project Updated successfully",
        project:updateCode
      });
           }
  
  
    } catch (error) {
      // Handle server errors
      return res.status(500).json({ error: error.message });
    }
  };


