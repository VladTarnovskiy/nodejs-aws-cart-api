# nodejs-aws-cart-api

## Installation

```bash
npm install
```



## API documentation (Swagger)

After starting the app, open:

```
http://localhost:4000/api/docs
```

Swagger describes all endpoints: health check, auth, profile, cart, and orders. Protected routes use **Basic** auth (`Authorization: Basic <token from login>`).

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```


## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

### Create user and get auth token

register user with `POST` http://localhost:4000/api/auth/register

Body:
```json
{
  "name": "your_github_login",
  "password": "TEST_PASSWORD"
}
```

**get token** with `POST` http://localhost:4000/api/auth/login

Body
```json
{
  "username": "your_github_login",
  "password": "TEST_PASSWORD"
}
```
Response
```json
{
  "token_type": "Basic",
  "access_token": "eW91ckdpdGh1YkxvZ2luOlRFU1RfUEFTU1dPUkQ="
}

```

**Or you can do it with bash script, make sure you have installed `curl` in your system**

Put content of env.example to .env and **update credentials**:
```bash
cat env.example > .env
```

Create user and get token
```bash
./get-token.sh
```
if command failed make script executable
```bash
chmod +x ./get-token.sh
```

## Deploy to AWS (CDK)

### Prerequisites

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured (`aws configure`)
- Node.js 20+
- AWS account bootstrapped for CDK (once per account/region)

### Bootstrap CDK (first time only)

```bash
cd cdk
npx cdk bootstrap
cd ..
```

### Deploy Lambda + API Gateway

```bash
npm run deploy
```

This command:

1. Builds the NestJS app (`nest build`)
2. Prepares a Lambda package (`.lambda-package/`)
3. Deploys the CDK stack (`CartApiStack`)

After deploy, copy the output URL:

```
CartApiStack.CartApiUrl = https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Use this URL instead of `http://localhost:4000` for API requests.

### Other CDK commands

```bash
npm run cdk:synth    # validate CloudFormation template
npm run cdk:destroy  # remove deployed stack
```

### Test deployed API

```bash
# health check
curl https://YOUR_API_URL/

# register
curl -X POST https://YOUR_API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"yourGithubLogin","password":"TEST_PASSWORD"}'

# login
curl -X POST https://YOUR_API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"yourGithubLogin","password":"TEST_PASSWORD"}'
```

## PostgreSQL (RDS) — Task 8.2

### 1. Create RDS instance (AWS Console)

1. Open [AWS RDS Console](https://console.aws.amazon.com/rds/)
2. **Create database**
3. Engine: **PostgreSQL**
4. Template: **Free tier** (or default for learning)
5. Set master username and password
6. Enable **Public access** (for connection from DBeaver/pgAdmin on your machine)
7. Create or select a security group that allows inbound **TCP 5432** from your IP
8. Create database

Save these values after creation:

- **Endpoint** (host), e.g. `cart-db.xxxxx.us-east-1.rds.amazonaws.com`
- **Port** (default `5432`)
- **Master username**
- **Master password**
- **Database name** (default `postgres`)

### 2. Connect to RDS

#### Option A: DBeaver / DataGrip / pgAdmin

Create a new PostgreSQL connection:

| Field    | Value              |
|----------|--------------------|
| Host     | RDS endpoint       |
| Port     | 5432               |
| Database | postgres           |
| Username | master username    |
| Password | master password    |

If connection fails, check:

- RDS instance status is **Available**
- Security group allows your IP on port **5432**
- **Public access** is enabled

#### Option B: psql (CLI)

```bash
psql -h YOUR_RDS_ENDPOINT -p 5432 -U postgres -d postgres
```

### 3. Create tables and seed data

Run the SQL script from this repository:

**In DBeaver / pgAdmin:** open `db/init.sql`, select all, execute.

**Via psql:**

```bash
psql -h YOUR_RDS_ENDPOINT -p 5432 -U postgres -d postgres -f db/init.sql
```

The script creates:

- `carts`, `cart_items` (required for Task 8.2)
- `users`, `orders` (optional tasks)
- test data (sample user, cart, cart items, order)

You can run `init.sql` multiple times — duplicate rows are skipped (`ON CONFLICT DO NOTHING`).

### 4. Verify tables

```sql
SELECT * FROM carts;
SELECT * FROM cart_items;
SELECT * FROM users;
SELECT * FROM orders;
```

## PostgreSQL integration (Task 8.3)

The app uses the `pg` library to store users, carts, cart items, and orders in RDS.

### Local development

Copy env variables and set RDS credentials:

```bash
cp env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DB_HOST` | RDS endpoint |
| `DB_PORT` | `5432` |
| `DB_USER` | master username |
| `DB_PASSWORD` | master password |
| `DB_NAME` | database name (`postgres`) |
| `DB_SSL` | `true` for RDS |

Run locally:

```bash
npm run start:dev
```

### Deploy Lambda with database credentials

Set DB env variables **before** deploy (bash):

```bash
export DB_HOST=your-rds-endpoint.us-east-1.rds.amazonaws.com
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=your_password
export DB_NAME=postgres
export DB_SSL=true

npm run deploy
```

CDK passes these values to Lambda environment variables.

### RDS security for Lambda

Lambda must reach RDS:

1. RDS security group: allow inbound **5432** from Lambda security group or VPC CIDR
2. If RDS is public: allow Lambda egress to RDS (Lambda outside VPC uses public RDS endpoint)
3. For production: place Lambda in the same VPC as RDS

After deploy, register/login and cart operations use PostgreSQL instead of in-memory storage.

