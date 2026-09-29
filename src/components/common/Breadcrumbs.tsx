import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onHomeClick?: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onHomeClick }) => {
  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center text-xs text-slate-500 mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
      <ol className="inline-flex items-center space-x-1.5" itemScope itemType="https://schema.org/BreadcrumbList">
        <li className="inline-flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <button
            onClick={onHomeClick || items[0]?.onClick}
            className="inline-flex items-center text-slate-500 hover:text-[#1C2434] transition-colors"
            itemProp="item"
          >
            <Home className="w-3.5 h-3.5 mr-1 text-[#2B8A88]" />
            <span itemProp="name">Accueil ABX</span>
          </button>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, idx) => (
          <li key={idx} className="inline-flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1 flex-shrink-0" />
            {item.onClick && !item.active ? (
              <button
                onClick={item.onClick}
                className="text-slate-600 hover:text-[#1C2434] font-medium transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </button>
            ) : (
              <span className="font-bold text-[#1C2434]" itemProp="name" aria-current="page">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(idx + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};
