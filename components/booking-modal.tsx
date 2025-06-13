"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TimeSlot, BookingFormData } from "../types/calendar"
import { subjects } from "../data/initial-data"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSlot: TimeSlot | null
  onConfirmBooking: (formData: BookingFormData) => void
}

export default function BookingModal({ isOpen, onClose, selectedSlot, onConfirmBooking }: BookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    studentName: "",
    subject: "",
  })
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSubjects, setFilteredSubjects] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.studentName && formData.subject) {
      onConfirmBooking(formData)
      setFormData({ studentName: "", subject: "" })
    }
  }

  const handleClose = () => {
    setFormData({ studentName: "", subject: "" })
    onClose()
  }

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: value,
    }));
    if (value.length > 0) {
      setFilteredSubjects(subjects.filter(subject =>
        subject.toLowerCase().includes(value.toLowerCase())
      ));
      setShowSuggestions(true);
    } else {
      setFilteredSubjects([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: subject,
    }));
    setShowSuggestions(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Book Time Slot</DialogTitle>
        </DialogHeader>

        {selectedSlot && (
          <div className="space-y-4 sm:space-y-6">
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Selected Time Slot</h3>
              <p className="text-blue-700 text-sm sm:text-base mt-1">
                {selectedSlot.day} at {selectedSlot.time}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentName" className="text-sm sm:text-base">
                  Student Name *
                </Label>
                <Input
                  id="studentName"
                  type="text"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      studentName: e.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                  className="text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="subject" className="text-sm sm:text-base">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  placeholder="Select or type a subject"
                  className="text-sm sm:text-base"
                  required
                />
                {showSuggestions && filteredSubjects.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                    {filteredSubjects.map((subject) => (
                      <li
                        key={subject}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm sm:text-base"
                        onMouseDown={() => handleSelectSubject(subject)}
                      >
                        {subject}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1 text-sm sm:text-base">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                  disabled={!formData.studentName || !formData.subject}
                >
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
