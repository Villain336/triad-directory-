import { BusinessHours } from "@/types/listing";

interface OpenStatusProps {
  hours?: BusinessHours;
}

function getCurrentDayAndTime(): { day: string; hour: number; minute: number } {
  const now = new Date();
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return {
    day: days[now.getDay()],
    hour: now.getHours(),
    minute: now.getMinutes(),
  };
}

function parseTime(timeStr: string): { hour: number; minute: number } | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return { hour, minute };
}

export default function OpenStatus({ hours }: OpenStatusProps) {
  if (!hours) return null;

  const { day, hour, minute } = getCurrentDayAndTime();
  const todayHours = hours[day as keyof BusinessHours];

  if (!todayHours || todayHours === "Closed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
        <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
        Closed
      </span>
    );
  }

  if (todayHours === "Emergency Only" || todayHours === "24 Hours") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
        {todayHours}
      </span>
    );
  }

  const parts = todayHours.split(" - ");
  if (parts.length !== 2) return null;

  const open = parseTime(parts[0].trim());
  const close = parseTime(parts[1].trim());
  if (!open || !close) return null;

  const currentMinutes = hour * 60 + minute;
  const openMinutes = open.hour * 60 + open.minute;
  const closeMinutes = close.hour * 60 + close.minute;

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  if (isOpen) {
    const minutesUntilClose = closeMinutes - currentMinutes;
    const closingSoon = minutesUntilClose <= 60;
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-sm font-medium ${
          closingSoon ? "text-amber-600" : "text-green-600"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            closingSoon ? "bg-amber-500" : "bg-green-500 animate-pulse"
          }`}
          aria-hidden="true"
        />
        {closingSoon ? `Closes soon (${todayHours})` : `Open now (${todayHours})`}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
      <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
      Closed &middot; Opens {parts[0]}
    </span>
  );
}
