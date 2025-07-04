"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SlashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/context/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const fetchWorkshopDetails = async (
  workshopId: string,
  userToken: string
): Promise<workshopDetails> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/short_term_programs/${workshopId}`,
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );
  return response.data;
};

const applyForWorkshop = async (workshopId: string, userToken: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/apply_for_short_term_program`,
    { program_id: parseInt(workshopId, 10) },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return response.data;
};

const withdrawApplication = async (workshopId: string, userToken: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/withdraw_short_term_application`,
    { program_id: parseInt(workshopId, 10) },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return response.data;
};

export default function WorkshopDetailsPage() {
  const { workshopId } = useParams<{ workshopId: string }>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const userToken = useAuthStore((state) => state.userToken);
  const userId = useAuthStore((state) => state.mentorData?.user_id);

  const returnTo = searchParams.get("returnTo");

  // to manage ze buttons
  const [isApplyingLocal, setIsApplyingLocal] = useState(false);
  const [isWithdrawingLocal, setIsWithdrawingLocal] = useState(false);

  const handleBackNavigation = () => {
    if (returnTo) {
      // Decode and navigate to the return URL with preserved state
      router.push(decodeURIComponent(returnTo));
    } else {
      // Fallback to regular back navigation
      router.back();
    }
  };

  // Query for fetching workshop details
  const {
    data: workshop,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["workshop", workshopId],
    queryFn: () => fetchWorkshopDetails(workshopId!, userToken!),
    enabled: !!workshopId && !!userToken,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors
      if (
        error instanceof AxiosError &&
        [401, 403].includes(error.response?.status || 0)
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Mutation for applying to workshop
  const applyMutation = useMutation({
    mutationFn: () => applyForWorkshop(workshopId!, userToken!),
    onMutate: () => {
      setIsApplyingLocal(true);
    },
    onSettled: () => {
      setTimeout(() => setIsApplyingLocal(false), 1500);
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["workshop", workshopId] });
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

  // Mutation for withdrawing application
  const withdrawMutation = useMutation({
    mutationFn: () => withdrawApplication(workshopId!, userToken!),
    onMutate: () => {
      setIsWithdrawingLocal(true);
    },
    onSettled: () => {
      setTimeout(() => setIsWithdrawingLocal(false), 1500);
    },
    onSuccess: () => {
      toast.success("Application withdrawn successfully!");
      // Invalidate and refetch workshop data to get updated applications
      queryClient.invalidateQueries({ queryKey: ["workshop", workshopId] });
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

    applyMutation.mutate();
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

    withdrawMutation.mutate();
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="h-[25vh] md:h-[30vh] lg:h-[40vh] w-full">
          <Navbar />
        </div>
        <section className="w-full bg-allsnowflake flex items-center justify-center py-20">
          <div className="text-h3 text-allpurple">
            Loading workshop details...
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <div className="h-[25vh] md:h-[30vh] lg:h-[40vh] w-full">
          <Navbar />
        </div>
        <section className="w-full bg-allsnowflake flex flex-col items-center justify-center py-20">
          <div className="text-h3 text-red-500 mb-4">
            Error loading workshop details
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
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />
        <div className="max-w-screen-2xl flex items-center justify-start mx-auto h-full px-5">
          <div className="h-fit w-full flex items-center">
            <button
              onClick={handleBackNavigation}
              className="text-h3 font-normal pe-1 text-gray-400 cursor-pointer hover:text-gray-200 hover:underline underline-offset-4 transition"
            >
              Allmax&apos;d
            </button>
            <SlashIcon className="w-5 h-5 text-gray-400 -rotate-20" />
            <div className="text-h3 font-normal pe-1 text-gray-400 cursor-default">
              Workshops
            </div>
            <SlashIcon className="w-5 h-5 text-gray-300 -rotate-20" />
            <div className="text-h3 font-normal text-allsnowflake cursor-default">
              {workshop?.topic}
            </div>
          </div>
        </div>
      </div>

      <section className="w-full bg-allsnowflake flex flex-col items-center justify-start py-10 md:py-20">
        <div className="flex flex-col md:flex-row justify-between items-stretch w-[90vw] md:max-w-screen-xl md:gap-10">
          {/* section card - first on mobile, right on desktop */}
          <div className="w-full md:w-auto md:min-w-[300px] md:max-w-[35%] md:order-2 bg-white rounded-lg flex flex-col items-start justify-center max-md:mb-5 p-5">
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

          {/* left on >md (md:order-1), second on mobile */}
          <div className="w-full md:flex-1 md:order-1 max-md:mt-10 flex flex-col justify-start items-center">
            <div className="w-full flex flex-col items-start justify-start mb-10">
              <span className="text-h2 text-allpurple mb-5">
                {workshop?.topic}
              </span>
              <span className="text-h3 mb-3">Description</span>
              <p className="text-body text-gray-600">
                {workshop?.content_overview}
              </p>
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
