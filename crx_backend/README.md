# CRX Backend - Express.js + MongoDB

This is the backend service for the Blockchain-Based Carbon Credit System (CRX).

## Setup Instructions

### 1. Install Dependencies

```bash
cd crx_backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `crx_backend` directory with the following:

```
PORT=5000
MONGODB_URI=mongodb://atlas-sql-690afeda728a2a590061c693-1jw2jh.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin
NODE_ENV=development
JWT_SECRET=crx_super_secret_key_change_in_production
CONTRACT_ADDRESS=0xb3e497afCaB81fFb7690e3157D03715F0580B391
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/demo
```

### 3. Start the Backend

From the root directory:

```bash
npm run backend
```

Or run both frontend and backend:

```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login with wallet address

### Profile
- `GET /api/profile/:wallet` - Get user profile
- `PUT /api/profile/:wallet` - Update user profile (requires token)

### Requests
- `GET /api/requests` - Get all requests (authority only)
- `POST /api/requests` - Submit a token request
- `PUT /api/requests/:id/approve` - Approve request (authority only)
- `PUT /api/requests/:id/reject` - Reject request (authority only)

### Transactions
- `GET /api/transactions/:wallet` - Get transactions for a wallet
- `POST /api/transactions` - Log a transaction

### Token Operations
- `GET /api/token/balance/:wallet` - Get wallet balance
- `POST /api/token/mint` - Mint tokens (authority only)
- `POST /api/token/burn` - Burn tokens (requires token)
- `POST /api/token/transfer` - Transfer tokens (requires token)

### Community
- `GET /api/communitypost` - Get all community posts
- `POST /api/communitypost` - Create a community post (requires token)
- `DELETE /api/communitypost/:id` - Delete a community post (requires token)

## Database Schema

### User
- `wallet` (string, unique) - Ethereum wallet address
- `email` (string, unique) - User email
- `role` (enum: "authority", "user")
- `name` (string)
- `blog` (string) - User's blog/story
- `carbonCredits` (number) - Token balance
- `createdAt`, `updatedAt` - Timestamps

### Request
- `wallet` (string) - User wallet
- `reason` (string) - Request reason
- `amount` (number) - Token amount
- `status` (enum: "pending", "approved", "rejected")
- `requestType` (enum: "mint", "burn")
- `createdAt`, `updatedAt` - Timestamps

### Transaction
- `from` (string) - Sender wallet
- `to` (string) - Recipient wallet
- `amount` (number) - Token amount
- `txHash` (string, unique) - Transaction hash
- `type` (enum: "mint", "burn", "transfer")
- `createdAt`, `updatedAt` - Timestamps

### CommunityPost
- `title` (string) - Post title
- `description` (string) - Post description
- `type` (enum: "buy", "sell") - Transaction type
- `amount` (number) - Token amount
- `wallet` (string) - Author wallet
- `createdAt`, `updatedAt` - Timestamps

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **TypeScript** - Type safety
- **ethers.js** - Blockchain interactions
