"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SlashIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AllmaxedCard from "@/components/AllmaxedCard";
import SkillstormCard from "@/components/SkillstormCard";
import { useAuthStore } from "@/context/authStore";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

interface AllmaxedData {
  id: string;
  title: string;
  appliedCount: number;
  location: string;
  date: string;
  module: string;
  level_required: string;
}

interface SkillstormData {
  id: string;
  topic: string;
  appliedCount: number;
  location: string;
  date: string;
  level_required: string;
  duration: string;
  pay: string;
}

export default function Appliedpage() {
  // states
  const [activeTab, setActiveTab] = useState<"allmaxed" | "skillstorm">(
    "allmaxed"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(9);

  const [allmaxedData, setAllmaxedData] = useState<AllmaxedData[]>([]);
  const [skillstormData, setSkillstormData] = useState<SkillstormData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userToken = useAuthStore((state) => state.userToken);
  // const userId = useAuthStore((state) => state.mentorData?.user_id);

  const totalAllmaxedCards = allmaxedData.length;
  const totalAllmaxedPages = Math.ceil(totalAllmaxedCards / cardsPerPage);

  const totalSkillstormCards = skillstormData.length;
  const totalSkillstormPages = Math.ceil(totalSkillstormCards / cardsPerPage);

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  // Handling cards per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      setCardsPerPage(window.innerWidth < 1024 ? 8 : 9);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset Pagination on tab chnge
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!userToken) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch both datasets in parallel
        const [allmaxedResponse, skillstormResponse] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/long_term_programs`,
            { headers: { Authorization: `Bearer ${userToken}` } }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/short_term_programs`,
            { headers: { Authorization: `Bearer ${userToken}` } }
          ),
        ]);

        console.log("Allmaxed API Response:", allmaxedResponse.data);
        console.log("Skillstorm API Response:", skillstormResponse.data);

        setAllmaxedData(allmaxedResponse.data);
        setSkillstormData(skillstormResponse.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching data:", error.message);
          setError(error.message);
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userToken]);

  const allmaxedCards = allmaxedData
    .slice(startIndex, endIndex)
    .map((card, index) => {
      const allmaxedCard = card as AllmaxedData;

      return (
        <AllmaxedCard
          programId={allmaxedCard.id}
          key={startIndex + index}
          title={allmaxedCard.title}
          appliedCount={startIndex + index || 0}
          location={allmaxedCard.location}
          date={new Date(allmaxedCard.date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          })}
          module={allmaxedCard.module}
          level_required={
            allmaxedCard.level_required.charAt(0).toUpperCase() +
            allmaxedCard.level_required.slice(1)
          }
        />
      );
    });

  const skillstormCards = skillstormData
    .slice(startIndex, endIndex)
    .map((card, index) => {
      const skillstormCard = card as SkillstormData;
      return (
        <SkillstormCard
          workshopId={skillstormCard.id}
          key={startIndex + index}
          topic={skillstormCard.topic}
          appliedCount={startIndex + index || 0}
          location={skillstormCard.location}
          date={new Date(skillstormCard.date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          })}
          level_required={
            skillstormCard.level_required.charAt(0).toUpperCase() +
            skillstormCard.level_required.slice(1)
          }
          duration={skillstormCard.duration}
          pay={skillstormCard.pay}
        />
      );
    });

  return (
    <>
      <div
        className="h-[25vh] md:h-[30vh] lg:h-[40vh] w-full"
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
            <div className="text-h3 font-normal text-allsnowflake cursor-default">
              Applied
            </div>
          </div>
        </div>
      </div>
      <Navbar />
      <div className="min-h-dvh w-full flex flex-col justify-start items-center py-10">
        <div className="w-full flex justify-center">
          <div className="w-[70%] sm:w-[40%] lg:w-[30%] bg-white border rounded-md p-3">
            <div className="grid grid-cols-2 bg-[#EBE8FF] rounded-sm overflow-hidden items-center p-1 relative">
              {/* Slider */}
              <div
                className={`absolute top-0.5 bottom-0.5 left-0.5 w-1/2 bg-white rounded-sm shadow-sm transition-transform duration-300 ease-in-out ${
                  activeTab === "allmaxed"
                    ? "translate-x-0"
                    : "translate-x-[calc(100%-0.25rem)]"
                }`}
              />
              <button
                onClick={() => setActiveTab("allmaxed")}
                className={`flex-1 text-center px-5 py-2 rounded-sm relative z-10 transition-all duration-300 cursor-pointer ${
                  activeTab === "allmaxed"
                    ? "text-[#6B46C1] font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Allmax&apos;d
              </button>

              <button
                onClick={() => setActiveTab("skillstorm")}
                className={`flex-1 text-center px-5 py-2 rounded-sm relative z-10 transition-all duration-300 cursor-pointer ${
                  activeTab === "skillstorm"
                    ? "text-[#6B46C1] font-medium"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Skillstorm
              </button>
            </div>
          </div>
        </div>

        <div className="w-[80vw] sm:w-[70vw] md:w-[80vw] lg:w-[80vw] min-h-dvh flex justify-center px-5 mt-8">
          <div className="relative overflow-hidden w-full">
            {/* Allmaxed Tab Content */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "allmaxed"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full absolute inset-0"
              }`}
            >
              <div className="w-full flex flex-col justify-center items-center pt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 auto-rows-fr">
                  {loading ? (
                    <div className="md:col-span-2 lg:col-span-3 text-center text-lg text-allcharcoal">
                      Loading...
                    </div>
                  ) : error ? (
                    <div className="md:col-span-2 lg:col-span-3 text-lg text-center text-red-500">
                      {error}
                    </div>
                  ) : allmaxedData.length === 0 ? (
                    <div className="md:col-span-2 lg:col-span-3 text-lg text-center text-gray-500">
                      No data available for this category.
                    </div>
                  ) : (
                    allmaxedCards
                  )}
                </div>
                {totalAllmaxedCards > cardsPerPage &&
                  !loading &&
                  !error &&
                  allmaxedData.length > 0 && (
                    <div className="flex justify-center mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                handlePageChange(
                                  currentPage > 1 ? currentPage - 1 : 1
                                )
                              }
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: totalAllmaxedPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                className="cursor-pointer"
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                handlePageChange(
                                  currentPage < totalAllmaxedPages
                                    ? currentPage + 1
                                    : totalAllmaxedPages
                                )
                              }
                              className={
                                currentPage === totalAllmaxedPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
              </div>
            </div>

            {/* Skillstorm Tab Content */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "skillstorm"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-full absolute inset-0"
              }`}
            >
              <div className="w-full flex flex-col justify-center items-center pt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 auto-rows-fr">
                  {loading ? (
                    <div className="md:col-span-2 lg:col-span-3 text-lg w-full text-center text-allcharcoal">
                      Loading...
                    </div>
                  ) : error ? (
                    <div className="md:col-span-2 lg:col-span-3 text-lg text-center text-red-500">
                      {error}
                    </div>
                  ) : skillstormData.length === 0 ? (
                    <div className="md:col-span-2 lg:col-span-3 text-lg w-full text-center text-gray-500">
                      No applications to show.
                    </div>
                  ) : (
                    skillstormCards
                  )}
                </div>
                {totalSkillstormCards > cardsPerPage &&
                  !loading &&
                  !error &&
                  skillstormData.length > 0 && (
                    <div className="flex justify-center mt-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                handlePageChange(
                                  currentPage > 1 ? currentPage - 1 : 1
                                )
                              }
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: totalSkillstormPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                className="cursor-pointer"
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                handlePageChange(
                                  currentPage < totalSkillstormPages
                                    ? currentPage + 1
                                    : totalSkillstormPages
                                )
                              }
                              className={
                                currentPage === totalSkillstormPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
