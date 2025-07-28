import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react"
import { CreateEventModal } from './create-event-modal'
import { useCalendarEventsForView, calendarEventMutations } from '@/hooks/useCalendarEvents'
import { calendarEventService, CalendarEventResponse } from '@/services/calendarEventService'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [editingEvent, setEditingEvent] = useState<CalendarEventResponse | null>(null)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  // Fetch events using SWR
  const { data: events, error, isLoading, mutateAll } = useCalendarEventsForView()

  // Check for small screen
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleAddEvent = async (eventData: any) => {
    try {
      await calendarEventMutations.create(eventData)
      setIsCreateModalOpen(false)
      setSelectedDate('')
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  const handleUpdateEvent = async (id: string, eventData: any) => {
    try {
      await calendarEventMutations.update(id, eventData)
      setEditingEvent(null)
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await calendarEventMutations.delete(id)
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day)
    const dateString = clickedDate.toISOString().split('T')[0]
    setSelectedDate(dateString)
    setIsCreateModalOpen(true)
  }

  const handleEventClick = (event: CalendarEventResponse, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingEvent(event)
    setIsCreateModalOpen(true)
  }

  const getEventsForDate = (day: number): CalendarEventResponse[] => {
    if (!events) return []
    
    const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0]
    return events.filter(event => event.date.startsWith(dateString))
  }

  const renderCalendarDays = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 sm:h-24 border border-border"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day)
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentMonth && 
                     new Date().getFullYear() === currentYear

      days.push(
        <div
          key={day}
          className={`h-16 sm:h-24 border border-border p-1 cursor-pointer hover:bg-accent transition-colors ${
            isToday ? 'bg-primary/10' : ''
          }`}
          onClick={() => handleDateClick(day)}
        >
          <div className={`text-xs sm:text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, isSmallScreen ? 1 : 2).map(event => (
              <div
                key={event.id}
                className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                style={{ backgroundColor: event.color + '20', color: event.color }}
                onClick={(e) => handleEventClick(event, e)}
                title={`${event.title} - ${calendarEventService.formatTime(event.time)}`}
              >
                <span className="hidden sm:inline">{event.title}</span>
                <span className="sm:hidden">•</span>
              </div>
            ))}
            {dayEvents.length > (isSmallScreen ? 1 : 2) && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - (isSmallScreen ? 1 : 2)} more
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditingEvent(null)
    setSelectedDate('')
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading calendar events</p>
            <Button onClick={() => mutateAll()} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg sm:text-xl">
              {months[currentMonth]} {currentYear}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
              {/* Days of week header */}
              {daysOfWeek.map(day => (
                <div key={day} className="h-8 sm:h-12 border-b border-border bg-muted flex items-center justify-center font-medium text-xs sm:text-sm">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 2)}</span>
                </div>
              ))}
              {/* Calendar days */}
              {renderCalendarDays()}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddEvent}
        selectedDate={selectedDate}
        event={editingEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  )
}
