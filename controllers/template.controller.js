const Template = require('../models/template.model');

// Create a new template (Admin or User submitted)
exports.createTemplate = async (req, res) => {
  try {
    const { title, content, category, type } = req.body;
    const createdBy = req.user?.email || 'System';
    const status = type === 'custom' ? 'pending' : 'active';

    const newTemplate = await Template.create({
      title, content, category, type, createdBy, status
    });

    res.status(201).json({ msg: 'Template created', template: newTemplate });
  } catch (err) {
    res.status(500).json({ msg: 'Template creation failed', error: err.message });
  }
};

// List templates for users (only active)
exports.getTemplatesForUser = async (req, res) => {
  try {
    const templates = await Template.find({ status: 'active' }).sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};

// Admin: get all templates (with filters)
exports.getAllTemplates = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;

    const templates = await Template.find(filters).sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ msg: 'Admin fetch failed', error: err.message });
  }
};

// Admin: approve or reject submitted template
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const template = await Template.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!template) return res.status(404).json({ msg: 'Template not found' });
    res.status(200).json({ msg: `Template ${status}`, template });
  } catch (err) {
    res.status(500).json({ msg: 'Status update failed', error: err.message });
  }
};

// Admin: edit template
exports.editTemplate = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const updated = await Template.findByIdAndUpdate(req.params.id, {
      title, content, category
    }, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Template not found' });
    res.status(200).json({ msg: 'Template updated', updated });
  } catch (err) {
    res.status(500).json({ msg: 'Update failed', error: err.message });
  }
};

// Admin: delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Template not found' });
    res.status(200).json({ msg: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed', error: err.message });
  }
};
