"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/context/authStore";
import { useSessionStore } from "@/context/useSessionStore";
import { useRouter, useSearchParams } from "next/navigation";

import AllmaxedCard from "@/components/AllmaxedCard";
import SkillstormCard from "@/components/SkillstormCard";
import LocationSelect from "@/components/LocationSelect";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// ui
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
interface AllmaxedCardData {
  id: string;
  title: string;
  appliedCount: string;
  location: string;
  date: string;
  module: string;
  level_required: string;
}

interface SkillstormCardData {
  id: string;
  topic: string;
  appliedCount: string;
  location: string;
  date: string;
  level_required: string;
  duration: string;
  pay: string;
}

export default function HomePage() {
  const { userToken } = useAuthStore();
  const {
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    cardId,
    setCardId,
    isInitialized,
    setInitialized,
  } = useSessionStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardGridRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const [cardsPerPage, setCardsPerPage] = useState(9);

  // --------------- Page navigation and state management ---------------
  // Reset state on page refresh
  useEffect(() => {
    if (isInitialMount.current && !isInitialized) {
      setSelectedCategory("allmaxed");
      setCurrentPage(1);
      setCardId(null);
      setInitialized(true);
      isInitialMount.current = false;
    }
  }, [
    setSelectedCategory,
    setCurrentPage,
    setCardId,
    isInitialized,
    setInitialized,
  ]);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("category", selectedCategory);
    params.set("page", currentPage.toString());
    router.push(`/home?${params.toString()}`, { scroll: false });
  }, [selectedCategory, currentPage, cardId, router, searchParams]);

  // --------------- Query for data fetching ---------------
  const {
    data: cardData = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["programs", selectedCategory, userToken],
    queryFn: async (): Promise<AllmaxedCardData[] | SkillstormCardData[]> => {
      if (!userToken) {
        throw new Error("No user token available");
      }

      const endpoint =
        selectedCategory === "allmaxed"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/long_term_programs`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/short_term_programs`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      console.log("API Response:", response.data);
      return response.data;
    },
    enabled: !!userToken,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Scroll to last clicked card after data loads
  useEffect(() => {
    if (cardId && cardData.length > 0 && !isLoading) {
      setTimeout(() => {
        const cardElement = document.getElementById(`card-${cardId}`);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
          cardElement.style.boxShadow = "0 0 20px rgba(147, 51, 234, 0.3)";
          setTimeout(() => {
            cardElement.style.boxShadow = "";
          }, 2000);
        }
      }, 100);
    }
  }, [cardId, cardData, isLoading]);

  // Change cardsPerPage based on screen size
  useEffect(() => {
    const handleResize = () => {
      setCardsPerPage(window.innerWidth < 1024 ? 8 : 9);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalCards = cardData.length;
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const displayedCards = cardData.slice(startIndex, endIndex).map((card) => {
    if (selectedCategory === "allmaxed") {
      const allmaxedCard = card as AllmaxedCardData;
      return (
        <div
          key={allmaxedCard.id}
          id={`card-${allmaxedCard.id}`}
          className="h-full w-full rounded-xl"
        >
          <AllmaxedCard
            programId={allmaxedCard.id}
            title={allmaxedCard.title}
            appliedCount={allmaxedCard.id || "0"}
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
        </div>
      );
    } else {
      const skillstormCard = card as SkillstormCardData;
      return (
        <div
          key={skillstormCard.id}
          id={`card-${skillstormCard.id}`}
          className="h-full w-full rounded-xl"
        >
          <SkillstormCard
            workshopId={skillstormCard.id}
            topic={skillstormCard.topic}
            appliedCount={skillstormCard.id || "0"}
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
        </div>
      );
    }
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      console.log("Changing to page:", page);
      setCurrentPage(page);
      setCardId(null);
    }
  };

  const handleCategoryChange = (value: string) => {
    console.log("Category changed to:", value);
    setSelectedCategory(value);
    setCurrentPage(1);
    setCardId(null);
  };

  const getErrorMessage = () => {
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred";
  };

  return (
    <>
      <div
        className="min-h-screen w-full relative"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(150, 150, 150, 0.2), rgba(0, 0, 0)),
            url('/images/bg.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />
        <div className="responsive-one flex flex-col items-center justify-center mx-auto h-svh lg:h-dvh text-center">
          <h1 className="text-6xl md:text-7xl text-white font-bold leading-tight">
            Let’s Share Your Skills!
          </h1>
          <div className="flex justify-center items-center py-4">
            <p className="title-subtext text-white text-center max-w-2xl leading-tight">
              Find opportunities that suit you the best and apply for them.
              Share your knowledge with the youth and let them to succeed...
            </p>
          </div>
        </div>
      </div>

      <section className="w-full min-h-screen bg-allsnowflake flex flex-col items-center justify-start py-20">
        {/* Sorting and Filtering */}
        <div className="w-[90vw] sm:w-[70vw] md:w-[80vw] lg:w-[70vw] bg-white border rounded-md p-5">
          <div className="hidden md:flex gap-4 items-center">
            <div className="flex flex-1 bg-[#EBE8FF] rounded-sm overflow-hidden min-w-0 py-2 items-center">
              <div className="flex-1 min-w-0 border-r-2 border-gray-300">
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full px-5 py-3 bg-transparent border-none rounded-none text-allcharcoal text-md shadow-none hover:bg-purple-150 focus:ring-0 focus:border-none cursor-pointer">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allmaxed">Allmax&apos;d</SelectItem>
                    <SelectItem value="skillstorm">Skillstorm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-0 border-r-2 border-gray-300">
                <LocationSelect />
              </div>
              <div className="flex-1 min-w-0">
                <Select disabled>
                  <SelectTrigger className="w-full px-5 py-3 bg-transparent border-none rounded-none text-allcharcoal text-md shadow-none hover:bg-purple-150 focus:ring-0 focus:border-none cursor-pointer">
                    <SelectValue placeholder="Select Course Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner Level</SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate Level
                    </SelectItem>
                    <SelectItem value="advanced">Advanced Level</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="bootcamp">Bootcamp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button className="py-6 px-8 bg-allpurple hover:bg-indigo-700 text-white rounded-sm transition-colors duration-200 shadow-none border-0 cursor-pointer">
                Search
              </Button>
            </div>
          </div>
          {/* Mobile View ==== */}
          <div className="flex md:hidden flex-col gap-3">
            <div className="flex flex-col bg-[#EBE8FF] rounded-sm overflow-hidden py-2 px-3">
              <div className="flex-1 border-b-2 border-gray-300 py-1">
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full px-5 py-4 bg-transparent border-none rounded-none text-gray-800 font-medium shadow-none hover:bg-purple-150 focus:ring-0 focus:border-none cursor-pointer">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allmaxed">Allmax&apos;d</SelectItem>
                    <SelectItem value="skillstorm">Skillstorm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-0 border-b-2 border-gray-300 py-1">
                <LocationSelect />
              </div>
              <div className="flex-1 py-1">
                <Select disabled>
                  <SelectTrigger className="w-full px-5 py-4 bg-transparent border-none rounded-none text-gray-800 font-medium shadow-none hover:bg-purple-150 focus:ring-0 focus:border-none cursor-pointer">
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner Level</SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate Level
                    </SelectItem>
                    <SelectItem value="advanced">Advanced Level</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="bootcamp">Bootcamp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-full mt-2">
              <Button className="w-full bg-allpurple hover:bg-indigo-700 text-white rounded-sm transition-colors duration-200 shadow-none border-0 cursor-pointer">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Card Grid */}
        <div className="w-[80vw] sm:w-[70vw] md:w-[80vw] lg:w-[80vw] flex flex-col justify-center items-center pt-10">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center w-full gap-4"
            ref={cardGridRef}
          >
            {isLoading ? (
              <div className="text-center text-allcharcoal w-full">
                Loading...
              </div>
            ) : isError ? (
              <div className="text-center text-red-500">
                {getErrorMessage()}
              </div>
            ) : cardData.length === 0 ? (
              <div className="text-center text-gray-500">
                No data available for this category.
              </div>
            ) : (
              displayedCards
            )}
          </div>
          {totalCards > cardsPerPage &&
            !isLoading &&
            !isError &&
            cardData.length > 0 && (
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            className={`cursor-pointer ${
                              currentPage === page
                                ? "bg-allpurple text-white rounded-md"
                                : "text-allpurple"
                            }`}
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages
                          )
                        }
                        className={
                          currentPage === totalPages
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
      </section>

      <Footer />
    </>
  );
}
