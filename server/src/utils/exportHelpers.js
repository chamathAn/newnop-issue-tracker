const escapeCSV = (value) => {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
};

const issuesToCSV = (issues) => {
  const headers = [
    'ID',
    'Title',
    'Description',
    'Status',
    'Priority',
    'Severity',
    'Assignee',
    'Created By',
    'Created At',
    'Updated At',
  ].join(',');

  const rows = issues.map((issue) => {
    return [
      escapeCSV(issue._id),
      escapeCSV(issue.title),
      escapeCSV(issue.description),
      escapeCSV(issue.status),
      escapeCSV(issue.priority),
      escapeCSV(issue.severity),
      escapeCSV(issue.assignee?.name),
      escapeCSV(issue.createdBy?.name),
      escapeCSV(issue.createdAt?.toISOString()),
      escapeCSV(issue.updatedAt?.toISOString()),
    ].join(',');
  });

  return [headers, ...rows].join('\n');
};

module.exports = { issuesToCSV };
