"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Check, Clock, User, BookOpen } from "lucide-react"

// Types
interface TimeSlot {
  id: string
  day: string
  time: string
  isAvailable: boolean
  booking?: {
    studentName: string
    subject: string
  }
}

interface BookingFormData {
  studentName: string
  subject: string
}

// Initial data
const initialTimeSlots: TimeSlot[] = [
  // Monday
  { id: "mon-8", day: "Monday", time: "8:00 AM", isAvailable: true },
  { id: "mon-9", day: "Monday", time: "9:00 AM", isAvailable: true },
  {
    id: "mon-10",
    day: "Monday",
    time: "10:00 AM",
    isAvailable: false,
    booking: { studentName: "Alice Johnson", subject: "Mathematics" },
  },
  { id: "mon-11", day: "Monday", time: "11:00 AM", isAvailable: true },
  { id: "mon-12", day: "Monday", time: "12:00 PM", isAvailable: true },

  // Tuesday
  { id: "tue-8", day: "Tuesday", time: "8:00 AM", isAvailable: true },
  {
    id: "tue-9",
    day: "Tuesday",
    time: "9:00 AM",
    isAvailable: false,
    booking: { studentName: "Bob Smith", subject: "Physics" },
  },
  { id: "tue-10", day: "Tuesday", time: "10:00 AM", isAvailable: true },
  { id: "tue-11", day: "Tuesday", time: "11:00 AM", isAvailable: true },
  { id: "tue-12", day: "Tuesday", time: "12:00 PM", isAvailable: true },

  // Wednesday
  { id: "wed-8", day: "Wednesday", time: "8:00 AM", isAvailable: true },
  { id: "wed-9", day: "Wednesday", time: "9:00 AM", isAvailable: true },
  { id: "wed-10", day: "Wednesday", time: "10:00 AM", isAvailable: true },
  {
    id: "wed-11",
    day: "Wednesday",
    time: "11:00 AM",
    isAvailable: false,
    booking: { studentName: "Carol Davis", subject: "Chemistry" },
  },
  { id: "wed-12", day: "Wednesday", time: "12:00 PM", isAvailable: true },

  // Thursday
  { id: "thu-8", day: "Thursday", time: "8:00 AM", isAvailable: true },
  { id: "thu-9", day: "Thursday", time: "9:00 AM", isAvailable: true },
  { id: "thu-10", day: "Thursday", time: "10:00 AM", isAvailable: true },
  { id: "thu-11", day: "Thursday", time: "11:00 AM", isAvailable: true },
  { id: "thu-12", day: "Thursday", time: "12:00 PM", isAvailable: true },

  // Friday
  { id: "fri-8", day: "Friday", time: "8:00 AM", isAvailable: true },
  { id: "fri-9", day: "Friday", time: "9:00 AM", isAvailable: true },
  {
    id: "fri-10",
    day: "Friday",
    time: "10:00 AM",
    isAvailable: false,
    booking: { studentName: "David Wilson", subject: "Biology" },
  },
  { id: "fri-11", day: "Friday", time: "11:00 AM", isAvailable: true },
  { id: "fri-12", day: "Friday", time: "12:00 PM", isAvailable: true },

  // Saturday
  { id: "sat-8", day: "Saturday", time: "8:00 AM", isAvailable: true },
  { id: "sat-9", day: "Saturday", time: "9:00 AM", isAvailable: true },
  { id: "sat-10", day: "Saturday", time: "10:00 AM", isAvailable: true },
  { id: "sat-11", day: "Saturday", time: "11:00 AM", isAvailable: true },
  { id: "sat-12", day: "Saturday", time: "12:00 PM", isAvailable: true },

  // Sunday
  { id: "sun-8", day: "Sunday", time: "8:00 AM", isAvailable: true },
  { id: "sun-9", day: "Sunday", time: "9:00 AM", isAvailable: true },
  { id: "sun-10", day: "Sunday", time: "10:00 AM", isAvailable: true },
  { id: "sun-11", day: "Sunday", time: "11:00 AM", isAvailable: true },
  { id: "sun-12", day: "Sunday", time: "12:00 PM", isAvailable: true },
]

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]
const daysOfWeek = [
  { name: "Mon", fullName: "Monday", date: "Jun 9" },
  { name: "Tue", fullName: "Tuesday", date: "Jun 10" },
  { name: "Wed", fullName: "Wednesday", date: "Jun 11" },
  { name: "Thu", fullName: "Thursday", date: "Jun 12" },
  { name: "Fri", fullName: "Friday", date: "Jun 13" },
  { name: "Sat", fullName: "Saturday", date: "Jun 14" },
  { name: "Sun", fullName: "Sunday", date: "Jun 15" },
]

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Computer Science"]

export default function CalendarInterface() {
  const [viewMode, setViewMode] = useState<"student" | "tutor">("student")
  const [slots, setSlots] = useState<TimeSlot[]>(initialTimeSlots)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [bookingForm, setBookingForm] = useState<BookingFormData>({ studentName: "", subject: "" })
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)

  const getSlotForDayAndTime = (day: string, time: string) => {
    return slots.find((slot) => slot.day === day && slot.time === time)
  }

  const handleSlotClick = (day: string, time: string) => {
    const slot = getSlotForDayAndTime(day, time)
    if (!slot || !slot.isAvailable) return

    if (viewMode === "student") {
      setSelectedSlot(slot)
      setIsBookingDialogOpen(true)
    }
  }

  const handleBooking = () => {
    if (!selectedSlot || !bookingForm.studentName || !bookingForm.subject) return

    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === selectedSlot.id
          ? {
              ...slot,
              isAvailable: false,
              booking: {
                studentName: bookingForm.studentName,
                subject: bookingForm.subject,
              },
            }
          : slot,
      ),
    )

    setBookingForm({ studentName: "", subject: "" })
    setSelectedSlot(null)
    setIsBookingDialogOpen(false)
  }

  const renderSlotContent = (day: string, time: string) => {
    const slot = getSlotForDayAndTime(day, time)
    if (!slot) return null

    if (slot.isAvailable) {
      return (
        <div className="flex items-center justify-center gap-1 text-green-600 text-sm">
          <Check className="w-3 h-3" />
          <span>Free</span>
        </div>
      )
    } else {
      if (viewMode === "tutor" && slot.booking) {
        return (
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-1 text-blue-600">
              <User className="w-3 h-3" />
              <span className="font-medium">{slot.booking.studentName}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-600">
              <BookOpen className="w-3 h-3" />
              <span>{slot.booking.subject}</span>
            </div>
          </div>
        )
      } else {
        return (
          <div className="flex items-center justify-center gap-1 text-red-500 text-sm">
            <Clock className="w-3 h-3" />
            <span>Booked</span>
          </div>
        )
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
          <p className="text-gray-600 mt-1">View and manage your weekly class schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={(value: "student" | "tutor") => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student View</SelectItem>
              <SelectItem value="tutor">Tutor View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Week View</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            {viewMode === "tutor" ? "Manage Schedule" : "Book Session"}
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">June 2025</h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Today
        </Button>
      </div>

      {/* Role Badge */}
      <div className="flex justify-center">
        <Badge variant={viewMode === "student" ? "default" : "secondary"} className="text-sm px-3 py-1">
          {viewMode === "student" ? "Student View" : "Tutor View"}
        </Badge>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b">
            <div className="p-4 font-medium text-gray-600 border-r">Time</div>
            {daysOfWeek.map((day) => (
              <div key={day.name} className="p-4 text-center border-r last:border-r-0">
                <div className="font-medium text-gray-900">{day.name}</div>
                <div className="text-sm text-gray-500 mt-1">{day.date}</div>
                {day.name === "Thu" && <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>}
              </div>
            ))}
          </div>

          {timeSlots.map((time, timeIndex) => (
            <div key={time} className={`grid grid-cols-8 ${timeIndex < timeSlots.length - 1 ? "border-b" : ""}`}>
              <div className="p-4 font-medium text-gray-600 border-r bg-gray-50">{time}</div>
              {daysOfWeek.map((day) => {
                const slot = getSlotForDayAndTime(day.fullName, time)
                const isClickable = viewMode === "student" && slot?.isAvailable

                return (
                  <div
                    key={`${day.name}-${time}`}
                    className={`p-4 border-r last:border-r-0 min-h-[80px] flex items-center justify-center ${
                      isClickable ? "cursor-pointer hover:bg-blue-50 transition-colors" : ""
                    } ${slot?.isAvailable ? "bg-green-50" : slot?.booking ? "bg-blue-50" : "bg-red-50"}`}
                    onClick={() => handleSlotClick(day.fullName, time)}
                  >
                    {renderSlotContent(day.fullName, time)}
                  </div>
                )
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Time Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected Slot:</strong> {selectedSlot?.day} at {selectedSlot?.time}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={bookingForm.studentName}
                onChange={(e) => setBookingForm((prev) => ({ ...prev, studentName: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={bookingForm.subject}
                onValueChange={(value) => setBookingForm((prev) => ({ ...prev, subject: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsBookingDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleBooking}
                disabled={!bookingForm.studentName || !bookingForm.subject}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
              <span className="text-sm">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
              <span className="text-sm">Unavailable</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
