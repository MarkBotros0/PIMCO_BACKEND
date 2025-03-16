import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserDocuments1742165138281 implements MigrationInterface {
    name = 'AddUserDocuments1742165138281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_documents" ("id" SERIAL NOT NULL, "birth_certificate" text, "military_certificate" text, "military_certificate_expiration" date, "fish" text, "personal_id" text, "personal_id_expiration" date, "graduation_certificate" text, "personal_photo" text, "driver_license" text, "driver_license_expiration" date, "insurance" text, "certificate_111" text, "toxicity_report" text, "kaab_alaamal" text, "skill_measurement" text, "userId" integer, CONSTRAINT "REL_7dc8609606e081e1ae0f0d43b4" UNIQUE ("userId"), CONSTRAINT "PK_cea43819156528b63504c4afd4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "address" text`);
        await queryRunner.query(`ALTER TABLE "user_documents" ADD CONSTRAINT "FK_7dc8609606e081e1ae0f0d43b4e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_documents" DROP CONSTRAINT "FK_7dc8609606e081e1ae0f0d43b4e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`DROP TABLE "user_documents"`);
    }

}
