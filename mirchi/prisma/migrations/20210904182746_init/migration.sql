-- CreateTable
CREATE TABLE "Message" (
    "internal_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" JSON NOT NULL,
    "authorId" BIGINT NOT NULL,
    "messageId" BIGINT NOT NULL,
    "chatId" BIGINT NOT NULL,

    PRIMARY KEY ("internal_id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" BIGINT NOT NULL,
    "title" TEXT,
    "type" TEXT,
    "memberCount" INTEGER,
    "timeLastActive" TIMESTAMP(6),
    "minithumbnail" TEXT,
    "description" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "username" VARCHAR(255),
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "status" VARCHAR(255),
    "type" VARCHAR(255),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Update" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update" JSON NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat.id_unique" ON "Chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User.id_unique" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Message" ADD FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
