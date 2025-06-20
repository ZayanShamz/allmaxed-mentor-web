"use client";

import Navbar from "@/components/Navbar";

export default function HomePage() {
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

        <div className="content">
          <div className="container flex justify-center items-center py-10">
            hello content here
          </div>
        </div>

        <footer className="w-full bg-[#151515] text-white px-6 py-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-3xl text-gray-400 md:text-4xl font-semibold mb-2">
                Enhance your{" "}
                <span className="text-white font-bold">Growth</span>,<br />
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
      </div>
    </>
  );
}
