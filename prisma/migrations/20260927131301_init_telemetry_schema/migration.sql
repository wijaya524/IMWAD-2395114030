-- CreateEnum
CREATE TYPE "ModuleType" AS ENUM ('WAKE_UP', 'BATHING', 'BRUSHING_TEETH', 'WEARING_UNIFORM', 'PREPARING_BOOKS', 'BREAKFAST', 'FAREWELL');

-- CreateEnum
CREATE TYPE "DirectiveType" AS ENUM ('NONE', 'GENERAL_HINT', 'SPECIFIC_VISUAL_CUE', 'FALLBACK_STATIC');

-- CreateTable
CREATE TABLE "game_sessions" (
    "session_id" UUID NOT NULL,
    "device_pseudo_id" VARCHAR(64) NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "completed_at" TIMESTAMPTZ,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "interaction_logs" (
    "log_id" SERIAL NOT NULL,
    "session_id" UUID NOT NULL,
    "module_type" "ModuleType" NOT NULL,
    "selected_object_id" VARCHAR(100) NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "attempt_index" INTEGER NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "interaction_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "adaptive_hint_logs" (
    "hint_id" SERIAL NOT NULL,
    "log_id" INTEGER NOT NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL,
    "directive_type" "DirectiveType" NOT NULL,
    "is_fallback" BOOLEAN NOT NULL DEFAULT false,
    "execution_time_ms" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adaptive_hint_logs_pkey" PRIMARY KEY ("hint_id")
);

-- CreateIndex
CREATE INDEX "idx_sessions_device" ON "game_sessions"("device_pseudo_id");

-- CreateIndex
CREATE INDEX "idx_logs_session_module" ON "interaction_logs"("session_id", "module_type", "attempt_index");

-- CreateIndex
CREATE UNIQUE INDEX "adaptive_hint_logs_log_id_key" ON "adaptive_hint_logs"("log_id");

-- AddForeignKey
ALTER TABLE "interaction_logs" ADD CONSTRAINT "interaction_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adaptive_hint_logs" ADD CONSTRAINT "adaptive_hint_logs_log_id_fkey" FOREIGN KEY ("log_id") REFERENCES "interaction_logs"("log_id") ON DELETE CASCADE ON UPDATE CASCADE;
