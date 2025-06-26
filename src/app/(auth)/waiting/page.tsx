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
      <div className="flex flex-col justify-center items-center w-full h-dvh p-5">
        <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] flex flex-col flex-1 justify-start items-center">
          <div className="text-h1 text-center px-10">
            Mentor Training Programme
          </div>
          <div className="w-full sm:w-[90%] md:w-[70%] flex flex-col justify-center items-center">
            <div className="w-full py-5">
              <p className="text-body text-allpurple leading-tight text-center">
                All Professionals are expected to complete their initial
                training and gain a badge from company in order to start their
                career with Allmax’d
              </p>
            </div>

            <div className="flex justify-center w-full mb-5">
              <Image
                src="/images/waiting.png"
                alt="Waiting"
                className="object-contain h-auto w-50 md:w-58 lg:w-64 xl:w-74"
                width={256}
                height={256}
                priority
              />
            </div>
            <div>
              {/* sub row 1 */}
              <div className="grid grid-cols-6 items-center py-5">
                <div className="text-center text-2xl text-allpurple font-bold">
                  1
                </div>
                <div className="col-start-2 col-span-5 text-body-small text-center text-allpurple leading-tight shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl py-3 px-5">
                  Watch all the training Videos and attend a general aptitude
                  test
                </div>
              </div>

              {/* sub row 2 */}
              <div className="grid grid-cols-6 items-center pb-5">
                <div className="col-span-5 text-center text-body-small text-allpurple leading-tight shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl py-3 px-5">
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
                <div className="col-start-2 col-span-5 text-body-small text-center text-allpurple leading-tight shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl py-3 px-5">
                  Once you pass all the assessment test you will have an
                  interview at given location for personal assessment. Later
                  will be provided by an ID, only after you can start work.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-5">
          <button
            className="text-body text-allcharcoal underline cursor-pointer"
            onClick={handleClick}
          >
            Login to different account
          </button>
        </div>
      </div>
    </>
  );
}
