const Plan = require('../models/plan.model');

exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ msg: 'Plan created', plan });
  } catch (err) {
    res.status(500).json({ msg: 'Create failed', error: err.message });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ msg: 'Plan updated', plan });
  } catch (err) {
    res.status(500).json({ msg: 'Update failed', error: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed', error: err.message });
  }
};
