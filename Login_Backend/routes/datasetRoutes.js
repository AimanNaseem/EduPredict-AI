const express = require("express");

const { deleteDataset, downloadDataset, listDatasets, uploadDataset } = require("../controllers/datasetController");
const { upload } = require("../middleware/upload");


const datasetRoutes = express.Router();

datasetRoutes.post('/upload', upload.single('file'), uploadDataset);
datasetRoutes.get('/', listDatasets);
datasetRoutes.delete('/:id', deleteDataset);
datasetRoutes.get('/:id/download', downloadDataset);

module.exports = datasetRoutes;