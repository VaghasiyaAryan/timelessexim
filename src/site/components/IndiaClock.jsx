import { useEffect, useState } from 'react';

// Live India time with an open/closed indicator (Mon–Fri 9:30–18:30, Sat 10:00–14:00 IST)
function indiaStatus(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now).map((p) => [p.type, p.value]));
  const mins = (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10);
  const day = parts.weekday;
  const open = (day !== 'Sat' && day !== 'Sun' && mins >= 570 && mins < 1110) || (day === 'Sat' && mins >= 600 && mins < 840);
  const time = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' }).format(now);
  return { open, time };
}

export default function IndiaClock() {
  const [status, setStatus] = useState(indiaStatus);
  useEffect(() => {
    const id = setInterval(() => setStatus(indiaStatus()), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="clock">
      <span className={'live' + (status.open ? '' : ' off')}></span>
      <span>It's {status.time} in India — {status.open ? 'our team is online now.' : 'we’ll reply when the office reopens.'}</span>
    </div>
  );
}
