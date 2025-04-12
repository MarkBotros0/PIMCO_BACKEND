import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContractedDaysToSite1743871454490 implements MigrationInterface {
    name = 'AddContractedDaysToSite1743871454490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payrolls" ADD "daily_salary" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "site" ADD "contracted_days" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "contracted_days"`);
        await queryRunner.query(`ALTER TABLE "payrolls" DROP COLUMN "daily_salary"`);
    }

}
