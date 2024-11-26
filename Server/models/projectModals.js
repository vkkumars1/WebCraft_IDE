const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
    },
    html: {
      type: String,
      default: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebCraft IDE</title>
 
</head>
<body>
  <div class="hello">Hello, WebCraft IDE!</div>
</body>
</html>
`,
    },
    css: {
      type: String,
      default: `
body { 
  font-family: Arial, sans-serif; 
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f0f0f0;
}
.hello {
  font-size: 24px;
  color: #333;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`,
    },
    js: {
      type: String,
      default: 'console.log("Welcome to WebCraft IDE!");',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); // createdAt & updatedAt

const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
