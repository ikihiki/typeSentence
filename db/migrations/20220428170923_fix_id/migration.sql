/*
  Warnings:

  - The primary key for the `Result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Result` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Result" (
    "userId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "lastAnswerd" DATETIME NOT NULL,
    "consecutiveCorrectAnswers" INTEGER NOT NULL,
    "nextSettingQuestion" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("userId", "problemId"),
    CONSTRAINT "Result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Result_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("consecutiveCorrectAnswers", "createdAt", "lastAnswerd", "nextSettingQuestion", "problemId", "updatedAt", "userId") SELECT "consecutiveCorrectAnswers", "createdAt", "lastAnswerd", "nextSettingQuestion", "problemId", "updatedAt", "userId" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
