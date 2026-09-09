import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { analysisService } from '../services/api';
import { Compass, Sparkles, AlertCircle, Layers, Award, ArrowRight } from 'lucide-react';

const RecommendationsView = () => {
  const [data, setData] = useState({
    recommendedSkills: [],
    recommendedProjects: [],
    recommendedCertifications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecs();
  }, []);

  const fetchRecs = async () => {
    try {
      const res = await analysisService.getRecommendations();
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Personalized AI Recommendations <Compass className="w-5 h-5 text-brand-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Priority skill recommendations, suggested portfolio projects, and relevant certifications based on target JDs.
            </p>
          </div>

          <div className="mb-6">
            <DisclaimerBanner role="candidate" />
          </div>

          {loading ? (
            <div className="text-xs text-slate-400">Loading recommendations...</div>
          ) : (
            <div className="space-y-8">
              {/* Skill Recommendations */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-400" /> Recommended Skills to Learn
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {data.recommendedSkills && data.recommendedSkills.length > 0 ? (
                    data.recommendedSkills.map((sk, idx) => (
                      <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base text-white">{sk.skill}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            sk.importance === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            Priority {sk.order || idx + 1} • {sk.importance || 'Medium'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">{sk.reason}</p>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                          <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block mb-1">Suggested Project Idea</span>
                          <span className="text-slate-300 font-medium">{sk.projectIdea}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic col-span-2">Run a Job Description analysis first to generate personalized skill recommendations.</div>
                  )}
                </div>
              </div>

              {/* Portfolio Projects */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-400" /> Portfolio Project Suggestions
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.recommendedProjects && data.recommendedProjects.map((proj, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="font-bold text-sm text-white">{proj.title}</div>
                      <p className="text-xs text-slate-400">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-2">
                        {proj.techStack && proj.techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] rounded border border-violet-500/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RecommendationsView;
