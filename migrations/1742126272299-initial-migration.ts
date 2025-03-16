import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1742126272299 implements MigrationInterface {
    name = 'InitialMigration1742126272299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blacklisted_refresh_tokens" ("id" SERIAL NOT NULL, "token" text NOT NULL, "expired_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" integer, CONSTRAINT "PK_fe490ed264123b9db3ea4ffee5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_user_roles_enum" AS ENUM('Normal', 'Human Resources', 'Admin')`);
        await queryRunner.query(`CREATE TYPE "public"."users_emplyee_type_enum" AS ENUM('رئيس مجلس الإدارة', 'مدير عام الشركة', 'مدير الادارة المالية', 'مديرة الموارد البشرية', 'مسئول موارد بشرية', 'محاسب اول', 'منسق إدارة التطوير', 'مندوب مشتريات', 'مدخل بيانات', 'مدير إدارة التطوير', 'عامل نظافة', 'مدير موقع', 'مهندس ميكانيكى', 'مساعد', 'فنى سمكري سيارات', 'فنى إطارات', 'فني تبريد وتكييف سيارات', 'فنى كهربائي سيارات', 'ميكانيكى معدات ثقيلة', 'ميكانيكى معدات خفيفة', 'سائق فوركلفت', 'سائق درجة أولى', 'وناش', 'صبانى بحرى', 'سائق مان ليفت', 'سائق درجة ثانية', 'فني دوكو', 'مسئول تشغيل', 'مهندس لفتينج', 'مسؤول مخازن', 'مدير ادارة العمليات', 'منسق ادارة العمليات', 'محاسب', 'صبانى', 'فني تشحيم', 'مهندس صيانة', 'مهندس سلامه وصحه مهنية( سيفتى)', 'بانكس مان', 'عامل 5%', 'مسئولة المرتبات')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "phone_number" character varying(15) NOT NULL, "fullname" character varying(100), "password" text, "user_roles" "public"."users_user_roles_enum" array NOT NULL DEFAULT '{Normal}', "emplyee_type" "public"."users_emplyee_type_enum", "date_of_birth" date, CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blacklisted_refresh_tokens" ADD CONSTRAINT "FK_2095e3424fe134cf237a081772b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blacklisted_refresh_tokens" DROP CONSTRAINT "FK_2095e3424fe134cf237a081772b"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_emplyee_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_user_roles_enum"`);
        await queryRunner.query(`DROP TABLE "blacklisted_refresh_tokens"`);
    }

}
