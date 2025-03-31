import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSiteToUsers1743455607496 implements MigrationInterface {
    name = 'AddSiteToUsers1743455607496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payrolls" DROP CONSTRAINT "FK_c6fa44f3cd1c8b36e3c296dce62"`);
        await queryRunner.query(`ALTER TABLE "payrolls" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "site" ADD "working_hours_per_day" integer NOT NULL DEFAULT '8'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "site_id" integer`);
        await queryRunner.query(`ALTER TABLE "payrolls" ADD CONSTRAINT "FK_1aa175252335f2fd3b10637d25d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_14cc5b78ce3181b681def37cb4c" FOREIGN KEY ("site_id") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_14cc5b78ce3181b681def37cb4c"`);
        await queryRunner.query(`ALTER TABLE "payrolls" DROP CONSTRAINT "FK_1aa175252335f2fd3b10637d25d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "site_id"`);
        await queryRunner.query(`ALTER TABLE "site" DROP COLUMN "working_hours_per_day"`);
        await queryRunner.query(`ALTER TABLE "payrolls" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "payrolls" ADD CONSTRAINT "FK_c6fa44f3cd1c8b36e3c296dce62" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
