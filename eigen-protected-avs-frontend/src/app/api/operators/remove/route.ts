import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { address } = await req.json()
    
    // Call backend API
    const response = await fetch(`${process.env.BACKEND_URL}/api/operators/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to remove operator' },
      { status: 500 }
    )
  }
} 