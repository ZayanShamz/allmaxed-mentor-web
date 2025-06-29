"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/context/authStore";
import Link from "next/link";
import { SlashIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditProfile() {
  const mentorData = useAuthStore((state) => state.mentorData);
  const userData = useAuthStore((state) => state.userData);
  console.log(mentorData, userData);

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
            <Link
              href="/profile"
              className="text-h3 font-normal pe-1 text-gray-300 hover:text-gray-200 hover:underline underline-offset-4 transition"
            >
              Profile
            </Link>
            <SlashIcon className="w-5 h-5 text-gray-300 -rotate-20" />
            <div className="text-h3 font-normal text-allsnowflake cursor-default">
              Edit Profile
            </div>
          </div>
        </div>
      </div>
      <Navbar />
      <div className="min-h-dvh w-full flex flex-col justify-center items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-[90vw] lg:gap-10 justify-items-center my-5">
          <div className="bg-white overflow-hidden shadow rounded-lg border w-full sm:w-[80%] md:w-[70%] lg:w-full my-10">
            <div className="px-6 py-5">
              <div className="text-h3 leading-6 font-medium text-allcharcoal">
                Edit Personal Information
              </div>
            </div>
            <div className="border-t border-gray-200 px-5">
              <dl className="divide-y divide-gray-200">
                <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                  <dt className="text-body-small font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="text-gray-900 col-span-2">
                    <Input
                      type="text"
                      value={userData?.name}
                      placeholder="Enter Your Name"
                    />
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                  <dt className="text-body-small font-medium text-gray-500">
                    Age
                  </dt>
                  <dd className="text-gray-900 col-span-2">
                    <Input
                      type="text"
                      value={mentorData?.age}
                      placeholder="Your Age"
                      inputMode="numeric"
                    />
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                  <dt className="text-body-small font-medium text-gray-500">
                    Gender
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2 w-full">
                    <Select>
                      <SelectTrigger className="w-full border-dashed border-2 focus:border-gray-900 focus:shadow-lg focus-visible:ring-[0px]">
                        <SelectValue placeholder={mentorData?.gender} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Gender</SelectLabel>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                  <dt className="text-body-small font-medium text-gray-500">
                    phone
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    <Input
                      type="tel"
                      value={userData?.phone}
                      placeholder="Enter Phone Number"
                      inputMode="tel"
                    />
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                  <dt className="text-body-small font-medium text-gray-500">
                    email
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    <Input
                      type="email"
                      value={userData?.email}
                      placeholder="Enter Email Address"
                      inputMode="email"
                    />
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                  <dt className="text-body-small font-medium text-gray-500">
                    Address
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    <Input
                      type="text"
                      value={mentorData?.address}
                      placeholder="Enter Address"
                    />
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                  <dt className="text-body-small font-medium text-gray-500">
                    City
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    <Input
                      type="text"
                      value={mentorData?.city}
                      placeholder="Enter City"
                    />
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                  <dt className="text-body-small font-medium text-gray-500">
                    District
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    <Input
                      type="text"
                      value={mentorData?.district}
                      placeholder="Enter District"
                    />
                  </dd>
                </div>
                <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                  <dt className="text-body-small font-medium text-gray-500">
                    State
                  </dt>
                  <dd className="mt-0 text-body text-gray-900 col-span-2">
                    <Input
                      type="text"
                      value={mentorData?.state}
                      placeholder="Enter State"
                    />
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
                  <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                    <dt className="text-body-small font-medium text-gray-500">
                      Expertice
                    </dt>
                    <dd className="text-gray-900 col-span-2">
                      <Input
                        type="text"
                        value={mentorData?.field}
                        placeholder="Enter State"
                      />
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                    <dt className="text-body-small font-medium text-gray-500">
                      Experience
                    </dt>
                    <dd className="text-gray-900 col-span-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={mentorData?.experience}
                        placeholder="Enter Experience"
                      />
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                    <dt className="text-body-small font-medium text-gray-500">
                      Occupation
                    </dt>
                    <dd className="text-gray-900 col-span-2">
                      <Select>
                        <SelectTrigger className="w-full border-dashed border-2 focus:border-gray-900 focus:shadow-lg focus-visible:ring-[0px]">
                          <SelectValue
                            placeholder={mentorData?.current_occupation}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select Gender</SelectLabel>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="working">Working</SelectItem>
                            <SelectItem value="freelancer">
                              Freelancer
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                    <dt className="text-body-small font-medium text-gray-500">
                      Designation
                    </dt>
                    <dd className="text-gray-900 col-span-2">
                      <Input
                        type="text"
                        value={mentorData?.designation}
                        placeholder="Enter Designation"
                      />
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                    <dt className="text-body-small font-medium text-gray-500">
                      Duration
                    </dt>
                    <dd className="text-gray-900 col-span-2">
                      <Input
                        type="text"
                        value={mentorData?.duration}
                        placeholder="Enter Duration"
                      />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Links */}
            <div className="bg-white overflow-hidden shadow rounded-lg border w-full sm:w-[80%] md:w-[70%] lg:w-full lg:mt-auto my-10">
              <div className="px-6 py-5">
                <div className="text-h3 leading-6 font-medium text-gray-900">
                  Social Links
                </div>
              </div>
              <div className="border-t border-gray-200 px-5">
                <dl className="divide-y divide-gray-200">
                  <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                    <dt className="text-body-small font-medium text-gray-500">
                      Portfolio
                    </dt>
                    <dd className="text-gray-900 col-span-2">
                      <Input
                        type="text"
                        name="portfolio"
                        placeholder="Portfolio Link (optional)"
                      />
                    </dd>
                  </div>
                  <div className="py-5 grid grid-cols-3 items-center gap-4 px-3">
                    <dt className="text-body-small font-medium text-gray-500">
                      Social Media
                    </dt>
                    <dd className="text-gray-900 col-span-2">
                      <Input
                        type="text"
                        name="social"
                        placeholder="Social Media Link (optional)"
                      />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-[90vw] mb-10">
          <Button className="py-5 px-5 bg-allpurple text-allsnowflake text-lg">
            Submit Changes
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
