import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FiAlertCircle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiLogIn,
  FiMail
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Field from "../../Components/Auth/Field";
import {
  loginSchema,
  type loginSchemaType
} from "../../Schemas/auth.schema";
import { LoginContext } from "../../Context/LoginContext";

export default function Login() {
  const [apiError , setApiError] = useState(null)
  const [isLoading , setIsLoading] = useState(false)
  const [isPassOpen , setIsPassOpen] = useState(false)
  const navigat = useNavigate()
  const { setUserLogin} = useContext(LoginContext)

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  const form = useForm<loginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(loginSchema),
  });

  const { register, handleSubmit, formState } = form;

  function loginApi(data: loginSchemaType) {
    setIsLoading(true)

    axios.post("https://route-posts.routemisr.com/users/signin" , data)
    .then((res) => {
      if (res.data.success) {
        navigat("/")
        setIsLoading(false)
        localStorage.setItem("userToken" , res.data.data.token)
        setUserLogin(res.data.data.token)
      }
    })
    .catch((err) => {
      setApiError(err.response.data.message)
      setIsLoading(false)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <FiLogIn className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to continue to your account.
          </p>
        </div>
 
        <form className="space-y-5" onSubmit={handleSubmit(loginApi)}>
          {/* Email */}
          <Field label="Email" htmlFor="email" icon={FiMail} error={formState.errors.email?.message}>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className={inputClass}
            />
          </Field>
 
          {/* Password */}
          <Field label="Password" htmlFor="password" icon={FiLock} error={formState.errors.password?.message}>
            <input
              id="password"
              {...register("password")}
              type={isPassOpen?"text": "password"}
              placeholder="••••••••"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              aria-label="Show password"
              onClick={() => setIsPassOpen(!isPassOpen)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition hover:text-slate-600"
            >
              {isPassOpen? <FiEyeOff className="text-blue-800" /> : <FiEye />}
            </button>
          </Field>
 
          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
 
          { apiError && 
            <div
            role="alert"
            className="m-2 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <FiAlertCircle className="mt-0.5 shrink-0 text-lg text-red-500" />

            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">
                Login failed
              </p>
              <p className="mt-0.5 text-sm text-red-600">{apiError}</p>
            </div>
          </div>
          }

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 disabled:bg-gray-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed"
          >

            { isLoading ?
            <>
            <AiOutlineLoading3Quarters className="animate-spin"/>
            Loading...
            </>:
            <>
            Sign in
            <FiArrowRight className="transition group-hover:translate-x-1" />
            </>
            }
            
          </button>
        </form>
 
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
