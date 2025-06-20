"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useAuthStore } from "@/context/authStore";

interface FormData {
  age: string;
  gender: string;
  aadhaar: string;
  state: string;
  district: string;
  city: string;
  address: string;
}

interface Errors {
  age: string;
  gender: string;
  aadhaar: string;
  state: string;
  district: string;
  city: string;
  address: string;
}

export default function PersonalInfoForm() {
  const router = useRouter();
  const { setApiPayload } = useAuthStore();  

  const [formData, setFormData] = useState<FormData>({
    age: "",
    gender: "",
    aadhaar: "",
    state: "",
    district: "",
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState<Errors>({
    age: "",
    gender: "",
    aadhaar: "",
    state: "",
    district: "",
    city: "",
    address: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const ageRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const aadhaarRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const districtRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
      age: "",
      gender: "",
      aadhaar: "",
      state: "",
      district: "",
      city: "",
      address: "",
    };
    let firstErrorField: string | null = null;

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "age";
    }
    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "gender";
    }
    if (!formData.aadhaar.trim()) {
      newErrors.aadhaar = "Aadhaar number is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "aadhaar";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "state";
    }
    if (!formData.district.trim()) {
      newErrors.district = "District is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "district";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "city";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "address";
    }

    setErrors(newErrors);
    return { isValid, firstErrorField };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const { isValid, firstErrorField } = validateForm();
    if (isValid) {
      setApiPayload({
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        aadhaar_no: formData.aadhaar || null,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        state: formData.state,
      });
      
      router.push("/signup/professional-info");
    } else {
      if (firstErrorField === "age" && ageRef.current) ageRef.current.focus();
      else if (firstErrorField === "gender" && genderRef.current)
        genderRef.current.focus();
      else if (firstErrorField === "aadhaar" && aadhaarRef.current)
        aadhaarRef.current.focus();
      else if (firstErrorField === "state" && stateRef.current)
        stateRef.current.focus();
      else if (firstErrorField === "district" && districtRef.current)
        districtRef.current.focus();
      else if (firstErrorField === "city" && cityRef.current)
        cityRef.current.focus();
      else if (firstErrorField === "address" && addressRef.current)
        addressRef.current.focus();
    }
  };

  return (
    <Tooltip.Provider>
      <div className="grid grid-rows-5 justify-center items-start h-dvh">
        {/* Row 1 */}
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
          <div className="flex justify-center items-center w-full">
            <p className="title-subtext">
              To setup a mentor profile you have to provide the mentioned
              details accurately.
            </p>
          </div>
        </div>
        {/* Rows 2-5 */}
        <form
          className="responsive-one row-start-2 row-span-4 justify-items-center z-10"
          onSubmit={handleSubmit}
        >
          <div className="subtitle-container">
            <p className="subtitle-text">Personal Details</p>
          </div>

          <div className="flex justify-center items-center w-full">
            <Tooltip.Root
              open={submitted && !!errors.age && focusedField === "age"}
            >
              <Tooltip.Trigger asChild>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  title="Enter age in numbers"
                  name="age"
                  id="age"
                  placeholder="Your Age"
                  className={`form-input ${errors.age ? "border-red-500" : ""}`}
                  value={formData.age}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("age")}
                  onBlur={() => setFocusedField(null)}
                  ref={ageRef}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.age}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full relative">
            <Tooltip.Root
              open={submitted && !!errors.gender && focusedField === "gender"}
            >
              <Tooltip.Trigger asChild>
                <select
                  name="gender"
                  id="gender"
                  className={`form-input cursor-pointer appearance-none z-10 ${
                    errors.gender ? "border-red-500" : ""
                  }`}
                  value={formData.gender}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("gender")}
                  onBlur={() => setFocusedField(null)}
                  ref={genderRef}
                >
                  <option value="" disabled>
                    Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
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
                  {errors.gender}
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
              open={submitted && !!errors.aadhaar && focusedField === "aadhaar"}
            >
              <Tooltip.Trigger asChild>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="aadhaar"
                  id="aadhaar"
                  placeholder="Aadhaar No"
                  className={`form-input ${
                    errors.aadhaar ? "border-red-500" : ""
                  }`}
                  value={formData.aadhaar}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("aadhaar")}
                  onBlur={() => setFocusedField(null)}
                  ref={aadhaarRef}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.aadhaar}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full">
            <Tooltip.Root
              open={submitted && !!errors.state && focusedField === "state"}
            >
              <Tooltip.Trigger asChild>
                <input
                  type="text"
                  name="state"
                  id="state"
                  placeholder="Your State"
                  className={`form-input ${
                    errors.state ? "border-red-500" : ""
                  }`}
                  value={formData.state}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("state")}
                  onBlur={() => setFocusedField(null)}
                  ref={stateRef}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.state}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full">
            <Tooltip.Root
              open={
                submitted && !!errors.district && focusedField === "district"
              }
            >
              <Tooltip.Trigger asChild>
                <input
                  type="text"
                  name="district"
                  id="district"
                  placeholder="Your District"
                  className={`form-input ${
                    errors.district ? "border-red-500" : ""
                  }`}
                  value={formData.district}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("district")}
                  onBlur={() => setFocusedField(null)}
                  ref={districtRef}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.district}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full">
            <Tooltip.Root
              open={submitted && !!errors.city && focusedField === "city"}
            >
              <Tooltip.Trigger asChild>
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="Your City"
                  className={`form-input ${
                    errors.city ? "border-red-500" : ""
                  }`}
                  value={formData.city}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("city")}
                  onBlur={() => setFocusedField(null)}
                  ref={cityRef}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.city}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full">
            <Tooltip.Root
              open={submitted && !!errors.address && focusedField === "address"}
            >
              <Tooltip.Trigger asChild>
                <textarea
                  name="address"
                  id="address"
                  placeholder="Your Address"
                  className={`form-input ${
                    errors.address ? "border-red-500" : ""
                  }`}
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField(null)}
                  ref={addressRef}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  align="center"
                  className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                  sideOffset={5}
                >
                  {errors.address}
                  <Tooltip.Arrow className="fill-red-500" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          <div className="flex justify-center items-center w-full">
            <button type="submit" className="form-button">
              Next
            </button>
          </div>
        </form>
      </div>
    </Tooltip.Provider>
  );
}
