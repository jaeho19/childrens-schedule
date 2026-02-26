/**
 * 구성원별 색상 매핑 유틸리티
 *
 * 이벤트의 memberIds를 기반으로 대표 색상을 반환한다.
 * - 1명: 해당 구성원 색상
 * - 2명 이상: 첫 번째 구성원 색상 (좌측 바에서 전체 구성원 표시)
 * - 0명: 기본 회색
 */
import type { Member } from "@/types";

const 기본색상 = "#9E9E9E";

/** 구성원 이름으로 색상을 반환 */
export function getColorByMember(name: string, members: Member[]): string {
  return members.find((m) => m.name === name)?.color ?? 기본색상;
}

/** 구성원 ID로 색상을 반환 */
export function getColorByMemberId(id: string, members: Member[]): string {
  return members.find((m) => m.id === id)?.color ?? 기본색상;
}

/** 이벤트의 memberIds에서 대표 색상 추출 */
export function getEventMemberColor(memberIds: string[], members: Member[]): string {
  if (memberIds.length === 0) return 기본색상;
  return members.find((m) => m.id === memberIds[0])?.color ?? 기본색상;
}

/** 이벤트에 참여하는 구성원 목록 반환 */
export function getEventMembers(memberIds: string[], members: Member[]): Member[] {
  return members.filter((m) => memberIds.includes(m.id));
}
