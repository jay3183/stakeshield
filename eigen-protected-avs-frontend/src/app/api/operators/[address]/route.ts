import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const operator = await db.operator.findUnique({
      where: {
        address: params.address
      }
    })
    
    return NextResponse.json(operator)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch operator' }, { status: 500 })
  }
} 