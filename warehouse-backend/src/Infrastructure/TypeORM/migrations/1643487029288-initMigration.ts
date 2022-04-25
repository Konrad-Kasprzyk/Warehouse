import { MigrationInterface, QueryRunner } from 'typeorm';

export class initMigration1643487029288 implements MigrationInterface {
  name = 'initMigration1643487029288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_model" ("id" SERIAL NOT NULL, "Name" character varying NOT NULL, "Brand" character varying NOT NULL, "PartNumber" character varying NOT NULL, CONSTRAINT "PK_deef06ea1075a8678683d25c718" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "Gtin" character varying NOT NULL, "productModelId" integer, "hallId" integer, CONSTRAINT "UQ_3eb31e9ee3822706e03717e71d7" UNIQUE ("Gtin"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shelf" ("id" SERIAL NOT NULL, "ProductGtins" text NOT NULL DEFAULT '', "ProductModelPartNumber" character varying, "ProductModelBrand" character varying, "Number" integer NOT NULL, "Gtin" character varying NOT NULL, "ShelfPurpose" "public"."shelf_shelfpurpose_enum" NOT NULL DEFAULT 'Storage', "hallId" integer, CONSTRAINT "UQ_281c79163a6d0a0152f32dbd613" UNIQUE ("Gtin"), CONSTRAINT "PK_da2ce57e38dfc635d50d0e5fc8f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_details" ("id" SERIAL NOT NULL, "ScansRequired" integer NOT NULL, "ProductModelPartNumber" character varying NOT NULL, "ProductModelBrand" character varying NOT NULL, "StartingShelfGtin" character varying NOT NULL, "DestinationShelfGtin" character varying NOT NULL, "PickedUpProductsGtins" text NOT NULL DEFAULT '', "StoredProductsGtins" text NOT NULL DEFAULT '', "ScannedShelfGtin" character varying, CONSTRAINT "PK_d494090f1be0e201cfa015f69e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" SERIAL NOT NULL, "Status" "public"."task_status_enum" NOT NULL DEFAULT 'Queued', "QueueTime" TIMESTAMP, "ActiveTime" TIMESTAMP, "CancelTime" TIMESTAMP, "TaskCancelCause" "public"."task_taskcancelcause_enum", "FinishTime" TIMESTAMP, "taskDetailsId" integer, "employeeActiveTaskId" integer, "employeeFinishedTaskId" integer, "employeeCancelledTaskId" integer, "hallId" integer, CONSTRAINT "REL_6d915e2250a756b0241d3a19c7" UNIQUE ("taskDetailsId"), CONSTRAINT "REL_3c12b236a3d36c74e3178403b4" UNIQUE ("employeeActiveTaskId"), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hall" ("id" SERIAL NOT NULL, "Number" integer NOT NULL, CONSTRAINT "UQ_df07a3168744e7084fa0e26a865" UNIQUE ("Number"), CONSTRAINT "PK_4b7ec43f24e82084474569abec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee" ("id" SERIAL NOT NULL, "Name" character varying NOT NULL, "Surname" character varying NOT NULL, "Role" "public"."employee_role_enum" NOT NULL DEFAULT 'Employee', "activeTaskId" integer, "hallId" integer, CONSTRAINT "REL_ee8ea2a7f9271da84724354f8a" UNIQUE ("activeTaskId"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_14b16a7d68b790d1514b5088531" FOREIGN KEY ("productModelId") REFERENCES "product_model"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_9b9f6d881112b99d4336fc1cefc" FOREIGN KEY ("hallId") REFERENCES "hall"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shelf" ADD CONSTRAINT "FK_58e65c6896191687667c1975228" FOREIGN KEY ("hallId") REFERENCES "hall"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_6d915e2250a756b0241d3a19c73" FOREIGN KEY ("taskDetailsId") REFERENCES "task_details"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_3c12b236a3d36c74e3178403b4b" FOREIGN KEY ("employeeActiveTaskId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_78fc3b30b888c5d29859e5e3a3e" FOREIGN KEY ("employeeFinishedTaskId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_82f67b83dfc6c9aec51d646a634" FOREIGN KEY ("employeeCancelledTaskId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_1f7626bc322cbe01512f0f2baaf" FOREIGN KEY ("hallId") REFERENCES "hall"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_ee8ea2a7f9271da84724354f8ab" FOREIGN KEY ("activeTaskId") REFERENCES "task"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_48c63caadbf77e8fa7847a2ecb8" FOREIGN KEY ("hallId") REFERENCES "hall"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_48c63caadbf77e8fa7847a2ecb8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_ee8ea2a7f9271da84724354f8ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_1f7626bc322cbe01512f0f2baaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_82f67b83dfc6c9aec51d646a634"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_78fc3b30b888c5d29859e5e3a3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_3c12b236a3d36c74e3178403b4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_6d915e2250a756b0241d3a19c73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shelf" DROP CONSTRAINT "FK_58e65c6896191687667c1975228"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_9b9f6d881112b99d4336fc1cefc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_14b16a7d68b790d1514b5088531"`,
    );
    await queryRunner.query(`DROP TABLE "employee"`);
    await queryRunner.query(`DROP TABLE "hall"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "task_details"`);
    await queryRunner.query(`DROP TABLE "shelf"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "product_model"`);
  }
}
