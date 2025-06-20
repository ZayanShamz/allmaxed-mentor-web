"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/context/authStore";

interface FormData {
  expertise: string;
  experience: string;
  occupation: string;
  institute: string;
  designation: string;
  duration: string;
  portfolio: string;
  social: string;
}

interface Errors {
  expertise: string;
  experience: string;
  occupation: string;
  institute: string;
  designation: string;
  duration: string;
  portfolio: string;
  social: string;
}

export default function ProfessionalInfoForm() {
  const router = useRouter();

  const { apiPayload, userToken, setApiPayload } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    expertise: "",
    experience: "",
    occupation: "",
    institute: "",
    designation: "",
    duration: "",
    portfolio: "",
    social: "",
  });

  const [errors, setErrors] = useState<Errors>({
    expertise: "",
    experience: "",
    occupation: "",
    institute: "",
    designation: "",
    duration: "",
    portfolio: "",
    social: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const expertiseRef = useRef<HTMLInputElement>(null);
  const experienceRef = useRef<HTMLInputElement>(null);
  const occupationRef = useRef<HTMLSelectElement>(null);
  const instituteRef = useRef<HTMLInputElement>(null);
  const designationRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const portfolioRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Errors = {
      expertise: "",
      experience: "",
      occupation: "",
      institute: "",
      designation: "",
      duration: "",
      portfolio: "",
      social: "",
    };
    let firstErrorField: string | null = null;

    if (!formData.expertise.trim()) {
      newErrors.expertise = "Field/Expertise is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "expertise";
    }
    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "experience";
    }
    if (!formData.occupation.trim()) {
      newErrors.occupation = "Current Occupation is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "occupation";
    }
    if (!formData.institute.trim()) {
      newErrors.institute = "College/Company is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "institute";
    }
    if (!formData.designation.trim()) {
      newErrors.designation = "Course/Designation is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "designation";
    }
    if (!formData.duration.trim()) {
      newErrors.duration = "Year/Duration is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "duration";
    }

    setErrors(newErrors);
    return { isValid, firstErrorField };
  };

  const dataUpload = async (payload: {
    age: number;
    gender: string;
    aadhaar_no: string | null;
    phone: string;
    address: string;
    city: string;
    district: string;
    state: string;
    field: string;
    current_occupation: string;
    designation: string;
    experience: string;
    workplace: string;
    duration: string;
    portfolio_link: string | null;
    social_media_link: string | null;
  }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/mentors`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: dataUpload,
    onSuccess: (data) => {
      toast.success(data.message || "Mentor created successfully!");
      router.push("/waiting");
    },

    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const errMsg =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        if (error.response?.status === 409) {
          toast.error("User is already a mentor.");
        } else if (error.response?.status === 429) {
          toast.error("Too many requests. Please try again later.");
        } else if (error.response?.status === 422) {
          let msg = "";
          if (typeof error.response.data.error === "object") {
            for (const [, val] of Object.entries(error.response.data.error)) {
              msg += `${Array.isArray(val) ? val.join(", ") : val}\n`;
            }
          } else {
            msg = error.response.data.error || errMsg;
          }
          toast.error(msg || "Validation failed.");
        } else {
          toast.error(errMsg);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const { isValid, firstErrorField } = validateForm();
    if (isValid && apiPayload) {
      const professionalData = {
        field: formData.expertise,
        experience: formData.experience,
        current_occupation: formData.occupation,
        designation: formData.designation,
        workplace: formData.institute,
        duration: formData.duration,
        portfolio_link: formData.portfolio || null,
        social_media_link: formData.social || null,
      };

      setApiPayload(professionalData);

      const fullPayload: {
        age: number;
        gender: string;
        aadhaar_no: string | null;
        phone: string;
        address: string;
        city: string;
        district: string;
        state: string;
        field: string;
        current_occupation: string;
        designation: string;
        experience: string;
        workplace: string;
        duration: string;
        portfolio_link: string | null;
        social_media_link: string | null;
      } = {
        age: apiPayload.age ?? 0,
        gender: apiPayload.gender ?? "",
        aadhaar_no: apiPayload.aadhaar_no ?? null,
        phone: apiPayload.phone ?? "",
        address: apiPayload.address ?? "",
        city: apiPayload.city ?? "",
        district: apiPayload.district ?? "",
        state: apiPayload.state ?? "",
        ...professionalData,
      };
      
      mutation.mutate(fullPayload);
    } else {
      if (firstErrorField === "expertise" && expertiseRef.current)
        expertiseRef.current.focus();
      else if (firstErrorField === "experience" && experienceRef.current)
        experienceRef.current.focus();
      else if (firstErrorField === "occupation" && occupationRef.current)
        occupationRef.current.focus();
      else if (firstErrorField === "institute" && instituteRef.current)
        instituteRef.current.focus();
      else if (firstErrorField === "designation" && designationRef.current)
        designationRef.current.focus();
      else if (firstErrorField === "duration" && durationRef.current)
        durationRef.current.focus();
    }
  };

  return (
    <Tooltip.Provider>
      <div className="grid grid-rows-5 justify-center items-start h-dvh">
        <div className="responsive-one grid grid-rows-2 h-full justify-center items-center z-0">
          <div className="h-full flex justify-center items-center overflow-hidden">
            <div className="w-[80%] sm:w-[60%] md:w-[60%] lg:w-[40%] max-w-[666px] h-auto aspect-[666/375] relative">
              <Image
                src="/images/allmaxd_text_black.png"
                alt="AllMax'd Logo"
                className="absolute inset-0 w-full h-full object-contain"
                fill
                priority
              />
            </div>
          </div>
          <div className="flex justify-center w-full">
            <p className="title-subtext">
              Provide Us with your professional background to know you better.
            </p>
          </div>
        </div>

        <form
          className="responsive-one max-md:mt-3 row-start-2 row-span-4 justify-items-center z-10"
          onSubmit={handleSubmit}
        >
          <div className="subtitle-container">
            <p className="subtitle-text">Professional Details</p>
          </div>

          <div className="flex justify-center items-center w-full">
            <Tooltip.Root
              open={
                submitted && !!errors.expertise && focusedField === "expertise"
              }
            >
              <Tooltip.Trigger asChild>
                <input
                  name="expertise"
                  id="expertise"
                  type="text"
                  ref={expertiseRef}
                  className={`form-input ${
                    errors.expertise ? "border-red-500" : ""
                  }`}
                  value={formData.expertise}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("expertise")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Field/Expertise"
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.expertise}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full">
            <Tooltip.Root
              open={
                submitted &&
                !!errors.experience &&
                focusedField === "experience"
              }
            >
              <Tooltip.Trigger asChild>
                <input
                  name="experience"
                  id="experience"
                  type="text"
                  ref={experienceRef}
                  className={`form-input ${
                    errors.experience ? "border-red-500" : ""
                  }`}
                  value={formData.experience}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("experience")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Experience"
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.experience}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full relative">
            <Tooltip.Root
              open={
                submitted &&
                !!errors.occupation &&
                focusedField === "occupation"
              }
            >
              <Tooltip.Trigger asChild>
                <select
                  name="occupation"
                  id="occupation"
                  ref={occupationRef}
                  className={`form-input cursor-pointer appearance-none z-10 ${
                    errors.occupation ? "border-red-500" : ""
                  }`}
                  value={formData.occupation}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("occupation")}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="" disabled>
                    Current Occupation
                  </option>
                  <option value="student">Student</option>
                  <option value="working">Working Professional</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="other">Other</option>
                </select>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.occupation}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
            <span className="password-toggle z-0" aria-hidden="true">
              <i className="mdi mdi-chevron-down"></i>
            </span>
          </div>

          <div className="flex justify-center items-center w-full">
            <Tooltip.Root
              open={
                submitted && !!errors.institute && focusedField === "institute"
              }
            >
              <Tooltip.Trigger asChild>
                <input
                  name="institute"
                  id="institute"
                  type="text"
                  ref={instituteRef}
                  className={`form-input ${
                    errors.institute ? "border-red-500" : ""
                  }`}
                  value={formData.institute}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("institute")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="College/Company"
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.institute}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full">
            <Tooltip.Root
              open={
                submitted &&
                !!errors.designation &&
                focusedField === "designation"
              }
            >
              <Tooltip.Trigger asChild>
                <input
                  name="designation"
                  id="designation"
                  type="text"
                  ref={designationRef}
                  className={`form-input ${
                    errors.designation ? "border-red-500" : ""
                  }`}
                  value={formData.designation}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("designation")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Course/Designation"
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.designation}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full">
            <Tooltip.Root
              open={
                submitted && !!errors.duration && focusedField === "duration"
              }
            >
              <Tooltip.Trigger asChild>
                <input
                  name="duration"
                  id="duration"
                  type="text"
                  ref={durationRef}
                  className={`form-input ${
                    errors.duration ? "border-red-500" : ""
                  }`}
                  value={formData.duration}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("duration")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Year/Duration"
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.duration}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full">
            <input
              name="portfolio"
              id="portfolio"
              type="url"
              ref={portfolioRef}
              className={`form-input ${
                errors.portfolio ? "border-red-500" : ""
              }`}
              value={formData.portfolio}
              onChange={handleChange}
              onFocus={() => setFocusedField("portfolio")}
              onBlur={() => setFocusedField(null)}
              placeholder="Portfolio Link (Optional)"
            />
          </div>

          <div className="flex justify-center items-center w-full">
            <input
              name="social"
              id="social"
              type="url"
              className="form-input"
              placeholder="Social Media Link (Optional)"
              value={formData.social}
              onChange={handleChange}
              onFocus={() => setFocusedField("social")}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className="flex justify-center items-center w-full">
            <button
              type="submit"
              className="form-button"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </Tooltip.Provider>
  );
}
