"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { parseMonthYear, toMonthYearString } from "../../utils/dateUtils";

interface DateInputButtonProps {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const DateInputButton = React.forwardRef<
  HTMLButtonElement,
  DateInputButtonProps
>(({ value, onClick, placeholder, disabled }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    disabled={disabled}
    className="w-full h-10 px-3 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed cursor-pointer"
  >
    <span className={value ? "text-slate-800" : "text-slate-400"}>
      {value || placeholder}
    </span>
    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
  </button>
));
DateInputButton.displayName = "DateInputButton";

interface MonthYearPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select month",
}) => (
  <DatePicker
    selected={parseMonthYear(value)}
    onChange={(date: Date | null) => onChange(toMonthYearString(date))}
    showMonthYearPicker
    dateFormat="MMM yyyy"
    placeholderText={placeholder}
    maxDate={new Date()}
    disabled={disabled}
    customInput={<DateInputButton />}
    portalId="app-datepicker-portal"
    popperClassName="app-datepicker-popper"
    showPopperArrow={false}
    popperPlacement="bottom-start"
    popperProps={{ strategy: "fixed" }}
  />
);

export default MonthYearPicker;
