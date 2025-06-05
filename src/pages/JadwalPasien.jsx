import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function JadwalPasien({ bookings }) {
  const calendarEvents = bookings
    .filter((b) => b.status === "Terjadwal")
    .map((b) => ({
      title: `${b.patientName} - ${b.time}`,
      start: `${b.date}T${b.time}`,
      id: b.id.toString(),
    }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Jadwal Pasien (Kalender)</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        displayEventTime={false}
        height="auto"
      />
    </div>
  );
}
