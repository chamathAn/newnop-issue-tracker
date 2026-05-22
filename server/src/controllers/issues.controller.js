const prisma = require('../config/prisma');
const { issuesToCSV } = require('../utils/exportHelpers');

const userSelect = { id: true, name: true, email: true };
const include = {
  assignee: { select: userSelect },
  createdBy: { select: userSelect },
};

const mapId = ({ id, ...rest }) => ({ _id: id, ...rest });

const mapIssue = (issue) => {
  if (!issue) return null;
  const { id, assigneeId, createdById, assignee, createdBy, ...rest } = issue;
  return {
    _id: id,
    ...rest,
    ...(assignee ? { assignee: mapId(assignee) } : { assignee: null }),
    createdBy: createdBy ? mapId(createdBy) : null,
  };
};

const buildWhere = ({ search, status, priority, severity, assignee }) => {
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (severity) where.severity = severity;
  if (assignee) where.assigneeId = assignee;
  return where;
};

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

    const where = buildWhere({ search, status, priority, severity, assignee });

    const orderField = sort.startsWith('-') ? sort.slice(1) : sort;
    const orderDir = sort.startsWith('-') ? 'desc' : 'asc';
    const orderBy = { [orderField]: orderDir };

    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        include,
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.issue.count({ where }),
    ]);

    res.json({
      issues: issues.map(mapIssue),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

const exportIssues = async (req, res, next) => {
  try {
    const { format = 'json', search, status, priority, severity, assignee } = req.query;
    const where = buildWhere({ search, status, priority, severity, assignee });

    const issues = await prisma.issue.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
    });

    const mapped = issues.map(mapIssue);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="issues.csv"');
      return res.send(issuesToCSV(mapped));
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="issues.json"');
    res.json(mapped);
  } catch (err) {
    next(err);
  }
};

const getIssue = async (req, res, next) => {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: req.params.id },
      include,
    });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(mapIssue(issue));
  } catch (err) {
    next(err);
  }
};

const createIssue = async (req, res, next) => {
  try {
    const { title, description, priority, severity, assignee } = req.body;
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        priority,
        ...(severity ? { severity } : {}),
        ...(assignee ? { assigneeId: assignee } : {}),
        createdById: req.user.id,
      },
      include,
    });
    res.status(201).json(mapIssue(issue));
  } catch (err) {
    next(err);
  }
};

const updateIssue = async (req, res, next) => {
  try {
    const allowed = ['title', 'description', 'status', 'priority', 'severity', 'assignee'];
    const data = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === 'assignee') {
          data.assigneeId = req.body[key] || null;
        } else if (key === 'severity') {
          data.severity = req.body[key] || null;
        } else {
          data[key] = req.body[key];
        }
      }
    }

    const issue = await prisma.issue.update({
      where: { id: req.params.id },
      data,
      include,
    });
    res.json(mapIssue(issue));
  } catch (err) {
    next(err);
  }
};

const deleteIssue = async (req, res, next) => {
  try {
    await prisma.issue.delete({ where: { id: req.params.id } });
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getIssues, exportIssues, getIssue, createIssue, updateIssue, deleteIssue };
