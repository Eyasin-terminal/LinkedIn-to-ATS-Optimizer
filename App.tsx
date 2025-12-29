
import React, { useState, useRef, useEffect } from 'react';
import { parseLinkedInToATS, generateMockImage } from './services/geminiService';
import { ResumeData } from './types';
import ResumePreview from './components/ResumePreview';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Image Generation States
  const [beforeImg, setBeforeImg] = useState<string | null>(null);
  const [afterImg, setAfterImg] = useState<string | null>(null);
  const [generatingImages, setGeneratingImages] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMocks = async () => {
      setGeneratingImages(true);
      const [before, after] = await Promise.all([
        generateMockImage("A messy, 2-column LinkedIn profile PDF document with profile pictures, blue icons, and abstract text sidebars, high resolution, white background, realistic professional look."),
        generateMockImage("A clean, professional, single-column modern ATS-friendly resume document with minimalist headings, structured bullet points, and elegant typography, high resolution, white background.")
      ]);
      setBeforeImg(before);
      setAfterImg(after);
      setGeneratingImages(false);
    };
    fetchMocks();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProcess = async () => {
    if (!file) {
      setError('Please select a LinkedIn PDF profile first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const base64Data = await fileToBase64(file);
      const result = await parseLinkedInToATS(base64Data);
      setResumeData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during processing.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setResumeData(null);
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (resumeData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8 no-print border-b border-slate-100 flex justify-between items-center">
          <button 
            onClick={handleReset}
            className="text-[#475569] hover:text-[#0F172A] font-semibold flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Home
          </button>
          <button
            onClick={handlePrint}
            className="bg-[#1F3A5F] hover:bg-[#152945] text-white px-8 py-3 rounded-lg font-bold shadow-xl transition-all"
          >
            Save as PDF
          </button>
        </div>
        <div className="py-12">
          <ResumePreview data={resumeData} />
        </div>
        <div className="no-print bg-[#F7F9FC] py-12 px-4 border-t border-slate-200">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3 className="font-bold text-[#0F172A]">Next Steps</h3>
            <p className="text-sm text-[#475569]">Save this PDF and submit it directly to job applications. Hiring software will now be able to extract your data with high accuracy.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="no-print overflow-x-hidden bg-[#F7F9FC]">
      {/* 1. HERO SECTION */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-8 text-xs font-black tracking-widest text-[#2FA4A9] uppercase bg-teal-50 rounded-full border border-teal-100">
            Professional AI Optimizer
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-[#0F172A] mb-8 tracking-tighter leading-[1.1]">
            Make Your LinkedIn Resume <br className="hidden md:block" />
            Readable by <span className="text-[#1F3A5F]">ATS Systems</span>
          </h1>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Most Applicant Tracking Systems cannot correctly parse LinkedIn’s default PDF. 
            Our AI converts it into a clean, ATS-compatible resume in seconds.
          </p>

          <div className="max-w-xl mx-auto">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-[#2FA4A9] transition-all cursor-pointer relative overflow-hidden"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              <div className="flex flex-col items-center gap-6">
                {file ? (
                  <div className="flex items-center gap-4 bg-teal-50 p-4 rounded-2xl border border-teal-100 w-full">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <svg className="w-8 h-8 text-[#2FA4A9]" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /></svg>
                    </div>
                    <span className="font-bold text-[#1F3A5F] truncate">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-[#F7F9FC] rounded-[1.5rem] flex items-center justify-center group-hover:bg-teal-50 transition-colors shadow-inner">
                      <svg className="w-10 h-10 text-[#1F3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#0F172A] font-extrabold text-xl">Upload LinkedIn PDF</p>
                      <p className="text-[#94A3B8] text-sm">Drag and drop or click to browse</p>
                    </div>
                  </>
                )}
                
                <button 
                  onClick={(e) => {
                    if (file) {
                      e.stopPropagation();
                      handleProcess();
                    }
                  }}
                  disabled={loading}
                  className={`w-full py-5 px-8 rounded-2xl text-white font-black text-lg transition-all shadow-xl hover:shadow-2xl ${
                    loading ? 'bg-slate-300' : 'bg-[#2FA4A9] hover:bg-[#258a8f] active:scale-[0.98]'
                  } ${!file ? 'opacity-50' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI Optimization...
                    </span>
                  ) : (
                    file ? 'Generate ATS CV' : 'Select File'
                  )}
                </button>
                <div className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider">
                  Free PDF • Secure • Private
                </div>
              </div>
            </div>
            {error && <div className="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 font-bold shadow-sm">{error}</div>}
          </div>
        </div>
      </section>

      {/* 2. PROBLEM REVELATION */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-[#0F172A] leading-tight">Why many resumes never <br/>reach a recruiter</h2>
            <p className="text-[#475569] text-lg leading-relaxed font-medium">
              Modern hiring software scans resumes before humans do. 
              LinkedIn’s PDF format uses multi-column layouts and visual elements that often confuse these systems — 
              leading to incomplete or rejected applications.
            </p>
            <div className="inline-flex items-center gap-2 text-[#2FA4A9] font-bold text-sm uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              Solved by our AI
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {[
              { t: 'Multi-column confusion', d: 'Standard scanners fail to read text across columns correctly.' },
              { t: 'Unreadable Icons & Symbols', d: 'Visual markers often translate into garbled characters in hiring systems.' },
              { t: 'Missing Metadata Fields', d: 'Essential info like location or contact might be skipped entirely.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start p-6 bg-[#F7F9FC] rounded-[1.5rem] border border-slate-100 transition-all hover:translate-x-2">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-400 shadow-sm border border-red-50">✕</div>
                <div>
                  <h4 className="font-bold text-[#1F3A5F] mb-1">{item.t}</h4>
                  <p className="text-sm text-[#94A3B8] font-medium">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BEFORE / AFTER with GENERATED IMAGES */}
      <section className="py-24 bg-[#F7F9FC]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-[#0F172A]">From ATS-unfriendly to ATS-ready</h2>
            <p className="text-[#475569] font-medium">See the difference AI restructuring makes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Before Card */}
            <div className="group">
              <div className="relative bg-white p-2 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border-4 border-white overflow-hidden transition-all group-hover:shadow-2xl">
                {generatingImages ? (
                  <div className="aspect-[3/4] bg-slate-100 animate-pulse flex items-center justify-center">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Generating Mock...</span>
                  </div>
                ) : (
                  <img src={beforeImg || ''} alt="LinkedIn PDF Mock" className="w-full aspect-[3/4] object-cover rounded-[1.5rem] grayscale group-hover:grayscale-0 transition-all duration-700" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-600/90 to-transparent p-6 pt-12">
                  <span className="text-white font-black text-sm uppercase tracking-[0.2em]">LinkedIn Export</span>
                </div>
              </div>
              <ul className="mt-8 space-y-3 px-2">
                {['Complex Two-column layout', 'Visual icons and markers', 'Scanning errors likely'].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-[#475569]">
                    <span className="text-red-400">✕</span> {li}
                  </li>
                ))}
              </ul>
            </div>

            {/* After Card */}
            <div className="group">
              <div className="relative bg-white p-2 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border-4 border-white overflow-hidden transition-all group-hover:shadow-2xl">
                {generatingImages ? (
                  <div className="aspect-[3/4] bg-slate-100 animate-pulse flex items-center justify-center">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Generating Mock...</span>
                  </div>
                ) : (
                  <img src={afterImg || ''} alt="ATS Optimized Mock" className="w-full aspect-[3/4] object-cover rounded-[1.5rem]" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2FA4A9]/90 to-transparent p-6 pt-12">
                  <span className="text-white font-black text-sm uppercase tracking-[0.2em]">AI Optimized</span>
                </div>
              </div>
              <ul className="mt-8 space-y-3 px-2">
                {['Single-column hierarchy', 'Clear section markers', '100% ATS Readable'].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-[#475569]">
                    <span className="text-[#2FA4A9]">✔</span> {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-black text-[#0F172A] mb-20">Three simple steps</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { n: '01', t: 'Upload', d: 'Upload your LinkedIn profile PDF export' },
              { n: '02', t: 'Optimize', d: 'AI restructures layout and enhances content for ATS' },
              { n: '03', t: 'Download', d: 'Get a professional, ready-to-use resume PDF' }
            ].map((s, i) => (
              <div key={i} className="relative text-center group">
                <div className="text-8xl font-black text-[#F7F9FC] absolute -top-12 left-1/2 -translate-x-1/2 select-none z-0 transition-colors group-hover:text-teal-50" style={{ WebkitTextStroke: '2px #E2E8F0' }}>{s.n}</div>
                <div className="relative z-10 pt-4 space-y-4">
                  <h4 className="text-2xl font-black text-[#1F3A5F]">{s.t}</h4>
                  <p className="text-[#475569] font-medium leading-relaxed px-4">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <div className="inline-block bg-[#F7F9FC] px-8 py-3 rounded-full text-[#94A3B8] font-bold text-sm border border-slate-100">
               ⏱️ Average processing time: <span className="text-[#1F3A5F]">under 30 seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY THIS TOOL */}
      <section className="py-24 bg-[#F7F9FC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black text-[#0F172A]">Designed for hiring systems</h2>
            <p className="text-[#475569] font-medium text-lg">Not just a cosmetic update — a structural transformation.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              { t: 'Impact-Focused Bullet Points', d: 'Experience descriptions refined to highlight outcomes and results using STAR methodology.' },
              { t: 'ATS-Compatible Structure', d: 'Single-column layout compatible with all major ATS platforms including Workday and Greenhouse.' },
              { t: 'Intelligent Skill Categorization', d: 'Skills grouped logically for accurate keyword parsing and technical verification.' },
              { t: 'Scanner-Safe Fonts', d: 'Standard typography recognized by OCR and document parsing software globally.' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 flex gap-6 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#2FA4A9] font-black text-2xl flex-shrink-0">✔</div>
                <div>
                  <h4 className="text-xl font-bold text-[#1F3A5F] mb-3">{f.t}</h4>
                  <p className="text-[#475569] leading-relaxed font-medium">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FREE VS PREMIUM */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-4xl font-black text-[#0F172A] mb-16">Choose the format that fits your needs</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-10 rounded-[2.5rem] border-2 border-[#2FA4A9] relative bg-white flex flex-col shadow-[0_20px_50px_rgba(47,164,169,0.1)]">
              <div className="absolute top-0 right-10 bg-[#2FA4A9] text-white px-6 py-2 rounded-b-2xl font-black text-xs uppercase tracking-[0.2em]">CURRENT</div>
              <h3 className="text-2xl font-black text-[#1F3A5F] mb-6">Free — PDF Resume</h3>
              <ul className="space-y-4 mb-10 text-[#475569] flex-grow font-medium">
                <li className="flex gap-4 items-center"><span className="text-[#2FA4A9] font-bold">✔</span> ATS-optimized layout</li>
                <li className="flex gap-4 items-center"><span className="text-[#2FA4A9] font-bold">✔</span> Professional formatting</li>
                <li className="flex gap-4 items-center"><span className="text-[#2FA4A9] font-bold">✔</span> Ready for online applications</li>
              </ul>
              <div className="text-2xl font-black text-[#2FA4A9]">Included at no cost</div>
            </div>
            <div className="p-10 rounded-[2.5rem] border-2 border-slate-100 bg-slate-50 flex flex-col opacity-60 grayscale group">
              <h3 className="text-2xl font-black text-[#1F3A5F] mb-6">Premium — Editable DOC</h3>
              <ul className="space-y-4 mb-10 text-[#475569] flex-grow font-medium">
                <li className="flex gap-4 items-center"><span className="font-bold">✔</span> Fully editable Word format</li>
                <li className="flex gap-4 items-center"><span className="font-bold">✔</span> Ideal for job-specific customization</li>
                <li className="flex gap-4 items-center"><span className="font-bold">✔</span> Advanced formatting controls</li>
              </ul>
              <div className="text-sm font-black text-[#94A3B8] uppercase tracking-widest bg-white border border-slate-200 inline-block px-4 py-2 rounded-xl self-start">COMING SOON</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRIVACY & TRUST */}
      <section className="py-24 bg-[#1F3A5F] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 border-8 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border-8 border-white rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block mb-6 p-4 rounded-full bg-white/10 backdrop-blur-md">
            <svg className="w-10 h-10 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h2 className="text-4xl font-black mb-8">Your data is handled responsibly</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Your resume is processed securely using trusted AI infrastructure. 
            Files are handled in temporary memory and are never stored or shared with third parties.
          </p>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-center text-4xl font-black text-[#0F172A] mb-16">Frequently Asked Questions</h2>
          <div className="space-y-12">
            <div className="group">
              <h4 className="text-xl font-bold text-[#1F3A5F] mb-4 group-hover:text-[#2FA4A9] transition-colors">Why can’t I use LinkedIn’s PDF directly?</h4>
              <p className="text-[#475569] font-medium leading-relaxed">LinkedIn’s layout is designed for visual viewing, not for automated resume parsing systems. Many systems fail to extract text correctly from multi-column designs, leading to your application being discarded instantly.</p>
            </div>
            <div className="group">
              <h4 className="text-xl font-bold text-[#1F3A5F] mb-4 group-hover:text-[#2FA4A9] transition-colors">Can I regenerate my resume later?</h4>
              <p className="text-[#475569] font-medium leading-relaxed">Absolutely. Update your LinkedIn profile and re-upload the new PDF anytime to keep your ATS version current and optimized for your latest experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-32 bg-[#F7F9FC]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-12 tracking-tight">Give your resume the structure <br/>hiring systems expect</h2>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#2FA4A9] hover:bg-[#258a8f] text-white px-16 py-6 rounded-[2rem] font-black text-2xl shadow-[0_20px_60px_rgba(47,164,169,0.3)] transition-all hover:-translate-y-2 active:translate-y-0"
          >
            Upload LinkedIn PDF
          </button>
          <div className="mt-8 text-[#94A3B8] text-sm font-black uppercase tracking-[0.3em]">
            Free • Professional • Secure
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-slate-200 text-center bg-white">
        <p className="text-[#94A3B8] text-xs font-black uppercase tracking-[0.4em]">
          &copy; {new Date().getFullYear()} LinkedIn to ATS Optimizer • Professional Document Engine
        </p>
      </footer>
    </div>
  );
};

export default App;
