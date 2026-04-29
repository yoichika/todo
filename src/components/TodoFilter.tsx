import type { FilterType } from '../types'
import styles from './TodoFilter.module.css'

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
]

interface Props {
  current: FilterType
  onChange: (f: FilterType) => void
  activeCount: number
  hasCompleted: boolean
  onClearCompleted: () => void
}

export function TodoFilter({ current, onChange, activeCount, hasCompleted, onClearCompleted }: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.count}>{activeCount} 件残り</span>
      <div className={styles.filters}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`${styles.btn} ${current === f.value ? styles.active : ''}`}
            onClick={() => onChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {hasCompleted && (
        <button className={styles.clearBtn} onClick={onClearCompleted}>
          完了済みを削除
        </button>
      )}
    </div>
  )
}
