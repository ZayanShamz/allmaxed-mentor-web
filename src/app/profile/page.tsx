"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/context/authStore";
import Link from "next/link";
import { SlashIcon, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const mentorData = useAuthStore((state) => state.mentorData);
  const userData = useAuthStore((state) => state.userData);
  const router = useRouter();

  return (
    <>
      <div
        className="h-[25vh] md:h-[30vh]  w-full"
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
              Profile
            </div>
          </div>
        </div>
      </div>
      <Navbar />
      <div className="min-h-dvh w-full flex flex-col justify-center items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-[90vw] lg:gap-10 justify-items-center my-5">
          <div className="bg-white overflow-hidden shadow rounded-lg border w-full sm:w-[80%] md:w-[70%] lg:w-full my-10">
            <div className="px-6 py-5">
              <div className="text-h3 leading-6 font-medium text-gray-900">
                Personal Information
              </div>
            </div>
            <div className="border-t border-gray-200 px-5">
              <dl className="divide-y divide-gray-200">
                <div className="py-5 grid grid-cols-3 gap-4 px-3">
                  <dt className="text-body font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    {userData?.name}
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 gap-4 px-3">
                  <dt className="text-body font-medium text-gray-500">Age</dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    {mentorData?.age}
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 gap-4 px-3">
                  <dt className="text-body font-medium text-gray-500">
                    Gender
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    {mentorData?.gender}
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 gap-4 px-3">
                  <dt className="text-body font-medium text-gray-500">phone</dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    {userData?.phone}
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 gap-4 px-3">
                  <dt className="text-body font-medium text-gray-500">email</dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    {userData?.email}
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 gap-4 px-3">
                  <dt className="text-body font-medium text-gray-500">
                    Address
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    {mentorData?.address}
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 gap-4 px-3">
                  <dt className="text-body font-medium text-gray-500">City</dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    {mentorData?.city}
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 gap-4 px-3">
                  <dt className="text-body font-medium text-gray-500">
                    District
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    {mentorData?.district}
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 gap-4 px-3">
                  <dt className="text-body font-medium text-gray-500">State</dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    {mentorData?.state}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="flex flex-col items-center h-full w-full">
            <div className="bg-white overflow-hidden shadow rounded-lg border w-full sm:w-[80%] md:w-[70%] lg:w-full my-10">
              <div className="px-6 py-5">
                <div className="text-h3 leading-6 font-medium text-gray-900">
                  Professional Information
                </div>
              </div>
              <div className="border-t border-gray-200 px-5">
                <dl className="divide-y divide-gray-200">
                  <div className="py-5 grid grid-cols-3 gap-4 px-3">
                    <dt className="text-body font-medium text-gray-500">
                      Expertice
                    </dt>
                    <dd className="mt-0 text-body text-gray-900 col-span-2">
                      {mentorData?.field}
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 gap-4 px-3">
                    <dt className="text-body font-medium text-gray-500">
                      Experience
                    </dt>
                    <dd className="mt-0 text-body text-gray-900 col-span-2">
                      {mentorData?.experience}
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 gap-4 px-3">
                    <dt className="text-body font-medium text-gray-500">
                      Occupation
                    </dt>
                    <dd className="mt-0 text-body text-gray-900 col-span-2">
                      {mentorData?.current_occupation}
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 gap-4 px-3">
                    <dt className="text-body font-medium text-gray-500">
                      Designation
                    </dt>
                    <dd className="mt-0 text-body text-gray-900 col-span-2">
                      {mentorData?.designation}
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 gap-4 px-3">
                    <dt className="text-body font-medium text-gray-500">
                      Duration
                    </dt>
                    <dd className="mt-0 text-body text-gray-900 col-span-2">
                      {mentorData?.duration}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border w-full sm:w-[80%] md:w-[70%] lg:w-full lg:mt-auto my-10">
              <div className="px-6 py-5">
                <div className="text-h3 leading-6 font-medium text-gray-900">
                  Social Links
                </div>
              </div>
              <div className="border-t border-gray-200 px-5">
                <dl className="divide-y divide-gray-200">
                  <div className="py-5 grid grid-cols-3 gap-4 px-3">
                    <dt className="text-body font-medium text-gray-500">
                      Portfolio
                    </dt>
                    <dd className="mt-0 text-body text-gray-900 col-span-2">
                      <Link
                        href={`${
                          mentorData?.portfolio_link
                            ? mentorData.portfolio_link
                            : "/profile/edit"
                        }`}
                        target={`${
                          mentorData?.portfolio_link ? "_blank" : "_self"
                        }`}
                        className="text-allpurple underline underline-offset-2 cursor-pointer"
                      >
                        {mentorData?.portfolio_link
                          ? mentorData.portfolio_link
                          : "Add your Portfolio Link"}
                      </Link>
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 gap-4 px-3">
                    <dt className="text-body font-medium text-gray-500">
                      Social Media
                    </dt>
                    <dd className="mt-0 text-body text-gray-900 col-span-2">
                      <Link
                        href={`${
                          mentorData?.social_media_link
                            ? mentorData.social_media_link
                            : "/profile/edit"
                        }`}
                        target={`${
                          mentorData?.social_media_link ? "_blank" : "_self"
                        }`}
                        className="text-allpurple underline underline-offset-2 cursor-pointer"
                      >
                        {mentorData?.social_media_link
                          ? mentorData?.social_media_link
                          : "Add Social Media Link"}
                      </Link>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-[90vw] mb-10">
          <div className="w-full sm:w-[80%] md:w-[70%] lg:w-full flex justify-center md:justify-end">
            <Button
              onClick={() => router.push("/profile/edit")}
              className="py-5 border-2 border-allcharcoal text-allcharcoal bg-transparent hover:bg-allcharcoal hover:text-allsnowflake cursor-pointer"
            >
              <span className="flex justify-center items-center gap-3 px-3 text-lg">
                Edit Profile <MoveRight />
              </span>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
