"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { SlashIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuthStore } from "@/context/authStore";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

interface ProgramDetails {
  id: number;
  title: string;
  module: string;
  description: string;
  level_required: string;
  location: string;
  course: string;
  date: string;
  notes: string | null;
  content_overview: string;
  pay: string;
  duration: string;
  start_time: string;
  status: string;
  comment: string | null;
  user_id: number;
  created_at: number;
  updated_at: number;
  applications: {
    id: number;
    user_id: number;
    long_term_program_id: number;
    created_at: number;
    updated_at: number;
  }[];
}

export default function ProgramDetailsPage() {
  const { programId } = useParams<{ programId: string }>();
  const userToken = useAuthStore((state) => state.userToken);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useAuthStore((state) => state.mentorData?.user_id);

  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProgramDetails = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/long_term_programs/${programId}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setProgram(response.data);
    } catch (error) {
      console.error("Error fetching program details:", error);
      setError("Failed to fetch program details");
    } finally {
      setIsLoading(false);
    }
  }, [programId, userToken]);

  useEffect(() => {
    if (programId && userToken) {
      fetchProgramDetails();
    }
  }, [programId, userToken, fetchProgramDetails]);

  const hasApplied = useMemo(() => {
    if (!program || !program.applications || !userId) return false;
    return program.applications.some((app) => app.user_id === userId);
  }, [program, userId]);

  const handleApply = async () => {
    if (!userToken) {
      toast.error("Please log in to apply.");
      return;
    }

    if (!programId || isNaN(parseInt(programId, 10))) {
      toast.error("Invalid program ID.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/apply_for_long_term_program`,
        { program_id: parseInt(programId, 10) },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (response.status === 201) {
        toast.success("Application submitted successfully!");
        await fetchProgramDetails();
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error("You have already applied for this program");
        } else {
          toast.error("Failed to apply. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!userToken) {
      toast.error("Please log in to withdraw.");
      return;
    }

    if (!programId || isNaN(parseInt(programId, 10))) {
      toast.error("Invalid program ID.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/withdraw_long_term_application`,
        { program_id: parseInt(programId, 10) },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (response.status === 200) {
        toast.success("Application withdrawn successfully!");
        await fetchProgramDetails();
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error("No application found for this program");
        } else {
          toast.error("Failed to withdraw. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="h-[25vh] md:h-[30vh] lg:h-[40vh] w-full"
        style={{
          backgroundImage: `
                linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0)),
                url('/images/college_bg.png')
              `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />
        <div className="max-w-screen-2xl flex items-center justify-start mx-auto h-full px-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/home"
                    className="title-text-1 text-gray-400 hover:text-gray-200 hover:underline underline-offset-4 transition"
                  >
                    Allmax&apos;d
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/home"
                    className="title-text-1 text-gray-400 hover:text-gray-200 hover:underline underline-offset-4"
                  >
                    Programs
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="title-text-1 text-allsnowflake cursor-default">
                  {program?.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <section className="w-full bg-allsnowflake flex flex-col items-center justify-start py-10 md:py-20">
        <div className="w-[90vw] md:max-w-screen-xl flex flex-col flex-wrap md:flex-row justify-between items-stretch mb-5">
          <div className="w-full md:w-[60%] flex flex-col justify-between items-center">
            <div className="w-full flex flex-col items-start justify-start mb-10">
              <span className="text-[clamp(24px,3vw,32px)] text-allpurple mb-5 font-semibold">
                {program?.title}
              </span>
              <span className="text-[clamp(18px,3vw,28px)] font-semibold mb-3">
                Content Overview
              </span>
              <p className="text-[clamp(12px,3vw,18px)] text-gray-600 text-justify">
                {program?.content_overview}
              </p>
            </div>
            <div className="w-full flex flex-col items-start justify-center mb-10 md:mb-5">
              <span className="text-[clamp(18px,3vw,28px)] font-semibold mb-5">
                Previous Summary
              </span>
              <div className="flex justify-start items-center w-full h-[75px] bg-white rounded-lg">
                <span className="text-gray-500 p-5 ">
                  Previous summary Here
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[30%] bg-white rounded-lg flex flex-col items-start justify-center mb-5 p-5">
            <div className="mb-5">
              <h3 className="text-[clamp(18px,3vw,26px)] font-semibold text-allcharcoal">
                Content Overview
              </h3>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-[clamp(16px,3vw,18px)] font-semibold">
                Date & Time
              </h5>
              <span className="text-[clamp(12px,3vw,14px)] text-allpurple">
                {program?.date}, {program?.start_time}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-[clamp(16px,3vw,18px)] font-semibold">
                Topic
              </h5>
              <span className="text-[clamp(12px,3vw,14px)] text-allpurple p-0">
                {program?.title}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-[clamp(16px,3vw,18px)] font-semibold">
                Course
              </h5>
              <span className="text-[clamp(12px,3vw,14px)] text-allpurple p-0">
                {program?.course}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-[clamp(16px,3vw,18px)] font-semibold">
                Course Level
              </h5>
              <span className="text-[clamp(12px,3vw,14px)] text-allpurple p-0">
                {program?.level_required}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-[clamp(16px,3vw,18px)] font-semibold">
                Payment
              </h5>
              <span className="text-[clamp(12px,3vw,14px)] text-allpurple p-0">
                {program?.pay}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-[clamp(16px,3vw,18px)] font-semibold">
                Session Duration
              </h5>
              <span className="text-[clamp(12px,3vw,14px)] text-allpurple p-0">
                {program?.duration}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-[clamp(16px,3vw,18px)] font-semibold">
                College Name
              </h5>
              <span className="text-[clamp(12px,3vw,14px)] text-allpurple leading-3">
                SAFI Institute of Advanced Study (Autonomous), Vazhayoor,
                Ramannattukara
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-[clamp(16px,3vw,18px)] font-semibold">
                Location
              </h5>
              <span className="text-[clamp(12px,3vw,14px)] text-allpurple p-0 cursor-pointer">
                <a href="#" target="_self">
                  {program?.location}
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="w-[90vw] md:max-w-screen-xl flex flex-col justify-center items-center md:items-start">
          <div className="flex justify-center items-center w-full md:justify-start">
            {hasApplied ? (
              <Button
                variant={"outline"}
                className="px-10 py-5 rounded-sm border-2 border-red-500 text-red-500 text-lg bg-transparent cursor-pointer hover:bg-red-500 hover:text-allsnowflake"
                onClick={handleWithdrawal}
                disabled={isLoading || !!error}
              >
                Withdraw Application
              </Button>
            ) : (
              <Button
                variant={"outline"}
                className="px-10 py-5 rounded-sm border-2 border-allpurple text-allpurple text-lg bg-transparent cursor-pointer hover:bg-allpurple hover:text-allsnowflake"
                onClick={handleApply}
                disabled={isLoading || !!error}
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
