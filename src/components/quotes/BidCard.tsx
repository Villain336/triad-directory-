import { Building2, Clock, CheckCircle } from "lucide-react";

export interface Bid {
  id: string;
  quote_request_id: string;
  business_id: string | null;
  business_name: string;
  amount: number;
  message: string;
  estimated_timeline: string | null;
  status: string;
  created_at: string;
}

interface BidCardProps {
  bid: Bid;
  onAccept?: (bidId: string) => void;
  showAccept?: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BidCard({ bid, onAccept, showAccept = false }: BidCardProps) {
  const isAccepted = bid.status === "accepted";

  return (
    <article
      className={`card p-5 flex flex-col gap-4 ${
        isAccepted ? "ring-2 ring-green-400 border-green-300" : ""
      }`}
    >
      {isAccepted && (
        <div className="flex items-center gap-1.5 -mx-5 -mt-5 px-4 py-1.5 bg-green-50 border-b border-green-200 rounded-t-xl text-xs font-semibold text-green-700">
          <CheckCircle className="h-3.5 w-3.5" />
          Accepted Bid
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{bid.business_name}</p>
            <p className="text-xs text-gray-500">{formatDate(bid.created_at)}</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-gray-900">
            ${bid.amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500">bid amount</p>
        </div>
      </div>

      {bid.estimated_timeline && (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-gray-400 shrink-0" />
          <span>
            <span className="font-medium">Timeline:</span> {bid.estimated_timeline}
          </span>
        </div>
      )}

      <p className="text-sm text-gray-700 whitespace-pre-line">{bid.message}</p>

      {showAccept && !isAccepted && onAccept && (
        <button
          onClick={() => onAccept(bid.id)}
          className="btn-primary w-full gap-2 !py-2.5"
        >
          <CheckCircle className="h-4 w-4" />
          Accept Bid
        </button>
      )}
    </article>
  );
}
