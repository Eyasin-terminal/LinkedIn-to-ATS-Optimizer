
import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  return (
    <div id="resume-container" className="bg-white p-10 shadow-lg mx-auto max-w-[800px] text-slate-900 border border-slate-200 print:p-0">
      {/* Header */}
      <header className="text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-widest">{data.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 text-sm mt-2 text-slate-600">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span className="print:before:content-['•_']"> {data.phone}</span>}
          {data.location && <span className="print:before:content-['•_']"> {data.location}</span>}
          {data.linkedinUrl && <span className="print:before:content-['•_']"> <a href={data.linkedinUrl} className="underline">{data.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}</a></span>}
        </div>
      </header>

      {/* Summary */}
      {data.professionalSummary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-justify">{data.professionalSummary}</p>
        </section>
      )}

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-2">Work Experience</h2>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="mb-4 experience-item">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-md">{exp.title}</h3>
              <span className="text-sm italic whitespace-nowrap">{exp.startDate} – {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-semibold">{exp.company}</span>
              <span className="text-sm text-slate-500">{exp.location}</span>
            </div>
            <ul className="list-disc list-outside ml-5 text-sm space-y-1">
              {exp.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-2">Skills & Competencies</h2>
        <div className="grid grid-cols-1 gap-1">
          {data.skills.map((skillGroup, idx) => (
            <p key={idx} className="text-sm">
              <span className="font-bold">{skillGroup.category}:</span> {skillGroup.items.join(', ')}
            </p>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-2">Education</h2>
        {data.education.map((edu, idx) => (
          <div key={idx} className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-sm">{edu.degree}</h3>
              <span className="text-sm italic">{edu.graduationDate}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm">{edu.institution}</span>
              <span className="text-sm text-slate-500">{edu.location}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-2">Certifications</h2>
          <ul className="list-disc list-outside ml-5 text-sm">
            {data.certifications.map((cert, idx) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ResumePreview;
