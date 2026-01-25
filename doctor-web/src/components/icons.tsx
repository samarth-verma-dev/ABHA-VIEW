import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
    aria-label="ABHA-View Logo"
  >
    <path fill="none" d="M0 0h256v256H0z" />
    <path
      d="M128 24a104 104 0 0 0-95.3 141.3A104.1 104.1 0 1 0 128 24Z"
      opacity="0.2"
      fill="currentColor"
    />
    <path
      d="M128 24a104 104 0 0 0-95.3 141.3A104.1 104.1 0 1 0 128 24Z"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeWidth="16"
    />
    <path
      d="M164.7 91.3a44 44 0 1 1-73.4 0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
    <path
      d="M128 128v88"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  </svg>
);
