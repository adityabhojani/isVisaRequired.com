import { useState } from "react";
import {
  CheckCircle2, AlertCircle, Info, Clock, ChevronDown, ChevronUp,
  Syringe, CreditCard, FileText, Plane, ShieldCheck, Globe,
} from "lucide-react";
import type { EntryRules, RequirementLevel } from "@/data/entryRequirements";

interface Props {
  countryName: string;
  countryFlag: string;
  rules: EntryRules;
  hasSpecific: boolean;
}

function LevelBadge({ level }: { level: RequirementLevel }) {
  if (level === "required") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
        <AlertCircle className="h-3 w-3" />
        Required
      </span>
    );
  }
  if (level === "recommended") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
        <Info className="h-3 w-3" />
        Recommended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
      <CheckCircle2 className="h-3 w-3" />
      Not required
    </span>
  );
}

interface RowProps {
  icon: React.ElementType;
  label: string;
  level: RequirementLevel;
  detail?: string;
  note?: string;
}

function CheckRow({ icon: Icon, label, level, detail, note }: RowProps) {
  const borderCls =
    level === "required"
      ? "border-red-100"
      : level === "recommended"
      ? "border-amber-100"
      : "border-green-100";

  return (
    <div className={`flex items-start gap-3 py-3 border-b ${borderCls} last:border-0`}>
      <div className="w-7 h-7 rounded-lg bg-secondary/70 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <LevelBadge level={level} />
        </div>
        {detail && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{detail}</p>}
        {note && <p className="text-xs text-primary/80 mt-0.5 font-medium">{note}</p>}
      </div>
    </div>
  );
}

export function EntryChecklist({ countryName, countryFlag, rules, hasSpecific }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              Entry Requirements for {countryFlag} {countryName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Passport validity · return ticket · insurance · vaccinations
              {rules.preAuth ? ` · ${rules.preAuth.name}` : ""}
            </p>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border">
          <div className="mt-4 space-y-0">
            {/* Passport validity */}
            <CheckRow
              icon={Globe}
              label="Passport validity"
              level="required"
              detail={rules.passportValidity}
            />

            {/* Return / onward ticket */}
            <CheckRow
              icon={Plane}
              label="Return / onward ticket"
              level={rules.returnTicket}
              detail={rules.returnTicketNote}
            />

            {/* Proof of funds */}
            <CheckRow
              icon={CreditCard}
              label="Proof of sufficient funds"
              level={rules.proofOfFunds}
              detail={rules.proofOfFundsNote}
            />

            {/* Travel insurance */}
            <CheckRow
              icon={ShieldCheck}
              label="Travel insurance"
              level={rules.travelInsurance}
              detail={rules.travelInsuranceNote}
            />

            {/* Pre-travel authorization */}
            {rules.preAuth && (
              <CheckRow
                icon={FileText}
                label={rules.preAuth.name}
                level="required"
                detail={`Applies to: ${rules.preAuth.applies}`}
                note={
                  rules.preAuth.fee
                    ? `Fee: ${rules.preAuth.fee}${rules.preAuth.url ? " · Apply online before travel" : ""}`
                    : undefined
                }
              />
            )}

            {/* Vaccinations */}
            {rules.vaccinations.map((v) => (
              <CheckRow
                key={v.name}
                icon={Syringe}
                label={v.name}
                level={v.level}
                detail={v.detail}
              />
            ))}

            {/* Notes */}
            {rules.notes && rules.notes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <button
                  onClick={() => setNotesOpen((o) => !o)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2"
                >
                  <Info className="h-3.5 w-3.5" />
                  {notesOpen ? "Hide" : "Show"} important notes ({rules.notes.length})
                  {notesOpen ? <ChevronUp className="h-3 w-3 ml-0.5" /> : <ChevronDown className="h-3 w-3 ml-0.5" />}
                </button>
                {notesOpen && (
                  <ul className="space-y-1.5">
                    {rules.notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0 mt-1.5" />
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Pre-auth link */}
            {rules.preAuth?.url && (
              <div className="mt-3 pt-3 border-t border-border">
                <a
                  href={rules.preAuth.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Apply for {rules.preAuth.name} →
                </a>
              </div>
            )}
          </div>

          {!hasSpecific && (
            <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border flex items-start gap-1.5">
              <Clock className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              These are general requirements. Always verify with the official embassy or consulate of {countryName} before travel.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
