"use client";

import { useEffect } from "react";
import type { Member, Category } from "@/types";
import { Sidebar } from "./Sidebar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  categories: Category[];
}

export function MobileDrawer({ isOpen, onClose, members, categories }: MobileDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-[visibility] ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* 오버레이: 페이드 인/아웃 */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-30" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* 드로어: 좌측 슬라이드 인/아웃 */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl overflow-y-auto
          transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700">필터</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-gray-100"
            aria-label="닫기"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Sidebar members={members} categories={categories} />
      </div>
    </div>
  );
}
