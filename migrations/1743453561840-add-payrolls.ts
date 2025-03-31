import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPayrolls1743453561840 implements MigrationInterface {
    name = 'AddPayrolls1743453561840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payrolls" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "month" integer NOT NULL, "year" integer NOT NULL, "user_id" integer NOT NULL, "approval_status" boolean NOT NULL DEFAULT true, "attendance" integer NOT NULL DEFAULT '0', "overtime_in_hrs" numeric(10,2) NOT NULL DEFAULT '0', "total_attendance" numeric(10,2) NOT NULL DEFAULT '0', "income_tax" numeric(10,2) NOT NULL DEFAULT '0', "penalties" numeric(10,2) NOT NULL DEFAULT '0', "advances" numeric(10,2) NOT NULL DEFAULT '0', "social_insurance" numeric(10,2) NOT NULL DEFAULT '0', "total_deductions" numeric(10,2) NOT NULL DEFAULT '0', "medical" numeric(10,2) NOT NULL DEFAULT '0', "bonuses_and_allowances" numeric(10,2) NOT NULL DEFAULT '0', "transportation_allowance" numeric(10,2) NOT NULL DEFAULT '0', "food_allowance" numeric(10,2) NOT NULL DEFAULT '0', "daily_difference" numeric(10,2) NOT NULL DEFAULT '0', "currency_difference" numeric(10,2) NOT NULL DEFAULT '0', "net_salary" numeric(10,2) NOT NULL DEFAULT '0', "total_salary" numeric(10,2) NOT NULL DEFAULT '0', "is_past" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "PK_4fc19dcf3522661435565b5ecf3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payrolls" ADD CONSTRAINT "FK_c6fa44f3cd1c8b36e3c296dce62" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payrolls" DROP CONSTRAINT "FK_c6fa44f3cd1c8b36e3c296dce62"`);
        await queryRunner.query(`DROP TABLE "payrolls"`);
    }

}
