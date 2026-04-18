import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import CreateTaskModal from '../components/CreateTaskModal'

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      const allTasks = localStorage.getItem('allTasks')
      const parsedTasks = allTasks ? JSON.parse(allTasks) : {}
      const userTasks = parsedTasks[user.email] || []
      setTasks(userTasks)
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user?.email && tasks.length >= 0) {
      const allTasks = localStorage.getItem('allTasks')
      const parsedTasks = allTasks ? JSON.parse(allTasks) : {}
      parsedTasks[user.email] = tasks
      localStorage.setItem('allTasks', JSON.stringify(parsedTasks))
    }
  }, [tasks, user])

  const createTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date().toISOString()
    }
    setTasks([newTask, ...tasks])
  }

  const updateTask = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ))
  }

  const deleteTask = (id) => {
    if (confirm('Delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id))
    }
  }

  const getStats = () => {
    const total = tasks.length
    const todo = tasks.filter(t => t.status === 'TODO').length
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
    const done = tasks.filter(t => t.status === 'DONE').length
    return { total, todo, inProgress, done }
  }

  const stats = getStats()

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'ALL' || task.status === filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <main className="max-w-7xl mx-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg hover:scale-105 transition-all duration-300">
              <p className="text-sm opacity-90">Total Tasks</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white shadow-lg hover:scale-105 transition-all duration-300">
              <p className="text-sm opacity-90">To Do</p>
              <p className="text-3xl font-bold">{stats.todo}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg hover:scale-105 transition-all duration-300">
              <p className="text-sm opacity-90">In Progress</p>
              <p className="text-3xl font-bold">{stats.inProgress}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg hover:scale-105 transition-all duration-300">
              <p className="text-sm opacity-90">Completed</p>
              <p className="text-3xl font-bold">{stats.done}</p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              {/* Search */}
              <input
                type="text"
                placeholder="Search tasks..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              {/* Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={'px-4 py-2 rounded-lg transition-all duration-200 ' + 
                      (filter === status
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Create Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                + New Task
              </button>
            </div>
          </div>

          {/* Tasks Display */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">No tasks yet. Create your first task!</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </main>
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={createTask}
        />
      </div>
    </div>
  )
}
