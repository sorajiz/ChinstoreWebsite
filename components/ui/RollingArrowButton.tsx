'use client';

import React from 'react';
import { Link } from '@/navigation';

interface RollingArrowButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  id?: string;
}

export default function RollingArrowButton({
  href,
  onClick,
  children,
  className = '',
  target,
  rel,
  id,
}: RollingArrowButtonProps) {
  const iconContent = (
    <span className="button__icon-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 14 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="button__icon-svg"
        width="10"
        height="11"
      >
        <path
          d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
          fill="currentColor"
        />
      </svg>
      <svg
        viewBox="0 0 14 15"
        fill="none"
        width="10"
        height="11"
        xmlns="http://www.w3.org/2000/svg"
        className="button__icon-svg button__icon-svg--copy"
      >
        <path
          d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
          fill="currentColor"
        />
      </svg>
    </span>
  );

  const combinedClass = `uiverse-explore-btn ${className}`;

  if (href) {
    if (href.startsWith('#')) {
      return (
        <a
          id={id}
          href={href}
          onClick={onClick}
          className={combinedClass}
          target={target}
          rel={rel}
        >
          {iconContent}
          <span>{children}</span>
        </a>
      );
    }

    return (
      <Link
        id={id}
        href={href}
        onClick={onClick}
        className={combinedClass}
        target={target}
        rel={rel}
      >
        {iconContent}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={combinedClass}
    >
      {iconContent}
      <span>{children}</span>
    </button>
  );
}
