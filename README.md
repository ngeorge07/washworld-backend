# WashWorld Backend

## Initial set-up

1. **Clone the repository**

   ```bash
   git clone https://github.com/ngeorge07/washworld-backend.git
   ```

2. **Open the project directory:**

   ```bash
   cd washworld-backend
   ```

3. **Create a .env file in the root directory of the project with the following content:**

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=<your_postgres_username>
   DB_PASSWORD=<your_postgres_password>
   DB_NAME=<your_database_name>
   DATABASE_URL="postgres://<DB_USERNAME>:<DB_PASSWORD>@localhost:5432/<DB_NAME>"
   JWT_SECRET=<your-secret>
   TEST_DB_NAME='e2e_test'
   TEST_DATABASE_URL="postgres://<DB_USERNAME>:<DB_PASSWORD>@localhost:5432/<TEST_DB_NAME>"
   ```

   You can generate a JWT secret by running this command in your terminal:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Start PostgreSQL with Docker:**

   ```bash
   docker-compose -p washworld-postgres up -d
   ```

5. **Install dependencies**

   ```bash
   npm install
   ```

6. **Run migrations**

   ```bash
   npm run migration:run
   ```

7. **Run the seeds:**

   ```bash
   npm run db:seed
   ```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
