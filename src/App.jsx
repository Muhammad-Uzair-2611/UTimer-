import { useState, useEffect } from 'react';

function App() {
  const [currentTime, setCurrentTime] = useState(() => {
    const saved = localStorage.getItem('currentTime');
    return saved ? parseInt(saved) : 0;
  });
  
  const [targetTime, setTargetTime] = useState(() => {
    const saved = localStorage.getItem('targetTime');
    return saved ? parseInt(saved) : 0;
  });
  
  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem('isRunning');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [isEditing, setIsEditing] = useState(!localStorage.getItem('targetTime'));

  // Save current time to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentTime', currentTime.toString());
  }, [currentTime]);

  // Save running state to localStorage
  useEffect(() => {
    localStorage.setItem('isRunning', JSON.stringify(isRunning));
  }, [isRunning]);

  useEffect(() => {
    // Reset timer at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow - now;

    const resetTimer = () => {
      setCurrentTime(0);
      setIsRunning(false);
      localStorage.setItem('currentTime', '0');
      localStorage.setItem('isRunning', 'false');
    };

    const midnightTimeout = setTimeout(resetTimer, timeUntilMidnight);

    return () => clearTimeout(midnightTimeout);
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && currentTime < targetTime) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev + 1 >= targetTime) {
            alert('Target time reached!');
            setIsRunning(false);
            return targetTime;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, targetTime]);

  const handleTargetTimeSubmit = (e) => {
    e.preventDefault();
    const hours = parseInt(e.target.hours.value) || 0;
    const minutes = parseInt(e.target.minutes.value) || 0;
    const seconds = parseInt(e.target.seconds.value) || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTargetTime(totalSeconds);
    localStorage.setItem('targetTime', totalSeconds.toString());
    setIsEditing(false);
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const remainingTime = Math.max(0, targetTime - currentTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="relative bg-gray-800/50 backdrop-blur-lg p-4 sm:p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-2xl mx-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl"></div>
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 sm:mb-10">Timer Dashboard</h1>

          {isEditing ? (
            <form onSubmit={handleTargetTimeSubmit} className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Hours</label>
                  <input
                    type="number"
                    name="hours"
                    placeholder="HH"
                    className="w-full sm:w-20 p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    max="23"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Minutes</label>
                  <input
                    type="number"
                    name="minutes"
                    placeholder="MM"
                    className="w-full sm:w-20 p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    max="59"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Seconds</label>
                  <input
                    type="number"
                    name="seconds"
                    placeholder="SS"
                    className="w-full sm:w-20 p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Set Target Time
              </button>
            </form>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/50">
                  <h2 className="text-gray-400 mb-2 sm:mb-3 text-sm font-medium">Target Time</h2>
                  <p className="text-2xl sm:text-3xl text-white font-mono tracking-wider">{formatTime(targetTime)}</p>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/50">
                  <h2 className="text-gray-400 mb-2 sm:mb-3 text-sm font-medium">Current Time</h2>
                  <p className="text-2xl sm:text-3xl text-white font-mono tracking-wider">{formatTime(currentTime)}</p>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/50">
                  <h2 className="text-gray-400 mb-2 sm:mb-3 text-sm font-medium">Remaining Time</h2>
                  <p className="text-2xl sm:text-3xl text-white font-mono tracking-wider">{formatTime(remainingTime)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] ${isRunning
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 cursor-pointer'
                    }`}
                >
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => !isRunning && setIsEditing(true)}
                  disabled={isRunning}
                  className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300 
                    ${isRunning
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 cursor-pointer hover:to-purple-600 transform hover:scale-[1.02]'
                    }`}
                >
                  Edit Target
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
