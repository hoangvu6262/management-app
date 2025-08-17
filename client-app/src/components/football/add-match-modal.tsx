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
import { CreateFootballMatchRequest, FootballMatchResponse, footballMatchService } from '@/services/footballMatchService'

// Money formatting utility
const formatMoney = (value: string | number): string => {
  const numStr = value.toString().replace(/[^\d]/g, '')
  if (!numStr) return ''
  return parseInt(numStr).toLocaleString('vi-VN')
}

const parseMoney = (formattedValue: string): number => {
  return parseInt(formattedValue.replace(/[^\d]/g, '') || '0')
}

interface AddFootballMatchModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (match: CreateFootballMatchRequest) => void
  match?: FootballMatchResponse | null
  onUpdate?: (id: string, match: CreateFootballMatchRequest) => void
}

interface FootballMatchFormData {
  date: string
  time: string
  stadium: string
  team: string
  matchNumber: number
  type: 'S5' | 'S7' | 'S11'
  totalRevenue: number
  totalCost: number
  recordingMoneyForPhotographer: number
  moneyForCameraman: number
  discount: number
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  note: string
}

export function AddFootballMatchModal({ 
  isOpen, 
  onClose, 
  onAdd,
  match,
  onUpdate
}: AddFootballMatchModalProps) {
  const isEditMode = !!match
  
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FootballMatchFormData>({
    defaultValues: {
      date: '',
      time: footballMatchService.getCurrentTime(),
      stadium: '',
      team: '',
      matchNumber: 1,
      type: 'S7',
      totalRevenue: 0,
      totalCost: 0,
      recordingMoneyForPhotographer: 0,
      moneyForCameraman: 0,
      discount: 0,
      status: 'PENDING',
      note: ''
    }
  })

  // Reset form when modal opens/closes or match changes
  useEffect(() => {
    if (isOpen) {
      if (match) {
        // Edit mode - populate form with match data
        reset({
          date: match.date.split('T')[0], // Convert to YYYY-MM-DD format
          time: match.time,
          stadium: match.stadium,
          team: match.team,
          matchNumber: match.matchNumber,
          type: match.type,
          totalRevenue: match.totalRevenue,
          totalCost: match.totalCost,
          recordingMoneyForPhotographer: match.recordingMoneyForPhotographer,
          moneyForCameraman: match.moneyForCameraman,
          discount: match.discount,
          status: match.status,
          note: match.note
        })
      } else {
        // Add mode - reset to defaults with current time
        const today = new Date().toISOString().split('T')[0]
        reset({
          date: today,
          time: footballMatchService.getCurrentTime(),
          stadium: '',
          team: '',
          matchNumber: 1,
          type: 'S7',
          totalRevenue: 0,
          totalCost: 0,
          recordingMoneyForPhotographer: 0,
          moneyForCameraman: 0,
          discount: 0,
          status: 'PENDING',
          note: ''
        })
      }
    }
  }, [isOpen, match, reset])

  const onSubmit = async (data: FootballMatchFormData) => {
    try {
      const formattedData: CreateFootballMatchRequest = {
        date: data.date,
        time: data.time,
        stadium: data.stadium,
        team: data.team,
        matchNumber: data.matchNumber,
        type: data.type,
        totalRevenue: Number(data.totalRevenue),
        totalCost: Number(data.totalCost),
        recordingMoneyForPhotographer: Number(data.recordingMoneyForPhotographer),
        moneyForCameraman: Number(data.moneyForCameraman),
        discount: Number(data.discount),
        status: data.status,
        note: data.note
      }

      if (isEditMode && match && onUpdate) {
        await onUpdate(match.id, formattedData)
      } else {
        await onAdd(formattedData)
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving match:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] flex flex-col">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle>
            {isEditMode ? 'Edit Football Match' : 'Add New Football Match'}
          </DialogTitle>
        </DialogHeader>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="football-match-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      placeholder="Select date"
                    />
                  )}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time (24-hour format)</Label>
                <Controller
                  name="time"
                  control={control}
                  rules={{ 
                    required: 'Time is required',
                    pattern: {
                      value: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                      message: 'Time must be in HH:mm format (24-hour)'
                    }
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="time"
                      placeholder="HH:mm"
                    />
                  )}
                />
                {errors.time && (
                  <p className="text-sm text-red-500">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stadium">Stadium</Label>
                <Controller
                  name="stadium"
                  control={control}
                  rules={{ required: 'Stadium is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter stadium name"
                    />
                  )}
                />
                {errors.stadium && (
                  <p className="text-sm text-red-500">{errors.stadium.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Controller
                  name="team"
                  control={control}
                  rules={{ required: 'Team is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter team name"
                    />
                  )}
                />
                {errors.team && (
                  <p className="text-sm text-red-500">{errors.team.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matchNumber">Match Number</Label>
                <Controller
                  name="matchNumber"
                  control={control}
                  rules={{ required: 'Match number is required', min: 1 }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder="1"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                {errors.matchNumber && (
                  <p className="text-sm text-red-500">{errors.matchNumber.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Type is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        {footballMatchService.getTypeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Financial Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalRevenue">Total Revenue (VND)</Label>
                  <Controller
                    name="totalRevenue"
                    control={control}
                    rules={{ min: 0 }}
                    render={({ field }) => (
                      <Input
                        value={formatMoney(field.value)}
                        placeholder="0"
                        onChange={(e) => {
                          const formatted = formatMoney(e.target.value)
                          field.onChange(parseMoney(formatted))
                        }}
                      />
                    )}
                  />
                  {errors.totalRevenue && (
                    <p className="text-sm text-red-500">{errors.totalRevenue.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalCost">Total Cost (VND)</Label>
                  <Controller
                    name="totalCost"
                    control={control}
                    rules={{ min: 0 }}
                    render={({ field }) => (
                      <Input
                        value={formatMoney(field.value)}
                        placeholder="0"
                        onChange={(e) => {
                          const formatted = formatMoney(e.target.value)
                          field.onChange(parseMoney(formatted))
                        }}
                      />
                    )}
                  />
                  {errors.totalCost && (
                    <p className="text-sm text-red-500">{errors.totalCost.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recordingMoneyForPhotographer">Recording Money (VND)</Label>
                  <Controller
                    name="recordingMoneyForPhotographer"
                    control={control}
                    rules={{ min: 0 }}
                    render={({ field }) => (
                      <Input
                        value={formatMoney(field.value)}
                        placeholder="0"
                        onChange={(e) => {
                          const formatted = formatMoney(e.target.value)
                          field.onChange(parseMoney(formatted))
                        }}
                      />
                    )}
                  />
                  {errors.recordingMoneyForPhotographer && (
                    <p className="text-sm text-red-500">{errors.recordingMoneyForPhotographer.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moneyForCameraman">Cameraman Money (VND)</Label>
                  <Controller
                    name="moneyForCameraman"
                    control={control}
                    rules={{ min: 0 }}
                    render={({ field }) => (
                      <Input
                        value={formatMoney(field.value)}
                        placeholder="0"
                        onChange={(e) => {
                          const formatted = formatMoney(e.target.value)
                          field.onChange(parseMoney(formatted))
                        }}
                      />
                    )}
                  />
                  {errors.moneyForCameraman && (
                    <p className="text-sm text-red-500">{errors.moneyForCameraman.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (VND)</Label>
                <Controller
                  name="discount"
                  control={control}
                  rules={{ min: 0 }}
                  render={({ field }) => (
                    <Input
                      value={formatMoney(field.value)}
                      placeholder="0"
                      onChange={(e) => {
                        const formatted = formatMoney(e.target.value)
                        field.onChange(parseMoney(formatted))
                      }}
                    />
                  )}
                />
                {errors.discount && (
                  <p className="text-sm text-red-500">{errors.discount.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Notes</Label>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Additional notes (optional)"
                  />
                )}
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="football-match-form" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Match' : 'Add Match')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
