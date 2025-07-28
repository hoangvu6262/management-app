'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Clock, MapPin, Users } from 'lucide-react'

export default function SchedulePage() {
  const scheduleItems = [
    {
      id: 1,
      title: 'Team Meeting',
      time: '10:00 AM',
      date: '13 Dec, 2023',
      location: 'Office Meeting Room',
      attendees: ['John Doe', 'Sarah Wilson', 'Mike Johnson'],
      type: 'meeting',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Client Presentation',
      time: '2:00 PM',
      date: '13 Dec, 2023',
      location: 'Client Office',
      attendees: ['Emma Davis', 'David Brown'],
      type: 'presentation',
      color: 'bg-purple-500'
    },
    {
      id: 3,
      title: 'Project Review',
      time: '4:30 PM',
      date: '14 Dec, 2023',
      location: 'Conference Room A',
      attendees: ['Alex Smith', 'Lisa Chen', 'Tom Wilson'],
      type: 'review',
      color: 'bg-orange-500'
    },
    {
      id: 4,
      title: 'Training Session',
      time: '9:00 AM',
      date: '15 Dec, 2023',
      location: 'Training Room',
      attendees: ['All Team Members'],
      type: 'training',
      color: 'bg-green-500'
    }
  ]

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'Meeting'
      case 'presentation':
        return 'Presentation'
      case 'review':
        return 'Review'
      case 'training':
        return 'Training'
      default:
        return 'Event'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Manage your upcoming appointments and meetings</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {scheduleItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`} />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <span className="text-xs px-2 py-1 bg-muted rounded-full">
                  {getTypeLabel(item.type)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{item.time} - {item.date}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{item.attendees.length} attendees</span>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">Attendees:</p>
                <div className="flex flex-wrap gap-1">
                  {item.attendees.map((attendee, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                    >
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Schedule Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium">Team Meeting</p>
                  <p className="text-sm text-muted-foreground">10:00 AM - Office Meeting Room</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Join
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <div>
                  <p className="font-medium">Client Presentation</p>
                  <p className="text-sm text-muted-foreground">2:00 PM - Client Office</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
