-include .env

build:; forge build # we use (:;) syntax to write the command on the same line

compile:; forge compile

format:; forge fmt

somnia-deploy:
	forge script script/SomniaFaucet.s.sol:SomniaFaucetScript --rpc-url $(SOMNIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --verifier blockscout --verifier-url $(VERIFIER_URL) -vvvv

coverage:; forge coverage

Test:; forge test 
