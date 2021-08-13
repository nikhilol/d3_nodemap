/* eslint-disable max-len */

// API for the Nodemap app. Contains endpoints with various funcitons
exports.api = require("./API/API");

// Signup automations - user added to notion with details
exports.signup = require("./Automations/signup");

// Update the user to the status of 'creator' in Notion when first plan imported
exports.creators = require("./Automations/accountTypeNotion");

// Automation to create a new brainstorming section on Notion  each day
exports.createBrainstormSpaceDaily = require("./Automations/Notion/CreateBrainstormSpaceDaily");
