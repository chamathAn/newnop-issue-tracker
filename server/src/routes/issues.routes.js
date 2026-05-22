const express = require('express');
const {
  getIssues,
  exportIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
} = require('../controllers/issues.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// export must come before /:id to avoid 'export' being treated as an id
router.get('/export', exportIssues);

router.get('/', getIssues);
router.post('/', createIssue);
router.get('/:id', getIssue);
router.patch('/:id', updateIssue);
router.delete('/:id', deleteIssue);

module.exports = router;
