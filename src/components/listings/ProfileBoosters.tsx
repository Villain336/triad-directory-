import { Shield, Award, FileCheck, BadgeCheck, Star, Building } from "lucide-react";

interface Booster {
  id: string;
  booster_type: string;
  title: string;
  issuing_body?: string;
  credential_number?: string;
  issued_date?: string;
  expiry_date?: string;
  is_verified: boolean;
}

interface ProfileBoostersProps {
  boosters: Booster[];
  businessName: string;
}

const iconMap: Record<string, React.ElementType> = {
  license: FileCheck,
  certification: Award,
  membership: Building,
  insurance: Shield,
  award: Star,
  accreditation: BadgeCheck,
};

const colorMap: Record<string, string> = {
  license: "bg-blue-50 text-blue-700 border-blue-200",
  certification: "bg-green-50 text-green-700 border-green-200",
  membership: "bg-purple-50 text-purple-700 border-purple-200",
  insurance: "bg-emerald-50 text-emerald-700 border-emerald-200",
  award: "bg-amber-50 text-amber-700 border-amber-200",
  accreditation: "bg-sky-50 text-sky-700 border-sky-200",
};

export default function ProfileBoosters({ boosters, businessName }: ProfileBoostersProps) {
  if (!boosters || boosters.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-gray-900">
        Credentials & Qualifications
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Licenses, certifications, and memberships for {businessName}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {boosters.map((booster) => {
          const Icon = iconMap[booster.booster_type] || Shield;
          const color = colorMap[booster.booster_type] || "bg-gray-50 text-gray-700 border-gray-200";

          return (
            <div key={booster.id} className={`rounded-lg border p-4 ${color}`}>
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{booster.title}</h3>
                    {booster.is_verified && (
                      <BadgeCheck className="h-4 w-4 text-green-600 shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  {booster.issuing_body && (
                    <p className="text-xs mt-0.5 opacity-75">Issued by: {booster.issuing_body}</p>
                  )}
                  {booster.credential_number && (
                    <p className="text-xs mt-0.5 opacity-75">#{booster.credential_number}</p>
                  )}
                  <div className="flex gap-3 mt-1 text-xs opacity-60">
                    {booster.issued_date && (
                      <span>Issued: {new Date(booster.issued_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    )}
                    {booster.expiry_date && (
                      <span>Expires: {new Date(booster.expiry_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
