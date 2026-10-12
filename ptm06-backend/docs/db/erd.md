# Entity Relationship Diagram (ERD) - Daily Life Game Telemetry

```mermaid
erDiagram
    GAME_SESSIONS ||--o{ INTERACTION_LOGS : "has"
    INTERACTION_LOGS ||--o| ADAPTIVE_HINT_LOGS : "triggers"

    GAME_SESSIONS {
        uuid session_id PK "UUID Primary Key"
        varchar device_pseudo_id "Indexed Identifier"
        timestamptz started_at "Waktu mulai sesi"
        timestamptz completed_at "Waktu selesai (nullable)"
        boolean is_completed "Status penyelesaian sesi"
        timestamptz created_at "Audit timestamp"
    }

    INTERACTION_LOGS {
        bigserial log_id PK "BIGINT Primary Key"
        uuid session_id FK "FK references GAME_SESSIONS"
        enum module_type "Aktivitas harian (WAKE_UP, dsb.)"
        varchar selected_object_id "ID objek interaksi"
        boolean is_correct "Status kebenaran input"
        int attempt_index "Percobaan ke-n (>= 1)"
        timestamptz timestamp "Waktu interaksi"
    }

    ADAPTIVE_HINT_LOGS {
        bigserial hint_id PK "BIGINT Primary Key"
        bigint log_id FK "FK UNIQUE references INTERACTION_LOGS"
        double_precision confidence_score "Tingkat keyakinan model (0.0 - 1.0)"
        enum directive_type "Tipe bimbingan adaptif"
        boolean is_fallback "Penanda penggunaan fallback statis"
        int execution_time_ms "Latensi inferensi (<= 3000 ms)"
        timestamptz created_at "Audit timestamp"
    }
