import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--primary))" />
          <stop offset="1" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <path
        fill="url(#logo-gradient)"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z"
      />
      <path
        fill="url(#logo-gradient)"
        d="M168.49 184.49a12 12 0 0 1-17 0L128 161l-23.51 23.51a12 12 0 0 1-17-17l23.49-23.51L87.51 120.49a12 12 0 0 1 17-17L128 127l23.51-23.51a12 12 0 0 1 17 17L145 144l23.49 23.51a12 12 0 0 1 0 16.98Z"
        opacity="0.5"
      />
      <path
        fill="url(#logo-gradient)"
        d="M178.63 97.2a68 68 0 0 0-101.26 0 12 12 0 0 1-17-17A92 92 0 0 1 204.25 89a12 12 0 0 1-8.48 20.48 11.93 11.93 0 0 1-17.14-12.28Z"
      />
    </svg>
  ),
};
