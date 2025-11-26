


// import React, { useState, useEffect } from 'react';
// import { X, Clock, MapPin, Users, Repeat, Trash2 } from 'lucide-react';

// const EventModal = ({
//   isOpen,
//   onClose,
//   onSave,
//   onDelete,
//   event,
//   initialDate
// }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     startDate: '',
//     startTime: '',
//     endDate: '',
//     endTime: '',
//     type: 'meeting',
//     color: '#3B82F6',
//     allDay: false,
//     location: '',
//     attendees: []
//   });

//   const [attendeeEmail, setAttendeeEmail] = useState('');

//   useEffect(() => {
//     if (event) {
//       const startDate = new Date(event.startDate);
//       const endDate = new Date(event.endDate);

//       setFormData({
//         title: event.title,
//         description: event.description || '',
//         startDate: startDate.toISOString().split('T')[0],
//         startTime: startDate.toTimeString().slice(0, 5),
//         endDate: endDate.toISOString().split('T')[0],
//         endTime: endDate.toTimeString().slice(0, 5),
//         type: event.type,
//         color: event.color,
//         allDay: event.allDay,
//         location: event.location || '',
//         attendees: event.attendees || []
//       });
//     } else if (initialDate) {
//       const date = initialDate.toISOString().split('T')[0];
//       const now = new Date();
//       const currentTime = now.toTimeString().slice(0, 5);
//       const endTime = new Date(now.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);

//       setFormData({
//         title: '',
//         description: '',
//         startDate: date,
//         startTime: currentTime,
//         endDate: date,
//         endTime: endTime,
//         type: 'meeting',
//         color: '#3B82F6',
//         allDay: false,
//         location: '',
//         attendees: []
//       });
//     } else {
//       const now = new Date();
//       const date = now.toISOString().split('T')[0];
//       const currentTime = now.toTimeString().slice(0, 5);
//       const endTime = new Date(now.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);

//       setFormData({
//         title: '',
//         description: '',
//         startDate: date,
//         startTime: currentTime,
//         endDate: date,
//         endTime: endTime,
//         type: 'meeting',
//         color: '#3B82F6',
//         allDay: false,
//         location: '',
//         attendees: []
//       });
//     }
//   }, [event, initialDate, isOpen]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const startDateTime = formData.allDay
//       ? new Date(`${formData.startDate}T00:00:00`)
//       : new Date(`${formData.startDate}T${formData.startTime}`);

//     const endDateTime = formData.allDay
//       ? new Date(`${formData.endDate}T23:59:59`)
//       : new Date(`${formData.endDate}T${formData.endTime}`);

//     const eventData = {
//       title: formData.title,
//       description: formData.description,
//       startDate: startDateTime,
//       endDate: endDateTime,
//       type: formData.type,
//       color: formData.color,
//       allDay: formData.allDay,
//       location: formData.location,
//       attendees: formData.attendees
//     };

//     onSave(eventData);
//   };

//   const addAttendee = () => {
//     if (attendeeEmail.trim() && !formData.attendees.includes(attendeeEmail.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         attendees: [...prev.attendees, attendeeEmail.trim()]
//       }));
//       setAttendeeEmail('');
//     }
//   };

//   const removeAttendee = (email) => {
//     setFormData(prev => ({
//       ...prev,
//       attendees: prev.attendees.filter(attendee => attendee !== email)
//     }));
//   };

//   const eventTypeColors = {
//     meeting: '#3B82F6',
//     deadline: '#EF4444',
//     task: '#10B981',
//     reminder: '#F59E0B',
//     personal: '#8B5CF6'
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">
//             {event ? 'Edit Event' : 'Create New Event'}
//           </h2>
//           <div className="flex items-center space-x-2">
//             {event && onDelete && (
//               <button
//                 onClick={onDelete}
//                 className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
//               >
//                 <Trash2 className="h-5 w-5" />
//               </button>
//             )}
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//             >
//               <X className="h-5 w-5 text-gray-500" />
//             </button>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Title */}
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//               Event Title *
//             </label>
//             <input
//               type="text"
//               id="title"
//               value={formData.title}
//               onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             />
//           </div>

//           {/* Event Type and Color */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
//                 Event Type
//               </label>
//               <select
//                 id="type"
//                 value={formData.type}
//                 onChange={(e) => {
//                   const newType = e.target.value;
//                   setFormData(prev => ({
//                     ...prev,
//                     type: newType,
//                     color: eventTypeColors[newType]
//                   }));
//                 }}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="meeting">Meeting</option>
//                 <option value="deadline">Deadline</option>
//                 <option value="task">Task</option>
//                 <option value="reminder">Reminder</option>
//                 <option value="personal">Personal</option>
//               </select>
//             </div>

//             <div>
//               <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
//                 Color
//               </label>
//               <input
//                 type="color"
//                 id="color"
//                 value={formData.color}
//                 onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
//                 className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* All Day Toggle */}
//           <div className="flex items-center space-x-3">
//             <input
//               type="checkbox"
//               id="allDay"
//               checked={formData.allDay}
//               onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))}
//               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <label htmlFor="allDay" className="text-sm font-medium text-gray-700">
//               All day event
//             </label>
//           </div>

//           {/* Date and Time */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Start
//               </label>
//               <div className="space-y-2">
//                 <input
//                   type="date"
//                   value={formData.startDate}
//                   onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 />
//                 {!formData.allDay && (
//                   <input
//                     type="time"
//                     value={formData.startTime}
//                     onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 )}
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 End
//               </label>
//               <div className="space-y-2">
//                 <input
//                   type="date"
//                   value={formData.endDate}
//                   onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 />
//                 {!formData.allDay && (
//                   <input
//                     type="time"
//                     value={formData.endTime}
//                     onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Location */}
//           <div>
//             <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
//               <MapPin className="inline h-4 w-4 mr-1" />
//               Location
//             </label>
//             <input
//               type="text"
//               id="location"
//               value={formData.location}
//               onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
//               placeholder="Add location"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Attendees */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <Users className="inline h-4 w-4 mr-1" />
//               Attendees
//             </label>
//             <div className="flex space-x-2 mb-2">
//               <input
//                 type="email"
//                 value={attendeeEmail}
//                 onChange={(e) => setAttendeeEmail(e.target.value)}
//                 placeholder="Add attendee email"
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
//               />
//               <button
//                 type="button"
//                 onClick={addAttendee}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Add
//               </button>
//             </div>
//             {formData.attendees.length > 0 && (
//               <div className="flex flex-wrap gap-2">
//                 {formData.attendees.map((email) => (
//                   <span
//                     key={email}
//                     className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
//                   >
//                     {email}
//                     <button
//                       type="button"
//                       onClick={() => removeAttendee(email)}
//                       className="ml-2 text-blue-600 hover:text-blue-800"
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
//             >
//               {event ? 'Update Event' : 'Create Event'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EventModal;




import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Users, Repeat, Trash2 } from 'lucide-react';
import './EventModal.css'; // Import the CSS file

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    type: 'meeting',
    color: '#3B82F6',
    allDay: false,
    location: '',
    attendees: []
  });

  const [attendeeEmail, setAttendeeEmail] = useState('');

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        type: event.type,
        color: event.color,
        allDay: event.allDay,
        location: event.location || '',
        attendees: event.attendees || []
      });
    } else if (initialDate) {
      const date = initialDate.toISOString().split('T')[0];
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const endTime = new Date(now.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);

      setFormData({
        title: '',
        description: '',
        startDate: date,
        startTime: currentTime,
        endDate: date,
        endTime: endTime,
        type: 'meeting',
        color: '#3B82F6',
        allDay: false,
        location: '',
        attendees: []
      });
    } else {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);
      const endTime = new Date(now.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);

      setFormData({
        title: '',
        description: '',
        startDate: date,
        startTime: currentTime,
        endDate: date,
        endTime: endTime,
        type: 'meeting',
        color: '#3B82F6',
        allDay: false,
        location: '',
        attendees: []
      });
    }
  }, [event, initialDate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const startDateTime = formData.allDay
      ? new Date(`${formData.startDate}T00:00:00`)
      : new Date(`${formData.startDate}T${formData.startTime}`);

    const endDateTime = formData.allDay
      ? new Date(`${formData.endDate}T23:59:59`)
      : new Date(`${formData.endDate}T${formData.endTime}`);

    const eventData = {
      title: formData.title,
      description: formData.description,
      startDate: startDateTime,
      endDate: endDateTime,
      type: formData.type,
      color: formData.color,
      allDay: formData.allDay,
      location: formData.location,
      attendees: formData.attendees
    };

    onSave(eventData);
  };

  const addAttendee = () => {
    if (attendeeEmail.trim() && !formData.attendees.includes(attendeeEmail.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, attendeeEmail.trim()]
      }));
      setAttendeeEmail('');
    }
  };

  const removeAttendee = (email) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(attendee => attendee !== email)
    }));
  };

  const eventTypeColors = {
    meeting: '#3B82F6',
    deadline: '#EF4444',
    task: '#10B981',
    reminder: '#F59E0B',
    personal: '#8B5CF6'
  };

  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay">
      <div className="event-modal-container">
        {/* Header */}
        <div className="event-modal-header">
          <h2 className="event-modal-title">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <div className="event-modal-header-actions">
            {event && onDelete && (
              <button
                onClick={onDelete}
                className="event-modal-delete-button"
              >
                <Trash2 className="event-modal-delete-icon" />
              </button>
            )}
            <button
              onClick={onClose}
              className="event-modal-close-button"
            >
              <X className="event-modal-close-icon" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="event-modal-form">
          {/* Title */}
          <div className="form-field">
            <label htmlFor="title" className="form-label">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="form-input"
              required
            />
          </div>

          {/* Description */}
          <div className="form-field">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="form-textarea"
            />
          </div>

          {/* Event Type and Color */}
          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="type" className="form-label">
                Event Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    type: newType,
                    color: eventTypeColors[newType]
                  }));
                }}
                className="form-select"
              >
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
                <option value="task">Task</option>
                <option value="reminder">Reminder</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="color" className="form-label">
                Color
              </label>
              <input
                type="color"
                id="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="form-color-input"
              />
            </div>
          </div>

          {/* All Day Toggle */}
          <div className="form-checkbox-field">
            <input
              type="checkbox"
              id="allDay"
              checked={formData.allDay}
              onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))}
              className="form-checkbox"
            />
            <label htmlFor="allDay" className="form-checkbox-label">
              All day event
            </label>
          </div>

          {/* Date and Time */}
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">
                Start
              </label>
              <div className="form-datetime-group">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="form-input"
                  required
                />
                {!formData.allDay && (
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="form-input"
                    required
                  />
                )}
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                End
              </label>
              <div className="form-datetime-group">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="form-input"
                  required
                />
                {!formData.allDay && (
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="form-input"
                    required
                  />
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-field">
            <label htmlFor="location" className="form-label-with-icon">
              <MapPin className="form-label-icon" />
              Location
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Add location"
              className="form-input"
            />
          </div>

          {/* Attendees */}
          <div className="form-field">
            <label className="form-label-with-icon">
              <Users className="form-label-icon" />
              Attendees
            </label>
            <div className="attendee-input-group">
              <input
                type="email"
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
                placeholder="Add attendee email"
                className="attendee-input"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
              />
              <button
                type="button"
                onClick={addAttendee}
                className="attendee-add-button"
              >
                Add
              </button>
            </div>
            {formData.attendees.length > 0 && (
              <div className="attendee-list">
                {formData.attendees.map((email) => (
                  <span
                    key={email}
                    className="attendee-tag"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeAttendee(email)}
                      className="attendee-remove-button"
                    >
                      <X className="attendee-remove-icon" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="form-cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="form-submit-button"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;