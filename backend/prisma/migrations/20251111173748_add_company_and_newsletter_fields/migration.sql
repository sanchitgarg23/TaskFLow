-- AlterTable
ALTER TABLE `User` ADD COLUMN `company` VARCHAR(191) NULL,
    ADD COLUMN `subscribeNewsletter` BOOLEAN NOT NULL DEFAULT false;
