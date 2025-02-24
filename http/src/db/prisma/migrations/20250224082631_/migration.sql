-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "By" TEXT NOT NULL,
    "Avatar" TEXT NOT NULL,
    "Date" TEXT NOT NULL,
    "Link" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Category" TEXT NOT NULL,
    "Poster" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
