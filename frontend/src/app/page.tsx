'use client';

import { useState, useEffect, useRef } from 'react';
import Head from '../components/Head';
import AboutMe from '../components/AboutMe';
import Education from '../components/Education';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Summary {
  professional_summary?: string;
}

interface ExperienceEntry {
  company?: string;
  role?: string;
  timeline?: string;
  description?: string;
  highlights?: string[];
}

interface Education {
  [key: string]: string | string[];
}

interface AdditionalInformation {
  languages?: string[];
  citizenship?: string;
  availability?: string;
  interests?: string;
}

interface ResumeData {
  title?: string;
  summary?: Summary;
  education?: Education;
  experience?: ExperienceEntry[];
  skills?: string[];
  additional_information?: AdditionalInformation;
  [key: string]: any;
}

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch('https://api.dagbok.pro/resume/');
        const data: ResumeData = await response.json();
        setResumeData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resume:', error);
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const exportToPDF = async () => {
    console.log('Export to PDF triggered');
    if (resumeRef.current) {
      try {
        const canvas = await html2canvas(resumeRef.current, {
          scale: 2,
          useCORS: true,
          ignoreElements: (element) => element.className.includes('no-print'), // Ignora elementos com classe no-print, se necessário
          logging: true, // Habilita logs para depuração
          foreignObjectRendering: false, // Desativa rendering de objetos externos que podem causar erros
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('resume.pdf');
      } catch (error) {
        console.error('PDF Export Error:', error);
        // Fallback para impressão, se falhar
        console.log('Falling back to window.print()');
        window.print();
      }
    } else {
      console.error('resumeRef is null');
    }
  };

  const exportToDocx = async () => {
    console.log('Export to DOCX triggered');
    if (!resumeData) {
      console.error('resumeData is null');
      return;
    }

    const children: Paragraph[] = [];

    // Title
    children.push(
      new Paragraph({
        text: resumeData.title || 'My Resume',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );

    // About Me
    if (resumeData.summary?.professional_summary) {
      children.push(
        new Paragraph({
          text: 'About Me',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: resumeData.summary.professional_summary,
        })
      );
    }
    if (resumeData.additional_information) {
      if (resumeData.additional_information.availability) {
        children.push(
          new Paragraph({
            text: 'Availability: ' + resumeData.additional_information.availability,
          })
        );
      }
      if (resumeData.additional_information.interests) {
        children.push(
          new Paragraph({
            text: 'Interests: ' + resumeData.additional_information.interests,
          })
        );
      }
      if (resumeData.additional_information.languages) {
        children.push(
          new Paragraph({
            text: 'Languages: ' + resumeData.additional_information.languages.join(', '),
          })
        );
      }
    }

    // Education
    if (resumeData.education) {
      children.push(
        new Paragraph({
          text: 'Education',
          heading: HeadingLevel.HEADING_2,
        })
      );
      Object.entries(resumeData.education).forEach(([institution, details]) => {
        const text = Array.isArray(details) ? details.join(', ') : details;
        children.push(
          new Paragraph({
            text: `${institution}: ${text}`,
          })
        );
      });
    }

    // Experience
    if (resumeData.experience) {
      children.push(
        new Paragraph({
          text: 'Experience',
          heading: HeadingLevel.HEADING_2,
        })
      );
      resumeData.experience.forEach((exp) => {
        children.push(
          new Paragraph({
            text: `${exp.company || ''} - ${exp.role || ''} (${exp.timeline || ''})`,
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: exp.description || '',
          })
        );
        if (exp.highlights && exp.highlights.length > 0) {
          exp.highlights.forEach((highlight) => {
            children.push(
              new Paragraph({
                text: `- ${highlight}`,
                bullet: { level: 0 },
              })
            );
          });
        }
      });
    }

    // Skills
    if (resumeData.skills) {
      children.push(
        new Paragraph({
          text: 'Skills',
          heading: HeadingLevel.HEADING_2,
        })
      );
      resumeData.skills.forEach((skill) => {
        children.push(
          new Paragraph({
            text: `- ${skill}`,
            bullet: { level: 0 },
          })
        );
      });
    }

    // Additional Information (Citizenship)
    if (resumeData.additional_information?.citizenship) {
      children.push(
        new Paragraph({
          text: 'Additional Information',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: 'Citizenship: ' + resumeData.additional_information.citizenship,
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          children: children,
        },
      ],
    });

    try {
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'resume.docx');
      console.log('DOCX exported successfully');
    } catch (error) {
      console.error('DOCX Export Error:', error);
    }
  };

  const exportToTXT = () => {
    console.log('Export to TXT triggered');
    if (!resumeData) {
      console.error('resumeData is null');
      return;
    }

    let text = '';
    text += `${resumeData.title || 'My Resume'}\n\n`;
    text += '=== About Me ===\n';
    if (resumeData.summary?.professional_summary) {
      text += `${resumeData.summary.professional_summary}\n`;
    }
    if (resumeData.additional_information) {
      if (resumeData.additional_information.availability) {
        text += `Availability: ${resumeData.additional_information.availability}\n`;
      }
      if (resumeData.additional_information.interests) {
        text += `Interests: ${resumeData.additional_information.interests}\n`;
      }
      if (resumeData.additional_information.languages) {
        text += `Languages: ${resumeData.additional_information.languages.join(', ')}\n`;
      }
    }
    text += '\n=== Education ===\n';
    if (resumeData.education) {
      Object.entries(resumeData.education).forEach(([institution, details]) => {
        const textDetails = Array.isArray(details) ? details.join(', ') : details;
        text += `${institution}: ${textDetails}\n`;
      });
    }
    text += '\n=== Experience ===\n';
    if (resumeData.experience) {
      resumeData.experience.forEach((exp) => {
        text += `${exp.company || ''} - ${exp.role || ''} (${exp.timeline || ''})\n`;
        if (exp.description) text += `${exp.description}\n`;
        if (exp.highlights && exp.highlights.length > 0) {
          text += exp.highlights.map((h) => `- ${h}`).join('\n') + '\n';
        }
        text += '\n';
      });
    }
    text += '\n=== Skills ===\n';
    if (resumeData.skills) {
      text += resumeData.skills.map((skill) => `- ${skill}`).join('\n') + '\n';
    }
    text += '\n=== Additional Information ===\n';
    if (resumeData.additional_information?.citizenship) {
      text += `Citizenship: ${resumeData.additional_information.citizenship}\n`;
    }

    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'resume.txt');
      console.log('TXT exported successfully');
    } catch (error) {
      console.error('TXT Export Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-600">Error loading resume data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Botão de Exportação */}
        <div className="mb-6 flex justify-end space-x-4">
          <button
            onClick={exportToPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Export to PDF
          </button>
          <button
            onClick={exportToDocx}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Export to DOCX
          </button>
          <button
            onClick={exportToTXT}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Export to TXT
          </button>
        </div>

        {/* Conteúdo do Currículo */}
        <div ref={resumeRef}>
          <Head title={resumeData.title} />
          {resumeData.summary && (
            <AboutMe
              content={resumeData.summary}
              additionalInfo={resumeData.additional_information}
            />
          )}
          <Education items={resumeData.education} />
          <Experience items={resumeData.experience} />
          <Skills items={resumeData.skills} />
          {resumeData.additional_information && (
            <section className="my-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Information</h2>
              {resumeData.additional_information.citizenship && (
                <p className="mt-2 text-gray-700">
                  <strong className="text-gray-900">Citizenship:</strong>{' '}
                  {resumeData.additional_information.citizenship}
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}