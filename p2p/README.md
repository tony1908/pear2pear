# P2P Token Transfer Market with Boolean Oracle Verification

This project implements a peer-to-peer (P2P) market system for transferring ERC20 tokens, where transfers are verified by a boolean oracle. The system is designed to support scenarios where token transfers depend on off-chain verification.

## System Requirements

<details>
<summary>Core (Docker, Compose, Make, JQ, NodeJS v21+)</summary>

### Docker

- **MacOS**: `brew install --cask docker`
- **Ubuntu**: `sudo apt -y install docker.io`
- [Docker Documentation](https://docs.docker.com/get-started/get-docker/)

### Docker Compose

- **MacOS**: Already installed with Docker installer
- **Linux**: `sudo apt-get install docker-compose-v2`
- [Compose Documentation](https://docs.docker.com/compose/)

### Make

- **MacOS**: `brew install make`
- **Linux**: `sudo apt -y install make`
- [Make Documentation](https://www.gnu.org/software/make/manual/make.html)

### JQ

- **MacOS**: `brew install jq`
- **Ubuntu**: `sudo apt -y install jq`
- [JQ Documentation](https://jqlang.org/download/)

### Node.js

- **Required Version**: v21+
- [Installation via NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
</details>

<details>

<summary>Rust v1.84+</summary>

### Rust Installation

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

rustup toolchain install stable
rustup target add wasm32-wasip2
```

### Upgrade Rust

```bash
# Remove old targets if present
rustup target remove wasm32-wasi || true
rustup target remove wasm32-wasip1 || true

# Update and add required target
rustup update stable
rustup target add wasm32-wasip2
```

</details>

<details>
<summary>Cargo Components</summary>

## Install Cargo Components

```bash
# Install required cargo components
# https://github.com/bytecodealliance/cargo-component#installation
cargo install cargo-binstall
cargo binstall cargo-component warg-cli wkg --locked --no-confirm --force

# Configure default registry
wkg config --default-registry wa.dev
```

</details>

## Installation and Setup

### Solidity

Install the required packages to build the Solidity contracts. This project supports both [submodules](./.gitmodules) and [npm packages](./package.json).

```bash
# Install packages (npm & submodules)
make setup

# Build the contracts
forge build
```

### Build WASI components

Now build the WASI rust components into the `compiled` output directory.

> [!WARNING]
> If you get: `error: no registry configured for namespace "wavs"`
>
> run, `wkg config --default-registry wa.dev`

> [!WARNING]
> If you get: `failed to find the 'wasm32-wasip1' target and 'rustup' is not available`
>
> `brew uninstall rust` & install it from <https://rustup.rs>

```bash
make wasi-build # or `make build` to include solidity compilation.
```

## WAVS

> [!NOTE]
> If you are running on a Mac with an ARM chip, you will need to do the following:
>
> - Set up Rosetta: `softwareupdate --install-rosetta`
> - Enable Rosetta (Docker Desktop: Settings -> General -> enable "Use Rosetta for x86_64/amd64 emulation on Apple Silicon")
>
> Configure one of the following networking:
>
> - Docker Desktop: Settings -> Resources -> Network -> 'Enable Host Networking'
> - `brew install chipmk/tap/docker-mac-net-connect && sudo brew services start chipmk/tap/docker-mac-net-connect`

### Start Environment

Start an ethereum node (anvil), the WAVS service, and deploy
[eigenlayer](https://www.eigenlayer.xyz/) contracts to the local network.

```bash
cp .env.example .env

# Start the backend
#
# This must remain running in your terminal. Use another terminal to run other commands.
# You can stop the services with `ctrl+c`. Some MacOS terminals require pressing it twice.
make start-all
```

### How the P2P Market System Works

The P2P market system consists of the following components:

1. **P2P Market Contract**: Handles order creation, funding, and execution
2. **Oracle Controller**: Connects the blockchain with the oracle service
3. **Boolean Oracle Service**: Verifies transactions with a simple boolean true/false

The typical flow of a P2P transaction is:

1. A maker creates an order specifying a taker, token, and amount
2. The maker funds the order by sending tokens to the contract
3. The oracle is triggered to verify the transaction
4. Based on the oracle's boolean result, the tokens are either:
   - Sent to the taker (if true)
   - Returned to the maker (if false)

### Setting the Oracle Result

The boolean oracle result is determined by the `P2P_BOOLEAN_RESULT` variable in the Makefile or passed to the deploy-service command:

```bash
# Set to true to approve transfers, false to reject them
make deploy-service P2P_BOOLEAN_RESULT=true
```

### Run the demo

```bash
# Deploy contracts
make deploy-contracts

# Deploy the oracle service component
make deploy-service

# Create and fund a P2P order
make create-order

# Trigger the oracle to verify and complete the order
make trigger-service
```

## Frontend

A frontend application is included for interacting with the P2P market system.

### Features

- Connect your Ethereum wallet
- Create and fund P2P token transfer orders
- View order history and status
- Trigger oracle verification for pending orders
- Admin interface to control the oracle result

### Running the Frontend

The frontend must be started after the backend is running and the contracts are
deployed, since the environment variables are set by the make scripts and
need to be available to the frontend.

```bash
# In a terminal, start the backend
make start-all

# In another terminal, deploy the necessary contracts/service.
make deploy-contracts
make deploy-service

# Then install frontend dependencies
cd frontend
npm install

# And start the server
npm run dev

# Frontend will be available at http://localhost:3000
```

## Claude Code

To spin up a sandboxed instance of [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) in a Docker container that only has access to this project's files, run the following command:

```bash
npm run claude-code
# or with no restrictions (--dangerously-skip-permissions)
npm run claude-code:unrestricted
```

You must have [Docker](https://www.docker.com/) installed.
