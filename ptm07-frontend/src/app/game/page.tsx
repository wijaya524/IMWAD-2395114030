'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TakoMascot, { TakoMood } from '@/components/TakoMascot';
import { GAME_MODULES, GameOptionItem } from '@/lib/gameData';
import { api, InteractionLogItem, SessionSyncPayload } from '@/lib/api';

export default function GameSimulatorPage() {
  // Game session states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [devicePseudoId, setDevicePseudoId] = useState('PSEUDO_DEV_TABLET_A01');
  const [startedAt, setStartedAt] = useState('');
  const [completedAt, setCompletedAt] = useState<string | null>(null);

  // Active step
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const currentModule = GAME_MODULES[currentModuleIndex];

  // Module state
  const [attemptIndex, setAttemptIndex] = useState(1);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [aiActive, setAiActive] = useState(false);
  const [takoMood, setTakoMood] = useState<TakoMood>('NORMAL');
  const [takoDialog, setTakoDialog] = useState('');
  const [highlightOptionId, setHighlightOptionId] = useState<string | null>(null);

  // Logs accumulator
  const [interactions, setInteractions] = useState<InteractionLogItem[]>([]);

  // Sync result
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [syncMessage, setSyncMessage] = useState('');

  // Module entry time for idle_time_ms measurement
  const [moduleEnteredAt, setModuleEnteredAt] = useState<number>(Date.now());

  // Start game handler
  const handleStartGame = () => {
    const newSessionId = crypto.randomUUID ? crypto.randomUUID() : 'session_' + Date.now();
    const nowIso = new Date().toISOString();

    setSessionId(newSessionId);
    setStartedAt(nowIso);
    setCompletedAt(null);
    setCurrentModuleIndex(0);
    setAttemptIndex(1);
    setConsecutiveFailures(0);
    setAiActive(false);
    setTakoMood('NORMAL');
    setTakoDialog(GAME_MODULES[0].introDialog);
    setHighlightOptionId(null);
    setInteractions([]);
    setSyncStatus('IDLE');
    setSyncMessage('');
    setIsPlaying(true);
    setIsCompleted(false);
    setModuleEnteredAt(Date.now());
  };

  // Change dialog on module load
  useEffect(() => {
    if (isPlaying && currentModule) {
      setTakoDialog(currentModule.introDialog);
      setTakoMood('NORMAL');
      setConsecutiveFailures(0);
      setAiActive(false);
      setHighlightOptionId(null);
      setAttemptIndex(1);
      setModuleEnteredAt(Date.now());
    }
  }, [currentModuleIndex, isPlaying]);

  // Object selection handler
  const handleSelectOption = async (option: GameOptionItem) => {
    const isCorrect = option.isCorrect;
    const nowIso = new Date().toISOString();
    const idleTimeMs = Math.max(100, Date.now() - moduleEnteredAt);

    let aiHintData: any = undefined;

    if (isCorrect) {
      // Pilihan Benar
      const newLogItem: InteractionLogItem = {
        module_type: currentModule.id,
        selected_object_id: option.id,
        is_correct: true,
        attempt_index: attemptIndex,
        timestamp: nowIso,
      };

      const updatedInteractions = [...interactions, newLogItem];
      setInteractions(updatedInteractions);

      setTakoMood('HAPPY');
      setTakoDialog(currentModule.correctDialog);
      setHighlightOptionId(null);

      setTimeout(() => {
        if (currentModuleIndex < GAME_MODULES.length - 1) {
          setCurrentModuleIndex((prev) => prev + 1);
        } else {
          handleFinishGame(updatedInteractions);
        }
      }, 1400);
    } else {
      // Pilihan Salah - Evaluasi dengan AI Decision Tree Inference Engine
      const nextFailCount = consecutiveFailures + 1;
      setConsecutiveFailures(nextFailCount);

      // Panggil endpoint AI Predict backend
      try {
        const aiRes = await api.ai.predict({
          moduleType: currentModule.id,
          attemptIndex: attemptIndex,
          idleTimeMs: idleTimeMs,
          consecutiveFailures: nextFailCount,
          isDistractorClicked: true,
        });

        if (aiRes.status === 'SUCCESS' && aiRes.data) {
          aiHintData = {
            confidence_score: aiRes.data.confidence_score,
            directive_type: aiRes.data.directive_type,
            is_fallback: aiRes.data.is_fallback,
            execution_time_ms: aiRes.data.execution_time_ms,
          };

          // Reaksi Tako berdasarkan direktif hasil evaluasi AI
          if (aiRes.data.directive_type === 'SPECIFIC_VISUAL_CUE') {
            setAiActive(true);
            setTakoMood('ADAPTIVE');
            setTakoDialog(currentModule.adaptiveDialog);
            const correctOption = currentModule.options.find((o) => o.isCorrect);
            if (correctOption) setHighlightOptionId(correctOption.id);
          } else if (aiRes.data.directive_type === 'GENERAL_HINT') {
            setTakoMood('ENCOURAGING');
            setTakoDialog(currentModule.firstErrorDialog);
          } else if (aiRes.data.directive_type === 'FALLBACK_STATIC') {
            setTakoMood('NORMAL');
            setTakoDialog(currentModule.fallbackDialog);
          } else {
            setTakoMood('ENCOURAGING');
            setTakoDialog(currentModule.firstErrorDialog);
          }
        }
      } catch (err) {
        console.warn('AI Predict fallback error:', err);
      }

      // Catat log interaksi lengkap dengan audit ai_hint
      const newLogItem: InteractionLogItem = {
        module_type: currentModule.id,
        selected_object_id: option.id,
        is_correct: false,
        attempt_index: attemptIndex,
        timestamp: nowIso,
        ...(aiHintData && { ai_hint: aiHintData }),
      };

      setInteractions([...interactions, newLogItem]);
      setAttemptIndex((prev) => prev + 1);
    }
  };

  // Finish game & sync to backend
  const handleFinishGame = async (finalInteractions: InteractionLogItem[]) => {
    const finishIso = new Date().toISOString();
    setCompletedAt(finishIso);
    setIsCompleted(true);
    setIsPlaying(false);
    setSyncStatus('SYNCING');
    setSyncMessage('Menyinkronkan log telemetri ke server ptm06-backend...');

    const payload: SessionSyncPayload = {
      session_id: sessionId,
      device_pseudo_id: devicePseudoId,
      started_at: startedAt,
      completed_at: finishIso,
      is_completed: true,
      interactions: finalInteractions,
    };

    // Save in local storage history
    const stored = localStorage.getItem('dl_synced_sessions_history');
    let history = stored ? JSON.parse(stored) : [];
    const aiHintsCount = finalInteractions.filter((i) => !!i.ai_hint).length;
    history.unshift({
      sessionId: payload.session_id,
      devicePseudoId: payload.device_pseudo_id,
      startedAt: payload.started_at,
      completedAt: payload.completed_at,
      isCompleted: true,
      totalInteractions: finalInteractions.length,
      aiHintsCount,
    });
    localStorage.setItem('dl_synced_sessions_history', JSON.stringify(history.slice(0, 30)));

    // Send to backend API
    try {
      const res = await api.telemetry.syncSession(payload);
      if (res.status === 'SUCCESS') {
        setSyncStatus('SUCCESS');
        setSyncMessage(`Sesi berhasil disimpan di backend! Synced records: ${res.data?.synced_records_count}`);
      } else {
        setSyncStatus('ERROR');
        setSyncMessage(res.message || 'Gagal menyimpan ke database backend (Sesi tersimpan di memori lokal)');
      }
    } catch (err: any) {
      setSyncStatus('ERROR');
      setSyncMessage(err.message || 'Koneksi ke backend gagal (Tersimpan luring / offline-ready)');
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Intro / Splash State */}
      {!isPlaying && !isCompleted && (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            marginBottom: '1.5rem',
            boxShadow: '0 12px 32px rgba(245, 158, 11, 0.4)',
          }}>
            🐱
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
            Simulasi Game Bina Diri *Daily Life*
          </h1>

          <p style={{ maxWidth: '640px', margin: '0 auto 2rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Belajar runtutan 7 rutinitas pagi mandiri bersama maskot ramah <strong>Tako</strong>. 
            Setiap pilihan dianalisis secara cerdas oleh mesin Decision Tree dan AI Bimbingan Adaptif.
          </p>

          <div style={{
            maxWidth: '380px',
            margin: '0 auto 2rem',
            textAlign: 'left',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <label className="form-label">ID Perangkat Siswa (Device Pseudo ID)</label>
            <input
              type="text"
              className="form-input"
              value={devicePseudoId}
              onChange={(e) => setDevicePseudoId(e.target.value)}
              placeholder="PSEUDO_DEV_TABLET_A01"
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
              Privasi terjamin: tanpa mengumpulkan nama asli / PII siswa disabilitas.
            </span>
          </div>

          <button
            onClick={handleStartGame}
            className="btn btn-tako"
            style={{ padding: '0.9rem 2.25rem', fontSize: '1.15rem' }}
          >
            <span>🚀</span>
            <span>Mulai Permainan Sekarang</span>
          </button>
        </div>
      )}

      {/* Active Game Playing State */}
      {isPlaying && currentModule && (
        <div>
          {/* Progress Bar & Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.8rem' }}>
                Langkah {currentModule.stepNumber} dari 7
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                • {currentModule.sceneName}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Percobaan #{attemptIndex}
              </span>
              <button
                onClick={() => setIsPlaying(false)}
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
              >
                Batalkan
              </button>
            </div>
          </div>

          {/* Stepper Dots */}
          <div style={{
            display: 'flex',
            gap: '0.4rem',
            marginBottom: '1.75rem',
          }}>
            {GAME_MODULES.map((m, idx) => {
              const isPast = idx < currentModuleIndex;
              const isCurrent = idx === currentModuleIndex;
              return (
                <div
                  key={m.id}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    background: isCurrent ? '#f59e0b' : isPast ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isCurrent ? '0 0 8px rgba(245, 158, 11, 0.5)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
              );
            })}
          </div>

          {/* Tako Mascot Dialog Card */}
          <div style={{ marginBottom: '2rem' }}>
            <TakoMascot
              dialog={takoDialog}
              mood={takoMood}
              isAiActive={aiActive}
            />
          </div>

          {/* Scene Stage & Options */}
          <div className="glass-panel-elevated" style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>
                {currentModule.title}
              </h2>
              <p style={{ fontSize: '0.9rem' }}>
                Sentuh atau klik salah satu pilihan benda di bawah ini:
              </p>
            </div>

            {/* 3 Interactive Option Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}>
              {currentModule.options.map((option) => {
                const isGlow = highlightOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option)}
                    className={isGlow ? 'animate-pulse-glow' : ''}
                    style={{
                      background: isGlow ? 'rgba(245, 158, 11, 0.18)' : 'rgba(17, 24, 39, 0.75)',
                      border: isGlow ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.75rem 1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!isGlow) {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isGlow) {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {isGlow && (
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '1.1rem',
                      }}>
                        👆
                      </span>
                    )}

                    <div style={{
                      fontSize: '3.5rem',
                      marginBottom: '0.85rem',
                      filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))',
                    }}>
                      {option.icon}
                    </div>

                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: isGlow ? '#fbbf24' : 'var(--text-primary)',
                      marginBottom: '0.35rem',
                      fontFamily: 'var(--font-heading)',
                    }}>
                      {option.name}
                    </div>

                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                    }}>
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{
            width: '92px',
            height: '92px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)',
          }}>
            🎉
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
            Hore! Semua 7 Misi Pagi Tuntas!
          </h1>

          <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Kamu telah menyelesaikan seluruh rangkaian persiapan dari bangun tidur hingga pamitan ke sekolah. 
            Ibu dan Guru bangga padamu!
          </p>

          {/* Telemetry Sync Status Alert */}
          <div style={{
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
            background: syncStatus === 'SUCCESS' ? 'rgba(16, 185, 129, 0.15)' : syncStatus === 'SYNCING' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${syncStatus === 'SUCCESS' ? 'rgba(16, 185, 129, 0.3)' : syncStatus === 'SYNCING' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            fontSize: '0.9rem',
          }}>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
              {syncStatus === 'SYNCING' && '⏳ Mengirim Telemetri ke Backend...'}
              {syncStatus === 'SUCCESS' && '✅ Sinkronisasi API Berhasil'}
              {syncStatus === 'ERROR' && '⚠️ Catatan Sinkronisasi'}
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {syncMessage}
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Session ID: {sessionId}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleStartGame}
              className="btn btn-tako"
              style={{ padding: '0.8rem 1.75rem' }}
            >
              🔄 Mainkan Lagi
            </button>
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ padding: '0.8rem 1.75rem' }}
            >
              📊 Lihat Laporan di Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
