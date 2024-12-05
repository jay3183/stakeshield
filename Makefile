-include .env

.PHONY: all test clean deploy-local deploy-sepolia

all: clean install build

# Clean the repo
clean  :; forge clean

# Install dependencies
install :; forge install

# Compile
build  :; forge build

# Run tests
test   :; forge test -vvv

# Run coverage
coverage :; forge coverage --report lcov

# Format code
format :; forge fmt

# Deploy to local network
deploy-local :; forge script script/Deploy.local.s.sol --rpc-url http://localhost:8545 --broadcast -vvvv

# Deploy to Sepolia
deploy-sepolia :; forge script script/EigenProtectedAVSHook.s.sol --rpc-url ${SEPOLIA_RPC_URL} --broadcast --verify -vvvv

# Verify contract
verify :; forge script script/Verify.s.sol --rpc-url ${SEPOLIA_RPC_URL} -vvvv 