/*
  Warnings:

  - Made the column `type` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Event` MODIFY `description` TEXT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL DEFAULT 'task',
    MODIFY `color` VARCHAR(191) NOT NULL DEFAULT '#3B82F6';
