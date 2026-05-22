const Issue = require('../models/Issue');
const { issuesToCSV } = require('../utils/exportHelpers');

const getIssues = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      severity,
      assignee,
      page = 1,
      limit = 20,
      sort = '-createdAt',
    } = req.query;

    const query = {};
    if (search) query.$text = { $search: search };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (severity) query.severity = severity;
    if (assignee) query.assignee = assignee;

    const [issues, total] = await Promise.all([
      Issue.find(query)
        .populate('assignee', 'name email')
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      Issue.countDocuments(query),
    ]);

    res.json({ issues, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

const exportIssues = async (req, res, next) => {
  try {
    const { format = 'json', search, status, priority, severity, assignee } = req.query;

    const query = {};
    if (search) query.$text = { $search: search };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (severity) query.severity = severity;
    if (assignee) query.assignee = assignee;

    const issues = await Issue.find(query)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="issues.csv"');
      return res.send(issuesToCSV(issues));
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="issues.json"');
    res.json(issues);
  } catch (err) {
    next(err);
  }
};

const getIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    next(err);
  }
};

const createIssue = async (req, res, next) => {
  try {
    const { title, description, priority, severity, assignee } = req.body;
    const issue = await Issue.create({
      title,
      description,
      priority,
      severity: severity || undefined,
      assignee: assignee || undefined,
      createdBy: req.user.id,
    });
    const populated = await issue.populate(['assignee', 'createdBy']);
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

const updateIssue = async (req, res, next) => {
  try {
    const allowed = ['title', 'description', 'status', 'priority', 'severity', 'assignee'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key] || undefined;
    }

    const issue = await Issue.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    next(err);
  }
};

const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getIssues, exportIssues, getIssue, createIssue, updateIssue, deleteIssue };
