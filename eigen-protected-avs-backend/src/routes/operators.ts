import { Router, Request, Response, RequestHandler, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { operatorSchema, stakeUpdateSchema } from '../types/schemas';

const router = Router();
const prisma = new PrismaClient();

router.get('/', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const operators = await prisma.operator.findMany();
    const serializedOperators = operators.map((op: { stake: bigint }) => ({
      ...op,
      stake: op.stake.toString()
    }));
    res.json(serializedOperators);
  } catch (error: unknown) {
    next(error);
  }
}) as RequestHandler);

router.post('/', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = operatorSchema.parse(req.body);
    console.log('Received request body:', req.body);
    if (!address) return res.status(400).json({ error: 'Address required' });

    // Check if operator already exists
    const existingOperator = await prisma.operator.findUnique({
      where: { id: address }
    });

    if (existingOperator) {
      return res.status(409).json({ 
        error: 'Operator already exists',
        operator: {
          ...existingOperator,
          stake: existingOperator.stake.toString()
        }
      });
    }

    // Create new operator if doesn't exist
    const operator = await prisma.operator.create({
      data: { id: address, address, stake: BigInt(0), fraudCount: 0, updatedAt: new Date() }
    });

    const serializedOperator = {
      ...operator,
      stake: operator.stake.toString()
    };
    res.status(201).json(serializedOperator);
  } catch (error: unknown) {
    next(error);
  }
}) as RequestHandler);

// Update operator stake
router.put('/:address/stake', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stake } = stakeUpdateSchema.parse(req.body);
    const { address } = req.params;

    if (!stake) return res.status(400).json({ error: 'Stake amount required' });

    const operator = await prisma.operator.update({
      where: { id: address },
      data: { 
        stake: BigInt(stake),
        updatedAt: new Date()
      }
    });

    const serializedOperator = {
      ...operator,
      stake: operator.stake.toString()
    };
    res.json(serializedOperator);
  } catch (error: unknown) {
    next(error);
  }
}) as RequestHandler);

// Update operator fraud count
router.put('/:address/fraud', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.params;
    const operator = await prisma.operator.update({
      where: { id: address },
      data: { 
        fraudCount: { increment: 1 },
        updatedAt: new Date()
      }
    });
    const serializedOperator = {
      ...operator,
      stake: operator.stake.toString()
    };
    res.json(serializedOperator);
  } catch (error: unknown) {
    next(error);
  }
}) as RequestHandler);

// Get single operator
router.get('/:address', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.params;
    const operator = await prisma.operator.findUnique({
      where: { id: address }
    });

    if (!operator) {
      return res.status(404).json({ error: 'Operator not found' });
    }

    const serializedOperator = {
      ...operator,
      stake: operator.stake.toString()
    };
    res.json(serializedOperator);
  } catch (error: unknown) {
    next(error);
  }
}) as RequestHandler);

export default router; 