"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Users, GraduationCap, HelpCircle } from "lucide-react"
import type { ViewMode } from "../types/calendar"
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, isSameDay } from "date-fns"

interface CalendarHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  totalSlots: number
  availableSlots: number
  bookedSlots: number
  currentWeek: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onTodayClick: () => void;
  onHowToBookClick: () => void;
}

export default function CalendarHeader({
  viewMode,
  onViewModeChange,
  totalSlots,
  availableSlots,
  bookedSlots,
  currentWeek,
  onPreviousWeek,
  onNextWeek,
  onTodayClick,
  onHowToBookClick,
}: CalendarHeaderProps) {

  const formattedMonthYear = format(currentWeek, "MMMM yyyy");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
            <span className="leading-tight">Tutor Booking Calendar</span>
            <Button variant="ghost" size="icon" onClick={onHowToBookClick} className="ml-auto sm:ml-4">
              <HelpCircle className="w-5 h-5 text-gray-500" />
            </Button>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
            {viewMode === "student"
              ? "Book your tutoring sessions with available time slots"
              : "Manage your tutoring schedule and view bookings"}
          </p>
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-2">
          <Button
            variant={viewMode === "student" ? "default" : "outline"}
            onClick={() => onViewModeChange("student")}
            className={`w-full sm:w-auto ${viewMode === "student" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Student View
          </Button>
          <Button
            variant={viewMode === "tutor" ? "default" : "outline"}
            onClick={() => onViewModeChange("tutor")}
            className={`w-full sm:w-auto ${viewMode === "tutor" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
          >
            <Users className="w-4 h-4 mr-2" />
            Tutor View
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{formattedMonthYear}</h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="p-2" onClick={onPreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Previous week</span>
            </Button>
            <Button variant="outline" size="sm" className="p-2" onClick={onNextWeek}>
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Next week</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-end">
          <Button variant="outline" size="sm" className="px-4" onClick={onTodayClick}>
            Today
          </Button>
        </div>
      </div>
    </div>
  )
}
