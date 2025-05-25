"use client";

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fieldErrorLabel } from "@/components/ui/fieldErrorLabel";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRegisterMutation } from "@/features/auth/mutations";
import { registerSchema } from "@/features/auth/schema";
import { formikFieldError } from "@/lib/utils";

// Carousel slide components
const CarouselSlide1 = () => (
  <div className="flex h-full flex-col items-center justify-center text-white">
    <div className="mb-8 flex w-full max-w-md flex-col items-center text-center">
      <h2 className="mb-4 text-3xl font-bold">
        Upload and manage your PDFs effortlessly
      </h2>
      <p className="text-lg text-white/80">
        Securely store, search, and organize your documents in one place.
      </p>
    </div>

    <div className="relative mb-8 w-full max-w-md">
      <div className="rounded-xl bg-indigo-500/20 p-6 shadow-lg backdrop-blur-sm">
        <div className="mb-4 text-white">
          <p className="text-sm uppercase tracking-wide text-white/60">
            Your Files
          </p>
          <ul className="mt-2 space-y-2 text-left">
            <li>📄 ProjectProposal.pdf</li>
            <li>📄 Resume_2025.pdf</li>
            <li>📄 MeetingNotes.pdf</li>
          </ul>
        </div>
        <div className="mt-4 flex justify-between">
          <span className="text-xs text-white/60">Last upload: 2 mins ago</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs text-indigo-600">
            Drag & Drop
          </span>
        </div>
      </div>
    </div>

    <div className="flex gap-2">
      <span className="h-2 w-2 rounded-full bg-white"></span>
      <span className="h-2 w-2 rounded-full bg-white/50"></span>
      <span className="h-2 w-2 rounded-full bg-white/50"></span>
    </div>
  </div>
);

const CarouselSlide2 = () => (
  <div className="flex h-full flex-col items-center justify-center text-white">
    <div className="mb-8 flex w-full max-w-md flex-col items-center text-center">
      <h2 className="mb-4 text-3xl font-bold">Flexible PDF sharing</h2>
      <p className="text-lg text-white/80">
        Create public links or invite teammates to collaborate securely.
      </p>
    </div>

    <div className="mb-8 w-full max-w-md space-y-4">
      <div className="rounded-xl bg-indigo-500/30 p-4">
        <p className="text-sm text-white/70">🔗 Public Share Link</p>
        <div className="mt-2 text-xs break-all bg-white/10 px-3 py-2 font-mono rounded-md">
          https://yourapp.com/share/abc123...
        </div>
      </div>

      <div className="rounded-xl bg-indigo-500/30 p-4">
        <p className="text-sm text-white/70">👥 Group Access</p>
        <ul className="mt-2 text-sm space-y-1">
          <li>✔️ alice@example.com</li>
          <li>✔️ bob@workmail.com</li>
          <li>➕ Invite more...</li>
        </ul>
      </div>
    </div>

    <div className="flex gap-2">
      <span className="h-2 w-2 rounded-full bg-white/50"></span>
      <span className="h-2 w-2 rounded-full bg-white"></span>
      <span className="h-2 w-2 rounded-full bg-white/50"></span>
    </div>
  </div>
);

const CarouselSlide3 = () => (
  <div className="flex h-full flex-col items-center justify-center text-white">
    <div className="mb-8 flex w-full max-w-md flex-col items-center text-center">
      <h2 className="mb-4 text-3xl font-bold">Comment with context</h2>
      <p className="text-lg text-white/80">
        Leave feedback with rich text and emojis directly on any document.
      </p>
    </div>

    <div className="relative mb-8 w-full max-w-md">
      <div className="rounded-xl bg-white p-4 text-indigo-900 shadow-md">
        <div className="mb-2 text-xs text-indigo-500">👤 Alice</div>
        <div className="rounded-md bg-indigo-100 p-3 text-sm leading-snug">
          <p>
            Can we <strong>bold</strong> this header and maybe add a 🎯 here?
          </p>
        </div>
        <div className="mt-4 text-right text-xs text-gray-400">Just now</div>
      </div>

      <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow">
        💬
      </div>
    </div>

    <div className="flex gap-2">
      <span className="h-2 w-2 rounded-full bg-white/50"></span>
      <span className="h-2 w-2 rounded-full bg-white/50"></span>
      <span className="h-2 w-2 rounded-full bg-white"></span>
    </div>
  </div>
);

export default function Signup() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    <CarouselSlide1 key={0} />,
    <CarouselSlide2 key={1} />,
    <CarouselSlide3 key={2} />,
  ];

  const navigate = useNavigate();

  const handleRedirectToLogin = useCallback(() => {
    console.log("hehe navigatin");
    navigate("/login");
  }, [navigate]);

  const { mutate: registerUser, isPending } = useRegisterMutation(
    handleRedirectToLogin,
  );

  const registerForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false,
    },
    validationSchema: registerSchema,
    onSubmit: (values: any) => {
      registerUser({
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
      });
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  return (
    <div className="flex h-screen relative">
      <div className="flex w-full flex-col justify-start items-center p-8 md:w-1/2 lg:p-12">
        <div className="w-5/8">
          <div className="mb-8">
            <Zap className="h-8 w-8 text-indigo-600" />
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">Let's upload PDFs!</p>
          </div>

          <div className="mb-6 flex w-full justify-center items-center">
            <Button
              variant="outline"
              className="w-full px-8 py-6 justify-center gap-2"
            >
              <Avatar>
                <AvatarImage src="google-icon.svg" />
              </Avatar>
              Sign up with Google
            </Button>
          </div>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={registerForm.handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name*</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  className={formikFieldError(
                    registerForm.touched.firstName,
                    registerForm.errors.firstName,
                  )}
                  value={registerForm.values.firstName}
                  onChange={registerForm.handleChange}
                  onBlur={registerForm.handleBlur}
                />
                {fieldErrorLabel(
                  registerForm.touched.firstName,
                  registerForm.errors.firstName,
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name*</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  className={formikFieldError(
                    registerForm.touched.lastName,
                    registerForm.errors.lastName,
                  )}
                  value={registerForm.values.lastName}
                  onChange={registerForm.handleChange}
                  onBlur={registerForm.handleBlur}
                />
                {fieldErrorLabel(
                  registerForm.touched.lastName,
                  registerForm.errors.lastName,
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                className={formikFieldError(
                  registerForm.touched.email,
                  registerForm.errors.email,
                )}
                placeholder="mail@website.com"
                value={registerForm.values.email}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
              />
              {fieldErrorLabel(
                registerForm.touched.email,
                registerForm.errors.email,
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                name="password"
                type="password"
                className={formikFieldError(
                  registerForm.touched.password,
                  registerForm.errors.password,
                )}
                value={registerForm.values.password}
                onChange={registerForm.handleChange}
                onBlur={registerForm.handleBlur}
              />

              {fieldErrorLabel(
                registerForm.touched.password,
                registerForm.errors.password,
              )}
              <p className="text-xs text-muted-foreground">
                Min. 8 characters with number and symbol
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                name="terms"
                className={formikFieldError(
                  registerForm.touched.terms,
                  registerForm.errors.terms,
                )}
                checked={registerForm.values.terms}
                onCheckedChange={(checked) =>
                  registerForm.setFieldValue("terms", checked)
                }
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the{" "}
                <Link to="#" className="text-indigo-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              {isPending ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* <div className="absolute bottom-8 text-center text-xs text-muted-foreground">
          ©2025 PDF Collab. All rights reserved.
        </div> */}
      </div>

      <div className="hidden bg-indigo-600 md:block md:w-1/2">
        <div className="relative flex h-full items-center justify-center overflow-hidden">
          <div
            className="flex h-full w-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="h-full w-full flex-shrink-0">
                {slide}
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/30"></div>
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-500/30"></div>
          <div className="absolute bottom-16 right-16 h-32 w-32 rounded-full bg-indigo-500/30"></div>
        </div>
      </div>
    </div>
  );
}
