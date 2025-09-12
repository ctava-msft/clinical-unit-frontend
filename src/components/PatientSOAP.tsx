import React, { useState, useRef, useEffect } from 'react';

interface RoundsData {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}

interface PatientSOAPProps {
  rounds: RoundsData;
}

export const PatientSOAP: React.FC<PatientSOAPProps> = ({ rounds }) => {
  const [activeTab, setActiveTab] = useState<'subjective' | 'objective' | 'assessment' | 'plan'>('subjective');
  const containerRef = useRef<HTMLDivElement>(null);
  const tabNavRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({
    subjective: null,
    objective: null,
    assessment: null,
    plan: null,
  });

  if (!rounds) {
    return null;
  }

  const tabs = [
    { key: 'subjective' as const, label: 'Subjective', content: rounds.subjective },
    { key: 'objective' as const, label: 'Objective', content: rounds.objective },
    { key: 'assessment' as const, label: 'Assessment', content: rounds.assessment },
    { key: 'plan' as const, label: 'Plan', content: rounds.plan },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;
      
      // Check if we're at the bottom - if so, highlight the last tab
      if (scrollTop + containerHeight >= scrollHeight - 10) {
        setActiveTab('plan');
        return;
      }
      
      // Find which section is most visible
      let mostVisibleSection = 'subjective';
      let maxVisibility = 0;

      tabs.forEach((tab) => {
        const element = sectionRefs.current[tab.key];
        if (element) {
          const rect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          const elementTop = rect.top - containerRect.top;
          const elementBottom = rect.bottom - containerRect.top;
          
          // Calculate visible portion
          const visibleTop = Math.max(0, -elementTop);
          const visibleBottom = Math.min(rect.height, containerHeight - elementTop);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibilityRatio = visibleHeight / rect.height;
          
          if (visibilityRatio > maxVisibility) {
            maxVisibility = visibilityRatio;
            mostVisibleSection = tab.key;
          }
        }
      });

      if (mostVisibleSection !== activeTab) {
        setActiveTab(mostVisibleSection as typeof activeTab);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeTab, tabs]);

  // Scroll tab navigation horizontally when active tab changes
  useEffect(() => {
    if (tabNavRef.current) {
      const activeButton = tabNavRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab]);

  const scrollToSection = (sectionKey: string) => {
    const element = sectionRefs.current[sectionKey];
    if (element && containerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <nav ref={tabNavRef} className="flex pl-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                data-tab={tab.key}
                onClick={() => scrollToSection(tab.key)}
                className={`px-4 sm:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.key
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{ color: '#21206F' }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Scrollable Content */}
        <div 
          ref={containerRef}
          className="h-96 overflow-y-auto"
        >
          {tabs.map((tab) => (
            <div
              key={tab.key}
              ref={(el) => (sectionRefs.current[tab.key] = el)}
              className="p-6 border-b border-gray-100 last:border-b-0 min-h-[200px]"
            >
              <h4 className="font-semibold text-gray-600 mb-3">
                {tab.label}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {tab.content || 'No data available'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientSOAP;
