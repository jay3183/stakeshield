'use client'

import { useState } from 'react'
import { useAVSContract } from '../../hooks/use-avs-contract'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { parseEther } from 'viem'
import { toast } from 'react-hot-toast'
import { useEigenLayer } from '@/hooks/use-eigen-layer'
import { usePublicClient, useWalletClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { DelegationManagerABI } from '@/config/abis'

interface OperatorDetails {
  earningsReceiver: string
  delegationApprover: string
  stakerOptOutWindowBlocks: string
  metadataURI: string
}

export function RegisterOperator() {
  const [stakeAmount, setStakeAmount] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [step, setStep] = useState<'eigen' | 'avs'>('eigen')
  const [operatorDetails, setOperatorDetails] = useState<OperatorDetails>({
    earningsReceiver: '',
    delegationApprover: '',
    stakerOptOutWindowBlocks: '50400',
    metadataURI: ''
  })
  const { setStake } = useAVSContract()
  const { registerAsOperator, isRegistered } = useEigenLayer()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const handleInputChange = (field: keyof OperatorDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setOperatorDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleRegister = async () => {
    if (!stakeAmount || !walletClient || !publicClient) return
    
    setIsRegistering(true)
    try {
      // Step 1: Register with EigenLayer if not already registered
      if (!isRegistered) {
        const details = {
          earningsReceiver: operatorDetails.earningsReceiver as `0x${string}`,
          delegationApprover: operatorDetails.delegationApprover || '0x0000000000000000000000000000000000000000' as `0x${string}`,
          stakerOptOutWindowBlocks: BigInt(operatorDetails.stakerOptOutWindowBlocks)
        } as const;

        const tx = await walletClient.writeContract({
          address: HOLESKY_CONTRACTS.eigenLayer.delegationManager,
          abi: DelegationManagerABI.abi,
          functionName: 'registerAsOperator',
          args: [details, operatorDetails.metadataURI]
        })

        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })
        
        if (receipt.status === 'success') {
          toast.success('Registered with EigenLayer')
          setStep('avs')
        }
        return
      }

      // Step 2: Set stake (AVS registration happens automatically)
      await setStake(stakeAmount)
      
      toast.success('Successfully registered as operator')
      setStakeAmount('')
      setStep('eigen')
    } catch (error: any) {
      if (error.message.includes('NotRegisteredWithEigenLayer')) {
        toast.error('Please register with EigenLayer first')
        setStep('eigen')
      } else if (error.message.includes('AlreadyRegistered')) {
        toast.error('Operator is already registered')
      } else {
        toast.error('Failed to register as operator')
        console.error('Registration error:', error)
      }
    } finally {
      setIsRegistering(false)
    }
  }

  const getButtonText = () => {
    if (isRegistering) return 'Registering...'
    if (!isRegistered) return 'Register with EigenLayer'
    if (step === 'avs') return 'Complete AVS Registration'
    return 'Register as Operator'
  }

  return (
    <div className="space-y-4">
      {/* EigenLayer Registration Fields */}
      {!isRegistered && (
        <>
          <Input
            label="Earnings Receiver Address"
            placeholder="0x..."
            value={operatorDetails.earningsReceiver}
            onChange={handleInputChange('earningsReceiver')}
            disabled={isRegistering}
          />
          <Input
            label="Delegation Approver Address (optional)"
            placeholder="0x... (leave empty for open delegation)"
            value={operatorDetails.delegationApprover}
            onChange={handleInputChange('delegationApprover')}
            disabled={isRegistering}
          />
          <Input
            type="number"
            label="Staker Opt-out Window (blocks)"
            value={operatorDetails.stakerOptOutWindowBlocks}
            onChange={handleInputChange('stakerOptOutWindowBlocks')}
            placeholder="50400 (~1 week)"
            disabled={isRegistering}
          />
          <Input
            label="Metadata URI (optional)"
            placeholder="https://..."
            value={operatorDetails.metadataURI}
            onChange={handleInputChange('metadataURI')}
            disabled={isRegistering}
          />
        </>
      )}

      {/* Stake Amount Field */}
      <Input
        type="number"
        label="Initial Stake (ETH)"
        value={stakeAmount}
        onChange={(e) => setStakeAmount(e.target.value)}
        placeholder="Enter stake amount"
        min="0"
        step="0.01"
        disabled={isRegistering}
      />
      
      <Button
        onClick={handleRegister}
        disabled={isRegistering || !stakeAmount || (!isRegistered && !operatorDetails.earningsReceiver)}
        className="w-full"
      >
        {getButtonText()}
      </Button>

      {/* Progress indicator */}
      <div className="flex justify-between text-sm text-gray-500">
        <div className={step === 'eigen' ? 'font-bold' : ''}>
          1. EigenLayer Registration
        </div>
        <div className={step === 'avs' ? 'font-bold' : ''}>
          2. AVS Registration
        </div>
      </div>
    </div>
  )
} 