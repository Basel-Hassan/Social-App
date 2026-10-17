import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FiAlertCircle } from "react-icons/fi";

interface fieldTypes {
label: string;
htmlFor: string;
icon: IconType;
children: ReactNode;
error?: string;
}

export default function Field({ label, htmlFor, icon: Icon, children, error }: fieldTypes) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
        {children}
      </div>
      {error && (
        <p
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <FiAlertCircle className="shrink-0 text-sm" />
          {error}
        </p>
      )}
    </div>
  );
}
  
