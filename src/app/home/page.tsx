"use client";

import { useState } from "react";
import CustomCard from "@/components/CustomCard";
import LocationSelect from "@/components/LocationSelect";
import Navbar from "@/components/Navbar";
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

// import { useAuthStore } from "@/context/authStore";

export default function HomePage() {
  // const { userToken } = useAuthStore();
  // console.log("User Token:", userToken);

  const cardData = [
    {
      title: "Design Thinking Workshop",
      appliedCount: 15,
      location: "St. Bones Engineering College, Trivandrum",
      date: "09 NOV",
      skillTag: "UI/UX Designing",
      levelTag: "Expert",
    },
    {
      title: "Python Bootcamp",
      appliedCount: 8,
      location: "London Tech Hub",
      date: "12 DEC",
      skillTag: "Programming",
      levelTag: "Intermediate",
    },
    {
      title: "Graphic Design Masterclass",
      appliedCount: 20,
      location: "New York Institute",
      date: "15 NOV",
      skillTag: "Graphic Design",
      levelTag: "Advanced",
    },
    {
      title: "Web Development Basics",
      appliedCount: 5,
      location: "London Tech Hub",
      date: "20 NOV",
      skillTag: "Web Development",
      levelTag: "Beginner",
    },
    {
      title: "Data Science Crash Course beginner",
      appliedCount: 12,
      location: "San Francisco Campus",
      date: "25 NOV",
      skillTag: "Data Science",
      levelTag: "Intermediate",
    },
    {
      title: "Mobile App Development",
      appliedCount: 18,
      location: "Sydney University",
      date: "30 NOV",
      skillTag: "Mobile Development",
      levelTag: "Advanced",
    },
    {
      title: "AI Fundamentals",
      appliedCount: 7,
      location: "Toronto Tech Center",
      date: "05 DEC",
      skillTag: "Artificial Intelligence",
      levelTag: "Beginner",
    },
    {
      title: "Cloud Computing 101",
      appliedCount: 10,
      location: "New Jersey",
      date: "10 DEC",
      skillTag: "Cloud Computing",
      levelTag: "Intermediate",
    },
    {
      title: "Cybersecurity Workshop",
      appliedCount: 14,
      location: "St. Bones Engineering College, Trivandrum",
      date: "15 DEC",
      skillTag: "Cybersecurity",
      levelTag: "Expert",
    },
    {
      title: "Machine Learning Intermidiate",
      appliedCount: 6,
      location: "New York Institute",
      date: "20 DEC",
      skillTag: "Machine Learning",
      levelTag: "Beginner",
    },
    {
      title: "DevOps Training",
      appliedCount: 9,
      location: "San Francisco Campus",
      date: "25 DEC",
      skillTag: "DevOps",
      levelTag: "Intermediate",
    },
    {
      title: "React Development",
      appliedCount: 11,
      location: "London Tech Hub",
      date: "30 DEC",
      skillTag: "React",
      levelTag: "Advanced",
    },
    {
      title: "Blockchain Basics",
      appliedCount: 13,
      location: "Sydney University",
      date: "05 JAN",
      skillTag: "Blockchain",
      levelTag: "Beginner",
    },
    {
      title: "Full Stack Development",
      appliedCount: 16,
      location: "Toronto Tech Center",
      date: "10 JAN",
      skillTag: "Full Stack",
      levelTag: "Expert",
    },
    {
      title: "Digital Marketing",
      appliedCount: 7,
      location: "Online",
      date: "15 JAN",
      skillTag: "Marketing",
      levelTag: "Intermediate",
    },
    {
      title: "Game Development",
      appliedCount: 10,
      location: "St. Bones Engineering College, Trivandrum",
      date: "20 JAN",
      skillTag: "Game Design",
      levelTag: "Advanced",
    },
    {
      title: "Machine Learning Basics",
      appliedCount: 6,
      location: "New York Institute",
      date: "20 DEC",
      skillTag: "Machine Learning",
      levelTag: "Beginner",
    },
    {
      title: "DevOps Training",
      appliedCount: 9,
      location: "San Francisco Campus",
      date: "25 DEC",
      skillTag: "DevOps",
      levelTag: "Intermediate",
    },
    {
      title: "React Development",
      appliedCount: 11,
      location: "London Tech Hub",
      date: "30 DEC",
      skillTag: "React",
      levelTag: "Advanced",
    },
    {
      title: "Blockchain Basics",
      appliedCount: 13,
      location: "Sydney University",
      date: "05 JAN",
      skillTag: "Blockchain",
      levelTag: "Beginner",
    },
    {
      title: "Full Stack Development",
      appliedCount: 16,
      location: "Toronto Tech Center",
      date: "10 JAN",
      skillTag: "Full Stack",
      levelTag: "Expert",
    },
    {
      title: "Digital Marketing",
      appliedCount: 7,
      location: "Online",
      date: "15 JAN",
      skillTag: "Marketing",
      levelTag: "Intermediate",
    },
    {
      title: "Game Development",
      appliedCount: 10,
      location: "St. Bones Engineering College, Trivandrum",
      date: "20 JAN",
      skillTag: "Game Design",
      levelTag: "Advanced",
    },
  ];

  // Pagination >>
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;
  const totalCards = cardData.length;

  const totalPages = Math.ceil(totalCards / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const displayedCards = cardData
    .slice(startIndex, endIndex)
    .map((card, index) => (
      <CustomCard
        key={startIndex + index}
        title={card.title}
        appliedCount={card.appliedCount || 0}
        location={card.location}
        date={new Date(card.date).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        })}
        skillTag={card.skillTag}
        levelTag={
          card.levelTag.charAt(0).toUpperCase() + card.levelTag.slice(1)
        }
      />
    ));

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
          backgroundPosition: "center",
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

      <section className="w-full min-h-screen bg-allsnowflake flex flex-col items-center justify-center py-20">
        <div className="w-[90vw] md:w-[80vw] lg:w-[70vw] bg-white border rounded-md p-5">
          {/* Desktop Layout - Joined Selects (sm and larger) */}
          <div className="hidden sm:flex gap-4 items-center">
            {/* Joined Select Container */}
            <div className="flex flex-1 bg-[#EBE8FF] rounded-sm overflow-hidden min-w-0 py-2 items-center">
              <div className="flex-1 min-w-0 border-r-2 border-gray-300">
                <Select>
                  <SelectTrigger className="w-full px-5 py-3 bg-transparent border-none rounded-none text-allcharcoal text-md shadow-none hover:bg-purple-150 focus:ring-0 focus:border-none">
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
                <Select>
                  <SelectTrigger className="w-full px-5 py-3 bg-transparent border-none rounded-none text-allcharcoal text-md shadow-none hover:bg-purple-150 focus:ring-0 focus:border-none">
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
              <Button className="py-6 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-sm transition-colors duration-200 shadow-none border-0">
                Search
              </Button>
            </div>
          </div>

          {/* Mobile Layout - Stacked Selects (smaller than sm) */}
          <div className="flex sm:hidden flex-col gap-3">
            <div className="flex flex-1 bg-[#EBE8FF] rounded-sm overflow-hidden min-w-0 py-2">
              {/* Category Select */}
              <div className="flex-1 min-w-0 border-r-2 border-gray-300">
                <Select>
                  <SelectTrigger className="w-full px-5 py-4 bg-transparent border-none rounded-none text-gray-800 font-medium shadow-none hover:bg-purple-150 focus:ring-0 focus:border-none">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allmaxed">Allmax&apos;d</SelectItem>
                    <SelectItem value="skillstorm">Skillstorm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Select */}
              <div className="flex-1 min-w-0 border-r-2 border-gray-300">
                <LocationSelect />
              </div>

              {/* Course Select */}
              <div className="flex-1 min-w-0">
                <Select>
                  <SelectTrigger className="w-full px-5 py-4 bg-transparent border-none rounded-none text-gray-800 font-medium shadow-none hover:bg-purple-150 focus:ring-0 focus:border-none">
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
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-sm transition-colors duration-200 shadow-none border-0">
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[90vw] md:w-[90vw] lg:w-[90vw] flex flex-col justify-center items-center pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedCards}
          </div>
          {totalCards > cardsPerPage && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
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

      <footer className="w-full bg-[#151515] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl text-gray-400 md:text-4xl font-semibold mb-2">
              Enhance your <span className="text-white font-bold">Growth</span>,
              <br />
              Inspire the <span className="text-white font-bold">Change</span>
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-4">
            <div className="flex gap-3">
              <button className="border border-white text-white px-5 py-2 rounded hover:bg-white hover:text-black transition">
                Explore
              </button>
              <button className="bg-[#6942FE] text-white px-5 py-2 rounded hover:bg-[#5a38e3] transition">
                Contact
              </button>
            </div>
            <div className="flex gap-4 mt-2">
              <a
                href="#"
                className="bg-white rounded-full p-2 text-black flex items-center justify-center w-10 h-10"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="bg-white rounded-full p-2 text-black flex items-center justify-center w-10 h-10"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="font-bold text-xl">allmax’d</span>
          </div>
        </div>
      </footer>
    </>
  );
}
