-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinedTable" (
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "socketId" TEXT,

    CONSTRAINT "JoinedTable_pkey" PRIMARY KEY ("userId","roomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_room_name_key" ON "Room"("room_name");

-- AddForeignKey
ALTER TABLE "JoinedTable" ADD CONSTRAINT "JoinedTable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinedTable" ADD CONSTRAINT "JoinedTable_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
