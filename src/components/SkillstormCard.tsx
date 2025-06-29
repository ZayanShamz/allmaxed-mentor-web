"use client";

import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/context/authStore";
import { MapPin, Users, MoveRight } from "lucide-react";
import Link from "next/link";

import { usePathname } from "next/navigation";
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

interface SkillstormProps {
  workshopId?: string;
  topic?: string;
  appliedCount?: number;
  location?: string;
  date?: string;
  level_required?: string;
  duration?: string;
  pay?: string;
}

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
  const { userToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="flex flex-col justify-center bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer w-full h-full">
      <Link
        href={`home/workshops/${workshopId}`}
        key={workshopId}
        className="h-full pt-8 px-8 pb-3"
      >
        <div className="flex flex-col w-full h-full justify-between ">
          {/* Top section */}
          <div className="flex flex-col">
            {/* Card Header */}
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-allpurple leading-tight">
                {topic}
              </h3>
            </div>

            {/* Location */}
            <div className="flex items-start text-gray-500 mb-4 flex-1">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm leading-snug line-clamp-2">
                {location}
              </span>
            </div>
          </div>

          {/* Bottom section - Date, Tags, and Footer */}
          <div className="flex flex-col mt-auto">
            {/* Date */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-black">{date}</span>
            </div>

            {/* Tags */}
            <div className="flex gap-2 justify-start items-center w-full mb-3">
              <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
                {level_required}
              </span>
              <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
                {duration}
              </span>
              <span className="px-3 py-1 bg-allpurple text-allsnowflake text-sm font-medium rounded-full">
                {pay}/hr
              </span>
            </div>

            {/* Footer */}
            <div className="flex gap-2 justify-end w-full">
              <div className="flex items-center text-xs text-gray-400">
                <Users className="w-3 h-3 mr-1" />
                <span>{appliedCount} applied</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {/* Applied Section */}
      <div
        className={`${
          pathname === "/applied"
            ? "w-full flex justify-center items-center border-t border-gray-600 py-5 mt-auto"
            : "hidden"
        }`}
      >
        <AlertDialog>
          <AlertDialogTrigger asChild className="w-full">
            <Button
              className="w-fit bg-allpurple hover:bg-indigo-700 text-white rounded-full transition-colors duration-200 shadow-none border-0 cursor-pointer px-8"
              onClick={handleWithdrawal}
              disabled
            >
              {!isLoading ? (
                <span className="flex justify-center items-center gap-2">
                  Withdraw Application <MoveRight />
                </span>
              ) : (
                "Withdrawing..."
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
