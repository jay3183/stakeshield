import { useContractWrite, useContractRead, useAccount, usePublicClient } from 'wagmi'
import { contracts } from '@/web3/config'
import { eigenLayerHooksABI } from '@/web3/abis/eigen-layer-hooks'

interface RegisterOperatorParams {
  earningsReceiver: `0x${string}`
  delegationApprover: `0x${string}` | ''
  stakerOptOutWindowBlocks: bigint
  metadataURI: string
}

export function useEigenLayer() {
  const { address } = useAccount()
  const { writeContractAsync } = useContractWrite()
  const publicClient = usePublicClient()

  const registerAsOperator = async (params: RegisterOperatorParams) => {
    if (!address) throw new Error('Wallet not connected')
    if (!publicClient) throw new Error('No provider available')

    const hash = await writeContractAsync({
      address: contracts.eigenLayer.hooks,
      abi: eigenLayerHooksABI,
      functionName: 'registerOperatorWithHooks',
      args: [
        {
          earningsReceiver: params.earningsReceiver,
          delegationApprover: params.delegationApprover || '0x0000000000000000000000000000000000000000',
          stakerOptOutWindowBlocks: Number(params.stakerOptOutWindowBlocks)
        },
        params.metadataURI
      ]
    })

    return publicClient.waitForTransactionReceipt({ hash })
  }

  const { data: isRegistered } = useContractRead({
    address: contracts.eigenLayer.delegationManager,
    abi: eigenLayerHooksABI,
    functionName: 'isOperator',
    args: address ? [address] : undefined,
  })

  return {
    registerAsOperator,
    isRegistered: !!isRegistered
  }
} 