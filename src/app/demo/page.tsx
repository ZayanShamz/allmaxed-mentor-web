"use client";

// import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/context/useSessionStore";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function DemoPage() {
  const { selectedSkill, setSelectedSkill, isInitialized, setInitialized } =
    useSessionStore();
  console.log("selectedSkill:", selectedSkill, "isInitialized:", isInitialized);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current && !isInitialized) {
      setSelectedSkill("skill1"); // Reset to skill1 on page refresh
      setInitialized(true); // Mark store as initialized
      isInitialMount.current = false;
    }
  }, [setSelectedSkill, isInitialized, setInitialized]);

  // Update URL when selectedSkill changes
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("skill", selectedSkill);
    router.push(`/demo?${currentParams.toString()}`, { scroll: false });
  }, [selectedSkill, router, searchParams]);

  return (
    <div className="min-h-screen w-full relative bg-allcharcoal">
      <Navbar />
      <div className="responsive-one flex flex-col items-center justify-center mx-auto h-dvh text-center">
        <h1 className="text-6xl md:text-7xl text-allsnowflake font-bold leading-tight">
          Let’s Share Your Skills!
        </h1>
        <div className="flex flex-col items-center justify-center bg-allsnowflake px-4 py-2 rounded-md my-5">
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="skill1">Skill 1</option>
            <option value="skill2">Skill 2</option>
            <option value="skill3">Skill 3</option>
          </select>
        </div>
        <Link href={`/demo/child?skill=${selectedSkill}`} className="my-4">
          <Button className="bg-allpurple text-allsnowflake hover:bg-allpurple/80 cursor-pointer">
            Go to Child Demo
          </Button>
        </Link>
        <div>
          <h3 className="text-allsnowflake text-2xl font-bold">
            Selected Skill: {selectedSkill}
          </h3>
        </div>
      </div>
    </div>
  );
}
