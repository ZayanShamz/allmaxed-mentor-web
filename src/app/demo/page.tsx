"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/context/authStore";
import Link from "next/link";
import { SlashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import * as Tooltip from "@radix-ui/react-tooltip";
import { X, MoveLeft } from "lucide-react";

interface UpdateMentorPayload {
  portfolio_link?: string | null;
  social_media_link?: string | null;
  // Add other fields that your API expects
  age?: number;
  gender?: string;
  aadhaar_no?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  field?: string;
  current_occupation?: string;
  designation?: string;
  experience?: string;
  workplace?: string;
  duration?: string;
}

export default function EditProfile() {
  const mentorData = useAuthStore((state) => state.mentorData);
  const userData = useAuthStore((state) => state.userData);
  const userToken = useAuthStore((state) => state.userToken);
  const setMentorData = useAuthStore((state) => state.setMentorData);
  const mentorId = mentorData?.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [portfolioLink, setPortfolioLink] = useState(
    mentorData?.portfolio_link || ""
  );
  const [socialMediaLink, setSocialMediaLink] = useState(
    mentorData?.social_media_link || ""
  );
  const [errors, setErrors] = useState({ portfolio: "", social: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // validate url input (api needs proper url)
  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid (optional field)

    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPortfolioLink(value);
    if (errors.portfolio) {
      setErrors((prev) => ({ ...prev, portfolio: "" }));
    }
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSocialMediaLink(value);
    if (errors.social) {
      setErrors((prev) => ({ ...prev, social: "" }));
    }
  };

  const handlePortfolioBlur = () => {
    if (portfolioLink && !isValidUrl(portfolioLink)) {
      setErrors((prev) => ({
        ...prev,
        portfolio: "Please enter a valid URL starting with http:// or https://",
      }));
    } else {
      setErrors((prev) => ({ ...prev, portfolio: "" }));
    }
  };

  const handleSocialBlur = () => {
    if (socialMediaLink && !isValidUrl(socialMediaLink)) {
      setErrors((prev) => ({
        ...prev,
        social: "Please enter a valid URL starting with http:// or https://",
      }));
    } else {
      setErrors((prev) => ({ ...prev, social: "" }));
    }
  };

  const handleClearPortfolio = () => {
    setPortfolioLink("");
    setErrors((prev) => ({ ...prev, portfolio: "" }));
  };

  const handleClearSocialMedia = () => {
    setSocialMediaLink("");
    setErrors((prev) => ({ ...prev, social: "" }));
  };

  // Mutation for updating mentor data
  const updateMentorMutation = useMutation({
    mutationFn: async (payload: UpdateMentorPayload) => {
      if (!mentorId || !userToken) {
        throw new Error("Missing mentor ID or token");
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mentors/${mentorId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");

      // Update the mentor data in authStore
      if (data.mentor) {
        setMentorData(data.mentor);
      }

      // Invalidate and refetch any queries that depend on mentor data
      queryClient.invalidateQueries({ queryKey: ["mentor", mentorId] });
      router.push("/profile");
    },
    onError: (error) => {
      console.error("Update failed:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to update profile";

        if (error.response?.status === 500) {
          const validationErrors = error.response?.data?.message;
          if (validationErrors) {
            if (validationErrors.portfolio_link) {
              setErrors((prev) => ({
                ...prev,
                portfolio: validationErrors.portfolio_link[0],
              }));
            }
            if (validationErrors.social_media_link) {
              setErrors((prev) => ({
                ...prev,
                social: validationErrors.social_media_link[0],
              }));
            }
            toast.error("Please fix the validation errors");
            return;
          }
        }

        toast.error(errorMessage);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!mentorId) {
      toast.error("Mentor ID not found");
      return;
    }

    const originalPortfolio = mentorData?.portfolio_link || "";
    const originalSocial = mentorData?.social_media_link || "";

    const hasPortfolioChanged = portfolioLink.trim() !== originalPortfolio;
    const hasSocialChanged = socialMediaLink.trim() !== originalSocial;

    if (!hasPortfolioChanged && !hasSocialChanged) {
      toast.error("No changes detected");
      return;
    }

    const apiPayload: UpdateMentorPayload = {
      age: mentorData?.age,
      gender: mentorData?.gender,
      aadhaar_no: mentorData?.aadhaar_no,
      phone: userData?.phone,
      address: mentorData?.address,
      city: mentorData?.city,
      district: mentorData?.district,
      state: mentorData?.state,
      field: mentorData?.field,
      current_occupation: mentorData?.current_occupation,
      designation: mentorData?.designation,
      experience: mentorData?.experience,
      workplace: mentorData?.workplace,
      duration: mentorData?.duration,
    };

    if (hasPortfolioChanged) {
      apiPayload.portfolio_link =
        portfolioLink.trim() === "" ? null : portfolioLink.trim();
    } else {
      apiPayload.portfolio_link = mentorData?.portfolio_link;
    }

    if (hasSocialChanged) {
      apiPayload.social_media_link =
        socialMediaLink.trim() === "" ? null : socialMediaLink.trim();
    } else {
      apiPayload.social_media_link = mentorData?.social_media_link;
    }

    updateMentorMutation.mutate(apiPayload);
  };

  const isLoading = updateMentorMutation.isPending;

  return (
    <>
      <div
        className="h-[25vh] md:h-[30vh] w-full"
        style={{
          backgroundImage: `
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(0, 0, 0)),
                          url('/images/bg.jpg')
                        `,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-screen-2xl flex items-center justify-start mx-auto h-full px-5">
          <div className="h-fit w-full flex items-center">
            <Link
              href="/home"
              className="text-h3 font-normal pe-1 text-gray-300 hover:text-gray-200 hover:underline underline-offset-4 transition"
            >
              Allmax&apos;d
            </Link>
            <SlashIcon className="w-5 h-5 text-gray-300 -rotate-20" />
            <Link
              href="/profile"
              className="text-h3 font-normal pe-1 text-gray-300 hover:text-gray-200 hover:underline underline-offset-4 transition"
            >
              Profile
            </Link>
            <SlashIcon className="w-5 h-5 text-gray-300 -rotate-20" />
            <div className="text-h3 font-normal text-allsnowflake cursor-default">
              Edit Profile
            </div>
          </div>
        </div>
      </div>
      <Navbar />
      <Tooltip.Provider>
        <div className="w-full flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="flex justify-center w-[90vw] my-5"
          >
            <div className="bg-white overflow-hidden shadow rounded-lg border w-full sm:w-[80%] md:w-[70%] lg:w-[45%] my-10">
              <div className="px-6 py-5">
                <div className="text-h3 leading-6 font-medium text-allcharcoal">
                  Edit Personal Information
                </div>
              </div>
              <div className="border-t border-gray-200 px-5">
                <dl className="divide-y divide-gray-200">
                  <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                    <dt className="text-body-small font-medium text-gray-500">
                      Portfolio
                    </dt>
                    <dd className="text-gray-900 col-span-2 relative">
                      <Tooltip.Root
                        open={
                          submitted &&
                          !!errors.portfolio &&
                          focusedField === "portfolio"
                        }
                      >
                        <Tooltip.Trigger asChild>
                          <Input
                            type="url"
                            name="portfolio"
                            className="pr-10"
                            placeholder="Portfolio Link (optional)"
                            value={portfolioLink}
                            onChange={handlePortfolioChange}
                            onBlur={() => {
                              handlePortfolioBlur();
                              setFocusedField(null);
                            }}
                            onFocus={() => setFocusedField("portfolio")}
                            disabled={isLoading}
                          />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            side="bottom"
                            align="center"
                            className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50"
                            sideOffset={5}
                          >
                            {errors.portfolio}
                            <Tooltip.Arrow className="fill-red-500" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                      {portfolioLink && (
                        <span
                          className="absolute right-1 p-3 rounded-2xl top-1/2 transform -translate-y-1/2 cursor-pointer text-allcharcoal hover:bg-gray-100"
                          onClick={handleClearPortfolio}
                          aria-hidden="true"
                        >
                          <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                    <dt className="text-body-small font-medium text-gray-500">
                      Social Media
                    </dt>
                    <dd className="text-gray-900 col-span-2 relative">
                      <Tooltip.Root
                        open={
                          submitted &&
                          !!errors.social &&
                          focusedField === "social"
                        }
                      >
                        <Tooltip.Trigger asChild>
                          <Input
                            type="url"
                            name="social"
                            className="pr-10"
                            placeholder="Social Media Link (optional)"
                            value={socialMediaLink}
                            onChange={handleSocialChange}
                            onBlur={() => {
                              handleSocialBlur();
                              setFocusedField(null);
                            }}
                            onFocus={() => setFocusedField("social")}
                            disabled={isLoading}
                          />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            side="bottom"
                            align="center"
                            className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50"
                            sideOffset={5}
                          >
                            {errors.social}
                            <Tooltip.Arrow className="fill-red-500" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                      {socialMediaLink && (
                        <span
                          className="absolute right-1 p-3 rounded-2xl top-1/2 transform -translate-y-1/2 cursor-pointer text-allcharcoal hover:bg-gray-100"
                          onClick={handleClearSocialMedia}
                          aria-hidden="true"
                        >
                          <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="py-10 px-3 flex items-center justify-between md:justify-center gap-4">
                    <Button
                      onClick={() => router.push("/profile")}
                      disabled={isLoading}
                      className="py-5 border-2 border-allcharcoal text-allcharcoal bg-transparent hover:bg-allcharcoal hover:text-allsnowflake cursor-pointer"
                    >
                      <span className="flex justify-center items-center px-3 gap-3 text-lg">
                        <MoveLeft /> Cancel
                      </span>
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="py-5 bg-allpurple text-allsnowflake text-lg border-2 border-allpurple cursor-pointer hover:bg-indigo-700 disabled:opacity-50 disabled:bg-gray-500"
                    >
                      <span className="flex justify-center items-center px-3 text-lg">
                        {isLoading ? "Updating..." : "Submit Changes"}
                      </span>
                    </Button>
                  </div>
                </dl>
              </div>
            </div>
          </form>
        </div>
      </Tooltip.Provider>
      <Footer />
    </>
  );
}
