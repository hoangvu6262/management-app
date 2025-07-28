import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  color: "blue" | "orange" | "green" | "purple" | "pink";
  type: "Meeting" | "Task" | "Reminder";
}

interface CalendarProps {
  className?: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: new Date(2021, 11, 2), // December 2, 2021
    startTime: "09:00",
    endTime: "10:00",
    color: "pink",
    type: "Meeting",
  },
  {
    id: "2",
    title: "Project Review",
    date: new Date(2021, 11, 16), // December 16, 2021
    startTime: "14:00",
    endTime: "15:30",
    color: "orange",
    type: "Meeting",
  },
  {
    id: "3",
    title: "Design Sprint",
    date: new Date(2021, 11, 21), // December 21, 2021
    startTime: "10:00",
    endTime: "12:00",
    color: "purple",
    type: "Meeting",
  },
  {
    id: "4",
    title: "Client Call",
    date: new Date(2021, 11, 25), // December 25, 2021
    startTime: "16:00",
    endTime: "17:00",
    color: "blue",
    type: "Meeting",
  },
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type ViewType = "Month" | "Week" | "Day" | "Year";

export function Calendar({ className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2021, 11, 1)); // December 2021
  const [view, setView] = useState<ViewType>("Month");
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calendar navigation
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateYear = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  // Get calendar data
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonth.getDate() - i),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day),
      });
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-500 text-white",
      orange: "bg-orange-500 text-white",
      green: "bg-green-500 text-white",
      purple: "bg-purple-500 text-white",
      pink: "bg-pink-500 text-white",
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-500 text-white";
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-muted-foreground border border-gray-100"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.fullDate);
          const isToday =
            day.fullDate.toDateString() === new Date().toDateString();
          const isCurrentMonth = day.isCurrentMonth;

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                !isCurrentMonth ? "bg-gray-50" : "bg-white"
              }`}
              onClick={() => {
                setSelectedDate(day.fullDate);
                setIsCreateModalOpen(true);
              }}
            >
              <div
                className={`text-sm mb-2 inline-flex items-center justify-center w-7 h-7 rounded-full ${
                  isToday
                    ? "bg-blue-500 text-white font-semibold"
                    : !isCurrentMonth
                    ? "text-gray-400"
                    : "text-gray-900 hover:bg-gray-100"
                }`}
              >
                {day.date}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate ${getColorClasses(
                      event.color
                    )} cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent day click event
                      // Handle event click if needed
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearView = () => {
    const year = currentDate.getFullYear();
    const monthsGrid = [];

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const days = getDaysInMonth(monthDate);

      monthsGrid.push(
        <div key={month} className="border border-gray-200 rounded-lg p-3">
          <h3 className="font-medium text-sm mb-2 text-center">
            {months[month]} {year}
          </h3>
          <div className="grid grid-cols-7 gap-0.5">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div
                key={day}
                className="text-xs text-center text-gray-500 p-0.5"
              >
                {day}
              </div>
            ))}
            {days.slice(0, 35).map((day, index) => {
              const hasEvent = getEventsForDate(day.fullDate).length > 0;
              const isToday =
                day.fullDate.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  className={`text-xs text-center p-0.5 cursor-pointer hover:bg-gray-100 ${
                    !day.isCurrentMonth ? "text-gray-300" : ""
                  } ${isToday ? "bg-blue-500 text-white rounded" : ""}`}
                >
                  <div className={hasEvent ? "font-bold" : ""}>{day.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return <div className="grid grid-cols-3 gap-4">{monthsGrid}</div>;
  };

  const renderDayView = () => {
    const selectedDay = selectedDate || currentDate;
    const dayEvents = getEventsForDate(selectedDay);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="space-y-4">
        <div className="text-lg font-semibold">
          {selectedDay.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        <div className="grid grid-cols-1 gap-0">
          {hours.map((hour) => {
            const timeString = `${hour.toString().padStart(2, "0")}:00`;
            const eventAtThisHour = dayEvents.find((event) =>
              event.startTime?.startsWith(hour.toString().padStart(2, "0"))
            );

            return (
              <div
                key={hour}
                className="flex items-start space-x-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedDate(selectedDay);
                  // Set default time when creating event
                  setIsCreateModalOpen(true);
                }}
              >
                <div className="w-20 text-sm text-gray-500 font-medium">
                  {timeString}
                </div>
                <div className="flex-1 min-h-[40px]">
                  {eventAtThisHour && (
                    <div
                      className={`p-3 rounded-lg ${getColorClasses(
                        eventAtThisHour.color
                      )} cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent time slot click
                        // Handle event click if needed
                      }}
                    >
                      <div className="font-medium">{eventAtThisHour.title}</div>
                      <div className="text-sm opacity-90">
                        {eventAtThisHour.startTime} - {eventAtThisHour.endTime}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    // Get the start of the week for the current date
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-8 gap-2 bg-gray-50 p-2 rounded">
          <div></div> {/* Empty cell for time column */}
          {weekDates.map((date) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div key={date.toISOString()} className="text-center">
                <div className="text-sm font-medium text-gray-600">
                  {weekDays[date.getDay()]}
                </div>
                <div
                  className={`text-lg font-semibold mt-1 ${
                    isToday
                      ? "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                      : "text-gray-900"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 12 }, (_, hour) => {
            const timeHour = hour + 8; // Start from 8 AM
            const timeString = `${timeHour.toString().padStart(2, "0")}:00`;

            return (
              <div key={hour} className="contents">
                <div className="text-sm text-gray-500 py-4 text-center font-medium">
                  {timeString}
                </div>
                {weekDates.map((date) => {
                  const dayEvents = getEventsForDate(date).filter((event) =>
                    event.startTime?.startsWith(
                      timeHour.toString().padStart(2, "0")
                    )
                  );

                  return (
                    <div
                      key={`${date.toISOString()}-${hour}`}
                      className="border border-gray-100 py-4 min-h-[60px] hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedDate(date);
                        setIsCreateModalOpen(true);
                      }}
                    >
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-2 rounded-lg mb-1 mx-1 ${getColorClasses(
                            event.color
                          )} cursor-pointer`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent cell click
                            // Handle event click if needed
                          }}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="opacity-90">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          {/* Header with Create Schedule on left, View Toggle and Today on right */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Event
              </Button>
            </div>

            {/* View Toggle and Today button on the right */}
            <div className="flex items-center space-x-2">
              <div className="flex rounded-lg border">
                {(["Day", "Week", "Month", "Year"] as ViewType[]).map(
                  (viewType) => (
                    <Button
                      key={viewType}
                      variant={view === viewType ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setView(viewType)}
                      className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                    >
                      {viewType}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>
          </div>

          {/* Navigation centered below header */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                view === "Year" ? navigateYear("prev") : navigateMonth("prev")
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {view === "Year"
                ? currentDate.getFullYear()
                : `${
                    months[currentDate.getMonth()]
                  } ${currentDate.getFullYear()}`}
            </h2>

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                view === "Year" ? navigateYear("next") : navigateMonth("next")
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Content */}
          <div className="calendar-content">
            {view === "Month" && renderMonthView()}
            {view === "Year" && renderYearView()}
            {view === "Day" && renderDayView()}
            {view === "Week" && renderWeekView()}
          </div>
        </CardContent>
      </Card>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateEvent={(event) => {
          setEvents((prev) => [
            ...prev,
            { ...event, id: Date.now().toString() },
          ]);
          setIsCreateModalOpen(false);
        }}
        selectedDate={selectedDate}
      />
    </div>
  );
}

// Create Event Modal Component
interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: Omit<CalendarEvent, "id">) => void;
  selectedDate: Date | null;
}

function CreateEventModal({
  isOpen,
  onClose,
  onCreateEvent,
  selectedDate,
}: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"Meeting" | "Task" | "Reminder">("Meeting");
  const [color, setColor] = useState<
    "blue" | "orange" | "green" | "purple" | "pink"
  >("blue");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [date, setDate] = useState(selectedDate || new Date());

  // Update date when selectedDate changes
  React.useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onCreateEvent({
      title,
      type,
      color,
      date,
      startTime,
      endTime,
    });

    // Reset form
    setTitle("");
    setType("Meeting");
    setColor("blue");
    setStartTime("09:00");
    setEndTime("10:00");
  };

  const colorOptions = [
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "orange", label: "Orange", class: "bg-orange-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "pink", label: "Pink", class: "bg-pink-500" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create an Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            {["Meeting", "Task", "Reminder"].map((eventType) => (
              <Button
                key={eventType}
                variant={type === eventType ? "default" : "outline"}
                size="sm"
                onClick={() => setType(eventType as any)}
              >
                {eventType}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Clock className="h-4 w-4 text-gray-500" />
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-24"
            />
            <span>-</span>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-24"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex space-x-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-6 h-6 rounded-full ${option.class} ${
                    color === option.value
                      ? "ring-2 ring-offset-2 ring-gray-400"
                      : ""
                  }`}
                  onClick={() => setColor(option.value as any)}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Add Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
