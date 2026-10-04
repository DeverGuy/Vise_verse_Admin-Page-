"use client";
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  Megaphone,
  SlidersHorizontal,
  Users,
  Gavel,
  Calendar,
  Clock
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/club-members', icon: UserCheck, label: 'Club Members' },
    { href: '/announcements', icon: Megaphone, label: 'Announcements' },
    { href: '/participants', icon: Users, label: 'Participants & Teams' },
    { href: '/judges', icon: Gavel, label: 'Judges & Panels' },
    { href: '/event-details', icon: Calendar, label: 'Event Details' },
    { href: '/event-flow', icon: Clock, label: 'Event Schedule & Flow' },
    { href: '/settings', icon: SlidersHorizontal, label: 'Settings' }
  ];

  return (
    <aside className="w-full md:w-[280px] bg-surface-color md:border-r border-b md:border-b-0 border-border-color flex flex-col justify-between py-5 md:sticky top-0 md:h-screen z-10">
      {/* Header Logo */}
      <div className="px-6 pb-5 border-b border-border-color">
        <div className="flex items-center gap-3">
          <img
            src="/Vice_verse_logo.png"
            alt="Vice Verse Logo"
            className="w-[65px] h-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 10px rgba(251, 200, 21, 0.4))' }}
          />
          <div>
            <h2 className="font-heading text-[1.5rem] tracking-[2px] m-0 text-text-primary uppercase animate-flicker leading-tight">
              Vice Verse Admin
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 flex flex-col gap-1.5 overflow-y-auto">
        <p className="font-tech text-xs uppercase tracking-[2px] text-text-secondary mb-2 pl-3 font-bold">
          Main Menu
        </p>

        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 py-2.5 px-3.5 rounded font-tech font-semibold uppercase tracking-[1px] text-sm transition-all duration-200 border-l-[3px] animate-fade-in
                ${
                  isActive
                    ? 'bg-gradient-to-r from-[rgba(255,0,127,0.15)] to-transparent text-text-primary border-accent-secondary nav-item-active shadow-[0_0_10px_rgba(255,0,127,0.1)]'
                    : 'text-text-secondary border-transparent hover:bg-[rgba(255,0,127,0.05)] hover:text-text-primary hover:border-border-color hover:pl-5'
                }
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <item.icon
                size={18}
                className={`transition-all duration-300 ${
                  isActive ? 'text-accent-secondary' : 'group-hover:text-text-primary'
                }`}
                style={{
                  filter: isActive
                    ? 'drop-shadow(0 0 8px #FF007F)'
                    : 'drop-shadow(0 0 3px rgba(255,255,255,0.3))'
                }}
              />
              <span
                className={`transition-all duration-300 ${isActive ? 'animate-flicker' : ''}`}
                style={{
                  textShadow: isActive
                    ? '0 0 8px #FF007F'
                    : 'none'
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Clean & Aligned Footer Logos */}
      <div className="px-4 py-4 border-t border-border-color mt-auto bg-surface-color/50">
        <div className="flex flex-col items-center justify-center gap-3">
          <img
            src="/vvce-logo.png"
            alt="VVCE Logo"
            className="h-12 w-auto object-contain transition-transform hover:scale-105"
            style={{ filter: 'drop-shadow(0 0 10px rgba(251, 200, 21, 0.4))' }}
          />
          <div className="flex items-center justify-center gap-3 w-full">
            <img
              src="/ivc-logo-transparent.png"
              alt="IVC Logo"
              className="h-9 w-auto object-contain transition-transform hover:scale-105"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255, 0, 127, 0.4))' }}
            />
            <span className="font-tech text-sm text-text-secondary font-bold">X</span>
            <img
              src="/image.png"
              alt="InUnity Logo"
              className="h-9 w-auto object-contain transition-transform hover:scale-105"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.4))' }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
