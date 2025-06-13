import type { TimeSlot, CalendarDay } from "../types/calendar"
import { addDays, format, startOfWeek } from "date-fns";

export const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]

export const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Computer Science",
  "Economics",
]

// Generate initial time slots with some pre-booked sessions
export const generateInitialSlots = (startDate: Date): TimeSlot[] => {
  let slots: TimeSlot[] = []
  const startOfCurrentWeek = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday

  const weekDays: CalendarDay[] = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      name: format(date, "EEE"),
      fullName: format(date, "EEEE"),
      date: format(date, "MMM d"),
    };
  });

  // Generate all possible slots as initially available
  weekDays.forEach((day) => {
    timeSlots.forEach((time) => {
      const id = `${day.fullName.toLowerCase()}-${time.replace(/[:\s]/g, "").toLowerCase()}`;
      slots.push({
        id,
        day: day.fullName,
        time,
        isAvailable: true,
      });
    });
  });

  // Define pre-existing bookings (purple slots)
  const preBookings = [
    { dayOfWeek: "Monday", time: "10:00 AM", studentName: "Alice Johnson", subject: "Mathematics" },
    { dayOfWeek: "Tuesday", time: "2:00 PM", studentName: "Bob Smith", subject: "Physics" },
    { dayOfWeek: "Wednesday", time: "11:00 AM", studentName: "Carol Davis", subject: "Chemistry" },
    { dayOfWeek: "Thursday", time: "3:00 PM", studentName: "David Wilson", subject: "Biology" },
    { dayOfWeek: "Friday", time: "10:00 AM", studentName: "Emma Brown", subject: "English" },
  ];

  // Apply pre-existing bookings
  preBookings.forEach((booking) => {
    const targetDay = weekDays.find(d => d.fullName === booking.dayOfWeek);
    if (targetDay) {
      const id = `${targetDay.fullName.toLowerCase()}-${booking.time.replace(/[:\s]/g, "").toLowerCase()}`;
      const slotIndex = slots.findIndex((slot) => slot.id === id);
      if (slotIndex !== -1) {
        slots[slotIndex] = {
          ...slots[slotIndex],
          isAvailable: false,
          booking: {
            studentName: booking.studentName,
            subject: booking.subject,
            bookingId: `booking-${Date.now()}-${Math.random()}`,
          },
        };
      }
    }
  });

  // Define unallotted white slots
  const unallottedWhiteSlots = [
    { dayOfWeek: "Monday", time: "9:00 AM" },
    { dayOfWeek: "Wednesday", time: "1:00 PM" },
    { dayOfWeek: "Friday", time: "4:00 PM" },
    { dayOfWeek: "Saturday", time: "10:00 AM" },
    { dayOfWeek: "Sunday", time: "12:00 PM" },
  ];

  // Apply unallotted white slots
  unallottedWhiteSlots.forEach((unallotted) => {
    const targetDay = weekDays.find(d => d.fullName === unallotted.dayOfWeek);
    if (targetDay) {
      const id = `${targetDay.fullName.toLowerCase()}-${unallotted.time.replace(/[:\s]/g, "").toLowerCase()}`;
      const slotIndex = slots.findIndex((slot) => slot.id === id);
      if (slotIndex !== -1) {
        slots[slotIndex] = {
          ...slots[slotIndex],
          isAvailable: false, // Mark as unavailable
          booking: undefined, // Explicitly ensure no booking for white slots
        };
      }
    }
  });

  return slots;
}
