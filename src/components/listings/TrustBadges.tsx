import { Shield, CheckCircle, Award, Clock, Calendar, FileCheck } from "lucide-react";

interface TrustBadgesProps {
  isVerified: boolean;
  licenseNumber?: string;
  yearEstablished?: number;
  responseTime?: string;
  tier: string;
}

export default function TrustBadges({
  isVerified,
  licenseNumber,
  yearEstablished,
  responseTime = "within 2 hours",
  tier,
}: TrustBadgesProps) {
  const isPremium = tier === "premium" || tier === "elite";
  const yearsInBusiness = yearEstablished
    ? new Date().getFullYear() - yearEstablished
    : null;

  return (
    <div className="flex flex-wrap gap-2">
      {isVerified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
          <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Verified Business
        </span>
      )}
      {licenseNumber && (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
          <FileCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Licensed ({licenseNumber})
        </span>
      )}
      {yearsInBusiness && yearsInBusiness > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 border border-purple-200">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {yearsInBusiness}+ Years in Business
        </span>
      )}
      {isPremium && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200">
          <Award className="h-3.5 w-3.5" aria-hidden="true" />
          Top Rated
        </span>
      )}
      {isPremium && (
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 border border-sky-200">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Responds {responseTime}
        </span>
      )}
      {isPremium && (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
          <Shield className="h-3.5 w-3.5" aria-hidden="true" />
          Insured
        </span>
      )}
    </div>
  );
}
