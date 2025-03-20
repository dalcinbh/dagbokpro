'use client';

import { useRef, useEffect, useState } from 'react';
import Head from '../components/Head';
import AboutMe from '../components/AboutMe';
import Education from '../components/Education';
import Experience from '../components/Experience';
import Skills from '../components/Skills';

export default function Home({ resumeData }) {
  if (!resumeData) return <div>Erro ao carregar dados. Redirecionando para login...</div>;

  return (
    <>
      <Head title={resumeData?.title} />
      <AboutMe content={resumeData?.summary} additionalInfo={resumeData?.additionalInformation} />
      <Education items={resumeData?.education} />
      <Experience items={resumeData?.experience} />
      <Skills items={resumeData?.skills} />
    </>
  );
}