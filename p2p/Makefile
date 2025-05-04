#!/usr/bin/make -f

# Check if user is in docker group to determine if sudo is needed
SUDO := $(shell if groups | grep -q docker; then echo ''; else echo 'sudo'; fi)

# Default target is build
default: build

# Customize these variables
COMPONENT_FILENAME ?= p2p_boolean_oracle.wasm
TRIGGER_EVENT ?= "NewTrigger(bytes)"
SERVICE_CONFIG ?= '{"fuel_limit":100000000,"max_gas":5000000,"host_envs":["P2P_BOOLEAN_RESULT=true"],"kv":[],"workflow_id":"default","component_id":"default"}'
# Set this to "true" or "false" to control the P2P order resolution outcome
P2P_BOOLEAN_RESULT ?= true

# Define common variables
CARGO=cargo
WAVS_CMD ?= $(SUDO) docker run --rm --network host $$(test -f .env && echo "--env-file ./.env") -v $$(pwd):/data ghcr.io/lay3rlabs/wavs:0.3.0 wavs-cli
ANVIL_PRIVATE_KEY?=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL?=http://localhost:8545
SERVICE_MANAGER_ADDR?=`jq -r '.eigen_service_managers.local | .[-1]' .docker/deployments.json`
ORACLE_CONTROLLER_ADDRESS?=`jq -r '.oracle_controller' "./.docker/script_deploy.json"`
MARKET_ADDRESS?=`jq -r '.market' "./.docker/script_deploy.json"`
TOKEN_ADDRESS?=`jq -r '.token' "./.docker/script_deploy.json"`
ORDER_ID?=1

## build: building the project
build: _build_forge wasi-build

## wasi-build: building the WAVS wasi component(s)
wasi-build:
	@for component in $(shell ls ./components); do \
		echo "Building component: $$component"; \
		(cd components/$$component; cargo component build --release); \
	done
	@mkdir -p ./compiled
	@cp ./target/wasm32-wasip1/release/*.wasm ./compiled/

## wasi-exec: executing the WAVS wasi component(s) | COMPONENT_FILENAME, P2P_BOOLEAN_RESULT
wasi-exec:
	@$(WAVS_CMD) exec --log-level=info --data /data/.docker --home /data \
	--component "/data/compiled/${COMPONENT_FILENAME}" \
	--input `cast format-bytes32-string $(P2P_BOOLEAN_RESULT)`

## update-submodules: update the git submodules
update-submodules:
	@git submodule update --init --recursive

## clean: cleaning the project files
clean: clean-docker
	@forge clean
	@$(CARGO) clean
	@rm -rf cache
	@rm -rf out
	@rm -rf broadcast

## clean-docker: remove unused docker containers
clean-docker:
	@$(SUDO) docker rm -v $(shell $(SUDO) docker ps --filter status=exited -q) || true

## fmt: formatting solidity and rust code
fmt:
	@forge fmt --check
	@$(CARGO) fmt

## test: running tests
test:
	@forge test

## setup: install initial dependencies
setup:
	@forge install
	@npm install

## start-all: starting anvil and WAVS with docker compose
# running anvil out of compose is a temp work around for MacOS
start-all: clean-docker setup-env
	@rm --interactive=never .docker/*.json || true
	@bash -ec 'anvil --disable-code-size-limit & anvil_pid=$$!; trap "kill -9 $$anvil_pid 2>/dev/null" EXIT; $(SUDO) docker compose up; wait'

## deploy-contracts: deploying the contracts | SERVICE_MANAGER_ADDR, RPC_URL
deploy-contracts:
# `sudo chmod 0666 .docker/deployments.json`
	@forge script ./script/Deploy.s.sol ${SERVICE_MANAGER_ADDR} --sig "run(string)" --rpc-url $(RPC_URL) --broadcast

## get-oracle-controller-from-deploy: getting the oracle controller address from the script deploy
get-oracle-controller-from-deploy:
	@jq -r '.oracle_controller' "./.docker/script_deploy.json"

## wavs-cli: running wavs-cli in docker
wavs-cli:
	@$(WAVS_CMD) $(filter-out $@,$(MAKECMDGOALS))

## deploy-service: deploying the WAVS component service | COMPONENT_FILENAME, TRIGGER_EVENT, ORACLE_CONTROLLER_ADDRESS, SERVICE_CONFIG, P2P_BOOLEAN_RESULT
deploy-service:
	@$(WAVS_CMD) deploy-service --log-level=info --data /data/.docker --home /data \
	--component "/data/compiled/${COMPONENT_FILENAME}" \
	--trigger-event-name ${TRIGGER_EVENT} \
	--trigger-address "${ORACLE_CONTROLLER_ADDRESS}" \
	--submit-address "${ORACLE_CONTROLLER_ADDRESS}" \
	--service-config '{"fuel_limit":100000000,"max_gas":5000000,"host_envs":["P2P_BOOLEAN_RESULT=${P2P_BOOLEAN_RESULT}"],"kv":[],"workflow_id":"default","component_id":"default"}'

## create-order: create and fund a new P2P order | MARKET_ADDRESS, TOKEN_ADDRESS, RPC_URL
create-order:
	@forge script ./script/CreateOrder.s.sol ${MARKET_ADDRESS} ${TOKEN_ADDRESS} 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 100000000000000000000 --sig "run(string,string,string,string)" --rpc-url $(RPC_URL) --broadcast

## trigger-service: triggering the service | ORACLE_CONTROLLER_ADDRESS, ORDER_ID, RPC_URL
trigger-service:
	@forge script ./script/Trigger.s.sol ${ORACLE_CONTROLLER_ADDRESS} ${ORDER_ID} --sig "run(string,string)" --rpc-url $(RPC_URL) --broadcast

## set-result: display instructions for setting the boolean result | P2P_BOOLEAN_RESULT
set-result:
	@forge script ./script/SetBooleanResult.s.sol ${P2P_BOOLEAN_RESULT} --sig "run(string)" --rpc-url $(RPC_URL)

_build_forge:
	@forge build

# Declare phony targets
.PHONY: build clean fmt bindings test

.PHONY: help
help: Makefile
	@echo
	@echo " Choose a command run"
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo

# helpers

.PHONY: setup-env
setup-env:
	@if [ ! -f .env ]; then \
		if [ -f .env.example ]; then \
			echo "Creating .env file from .env.example..."; \
			cp .env.example .env; \
			echo ".env file created successfully!"; \
		fi; \
	fi
