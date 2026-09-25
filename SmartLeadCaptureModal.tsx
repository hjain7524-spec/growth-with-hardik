import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { trackGrowthAuditClick } from './analytics';

const GrowthAuditExperience = lazy(() => 
  import('./GrowthAuditExperience').then(module => ({ default: module.GrowthAuditExperience }))
);

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY_DISMISSED = 'growth_audit_modal_dismissed_time';
const STORAGE_KEY_SUBMITTED = 'lead_capture_submitted';

export interface SmartLeadCaptureModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export const SmartLeadCaptureModal: React.FC<SmartLeadCaptureModalProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onOpen: controlledOnOpen
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isModalOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const openModal = useCallback(() => {
    if (isControlled && controlledOnOpen) {
      controlledOnOpen();
    } else {
      setInternalIsOpen(true);
    }
  }, [isControlled, controlledOnOpen]);

  const closeModal = useCallback(() => {
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
    try {
      localStorage.setItem(STORAGE_KEY_DISMISSED, Date.now().toString());
    } catch {
      // Safe fallback
    }
  }, [isControlled, controlledOnClose]);

  // Check initial submission state from localStorage
  useEffect(() => {
    try {
      const isSub = localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true';
      if (isSub) {
        setHasSubmitted(true);
      }
    } catch {
      // Safe fallback
    }

    const handleSubmittedEvent = () => {
      setHasSubmitted(true);
    };

    const handleOpenEvent = () => {
      openModal();
    };

    window.addEventListener('lead_capture_submitted', handleSubmittedEvent);
    window.addEventListener('open_growth_audit_modal', handleOpenEvent);
    return () => {
      window.removeEventListener('lead_capture_submitted', handleSubmittedEvent);
      window.removeEventListener('open_growth_audit_modal', handleOpenEvent);
    };
  }, [openModal]);

  // Check if dismissed within last 7 days for automatic triggers
  const isDismissedRecently = useCallback(() => {
    try {
      const dismissedTime = localStorage.getItem(STORAGE_KEY_DISMISSED);
      if (dismissedTime) {
        const timeDiff = Date.now() - parseInt(dismissedTime, 10);
        if (timeDiff < SEVEN_DAYS_MS) {
          return true;
        }
      }
    } catch {
      return false;
    }
    return false;
  }, []);

  // ==========================================
  // INTELLIGENT TRIGGERS (Auto-prompts)
  // ==========================================
  useEffect(() => {
    if (hasSubmitted) return;

    let hasTriggered = false;
    const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

    // Desktop Exit Intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasTriggered || hasSubmitted || isDismissedRecently() || isMobileDevice) return;
      if (e.clientY <= 15 || (e.relatedTarget === null && e.clientY < 60)) {
        hasTriggered = true;
        openModal();
      }
    };

    if (!isMobileDevice) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    // Mobile Time + Scroll Trigger (>= 45s and >= 60% scroll)
    let timeSpentSeconds = 0;
    let mobileTimer: NodeJS.Timeout | null = null;

    const checkMobileTrigger = () => {
      if (hasTriggered || hasSubmitted || isDismissedRecently()) return;
      if (timeSpentSeconds < 45) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      if (scrollPercent >= 60) {
        hasTriggered = true;
        openModal();
      }
    };

    if (isMobileDevice) {
      mobileTimer = setInterval(() => {
        timeSpentSeconds += 1;
        checkMobileTrigger();
      }, 1000);
    }

    const handleScroll = () => {
      if (isMobileDevice) {
        checkMobileTrigger();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      if (mobileTimer) clearInterval(mobileTimer);
    };
  }, [hasSubmitted, isDismissedRecently, openModal]);

  return (
    <>
      {/* Full-Screen Step-by-Step Growth Audit Experience */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <GrowthAuditExperience
            isOpen={isModalOpen}
            onClose={closeModal}
            onSuccess={() => {
              setHasSubmitted(true);
            }}
          />
        </Suspense>
      )}
    </>
  );
};

