import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Trophy, Clock, BarChart3, Pause, Play } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { SUBJECTS, INITIAL_FRIENDS } from './constants';
import { Friend, SubjectTime } from './types';
import { Modal } from './components/Modal';
import { TimerDisplay } from './components/TimerDisplay';

const App: React.FC = () => {
  // State
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [myStudyData, setMyStudyData] = useState<SubjectTime>({});
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');

  // Derived State
  const selectedFriend = friends.find(f => f.id === selectedFriendId) || null;
  
  const calculateTotalTime = (data: SubjectTime) => {
    return Object.values(data).reduce((acc, curr) => acc + curr, 0);
  };

  const myTotalTime = calculateTotalTime(myStudyData);

  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (activeSubject) {
      interval = setInterval(() => {
        setMyStudyData((prev) => ({
          ...prev,
          [activeSubject]: (prev[activeSubject] || 0) + 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSubject]);

  // Handlers
  const toggleTimer = (subjectId: string) => {
    if (activeSubject === subjectId) {
      setActiveSubject(null); // Stop if clicking same
    } else {
      setActiveSubject(subjectId); // Switch to new subject
    }
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    const newFriend: Friend = {
      id: Date.now().toString(),
      name: newFriendName,
      avatar: `https://picsum.photos/100/100?random=${friends.length + 5}`,
      status: 'offline',
      studyData: {}
    };

    setFriends([...friends, newFriend]);
    setNewFriendName('');
    setIsAddFriendModalOpen(false);
  };

  // Chart Data Preparation
  const getChartData = (data: SubjectTime) => {
    return SUBJECTS.map(subject => ({
      name: subject.name,
      time: Math.floor((data[subject.id] || 0) / 60), // Minutes for chart
      rawTime: data[subject.id] || 0,
      color: subject.color.split(' ')[1].replace('text-', ''), // Extract color rough logic for demo
      fullColor: subject.color
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-sm">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-gray-600">
            {Math.floor(payload[0].value)} 분
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Clock size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              StudyMate
            </h1>
          </div>
          <button
            onClick={() => setIsAddFriendModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-all"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">친구 추가</span>
            <span className="sm:hidden">추가</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        
        {/* Top Section: Stats Comparison */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* My Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50 pointer-events-none" />
            <div>
              <h2 className="text-slate-500 font-medium text-sm mb-1 flex items-center gap-2">
                <Users size={16} /> 나의 공부 시간
              </h2>
              <TimerDisplay seconds={myTotalTime} size="xl" className="text-slate-900" />
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium bg-indigo-50 w-fit px-3 py-1 rounded-full">
                {activeSubject ? (
                   <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    {SUBJECTS.find(s => s.id === activeSubject)?.name} 공부 중...
                   </>
                ) : '휴식 중'}
              </div>
            </div>
          </div>

          {/* Friend Summary Card */}
          <div className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between transition-all duration-300 ${selectedFriend ? 'ring-2 ring-indigo-100' : ''}`}>
             {selectedFriend ? (
               <>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-slate-500 font-medium text-sm mb-1 flex items-center gap-2">
                      <Trophy size={16} /> {selectedFriend.name}의 시간
                    </h2>
                    <TimerDisplay 
                      seconds={calculateTotalTime(selectedFriend.studyData)} 
                      size="xl" 
                      className="text-slate-900" 
                    />
                  </div>
                  <img 
                    src={selectedFriend.avatar} 
                    alt={selectedFriend.name} 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                </div>
                <div className="mt-4">
                   <div className={`text-sm font-medium w-fit px-3 py-1 rounded-full flex items-center gap-2
                      ${selectedFriend.status === 'studying' ? 'bg-green-50 text-green-700' : 
                        selectedFriend.status === 'online' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${selectedFriend.status === 'studying' ? 'bg-green-500' : selectedFriend.status === 'online' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                      {selectedFriend.status === 'studying' ? '공부 중' : selectedFriend.status === 'online' ? '온라인' : '오프라인'}
                   </div>
                </div>
               </>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 py-4">
                 <Users size={48} className="mb-2 opacity-20" />
                 <p>친구를 선택하여 공부 시간을 확인하세요</p>
               </div>
             )}
          </div>
        </section>

        {/* Middle Section: Controls */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock size={20} /> 과목별 타이머
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {SUBJECTS.map((subject) => {
              const isActive = activeSubject === subject.id;
              return (
                <button
                  key={subject.id}
                  onClick={() => toggleTimer(subject.id)}
                  className={`
                    relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200
                    border-2
                    ${isActive 
                      ? 'bg-white border-indigo-600 shadow-lg scale-[1.02] z-10' 
                      : 'bg-white border-transparent hover:border-slate-200 shadow-sm hover:shadow-md'}
                  `}
                >
                  <div className={`p-3 rounded-full mb-3 ${subject.color} ${isActive ? 'animate-pulse' : ''}`}>
                    <subject.icon size={24} />
                  </div>
                  <span className="font-bold text-slate-700 mb-1">{subject.name}</span>
                  <TimerDisplay 
                    seconds={myStudyData[subject.id] || 0} 
                    size="sm" 
                    className={isActive ? 'text-indigo-600' : 'text-slate-400'}
                  />
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/5 rounded-xl">
                    {isActive ? <Pause className="text-indigo-600" fill="currentColor" /> : <Play className="text-slate-600" fill="currentColor" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Bottom Section: Friend List & Detail Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Friend List */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users size={20} /> 친구 목록
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => setSelectedFriendId(friend.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    selectedFriendId === friend.id 
                      ? 'bg-indigo-50 border border-indigo-100' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="relative">
                    <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                      ${friend.status === 'studying' ? 'bg-green-500' : friend.status === 'online' ? 'bg-blue-500' : 'bg-slate-400'}`} 
                    />
                  </div>
                  <div className="text-left flex-1">
                    <p className={`font-semibold ${selectedFriendId === friend.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {friend.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {friend.status === 'studying' && friend.currentSubject 
                        ? `${SUBJECTS.find(s => s.id === friend.currentSubject)?.name} 공부 중` 
                        : calculateTotalTime(friend.studyData) > 0 
                          ? `${Math.floor(calculateTotalTime(friend.studyData) / 60)}분 공부함`
                          : '기록 없음'}
                    </p>
                  </div>
                  <div className="text-right">
                    <TimerDisplay 
                      seconds={calculateTotalTime(friend.studyData)} 
                      size="sm" 
                      className={selectedFriendId === friend.id ? 'text-indigo-600' : 'text-slate-400'} 
                    />
                  </div>
                </button>
              ))}
              {friends.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  친구를 추가해보세요!
                </div>
              )}
            </div>
          </div>

          {/* Detailed Chart Area */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 size={20} /> 
                {selectedFriend ? `${selectedFriend.name}님의 과목별 현황` : '나의 과목별 현황'}
              </h3>
              <div className="text-sm text-slate-500">
                단위: 분
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData(selectedFriend ? selectedFriend.studyData : myStudyData)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    hide 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="time" radius={[6, 6, 6, 6]} barSize={40}>
                    {getChartData(selectedFriend ? selectedFriend.studyData : myStudyData).map((entry, index) => {
                      // Map raw colors to hex for chart
                       const colorMap: Record<string, string> = {
                         'rose': '#e11d48',
                         'blue': '#2563eb',
                         'yellow': '#d97706',
                         'emerald': '#059669',
                         'amber': '#d97706',
                         'violet': '#7c3aed'
                       };
                       // Simple fallback extraction
                       let colorKey = Object.keys(colorMap).find(k => entry.fullColor.includes(k)) || 'blue';
                       return <Cell key={`cell-${index}`} fill={colorMap[colorKey]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend / Text Summary for selected/current user */}
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
               {SUBJECTS.map(subj => {
                 const time = selectedFriend ? selectedFriend.studyData[subj.id] || 0 : myStudyData[subj.id] || 0;
                 return (
                   <div key={subj.id} className="text-center p-2 rounded-lg bg-slate-50">
                     <p className="text-xs text-slate-500 mb-1">{subj.name}</p>
                     <p className="font-bold text-slate-800">{Math.floor(time/60)}분</p>
                   </div>
                 )
               })}
            </div>
          </div>
        </section>
      </main>

      {/* Add Friend Modal */}
      <Modal 
        isOpen={isAddFriendModalOpen} 
        onClose={() => setIsAddFriendModalOpen(false)}
        title="친구 추가하기"
      >
        <form onSubmit={handleAddFriend} className="space-y-4">
          <div>
            <label htmlFor="friendName" className="block text-sm font-medium text-slate-700 mb-1">
              친구 이름
            </label>
            <input
              id="friendName"
              type="text"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              placeholder="친구의 이름을 입력하세요"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setIsAddFriendModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!newFriendName.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              추가하기
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default App;