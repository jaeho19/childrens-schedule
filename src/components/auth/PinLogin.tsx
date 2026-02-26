"use client";

import { useState, useRef, useCallback } from "react";

interface PinLoginProps {
  onSuccess: () => void;
}

const PIN_LENGTH = 4;

export function PinLogin({ onSuccess }: PinLoginProps) {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = useCallback(
    async (pin: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        });
        if (res.ok) {
          onSuccess();
        } else {
          const data = await res.json() as { error?: { message?: string } };
          setError(data.error?.message ?? "PIN이 올바르지 않습니다.");
          setDigits(Array(PIN_LENGTH).fill(""));
          setTimeout(() => inputRefs.current[0]?.focus(), 0);
        }
      } catch {
        setError("네트워크 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return;
      const next = [...digits];
      next[index] = value;
      setDigits(next);
      setError(null);

      if (value && index < PIN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (value && index === PIN_LENGTH - 1) {
        const pin = [...next.slice(0, PIN_LENGTH - 1), value].join("");
        if (pin.length === PIN_LENGTH) {
          void handleSubmit(pin);
        }
      }
    },
    [digits, handleSubmit]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mb-2 text-4xl">📅</div>
          <h1 className="text-2xl font-bold text-gray-900">가족 캘린더</h1>
          <p className="mt-1 text-sm text-gray-500">PIN 4자리를 입력하세요</p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`h-14 w-14 rounded-xl border-2 text-center text-xl font-bold outline-none transition-colors ${
                error
                  ? "border-red-400 bg-red-50"
                  : digit
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50 focus:border-blue-400"
              }`}
              disabled={loading}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && (
          <p className="mb-4 text-center text-sm font-medium text-red-500">{error}</p>
        )}

        {loading && (
          <p className="text-center text-sm text-gray-400">확인 중...</p>
        )}
      </div>
    </div>
  );
}
