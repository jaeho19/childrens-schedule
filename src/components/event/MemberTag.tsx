/**
 * 구성원 이름 태그 컴포넌트
 *
 * 텍스트 안에서 구성원 이름을 감지하여 색상 태그로 하이라이트한다.
 * 예: "이선우 영어수업" → [이선우] 영어수업
 */
"use client";

import type { Member } from "@/types";

interface MemberTagProps {
  /** 구성원 정보 */
  member: Member;
  /** 크기 (기본: sm) */
  size?: "xs" | "sm";
}

/** 단일 구성원 태그 */
export function MemberTag({ member, size = "sm" }: MemberTagProps) {
  const sizeClass = size === "xs" ? "text-[9px] px-1 py-px" : "text-[10px] px-1.5 py-0.5";
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClass}`}
      style={{
        backgroundColor: `${member.color}30`,
        color: member.color,
      }}
    >
      {member.name}
    </span>
  );
}

interface HighlightedTextProps {
  /** 원본 텍스트 */
  text: string;
  /** 전체 구성원 목록 */
  members: Member[];
  /** 텍스트 기본 className */
  className?: string;
}

/** 텍스트 내 구성원 이름을 자동 감지하여 태그로 하이라이트 */
export function HighlightedText({ text, members, className = "" }: HighlightedTextProps) {
  if (!text || members.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // 구성원 이름으로 정규식 생성 (긴 이름 우선 매칭)
  const names = members
    .map((m) => m.name)
    .sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${names.map(escapeRegExp).join("|")})`, "g");
  const memberMap = new Map(members.map((m) => [m.name, m]));

  const parts = text.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const member = memberMap.get(part);
        if (member) {
          return <MemberTag key={i} member={member} size="xs" />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
