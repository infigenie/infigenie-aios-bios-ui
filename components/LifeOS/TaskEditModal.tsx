import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Task } from '../../types';
import { Calendar, Flag, Repeat, Tag } from 'lucide-react';

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task: Task | null;
  mode: 'create' | 'edit';
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    priority: 'Medium',
    recurrence: 'None',
    dueDate: '',
    tags: [],
    completed: false,
    subtasks: []
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        priority: 'Medium',
        recurrence: 'None',
        dueDate: '',
        tags: [],
        completed: false,
        subtasks: []
      });
    }
  }, [task, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      return;
    }

    const taskToSave: Task = {
      id: task?.id || `task-${Date.now()}`,
      title: formData.title.trim(),
      completed: formData.completed || false,
      priority: formData.priority as Task['priority'] || 'Medium',
      recurrence: formData.recurrence as Task['recurrence'] || 'None',
      dueDate: formData.dueDate,
      tags: formData.tags || [],
      subtasks: formData.subtasks || []
    };

    onSave(taskToSave);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New Task' : 'Edit Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter task title..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            autoFocus
            required
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Flag size={16} /> Priority
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['Low', 'Medium', 'High', 'Urgent'] as const).map(priority => (
              <button
                key={priority}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priority }))}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${formData.priority === priority
                    ? priority === 'Urgent' ? 'bg-red-600 text-white'
                      : priority === 'High' ? 'bg-orange-600 text-white'
                      : priority === 'Medium' ? 'bg-blue-600 text-white'
                      : 'bg-slate-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }
                `}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Calendar size={16} /> Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Recurrence */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Repeat size={16} /> Recurrence
          </label>
          <select
            value={formData.recurrence}
            onChange={(e) => setFormData(prev => ({ ...prev, recurrence: e.target.value as Task['recurrence'] }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="None">None</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Tag size={16} /> Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a tag..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium"
          >
            {mode === 'create' ? 'Create Task' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
