import { useState, type KeyboardEvent } from 'react'
import type { Priority, Importance, AddTodoParams } from '../types'
import styles from './TodoInput.module.css'

interface Props {
  onAdd: (params: AddTodoParams) => void
}

export function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [importance, setImportance] = useState<Importance | ''>('')

  const submit = () => {
    if (!text.trim()) return
    onAdd({
      text,
      dueDate: dueDate || undefined,
      priority: (priority as Priority) || undefined,
      importance: (importance as Importance) || undefined,
    })
    setText('')
    setDueDate('')
    setPriority('')
    setImportance('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className={styles.container}>
      <div className={styles.row1}>
        <input
          className={styles.textInput}
          type="text"
          placeholder="新しいタスクを入力..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
      <div className={styles.row2}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>期限</span>
          <input
            className={styles.dateInput}
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>優先順位</span>
          <select
            className={styles.select}
            value={priority}
            onChange={e => setPriority(e.target.value as Priority | '')}
          >
            <option value="">-</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>重要度</span>
          <select
            className={styles.select}
            value={importance}
            onChange={e => setImportance(e.target.value as Importance | '')}
          >
            <option value="">-</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
        <button
          className={styles.addButton}
          onClick={submit}
          disabled={!text.trim()}
        >
          追加
        </button>
      </div>
    </div>
  )
}
