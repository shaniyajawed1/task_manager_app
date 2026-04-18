export default function TaskCard({ task, onUpdate, onDelete }) {
  const statusColors = {
    TODO: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    DONE: 'bg-green-100 text-green-800'
  }

  const nextStatus = {
    TODO: 'IN_PROGRESS',
    IN_PROGRESS: 'DONE',
    DONE: 'TODO'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}
      <div className="flex justify-between items-center">
        <button
          onClick={() => onUpdate(task.id, nextStatus[task.status])}
          className={`px-3 py-1 rounded text-sm ${statusColors[task.status]}`}
        >
          {task.status.replace('_', ' ')}
        </button>
        {task.dueDate && (
          <span className="text-xs text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}
