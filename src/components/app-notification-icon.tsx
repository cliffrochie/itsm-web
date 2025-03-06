import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function NotificationIcon({ count }: { count: number }) {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <Bell className="w-6 h-6 text-gray-700" />
      {count > 0 && (
        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {count}
        </Badge>
      )}
    </div>
  );
}