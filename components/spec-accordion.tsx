'use client';

import { useId, useState } from 'react';
import clsx from 'clsx';
import type { SpecGroup } from '@/lib/site-content';

interface SpecAccordionProps {
  groups: SpecGroup[];
}

export function SpecAccordion({ groups }: SpecAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-y hairline">
      {groups.map((group, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={group.title} className="border-b hairline last:border-b-0">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-200 hover:text-page-2"
              >
                <span className="text-[17px] font-semibold tracking-[-0.01em] sm:text-[19px]">
                  {group.title}
                </span>
                <span
                  aria-hidden="true"
                  className={clsx(
                    'relative h-4 w-4 shrink-0 transition-transform duration-300 ease-apple motion-reduce:transition-none',
                    isOpen && 'rotate-45',
                  )}
                >
                  <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={clsx(
                'grid transition-[grid-template-rows] duration-500 ease-apple motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <dl className="pb-8">
                  {group.rows.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[1fr_1.35fr] gap-4 border-t hairline py-4 text-[14px] first:border-t-0 sm:gap-8"
                    >
                      <dt className="text-page-2">{row.label}</dt>
                      <dd className="text-page">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
