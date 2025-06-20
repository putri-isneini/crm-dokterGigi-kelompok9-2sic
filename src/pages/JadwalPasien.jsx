import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function JadwalPasien({ bookings = [] }) {
  const calendarEvents = bookings
    .filter((b) => b.status === "Terjadwal")
    .map((b) => {
      const time = b.time.length === 5 ? `${b.time}:00` : b.time;
      return {
        title: `${b.patientName} - ${time}`,
        start: `${b.date}T${time}`,
        id: String(b.id),
      };
    });

  return (
    <div className="min-h-screen bg-[#ffeef6] p-6">
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-pink-600">Jadwal Pasien</h2>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          displayEventTime={false}
          height="auto"
          headerToolbar={{
            start: "title",
            end: "today prev,next",
          }}
          buttonText={{
            today: "Hari Ini",
          }}
        />
      </div>

      {/* Custom style to color the buttons pink */}
      <style jsx>{`
        .fc .fc-button {
          background-color: #f472b6 !important; /* Tailwind pink-400 */
          border-color: #f472b6 !important;
          color: white !important;
          font-weight: 500;
        }
        .fc .fc-button:hover {
          background-color: #ec4899 !important; /* Tailwind pink-500 */
          border-color: #ec4899 !important;
        }
        .fc .fc-button-primary:not(:disabled):active {
          background-color: #db2777 !important; /* Tailwind pink-600 */
          border-color: #db2777 !important;
        }
      `}</style>
    </div>
  );
}
