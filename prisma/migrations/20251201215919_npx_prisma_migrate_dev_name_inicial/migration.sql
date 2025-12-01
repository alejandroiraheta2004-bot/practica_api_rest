/*
  Warnings:

  - The primary key for the `documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `projectId` on the `documents` table. All the data in the column will be lost.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deleted_at` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `projects` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `documents` DROP FOREIGN KEY `Documents_projectId_fkey`;

-- DropIndex
DROP INDEX `Documents_projectId_fkey` ON `documents`;

-- AlterTable
ALTER TABLE `documents` DROP PRIMARY KEY,
    DROP COLUMN `projectId`,
    ADD COLUMN `project_id` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `projects` DROP PRIMARY KEY,
    DROP COLUMN `deleted_at`,
    DROP COLUMN `title`,
    ADD COLUMN `document` VARCHAR(250) NULL,
    ADD COLUMN `end_date` DATE NULL,
    ADD COLUMN `leader` VARCHAR(120) NULL,
    ADD COLUMN `name` VARCHAR(150) NOT NULL,
    ADD COLUMN `start_date` DATE NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE INDEX `documents_project_id_idx` ON `documents`(`project_id`);

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
