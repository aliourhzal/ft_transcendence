-- CreateTable
CREATE TABLE "Achievements" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AchievementsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AchievementsToUser_AB_unique" ON "_AchievementsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AchievementsToUser_B_index" ON "_AchievementsToUser"("B");

-- AddForeignKey
ALTER TABLE "_AchievementsToUser" ADD CONSTRAINT "_AchievementsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievementsToUser" ADD CONSTRAINT "_AchievementsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
