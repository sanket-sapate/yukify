import { useState } from 'react'
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { LayoutList, Trash2, MoreHorizontal, X, GripVertical } from 'lucide-react'

// ── bare card used inside DragOverlay (no dnd hooks) ────────────────────────
function QueueCard({ song, isCurrent }) {
  return (
    <div
      style={{
        background: isCurrent ? 'var(--playing-bg)' : 'var(--surface)',
        border: '2px solid var(--card-border)',
        borderRadius: 'var(--radius)',
        boxShadow: '6px 6px 0 0 var(--card-border)',
      }}
      className="flex items-center gap-3 px-3 py-2.5"
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${song.gradient[0]}, ${song.gradient[1]})`,
          border: '2px solid var(--card-border)',
          borderRadius: '6px',
          minWidth: '44px',
          height: '44px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {song.image && (
          <img src={song.image} alt={song.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold truncate leading-tight" style={{ color: isCurrent ? 'var(--accent)' : 'var(--text)' }}>
          {song.title}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted)' }}>
          {song.artist}
        </p>
      </div>
    </div>
  )
}

// ── sortable row ─────────────────────────────────────────────────────────────
function SortableItem({ song, idx, isCurrent, onPlay, onRemove }) {
  const {
    attributes, listeners,
    setNodeRef, setActivatorNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: song.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
      className="relative group/item"
    >
      {/* Grip handle — the only draggable surface */}
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none z-10"
        style={{ color: 'var(--muted)' }}
        tabIndex={-1}
        title="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      {/* Play button */}
      <button
        onClick={() => onPlay(idx)}
        style={{
          background: isCurrent ? 'var(--playing-bg)' : 'var(--surface)',
          border: '2px solid var(--card-border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--neo-shadow)',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        }}
        className="w-full flex items-center gap-3 pl-7 pr-3 py-2.5 text-left hover:[transform:translate(var(--shadow-x),var(--shadow-y))] hover:[box-shadow:none]"
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${song.gradient[0]}, ${song.gradient[1]})`,
            border: '2px solid var(--card-border)',
            borderRadius: '6px',
            minWidth: '44px',
            height: '44px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {song.image && (
            <img src={song.image} alt={song.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold truncate leading-tight" style={{ color: isCurrent ? 'var(--accent)' : 'var(--text)' }}>
            {song.title}
          </p>
          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted)' }}>
            {song.artist}
          </p>
        </div>
      </button>

      {/* Remove button */}
      <button
        onClick={() => onRemove(idx)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity z-10"
        style={{ color: 'var(--muted)', background: 'var(--surface)' }}
        title="Remove"
      >
        <X size={12} />
      </button>
    </div>
  )
}

// ── main panel ───────────────────────────────────────────────────────────────
export default function QueuePanel({ songs, currentIndex, onPlay, onRemove, onMove, onClear }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragStart = ({ active }) => setActiveId(active.id)

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const from = songs.findIndex(s => s.id === active.id)
    const to   = songs.findIndex(s => s.id === over.id)
    onMove(from, to)
  }

  const activeSong = activeId != null ? songs.find(s => s.id === activeId) : null

  return (
    <aside
      style={{ width: '280px', background: 'var(--bg)', borderLeft: '2px solid var(--card-border)' }}
      className="flex flex-col shrink-0 overflow-hidden"
    >
      {/* Header */}
      <div
        style={{ borderBottom: '2px solid var(--card-border)', background: 'var(--bg)' }}
        className="px-3 py-2.5 shrink-0 flex items-center gap-2"
      >
        <button style={{ background: 'var(--surface)', color: 'var(--muted)' }} className="neo-btn w-8 h-8">
          <LayoutList size={14} />
        </button>
        <span className="text-xs font-bold flex-1 pl-1" style={{ color: 'var(--muted)' }}>
          {songs.length} song{songs.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={onClear}
          disabled={songs.length === 0}
          style={{ background: 'var(--surface)', color: 'var(--muted)', opacity: songs.length === 0 ? 0.3 : 1 }}
          className="neo-btn w-8 h-8"
          title="Clear queue"
        >
          <Trash2 size={14} />
        </button>
        <button style={{ background: 'var(--surface)', color: 'var(--muted)' }} className="neo-btn w-8 h-8">
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2" style={{ color: 'var(--muted)' }}>
            <span className="text-4xl opacity-20">♫</span>
            <p className="text-xs">Queue is empty</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={songs.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {songs.map((song, idx) => (
                <SortableItem
                  key={song.id}
                  song={song}
                  idx={idx}
                  isCurrent={idx === currentIndex}
                  onPlay={onPlay}
                  onRemove={onRemove}
                />
              ))}
            </SortableContext>

            {/* Floating copy shown while dragging */}
            <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
              {activeSong && (
                <QueueCard
                  song={activeSong}
                  isCurrent={songs.findIndex(s => s.id === activeSong.id) === currentIndex}
                />
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </aside>
  )
}
