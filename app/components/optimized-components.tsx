import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface Feature {
  icon: React.ComponentType<Record<string, unknown>>;
  title: string;
  description: string;
  gradient: string;
}

interface FeatureGridProps {
  features: Feature[];
}

const FeatureGrid = memo(({ features }: FeatureGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="scroll-animate opacity-0 translate-y-4"
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="p-4 sm:p-6">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4`}
              >
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
});

FeatureGrid.displayName = 'FeatureGrid';

interface TabContentData {
  title: string;
  description: string;
  features: string[];
  icon: React.ComponentType<Record<string, unknown>>;
}

interface TabContentProps {
  activeTab: string;
  tabContent: Record<string, TabContentData>;
  onTabChange: (tab: string) => void;
}

const TabContent = memo(({ activeTab, tabContent, onTabChange }: TabContentProps) => {
  const currentContent = tabContent[activeTab];

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-12 scroll-animate opacity-0">
        {Object.keys(tabContent).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`rounded-full px-6 sm:px-8 py-3 sm:py-4 h-auto text-sm sm:text-base transition-all duration-300 ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-background text-muted-foreground border border-input hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {tab === 'hafalan' && 'Hafalan Al-Quran'}
            {tab === 'biolink' && 'Biolink Santri'}
            {tab === 'pembelajaran' && 'Pembelajaran'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        <div className="order-2 md:order-1 scroll-animate opacity-0 -translate-x-8">
          <div className="bg-primary/5 p-6 sm:p-8 rounded-2xl border border-primary/10">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-primary/10 mr-4">
                {React.createElement(currentContent?.icon, { className: 'w-6 h-6 text-primary' })}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-primary">
                {currentContent?.title}
              </h3>
            </div>

            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              {currentContent?.description}
            </p>

            <ul className="space-y-3 sm:space-y-4">
              {(currentContent?.features ?? []).map((feature: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="order-1 md:order-2 scroll-animate opacity-0 translate-x-8">
          <div className="aspect-square md:aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-1 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="h-full w-full bg-muted rounded-xl overflow-hidden relative">
              <img
                src={`/images/${activeTab}-preview.png`}
                alt={`${currentContent?.title} Preview`}
                className="object-cover h-full w-full opacity-90"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/logo-dark.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-4 sm:p-6 text-white">
                  <h4 className="text-lg sm:text-xl font-bold">{currentContent?.title}</h4>
                  <p className="text-xs sm:text-sm text-white/80 mt-1 sm:mt-2">
                    Klik untuk menjelajahi fitur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

TabContent.displayName = 'TabContent';

export { FeatureGrid, TabContent };
