import type { Todo, ScoredTodo } from '../types'

function parseDateLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function getDaysUntilDue(dueDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = parseDateLocal(dueDate)
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function calcUrgencyScore(dueDate?: string): number {
  if (!dueDate) return 0
  const days = getDaysUntilDue(dueDate)
  if (days < 0) return 40
  if (days === 0) return 35
  if (days <= 3) return 25
  if (days <= 7) return 15
  if (days <= 14) return 8
  return 2
}

function calcPriorityScore(p?: string): number {
  return p === 'A' ? 30 : p === 'B' ? 20 : p === 'C' ? 10 : 0
}

function calcImportanceScore(i?: string): number {
  return i === 'A' ? 30 : i === 'B' ? 20 : i === 'C' ? 10 : 0
}

function getQuadrant(todo: Todo): ScoredTodo['quadrant'] {
  const isUrgent =
    todo.priority === 'A' ||
    todo.priority === 'B' ||
    (todo.dueDate !== undefined && getDaysUntilDue(todo.dueDate) <= 7)
  const isImportant = todo.importance === 'A' || todo.importance === 'B'
  if (isUrgent && isImportant) return 'critical'
  if (!isUrgent && isImportant) return 'important'
  if (isUrgent && !isImportant) return 'urgent'
  return 'normal'
}

function buildReason(todo: Todo): string {
  const parts: string[] = []
  if (todo.dueDate) {
    const days = getDaysUntilDue(todo.dueDate)
    if (days < 0) parts.push(`期限${Math.abs(days)}日超過`)
    else if (days === 0) parts.push('今日が期限')
    else parts.push(`あと${days}日で期限`)
  }
  if (todo.priority) parts.push(`優先順位${todo.priority}`)
  if (todo.importance) parts.push(`重要度${todo.importance}`)
  return parts.join(' · ') || '未設定'
}

export function suggestOrder(todos: Todo[]): ScoredTodo[] {
  return todos
    .filter(t => !t.completed)
    .map(todo => ({
      ...todo,
      score:
        calcUrgencyScore(todo.dueDate) +
        calcPriorityScore(todo.priority) +
        calcImportanceScore(todo.importance),
      rank: 0,
      quadrant: getQuadrant(todo),
      reason: buildReason(todo),
    }))
    .sort((a, b) => b.score - a.score)
    .map((todo, i) => ({ ...todo, rank: i + 1 }))
}

export function getDueDateStatus(dueDate: string): 'overdue' | 'today' | 'soon' | 'normal' {
  const days = getDaysUntilDue(dueDate)
  if (days < 0) return 'overdue'
  if (days === 0) return 'today'
  if (days <= 3) return 'soon'
  return 'normal'
}

export function formatDueDateLabel(dueDate: string): string {
  const days = getDaysUntilDue(dueDate)
  if (days < 0) return `${Math.abs(days)}日超過`
  if (days === 0) return '今日'
  if (days <= 14) return `${days}日後`
  const [, m, d] = dueDate.split('-')
  return `${parseInt(m)}/${parseInt(d)}`
}
