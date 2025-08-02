import React from "react";
import Link from "next/link";
import { SlashIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PartneredColleges() {
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
        <Navbar />
        <div className="w-full md:w-[75vw] flex items-center justify-start mx-auto h-full px-5 md:px-0">
          <div className="h-fit w-full flex items-center">
            <Link
              href="/home"
              className="text-h3 font-normal pe-1 text-gray-300 hover:text-gray-200 hover:underline underline-offset-4 transition"
            >
              Allmax&apos;d
            </Link>
            <SlashIcon className="w-5 h-5 text-gray-300 -rotate-20" />
            <div className="text-h3 font-normal text-allsnowflake cursor-default">
              Partenered Colleges
            </div>
          </div>
        </div>
      </div>
      <section className="min-h-dvh w-full flex justify-center py-10">
        <div className="w-[90vw] md:w-[75vw] flex flex-col">
          <div className="text-h2 font-semibold py-10">Partenered Colleges</div>
          <div className="w-full bg-white rounded-md min-h-[200px]">
            <div className="container h-full p-10">
              {/* Colleges */}
              <div className="w-full py-3 text-body-large border-b border-gray-300">
                Sullamussalam Science College, Areekode
              </div>
              <div className="w-full py-3 text-body-large border-b border-gray-300">
                Malabar College of Commerce and Science (MCCS), Edappal
              </div>
              <div className="w-full py-3 text-body-large border-b border-gray-300">
                Pocker Sahib Memorial Orphanage College (PSMO - Autonomous),
                Tirurangadi
              </div>
              <div className="w-full py-3 text-body-large border-b border-gray-300">
                MES Arts & Science College, Chathamangalam
              </div>
              <div className="w-full py-3 text-body-large border-b border-gray-300">
                SAFI Institute of Advanced Study (Autonomous), Vazhayoor.
              </div>
              <div className="w-full py-3 text-body-large border-b border-gray-300">
                EMEA College of Arts and Science, Kondottty
              </div>
              <div className="w-full py-3 text-body-large border-b border-gray-300">
                Sahya Arts and Science College, Wandoor
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
