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

interface workshopDetails {
  id: number;
  topic: string;
  description: string;
  level_required: string;
  location: string;
  content_overview: string;
  pay: string;
  start_time: string;
  date: string;
  duration: string;
  status: string;
  comment: string | null;
  user_id: number;
  created_at: number;
  updated_at: number;
  applications: {
    id: number;
    user_id: number;
    short_term_program_id: number;
    created_at: number;
    updated_at: number;
  }[];
}

export default function WorkshopDetailsPage() {
  const { workshopId } = useParams<{ workshopId: string }>();
  const userToken = useAuthStore((state) => state.userToken);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useAuthStore((state) => state.mentorData?.user_id);

  const [workshop, setWorkshop] = useState<workshopDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkshopDetails = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/short_term_programs/${workshopId}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setWorkshop(response.data);
    } catch (error) {
      console.error("Error fetching program details:", error);
      setError("Failed to fetch program details");
    } finally {
      setIsLoading(false);
    }
  }, [workshopId, userToken]);

  useEffect(() => {
    if (workshopId && userToken) {
      fetchWorkshopDetails();
    }
  }, [workshopId, userToken, fetchWorkshopDetails]);

  const hasApplied = useMemo(() => {
    if (!workshop || !workshop.applications || !userId) return false;
    return workshop.applications.some((app) => app.user_id === userId);
  }, [workshop, userId]);

  const handleApply = async () => {
    if (!userToken) {
      toast.error("Please log in to apply.");
      return;
    }

    if (!workshopId || isNaN(parseInt(workshopId, 10))) {
      toast.error("Invalid ID.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/apply_for_short_term_program`,
        { program_id: parseInt(workshopId, 10) },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (response.status === 201) {
        toast.success("Application submitted successfully!");
        await fetchWorkshopDetails();
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

    if (!workshopId || isNaN(parseInt(workshopId, 10))) {
      toast.error("Invalid program ID.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/withdraw_short_term_application`,
        { program_id: parseInt(workshopId, 10) },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (response.status === 200) {
        toast.success("Application withdrawn successfully!");
        await fetchWorkshopDetails();
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
                    className="text-h3 font-normal text-gray-400 hover:text-gray-200 hover:underline underline-offset-4 transition"
                  >
                    Allmax&apos;d
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon className="h-20" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/home"
                    className="text-h3 font-normal text-gray-400 hover:text-gray-200 hover:underline underline-offset-4"
                  >
                    Workshops
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[clamp(22px,3.5vw,28px)] text-allsnowflake cursor-default">
                  {workshop?.topic}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <section className="w-full bg-allsnowflake flex flex-col items-center justify-start py-10 md:py-20">
        <div className="flex flex-col flex-wrap md:flex-row justify-between items-stretch w-[90vw] md:max-w-screen-xl md:gap-10 mb-5">
          <div className="w-full md:flex-1 flex flex-col justify-start items-center">
            <div className="w-full flex flex-col items-start justify-start mb-10">
              <span className="text-h2 text-allpurple mb-5">
                {workshop?.topic}
              </span>
              <span className="text-h3 mb-3">Content Overview</span>
              <p className="text-body text-gray-600">
                {workshop?.content_overview}
              </p>
            </div>

            <div className="hidden md:flex justify-center items-center w-full md:justify-start mt-5">
              {hasApplied ? (
                <Button
                  className="px-10 py-5 rounded-sm border-2 border-red-500 text-red-500 text-lg bg-transparent cursor-pointer hover:bg-red-500 hover:text-allsnowflake"
                  onClick={handleWithdrawal}
                  disabled={isLoading || !!error}
                >
                  Withdraw Application
                </Button>
              ) : (
                <Button
                  className="px-10 py-5 rounded-sm border-2 border-allpurple text-allpurple text-lg bg-transparent cursor-pointer hover:bg-allpurple hover:text-allsnowflake"
                  onClick={handleApply}
                  disabled={isLoading || !!error}
                >
                  Apply Now
                </Button>
              )}
            </div>
          </div>

          <div className="w-full md:w-auto md:min-w-[300px] md:max-w-[35%] bg-white rounded-lg flex flex-col items-start justify-center mb-5 p-5">
            <div className="mb-5">
              <h3 className="text-h3 text-allcharcoal">Content Overview</h3>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Date & Time</h5>
              <span className="text-body-small leading-tight text-allpurple">
                {workshop?.date
                  ? new Date(workshop.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
                , {workshop?.start_time}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Topic</h5>
              <span className="text-body-small leading-tight text-allpurple p-0">
                {workshop?.topic}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Course Level</h5>
              <span className="text-body-small leading-tight text-allpurple p-0">
                {workshop?.level_required}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Payment</h5>
              <span className="text-body-small leading-tight text-allpurple p-0">
                {workshop?.pay}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Session Duration</h5>
              <span className="text-body-small leading-tight text-allpurple p-0">
                {workshop?.duration}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">College Name</h5>
              <span className="text-body-small leading-tight text-allpurple ">
                SAFI Institute of Advanced Study (Autonomous), Vazhayoor,
                Ramannattukara
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Location</h5>
              <span className="text-body-small leading-tight text-allpurple p-0 cursor-pointer underline">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    workshop?.location || ""
                  )}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {workshop?.location}
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="md:hidden w-[90vw] md:max-w-screen-xl flex flex-col justify-center items-center md:items-start">
          <div className="flex justify-center items-center w-full md:justify-start">
            {hasApplied ? (
              <Button
                className="px-10 py-5 rounded-sm border-2 border-red-500 text-red-500 text-lg bg-transparent cursor-pointer hover:bg-red-500 hover:text-allsnowflake"
                onClick={handleWithdrawal}
                disabled={isLoading || !!error}
              >
                Withdraw Application
              </Button>
            ) : (
              <Button
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
