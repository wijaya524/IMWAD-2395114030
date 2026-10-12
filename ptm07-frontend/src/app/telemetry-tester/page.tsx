'use client';

import React, { useState, useEffect } from 'react';
import { computeHmacSha256 } from '@/lib/crypto';
import { api, SessionSyncPayload } from '@/lib/api';

export default function TelemetryTesterPage() {
  const [appVersion, setAppVersion] = useState('1.0.0');
  const [deviceSecret, setDeviceSecret] = useState('telemetry_device_secret_salt_key');
  const [computedSignature, setComputedSignature] = useState('');
  const [manualSignatureOverride, setManualSignatureOverride] = useState(false);
  const [customSignature, setCustomSignature] = useState('');

  // Payload state
  const [payloadJson, setPayloadJson] = useState('');
  const [scenarioName, setScenarioName] = useState('NORMAL');

  // Response state
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<any>(null);

  // Generate presets
  const loadScenario = (type: 'NORMAL' | 'AI_HINT' | 'INTEGRITY_FAIL' | 'LARGE') => {
    setScenarioName(type);
    const newSessionId = crypto.randomUUID ? crypto.randomUUID() : '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
    const now = Date.now();

    if (type === 'NORMAL') {
      const normalPayload: SessionSyncPayload = {
        session_id: newSessionId,
        device_pseudo_id: 'PSEUDO_DEV_TESTER_01',
        started_at: new Date(now - 300000).toISOString(),
        completed_at: new Date(now).toISOString(),
        is_completed: true,
        interactions: [
          {
            module_type: 'WAKE_UP',
            selected_object_id: 'ITEM_ALARM_CLOCK',
            is_correct: true,
            attempt_index: 1,
            timestamp: new Date(now - 280000).toISOString(),
          },
          {
            module_type: 'BATHING',
            selected_object_id: 'ITEM_SOAP_TOWEL',
            is_correct: true,
            attempt_index: 1,
            timestamp: new Date(now - 240000).toISOString(),
          },
          {
            module_type: 'FAREWELL',
            selected_object_id: 'ITEM_KISS_HAND_PARENT',
            is_correct: true,
            attempt_index: 1,
            timestamp: new Date(now - 10000).toISOString(),
          },
        ],
      };
      setPayloadJson(JSON.stringify(normalPayload, null, 2));
    } else if (type === 'AI_HINT') {
      const aiPayload: SessionSyncPayload = {
        session_id: newSessionId,
        device_pseudo_id: 'PSEUDO_DEV_TESTER_02',
        started_at: new Date(now - 450000).toISOString(),
        completed_at: new Date(now).toISOString(),
        is_completed: true,
        interactions: [
          {
            module_type: 'PREPARING_BOOKS',
            selected_object_id: 'ITEM_COMIC_BOOK',
            is_correct: false,
            attempt_index: 1,
            timestamp: new Date(now - 400000).toISOString(),
          },
          {
            module_type: 'PREPARING_BOOKS',
            selected_object_id: 'ITEM_TOY_ROBOT',
            is_correct: false,
            attempt_index: 2,
            timestamp: new Date(now - 380000).toISOString(),
            ai_hint: {
              confidence_score: 0.86,
              directive_type: 'SPECIFIC_VISUAL_CUE',
              is_fallback: false,
              execution_time_ms: 32,
            },
          },
          {
            module_type: 'PREPARING_BOOKS',
            selected_object_id: 'ITEM_TEXTBOOK',
            is_correct: true,
            attempt_index: 3,
            timestamp: new Date(now - 360000).toISOString(),
          },
        ],
      };
      setPayloadJson(JSON.stringify(aiPayload, null, 2));
    } else if (type === 'INTEGRITY_FAIL') {
      // Pelanggaran integritas: completed_at < started_at (Uji HTTP 422)
      const invalidPayload = {
        session_id: newSessionId,
        device_pseudo_id: 'PSEUDO_DEV_TESTER_03',
        started_at: '2026-09-20T08:00:00Z',
        completed_at: '2026-09-20T07:00:00Z', // Lebih lampau!
        is_completed: true,
        interactions: [
          {
            module_type: 'WAKE_UP',
            selected_object_id: 'ITEM_ALARM_CLOCK',
            is_correct: true,
            attempt_index: 1,
            timestamp: '2026-09-20T07:30:00Z',
          },
        ],
      };
      setPayloadJson(JSON.stringify(invalidPayload, null, 2));
    }
  };

  useEffect(() => {
    loadScenario('NORMAL');
  }, []);

  // Update computed HMAC whenever payload or secret changes
  useEffect(() => {
    if (payloadJson) {
      computeHmacSha256(payloadJson, deviceSecret).then(setComputedSignature);
    }
  }, [payloadJson, deviceSecret]);

  const handleSendRequest = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseBody(null);
    setResponseTimeMs(null);

    const startTime = performance.now();
    const signatureToSend = manualSignatureOverride ? customSignature : computedSignature;

    try {
      const res = await fetch('/api/proxy/telemetry/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': appVersion,
          'X-Device-Signature': signatureToSend,
        },
        body: payloadJson,
      });

      const endTime = performance.now();
      setResponseTimeMs(Math.round(endTime - startTime));
      setResponseStatus(res.status);

      const json = await res.json().catch(() => ({ message: 'Gagal parse body respon' }));
      setResponseBody(json);
    } catch (err: any) {
      setResponseStatus(500);
      setResponseBody({ error: err.message || 'Koneksi gagal ke proxy' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <h1 style={{ fontSize: '2rem' }}>Telemetry API Playground & Tester</h1>
          <span className="badge badge-ai">OpenAPI 3.0 Sync</span>
        </div>
        <p style={{ fontSize: '0.925rem' }}>
          Uji langsung integrasi endpoint sinkronisasi backend (`POST /api/v1/telemetry/sessions`), 
          perhitungan tanda tangan HMAC-SHA256, dan validasi runtime Zod / NFR error response.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-muted)' }}>
          PILIH SKENARIO PENGUJIAN OTOMATIS:
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => loadScenario('NORMAL')}
            className={`btn ${scenarioName === 'NORMAL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            ✅ Sesi Sukses Standar (201 Created)
          </button>
          <button
            onClick={() => loadScenario('AI_HINT')}
            className={`btn ${scenarioName === 'AI_HINT' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            🧠 Sesi dengan Audit AI Hint (US-06A/B)
          </button>
          <button
            onClick={() => loadScenario('INTEGRITY_FAIL')}
            className={`btn ${scenarioName === 'INTEGRITY_FAIL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            ⚠️ Uji Integritas Waktu Rusak (422 Unprocessable)
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '1.75rem',
      }}>
        {/* Left Column: Request Headers & Body Editor */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
            1. Konfigurasi Request Header & Payload
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label">Header: X-App-Version</label>
              <input
                type="text"
                className="form-input"
                value={appVersion}
                onChange={(e) => setAppVersion(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">HMAC Secret Key</label>
              <input
                type="text"
                className="form-input"
                value={deviceSecret}
                onChange={(e) => setDeviceSecret(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Header: X-Device-Signature (HMAC-SHA256)
              </label>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <input
                  type="checkbox"
                  checked={manualSignatureOverride}
                  onChange={(e) => setManualSignatureOverride(e.target.checked)}
                />
                Uji Signature Palsu (401)
              </label>
            </div>
            <input
              type="text"
              className="form-input"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: manualSignatureOverride ? '#fda4af' : '#6ee7b7' }}
              value={manualSignatureOverride ? customSignature : computedSignature}
              onChange={(e) => setCustomSignature(e.target.value)}
              placeholder="hmac_sha256_hash_value"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Request Body (JSON Telemetri)</label>
            <textarea
              className="form-textarea"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.825rem',
                minHeight: '260px',
                lineHeight: 1.5,
              }}
              value={payloadJson}
              onChange={(e) => setPayloadJson(e.target.value)}
            />
          </div>

          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? 'Mengirim Request ke Server...' : '🚀 Eksekusi POST /telemetry/sessions'}
          </button>
        </div>

        {/* Right Column: Live Backend Response */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>
              2. Respon API Backend
            </h3>
            {responseTimeMs !== null && (
              <span className="badge badge-primary">
                ⏱️ Latensi: {responseTimeMs} ms
              </span>
            )}
          </div>

          {responseStatus !== null ? (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: responseStatus >= 200 && responseStatus < 300
                  ? 'rgba(16, 185, 129, 0.15)'
                  : responseStatus === 422
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(244, 63, 94, 0.15)',
                border: `1px solid ${
                  responseStatus >= 200 && responseStatus < 300
                    ? 'rgba(16, 185, 129, 0.3)'
                    : responseStatus === 422
                    ? 'rgba(245, 158, 11, 0.3)'
                    : 'rgba(244, 63, 94, 0.3)'
                }`,
              }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  HTTP {responseStatus}
                </span>
                <span style={{ fontSize: '0.85rem' }}>
                  {responseStatus === 201 && '✓ Data Sesi Berhasil Disimpan (Created)'}
                  {responseStatus === 400 && '✗ Format JSON / Schema Salah'}
                  {responseStatus === 401 && '✗ Device Signature Tidak Sah (Unauthorized)'}
                  {responseStatus === 422 && '⚠️ Pelanggaran Integritas Data (Unprocessable Entity)'}
                  {responseStatus === 500 && '✗ Kesalahan Internal Server'}
                </span>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                maxHeight: '380px',
                overflowY: 'auto',
              }}>
                <pre style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: responseStatus < 300 ? '#6ee7b7' : '#fda4af',
                  whiteSpace: 'pre-wrap',
                }}>
                  {JSON.stringify(responseBody, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📡</div>
              Tekan tombol <strong>"Eksekusi POST"</strong> untuk melihat status respon dan data balasan dari backend `ptm06-backend`.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
