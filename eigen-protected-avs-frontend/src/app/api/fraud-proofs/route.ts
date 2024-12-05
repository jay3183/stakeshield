import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const fraudProofSchema = z.object({
  operator: z.string().startsWith('0x'),
  proof: z.string().startsWith('0x'),
  submitter: z.string().startsWith('0x')
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { operator, proof, submitter } = fraudProofSchema.parse(body)

    // Store the fraud proof in database
    const fraudProof = await db.fraudProofVerification.create({
      data: {
        proofId: proof,
        isValid: true, // Already verified in frontend
        operator: {
          connect: {
            address: operator
          }
        }
      }
    })

    // Update operator fraud count
    await db.operator.update({
      where: { address: operator },
      data: {
        fraudCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ success: true, fraudProof })
  } catch (error) {
    console.error('Fraud proof submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit fraud proof' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const proofs = await db.fraudProofVerification.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      include: {
        operator: {
          select: {
            address: true
          }
        }
      }
    })

    return NextResponse.json({ proofs })
  } catch (error) {
    console.error('Failed to fetch fraud proofs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fraud proofs' },
      { status: 500 }
    )
  }
} 