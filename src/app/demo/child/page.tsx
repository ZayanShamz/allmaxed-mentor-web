"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSessionStore } from "@/context/useSessionStore";

export default function DemoChild() {
  const { selectedSkill } = useSessionStore();

  return (
    <div className="min-h-screen w-full relative bg-allcharcoal">
      <Navbar />
      <div className="responsive-one flex flex-col items-center justify-center mx-auto h-dvh text-center">
        <h1 className="text-6xl md:text-7xl text-allsnowflake font-bold leading-tight">
          Child Demo
        </h1>
        <h3 className="text-allsnowflake text-2xl font-bold">
          This is the demo page for the child component with {selectedSkill}.
        </h3>
        <Link href={`/demo?skill=${selectedSkill}`} className="mt-4">
          <Button className="bg-allpurple text-allsnowflake hover:bg-allpurple/80 cursor-pointer">
            Go to Parent Demo
          </Button>
        </Link>
      </div>
    </div>
  );
}
