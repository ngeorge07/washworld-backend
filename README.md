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

3. **Start PostgreSQL with Docker:**

   ```bash
   docker-compose -p washworld-postgres up -d
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Run migrations**
   ```bash
   npm run migration:run
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
