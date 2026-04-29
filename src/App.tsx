import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import { suggestOrder } from './utils/suggest'
import { TodoInput } from './components/TodoInput'
import { TodoItem } from './components/TodoItem'
import { TodoFilter } from './components/TodoFilter'
import type { ViewMode } from './types'
import styles from './App.module.css'

export default function App() {
  const {
    filtered,
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount,
  } = useTodos()

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const suggestedTodos = suggestOrder(todos)
  const hasCompleted = todos.some(t => t.completed)

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Todo</h1>
      <div className={styles.card}>
        <TodoInput onAdd={addTodo} />

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
            onClick={() => setViewMode('list')}
          >
            タスクリスト
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === 'suggested' ? styles.viewBtnActive : ''}`}
            onClick={() => setViewMode('suggested')}
          >
            実行推奨順
          </button>
        </div>

        {viewMode === 'list' ? (
          <>
            {filtered.length > 0 ? (
              <ul className={styles.list}>
                {filtered.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                  />
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>タスクがありません</p>
            )}
            {todos.length > 0 && (
              <TodoFilter
                current={filter}
                onChange={setFilter}
                activeCount={activeCount}
                hasCompleted={hasCompleted}
                onClearCompleted={clearCompleted}
              />
            )}
          </>
        ) : (
          <>
            {suggestedTodos.length > 0 ? (
              <>
                <p className={styles.suggestDesc}>
                  期限・優先順位・重要度をもとに実行順を提案しています
                </p>
                <ul className={styles.list}>
                  {suggestedTodos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={editTodo}
                      rank={todo.rank}
                      quadrant={todo.quadrant}
                      reason={todo.reason}
                    />
                  ))}
                </ul>
              </>
            ) : (
              <p className={styles.empty}>未完了のタスクがありません</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
