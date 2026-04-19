const BLOCKS = [
  { time: "9:00 – 9:15",   title: "Arrival & free play",       body: "Kids drop in, meet the group, settle on the sand." },
  { time: "9:15 – 9:45",   title: "Welcome circle",            body: "Name the day's theme, set intentions, preview what's ahead." },
  { time: "9:45 – 10:15",  title: "Movement & breath",         body: "Mobility, diaphragmatic breathing drills, CO₂ tolerance work." },
  { time: "10:15 – 10:45", title: "Snack & ocean brief",       body: "Shared snack while reading the Scripps buoy data and naming conditions." },
  { time: "10:45 – 12:30", title: "Water session I",           body: "The main training block — pool, shallows, or reserve depending on the day." },
  { time: "12:30 – 1:15",  title: "Lunch & journaling",        body: "Cold lunch, observation journal, species log." },
  { time: "1:15 – 2:30",   title: "Water session II",          body: "Second water block — longer dives, buddy pairs, deeper focus." },
  { time: "2:30 – 3:00",   title: "Closing circle",            body: "Reflect, log the day, set the hook for tomorrow." },
];

export default function CampDayRhythm() {
  return (
    <div className="camp-rhythm">
      <div className="camp-rhythm-header">
        <span className="eyebrow" style={{ color: "var(--teal)" }}>A day at camp</span>
        <h3>The same rhythm, every day.</h3>
        <p>Predictable structure is part of the safety model. Kids always know what&apos;s next — the only thing that changes is what they&apos;re learning.</p>
      </div>
      <ol className="camp-rhythm-list">
        {BLOCKS.map((b) => (
          <li key={b.time} className="camp-rhythm-block">
            <div className="camp-rhythm-time">{b.time}</div>
            <div className="camp-rhythm-body">
              <div className="camp-rhythm-title">{b.title}</div>
              <div className="camp-rhythm-desc">{b.body}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
