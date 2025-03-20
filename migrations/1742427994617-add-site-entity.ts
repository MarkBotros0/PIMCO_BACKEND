import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSiteEntity1742427994617 implements MigrationInterface {
  name = 'AddSiteEntity1742427994617';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "site"
        (
            "id"         SERIAL                   NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deletedAt"  TIMESTAMP,
            "name"       character varying(256)   NOT NULL,
            CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "site"`);
  }
}
