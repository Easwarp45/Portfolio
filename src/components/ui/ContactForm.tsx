'use client';

import React, { useState } from 'react';
import { Terminal, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ContactFormProps {
  activeSection: string;
  isTransmitting: boolean;
  setIsTransmitting: (status: boolean) => void;
}

export default function ContactForm({ activeSection, isTransmitting, setIsTransmitting }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<{
    packetId: string;
    timestamp: string;
    message: string;
  } | null>(null);

  if (activeSection !== 'contact') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessResponse(null);

    // Validate empty required checks
    if (!name.trim()) {
      setErrorMsg('> ERROR: INVALID_PAYLOAD. IDENTITY NAME REQUIRED.');
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      setErrorMsg('> ERROR: INVALID_PAYLOAD. ROUTING EMAIL REQUIRED.');
      setLoading(false);
      return;
    }
    if (!message.trim()) {
      setErrorMsg('> ERROR: INVALID_PAYLOAD. PAYLOAD MESSAGE REQUIRED.');
      setLoading(false);
      return;
    }

    // Secondary formatting diagnostics checks
    if (name.trim().length < 2) {
      setErrorMsg('> ERROR: IDENTITY_CHECK_FAILED. Name must be at least 2 characters.');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('> ERROR: ROUTING_CHECK_FAILED. Enter a valid email routing address.');
      setLoading(false);
      return;
    }
    if (message.trim().length < 10) {
      setErrorMsg('> ERROR: PAYLOAD_SIZE_INSUFFICIENT. Message must be at least 10 characters.');
      setLoading(false);
      return;
    }

    // Trigger the 3D data-packet animation flight
    setIsTransmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gateway connection lost during relay.');
      }

      setSuccessResponse(data);
      // Clear inputs on success
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Transmission failed. Connection timed out.');
      setIsTransmitting(false); // Stop animation early on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] z-20 pointer-events-auto font-mono">
      <div className="glass-panel border border-cyber-green/30 rounded shadow-2xl overflow-hidden text-glow-green">
        
        {/* Terminal Header Bar */}
        <div className="bg-slate-950 px-4 py-2 border-b border-cyber-green/20 flex justify-between items-center text-xs text-cyber-green/70">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-green" />
            <span className="font-bold tracking-wider uppercase">GATEWAY_PROMPT://api.contact</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-green/60" />
          </div>
        </div>

        {/* Terminal Screen area */}
        <div className="p-4 md:p-6 bg-slate-950/80 flex flex-col gap-4 text-xs text-cyber-green">
          
          {/* Diagnostic info console */}
          {!successResponse && !errorMsg && (
            <div className="text-[10px] text-cyber-green/60 leading-relaxed border-b border-cyber-green/10 pb-3">
              === SECURE ROUTING GATEWAY ESTABLISHED ===<br/>
              &gt; STATUS: STANDBY<br/>
              &gt; ENTER REQUIRED IDENTITY PAYLOAD CHUNKS BELOW.
            </div>
          )}

          {/* Error Message Output */}
          {errorMsg && (
            <div className="bg-red-950/40 border border-red-500/30 p-3 rounded text-[11px] text-red-400 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold uppercase">System Error Code:</span> {errorMsg}
              </div>
            </div>
          )}

          {/* Success Message Output */}
          {successResponse && (
            <div className="bg-green-950/40 border border-cyber-green/40 p-4 rounded text-[11px] text-cyber-green/90 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                <span>PAYLOAD TRANSMITTED SUCCESSFULLY</span>
              </div>
              <div className="grid grid-cols-3 gap-y-1 text-[10px] text-cyber-green/70 border-t border-cyber-green/10 pt-2 mt-1">
                <span>PACKET ID:</span>
                <span className="col-span-2 text-white font-bold">{successResponse.packetId}</span>
                
                <span>TIMESTAMP:</span>
                <span className="col-span-2 text-white">{new Date(successResponse.timestamp).toLocaleString()}</span>
                
                <span>STATUS:</span>
                <span className="col-span-2 text-cyber-green">SECURELY_STORED</span>
              </div>
              <p className="mt-2 text-[10px] italic text-cyber-green/80">
                &gt; {successResponse.message}
              </p>
            </div>
          )}

          {/* Contact Input Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase tracking-wider text-cyber-green/60 font-bold">
                Identity Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || isTransmitting}
                placeholder="Developer / Recruiter"
                className="bg-slate-900 border border-cyber-green/20 focus:border-cyber-green text-white text-xs px-3 py-2 rounded outline-none placeholder:text-cyber-green/30 focus:shadow-[0_0_8px_rgba(0,255,102,0.15)] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase tracking-wider text-cyber-green/60 font-bold">
                Email Destination:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || isTransmitting}
                placeholder="recruiter@company.com"
                className="bg-slate-900 border border-cyber-green/20 focus:border-cyber-green text-white text-xs px-3 py-2 rounded outline-none placeholder:text-cyber-green/30 focus:shadow-[0_0_8px_rgba(0,255,102,0.15)] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase tracking-wider text-cyber-green/60 font-bold">
                Message Payload:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading || isTransmitting}
                placeholder="System collaboration proposal..."
                rows={3}
                className="bg-slate-900 border border-cyber-green/20 focus:border-cyber-green text-white text-xs px-3 py-2 rounded outline-none resize-none placeholder:text-cyber-green/30 focus:shadow-[0_0_8px_rgba(0,255,102,0.15)] transition-all"
              />
            </div>

            {/* Submission triggers */}
            <button
              type="submit"
              disabled={loading || isTransmitting}
              className="mt-2 bg-cyber-green/10 hover:bg-cyber-green/20 border border-cyber-green hover:shadow-[0_0_12px_rgba(0,255,102,0.3)] transition-all duration-300 py-2.5 rounded font-bold uppercase tracking-widest text-[10px] text-cyber-green flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              {loading ? (
                <span>RELAYING DATA PACKET...</span>
              ) : isTransmitting ? (
                <span>TRANSMITTING ON FLY PATH...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 animate-pulse" />
                  <span>LAUNCH_TRANSMISSION.SH</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
