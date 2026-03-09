'use client';

import { useState } from 'react';
import Hero from './Hero';
import QuickForm from './QuickForm';

export default function LandingClient() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <Hero onCTAClick={() => setFormOpen(true)} />
      {formOpen && <QuickForm onClose={() => setFormOpen(false)} />}
    </>
  );
}
