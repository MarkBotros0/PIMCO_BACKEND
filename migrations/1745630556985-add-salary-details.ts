import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSalaryDetails1745630556985 implements MigrationInterface {
    name = 'AddSalaryDetails1745630556985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "salary-details" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "daily_salary" numeric(10,2) NOT NULL DEFAULT '0', "income_tax" numeric(10,2) NOT NULL DEFAULT '0', "social_insurance" numeric(10,2) NOT NULL DEFAULT '0', "medical" numeric(10,2) NOT NULL DEFAULT '0', "transportation_allowance" numeric(10,2) NOT NULL DEFAULT '0', "food_allowance" numeric(10,2) NOT NULL DEFAULT '0', "user_id" integer NOT NULL, CONSTRAINT "REL_1dcb814bee08b8e7df45ac334d" UNIQUE ("user_id"), CONSTRAINT "PK_17cf75cdcb8570f8cde2e7e2fb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "salary-details" ADD CONSTRAINT "FK_1dcb814bee08b8e7df45ac334da" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "salary-details" DROP CONSTRAINT "FK_1dcb814bee08b8e7df45ac334da"`);
        await queryRunner.query(`DROP TABLE "salary-details"`);
    }

}
