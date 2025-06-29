"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/context/authStore";

import AllmaxedCard from "@/components/AllmaxedCard";
import SkillstormCard from "@/components/SkillstormCard";
import LocationSelect from "@/components/LocationSelect";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  appliedCount: number;
  location: string;
  date: string;
  module: string;
  level_required: string;
}

interface SkillstormCardData {
  id: string;
  topic: string;
  appliedCount: number;
  location: string;
  date: string;
  level_required: string;
  duration: string;
  pay: string;
}

export default function HomePage() {
  const { userToken } = useAuthStore();
  // console.log("User Token:", userToken);

  const [currentPage, setCurrentPage] = useState(1);
  const [cardData, setCardData] = useState<
    AllmaxedCardData[] | SkillstormCardData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardsPerPage, setCardsPerPage] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState("allmaxed");

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userToken) {
        console.warn("No user token available, skipping API call");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const endpoint =
          selectedCategory === "allmaxed"
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/long_term_programs`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/short_term_programs`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        console.log("API Response:", response.data);

        setCardData(response.data);
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
    fetchData();
  }, [userToken, selectedCategory]);

  // Change cardsPerPage 9 - 8 based on screen size
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

  const displayedCards = cardData
    .slice(startIndex, endIndex)
    .map((card, index) => {
      if (selectedCategory === "allmaxed") {
        const allmaxedCard = card as AllmaxedCardData;
        // console.log("allmaxedCard :", allmaxedCard.id);
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
      } else {
        const skillstormCard = card as SkillstormCardData;
        return (
          <SkillstormCard
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
      }
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <div className="responsive-one flex flex-col items-center justify-center mx-auto h-dvh text-center">
          <h1 className="text-6xl md:text-7xl text-white font-bold leading-tight">
            Let’s Share Your Skills!
          </h1>
          <div className="flex justify-center items-center py-4">
            <p className="title-subtext text-white text-center  max-w-2xl leading-tight">
              Find opportunities that suit you the best and apply for them.
              Share your knowledge with the youth and let them to succeed...
            </p>
          </div>
        </div>
      </div>

      <section className="w-full min-h-screen bg-allsnowflake flex flex-col items-center justify-start py-20">
        <div className="w-[90vw] sm:w-[70vw] md:w-[80vw] lg:w-[70vw] bg-white border rounded-md p-5">
          {/* Desktop Layout - Joined Selects (sm and larger) */}
          <div className="hidden md:flex gap-4 items-center">
            {/* Joined Select Container */}
            <div className="flex flex-1 bg-[#EBE8FF] rounded-sm overflow-hidden min-w-0 py-2 items-center">
              <div className="flex-1 min-w-0 border-r-2 border-gray-300">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
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
                    <SelectValue placeholder="Select Course" />
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

          {/* Mobile Layout - Stacked Selects (smaller than sm) */}
          <div className="flex md:hidden flex-col gap-3">
            <div className="flex flex-col bg-[#EBE8FF] rounded-sm overflow-hidden py-2 px-3">
              {/* Category Select */}
              <div className="flex-1 border-b-2 border-gray-300 py-1">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
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

              {/* Location Select */}
              <div className="flex-1 min-w-0 border-b-2 border-gray-300 py-1">
                <LocationSelect />
              </div>

              {/* Course Select */}
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

        {/* Card Section */}
        <div className="w-[80vw] sm:w-[70vw] md:w-[80vw] lg:w-[80vw] flex flex-col justify-center items-center pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center w-full gap-4">
            {loading ? (
              <div className="text-center text-allcharcoal">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : cardData.length === 0 ? (
              <div className="text-center text-gray-500">
                No data available for this category.
              </div>
            ) : (
              displayedCards
            )}
          </div>
          {totalCards > cardsPerPage &&
            !loading &&
            !error &&
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
                            className="cursor-pointer"
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
