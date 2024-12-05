import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/operators/${params.address}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to check operator:', error)
    return NextResponse.json({ error: 'Failed to check operator' }, { status: 500 })
  }
} 