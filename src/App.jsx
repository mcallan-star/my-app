import React, { useState, useEffect, useRef, useCallback } from 'react';

const BreathingApp = () => {
  // Configuration
  const durations = {
    normal: {
      inhale: 4000,
      hold1: 4000,
      exhale: 6000,
    },
    box: {
      inhale: 4000,
      hold1: 4000,
      exhale: 4000,
      hold2: 4000
    }
  };

  const phaseColors = {
    inhale: 'rgb(128, 179, 255)',   // Sky Blue
    hold1: 'rgb(179, 153, 255)',    // Lavender
    exhale: 'rgb(153, 204, 255)',   // Periwinkle
    hold2: 'rgb(204, 153, 255)'     // Soft Violet
  };

  const darkColors = {
    inhale: 'rgb(128, 179, 255)',   // Sky Blue
    hold1: 'rgb(179, 153, 255)',    // Lavender
    exhale: 'rgb(153, 204, 255)',   // Periwinkle
    hold2: 'rgb(204, 153, 255)'     // Soft Violet
  };

  const lightColors = {
    inhale: 'rgb(56, 99, 167)',     // Deeper Sky Blue
    hold1: 'rgb(123, 85, 200)',     // Deeper Lavender
    exhale: 'rgb(83, 134, 185)',    // Deeper Periwinkle
    hold2: 'rgb(145, 96, 195)'      // Deeper Violet
  };




  // Phase State
  const [currentPhase, setCurrentPhase] = useState(null);
  // Animation state
  const [isRunning, setIsRunning] = useState(false);
  // Mode state
  const [isBoxMode, setIsBoxMode] = useState(false);
  // circle animation progress (0 to 1)
  const [animProgress, setAnimProgress] = useState(0);

  // Toggle switch state
  const [toggleOn, setToggleOn] = useState(false);


  const timerRef = useRef(null);
  const animStartRef = useRef(null);
  const animDurationRef = useRef(null);
  const animFrameRef = useRef(null);

  // Utility functions
  const easeInOutSine = (t) => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  };

  const getPhaseDuration = (phase) => {
    return isBoxMode ? durations.box[phase] : durations.normal[phase] || 4000;
  };

  const getPhaseLabel = (phase) => {
    if (phase === "hold1" || phase === "hold2") return "Hold";
    return phase.charAt(0).toUpperCase() + phase.slice(1);
  };

  const getNextPhase = (phase) => {
    if (phase === "inhale") return "hold1";
    if (phase === "hold1") return "exhale";
    if (phase === "exhale") return "hold2";  // Always go to hold2
    if (phase === "hold2") return "inhale";  // Always return to inhale
    return "inhale";
  };

  // Animation function
  const updateAnimation = useCallback(() => {
    if (!isRunning || !animStartRef.current) return;

    const now = Date.now();
    const elapsed = now - animStartRef.current;
    const rawProgress = Math.min(elapsed / animDurationRef.current, 1);
    const progress = easeInOutSine(rawProgress);

    setAnimProgress(progress);

    // Continue animation while running (even during hold phases)
    if (isRunning) {
      animFrameRef.current = requestAnimationFrame(updateAnimation);
    }
  }, [isRunning]);

  // Phase cycling
  const cyclePhase = useCallback((phase) => {
    console.log(`\n=== STARTING PHASE: ${phase.toUpperCase()} (${getPhaseDuration(phase)}ms) ===`);

    setCurrentPhase(phase);
    setAnimProgress(0);

    // Clear any existing timers and animations
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set up animation timing
    const startTime = Date.now();
    const duration = getPhaseDuration(phase);
    let animationCompleted = false;

    // Animation loop
    const animate = () => {
      if (animationCompleted) return;

      const now = Date.now();
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeInOutSine(rawProgress);

      setAnimProgress(progress);

      if (elapsed < duration) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        console.log(`Phase ${phase} animation completed after ${elapsed}ms`);
        animationCompleted = true;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      }
    };

    // Start animation immediately
    animFrameRef.current = requestAnimationFrame(animate);

    // Set timer for next phase
    timerRef.current = setTimeout(() => {
      console.log(`Timer fired for phase ${phase}`);
      animationCompleted = true;

      // FIX #1: Inlined next phase logic to avoid closure issues with getNextPhase()
      // Previously this used getNextPhase(phase) which could capture stale values
      let nextPhase;
      if (phase === "inhale") nextPhase = "hold1";
      else if (phase === "hold1") nextPhase = "exhale";
      else if (phase === "exhale") nextPhase = "hold2";
      else if (phase === "hold2") nextPhase = "inhale";
      else nextPhase = "inhale";

      console.log(`Transitioning from ${phase} → ${nextPhase}`);

      // FIX #2: Use setIsRunning callback to get CURRENT state instead of stale closure
      // Previously: if (isRunning) - this used stale value from when callback was created
      // Now: setIsRunning(current => ...) - this gets the actual current state
      setIsRunning(currentIsRunning => {
        if (currentIsRunning) {
          console.log(`State check passed, starting ${nextPhase}`);
          // FIX #3: Small delay ensures clean state transition between phases
          setTimeout(() => {
            cyclePhase(nextPhase);
          }, 10);  // Small delay to ensure state is updated
        } else {
          console.log(`Stopping - isRunning is false`);
        }
        return currentIsRunning; // Don't change the state, just read it
      });
    }, duration);
  }, [isBoxMode]); // FIX #4: Removed isRunning, getPhaseDuration, getNextPhase dependencies that caused stale closures

  // Control functions
  const startBreathingCycle = () => {
    console.log("Starting breathing cycle");
    setIsRunning(true);
    // Use setTimeout to ensure state is updated before starting
    setTimeout(() => {
      cyclePhase("inhale");  //we will always begin with an inhale phase
    }, 0);
  };

  const stopBreathingCycle = () => {
    setIsRunning(false);
    setCurrentPhase(null);
    setAnimProgress(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);  // Stop any ongoing timer
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);  // Stop any ongoing animation
    }
  };

  const toggleMode = () => {
    setIsBoxMode(!isBoxMode);
  };

  // Cleanup on unmount 
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Calculate circle size based on phase and progress
  const getCircleSize = () => {
    if (!currentPhase) return '80px';

    const minSize = 80;   // Small circle (empty lungs)
    const maxSize = 240;  // Large circle (full lungs)

    let size;
    if (currentPhase === "inhale") {
      // INHALE: Circle grows from small to large (filling lungs)
      size = minSize + (maxSize - minSize) * animProgress;
      if (animProgress > 0) console.log(`Inhale progress: ${animProgress.toFixed(2)}, size: ${size.toFixed(0)}px`);
    } else if (currentPhase === "hold1") {
      // HOLD1: Circle stays large (lungs full)
      size = maxSize;
      console.log(`Hold1 - staying at max size: ${size}px`);
    } else if (currentPhase === "exhale") {
      // EXHALE: Circle shrinks from large to small (emptying lungs)
      size = maxSize - (maxSize - minSize) * animProgress;
      if (animProgress > 0) console.log(`Exhale progress: ${animProgress.toFixed(2)}, size: ${size.toFixed(0)}px`);
    } else if (currentPhase === "hold2") {
      // HOLD2: Circle stays small (lungs empty)
      size = minSize;
      console.log(`Hold2 - staying at min size: ${size}px`);
    } else {
      size = minSize;
    }

    return `${Math.round(size)}px`;
  };

  const circleSize = getCircleSize();
  const themeColors = toggleOn ? lightColors : darkColors;
  const currentColor = currentPhase ? themeColors[currentPhase] : 'rgb(255, 255, 255)';

  const nextPhase = currentPhase ? getNextPhase(currentPhase) : null;
  const nextColor = nextPhase ? themeColors[nextPhase] : 'rgb(255, 255, 255)';

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-500 ${toggleOn ? "bg-indigo-100 text-gray-900" : "bg-gray-900 text-white"
        }`}
    >
      {/* iOS-inspired toggle switch */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        <span className="text-white text-sm">{toggleOn ? "☀️" : "🌙"}</span>
        <button
          onClick={() =>
            setToggleOn((prev) => {
              const newState = !prev;
              console.log("Toggle is now:", newState ? "ON" : "OFF");
              return newState;
            })
          }
          className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out 
          ${toggleOn ? "bg-green-400" : "bg-gray-400"}`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out
            ${toggleOn ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
      </div>

      <div className="text-center space-y-8">

        {/* Mode indicator */}
        <div className="text-white text-lg font-medium">
          Mode: {isBoxMode ? 'Box Breathing' : 'Normal Breathing'}
        </div>

        {/* Main breathing circle */}
        <div className="relative flex items-center justify-center" style={{ minHeight: '300px' }}>
          {currentPhase ? (
            <>
              {/* Preview ring (next phase) */}
              <div
                className="absolute rounded-full border-4 opacity-30"
                style={{
                  width: `calc(${circleSize} + 20px)`,
                  height: `calc(${circleSize} + 20px)`,
                  borderColor: nextColor,
                  transition: 'none', // Remove CSS transitions to let JS handle animation
                }}
              />

              {/* Main breathing circle */}
              <div
                className="relative rounded-full border-4 flex items-center justify-center"
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderColor: currentColor,
                  backgroundColor: `${currentColor}20`, // 20% opacity
                  transition: 'none', // Remove CSS transitions to let JS handle animation
                }}
              >
                {/* Phase label */}
                <span
                  className="text-white font-bold select-none"
                  style={{
                    fontSize: `${Math.max(16, parseInt(circleSize) * 0.1)}px`
                  }}
                >
                  {getPhaseLabel(currentPhase)}
                </span>
              </div>
            </>
          ) : (
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome</h2>
              <p className="text-lg">Click Start to Begin</p>
            </div>
          )}
        </div>

        {/* Phase indicator */}
        {currentPhase && (
          <div className="text-center">
            <div className="text-white text-xl font-medium mb-2">
              {getPhaseLabel(currentPhase)}
            </div>
            <div className="text-gray-300 text-sm">
              {isBoxMode ? '4-4-4-4 Pattern' : '4-4-6-1 Pattern'}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={isRunning ? stopBreathingCycle : startBreathingCycle}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {isRunning ? 'Stop Session' : 'Start Breathing'}
          </button>

          <button
            onClick={toggleMode}
            disabled={isRunning}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
          >
            Switch to {isBoxMode ? 'Normal' : 'Box'} Mode
          </button>
        </div>

        {/* Instructions */}
        <div className="text-gray-400 text-sm text-center max-w-md">
          <p className="mb-2">
            <strong>Normal:</strong> Inhale (4s) → Hold (4s) → Exhale (6s) → Hold (1s) = <span className="text-blue-300">15s total</span>
          </p>
          <p>
            <strong>Box:</strong> Inhale (4s) → Hold (4s) → Exhale (4s) → Hold (4s) = <span className="text-purple-300">16s total</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreathingApp;