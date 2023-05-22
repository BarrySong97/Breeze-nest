# Breeze-nest

this project is backend of [Breeze - simple app to track your habit](https://github.com/BarrySong97/Breeze)

# Install Dependencies

Install [Nestjs CLI](https://docs.nestjs.com/cli/usages) to start and [generate CRUD resources](https://trilon.io/blog/introducing-cli-generators-crud-api-in-1-minute)

```bash
# pnpm
pnpm i -g @nestjs/cli
# yarn
yarn add -g @nestjs/cli
# npm
npm add -g @nestjs/cli
```

Install the dependencies for the Nest application:

```bash
# pnpm
pnpm install
# npm
npm install
# yarn
yarn install
```

# .env

support different .env files `.env.development` and `.env.production`

# PostgreSQL setup

## notice

> Don't use prisma client command dirrectly.
> Because prisma doesn't support different .env files, so we use `./scripts/prisma.js` to loaded different .env files.

using prisma client command like this below

```bash
npm run prisma -> node ./scripts/prisma.js
prisma migrate dev -> npm run prisma dev migrate dev
prisma migrate deploy -> npm run prisma prod migrate deploy
```

`dev` -> `development`

`prod` -> `production`

## Init postgres with docker

Setup a development PostgreSQL with Docker. Copy [.env.example](./.env.example) and rename to `.env` - `cp .env.example .env.development` and `cp .env.example .env.production` - which sets the required environments for PostgreSQL such as `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB`. Update the variables as you wish and select a strong password.

Start the PostgreSQL database using docker (recomand)

```bash
docker-compose -f docker-compose.db.yml up -d
```

## Prisma Migrate

[Prisma Migrate](https://github.com/prisma/prisma2/tree/master/docs/prisma-migrate) is used to manage the schema and migration of the database. Prisma datasource requires an environment variable `DATABASE_URL` for the connection to the PostgreSQL database. Prisma reads the `DATABASE_URL` from the root [.env](./.env) file.

Use Prisma Migrate in your [development environment](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#evolving-the-schema-in-development) to

1. Creates `migration.sql` file
2. Updates Database Schema
3. Generates Prisma Client

```bash
npm run migrate:dev
```

## deploy db changes in production

If you are happy with your database changes you want to deploy those changes to your [production database](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#applying-migrations-in-production-and-other-environments). Use `prisma migrate deploy` to apply all pending migrations, can also be used in CI/CD pipelines as it works without prompts.

```bash
npm run migrate:deploy
```

## Prisma: Prisma Client JS

[Prisma Client JS](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/api) is a type-safe database client auto-generated based on the data model.

Generate Prisma Client JS by running

> **Note**: Every time you update [schema.prisma](prisma/schema.prisma) re-generate Prisma Client JS

```bash
npx prisma generate
# or
npm run prisma:generate
```

# NestJS Server

Run Nest Server in Development mode:

```bash
npm run start

# watch mode
npm run start:dev
```

Run Nest Server in Production mode:

```bash
npm run start:prod
```

## logs

- [pino-http](https://github.com/pinojs/pino-http#readme) to pretty log and logging http logs
- [ rotating-file-stream ](https://github.com/iccicci/rotating-file-stream#readme) saves log files to ./logs directory. it will divide logs files to seperate files day by day.

## Rest Api

[RESTful API](http://localhost:3000/api) documentation available with Swagger.

## Docker

Nest server is a Node.js application and it is easily [dockerized](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/).

See the [Dockerfile](./Dockerfile) on how to build a Docker image of your Nest server.

Now to build a Docker image of your own Nest server simply run:

```bash
# give your docker image a name
docker build -t <your username>/nest-prisma-server .
# for example
docker build -t nest-prisma-server .
```

After Docker build your docker image you are ready to start up a docker container running the nest server:

```bash
docker run -d -t -p 3000:3000 -v /path/to/logs:/app/logs --env-file .env.production nest-prisma-server
```

Now open up [localhost:3000](http://localhost:3000) to verify that your nest server is running.

When you run your NestJS application in a Docker container update your [.env](.env) file

### Docker Compose

You can also setup a the database and Nest application with the docker-compose

```bash
# building new NestJS docker image
docker-compose build
# or
npm run docker:build

# start docker-compose
docker-compose up -d
# or
npm run docker
```
