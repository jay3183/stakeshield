import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.errors
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Resource already exists'
      });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }
  }

  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
} 