"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SlashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/context/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSessionStore } from "@/context/useSessionStore";

interface ProgramInterface {
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

// api functions
const fetchProgramDetails = async (
  programId: string,
  userToken: string
): Promise<ProgramInterface> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/long_term_programs/${programId}`,
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );
  return response.data;
};

const applyForProgram = async (programId: string, userToken: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/apply_for_long_term_program`,
    { program_id: parseInt(programId, 10) },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return response.data;
};
const withdrawApplication = async (programId: string, userToken: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/withdraw_long_term_application`,
    { program_id: parseInt(programId, 10) },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return response.data;
};

// ------------------------------------------------------------
export default function ProgramInterfacePage() {
  const { programId } = useParams<{ programId: string }>();

  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedCategory, currentPage, cardId } = useSessionStore();

  const userToken = useAuthStore((state) => state.userToken);
  const userId = useAuthStore((state) => state.mentorData?.user_id);

  const [isApplyingLocal, setIsApplyingLocal] = useState(false);
  const [isWithdrawingLocal, setIsWithdrawingLocal] = useState(false);

  const handleBackNavigation = () => {
    const params = new URLSearchParams();
    params.set("category", selectedCategory);
    params.set("page", currentPage.toString());
    if (cardId) params.set("cardId", cardId);
    router.push(`/home?${params.toString()}`);
  };

  // query for data fetching
  const {
    data: program,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["program", programId],
    queryFn: () => fetchProgramDetails(programId!, userToken!),
    enabled: !!programId && !!userToken,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (
        error instanceof AxiosError &&
        [401, 403].includes(error.response?.status || 0)
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // mutations for Applying and Withdrawal
  const applyMutation = useMutation({
    mutationFn: () => applyForProgram(programId!, userToken!),
    onMutate: () => {
      setIsApplyingLocal(true);
    },
    onSettled: () => {
      setTimeout(() => setIsApplyingLocal(false), 1500);
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["program", programId] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error("You have already applied for this program");
        } else {
          toast.error("Failed to apply. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: () => withdrawApplication(programId!, userToken!),
    onMutate: () => {
      setIsWithdrawingLocal(true);
    },
    onSettled: () => {
      setTimeout(() => setIsWithdrawingLocal(false), 1500);
    },
    onSuccess: () => {
      toast.success("Application withdrawn successfully!");
      queryClient.invalidateQueries({ queryKey: ["program", programId] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error("No application found for this program");
        } else {
          toast.error("Failed to withdraw. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

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
    applyMutation.mutate();
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
    withdrawMutation.mutate();
  };

  if (isLoading) {
    return (
      <>
        <div className="h-[25vh] md:h-[30vh] lg:h-[40vh] w-full">
          <Navbar />
        </div>
        <section className="w-full bg-allsnowflake flex items-center justify-center py-20">
          <div className="text-h3 text-allpurple">
            Loading program details...
          </div>
        </section>
        <Footer />
      </>
    );
  }
  if (error) {
    return (
      <>
        <div className="h-[25vh] md:h-[30vh] lg:h-[40vh] w-full">
          <Navbar />
        </div>
        <section className="w-full bg-allsnowflake flex flex-col items-center justify-center py-20">
          <div className="text-h3 text-red-500 mb-4">
            Error loading program details
          </div>
          <Button onClick={() => refetch()} className="px-6 py-2">
            Try Again
          </Button>
        </section>
        <Footer />
      </>
    );
  }
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
        <div className="w-full md:w-[75vw] flex items-center justify-start mx-auto h-full px-5">
          <div className="h-fit w-full flex items-center flex-wrap">
            <button
              onClick={handleBackNavigation}
              className="text-h3 font-normal pe-1 text-gray-400 cursor-pointer hover:text-gray-200 hover:underline underline-offset-4 transition"
            >
              Allmax&apos;d
            </button>
            <SlashIcon className="w-5 h-5 text-gray-400 -rotate-20" />
            <div className="text-h3 font-normal pe-1 text-gray-400 cursor-default">
              Programs
            </div>
            <SlashIcon className="w-5 h-5 text-gray-300 -rotate-20" />
            <div className="text-h3 font-normal text-allsnowflake cursor-default">
              {program?.title}
            </div>
          </div>
        </div>
      </div>

      <section className="w-full bg-allsnowflake flex flex-col items-center justify-start py-10 md:py-20">
        <div className="flex flex-col md:flex-row justify-between items-stretch w-[90vw] md:w-[75vw] md:gap-10 mb-5">
          {/* section 2 - Shows first on mobile, second on desktop */}
          <div className="w-full md:w-auto md:min-w-[300px] md:max-w-[35%] md:order-2 bg-white rounded-lg flex flex-col items-start justify-center mb-5 p-5">
            <div className="mb-5">
              <h3 className="text-h3 text-allcharcoal">Content Overview</h3>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Date & Time</h5>
              <span className="text-body-small leading-tight text-allpurple">
                {program?.date
                  ? new Date(program.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
                , {program?.start_time}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Title</h5>
              <span className="text-body-small leading-tight text-allpurple p-0">
                {program?.title}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Module</h5>
              <span className="text-body-small leading-tight text-allpurple p-0">
                {program?.module}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Course</h5>
              <span className="text-body-small leading-tight text-allpurple p-0">
                {program?.course}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Course Level</h5>
              <span className="text-body-small leading-tight text-allpurple p-0">
                {program?.level_required}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Payment</h5>
              <span className="text-body-small leading-tight text-allpurple p-0">
                {program?.pay}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Session Duration</h5>
              <span className="text-body-small leading-tight text-allpurple p-0">
                {program?.duration}
              </span>
            </div>
            <div className="mb-4 leading-tight">
              <h5 className="text-h5 font-semibold">Location</h5>
              <span className="text-body-small leading-tight text-allpurple p-0 cursor-pointer underline">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    program?.location || ""
                  )}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {program?.location}
                </a>
              </span>
            </div>
          </div>

          {/* section 1 - Shows second on mobile, first on desktop */}
          <div className="w-full md:flex-1 md:order-1 flex flex-col justify-start items-center">
            <div className="w-full flex flex-col items-start justify-start mb-10">
              <span className="text-h2 text-allpurple mb-5">
                {program?.title}
              </span>
              <span className="text-h3 mb-3">Description</span>
              <p className="text-body text-gray-600">
                {program?.content_overview}
              </p>
            </div>
            <div className="w-full flex flex-col items-start justify-center mb-10 md:mb-5">
              <span className="text-h3 mb-5">Previous Summary</span>
              <div className="flex justify-start items-center w-full h-[75px] bg-white rounded-lg">
                <span className="text-gray-500 p-5 ">{program?.notes}</span>
              </div>
            </div>
            <div className="flex justify-center items-center w-full md:justify-start mt-5">
              {hasApplied ? (
                <Button
                  className="px-10 py-5 rounded-sm border-2 border-red-500 text-red-500 text-lg bg-transparent cursor-pointer hover:bg-red-500 hover:text-allsnowflake"
                  onClick={handleWithdrawal}
                  disabled={isWithdrawingLocal}
                >
                  {isWithdrawingLocal
                    ? "Withdrawing..."
                    : "Withdraw Application"}
                </Button>
              ) : (
                <Button
                  className="px-10 py-5 rounded-sm border-2 border-allpurple text-allpurple text-lg bg-transparent cursor-pointer hover:bg-allpurple hover:text-allsnowflake"
                  onClick={handleApply}
                  disabled={isApplyingLocal}
                >
                  {isApplyingLocal ? "Applying..." : "Apply Now"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
