
import React, { useState } from 'react';
import { Course, CourseModule } from '../types';
import { generateCourseSyllabus } from '../services/geminiService';
import { 
  GraduationCap, 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Plus, 
  Library,
  Trophy,
  Clock
} from 'lucide-react';

export const LearnOS: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      description: 'Learn the basics of supervised and unsupervised learning.',
      progress: 35,
      totalModules: 10,
      status: 'Active',
      difficulty: 'Intermediate',
      modules: [
        { id: 'm1', title: 'What is ML?', description: 'Overview of AI field.', isCompleted: true },
        { id: 'm2', title: 'Linear Regression', description: 'Predicting continuous values.', isCompleted: true },
        { id: 'm3', title: 'Logistic Regression', description: 'Classification basics.', isCompleted: false },
        { id: 'm4', title: 'Neural Networks', description: 'Introduction to Deep Learning.', isCompleted: false },
      ]
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(courses[0]?.id || null);

  const activeCourse = courses.find(c => c.id === activeCourseId);

  const handleGenerateCourse = async () => {
    if (!topicInput.trim()) return;
    setIsGenerating(true);
    const result = await generateCourseSyllabus(topicInput);
    
    if (result.title) {
      const newCourse: Course = {
        id: Date.now().toString(),
        title: result.title || topicInput,
        description: result.description || 'AI Generated Course',
        progress: 0,
        totalModules: result.modules?.length || 0,
        status: 'Active',
        difficulty: result.difficulty || 'Beginner',
        modules: result.modules || []
      };
      setCourses([newCourse, ...courses]);
      setActiveCourseId(newCourse.id);
      setTopicInput('');
    }
    setIsGenerating(false);
  };

  const toggleModule = (courseId: string, moduleId: string) => {
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        const updatedModules = c.modules.map(m => 
          m.id === moduleId ? { ...m, isCompleted: !m.isCompleted } : m
        );
        const completed = updatedModules.filter(m => m.isCompleted).length;
        const progress = Math.round((completed / updatedModules.length) * 100);
        return { ...c, modules: updatedModules, progress };
      }
      return c;
    }));
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="flex justify-between items-center mb-6 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ KNOWLEDGE ACQUISITION ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">LEARN OS</h2>
          <p className="text-amber-700 text-sm tracking-wide">AI-POWERED SKILL DEVELOPMENT</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-black px-4 py-2 border-2 border-amber-900/50 flex items-center gap-2">
            <Trophy size={18} className="text-amber-600" />
            <span className="text-amber-700 text-[10px] font-bold tracking-wider"><span className="text-amber-500">12</span> HRS LEARNED</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        
        {/* Left Panel: Course List & Generator */}
        <div className="flex flex-col gap-6 h-full overflow-hidden">
          
          {/* Generator Box */}
          <div className="bg-fuchsia-950/20 border-2 border-fuchsia-900/50 p-6 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-fuchsia-500"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-fuchsia-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-fuchsia-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-fuchsia-500"></div>

            <h3 className="font-bold text-fuchsia-400 mb-3 flex items-center gap-2 tracking-wider">
              <Sparkles size={16} /> AI COURSE GENERATOR
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="WHAT DO YOU WANT TO LEARN? (E.G. REACT, POTTERY)"
                className="w-full bg-black border border-fuchsia-900/50 px-4 py-3 text-xs text-fuchsia-300 placeholder-fuchsia-900 focus:border-fuchsia-500 outline-none tracking-wide"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateCourse()}
              />
              <button
                onClick={handleGenerateCourse}
                disabled={isGenerating}
                className="w-full bg-fuchsia-950/30 hover:bg-fuchsia-950/50 text-fuchsia-300 py-2.5 border border-fuchsia-900/50 font-bold text-[10px] tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? <Sparkles className="animate-spin" size={18} /> : <Plus size={18} />}
                {isGenerating ? 'GENERATING...' : 'GENERATE SYLLABUS'}
              </button>
            </div>
          </div>

          {/* Active Courses List */}
          <div className="flex-1 bg-black border-2 border-amber-900/50 overflow-hidden flex flex-col relative">
             <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
             <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
             <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
             <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>

             <div className="p-4 border-b-2 border-amber-900/50">
               <h3 className="font-bold text-amber-500 flex items-center gap-2 tracking-wider">
                 <Library size={18} /> MY LIBRARY
               </h3>
             </div>
             <div className="overflow-y-auto p-2 space-y-2">
               {courses.map(course => (
                 <div
                   key={course.id}
                   onClick={() => setActiveCourseId(course.id)}
                   className={`p-3 cursor-pointer transition-all border-l-2 ${
                     activeCourseId === course.id
                       ? 'bg-amber-950/30 border-l-amber-500'
                       : 'bg-transparent border-l-transparent hover:bg-amber-950/10 hover:border-l-amber-700'
                   }`}
                 >
                   <div className="flex justify-between items-start mb-2">
                     <h4 className={`font-semibold text-sm tracking-wide ${activeCourseId === course.id ? 'text-amber-500' : 'text-amber-700'}`}>
                       {course.title}
                     </h4>
                     <span className="text-[10px] px-1.5 py-0.5 bg-amber-950/20 text-amber-600 border border-amber-900/50 uppercase tracking-wider">
                       {course.difficulty}
                     </span>
                   </div>
                   <div className="w-full h-1.5 bg-amber-950/30 overflow-hidden mb-1">
                     <div className="h-full bg-emerald-500 transition-all duration-500" style={{width: `${course.progress}%`}}></div>
                   </div>
                   <div className="flex justify-between text-[10px] text-amber-800 tracking-wide">
                     <span>{course.progress}% COMPLETE</span>
                     <span>{course.totalModules} MODULES</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Panel: Active Course Content */}
        <div className="lg:col-span-2 bg-black border-2 border-amber-900/50 overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

          {activeCourse ? (
            <>
              <div className="p-8 border-b-2 border-amber-900/50 bg-amber-950/10 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-[10px] text-amber-600 font-bold mb-2 tracking-wider">
                    <BookOpen size={16} />
                    <span>CURRENT COURSE</span>
                  </div>
                  <h1 className="text-3xl font-bold text-amber-500 mb-2 tracking-wide">{activeCourse.title.toUpperCase()}</h1>
                  <p className="text-amber-700 max-w-xl tracking-wide">{activeCourse.description}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-4">[ SYLLABUS & MODULES ]</h3>
                <div className="space-y-4">
                  {activeCourse.modules.map((module, idx) => (
                    <div
                      key={module.id}
                      className={`p-4 border-2 transition-all group relative ${
                        module.isCompleted
                          ? 'bg-black/30 border-amber-900/30 opacity-75'
                          : 'bg-black border-amber-900/50 hover:border-amber-700'
                      }`}
                    >
                      {!module.isCompleted && (
                        <>
                          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
                          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
                          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
                        </>
                      )}
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleModule(activeCourse.id, module.id)}
                          className={`mt-1 flex-shrink-0 transition-colors ${module.isCompleted ? 'text-emerald-500' : 'text-amber-700 hover:text-emerald-400'}`}
                        >
                          {module.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-1">
                             <h4 className={`text-lg font-medium tracking-wide ${module.isCompleted ? 'text-amber-800 line-through' : 'text-amber-500'}`}>
                               {module.title}
                             </h4>
                             <div className="flex gap-2">
                               <button className="p-1.5 bg-black border border-amber-900/50 hover:bg-amber-950/30 hover:border-amber-500 text-amber-700 hover:text-amber-400 transition-colors">
                                 <PlayCircle size={16} />
                               </button>
                             </div>
                           </div>
                           <p className="text-sm text-amber-700 mb-3 tracking-wide">{module.description}</p>

                           <div className="flex gap-2">
                             <span className="text-[10px] bg-amber-950/20 text-amber-700 px-2 py-1 border border-amber-900/50 flex items-center gap-1 tracking-wider">
                               <Clock size={10} /> 15 MINS
                             </span>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-amber-700">
              <GraduationCap size={64} className="mb-4 opacity-20" />
              <p className="tracking-wide">SELECT A COURSE OR GENERATE A NEW ONE TO BEGIN LEARNING.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
