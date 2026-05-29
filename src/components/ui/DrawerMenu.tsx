'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ChevronRight, X } from 'lucide-react';

type AccordionItem = {
  key: string;
  label: string;
  children: { label: string; href: string }[];
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function DrawerMenu({ visible, onClose }: Props) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const accordionItems: AccordionItem[] = [
    {
      key: 'oktava',
      label: 'La Oktava',
      children: [{ label: 'Sobre nosotros', href: '/sobre-nosotros' }],
    },
    {
      key: 'legal',
      label: 'Legal',
      children: [
        { label: 'Términos y condiciones', href: '/legal/terminos-y-condiciones' },
        { label: 'Política de privacidad', href: '/legal/politica-de-privacidad' },
      ],
    },
  ];

  const toggleAccordion = (key: string) =>
    setOpenAccordion((prev) => (prev === key ? null : key));

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/65 transition-opacity duration-300 ${
          visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed left-0 top-0 bottom-0 z-50 w-[82vw] max-w-sm bg-[#111111] flex flex-col transition-transform duration-300 ${
          visible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1e1e1e]">
          <button onClick={onClose} className="p-1 -m-1 cursor-pointer">
            <X size={26} color="#ffffff" />
          </button>
          <div className="flex">
            <span className="text-[22px] font-black text-[#e50909] tracking-tight">OK</span>
            <span className="text-[22px] font-black text-white tracking-tight">TA</span>
            <span className="text-[22px] font-black text-[#e50909] tracking-tight">VA</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Accordion items */}
          {accordionItems.map((item) => {
            const isOpen = openAccordion === item.key;
            return (
              <div key={item.key} className="border-b border-[#1e1e1e]">
                <button
                  onClick={() => toggleAccordion(item.key)}
                  className="w-full flex items-center justify-between px-5 py-5 cursor-pointer"
                >
                  <span className="text-white text-base font-semibold">{item.label}</span>
                  {isOpen ? (
                    <ChevronUp size={20} color="#888888" />
                  ) : (
                    <ChevronDown size={20} color="#888888" />
                  )}
                </button>

                {isOpen && (
                  <div className="pb-2.5 px-5">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={onClose}
                        className="block py-3 text-[#aaaaaa] text-sm hover:text-white transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Ubica la Oktava */}
          <button
            onClick={onClose}
            className="w-full flex items-center justify-between px-5 py-5 border-b border-[#1e1e1e] cursor-pointer"
          >
            <span className="text-[#e50909] text-base font-bold">Ubica la Oktava</span>
            <ChevronRight size={20} color="#e50909" />
          </button>
        </div>
      </div>
    </>
  );
}
