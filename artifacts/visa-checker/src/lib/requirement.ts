// One requirement vocabulary for the whole app. Semantic colour lives here
// and ONLY here; every consumer pairs the colour with the icon and the word,
// so status never depends on hue alone.
import { CheckCircle2, Clock, Shield, AlertCircle, XCircle } from "lucide-react";
import type { VisaRequirement } from "@workspace/api-client-react";

export const requirementOrder: VisaRequirement[] = [
  "visa_free", "visa_on_arrival", "e_visa", "visa_required", "no_admission",
];

export interface RequirementStyle {
  label: string; short: string; hint: string;
  color: string; bg: string; border: string; rail: string;
  icon: typeof CheckCircle2;
}

// Literal class strings so the Tailwind v4 scanner emits them.
export const reqConfig: Record<VisaRequirement, RequirementStyle> = {
  visa_free:       { label: "Visa Free",       short: "Visa free",  hint: "Stay limit varies — check on entry",       color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200",  rail: "before:bg-green-500",  icon: CheckCircle2 },
  visa_on_arrival: { label: "Visa on Arrival", short: "On arrival", hint: "Issued at the border",                    color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  rail: "before:bg-amber-500",  icon: Clock },
  e_visa:          { label: "eVisa",           short: "eVisa",      hint: "Apply online before you fly",             color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   rail: "before:bg-blue-500",   icon: Shield },
  visa_required:   { label: "Visa Required",   short: "Visa needed",hint: "Apply at an embassy before you fly",      color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", rail: "before:bg-orange-500", icon: AlertCircle },
  no_admission:    { label: "No Admission",    short: "No entry",   hint: "Entry not permitted",                     color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    rail: "before:bg-red-500",    icon: XCircle },
};
