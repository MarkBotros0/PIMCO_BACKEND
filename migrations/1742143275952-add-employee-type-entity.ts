import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmployeeTypeEntity1742143275952 implements MigrationInterface {
    name = 'AddEmployeeTypeEntity1742143275952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "emplyee_type" TO "employee_type"`);
        await queryRunner.query(`ALTER TYPE "public"."users_emplyee_type_enum" RENAME TO "users_employee_type_enum"`);
        await queryRunner.query(`CREATE TABLE "employee_type" ("id" SERIAL NOT NULL, "type" character varying(100) NOT NULL, CONSTRAINT "PK_f9d58855715d2ef972426e8bfef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "employee_type"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "employee_type" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_ec7758057d79db05d0e1a0993f9" FOREIGN KEY ("employee_type") REFERENCES "employee_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_ec7758057d79db05d0e1a0993f9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "employee_type"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "employee_type" "public"."users_employee_type_enum"`);
        await queryRunner.query(`DROP TABLE "employee_type"`);
        await queryRunner.query(`ALTER TYPE "public"."users_employee_type_enum" RENAME TO "users_emplyee_type_enum"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "employee_type" TO "emplyee_type"`);
    }

}
