export interface TimeSlot {
  id: string
  day: string
  time: string
  isAvailable: boolean
  booking?: {
    studentName: string
    subject: string
    bookingId: string
  }
}

export interface BookingFormData {
  studentName: string
  subject: string
}

export type ViewMode = "student" | "tutor"

export interface CalendarDay {
  name: string
  fullName: string
  date: string
}
