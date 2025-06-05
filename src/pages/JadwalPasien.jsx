import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function JadwalPasien({ bookings = [] }) {
  // Filter booking yang statusnya "Terjadwal"
  const calendarEvents = bookings
    .filter((b) => b.status === "Terjadwal")
    .map((b) => {
      // Pastikan format waktu valid (HH:mm:ss), kalau cuma HH:mm tambahkan ":00"
      const time = b.time.length === 5 ? `${b.time}:00` : b.time;

      return {
        title: `${b.patientName} - ${time}`,
        start: `${b.date}T${time}`,  // format ISO untuk FullCalendar
        id: String(b.id),
      };
    });

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Jadwal Pasien</h2>
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
