import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1723931268524 implements MigrationInterface {
    name = 'Migrations1723931268524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "packages" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "washCoinsAwarded" integer NOT NULL, "benefits" text array NOT NULL DEFAULT ARRAY['package']::text[], CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scubscriptions" ("id" SERIAL NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, "carId" integer NOT NULL, "packageId" integer NOT NULL, CONSTRAINT "REL_d85113d3cacf4efecc7777bcc9" UNIQUE ("carId"), CONSTRAINT "PK_f6b191f736422d9f4d553c36673" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cars" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "registrationNumber" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_af328dc397a908d510101f0a7f9" UNIQUE ("registrationNumber"), CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "roles" text array NOT NULL DEFAULT ARRAY['user']::text[], "washCoins" integer NOT NULL DEFAULT '100', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "scubscriptions" ADD CONSTRAINT "FK_d85113d3cacf4efecc7777bcc98" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scubscriptions" ADD CONSTRAINT "FK_a334e6793eb746794c46d8d74e9" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_6431b6fec12c4090bb357fba2c2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_6431b6fec12c4090bb357fba2c2"`);
        await queryRunner.query(`ALTER TABLE "scubscriptions" DROP CONSTRAINT "FK_a334e6793eb746794c46d8d74e9"`);
        await queryRunner.query(`ALTER TABLE "scubscriptions" DROP CONSTRAINT "FK_d85113d3cacf4efecc7777bcc98"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "cars"`);
        await queryRunner.query(`DROP TABLE "scubscriptions"`);
        await queryRunner.query(`DROP TABLE "packages"`);
    }

}
