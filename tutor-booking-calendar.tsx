"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Menu, GraduationCap, Users, Calendar, Clock } from "lucide-react"
import CalendarHeader from "./components/calendar-header"
import CalendarGrid from "./components/calendar-grid"
import BookingModal from "./components/booking-modal"
import type { TimeSlot, BookingFormData, ViewMode } from "./types/calendar"
import { generateInitialSlots } from "./data/initial-data"
import { addWeeks, subWeeks, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nnit-frontend-task.vercel.app';

export default function TutorBookingCalendar() {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("student")
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [lastBooking, setLastBooking] = useState<string>("")
  const [isHowToBookModalOpen, setIsHowToBookModalOpen] = useState(false);

  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => addWeeks(prev, 1));
  };

  const handleTodayClick = () => {
    setCurrentWeek(new Date());
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(`${API_URL}/api/slots`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Ensure data is an array
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        setSlots(data);
      } catch (error) {
        console.error("Could not fetch slots:", error);
        // Fallback to initial data if API fails
        const initialData = generateInitialSlots(currentWeek);
        setSlots(initialData);
        toast.error('Could not fetch slots. Using default data.');
      }
    };
    fetchSlots();
  }, [currentWeek]);

  // Calculate statistics with null check
  const stats = useMemo(() => {
    if (!Array.isArray(slots)) {
      return { total: 0, available: 0, booked: 0 };
    }
    const total = slots.length;
    const available = slots.filter((slot) => slot.isAvailable).length;
    const booked = total - available;
    return { total, available, booked };
  }, [slots]);

  const handleSlotClick = (day: string, time: string) => {
    const slot = slots.find((s) => s.day === day && s.time === time)
    if (slot && slot.isAvailable && viewMode === "student") {
      setSelectedSlot(slot)
      setIsBookingModalOpen(true)
    }
  }

  const handleConfirmBooking = async (formData: BookingFormData) => {
    if (!selectedSlot) return

    const bookingId = `booking-${Date.now()}-${Math.random()}`

    // Create the updated slot object
    const updatedSlot = {
      ...selectedSlot,
      isAvailable: false,
      booking: {
        studentName: formData.studentName,
        subject: formData.subject,
        bookingId,
      },
    };

    // Update local state immediately
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === updatedSlot.id ? updatedSlot : slot,
      ),
    )

    // Persist booking to API
    try {
      const response = await fetch(`${API_URL}/api/slots/${updatedSlot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSlot),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Could not save booking:", error);
      toast.error('Failed to save booking. Please try again.');
    }

    setLastBooking(`${formData.studentName} - ${selectedSlot.day} at ${selectedSlot.time}`)
    setIsBookingModalOpen(false)
    setSelectedSlot(null)
    toast.success('Booking successful!');
  }

  const handleCloseModal = () => {
    setIsBookingModalOpen(false)
    setSelectedSlot(null)
  }

  const handleHowToBookClick = () => {
    setIsHowToBookModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold text-gray-900">Tutor Calendar</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-5 flex flex-col space-y-2">
                <Button
                  variant={viewMode === "student" ? "default" : "ghost"}
                  onClick={() => setViewMode("student")}
                  className="justify-start w-full"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Student View
                </Button>
                <Button
                  variant={viewMode === "tutor" ? "default" : "ghost"}
                  onClick={() => setViewMode("tutor")}
                  className="justify-start w-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Tutor View
                </Button>
                <Button variant="ghost" className="justify-start">Dashboard</Button>
                <Button variant="ghost" className="justify-start">My Bookings</Button>
                <Button variant="ghost" className="justify-start">Profile</Button>
                <Button variant="ghost" className="justify-start">Settings</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Calendar Header - Desktop */}
        <div className="hidden lg:block">
          <CalendarHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalSlots={stats.total}
            availableSlots={stats.available}
            bookedSlots={stats.booked}
            currentWeek={currentWeek}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onTodayClick={handleTodayClick}
            onHowToBookClick={handleHowToBookClick}
          />
        </div>

        {/* Cards for Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="flex items-center p-3 bg-purple-50">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Slots</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">This week</p>
            </div>
          </Card>
          <Card className="flex items-center p-3 bg-purple-50">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Slots</p>
              <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {stats.available}
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
              </p>
              <p className="text-xs text-gray-500">Ready to book</p>
            </div>
          </Card>
          {viewMode === "student" && (
            <Card className="flex items-center p-3 bg-red-50">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <Clock className="w-6 h-6" /> {/* Using Clock icon for consistency, can be changed if a 'booked' icon is available */}
              </div>
              <div>
                <p className="text-sm text-gray-600">Booked Slots</p>
                <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {stats.booked}
                  <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                </p>
                <p className="text-xs text-gray-500">Booked this week</p>
              </div>
            </Card>
          )}
        </div>

        {/* Calendar Grid */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <CalendarGrid slots={slots} viewMode={viewMode} onSlotClick={handleSlotClick} currentWeek={currentWeek} />
          </CardContent>
        </Card>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseModal}
          selectedSlot={selectedSlot}
          onConfirmBooking={handleConfirmBooking}
        />

        {/* How to Book Dialog */}
        <Dialog open={isHowToBookModalOpen} onOpenChange={setIsHowToBookModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>How to Book a Slot</DialogTitle>
              <DialogDescription>
                Follow these simple steps to book your tutoring session.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm text-gray-600">
              <p>1. Ensure you are in <strong>Student View</strong>.</p>
              <p>2. Click on any <strong>available (green)</strong> time slot on the calendar grid.</p>
              <p>3. A booking modal will appear. Enter your <strong>student name</strong> and select the <strong>subject</strong>.</p>
              <p>4. Click the <strong>"Confirm Booking"</strong> button.</p>
              <p>5. You will receive a <strong>"Booking successful!"</strong> toast notification.</p>
              <p>6. The booked slot will now appear as <strong>red</strong> and show <strong>"Booked"</strong>.</p>
            </div>
            <Button onClick={() => setIsHowToBookModalOpen(false)}>Got it!</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
