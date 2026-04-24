-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "currentLevel" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
