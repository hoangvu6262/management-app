"use client";

import { Calendar } from "@/components/calendar/calendar";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage your schedule and events
        </p>
      </div>
      
      <Calendar />
    </div>
  );
}
