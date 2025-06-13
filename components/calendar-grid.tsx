"use client"

import type { TimeSlot, ViewMode } from "../types/calendar"
import { timeSlots } from "../data/initial-data"
import { Check, Clock, User, BookOpen } from "lucide-react"
import { useState } from "react"
import { startOfWeek, endOfWeek, addDays, format, isToday } from "date-fns";
import { Badge } from "@/components/ui/badge"

interface CalendarGridProps {
  slots: TimeSlot[]
  viewMode: ViewMode
  onSlotClick: (day: string, time: string) => void
  currentWeek: Date;
}

export default function CalendarGrid({ slots, viewMode, onSlotClick, currentWeek }: CalendarGridProps) {
  const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  const [selectedDay, setSelectedDay] = useState<string>(format(start, "EEEE"));

  const getSlotForDayAndTime = (day: string, time: string): TimeSlot | undefined => {
    return slots.find((slot) => slot.day === day && slot.time === time)
  }

  const renderSlotContent = (day: string, time: string) => {
    const slot = getSlotForDayAndTime(day, time)
    if (!slot) return null

    if (slot.isAvailable) {
      return (
        <div className="flex items-center justify-center gap-1 sm:gap-2 text-gray-700 font-medium">
        </div>
      )
    } else {
      // Slot is not available
      if (slot.booking) {
        // Slot is booked
        if (viewMode === "tutor") {
          return (
            <div className="text-center space-y-1 px-1">
              <div className="flex items-center justify-center gap-1 text-blue-600 font-medium">
                <User className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="text-xs truncate">{slot.booking.studentName}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-purple-600">
                <BookOpen className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="text-xs truncate">{slot.booking.subject}</span>
              </div>
            </div>
          )
        } else {
          // Student view of a booked slot
          return (
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-red-600 font-medium">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Booked</span>
            </div>
          )
        }
      } else {
        // Slot is not available and not booked (white slot)
        return (
          <div className="flex items-center justify-center gap-1 sm:gap-2 text-gray-400 text-xs sm:text-sm font-medium">
            <span>Unavailable</span>
          </div>
        )
      }
    }
  }

  const getSlotClassName = (slot: TimeSlot | undefined) => {
    if (!slot) return "bg-white border-gray-200"

    const baseClasses =
      "p-2 sm:p-3 md:p-4 border-r border-b min-h-[60px] sm:min-h-[70px] md:min-h-[80px] flex items-center justify-center transition-all duration-200"

    if (slot.isAvailable) {
      const clickableClasses =
        viewMode === "student" ? "cursor-pointer hover:bg-green-200 hover:shadow-md active:bg-green-300" : ""
      return `${baseClasses} bg-green-100 border-green-300 ${clickableClasses}`
    } else {
      // Slot is not available
      if (slot.booking) {
        // Slot is booked
        const bookedClasses = viewMode === "student" ? "cursor-not-allowed bg-red-50 border-red-200" : "bg-purple-50 border-purple-200";
        return `${baseClasses} ${bookedClasses}`
      } else {
        // Slot is not available and not booked (white slot)
        return `${baseClasses} bg-white border-gray-200`
      }
    }
  }

  // Mobile view - show one day at a time
  const MobileView = () => (
    <div className="lg:hidden">
      {/* Day selector */}
      <div className="flex overflow-x-auto gap-2 p-4 bg-gray-50 border-b sticky top-0 z-10">
        {weekDays.map((date) => (
          <button
            key={format(date, "yyyy-MM-dd")}
            onClick={() => setSelectedDay(format(date, "EEEE"))}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDay === format(date, "EEEE") ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div>{format(date, "EEE")}</div>
            <div className="text-xs opacity-75">{format(date, "MMM d")}</div>
          </button>
        ))}
      </div>

      {/* Time slots for selected day */}
      <div className="space-y-2 p-4">
        {timeSlots.map((time) => {
          const slot = getSlotForDayAndTime(selectedDay, time)
          return (
            <div
              key={time}
              className={`flex items-center justify-between p-4 rounded-lg border-2 ${getSlotClassName(slot)} border-opacity-50`}
              onClick={() => {
                if (slot?.isAvailable && viewMode === "student") {
                  onSlotClick(selectedDay, time)
                }
              }}
            >
              <div className="font-medium text-gray-700">{time}</div>
              <div className="flex-1 ml-4">{renderSlotContent(selectedDay, time)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // Desktop view - full grid
  const DesktopView = () => (
    <div className="hidden lg:block bg-white rounded-lg shadow-lg">
      {/* Header Row */}
      <div className="grid grid-cols-8 bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-10">
        <div className="p-3 xl:p-4 font-semibold text-gray-700 border-r border-gray-300">Time</div>
        {weekDays.map((date) => (
          <div key={format(date, "yyyy-MM-dd")} className="p-3 xl:p-4 text-center border-r border-gray-300 last:border-r-0">
            <div className="font-semibold text-gray-900">{format(date, "EEE")}</div>
            <div className="text-sm text-gray-500 mt-1">{format(date, "MMM d")}</div>
            {isToday(date) && <Badge variant="default" className="mt-1">Today</Badge>}
          </div>
        ))}
      </div>

      {/* Time Slots Grid */}
      {timeSlots.map((time) => (
        <div key={time} className="grid grid-cols-8">
          <div className="p-3 xl:p-4 font-medium text-gray-600 bg-gray-50 border-r border-b border-gray-300">
            {time}
          </div>
          {weekDays.map((date) => {
            const slot = getSlotForDayAndTime(format(date, "EEEE"), time)
            return (
              <div
                key={`${format(date, "yyyy-MM-dd")}-${time}`}
                className={getSlotClassName(slot)}
                onClick={() => {
                  if (slot?.isAvailable && viewMode === "student") {
                    onSlotClick(format(date, "EEEE"), time)
                  }
                }}
              >
                {renderSlotContent(format(date, "EEEE"), time)}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )

  // Tablet view - simplified grid
  const TabletView = () => (
    <div className="hidden md:block lg:hidden bg-white rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className="grid grid-cols-8 bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-10">
            <div className="p-3 font-semibold text-gray-700 border-r border-gray-300">Time</div>
            {weekDays.map((date) => (
              <div key={format(date, "yyyy-MM-dd")} className="p-3 text-center border-r border-gray-300 last:border-r-0">
                <div className="font-semibold text-gray-900 text-sm">{format(date, "EEE")}</div>
                <div className="text-xs text-gray-500 mt-1">{format(date, "MMM d")}</div>
                {isToday(date) && <Badge variant="default" className="mt-1">Today</Badge>}
              </div>
            ))}
          </div>

          {/* Time Slots Grid */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8">
              <div className="p-3 font-medium text-gray-600 bg-gray-50 border-r border-b border-gray-300 text-sm">
                {time}
              </div>
              {weekDays.map((date) => {
                const slot = getSlotForDayAndTime(format(date, "EEEE"), time)
                return (
                  <div
                    key={`${format(date, "yyyy-MM-dd")}-${time}`}
                    className={getSlotClassName(slot)}
                    onClick={() => {
                      if (slot?.isAvailable && viewMode === "student") {
                        onSlotClick(format(date, "EEEE"), time)
                      }
                    }}
                  >
                    {renderSlotContent(format(date, "EEEE"), time)}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <MobileView />
      <TabletView />
      <DesktopView />
    </>
  )
}
