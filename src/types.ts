export type FilterType = 'all' | 'active' | 'completed'
export type Priority = 'A' | 'B' | 'C'
export type Importance = 'A' | 'B' | 'C'
export type ViewMode = 'list' | 'suggested'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  dueDate?: string
  priority?: Priority
  importance?: Importance
}

export interface ScoredTodo extends Todo {
  rank: number
  score: number
  quadrant: 'critical' | 'important' | 'urgent' | 'normal'
  reason: string
}

export interface AddTodoParams {
  text: string
  dueDate?: string
  priority?: Priority
  importance?: Importance
}

export interface EditTodoFields {
  text?: string
  dueDate?: string | null
  priority?: Priority | null
  importance?: Importance | null
}
