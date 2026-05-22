const { PrismaClientKnownRequestError, PrismaClientValidationError } = require('@prisma/client/runtime/library');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] ?? 'field';
      return res.status(400).json({ message: `${field} already exists` });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Record not found' });
    }
    if (err.code === 'P2023') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
  }

  if (err instanceof PrismaClientValidationError) {
    return res.status(400).json({ message: 'Validation error: ' + err.message.split('\n').pop() });
  }

  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
};

module.exports = errorHandler;
