import React from 'react';
import { Zap, ShoppingBag, Clock, ShieldCheck } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Zap className="text-yellow-400" size={32} />,
      title: "Deterministic Execution",
      desc: "Guarantees transaction order outcomes, removing uncertainty from the scheduling process."
    },
    {
      icon: <ShoppingBag className="text-raiku-accent" size={32} />,
      title: "Slot Marketplace",
      desc: "A decentralized market for buying and selling execution slots ahead of time."
    },
    {
      icon: <Clock className="text-raiku-secondary" size={32} />,
      title: "AOT Scheduling",
      desc: "Ahead-of-Time scheduling ensures block building is efficient and predictable."
    },
    {
      icon: <ShieldCheck className="text-raiku-primary" size={32} />,
      title: "MEV Protection",
      desc: "Mitigates malicious MEV like front-running by enforcing strict ordering rules."
    }
  ];

  return (
    <section className="py-20 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-raiku-card border border-white/5 p-6 rounded-xl hover:border-raiku-primary/30 transition-all hover:shadow-lg hover:shadow-raiku-primary/10 group">
              <div className="mb-4 bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;