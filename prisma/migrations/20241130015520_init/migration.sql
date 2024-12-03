-- CreateTable
CREATE TABLE "Portal" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "Portal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Captura" (
    "id" SERIAL NOT NULL,
    "portalId" INTEGER NOT NULL,
    "filtros" JSONB,
    "status" TEXT NOT NULL,
    "dataHoraInicio" TIMESTAMP(3) NOT NULL,
    "dataHoraFim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Captura_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Captura" ADD CONSTRAINT "Captura_portalId_fkey" FOREIGN KEY ("portalId") REFERENCES "Portal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
