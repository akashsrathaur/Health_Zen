import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
    >
      {/* Orange water drop at top */}
      <path 
        d="M60 10 C50 10, 40 20, 40 35 C40 45, 50 55, 60 55 C70 55, 80 45, 80 35 C80 20, 70 10, 60 10 Z" 
        fill="#FFB366"
      />
      
      {/* Red dots on top sides */}
      <circle cx="30" cy="35" r="4" fill="#FF6B8A"/>
      <circle cx="90" cy="35" r="4" fill="#FF6B8A"/>
      
      {/* Green semicircles on left and right */}
      <path 
        d="M15 45 C5 45, 0 55, 0 65 C0 75, 5 85, 15 85 Z" 
        fill="#6BCFA0"
      />
      <path 
        d="M105 45 C115 45, 120 55, 120 65 C120 75, 115 85, 105 85 Z" 
        fill="#6BCFA0"
      />
      
      {/* Red dots on middle sides */}
      <circle cx="15" cy="60" r="3" fill="#FF6B8A"/>
      <circle cx="105" cy="60" r="3" fill="#FF6B8A"/>
      
      {/* Blue curved element in center */}
      <path 
        d="M35 65 C45 55, 65 55, 75 65 C80 70, 80 75, 75 80 C65 90, 55 90, 50 85 C45 80, 35 75, 35 65 Z" 
        fill="#5BC5E8" 
        stroke="#5BC5E8" 
        strokeWidth="2"
      />
      
      {/* Pink/coral curved element intersecting */}
      <path 
        d="M50 65 C60 55, 70 60, 75 65 C80 70, 75 75, 70 80 C65 85, 55 80, 50 75 Z" 
        fill="#FF8B94"
      />
      
      {/* Green semicircles at bottom */}
      <path 
        d="M15 85 C5 85, 0 95, 0 105 C0 115, 5 120, 15 120 L15 85 Z" 
        fill="#6BCFA0"
      />
      <path 
        d="M105 85 C115 85, 120 95, 120 105 C120 115, 115 120, 105 120 L105 85 Z" 
        fill="#6BCFA0"
      />
      
      {/* Blue dot bottom left */}
      <circle cx="25" cy="105" r="3" fill="#5BC5E8"/>
      
      {/* Red dots at bottom */}
      <circle cx="95" cy="105" r="3" fill="#FF6B8A"/>
      
      {/* Pink/coral tulip shape at bottom center */}
      <path 
        d="M60 90 L55 105 L50 110 L55 115 L60 112 L65 115 L70 110 L65 105 Z" 
        fill="#FF8B94"
      />
    </svg>
  ),
  points: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  streak: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
};
