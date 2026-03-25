// Define the type for a single event based on the business details JSON
export type Event = {
  id: string;
  title: string;
  short_description: string | null;
  full_description: string | null;
  start_datetime: string | null;
  end_datetime: string | null;
  category: string | null;
  location_text?: string | null;
  ticket_url?: string | null;
  slug?: string | null;
  hero_image_url?: string | null;
};

type EventsProps = {
  events: Event[];
};

const formatEventDate = (dateString: string | null) => {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata', // IST
    });
  } catch (e) {
    console.error("Invalid date string:", dateString);
    return null;
  }
};

function Events({ events }: EventsProps) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section id="events" className="events">
      <div className="container">
        <h2>Upcoming Events</h2>
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <div className="event-details">
                {event.start_datetime && (
                  <p><strong>Date:</strong> {formatEventDate(event.start_datetime)}</p>
                )}
                {event.location_text && (
                  <p><strong>Location:</strong> {event.location_text}</p>
                )}
              </div>
              {(event.full_description || event.short_description)?.split('\n').map((paragraph, index) => (
                paragraph && <p key={index}>{paragraph}</p>
              ))}
              {event.ticket_url && (
                <div style={{ marginTop: '20px' }}>
                  <a href={event.ticket_url} className="btn" target="_blank" rel="noopener noreferrer">
                    Register Now
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Events;