import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCarSubscriptionsCol1716944521867 implements MigrationInterface {
    name = 'UpdateCarSubscriptionsCol1716944521867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT ARRAY['user']::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT ARRAY['user'`);
    }

}
