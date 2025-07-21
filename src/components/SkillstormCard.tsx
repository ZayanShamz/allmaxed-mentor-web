"use client";

import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/context/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useSessionStore } from "@/context/useSessionStore";

// ui
import toast from "react-hot-toast";
import { MapPin, Users, MoveRight, Calendar } from "lucide-react";
import { Button } from "./ui/button";
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

interface SkillstormProps {
  workshopId?: string;
  topic?: string;
  appliedCount?: string;
  location?: string;
  date?: string;
  level_required?: string;
  duration?: string;
  pay?: string;
}

const withdrawApplication = async (workshopId: string, userToken: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/withdraw_short_term_application`,
    { program_id: parseInt(workshopId, 10) },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return response.data;
};

const SkillstormCard: React.FC<SkillstormProps> = ({
  workshopId,
  topic,
  appliedCount,
  location,
  date,
  level_required,
  duration,
  pay,
}) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userToken } = useAuthStore();
  const { selectCardAndNavigate } = useSessionStore();
  const [isWithdrawingLocal, setIsWithdrawingLocal] = useState(false);

  // Handle card click to set cardId and navigate
  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest('[role="dialog"]')
    ) {
      console.log("Click ignored: target is button or dialog");
      return;
    }

    if (!workshopId) {
      console.error("No workshopId provided");
      return;
    }

    console.log("handleCardClick: workshopId =", workshopId);
    const url = selectCardAndNavigate(
      workshopId,
      `/home/workshops/${workshopId}`
    );
    console.log("Attempting navigation to:", url);
    setTimeout(() => {
      router.push(url);
      console.log("Navigation executed:", url);
    }, 0);
  };

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

  return (
    <div
      className="flex flex-col justify-center bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer w-full h-full"
      onClick={handleCardClick}
    >
      <div className="h-full py-7 px-8 ">
        <div className="flex flex-col w-full h-full justify-between ">
          {/* Top section - Card Header*/}
          <div className="relative flex items-start pb-12">
            <div className="flex-1 pr-16">
              <h3 className="text-2xl font-semibold text-allpurple leading-tight pr-3">
                {topic}
              </h3>
            </div>
            <div className="absolute top-2 right-0 flex items-center text-xs text-gray-400">
              <Users className="w-3 h-3 mr-1" />
              <span>{appliedCount} applied</span>
            </div>
          </div>

          {/* Bottom section - Location, Date, Tags, and Footer */}
          <div className="flex flex-col mt-auto">
            {/* Location */}
            <div className="flex items-start text-gray-500 mb-2 flex-1">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm truncate">{location}</span>
            </div>
            {/* Date */}
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-md font-bold text-allcharcoal">{date}</span>
            </div>

            {/* Tags */}
            <div className="flex gap-2 justify-start items-center w-full">
              <Tooltip>
                <TooltipTrigger>
                  <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
                    {level_required}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Level Required</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full line-clamp-1">
                    {duration}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Course Duration</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <span className="px-3 py-1 bg-allpurple text-allsnowflake text-sm font-medium rounded-full">
                    {pay}/hr {/* per hour fixed? */}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Payment</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Footer */}
            <div className="flex gap-2 justify-end w-full"></div>
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
                className="cursor-pointer text-white bg-red-500  hover:bg-red-600"
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

export default SkillstormCard;
