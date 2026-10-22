import {
  FiAlertCircle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiSettings,
} from "react-icons/fi";
import Field from "../../Components/Auth/Field";
import { useForm } from "react-hook-form";
import {
  changePassSchema,
  changePassSchemaType,
} from "../../Schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "./../../../node_modules/react-hot-toast/src/index";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

export default function Settings() {
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [isNewPassOpen, setIsNewPassOpen] = useState(false);

  const { register, handleSubmit, formState, reset } =
    useForm<changePassSchemaType>({
      defaultValues: {
        password: "",
        newPassword: "",
      },
      mode: "all",
      resolver: zodResolver(changePassSchema),
    });

  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: (data: changePassSchemaType) =>
      axios.patch(
        `https://route-posts.routemisr.com/users/change-password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),
    onSuccess: (res) => {
      localStorage.setItem("userToken" , res.data.data.token)
      localStorage.setItem("loginTime", Date.now().toString());
      toast.success(res.data.message);
      reset();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data.message || err.message);
    },
  });

  function handleChangePass(data: changePassSchemaType) {
    mutate(data);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 sm:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <FiSettings className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Change your password to keep your account secure.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(handleChangePass)}>
          {/* Current password */}
          <Field
            label="Current password"
            htmlFor="password"
            icon={FiLock}
            error={formState.errors.password?.message}
          >
            <input
              id="password"
              {...register("password")}
              type={isPassOpen ? "text" : "password"}
              placeholder="••••••••"
              className={inputClass}
            />
            <button
              type="button"
              aria-label="Show password"
              onClick={() => setIsPassOpen(!isPassOpen)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-lg text-slate-400 transition hover:text-slate-600"
            >
              {isPassOpen ? <FiEyeOff className="text-blue-800" /> : <FiEye />}
            </button>
          </Field>

          {/* New password */}
          <Field
            label="New password"
            htmlFor="newPassword"
            icon={FiLock}
            error={formState.errors.newPassword?.message}
          >
            <input
              id="newPassword"
              {...register("newPassword")}
              type={isNewPassOpen ? "text" : "password"}
              placeholder="••••••••"
              className={inputClass}
            />
            <button
              type="button"
              aria-label="Show password"
              onClick={() => setIsNewPassOpen(!isNewPassOpen)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-lg text-slate-400 transition hover:text-slate-600 cursor-pointer"
            >
              {isNewPassOpen ? (
                <FiEyeOff className="text-blue-800" />
              ) : (
                <FiEye />
              )}
            </button>
          </Field>

          {isError && (
            <div
              role="alert"
              className="m-2 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <FiAlertCircle className="mt-0.5 shrink-0 text-lg text-red-500" />

              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">
                  Login failed
                </p>
                <p className="mt-0.5 text-sm text-red-600">
                  {error.response?.data.message}
                </p>
              </div>
            </div>
          )}

          {/* Hint */}
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500 ring-1 ring-slate-100">
            Use at least 8 characters with an uppercase letter, a lowercase
            letter, a number, and a special character.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Update password
                <FiArrowRight className="transition group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
