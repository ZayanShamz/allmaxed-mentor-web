"use client";

import React from "react";
import { MapPin, Users } from "lucide-react";
import { Button } from "./ui/button";
import { MoveRight, Calendar } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/context/authStore";
import { useSessionStore } from "@/context/useSessionStore";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AllmaxedProps {
  programId?: string;
  title?: string;
  appliedCount?: string;
  location?: string;
  date?: string;
  module?: string;
  level_required?: string;
}

// api fn
const withdrawApplication = async (allmaxedId: string, userToken: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/withdraw_long_term_application`,
    { program_id: parseInt(allmaxedId, 10) },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return response.data;
};

const AllmaxedCard: React.FC<AllmaxedProps> = ({
  programId,
  title,
  appliedCount,
  location,
  date,
  module,
  level_required,
}) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const { userToken } = useAuthStore();
  const { selectCardAndNavigate } = useSessionStore();
  const [isWithdrawingLocal, setIsWithdrawingLocal] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest('[role="dialog"]')
    ) {
      console.log("Click ignored: target is button or dialog");
      return;
    }

    if (!programId) {
      console.error("No programId provided");
      return;
    }

    console.log("handleCardClick: programId =", programId);
    const url = selectCardAndNavigate(programId, `/home/programs/${programId}`);
    console.log("Attempting navigation to:", url);
    setTimeout(() => {
      router.push(url);
      console.log("Navigation executed:", url);
    }, 0);
  };

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

  return (
    <div
      className="flex flex-col justify-center bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer w-full h-full"
      onClick={handleCardClick}
    >
      <div className="h-full py-7 px-8">
        <div className="flex flex-col h-full w-full justify-between">
          {/* Top section - Card Header */}
          <div className="flex flex-col pb-12 ">
            {/* Card Header */}
            <div className="relative flex items-start">
              <div className="flex-1 pr-16">
                <h3 className="text-2xl font-semibold text-allpurple leading-tight pr-3">
                  {title}
                </h3>
              </div>
              <div className="absolute top-2 right-0 flex items-center text-xs text-gray-400">
                <Users className="w-3 h-3 mr-1" />
                <span className="line-clamp-1">{appliedCount} applied</span>
              </div>
            </div>
          </div>

          {/* Bottom section - Date, Tags, and Footer */}
          <div className="flex flex-col mt-auto">
            {/* Location */}
            <div className="flex items-start text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-[3px]" />
              <span className="text-sm truncate">{location}</span>
            </div>
            {/* Date */}
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-md font-bold text-allcharcoal">{date}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-start gap-2 py-1">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
                      {module}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Module</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
                      {level_required}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Level Required</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      {/* Applied Section */}
      <div
        className={`${
          pathname === "/applied"
            ? "w-full flex justify-center items-center border-t border-gray-600 py-5 mt-auto"
            : "hidden"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <AlertDialog>
          <AlertDialogTrigger asChild className="w-full">
            <Button
              className="w-fit bg-allpurple hover:bg-indigo-700 text-white rounded-full transition-colors duration-200 shadow-none border-0 cursor-pointer px-8"
              // disabled={isWithdrawingLocal}
              disabled
            >
              {isWithdrawingLocal ? (
                "Withdrawing..."
              ) : (
                <span className="flex justify-center items-center gap-2">
                  Withdraw Application <MoveRight />
                </span>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-md">
                Your application for this program will be withdrawn. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer text-white bg-red-500 hover:bg-red-600"
                onClick={handleWithdrawal}
              >
                Withdraw
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AllmaxedCard;
