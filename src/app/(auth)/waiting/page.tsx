"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/authStore";
import Image from "next/image";

export default function Waiting() {
  const router = useRouter();

  const reset = useAuthStore((state) => state.reset);

  const handleClick = () => {
    // Redirect to login page
    reset();
    router.push("/login");
  };

  return (
    <>
      <div className="flex justify-center h-dvh py-3">
        <div className="responsive-one grid grid-rows-5 items-center justify-center">
          {/* row 1 */}
          <div className="flex flex-col justify-center items-center h-full p-1.5">
            <h1 className="text-center text-allcharcoal text-[clamp(28px,5vw,38px)] leading-8 font-bold">
              Mentor Training Programme
            </h1>

            <div className="w-[90%] md:w-[70%] lg:mt-10 mt-5 flex justify-center items-center">
              <p className="title-subtext text-allpurple leading-tight">
                All Professionals are expected to complete their initial
                training and gain a badge from company in order to start their
                career with Allmax’d
              </p>
            </div>
          </div>
          {/* row 2 */}
          <div className="row-start-2 row-span-2 flex justify-center items-center h-full w-full relative">
            <Image
              src="/images/waiting.png"
              alt="Waiting"
              className="w-full h-full object-contain"
              width={500}
              height={500}
              priority
            />
          </div>
          {/* row 3 */}

          <div className="row-start-4 row-span-2 flex justify-center items-center h-full pt-5">
            <div className="w-full md:w-[70%] flex flex-col justify-between h-full">
              <div>
                {/* sub row 1 */}
                <div className="grid grid-cols-6 items-center py-5">
                  <div className="text-center text-2xl text-allpurple font-bold">
                    1
                  </div>
                  <div className="col-start-2 col-span-5 text-[clamp(12px,3vw,18px)] text-center text-allpurple leading-tight shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl py-2 px-5">
                    Watch all the training Videos and attend a general aptitude
                    test
                  </div>
                </div>

                {/* sub row 2 */}
                <div className="grid grid-cols-6 items-center pb-5">
                  <div className="col-span-5 text-center text-[clamp(12px,3vw,18px)] text-allpurple leading-tight shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl py-2 px-5">
                    Afterwards, You will have to attend a test in your
                    specialisation for further assessment.
                  </div>
                  <div className="text-center text-2xl text-allpurple font-bold">
                    2
                  </div>
                </div>

                {/* sub row 3 */}
                <div className="grid grid-cols-6 items-center pb-5">
                  <div className="text-center text-2xl text-allpurple font-bold">
                    3
                  </div>
                  <div className="col-start-2 col-span-5 text-[clamp(10px,3vw,18px)] text-center text-allpurple leading-tight shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl py-2 px-5">
                    Once you pass all the assessment test you will have an
                    interview at given location for personal assessment. Later
                    will be provided by an ID, only after you can start work.
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-end w-full pb-5">
                <button
                  className="text-allpurple underline cursor-pointer"
                  onClick={handleClick}
                >
                  Login to different account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
