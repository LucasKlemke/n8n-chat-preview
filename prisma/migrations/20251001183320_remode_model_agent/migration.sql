/*
  Warnings:

  - You are about to drop the column `agent_id` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the `agents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."agents" DROP CONSTRAINT "agents_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."chats" DROP CONSTRAINT "chats_agent_id_fkey";

-- AlterTable
ALTER TABLE "public"."chats" DROP COLUMN "agent_id";

-- DropTable
DROP TABLE "public"."agents";
