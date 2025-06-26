"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/context/authStore";
import PasswordInput from "./PasswordInput";
import { Button } from "../ui/button";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface Errors {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function SignupForm() {
  const router = useRouter();
  const { setSignupData, setApiPayload, setUserToken } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handlePasswordChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      password: value,
    }));

    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Errors = {
      name: "",
      email: "",
      phone: "",
      password: "",
    };
    let firstErrorField: string | null = null;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "phone";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "password";
    }

    setErrors(newErrors);
    return { isValid, firstErrorField };
  };

  const signupUser = async (data: FormData) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        ...data,
        password_confirmation: data.password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  };

  const signUpMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      if (data.token) {
        console.log("Signup success:", data);
        toast.success(
          "Account Creation Initiated, Please fill out the Remaining Details"
        );

        setSignupData({
          username: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });

        setApiPayload({ phone: data.user.phone });

        setUserToken(data.token);

        router.push("/signup/personal-info");
      } else if (data.error) {
        let msg = "";

        if (typeof data.error === "object") {
          for (const [, val] of Object.entries(data.error)) {
            msg += `${Array.isArray(val) ? val.join(", ") : val}\n`;
          }
        } else {
          msg = data.error;
        }
        toast.error(msg || "Validation failed.");
      } else {
        toast.error("Unexpected response. Try again.");
      }
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const errMsg = error.response?.data?.message || "Something went wrong.";
        if (error.response?.status === 429) {
          toast.error("Too many requests. Please try again later.");
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
    if (isValid) {
      signUpMutation.mutate(formData);
    } else {
      if (firstErrorField === "name" && nameRef.current)
        nameRef.current.focus();
      else if (firstErrorField === "email" && emailRef.current)
        emailRef.current.focus();
      else if (firstErrorField === "phone" && phoneRef.current)
        phoneRef.current.focus();
      else if (firstErrorField === "password" && passwordRef.current)
        passwordRef.current.focus();
    }
  };

  return (
    <Tooltip.Provider>
      <div className="flex flex-col items-center justify-center w-full h-dvh py-10">
        <div className="flex flex-col flex-1 w-full items-center justify-center">
          <div className="flex justify-center pb-5">
            <Image
              src="/images/login_logo.png"
              alt="AllMax'd Logo"
              className="object-contain h-auto w-40 md:w-48 lg:w-56 xl:w-64"
              width={256}
              height={256}
              priority
            />
          </div>
          <div className="responsive-one flex justify-center">
            <div className="min-w-[90%] sm:min-w-[60%] lg:min-w-[45%] flex flex-col items-start">
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex justify-center items-center w-full">
                  <Tooltip.Root
                    open={submitted && !!errors.name && focusedField === "name"}
                  >
                    <Tooltip.Trigger asChild>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Full Name"
                        className={`form-input ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        ref={nameRef}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="bottom"
                        align="center"
                        className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                        sideOffset={5}
                      >
                        {errors.name}
                        <Tooltip.Arrow className="fill-red-500" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </div>

                <div className="flex justify-center items-center w-full">
                  <Tooltip.Root
                    open={
                      submitted && !!errors.email && focusedField === "email"
                    }
                  >
                    <Tooltip.Trigger asChild>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Your Email"
                        className={`form-input ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        ref={emailRef}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="bottom"
                        align="center"
                        className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                        sideOffset={5}
                      >
                        {errors.email}
                        <Tooltip.Arrow className="fill-red-500" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </div>

                <div className="flex justify-center items-center w-full">
                  <Tooltip.Root
                    open={
                      submitted && !!errors.phone && focusedField === "phone"
                    }
                  >
                    <Tooltip.Trigger asChild>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="Your Phone No"
                        className={`form-input ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        ref={phoneRef}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="bottom"
                        align="center"
                        className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                        sideOffset={5}
                      >
                        {errors.phone}
                        <Tooltip.Arrow className="fill-red-500" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </div>

                <PasswordInput
                  value={formData.password}
                  onChange={handlePasswordChange}
                  hasError={!!errors.password}
                  showTooltip={
                    submitted &&
                    !!errors.password &&
                    focusedField === "password"
                  }
                  errorMessage={errors.password}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  ref={passwordRef}
                />
                <div className="flex justify-center items-center py-5">
                  <Button
                    type="submit"
                    className="w-[45%] py-5 bg-allpurple text-allsnowflake text-lg border border-allcharcoal cursor-pointer transition duration-300 ease-in-out hover:bg-[#0022ff] hover:text-white"
                    disabled={signUpMutation.isPending}
                  >
                    {signUpMutation.isPending ? "Submitting..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="w-full text-center">
          <span>
            <span className="text-allcharcoal">Not Yet a Mentor? </span>
            <Link
              href="/login"
              className="text-allpurple hover:underline focus:underline"
            >
              Login
            </Link>
          </span>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
