import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FiAlertCircle,
  FiArrowRight,
  FiAtSign,
  FiCalendar,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { MdOutlineWc } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Field from "../../Components/Auth/Field";
import {
  registerSchema,
  type registerSchemaType,
} from "../../Schemas/auth.schema";
import { Helmet } from "react-helmet";

export default function Register() {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [isRePassOpen, setIsRePassOpen] = useState(false);

  const navigat = useNavigate();

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  const form = useForm<registerSchemaType>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    mode: "all",
    resolver: zodResolver(registerSchema),
  });

  const { register, handleSubmit, formState } = form;

  function registerApi(data: registerSchemaType) {
    setIsLoading(true);

    axios
      .post("https://route-posts.routemisr.com/users/signup", data)
      .then((res) => {
        if (res.data.success) {
          navigat("/login");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setApiError(err.response.data.message);
        setIsLoading(false);
      });
  }

  return (
    <>
      <Helmet>
        <title>Elvora | Register</title>
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 pb-36 py-10">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <FiUser className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Fill in your details to get started.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(registerApi)}>
            {/* Name */}
            <Field
              label="Full name"
              htmlFor="name"
              icon={FiUser}
              error={formState.errors.name?.message}
            >
              <input
                id="name"
                {...register("name")}
                type="text"
                placeholder="Ahmed Ashraf"
                className={inputClass}
              />
            </Field>

            {/* Username + Email */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Username"
                htmlFor="username"
                icon={FiAtSign}
                error={formState.errors.username?.message}
              >
                <input
                  id="username"
                  {...register("username")}
                  type="text"
                  placeholder="ahmedAshraf"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Email"
                htmlFor="email"
                icon={FiMail}
                error={formState.errors.email?.message}
              >
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Date of birth + Gender */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Date of birth"
                htmlFor="dateOfBirth"
                icon={FiCalendar}
                error={formState.errors.dateOfBirth?.message}
              >
                <input
                  id="dateOfBirth"
                  {...register("dateOfBirth")}
                  type="date"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Gender"
                htmlFor="gender"
                icon={MdOutlineWc}
                error={formState.errors.gender?.message}
              >
                <select
                  id="gender"
                  {...register("gender")}
                  defaultValue="male"
                  className={`${inputClass} appearance-none`}
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </Field>
            </div>

            {/* Password */}
            <Field
              label="Password"
              htmlFor="password"
              icon={FiLock}
              error={formState.errors.password?.message}
            >
              <input
                id="password"
                {...register("password")}
                type={isPassOpen ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setIsPassOpen(!isPassOpen)}
                aria-label="Show password"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition hover:text-slate-600 cursor-pointer"
              >
                {isPassOpen ? (
                  <FiEyeOff className="text-blue-800" />
                ) : (
                  <FiEye />
                )}
              </button>
            </Field>

            {/* Confirm password */}
            <Field
              label="Confirm password"
              htmlFor="rePassword"
              icon={FiLock}
              error={formState.errors.rePassword?.message}
            >
              <input
                id="rePassword"
                {...register("rePassword")}
                type={isRePassOpen ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setIsRePassOpen(!isRePassOpen)}
                aria-label="Show password"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition hover:text-slate-600 cursor-pointer"
              >
                {isRePassOpen ? (
                  <FiEyeOff className="text-blue-800" />
                ) : (
                  <FiEye />
                )}
              </button>
            </Field>

            {apiError && (
              <div
                role="alert"
                className="m-2 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
              >
                <FiAlertCircle className="mt-0.5 shrink-0 text-lg text-red-500" />

                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-700">
                    Registration failed
                  </p>
                  <p className="mt-0.5 text-sm text-red-600">{apiError}</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 disabled:bg-gray-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Create account
                  <FiArrowRight className="transition group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
