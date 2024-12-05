if (!process.env.NEXT_PUBLIC_AVS_CONTRACT_ADDRESS) {
  throw new Error('Missing NEXT_PUBLIC_AVS_CONTRACT_ADDRESS')
}

export const AVS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AVS_CONTRACT_ADDRESS as `0x${string}` 