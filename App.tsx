
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Skill, SkillTier } from './types';
import { INITIAL_HP, SKILLS_POOL, SPECIAL_SKILL_TEMPLATE, KILL_BASE_POINTS } from './constants';

const App: React.FC = () => {
  const [hp, setHp] = useState(INITIAL_HP);
  const [accumulatedDamage, setAccumulatedDamage] = useState(0);
  const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [lastDamage, setLastDamage] = useState<number | null>(null);
  const [isKillAnimation, setIsKillAnimation] = useState(false);

  const currentKillPower = useMemo(() => KILL_BASE_POINTS + accumulatedDamage, [accumulatedDamage]);

  const drawSkills = useCallback((currentHp: number, killPower: number) => {
    let pool = [...SKILLS_POOL];
    let slots: Skill[] = [];

    if (killPower >= currentHp && currentHp > 0) {
      const cancerSkill: Skill = {
        ...SPECIAL_SKILL_TEMPLATE,
        points: killPower
      };
      slots.push(cancerSkill);
      const shuffledOthers = [...pool].sort(() => 0.5 - Math.random());
      slots.push(...shuffledOthers.slice(0, 2));
    } else {
      const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
      slots = shuffledPool.slice(0, 3);
    }

    setCurrentSkills([...slots].sort(() => 0.5 - Math.random()));
  }, []);

  useEffect(() => {
    drawSkills(INITIAL_HP, KILL_BASE_POINTS);
  }, [drawSkills]);

  const handleAttack = (skill: Skill) => {
    if (isGameOver) return;

    const damage = skill.points;
    const isLethal = damage >= hp;

    setLastDamage(damage);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    if (isLethal) {
      setIsKillAnimation(true);
      setHp(0);
      setIsGameOver(true);
      setHistory(prev => [`[斩杀] 使用了 ${skill.name} (${damage}PT)，老中解脱了...`, ...prev]);
      setTimeout(() => setIsKillAnimation(false), 3000);
    } else {
      const newHp = Math.max(0, hp - damage);
      const newAccumulated = accumulatedDamage + damage;
      setHp(newHp);
      setAccumulatedDamage(newAccumulated);
      setHistory(prev => [`[打击] ${skill.name} 造成 ${damage} 点伤害`, ...prev]);
      drawSkills(newHp, KILL_BASE_POINTS + newAccumulated);
    }
  };

  const resetGame = () => {
    setHp(INITIAL_HP);
    setAccumulatedDamage(0);
    setHistory([]);
    setIsGameOver(false);
    setIsKillAnimation(false);
    setLastDamage(null);
    setIsShaking(false);
    drawSkills(INITIAL_HP, KILL_BASE_POINTS);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 bg-[#0f0f0f] text-gray-100 relative overflow-x-hidden gap-y-2 md:gap-y-6">
      {/* 背景氛围 */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900 blur-[100px] rounded-full"></div>
      </div>

      {/* 标题 */}
      <header className="z-10 text-center flex-shrink-0">
        <h1 className="text-3xl md:text-6xl font-bold tracking-tighter blood-text animate__animated animate__fadeInDown">
          老中斩杀线
        </h1>
        <p className="text-gray-500 mt-1 text-xs md:text-sm italic">"老中这辈子有了"</p>
      </header>

      {/* 游戏主内容包裹容器 */}
      <div className="z-10 flex flex-col items-center w-full max-w-lg md:max-w-4xl gap-y-4 md:gap-y-8">
        
        {/* 敌人展示 */}
        <div className="relative flex flex-col items-center w-full">
          {/* 血条 */}
          <div className="w-64 md:w-96 h-6 md:h-8 bg-gray-900 rounded-full border border-gray-800 overflow-visible mb-4 md:mb-8 relative shadow-xl">
            <div 
              className={`h-full transition-all duration-700 ease-out ${hp > 10 ? 'bg-red-700' : 'bg-red-900 animate-pulse'}`}
              style={{ width: `${(hp / INITIAL_HP) * 100}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-bold text-white uppercase tracking-widest drop-shadow-md z-10">
              HP: {hp} / {INITIAL_HP}
            </div>
            
            {/* 黄色的棍 (斩杀线) */}
            <div 
              className="absolute top-0 bottom-0 border-l-[3px] border-yellow-400 z-30 transition-all duration-500 pointer-events-none"
              style={{ left: `${(currentKillPower / INITIAL_HP) * 100}%` }}
            />
          </div>

          {/* 目标：老中 */}
          <div className={`text-[100px] md:text-[180px] leading-none select-none cursor-default transition-transform duration-100 ${isShaking ? 'animate__animated animate__shakeX' : ''} ${hp <= 0 ? 'grayscale opacity-50' : ''}`}>
            {hp > 0 ? '🀄' : '👻'}
            {isShaking && lastDamage && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 md:-translate-y-16 text-red-500 font-bold text-3xl md:text-5xl animate__animated animate__fadeOutUp z-50 pointer-events-none">
                -{lastDamage}
              </div>
            )}
          </div>
        </div>

        {/* 技能卡片 */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 w-full px-2 transition-opacity duration-500 ${isGameOver ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {currentSkills.map((skill) => {
            const isLethal = skill.points >= hp && hp > 0;
            return (
              <button
                key={`${skill.id}-${skill.points}-${Math.random()}`}
                onClick={() => handleAttack(skill)}
                className={`
                  relative flex flex-col items-start p-3 md:p-5 rounded-xl border transition-all duration-300 transform group
                  ${isLethal 
                    ? 'bg-red-900/40 border-red-500 scale-[1.02] md:scale-105 z-20' 
                    : 'bg-gray-800/40 border-gray-700 hover:border-gray-500 hover:bg-gray-800/60 active:scale-95'}
                `}
              >
                <div className="flex justify-between w-full items-center mb-0.5">
                  <span className={`text-base md:text-lg font-bold tracking-tight ${isLethal ? 'text-red-400' : 'text-gray-100'}`}>
                    {skill.name}
                  </span>
                  <div className={`text-[10px] md:text-xs px-2 py-0.5 rounded font-mono font-bold ${isLethal ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    {skill.points} PT
                  </div>
                </div>
                <p className="text-[10px] md:text-[11px] text-gray-500 text-left line-clamp-1 md:line-clamp-2 leading-tight md:leading-relaxed group-hover:text-gray-300">
                  {skill.description}
                </p>
                {isLethal && (
                  <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] md:text-[10px] px-1.5 py-0.5 rounded-full font-black animate-bounce shadow-xl">
                    斩杀
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 历史记录 */}
        <aside className="w-full z-10 flex-shrink-0">
          <div className="bg-black/60 border border-gray-800 rounded-xl p-3 h-28 md:h-36 overflow-y-auto scrollbar-hide shadow-inner">
            <h3 className="text-[9px] uppercase text-gray-600 mb-1 tracking-[0.2em] font-bold sticky top-0 bg-[#0f0f0f]/80 backdrop-blur-sm py-0.5 rounded"> LOGS</h3>
            <div className="space-y-0.5">
              {history.map((item, idx) => (
                <div key={idx} className={`text-[10px] md:text-xs flex items-start ${item.includes('[斩杀]') ? 'text-red-500 font-black' : 'text-gray-500'}`}>
                  <span className="mr-1.5 opacity-50 font-mono">[{history.length - idx}]</span>
                  <span>{item}</span>
                </div>
              ))}
              {history.length === 0 && <p className="text-gray-800 italic text-[10px] text-center py-2">点击按钮开斩...</p>}
            </div>
          </div>
        </aside>
      </div>

      {/* 游戏结束覆盖层 */}
      {isGameOver && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate__animated animate__fadeIn">
           <div className="bg-[#1a1a1a] border-2 border-red-900/40 p-8 md:p-16 rounded-[30px] flex flex-col items-center shadow-[0_0_100px_rgba(0,0,0,1)] scale-90 md:scale-110">
              <h2 className="text-4xl md:text-7xl font-black mb-8 text-red-500 tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] text-center animate__animated animate__pulse animate__infinite">
                老中已解脱
              </h2>
              <button 
                onClick={resetGame}
                className="px-12 py-4 bg-red-600 text-white text-xl font-black rounded-full hover:bg-red-500 transition-all shadow-[0_0_40px_rgba(220,38,38,0.6)] active:scale-95 border border-white/20"
              >
                重新斩杀
              </button>
           </div>
        </div>
      )}

      {/* 全屏斩杀特效 */}
      {isKillAnimation && (
        <div className="fixed inset-0 z-[80] pointer-events-none flex items-center justify-center bg-red-950/40 backdrop-blur-[4px] animate__animated animate__fadeIn">
          <div className="text-[200px] md:text-[700px] text-red-700 opacity-80 animate__animated animate__zoomIn font-black select-none drop-shadow-[0_0_80px_rgba(220,38,38,1)] leading-none">
            斩
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className="z-10 text-[8px] md:text-[10px] text-gray-700 tracking-widest opacity-50 text-center w-full mt-2 flex-shrink-0">
        © 2024 老中斩杀模拟器 | 仅供娱乐，珍爱生命
      </footer>
    </div>
  );
};

export default App;
