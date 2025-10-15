"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { type QuestType } from "./QuestSelector";

interface QuestDropdownProps {
    selected: QuestType;
    onSelect: (quest: QuestType) => void;
}

const QUEST_OPTIONS = [
    {
        type: "bronze" as QuestType,
        name: "Bronze Quest",
        amount: "1 USDT",
        color: "#EDA94D",
        icon: "/img/bronze-badge.png",
        disabled: false,
    },
    {
        type: "silver" as QuestType,
        name: "Silver Quest",
        amount: "2 USDT",
        color: "#D2D2D2",
        icon: "/img/silver-badge.png",
        disabled: false,
    },
    {
        type: "gold" as QuestType,
        name: "Gold Quest",
        amount: "5 USDT",
        color: "#F9C928",
        icon: "/img/gold-badge.png",
        disabled: true,
    },
    {
        type: "crystal" as QuestType,
        name: "Crystal Quest",
        amount: "10 USDT",
        color: "#54C3EE",
        icon: "/img/crystal-badge.png",
        disabled: true,
    },
];

export function QuestDropdown({ selected, onSelect }: QuestDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const selectedQuest = QUEST_OPTIONS.find((q) => q.type === selected);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);
    
    const handleSelect = (questType: QuestType) => {
        const quest = QUEST_OPTIONS.find((q) => q.type === questType);
        if (quest?.disabled) return;
        
        onSelect(questType);
        setIsOpen(false);
    };
    
    return (
        <div ref={dropdownRef} className="relative w-full">
            {/* Label */}
            <div className="text-sm text-[#888888] mb-2">Choose Quest</div>
            
            {/* Selected Quest Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[rgba(241,241,241,0.4)] border border-[rgba(230,230,230,0.52)] rounded-xl px-4 py-2 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    {selectedQuest && (
                        <>
                            <div className="w-6 h-6 relative flex-shrink-0">
                                <Image
                                    src={selectedQuest.icon}
                                    alt={selectedQuest.name}
                                    fill
                                    className="object-contain rounded-full"
                                />
                            </div>
                            <span className="text-sm text-[rgba(3,3,3,0.6)]">
                                {selectedQuest.name} - {selectedQuest.amount}
                            </span>
                        </>
                    )}
                </div>
                
                {/* Dropdown Arrow */}
                <svg
                    width="9"
                    height="5"
                    viewBox="0 0 9 5"
                    fill="none"
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                    <path
                        d="M1 1L4.5 4L8 1"
                        stroke="#888888"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[rgba(230,230,230,0.52)] rounded-xl shadow-lg z-50 overflow-hidden">
                    {QUEST_OPTIONS.map((quest) => (
                        <button
                            key={quest.type}
                            onClick={() => handleSelect(quest.type)}
                            disabled={quest.disabled}
                            className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                                quest.disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-[rgba(241,241,241,0.4)]"
                            } ${
                                quest.type === selected
                                    ? "bg-[rgba(169,213,255,0.19)] border-l-2 border-[#05ABFF]"
                                    : ""
                            }`}
                        >
                            <div className="w-6 h-6 relative flex-shrink-0">
                                <Image
                                    src={quest.icon}
                                    alt={quest.name}
                                    fill
                                    className="object-contain rounded-full"
                                />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm text-[rgba(3,3,3,0.6)]">
                                    {quest.name}
                                </div>
                                <div className="text-xs text-[#888888]">
                                    {quest.amount} round
                                </div>
                            </div>
                            {quest.disabled && (
                                <span className="text-xs text-[#888888]">
                                    Coming soon
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
