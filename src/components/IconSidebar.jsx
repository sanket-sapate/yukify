import { Music, LayoutGrid, ListMusic, Heart, Plus } from 'lucide-react'

export default function IconSidebar({ view, setView, onCreatePlaylist }) {
  const btn = (icon, id, title) => (
    <button
      key={id}
      onClick={() => setView(id)}
      title={title}
      style={{
        color: view === id ? '#fff' : 'var(--muted)',
        background: view === id ? 'var(--accent)' : 'var(--surface)',
      }}
      className="neo-btn w-10 h-10"
    >
      {icon}
    </button>
  )

  return (
    <aside
      style={{
        width: '64px',
        background: 'var(--sidebar)',
        borderRight: '2px solid var(--card-border)',
      }}
      className="hidden md:flex flex-col items-center shrink-0 py-4 gap-3"
    >
      {/* Logo */}
      <div style={{ background: 'var(--accent)' }} className="neo-btn w-10 h-10 mb-2 pointer-events-none">
        <Music size={16} className="text-white" />
      </div>

      {btn(<LayoutGrid size={17} />, 'library', 'Library')}
      {btn(<Heart size={17} />, 'liked', 'Liked Songs')}
      {btn(<ListMusic size={17} />, 'playlists', 'Playlists')}

      <div className="flex-1" />

      <button
        onClick={onCreatePlaylist}
        title="New Playlist"
        style={{ color: 'var(--muted)', background: 'var(--surface)' }}
        className="neo-btn w-10 h-10"
      >
        <Plus size={18} />
      </button>
    </aside>
  )
}
