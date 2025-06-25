import React from "react";
import Image from "next/image";
import { Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-allcharcoal text-white px-10 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">
        <div className="cursor-default">
          <h2 className="text-3xl text-gray-400 md:text-4xl font-semibold mb-2">
            Enhance your <span className="text-white font-bold">Growth</span>,
            <br />
            Inspire the <span className="text-white font-bold">Change</span>
          </h2>
        </div>

        <div className="flex flex-col md:items-end gap-4">
          <div className="flex gap-3">
            <button className="border border-white text-white px-6 py-3 rounded cursor-pointer hover:bg-white hover:text-black transition">
              Explore
            </button>
            <button className="bg-allpurple text-white px-6 py-3 rounded cursor-pointer hover:bg-[#5a38e3] transition">
              Contact
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 border-t border-gray-700 pt-4 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <Image
            src="/images/allmaxd_logo_text_white.png"
            alt="Footer Logo"
            width={150}
            height={20}
            className="object-contain flex-shrink-0"
            priority
          />
        </div>
        <div className="flex gap-4 mt-2">
          <a
            href="#"
            className="bg-white rounded-full p-2 text-black flex items-center justify-center w-10 h-10"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="bg-white rounded-full p-2 text-black flex items-center justify-center w-10 h-10"
            aria-label="LinkedIn"
          >
            <Linkedin className="fw-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
