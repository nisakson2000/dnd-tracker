import { useState, useEffect, useRef, useCallback } from 'react';
import { useTutorial } from '../../contexts/TutorialContext';
import { ChevronRight, ChevronLeft, X, Sparkles, CheckCircle } from 'lucide-react';

const COACH_Z_INDEX = 9990;

/**
 * TutorialCoach — spotlight overlay that highlights UI elements step-by-step.
 * Uses data-tutorial attributes on target elements and CSS clip-path for the cutout.
 */
export default function TutorialCoach() {
  const tutorial = useTutorial();
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const animFrameRef = useRef(null);

  const {
    tutorialActive, currentStep, currentStepIndex, totalSteps,
    advanceStep, goBackStep, skipTutorial, completeTutorial, isStepCompleted,
  } = tutorial || {};

  // Find and track the target element
  const updateTargetPosition = useCallback(() => {
    if (!currentStep?.targetSelector) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(currentStep.targetSelector);
    if (!el) {
      setTargetRect(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  }, [currentStep]);

  // Update position on step change, scroll, and resize
  useEffect(() => {
    if (!tutorialActive) return;

    const update = () => {
      updateTargetPosition();
      animFrameRef.current = requestAnimationFrame(update);
    };
    // Initial update + start tracking
    update();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [tutorialActive, currentStepIndex, updateTargetPosition]);

  // Position tooltip relative to target
  useEffect(() => {
    if (!tutorialActive) return;

    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 16;
    const position = currentStep?.position || 'center';

    if (!targetRect || position === 'center') {
      // Center on screen
      setTooltipPos({
        top: Math.max(padding, (window.innerHeight - tooltipRect.height) / 2),
        left: Math.max(padding, (window.innerWidth - tooltipRect.width) / 2),
      });
      return;
    }

    let top, left;
    const gap = 12;

    switch (position) {
      case 'right':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left + targetRect.width + gap;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - gap;
        break;
      case 'top':
        top = targetRect.top - tooltipRect.height - gap;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.top + targetRect.height + gap;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      default:
        top = targetRect.top;
        left = targetRect.left + targetRect.width + gap;
    }

    // Clamp within viewport
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

    setTooltipPos({ top, left });
  }, [tutorialActive, targetRect, currentStep, currentStepIndex]);

  if (!tutorialActive || !currentStep) return null;

  const canAdvance = !currentStep.requiresAction || isStepCompleted(currentStep.completionCheck);
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;

  // Build clip-path for the spotlight cutout
  const clipPath = targetRect
    ? `polygon(
        0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%,
        ${targetRect.left - 4}px ${targetRect.top - 4}px,
        ${targetRect.left + targetRect.width + 4}px ${targetRect.top - 4}px,
        ${targetRect.left + targetRect.width + 4}px ${targetRect.top + targetRect.height + 4}px,
        ${targetRect.left - 4}px ${targetRect.top + targetRect.height + 4}px,
        ${targetRect.left - 4}px ${targetRect.top - 4}px
      )`
    : undefined;

  return (
    <>
      {/* Semi-transparent backdrop with cutout */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: COACH_Z_INDEX,
          background: currentStep.requiresAction ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.6)',
          clipPath: clipPath || undefined,
          pointerEvents: targetRect ? 'none' : 'auto',
          transition: 'clip-path 0.3s ease',
        }}
      />

      {/* Click-through ring around target */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: 8,
            border: '2px solid rgba(201, 168, 76, 0.6)',
            boxShadow: '0 0 20px rgba(201, 168, 76, 0.3), inset 0 0 20px rgba(201, 168, 76, 0.1)',
            zIndex: COACH_Z_INDEX + 1,
            pointerEvents: 'none',
            transition: 'all 0.3s ease',
          }}
        />
      )}

      {/* Tooltip panel */}
      <div
        ref={tooltipRef}
        style={{
          position: 'fixed',
          top: tooltipPos.top,
          left: tooltipPos.left,
          zIndex: COACH_Z_INDEX + 2,
          width: 340,
          maxWidth: 'calc(100vw - 32px)',
          background: 'linear-gradient(135deg, #1a1520, #12101a)',
          border: '1px solid rgba(201, 168, 76, 0.3)',
          borderRadius: 14,
          padding: '20px',
          boxShadow: '0 16px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(201, 168, 76, 0.08)',
          transition: 'top 0.3s ease, left 0.3s ease',
        }}
      >
        {/* Step counter + skip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={12} style={{ color: '#c9a84c' }} />
            <span style={{
              fontSize: 10, fontWeight: 600, color: 'rgba(201, 168, 76, 0.7)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.05em',
            }}>
              Step {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>
          <button
            onClick={completeTutorial}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.25)', fontSize: 10, fontFamily: 'var(--font-ui)',
              padding: '2px 6px', borderRadius: 4,
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
          >
            <X size={10} /> Exit Tutorial
          </button>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, borderRadius: 2, background: 'rgba(255, 255, 255, 0.06)',
          marginBottom: 16, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 2,
            background: 'linear-gradient(90deg, #c9a84c, #e8c86a)',
            width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
            transition: 'width 0.3s ease',
          }} />
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: '#e8d9b5',
          fontFamily: 'Cinzel, Georgia, serif', marginBottom: 8,
          lineHeight: 1.3,
        }}>
          {currentStep.title}
        </h3>

        {/* Instruction */}
        <p style={{
          fontSize: 12, color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6,
          fontFamily: 'var(--font-ui)', marginBottom: 8,
        }}>
          {currentStep.instruction}
        </p>

        {/* Detail text */}
        {currentStep.detail && (
          <p style={{
            fontSize: 11, color: 'rgba(255, 255, 255, 0.45)', lineHeight: 1.5,
            fontFamily: 'var(--font-ui)', marginBottom: 14,
            padding: '8px 10px', borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}>
            {currentStep.detail}
          </p>
        )}

        {/* Completion indicator for action-required steps */}
        {currentStep.requiresAction && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 14, padding: '6px 10px', borderRadius: 6,
            background: canAdvance ? 'rgba(74, 222, 128, 0.08)' : 'rgba(251, 191, 36, 0.06)',
            border: `1px solid ${canAdvance ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.15)'}`,
          }}>
            <CheckCircle size={12} style={{ color: canAdvance ? '#4ade80' : '#fbbf24' }} />
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: canAdvance ? '#4ade80' : '#fbbf24',
              fontFamily: 'var(--font-ui)',
            }}>
              {canAdvance ? 'Action completed!' : 'Complete the action above to continue'}
            </span>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={goBackStep}
            disabled={isFirstStep}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '7px 12px', borderRadius: 7, fontSize: 11, fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: isFirstStep ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.5)',
              cursor: isFirstStep ? 'default' : 'pointer',
              fontFamily: 'var(--font-ui)',
            }}
          >
            <ChevronLeft size={11} /> Back
          </button>

          {isLastStep ? (
            <button
              onClick={completeTutorial}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.2), rgba(201, 168, 76, 0.12))',
                border: '1px solid rgba(201, 168, 76, 0.4)',
                color: '#c9a84c', cursor: 'pointer',
                fontFamily: 'var(--font-heading)', letterSpacing: '0.04em',
                boxShadow: '0 0 16px rgba(201, 168, 76, 0.1)',
              }}
            >
              <Sparkles size={13} /> Finish Tutorial
            </button>
          ) : (
            <button
              onClick={advanceStep}
              disabled={!canAdvance}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                background: canAdvance ? 'rgba(201, 168, 76, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${canAdvance ? 'rgba(201, 168, 76, 0.35)' : 'rgba(255, 255, 255, 0.06)'}`,
                color: canAdvance ? '#c9a84c' : 'rgba(255, 255, 255, 0.2)',
                cursor: canAdvance ? 'pointer' : 'default',
                fontFamily: 'var(--font-heading)', letterSpacing: '0.04em',
              }}
            >
              Next <ChevronRight size={11} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
