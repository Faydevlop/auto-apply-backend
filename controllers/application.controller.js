const Application = require('../models/application.model');

// Add a new application (single or bulk)
exports.addApplication = async (req, res) => {
  try {
    const user = req.user.id;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    const apps = data.map((item) => ({ ...item, user }));
    await Application.insertMany(apps);

    res.status(201).json({ msg: 'Applications added' });
  } catch (err) {
    res.status(500).json({ msg: 'Add failed', error: err.message });
  }
};

// Get all application history
exports.getHistory = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = { user: req.user.id };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { company: new RegExp(search, 'i') },
        { role: new RegExp(search, 'i') }
      ];
    }

    const list = await Application.find(filter).sort({ sentAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};

// Dashboard stats
exports.getStats = async (req, res) => {
  try {
    const user = req.user.id;
    const apps = await Application.find({ user });

    const total = apps.length;
    const sent = apps.filter((a) => a.status === 'sent').length;
    const failed = apps.filter((a) => a.status === 'failed').length;

    const successRate = total > 0 ? Math.round((sent / total) * 100) : 0;

    // Weekly chart
    const week = Array(7).fill(0);
    const now = new Date();

    apps.forEach((a) => {
      const day = (new Date(a.sentAt)).getDay();
      week[day]++;
    });

    res.json({
      total,
      sent,
      failed,
      successRate,
      weekly: week
    });
  } catch (err) {
    res.status(500).json({ msg: 'Stat fetch failed', error: err.message });
  }
};

// Send Application (Multi or Single)
exports.sendApplication = async (req, res) => {
  const {
    recipientEmail,
    company,
    role,
    jobDescription,
    templateId,
    status,
    errorMessage
  } = req.body;

  try {
    const application = await Application.create({
      userId: req.user.id,
      recipientEmail,
      company,
      role,
      jobDescription,
      status: status || 'pending',
      templateUsed: templateId || null,
      errorMessage: errorMessage || ''
    });

    res.status(201).json({ msg: 'Application recorded', application });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save application', error: err.message });
  }
};

// Get all applications for current user
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id }).sort({ dateSent: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch history', error: err.message });
  }
};

// Update response status (optional)
exports.updateResponse = async (req, res) => {
  const { response } = req.body;
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { response },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update', error: err.message });
  }
};


exports.createApplication = async (req, res) => {
  try {
    const { applications } = req.body; // Array of job rows
    const created = await Application.insertMany(
      applications.map(item => ({ ...item, userId: req.user.id }))
    );
    res.status(201).json({ msg: 'Applications saved', data: created });
  } catch (err) {
    res.status(500).json({ msg: 'Create failed', error: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  const data = await Application.find({ userId: req.user.id }).populate('templateId');
  res.status(200).json(data);
};

exports.sendBulkApplications = async (req, res) => {
  try {
    const { ids } = req.body; // application _id array
    const applications = await Application.find({ _id: { $in: ids }, userId: req.user.id }).populate('templateId');

    const results = await Promise.all(applications.map(async (app) => {
      try {
        await sendEmailWithTemplate(app.recipientEmail, app.templateId.content, {
          role: app.role,
          company: app.company,
          description: app.jobDescription
        });

        app.status = 'sent';
        app.sentAt = new Date();
        await app.save();
        return { id: app._id, status: 'sent' };
      } catch {
        app.status = 'failed';
        await app.save();
        return { id: app._id, status: 'failed' };
      }
    }));

    res.status(200).json({ msg: 'Processed', result: results });
  } catch (err) {
    res.status(500).json({ msg: 'Bulk send failed', error: err.message });
  }
};