const Support = require('../models/support.model');
const { cloudinary } = require('../config/cloudinary');

exports.createTicket = async (req, res) => {
  try {
    const { category, subject, description } = req.body;

    const ticket = new Support({
      user: req.user.id,
      category,
      subject,
      description,
    });

    if (req.file) {
      ticket.attachment = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    await ticket.save();
    res.status(201).json({ msg: 'Ticket submitted', ticket });
  } catch (err) {
    res.status(500).json({ msg: 'Ticket creation failed', error: err.message });
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Support.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Support.find().populate('user', 'email').sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};

exports.replyTicket = async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

    ticket.replies.push({ sender: 'admin', message });
    ticket.status = 'in-progress';
    await ticket.save();

    res.status(200).json({ msg: 'Reply added', ticket });
  } catch (err) {
    res.status(500).json({ msg: 'Reply failed', error: err.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Support.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });
    res.status(200).json({ msg: 'Status updated', ticket });
  } catch (err) {
    res.status(500).json({ msg: 'Status update failed', error: err.message });
  }
};
