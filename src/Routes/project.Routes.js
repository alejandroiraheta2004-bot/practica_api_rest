const express = require('express');
const projectController = require('../controllers/projectController');
const upload = require('../config/multer');

const router = express.Router();

router.post('/', upload.single('document'), projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', upload.single('document'), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;