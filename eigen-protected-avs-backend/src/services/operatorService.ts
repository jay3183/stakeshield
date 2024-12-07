import { ethers } from "ethers"

export class OperatorService {
  async isRegistered(address: string): Promise<boolean> {
    return ethers.isAddress(address)
  }
}
