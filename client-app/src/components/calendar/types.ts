export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string
  time: string
  type: 'meeting' | 'task' | 'reminder' | 'other'
  color: string
}

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync',
    date: '2023-12-02',
    time: '10:00',
    type: 'meeting',
    color: '#3B82F6'
  },
  {
    id: '2',
    title: 'Project Review',
    description: 'Review project progress',
    date: '2023-12-05',
    time: '14:00',
    type: 'meeting',
    color: '#8B5CF6'
  },
  {
    id: '3',
    title: 'Design Workshop',
    description: 'UI/UX design session',
    date: '2023-12-10',
    time: '09:00',
    type: 'task',
    color: '#F59E0B'
  }
]
