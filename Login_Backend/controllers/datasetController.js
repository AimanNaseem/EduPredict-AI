const {bytesToReadable, sizeBucket } = require("../utils/bytesToReadable");
const Dataset = require('../model/Dataset.js');


// POST /api/datasets/upload
exports.uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }

    const { originalname, size, buffer } = req.file;

    const doc = await Dataset.create({
      name: originalname,
      sizeLabel: bytesToReadable(size), // ✅ converted size
      sizeBytes: size,
      fileData: buffer,
    });

    return res.json({
      message: "File uploaded successfully",
      dataset: doc,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
};

// GET /api/datasets
exports.listDatasets = async (req, res) => {
  try {
    const { size } = req.query; // optional filter by bucket

    let query = {};
    if (size === 'small') query.sizeBytes = { $lt: 1 * 1024 * 1024 };
    if (size === 'medium') query.sizeBytes = { $gte: 1 * 1024 * 1024, $lte: 3 * 1024 * 1024 };
    if (size === 'large') query.sizeBytes = { $gt: 3 * 1024 * 1024 };

    const items = await Dataset.find(query).sort({ createdAt: -1 }).lean();

    // Enrich with bucket label for frontend convenience
    const data = items.map((d) => ({
      ...d,
      sizeBucket: sizeBucket(d.sizeBytes),
      date: d.createdAt,
    }));

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch datasets' });
  }
};

// DELETE /api/datasets/:id
exports.deleteDataset = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await Dataset.findById(id);
    if (!found) return res.status(404).json({ error: 'Dataset not found' });

    await found.deleteOne();
    return res.json({ message: 'Dataset deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete dataset' });
  }
};

// GET /api/datasets/:id/download
exports.downloadDataset = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await Dataset.findById(id);
    if (!found) return res.status(404).send('File not found');

    res.setHeader('Content-Disposition', `attachment; filename="${found.name}"`);
    res.setHeader('Content-Type', 'text/csv');
    return res.send(found.fileData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to download dataset' });
  }
};

