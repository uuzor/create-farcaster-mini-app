"use client";
import { MobileShell } from "@/components/ui/MobileShell";
import { TopBar } from "@/components/ui/TopBar";
import { PillButton } from "@/components/ui/PillButton";
import Link from "next/link";

export default function HomePage() {
  return (
    <MobileShell activeTab="home" topBar={<TopBar title="Blink" />}>
      <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-170px)]">
        <h2 className="text-2xl font-bold mb-2">Welcome to Blink</h2>
        <p className="text-textSecondary mb-6">
          Bet on creators, channels, and viral moments.
        </p>
        <Link href="/markets" className="w-full">
          <PillButton className="w-full">Get Started</PillButton>
        </Link>
      </div>
    </MobileShell>
  );
}