"use client";

import React from "react";
import { MapPin, Users } from "lucide-react";
import { Button } from "./ui/button";
import { MoveRight } from "lucide-react";
import { usePathname } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/context/authStore";
import Link from "next/link";

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

interface AllmaxedProps {
  programId?: string;
  title?: string;
  appliedCount?: number;
  location?: string;
  date?: string;
  description?: string;
  level_required?: string;
}

const AllmaxedCard: React.FC<AllmaxedProps> = ({
  programId,
  title,
  appliedCount,
  location,
  date,
  description,
  level_required,
}) => {
  const pathname = usePathname();
  const { userToken } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  console.log(programId);

  const handleWithdrawal = async () => {
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
    <div className="flex flex-col justify-center  bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 max-w-sm cursor-pointer lg:min-w-[300px] min-w-[70vw] sm:min-w-[60vw] md:min-w-0 h-full">
      <Link
        href={`home/programs/${programId}`}
        key={programId}
        className="h-full pt-8 px-8 pb-3"
      >
        <div className="flex flex-col h-full w-full justify-between">
          {/* Top section - Card Header and Location */}
          <div className="flex flex-col">
            {/* Card Header */}
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-allpurple leading-tight">
                {title}
              </h3>
            </div>

            {/* Location */}
            <div className="flex items-start text-gray-500 mb-4 flex-1">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm leading-snug">{location}</span>
            </div>
          </div>

          {/* Bottom section - Date, Tags, and Footer (fixed positioning) */}
          <div className="flex flex-col mt-auto">
            {/* Date */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-black">{date}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-start gap-2 mb-3">
              <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
                {description}
              </span>
              <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
                {level_required}
              </span>
            </div>

            {/* footer - users applied section */}
            <div className="flex justify-end">
              <div className="flex items-center text-xs text-gray-400">
                <Users className="w-3 h-3 mr-1" />
                <span>{appliedCount} applied</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {/* Applied Page Section */}
      <div
        className={`${
          pathname === "/applied"
            ? "w-full flex justify-center items-center border-t border-gray-600 py-3 mt-auto"
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

export default AllmaxedCard;
