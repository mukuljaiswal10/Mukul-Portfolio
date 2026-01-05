-- CreateTable
CREATE TABLE "FeedbackEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scope" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "rating" INTEGER,
    "name" TEXT,
    "email" TEXT,
    "message" TEXT,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FeedbackState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scope" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "name" TEXT,
    "email" TEXT,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "FeedbackEvent_scope_slug_idx" ON "FeedbackEvent"("scope", "slug");

-- CreateIndex
CREATE INDEX "FeedbackEvent_visitorId_scope_slug_idx" ON "FeedbackEvent"("visitorId", "scope", "slug");

-- CreateIndex
CREATE INDEX "FeedbackState_scope_slug_idx" ON "FeedbackState"("scope", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackState_visitorId_scope_slug_key" ON "FeedbackState"("visitorId", "scope", "slug");
