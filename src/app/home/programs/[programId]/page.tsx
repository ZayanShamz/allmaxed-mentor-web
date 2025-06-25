import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { SlashIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function ProgramDetailsPage() {
  return (
    <>
      <div
        className="h-[40vh] w-full"
        style={{
          backgroundImage: `
                linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0)),
                url('/images/college_bg.png')
              `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />
        <div className="max-w-screen-2xl flex items-center justify-start mx-auto h-full px-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/home"
                    className="title-text-1 text-gray-400 hover:text-gray-200 hover:underline underline-offset-4 transition"
                  >
                    Allmax&apos;d
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/home"
                    className="title-text-1 text-gray-400 hover:text-gray-200 hover:underline underline-offset-4"
                  >
                    Programs
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="title-text-1 text-allsnowflake cursor-default">
                  Now Showing
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <section className="w-full min-h-screen bg-allsnowflake flex flex-col items-center justify-start py-20 ">
        <div className="w-[95vw] md:w-[90vw] flex flex-col flex-wrap md:flex-row justify-between items-center mb-5">
          <div className="w-full md:w-[55%] bg-allpurple h-[250px] flex items-center justify-center mb-5">
            <span className="text-white text-3xl"> 1 </span>
          </div>

          <div className="w-full md:w-[40%] bg-gray-500 h-[250px] flex items-center justify-center mb-5">
            <span className="text-white text-3xl"> 2 </span>
          </div>
        </div>
        <div className="w-[95vw] md:w-[90vw] flex flex-col justify-center items-center md:items-start">
          <div className="w-full md:w-[40vw] bg-allcharcoal h-[250px] flex items-center justify-center mb-5">
            <span className="text-white text-3xl"> 3 </span>
          </div>
          <div className="flex justify-center items-center md:justify-start">
            <Button
              variant={"outline"}
              className="px-10 py-5 rounded-sm border-2 border-allpurple text-allpurple text-lg bg-transparent cursor-pointer"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
