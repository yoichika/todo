import { useState, useCallback } from 'react'
import type { Todo, FilterType, AddTodoParams, EditTodoFields } from '../types'

const STORAGE_KEY = 'todos'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [filter, setFilter] = useState<FilterType>('all')

  const update = useCallback((next: Todo[]) => {
    setTodos(next)
    saveTodos(next)
  }, [])

  const addTodo = useCallback((params: AddTodoParams) => {
    const trimmed = params.text.trim()
    if (!trimmed) return
    update([
      ...todos,
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
        dueDate: params.dueDate,
        priority: params.priority,
        importance: params.importance,
      },
    ])
  }, [todos, update])

  const toggleTodo = useCallback((id: string) => {
    update(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }, [todos, update])

  const deleteTodo = useCallback((id: string) => {
    update(todos.filter(t => t.id !== id))
  }, [todos, update])

  const editTodo = useCallback((id: string, fields: EditTodoFields) => {
    update(todos.map(t => {
      if (t.id !== id) return t
      const updated: Todo = { ...t }
      if (fields.text !== undefined) {
        const trimmed = fields.text.trim()
        if (!trimmed) return t
        updated.text = trimmed
      }
      if (fields.dueDate !== undefined) {
        updated.dueDate = fields.dueDate ?? undefined
      }
      if (fields.priority !== undefined) {
        updated.priority = fields.priority ?? undefined
      }
      if (fields.importance !== undefined) {
        updated.importance = fields.importance ?? undefined
      }
      return updated
    }))
  }, [todos, update])

  const clearCompleted = useCallback(() => {
    update(todos.filter(t => !t.completed))
  }, [todos, update])

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  return {
    todos,
    filtered,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount: todos.filter(t => !t.completed).length,
  }
}
