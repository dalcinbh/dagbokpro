"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Head from "../components/Head";
import AboutMe from "../components/AboutMe";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import axios from "axios";
import { ResumeData } from "../types";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function Home() {
  const { data: session, status } = useSession();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const fetchResumeData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/resume/`, {
        headers: { Authorization: `Bearer ${session?.accessToken || ""}` },
      });
      setResumeData(response.data);
    } catch (error) {
      console.error("Error fetching resume:", error);
      setResumeData(null); // Reset data on error
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchResumeData();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No resume data available. Please try again later.
      </div>
    );
  }

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