import React from 'react';
import ThreeBackground from './components/ThreeBackground';
import EarthHero from './components/EarthHero';
import Navbar from './components/Navbar';
import Section from './components/Section';
import Typewriter from './components/Typewriter';
import { EDUCATION, AWARDS, PROJECTS } from './constants';
import { ChevronDown, Github, Linkedin, Mail, Trophy, Cpu, Sparkles, ExternalLink, Globe, Code, Database } from 'lucide-react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error?: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    // console.log or send to tracking
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-white rounded-xl shadow-lg text-center">
          <h3 className="text-lg font-bold">error</h3>
          <p className="text-sm text-slate-500">地球可视化组件发生错误，已被禁用以保证页面可用。</p>
        </div>
      );
    }
    return this.props.children as any;
  }
}

const App: React.FC = () => {

  return (
    <div className="relative min-h-screen text-slate-800 selection:bg-cyan-200 selection:text-cyan-900 font-sans">
      {/* Global Particle Background */}
      <div className="fixed inset-0 z-0">
        <ThreeBackground />
      </div>

      {/* Navigation */}
      <Navbar />

      <main className="relative z-10 flex flex-col">

        {/* Hero Section: Future Tech Style */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-start pt-20 relative overflow-hidden">

          {/* Earth Container */}
          <div className="w-full h-[55vh] md:h-[75vh] relative z-10 animate-fade-in-slow flex-shrink-0 cursor-grab active:cursor-grabbing">
            <ErrorBoundary>
              <EarthHero />
            </ErrorBoundary>
          </div>

          {/* Text Content Overlay */}
          <div className="flex-grow w-full max-w-5xl mx-auto px-6 relative z-20 -mt-20 md:-mt-32 pb-12 pointer-events-none">
            <div className="glass-panel p-8 md:p-12 rounded-[2rem] text-center pointer-events-auto border-t border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.05)] animate-fade-in-up hover:shadow-[0_12px_48px_rgba(6,182,212,0.1)] transition-shadow duration-500">

              {/* Status Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 rounded-full bg-slate-50 border border-cyan-100/50 text-cyan-700 font-mono text-xs tracking-widest shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                SYSTEM ONLINE
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-7xl font-tech font-bold mb-6 tracking-tight text-slate-900 leading-tight">
                EXPLORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">INTELLIGENCE</span>
                <span className="block text-2xl md:text-3xl text-slate-400 font-medium tracking-widest mt-4 uppercase h-10 md:h-12">
                  <Typewriter text="Architecting Future Computing" speed={140} delay={800} />
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                我是<span className="font-semibold text-slate-800 border-b-2 border-cyan-200">王晓雨</span>，英文名是Raine.W，专注于海洋、人工智能与计算机科学。
                <br className="hidden md:block" />
                以代码为笔，算法为墨，绘制科技蓝图。
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row justify-center gap-5 mb-10">
                <a href="#about" className="group px-8 py-3.5 bg-slate-900 text-white rounded-full font-tech font-medium tracking-wide shadow-lg shadow-slate-900/20 hover:bg-cyan-600 transition-all duration-300 flex items-center justify-center gap-2">
                  Start Mission
                  <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
                </a>
                <a href="mailto:contact@example.com" className="px-8 py-3.5 bg-white/60 backdrop-blur-sm text-slate-700 border border-slate-200 rounded-full font-tech font-medium tracking-wide shadow-sm hover:border-cyan-400 hover:text-cyan-600 hover:bg-white transition-all duration-300">
                  Initialize Contact
                </a>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-8 text-slate-400">
                <Github className="w-6 h-6 hover:text-slate-900 cursor-pointer transition-all hover:scale-110 duration-200" />
                <Linkedin className="w-6 h-6 hover:text-blue-700 cursor-pointer transition-all hover:scale-110 duration-200" />
                <Mail className="w-6 h-6 hover:text-cyan-600 cursor-pointer transition-all hover:scale-110 duration-200" />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <Section id="about" className="bg-gradient-to-b from-white/0 to-white/50">
          <div className="grid md:grid-cols-2 gap-16 items-stretch">
            <div className="space-y-8">
              <h2 className="text-4xl font-tech font-bold text-slate-800 flex items-center gap-4">
                <span className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
                  <Sparkles size={24} />
                </span>
                关于我
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
                <p>
                  作为一名即将步入研究生阶段的山大学子，我对技术充满无限热情。过去四年里，我不仅在学术成绩上名列前茅，更积极投身于科研与竞赛之中。
                </p>
                <p>
                  我的研究兴趣主要集中在<strong className="text-cyan-600 font-semibold bg-cyan-50 px-1 rounded">海洋技术</strong>、<strong className="text-cyan-600 font-semibold bg-cyan-50 px-1 rounded">深度学习</strong>、<strong className="text-cyan-600 font-semibold bg-cyan-50 px-1 rounded">计算机视觉</strong>以及<strong className="text-cyan-600 font-semibold bg-cyan-50 px-1 rounded">大模型应用</strong>。我相信，技术应当服务于人类，通过工程算法解决实际问题是我不断前行的动力。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-6 bg-white/60 backdrop-blur rounded-2xl border border-slate-200/60 hover:border-cyan-200 transition-colors">
                  <div className="text-4xl font-mono font-bold text-slate-800 mb-2">3.9+</div>
                  <div className="text-xs font-tech font-bold text-cyan-600 tracking-widest uppercase">GPA (4.0 Scale)</div>
                </div>
                <div className="p-6 bg-white/60 backdrop-blur rounded-2xl border border-slate-200/60 hover:border-cyan-200 transition-colors">
                  <div className="text-4xl font-mono font-bold text-slate-800 mb-2">10+</div>
                  <div className="text-xs font-tech font-bold text-cyan-600 tracking-widest uppercase">Core Courses A+</div>
                </div>
              </div>
            </div>

            {/* Tech Card Visual */}
            <div className="relative group perspective-1000 h-full">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-700 animate-pulse-slow"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-white/60 transform transition-all duration-500 group-hover:rotate-1 group-hover:scale-[1.01] h-full">
                <div className="h-1/2 bg-gradient-to-br from-slate-50 to-cyan-50/30 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 grid-pattern opacity-10"></div>
                  <Cpu size={100} className="text-cyan-200 relative z-10" strokeWidth={0.8} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-400 rounded-full blur-[80px] opacity-20"></div>
                </div>
                <div className="p-10 flex flex-col justify-center text-center flex-grow">
                  <h3 className="text-2xl font-tech font-bold text-slate-800 mb-3">DEV & RESEARCHER</h3>
                  <div className="w-12 h-1 bg-cyan-500 mx-auto rounded-full mb-6"></div>
                  <p className="text-slate-500 font-mono text-sm leading-relaxed">
                    "Code is poetry,<br />Logic is art."
                  </p>
                  <div className="mt-auto flex justify-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-400 tracking-wider">PYTHON</div>
                    <div className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-400 tracking-wider">C++</div>
                    <div className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-400 tracking-wider">AI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Education Section */}
        <Section id="education" title="求学经历" subtitle="ACADEMIC JOURNEY">
          <div className="space-y-6 max-w-5xl mx-auto">
            {EDUCATION.map((edu, index) => (
              <div key={edu.id} className="group relative bg-white/40 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/80 transition-all duration-500 border border-slate-200/50 hover:border-cyan-100 hover:shadow-xl hover:shadow-cyan-900/5">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Date Column */}
                  <div className="md:w-48 flex-shrink-0">
                    <div className="font-mono text-4xl text-slate-200 font-bold group-hover:text-cyan-100 transition-colors">
                      {edu.date.split(' - ')[0]}
                    </div>
                    <div className="text-xs font-bold text-cyan-600 tracking-widest uppercase mt-1">
                      {edu.date.split(' - ')[1]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-tech font-bold text-slate-800 mb-1 group-hover:text-cyan-700 transition-colors">{edu.institution}</h3>
                    <p className="text-slate-500 font-medium mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      {edu.title}
                    </p>
                    <p className="text-slate-600 mb-6 leading-relaxed font-light border-l-2 border-slate-100 pl-4">
                      {edu.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {edu.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white text-slate-500 text-xs font-semibold rounded border border-slate-100 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Awards Section */}
        <Section id="awards" title="竞赛与荣誉" subtitle="ACHIEVEMENTS" className="bg-slate-50/50">
          <div className="grid md:grid-cols-3 gap-8">
            {AWARDS.map((award, idx) => (
              <div key={award.id} className="bg-white/80 backdrop-blur rounded-2xl p-8 border border-white shadow-sm hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-900/10 transition-all duration-300 flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-50 rounded-xl flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-110 transition-transform">
                    <Trophy size={24} />
                  </div>
                  <span className="font-mono text-5xl text-slate-100 font-bold -mt-4 -mr-4 group-hover:text-cyan-50 transition-colors">0{idx + 1}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 font-tech group-hover:text-cyan-700 transition-colors">{award.title}</h3>
                <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-4">{award.institution}</p>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-grow">{award.description}</p>
                <div className="pt-4 border-t border-slate-50 flex flex-wrap gap-2 mt-auto">
                  {award.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Projects Section */}
        <Section id="projects" title="科创成果" subtitle="INNOVATION LAB">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project) => (
              <div key={project.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-cyan-900/10 transition-all duration-500 flex flex-col h-full border border-slate-100 relative">

                {/* Image Area */}
                <div className="relative h-60 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-200"></div>
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase rounded border border-white/30">
                      {project.category}
                    </span>
                  </div>

                  {/* Tech Icons (Floating) */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white border border-white/30"><Code size={14} /></div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white border border-white/30"><Database size={14} /></div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-grow bg-white relative z-10">
                  <h3 className="text-xl font-bold font-tech text-slate-800 mb-3 group-hover:text-cyan-600 transition-colors leading-tight">{project.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed font-light">
                    {project.description}
                  </p>

                  <div className="space-y-6 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map(stack => (
                        <span key={stack} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded border border-slate-100 uppercase tracking-wide">
                          {stack}
                        </span>
                      ))}
                    </div>
                    <button className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 uppercase">
                      View Project <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-lg border-t border-slate-200 py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div className="w-16 h-1 bg-cyan-500 mx-auto mb-10 rounded-full"></div>
            <h2 className="text-4xl font-tech font-bold text-slate-800 mb-6 tracking-tight">LET'S BUILD THE FUTURE</h2>
            <p className="text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed font-light">
              Open to research collaborations, innovative projects, and technical discussions.
            </p>
            <div className="flex justify-center gap-8 mb-16">
              <a href="#" className="p-4 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"><Github size={24} /></a>
              <a href="#" className="p-4 rounded-full bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"><Linkedin size={24} /></a>
              <a href="#" className="p-4 rounded-full bg-slate-50 text-slate-400 hover:bg-cyan-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"><Mail size={24} /></a>
            </div>
            <div className="text-slate-400 text-xs font-mono tracking-widest">
              © 2025 PORTFOLIO. Authored by Raine.W. All rights reserved.
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default App;