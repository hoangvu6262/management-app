import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import { CreateCalendarEventRequest, CalendarEventResponse, calendarEventService } from '@/services/calendarEventService'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (event: CreateCalendarEventRequest) => void
  selectedDate?: string
  event?: CalendarEventResponse | null
  onUpdate?: (id: string, event: CreateCalendarEventRequest) => void
  onDelete?: (id: string) => void
}

interface EventFormData {
  title: string
  description: string
  date: string
  time: string
  type: 'meeting' | 'task' | 'reminder' | 'other'
  color: string
}

const typeColors = {
  meeting: '#3B82F6',
  task: '#F59E0B',
  reminder: '#EF4444',
  other: '#8B5CF6'
}

export function CreateEventModal({ 
  isOpen, 
  onClose, 
  onAdd,
  selectedDate,
  event,
  onUpdate,
  onDelete
}: CreateEventModalProps) {
  const isEditMode = !!event
  
  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<EventFormData>({
    defaultValues: {
      title: '',
      description: '',
      date: selectedDate || '',
      time: '',
      type: 'meeting',
      color: typeColors.meeting
    }
  })

  const watchedType = watch('type')

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Edit mode - populate form with event data
        reset({
          title: event.title,
          description: event.description,
          date: event.date.split('T')[0], // Convert to YYYY-MM-DD format
          time: calendarEventService.convertTimeSpanToTime(event.time),
          type: event.type as 'meeting' | 'task' | 'reminder' | 'other',
          color: event.color
        })
      } else {
        // Add mode - reset to defaults
        reset({
          title: '',
          description: '',
          date: selectedDate || '',
          time: '',
          type: 'meeting',
          color: typeColors.meeting
        })
      }
    }
  }, [isOpen, event, selectedDate, reset])

  // Update color when type changes (only in add mode)
  useEffect(() => {
    if (!isEditMode && watchedType) {
      setValue('color', typeColors[watchedType])
    }
  }, [watchedType, isEditMode, setValue])

  const onSubmit = async (data: EventFormData) => {
    try {
      const formattedData: CreateCalendarEventRequest = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        type: data.type,
        color: data.color || typeColors[data.type]
      }

      if (isEditMode && event && onUpdate) {
        await onUpdate(event.id, formattedData)
      } else {
        await onAdd(formattedData)
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleDelete = async () => {
    if (event && onDelete) {
      await onDelete(event.id)
      onClose()
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const colorOptions = [
    { value: '#3B82F6', label: 'Blue', name: 'blue' },
    { value: '#F59E0B', label: 'Orange', name: 'orange' },
    { value: '#EF4444', label: 'Red', name: 'red' },
    { value: '#8B5CF6', label: 'Purple', name: 'purple' },
    { value: '#10B981', label: 'Green', name: 'green' },
    { value: '#F97316', label: 'Dark Orange', name: 'dark-orange' },
    { value: '#6366F1', label: 'Indigo', name: 'indigo' },
    { value: '#EC4899', label: 'Pink', name: 'pink' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isEditMode ? 'Edit Event' : 'Create an Event'}
            </DialogTitle>
            {isEditMode && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter event title"
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Event description (optional)"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                  />
                )}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Controller
                name="time"
                control={control}
                rules={{ required: 'Time is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="time"
                  />
                )}
              />
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: field.value }}
                  />
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color.value }}
                            />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Event' : 'Create Event')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
