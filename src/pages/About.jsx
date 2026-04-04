import React from 'react';
import { Link as LinkIcon, User, GraduationCap, Briefcase } from 'lucide-react';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { GlowCardGrid } from '../components/ui/GlowCardGrid';

const About = () => {
  const students = [
    { name: 'Aditya', role: 'Full Stack & Security' },
    { name: 'Divanshu Sajnani', role: 'AI Detection & Backend' },
    { name: 'Prayag Mehta', role: 'Steganography & Architecture' },
  ];

  const faculty = [
    { name: 'Ms. Mrunmayee Rahate', role: 'Project Guide' },
    { name: 'Dr. Vaishnaw Kale', role: 'Head of Department' }
  ];

  const renderCard = (person, type) => (
    <SpotlightCard key={person.name} glowColor="purple" size="md" className="card" customSize={true} width="100%" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid var(--color-outline-variant)' }}>
        {type === 'student' ? <User size={40} color="var(--color-primary-dim)" /> : <GraduationCap size={40} color="var(--color-secondary)" />}
      </div>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{person.name}</h3>
      <p className="text-dim" style={{ margin: '0 0 1.5rem 0', fontWeight: 500, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{person.role}</p>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', background: 'rgba(124,58,237,0.1)', marginTop: 'auto' }}>
        <LinkIcon size={16} /> LinkedIn
      </div>
    </SpotlightCard>
  );

  return (
    <div style={{ padding: '2.5rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>The <span className="lp-gradient-text">Team</span></h1>
        <p className="text-dim" style={{ maxWidth: '600px', margin: '0 auto' }}>
          SecureVault was developed as a final year BCA project under the guidance of our esteemed faculty.
        </p>
      </header>
      
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Briefcase color="var(--color-primary)" /> Project Developers
      </h2>
      <div style={{ marginBottom: '4rem' }}>
        <GlowCardGrid columns={3}>
          {students.map(p => renderCard(p, 'student'))}
        </GlowCardGrid>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <GraduationCap color="var(--color-secondary)" /> Faculty Mentors
      </h2>
      <GlowCardGrid columns={2}>
        {faculty.map(p => renderCard(p, 'faculty'))}
      </GlowCardGrid>
    </div>
  );
};

export default About;
