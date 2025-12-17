import React, { useState, useEffect, useRef } from 'react'
import './AddNotes.css'

interface Note {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  color: string
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
  isArchived: boolean
  attachments?: {
    id: number
    name: string
    type: string
    size: number
    url: string
  }[]
  reminders?: {
    id: number
    datetime: Date
    message: string
    isActive: boolean
  }[]
  checklist?: {
    id: number
    text: string
    completed: boolean
  }[]
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
  count: number
}

const AddNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date')
  const [showArchived, setShowArchived] = useState(false)
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#ffffff')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [collaborators, setCollaborators] = useState<string[]>([])
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [versionHistory, setVersionHistory] = useState<any[]>([])
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)

  const defaultCategories: Category[] = [
    { id: 'personal', name: 'Personal', icon: '👤', color: '#3b82f6', count: 0 },
    { id: 'work', name: 'Work', icon: '💼', color: '#10b981', count: 0 },
    { id: 'ideas', name: 'Ideas', icon: '💡', color: '#f59e0b', count: 0 },
    { id: 'tasks', name: 'Tasks', icon: '✅', color: '#ef4444', count: 0 },
    { id: 'projects', name: 'Projects', icon: '🚀', color: '#8b5cf6', count: 0 },
    { id: 'meeting', name: 'Meeting', icon: '🤝', color: '#ec4899', count: 0 },
    { id: 'research', name: 'Research', icon: '📚', color: '#14b8a6', count: 0 },
    { id: 'archive', name: 'Archive', icon: '📦', color: '#64748b', count: 0 }
  ]

  const colors = [
    '#ffffff', '#fef3c7', '#fee2e2', '#dbeafe', '#e0e7ff',
    '#ede9fe', '#fce7f3', '#d1fae5', '#f3f4f6', '#fed7aa'
  ]

  const emojis = ['😀', '😊', '🎉', '🔥', '💯', '✨', '🙏', '💪', '🎯', '🚀']

  const templates = [
    { id: 'meeting', name: 'Meeting Notes', icon: '🤝', content: '## Meeting Details\n**Date:** \n**Attendees:** \n**Agenda:**\n1. \n2. \n3. \n\n**Action Items:**\n- [ ] \n- [ ] \n\n**Next Steps:**\n' },
    { id: 'todo', name: 'To-Do List', icon: '✅', content: '## Tasks\n\n### High Priority\n- [ ] \n- [ ] \n\n### Medium Priority\n- [ ] \n- [ ] \n\n### Low Priority\n- [ ] \n- [ ] \n\n**Due Dates:**\n' },
    { id: 'project', name: 'Project Plan', icon: '🚀', content: '## Project Overview\n**Name:** \n**Description:** \n**Timeline:** \n**Budget:** \n\n### Goals\n1. \n2. \n3. \n\n### Milestones\n- [ ] \n- [ ] \n\n### Resources\n\n### Risks\n' },
    { id: 'daily', name: 'Daily Journal', icon: '📔', content: '## Daily Journal - {date}\n\n### Gratitude\n- \n- \n- \n\n### Goals for Today\n- [ ] \n- [ ] \n- [ ] \n\n### Reflections\n\n### Tomorrow\'s Plan\n' }
  ]

  useEffect(() => {
    setCategories(defaultCategories)
    loadSampleNotes()
  }, [])

  useEffect(() => {
    if (autoSave && selectedNote && isEditing) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
      autoSaveRef.current = setTimeout(() => {
        saveNote()
      }, 2000)
    }
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [selectedNote?.content, autoSave, isEditing])

  useEffect(() => {
    if (selectedNote?.content) {
      const words = selectedNote.content.split(/\s+/).filter(word => word.length > 0).length
      setWordCount(words)
      setReadingTime(Math.ceil(words / 200)) // Average reading speed
    }
  }, [selectedNote?.content])

  const loadSampleNotes = () => {
    const sampleNotes: Note[] = [
      {
        id: 1,
        title: 'Project Kickoff Meeting',
        content: '## Project Kickoff Meeting\n\n**Date:** March 15, 2024\n**Attendees:** John, Sarah, Mike, Emily\n\n### Key Discussion Points\n- Project timeline and milestones\n- Budget allocation\n- Team responsibilities\n- Risk assessment\n\n### Action Items\n- [ ] Create project charter\n- [ ] Set up development environment\n- [ ] Schedule weekly sync meetings\n\n### Next Steps\n- Send meeting summary to all attendees\n- Create detailed project plan\n- Assign initial tasks',
        category: 'work',
        tags: ['meeting', 'project', 'important'],
        priority: 'high',
        color: '#dbeafe',
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15'),
        isPinned: true,
        isArchived: false,
        checklist: [
          { id: 1, text: 'Create project charter', completed: false },
          { id: 2, text: 'Set up development environment', completed: true },
          { id: 3, text: 'Schedule weekly sync meetings', completed: false }
        ]
      },
      {
        id: 2,
        title: 'Weekend Trip Ideas',
        content: '## Weekend Trip Ideas\n\n### Destinations\n1. **Mountain Retreat**\n   - Hiking trails\n   - Cabin rental\n   - Campfire activities\n\n2. **Beach Getaway**\n   - Surfing lessons\n   - Beach volleyball\n   - Sunset photography\n\n3. **City Exploration**\n   - Museum visits\n   - Local cuisine\n   - Nightlife\n\n### Packing List\n- [ ] Clothes\n- [ ] Toiletries\n- [ ] Camera\n- [ ] Snacks\n- [ ] First aid kit',
        category: 'personal',
        tags: ['travel', 'weekend', 'ideas'],
        priority: 'medium',
        color: '#fef3c7',
        createdAt: new Date('2024-03-14'),
        updatedAt: new Date('2024-03-14'),
        isPinned: false,
        isArchived: false
      },
      {
        id: 3,
        title: 'App Feature Ideas',
        content: '## App Feature Ideas\n\n### User Experience\n- Dark mode toggle\n- Gesture navigation\n- Voice commands\n- Offline mode\n\n### Social Features\n- Share notes with friends\n- Collaborative editing\n- Comments and reactions\n- Team workspaces\n\n### Productivity\n- Smart search\n- Auto-categorization\n- Reminder system\n- Calendar integration\n\n### Monetization\n- Premium templates\n- Cloud storage\n- Advanced analytics\n- Priority support',
        category: 'ideas',
        tags: ['app', 'features', 'product'],
        priority: 'low',
        color: '#e0e7ff',
        createdAt: new Date('2024-03-13'),
        updatedAt: new Date('2024-03-13'),
        isPinned: false,
        isArchived: false
      }
    ]
    setNotes(sampleNotes)
    updateCategoryCounts(sampleNotes)
  }

  const updateCategoryCounts = (notesList: Note[]) => {
    const updatedCategories = defaultCategories.map(category => ({
      ...category,
      count: notesList.filter(note => note.category === category.id && !note.isArchived).length
    }))
    setCategories(updatedCategories)
  }

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      category: selectedCategory === 'all' ? 'personal' : selectedCategory,
      tags: [],
      priority: 'medium',
      color: '#ffffff',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isArchived: false
    }
    setSelectedNote(newNote)
    setIsEditing(true)
  }

  const saveNote = () => {
    if (!selectedNote) return

    const updatedNote = {
      ...selectedNote,
      updatedAt: new Date(),
      content: selectedNote.content || ''
    }

    const existingIndex = notes.findIndex(note => note.id === selectedNote.id)
    let updatedNotes: Note[]

    if (existingIndex >= 0) {
      updatedNotes = [...notes]
      updatedNotes[existingIndex] = updatedNote
    } else {
      updatedNotes = [...notes, updatedNote]
    }

    setNotes(updatedNotes)
    updateCategoryCounts(updatedNotes)
    setIsEditing(false)
    
    // Add to version history
    const version = {
      id: Date.now(),
      noteId: updatedNote.id,
      content: updatedNote.content,
      timestamp: new Date(),
      type: 'save'
    }
    setVersionHistory(prev => [version, ...prev.slice(0, 9)]) // Keep last 10 versions
  }

  const deleteNote = (noteId: number) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    setNotes(updatedNotes)
    updateCategoryCounts(updatedNotes)
    
    if (selectedNote?.id === noteId) {
      setSelectedNote(null)
      setIsEditing(false)
    }
  }

  const togglePin = (noteId: number) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    )
    setNotes(updatedNotes)
  }

  const toggleArchive = (noteId: number) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
    )
    setNotes(updatedNotes)
    updateCategoryCounts(updatedNotes)
  }

  const addTag = (tag: string) => {
    if (tag && !selectedNote?.tags.includes(tag)) {
      setSelectedNote(prev => prev ? {
        ...prev,
        tags: [...prev.tags, tag]
      } : null)
    }
    setNewTag('')
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedNote(prev => prev ? {
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    } : null)
  }

  const addChecklistItem = () => {
    if (!selectedNote) return
    
    const newItem = {
      id: Date.now(),
      text: '',
      completed: false
    }
    
    setSelectedNote(prev => prev ? {
      ...prev,
      checklist: [...(prev.checklist || []), newItem]
    } : null)
  }

  const updateChecklistItem = (itemId: number, text: string) => {
    setSelectedNote(prev => prev ? {
      ...prev,
      checklist: prev.checklist?.map(item =>
        item.id === itemId ? { ...item, text } : item
      )
    } : null)
  }

  const toggleChecklistItem = (itemId: number) => {
    setSelectedNote(prev => prev ? {
      ...prev,
      checklist: prev.checklist?.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    } : null)
  }

  const removeChecklistItem = (itemId: number) => {
    setSelectedNote(prev => prev ? {
      ...prev,
      checklist: prev.checklist?.filter(item => item.id !== itemId)
    } : null)
  }

  const addReminder = () => {
    if (!selectedNote || !selectedDate) return
    
    const reminder = {
      id: Date.now(),
      datetime: selectedDate,
      message: `Reminder: ${selectedNote.title}`,
      isActive: true
    }
    
    setSelectedNote(prev => prev ? {
      ...prev,
      reminders: [...(prev.reminders || []), reminder]
    } : null)
    setSelectedDate(null)
    setShowCalendar(false)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const applyTemplate = (template: any) => {
    if (selectedNote) {
      const content = template.content.replace('{date}', new Date().toLocaleDateString())
      setSelectedNote(prev => prev ? {
        ...prev,
        content: content,
        title: template.name
      } : null)
    }
    setShowTemplates(false)
  }

  const exportNote = () => {
    if (!selectedNote) return
    
    const content = `# ${selectedNote.title}\n\n${selectedNote.content}\n\n---\nCreated: ${selectedNote.createdAt.toLocaleDateString()}\nUpdated: ${selectedNote.updatedAt.toLocaleDateString()}\nTags: ${selectedNote.tags.join(', ')}`
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedNote.title}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory
    const matchesArchived = showArchived || !note.isArchived
    const matchesPinned = !showPinnedOnly || note.isPinned
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => note.tags.includes(tag))
    
    return matchesSearch && matchesCategory && matchesArchived && matchesPinned && matchesTags
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.updatedAt.getTime() - a.updatedAt.getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      default:
        return 0
    }
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444'
      case 'high': return '#f59e0b'
      case 'medium': return '#3b82f6'
      case 'low': return '#10b981'
      default: return '#64748b'
    }
  }

  return (
    <div className={`add-notes ${isDarkMode ? 'dark-mode' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="notes-header">
        <div className="header-left">
          <h1>📝 Notes</h1>
          <div className="header-stats">
            <span className="stat">{notes.filter(n => !n.isArchived).length} Notes</span>
            <span className="stat">{notes.filter(n => n.isPinned).length} Pinned</span>
            <span className="stat">{notes.filter(n => n.isArchived).length} Archived</span>
          </div>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <button 
              className={`action-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
            <button 
              className={`action-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
            <button 
              className={`action-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              📋
            </button>
            <button 
              className={`action-btn ${showSidebar ? 'active' : ''}`}
              onClick={() => setShowSidebar(!showSidebar)}
            >
              📂
            </button>
            <button 
              className={`action-btn ${isDarkMode ? 'active' : ''}`}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className={`action-btn ${isFullscreen ? 'active' : ''}`}
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? '🗗' : '🗖'}
            </button>
          </div>
        </div>
      </div>

      <div className="notes-container">
        {showSidebar && (
          <div className="notes-sidebar">
            <div className="sidebar-section">
              <h3>Categories</h3>
              <div className="category-list">
                <button
                  className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  <span>📁</span>
                  <span>All Notes</span>
                  <span className="count">{notes.filter(n => !n.isArchived).length}</span>
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span style={{ color: category.color }}>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="count">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Filters</h3>
              <div className="filter-controls">
                <label className="filter-item">
                  <input
                    type="checkbox"
                    checked={showPinnedOnly}
                    onChange={(e) => setShowPinnedOnly(e.target.checked)}
                  />
                  <span>📌 Pinned only</span>
                </label>
                <label className="filter-item">
                  <input
                    type="checkbox"
                    checked={showArchived}
                    onChange={(e) => setShowArchived(e.target.checked)}
                  />
                  <span>📦 Show archived</span>
                </label>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Sort By</h3>
              <div className="sort-controls">
                <button
                  className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                  onClick={() => setSortBy('date')}
                >
                  📅 Date
                </button>
                <button
                  className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`}
                  onClick={() => setSortBy('title')}
                >
                  🔤 Title
                </button>
                <button
                  className={`sort-btn ${sortBy === 'priority' ? 'active' : ''}`}
                  onClick={() => setSortBy('priority')}
                >
                  ⚡ Priority
                </button>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Tags</h3>
              <div className="tag-input">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
                />
                <button onClick={() => addTag(newTag)}>➕</button>
              </div>
              <div className="tag-list">
                {Array.from(new Set(notes.flatMap(note => note.tags))).map(tag => (
                  <button
                    key={tag}
                    className={`tag-item ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(prev => prev.filter(t => t !== tag))
                      } else {
                        setSelectedTags(prev => [...prev, tag])
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="notes-main">
          <div className="notes-toolbar">
            <div className="toolbar-left">
              <button className="action-btn primary" onClick={createNewNote}>
                ➕ New Note
              </button>
              <div className="search-bar">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="toolbar-right">
              <button className="action-btn" onClick={() => setShowTemplates(!showTemplates)}>
                📋 Templates
              </button>
              <label className="filter-item">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                <span>💾 Auto-save</span>
              </label>
            </div>
          </div>

          {showTemplates && (
            <div className="templates-panel">
              <h4>📋 Note Templates</h4>
              <div className="template-grid">
                {templates.map(template => (
                  <button
                    key={template.id}
                    className="template-item"
                    onClick={() => applyTemplate(template)}
                  >
                    <span className="template-icon">{template.icon}</span>
                    <span className="template-name">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedNote && isEditing ? (
            <div className="note-editor">
              <div className="editor-header">
                <div className="editor-left">
                  <input
                    type="text"
                    className="note-title-input"
                    value={selectedNote.title}
                    onChange={(e) => setSelectedNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                    placeholder="Note title..."
                  />
                  <div className="editor-meta">
                    <span className="word-count">📝 {wordCount} words</span>
                    <span className="reading-time">⏱️ {readingTime} min read</span>
                    <span className="last-saved">💾 Saved {selectedNote.updatedAt.toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="editor-right">
                  <button className="action-btn" onClick={() => setShowColorPicker(!showColorPicker)}>
                    🎨
                  </button>
                  <button className="action-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    😊
                  </button>
                  <button className="action-btn" onClick={() => setShowCalendar(!showCalendar)}>
                    📅
                  </button>
                  <button className="action-btn" onClick={startRecording} disabled={isRecording}>
                    {isRecording ? '⏹️' : '🎤'}
                  </button>
                  <button className="action-btn" onClick={() => setIsDrawing(!isDrawing)}>
                    ✏️
                  </button>
                  <button className="action-btn" onClick={exportNote}>
                    📤
                  </button>
                  <button className="action-btn success" onClick={saveNote}>
                    💾 Save
                  </button>
                  <button className="action-btn" onClick={() => setIsEditing(false)}>
                    ✕
                  </button>
                </div>
              </div>

              {showColorPicker && (
                <div className="color-picker">
                  <div className="color-grid">
                    {colors.map(color => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedColor(color)
                          setSelectedNote(prev => prev ? { ...prev, color } : null)
                          setShowColorPicker(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {showEmojiPicker && (
                <div className="emoji-picker">
                  <div className="emoji-grid">
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setSelectedNote(prev => prev ? { ...prev, content: prev.content + emoji } : null)
                          setShowEmojiPicker(false)
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showCalendar && (
                <div className="calendar-picker">
                  <h4>📅 Set Reminder</h4>
                  <input
                    type="datetime-local"
                    value={selectedDate ? selectedDate.toISOString().slice(0, 16) : ''}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  />
                  <div className="calendar-actions">
                    <button className="action-btn primary" onClick={addReminder}>
                      ⏰ Set Reminder
                    </button>
                    <button className="action-btn" onClick={() => setShowCalendar(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="editor-content">
                <div className="editor-toolbar">
                  <select
                    value={selectedNote.category}
                    onChange={(e) => setSelectedNote(prev => prev ? { ...prev, category: e.target.value } : null)}
                    className="category-select"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedNote.priority}
                    onChange={(e) => setSelectedNote(prev => prev ? { ...prev, priority: e.target.value as any } : null)}
                    className="priority-select"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🔵 Medium</option>
                    <option value="high">🟡 High</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>

                <textarea
                  ref={editorRef}
                  className="note-content-input"
                  value={selectedNote.content}
                  onChange={(e) => setSelectedNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                  placeholder="Start typing your note..."
                  style={{ backgroundColor: selectedNote.color }}
                />

                {selectedNote.checklist && selectedNote.checklist.length > 0 && (
                  <div className="checklist-section">
                    <h4>✅ Checklist</h4>
                    <div className="checklist-items">
                      {selectedNote.checklist.map(item => (
                        <div key={item.id} className="checklist-item">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklistItem(item.id)}
                          />
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                            placeholder="Checklist item..."
                          />
                          <button className="remove-btn" onClick={() => removeChecklistItem(item.id)}>
                            ✕
                          </button>
                        </div>
                      ))}
                      <button className="add-checklist-btn" onClick={addChecklistItem}>
                        ➕ Add item
                      </button>
                    </div>
                  </div>
                )}

                <div className="note-tags">
                  <h4>🏷️ Tags</h4>
                  <div className="tag-editor">
                    {selectedNote.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                        <button onClick={() => removeTag(tag)}>✕</button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
                    />
                  </div>
                </div>

                {selectedNote.reminders && selectedNote.reminders.length > 0 && (
                  <div className="reminders-section">
                    <h4>⏰ Reminders</h4>
                    <div className="reminder-list">
                      {selectedNote.reminders.map(reminder => (
                        <div key={reminder.id} className="reminder-item">
                          <span>📅 {reminder.datetime.toLocaleString()}</span>
                          <span>{reminder.message}</span>
                          <span className={`status ${reminder.isActive ? 'active' : 'inactive'}`}>
                            {reminder.isActive ? '🟢 Active' : '🔴 Inactive'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`notes-grid ${viewMode}`}>
              {sortedNotes.map(note => (
                <div
                  key={note.id}
                  className={`note-card ${note.isPinned ? 'pinned' : ''} ${note.isArchived ? 'archived' : ''}`}
                  style={{ backgroundColor: note.color }}
                  onClick={() => {
                    setSelectedNote(note)
                    setIsEditing(true)
                  }}
                >
                  <div className="note-header">
                    <div className="note-title">
                      <h3>{note.title}</h3>
                      <div className="note-meta">
                        <span className="category-badge" style={{ color: categories.find(c => c.id === note.category)?.color }}>
                          {categories.find(c => c.id === note.category)?.icon}
                        </span>
                        <span className="priority-dot" style={{ backgroundColor: getPriorityColor(note.priority) }}></span>
                        {note.isPinned && <span className="pin-icon">📌</span>}
                      </div>
                    </div>
                    <div className="note-actions">
                      <button
                        className="action-btn small"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePin(note.id)
                        }}
                      >
                        {note.isPinned ? '📌' : '📍'}
                      </button>
                      <button
                        className="action-btn small"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleArchive(note.id)
                        }}
                      >
                        {note.isArchived ? '📦' : '📋'}
                      </button>
                      <button
                        className="action-btn small danger"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNote(note.id)
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="note-content">
                    <p>{note.content.substring(0, 200)}{note.content.length > 200 ? '...' : ''}</p>
                    
                    {note.checklist && note.checklist.length > 0 && (
                      <div className="checklist-preview">
                        <span className="checklist-progress">
                          {note.checklist.filter(item => item.completed).length}/{note.checklist.length}
                        </span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{
                              width: `${(note.checklist.filter(item => item.completed).length / note.checklist.length) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="note-footer">
                    <div className="note-tags">
                      {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                      {note.tags.length > 3 && <span className="tag">+{note.tags.length - 3}</span>}
                    </div>
                    <div className="note-dates">
                      <span className="date">📅 {note.updatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddNotes
