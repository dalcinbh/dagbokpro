"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Head from "../components/Head";
import AboutMe from "../components/AboutMe";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import axios from "axios";
import { ResumeData} from "../types";

export default function Home() {
  const { data: session, status } = useSession();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    if (session && session.accessToken) {
      const fetchResume = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/resume/`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setResumeData(response.data);
        } catch (error) {
          console.error("Error fetching resume:", error);
        }
      };
      fetchResume();
    }
  }, [session]);

  if (status === "loading") return <div>Loading...</div>;
  if (!resumeData) return null;

  return (
    <>
      <Head title={resumeData.title} />
      <AboutMe content={resumeData.summary} additionalInfo={resumeData.additional_information} />
      <Education items={resumeData.education} />
      <Experience items={resumeData.experience} />
      <Skills items={resumeData.skills} />
    </>
  );
}