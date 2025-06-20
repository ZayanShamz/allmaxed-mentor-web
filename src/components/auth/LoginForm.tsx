"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";
import { useAuthStore } from "@/context/authStore";
import * as Tooltip from "@radix-ui/react-tooltip";

interface ErrorResponse {
  message?: string;
}

export default function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const {
    setSignupData,
    setMentorData,
    setUserToken,
    reset,
    setApiPayload,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const loginResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = loginResponse.data.token;
    //   console.log(token);
          
      if (!token) {
        throw new Error("Login failed: No token received");
      }

      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { token, user: userResponse.data };
    },
    onSuccess: ({ token, user }) => {
      const userType = user.type;
      const userStatus = user.status;

      const phone = user.phone;
      const username = user.name;
      const email = user.email;

      reset();
      setUserToken(token);

      if (userType === "mentor") {
        if (userStatus === "pending") {
          setSignupData({ username, email, phone });
          setApiPayload({ phone: phone });
          toast("Fill out the remaining details", {
            style: { background: "#333", color: "#fff" },
          });
          router.push("/signup/personal-info");
        } else if (userStatus === "in-review") {
          toast.success("Approval in Review");
          router.push("/waiting");
        } else if (userStatus === "approved") {
          const mentorData = user.mentor;
          setSignupData({ username, email, phone });
          setMentorData(mentorData);
          router.push("/home");
          toast.success("Login successful");
        } else if (userStatus === "rejected") {
          toast.error(
            "Your account has been rejected. Please contact support."
          );
        }
      } else {
        toast.error("Unauthorized Login. Only mentors can log in.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status === 401) {
        toast.error("Invalid credentials");
      } else if (error.response) {
        toast.error(
          error.response.data.message || "Login failed. Please try again."
        );
      } else {
        toast.error(
          error.message || "Network error. Please check your connection."
        );
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
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
    const newErrors = { ...errors };
    let firstErrorField: string | null = null;

    // Check email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "email";
    }

    // Check password
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "password";
    }

    setErrors(newErrors);
    return { isValid, firstErrorField };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const { isValid, firstErrorField } = validateForm();
    if (isValid) {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      if (firstErrorField === "email" && emailRef.current) {
        emailRef.current.focus();
        setFocusedField("email");
      } else if (firstErrorField === "password" && passwordRef.current) {
        passwordRef.current.focus();
        setFocusedField("password");
      }
    }
  };

  return (
    <Tooltip.Provider>
      <div className="grid grid-rows-[auto, min-content] justify-center items-center h-dvh">
        {/* row auto */}
        <div className="row-span-3 responsive-one grid grid-rows-[auto,1fr] items-center">
          {/* spanning 3 rows */}
          <div className="h-full flex justify-center items-center overflow-hidden z-0">
            <div className="w-[50%] sm:w-[50%] md:w-[50%] lg:w-[30%] max-w-[500px] mb-5 scale-75 h-auto aspect-[500/500] relative">
              <Image
                src="/images/login_logo.png"
                alt="AllMax'd Logo"
                className="absolute inset-0 w-full h-full object-contain"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <form
            className="w-full grid grid-rows-3 items-center z-10"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col justify-center items-center w-full">
              <Tooltip.Root
                open={submitted && !!errors.email && focusedField === "email"}
              >
                <Tooltip.Trigger asChild>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
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

            <PasswordInput
              value={formData.password}
              onChange={handlePasswordChange}
              hasError={!!errors.password}
              showTooltip={
                submitted && !!errors.password && focusedField === "password"
              }
              errorMessage={errors.password}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              ref={passwordRef}
            />

            <div className="flex justify-center items-center">
              <button type="submit" className="form-button">
                Sign In
              </button>
            </div>
          </form>
        </div>
        {/* footer row */}
        <div className="responsive-one row-start-4 h-full flex justify-center items-end pb-10">
          <span>
            <span className="text-allcharcoal">Not Yet a Mentor?</span>{" "}
            <Link
              href="/signup"
              className="text-allpurple hover:underline focus:underline"
            >
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
