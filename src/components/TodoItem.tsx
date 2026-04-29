import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import type { Todo, Priority, Importance, EditTodoFields } from '../types'
import { getDueDateStatus, formatDueDateLabel } from '../utils/suggest'
import styles from './TodoItem.module.css'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, fields: EditTodoFields) => void
  rank?: number
  quadrant?: string
  reason?: string
}

const QUADRANT_LABELS: Record<string, string> = {
  critical: '最優先',
  important: '重要',
  urgent: '緊急',
  normal: '通常',
}

const QUADRANT_STYLE: Record<string, string> = {
  critical: styles.qlCritical,
  important: styles.qlImportant,
  urgent: styles.qlUrgent,
  normal: styles.qlNormal,
}

const RANK_STYLE: Record<string, string> = {
  critical: styles.rankCritical,
  important: styles.rankImportant,
  urgent: styles.rankUrgent,
  normal: styles.rankNormal,
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, rank, quadrant, reason }: Props) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? '')
  const [editPriority, setEditPriority] = useState<Priority | ''>(todo.priority ?? '')
  const [editImportance, setEditImportance] = useState<Importance | ''>(todo.importance ?? '')
  const textRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) textRef.current?.focus()
  }, [editing])

  const enterEdit = () => {
    setEditText(todo.text)
    setEditDueDate(todo.dueDate ?? '')
    setEditPriority(todo.priority ?? '')
    setEditImportance(todo.importance ?? '')
    setEditing(true)
  }

  const saveEdit = () => {
    if (!editText.trim()) return
    onEdit(todo.id, {
      text: editText,
      dueDate: editDueDate || null,
      priority: (editPriority as Priority) || null,
      importance: (editImportance as Importance) || null,
    })
    setEditing(false)
  }

  const cancelEdit = () => setEditing(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  const dueDateStatus = todo.dueDate ? getDueDateStatus(todo.dueDate) : null
  const dueDateLabel = todo.dueDate ? formatDueDateLabel(todo.dueDate) : null

  const DUE_STYLE: Record<string, string> = {
    overdue: styles.dueOverdue,
    today: styles.dueToday,
    soon: styles.dueSoon,
    normal: styles.dueNormal,
  }

  const PRI_STYLE: Record<string, string> = {
    A: styles.priA,
    B: styles.priB,
    C: styles.priC,
  }

  const IMP_STYLE: Record<string, string> = {
    A: styles.impA,
    B: styles.impB,
    C: styles.impC,
  }

  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      {rank !== undefined && (
        <span className={`${styles.rank} ${RANK_STYLE[quadrant ?? 'normal'] ?? styles.rankNormal}`}>
          {rank}
        </span>
      )}
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <div className={styles.content}>
        {editing ? (
          <div className={styles.editForm}>
            <input
              ref={textRef}
              className={styles.editText}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.editFields}>
              <input
                className={styles.editDate}
                type="date"
                value={editDueDate}
                onChange={e => setEditDueDate(e.target.value)}
              />
              <select
                className={styles.editSelect}
                value={editPriority}
                onChange={e => setEditPriority(e.target.value as Priority | '')}
              >
                <option value="">優先 -</option>
                <option value="A">優先 A</option>
                <option value="B">優先 B</option>
                <option value="C">優先 C</option>
              </select>
              <select
                className={styles.editSelect}
                value={editImportance}
                onChange={e => setEditImportance(e.target.value as Importance | '')}
              >
                <option value="">重要 -</option>
                <option value="A">重要 A</option>
                <option value="B">重要 B</option>
                <option value="C">重要 C</option>
              </select>
              <button className={styles.saveBtn} onClick={saveEdit}>保存</button>
              <button className={styles.cancelBtn} onClick={cancelEdit}>×</button>
            </div>
          </div>
        ) : (
          <>
            <span className={styles.text}>{todo.text}</span>
            {(todo.dueDate || todo.priority || todo.importance) && (
              <div className={styles.badges}>
                {todo.dueDate && dueDateStatus && (
                  <span className={`${styles.badge} ${DUE_STYLE[dueDateStatus]}`}>
                    📅 {dueDateLabel}
                  </span>
                )}
                {todo.priority && (
                  <span className={`${styles.badge} ${PRI_STYLE[todo.priority]}`}>
                    優{todo.priority}
                  </span>
                )}
                {todo.importance && (
                  <span className={`${styles.badge} ${IMP_STYLE[todo.importance]}`}>
                    重{todo.importance}
                  </span>
                )}
              </div>
            )}
            {reason !== undefined && (
              <div className={styles.reason}>
                <span className={`${styles.quadrantLabel} ${QUADRANT_STYLE[quadrant ?? 'normal'] ?? styles.qlNormal}`}>
                  {QUADRANT_LABELS[quadrant ?? 'normal']}
                </span>
                {reason}
              </div>
            )}
          </>
        )}
      </div>
      {!editing && !todo.completed && (
        <button className={styles.editBtn} onClick={enterEdit} aria-label="編集">✏</button>
      )}
      <button className={styles.deleteBtn} onClick={() => onDelete(todo.id)} aria-label="削除">×</button>
    </li>
  )
}
