


import React, { createContext, useContext, useState, useEffect } from "react";

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  //  Fetch the events on mount
  useEffect(() => {
    fetch("http://localhost:5001/api/events")
      .then((res) => res.json())
      .then((data) => {
        // Convert string dates from backend into JS Date objects
        const parsed = data.map((e) => ({
          ...e,
          startDate: new Date(e.startDate),
          endDate: new Date(e.endDate),
        }));
        console.log("Fetched events:", parsed);
        setEvents(parsed);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  

  const createEvent = async (eventData) => {
    try {
      // toISOString() converts: Wed Nov 05 2025 10:58:00 GMT+0530 → "2025-11-05T05:28:00.000Z"
      const dataToSend = {
        title: eventData.title,
        description: eventData.description || null,
        startDate: eventData.startDate.toISOString(),
        endDate: eventData.endDate.toISOString(),
        type: eventData.type || null,
        color: eventData.color || null,
        allDay: eventData.allDay || false,
      };
      
      console.log("Sending to backend:", dataToSend);
      
      const res = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });


      
      const responseData = await res.json();
      console.log("Backend response:", responseData);
      
      if (!res.ok) {
        console.error("Error details:", responseData);
        alert(`Failed to create event: ${responseData.details || responseData.error}`);
        return;
      }
      
      const newEvent = responseData;

      newEvent.startDate = new Date(newEvent.startDate);

      newEvent.endDate = new Date(newEvent.endDate);

      setEvents((prev) => [...prev, newEvent]);

      console.log("Event created successfully!");
    } catch (err) {
      console.error("Error creating event:", err);
      alert(`Failed to create event: ${err.message}`);
    }
  };

  // Update existing event
  const updateEvent = async (eventId, updates) => {
  try {
    // Convert dates to ISO string format before sending
    const dataToSend = {
      title: updates.title,
      description: updates.description || null,
      startDate: updates.startDate ? updates.startDate.toISOString() : undefined,
      endDate: updates.endDate ? updates.endDate.toISOString() : undefined,
      type: updates.type || null,
      color: updates.color || null,
      allDay: updates.allDay !== undefined ? updates.allDay : undefined,
    };

    // Remove undefined values (only send fields that are being updated)
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === undefined) {
        delete dataToSend[key];
      }
    });

    console.log("Updating event:", eventId, dataToSend);

    const res = await fetch(`http://localhost:5001/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const responseData = await res.json();
    console.log("Update response:", responseData);

    if (!res.ok) {
      console.error("Error details:", responseData);
      alert(`Failed to update event: ${responseData.details || responseData.error}`);
      return;
    }

    const updated = responseData;
    updated.startDate = new Date(updated.startDate);
    updated.endDate = new Date(updated.endDate);
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? updated : event))
    );
    console.log("Event updated successfully!");
  } catch (err) {
    console.error("Error updating event:", err);
    alert(`Failed to update event: ${err.message}`);
  }
};

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      console.log("Deleting event:", eventId);
      const res = await fetch(`http://localhost:5001/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (!res.ok) { 
      const responseData = await res.json();
      console.error("Delete failed:", responseData);
      return;
    }
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      console.log("Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // Utilit:get events by date
  const getEventsByDate = (date) => {
    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return events.filter((event) => {
      const eventDate = new Date(
        event.startDate.getFullYear(),
        event.startDate.getMonth(),
        event.startDate.getDate()
      );
      return eventDate.getTime() === targetDate.getTime();
    });
  };

  // Utility: get events in date range
  const getEventsInRange = (startDate, endDate) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return (
        (eventStart >= startDate && eventStart <= endDate) ||
        (eventEnd >= startDate && eventEnd <= endDate) ||
        (eventStart <= startDate && eventEnd >= endDate)
      );
    });
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        createEvent,
        updateEvent,
        deleteEvent,
        getEventsByDate,
        getEventsInRange,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
