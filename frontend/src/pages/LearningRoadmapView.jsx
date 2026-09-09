import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { analysisService } from '../services/api';
import { Map, CheckCircle2, Circle, Sparkles } from 'lucide-react';

const LearningRoadmapView = () => {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await analysisService.getRoadmap();
      setRoadmap(res.data.roadmap || []);
    } catch (err) {
      console.error('Failed to fetch roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (key) => {
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Personalized Career Growth Roadmap <Map className="w-5 h-5 text-brand-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Dynamic week-by-week action plan tailored specifically to target missing skills and job requirements.
            </p>
          </div>

          <div className="mb-6">
            <DisclaimerBanner role="candidate" />
          </div>

          {loading ? (
            <div className="text-xs text-slate-400">Loading learning roadmap...</div>
          ) : roadmap.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-xs text-slate-400 border border-slate-800">
              No roadmap generated yet. Run a Job Description analysis to generate a personalized learning roadmap.
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl">
              {roadmap.map((weekItem, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-black text-sm">
                        W{weekItem.week || idx + 1}
                      </span>
                      <h3 className="font-bold text-base text-white">{weekItem.topic}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 pl-11">
                    {weekItem.tasks && weekItem.tasks.map((task, tIdx) => {
                      const taskKey = `w${idx}-t${tIdx}`;
                      const isDone = completedTasks[taskKey];
                      return (
                        <div
                          key={tIdx}
                          onClick={() => toggleTask(taskKey)}
                          className={`p-3 rounded-xl border text-xs flex items-center gap-3 cursor-pointer transition-all ${
                            isDone
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 line-through'
                              : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span>{task}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LearningRoadmapView;
