'use client';

import { TemplateProps } from '../types';

export default function PlaceholderTemplate({ businessData }: TemplateProps) {
  const {
    name, businessType, city, phone, email, address,
    tagline, subTagline, description, hours,
    services, gallery, testimonials, faq, stats,
    certifications, serviceAreas,
  } = businessData;

  const sectionStyle: React.CSSProperties = {
    marginBottom: 40,
    paddingBottom: 40,
    borderBottom: '1px solid #eee',
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: '48px 24px', color: '#111' }}>
      {/* Dev banner */}
      <div style={{ background: '#FFF3CD', border: '1.5px solid #FFC107', borderRadius: 8, padding: '14px 20px', marginBottom: 40 }}>
        <strong style={{ color: '#856404' }}>Placeholder Template</strong>
        <span style={{ color: '#856404', marginLeft: 10 }}>
          The pipeline is working. Replace this with a real template from the registry.
        </span>
      </div>

      {/* Hero */}
      <section style={sectionStyle}>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 8 }}>{name}</h1>
        {tagline && <p style={{ fontSize: 24, color: '#444', marginBottom: 6 }}>{tagline}</p>}
        {subTagline && <p style={{ fontSize: 18, color: '#666', marginBottom: 12 }}>{subTagline}</p>}
        <p style={{ fontSize: 13, color: '#999' }}>{businessType} &bull; {city}</p>
      </section>

      {/* About */}
      {description && (
        <section style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>About</h2>
          <p style={{ lineHeight: 1.75, color: '#444' }}>{description}</p>
        </section>
      )}

      {/* Services */}
      {services && services.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Services</h2>
          {services.map((s, i) => (
            <div key={i} style={{ padding: 16, border: '1px solid #eee', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <strong>{s.name}</strong>
                {s.price && <span style={{ color: '#E6501E', fontWeight: 700 }}>{s.price}</span>}
              </div>
              {s.duration && <p style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{s.duration}</p>}
              {s.description && <p style={{ fontSize: 14, color: '#555' }}>{s.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Gallery */}
      {gallery && gallery.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Gallery</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {gallery.map((g, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img
                  src={g.imageUrl}
                  alt={g.label ?? ''}
                  style={{ width: 200, height: 150, objectFit: 'cover', borderRadius: 8, display: 'block' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <span style={{ fontSize: 11, color: '#888', display: 'block', marginTop: 4 }}>
                  {g.type}{g.label ? ` — ${g.label}` : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      {stats && stats.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Stats</h2>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#E6501E' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Reviews</h2>
          {testimonials.map((t, i) => (
            <div key={i} style={{ padding: 16, background: '#fafafa', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ color: '#E6501E', marginBottom: 6 }}>{'★'.repeat(t.rating)}</div>
              <p style={{ color: '#333', marginBottom: 8, fontStyle: 'italic' }}>&apos;{t.text}&apos;</p>
              <strong style={{ fontSize: 14 }}>{t.name}</strong>
              {t.context && <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>{t.context}</span>}
            </div>
          ))}
        </section>
      )}

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>FAQ</h2>
          {faq.map((f, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <strong style={{ color: '#111', display: 'block', marginBottom: 6 }}>{f.q}</strong>
              <p style={{ color: '#555', lineHeight: 1.65 }}>{f.a}</p>
            </div>
          ))}
        </section>
      )}

      {/* Contact */}
      <section>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Contact</h2>
        {phone   && <p>Phone: <a href={`tel:${phone}`}>{phone}</a></p>}
        {email   && <p>Email: <a href={`mailto:${email}`}>{email}</a></p>}
        {address && <p>Address: {address}</p>}
        <p>City: {city}</p>
        {serviceAreas && serviceAreas.length > 0 && (
          <p>Service areas: {serviceAreas.join(', ')}</p>
        )}
        {hours && (
          <div style={{ marginTop: 12 }}>
            {hours.weekdays && <p>Weekdays: {hours.weekdays}</p>}
            {hours.saturday && <p>Saturday: {hours.saturday}</p>}
            {hours.sunday   && <p>Sunday: {hours.sunday}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
