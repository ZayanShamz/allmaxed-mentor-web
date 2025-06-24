"use client";

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

// import { useAuthStore } from "@/context/authStore";

export default function HomePage() {
  // const { userToken } = useAuthStore();
  // console.log("User Token:", userToken);

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

        <div className="w-[90vw] md:w-[90vw] lg:w-[90vw] flex justify-center items-center pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
          </div>
        </div>

        <div className="w-[90vw] md:w-[80vw] lg:w-[70vw] flex justify-center items-center py-10">
          <LocationSelect />
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
