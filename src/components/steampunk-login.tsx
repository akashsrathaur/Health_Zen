'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function SteampunkLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmitClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();
    if (!isChecked) {
        alert("You must agree to whatever!");
        return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Logged in!');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="relative w-full aspect-square bg-white border-2 border-black p-4 md:p-8 font-mono text-black">
      {/* The entire mechanical drawing is an SVG */}
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Basic frame */}
        <rect width="400" height="400" fill="none" />

        {/* Input fields drawn in SVG for placement */}
        <g id="form-fields">
          <rect x="100" y="50" width="150" height="20" stroke="black" fill="white" />
          <text x="60" y="65" fontSize="10">hello</text>

          <rect x="100" y="80" width="150" height="20" stroke="black" fill="white" />
          <text x="60" y="95" fontSize="10">e-mail</text>

          <rect x="100" y="120" width="15" height="15" stroke="black" fill="white" />
          <text x="120" y="132" fontSize="10">agree to whatever</text>
        </g>
        
        {/* Pulley and weight */}
        <g id="pulley-system">
          <circle cx="80" cy="85" r="20" stroke="black" fill="none" strokeWidth="1" />
          {/* Spiral inside pulley */}
          <path d="M 80 85 m -18 0 a 18 18 0 1 1 36 0 a 16 16 0 1 1 -32 0 a 14 14 0 1 1 28 0 a 12 12 0 1 1 -24 0 a 10 10 0 1 1 20 0 a 8 8 0 1 1 -16 0 a 6 6 0 1 1 12 0 a 4 4 0 1 1 -8 0 a 2 2 0 1 1 4 0" stroke="black" fill="none" strokeWidth="0.5"/>
          <line x1="80" y1="85" x2="60" y2="85" stroke="black" />
          <line x1="80" y1="105" x2="80" y2="135" stroke="black" />
           {/* Weight */}
          <path d="M 75 135 a 5 5 0 0 1 10 0 v 10 a 5 5 0 0 1 -10 0 z" stroke="black" fill="black" />
          <path d="M 70 132 h 20" stroke="black" fill="none" />
        </g>

        {/* Gear system */}
        <g id="gear-system" style={{transformOrigin: "center"}} className={isSubmitting ? 'animate-spin-slow' : ''}>
           {/* Big Gear */}
           <path d="M 330 80 a 40 40 0 1 0 0 1  M 290 80 L 288 75 L 292 70 L 295 70 L 297 75 L 293 80 Z M 298.66 82.5 L 294.66 77.5 L 300.31 73.83 L 302.99 75.17 L 301.34 80.5 Z M 305.88 88.66 L 300.22 84.32 L 305.19 79.88 L 308.53 80.5 L 308.84 86.66 Z M 313.83 95.31 L 307.83 91.66 L 311.5 86.66 L 314.18 88 L 315.83 93.31 Z M 321.66 101.34 L 315.66 97.66 L 318.34 92.34 L 321.02 93.68 L 323.66 99.34 Z M 330 105 L 324 101 L 326 96 L 330 95 L 334 96 L 336 101 Z M 338.34 101.34 L 332.34 97.66 L 341.68 93.68 L 339.02 92.34 L 344.34 99.34 Z M 346.17 95.31 L 340.17 91.66 L 348.5 86.66 L 345.82 88 L 348.17 93.31 Z M 354.12 88.66 L 348.46 84.32 L 359.81 79.88 L 356.47 80.5 L 357.16 86.66 Z M 361.34 82.5 L 355.68 77.5 L 365.31 73.83 L 362.63 75.17 L 364.34 80.5 Z M 370 80 L 368 75 L 372 70 L 375 70 L 377 75 L 373 80 Z M 361.34 57.5 L 355.68 62.5 L 365.31 66.17 L 362.63 64.83 L 364.34 59.5 Z M 354.12 51.34 L 348.46 55.68 L 359.81 60.12 L 356.47 59.5 L 357.16 53.34 Z M 346.17 44.69 L 340.17 48.34 L 348.5 53.34 L 345.82 52 L 348.17 46.69 Z M 338.34 38.66 L 332.34 42.34 L 341.68 46.32 L 339.02 47.66 L 344.34 40.66 Z M 330 35 L 324 39 L 326 44 L 330 45 L 334 44 L 336 39 Z M 321.66 38.66 L 315.66 42.34 L 318.34 47.66 L 321.02 46.32 L 323.66 40.66 Z M 313.83 44.69 L 307.83 48.34 L 311.5 53.34 L 314.18 52 L 315.83 46.69 Z M 305.88 51.34 L 300.22 55.68 L 305.19 60.12 L 308.53 59.5 L 308.84 53.34 Z M 298.66 57.5 L 294.66 62.5 L 300.31 66.17 L 302.99 64.83 L 301.34 59.5 Z" stroke="black" strokeWidth="0.5" fill="none" />
           <circle cx="330" cy="80" r="10" stroke="black" fill="white" />
        </g>
        
        {/* Small gear connected to hello input */}
        <g id="input-gear" style={{transformOrigin: "255px 60px"}} className={isSubmitting ? 'animate-spin-fast-reverse' : ''}>
          <path d="M 255 60 L 253 57 L 255 54 L 257 54 L 259 57 L 257 60 Z M 259.8 61.5 L 257.8 58.5 L 261.2 56.4 L 262.6 57.1 L 261.6 60.3 Z M 263.4 64.8 L 260.6 62.4 L 263.6 59.4 L 265.4 59.8 L 265.2 63.4 Z M 265.2 55.2 L 260.6 57.6 L 263.6 60.6 L 265.4 60.2 L 263.4 56.6 Z M 259.8 58.5 L 257.8 61.5 L 254.4 59.4 L 255.8 58.7 L 254.8 55.5 Z M 250.2 58.5 L 252.2 61.5 L 248.8 63.6 L 247.4 62.9 L 248.4 59.7 Z M 255 70 a 5 5 0 1 0 0 1" stroke="black" strokeWidth="0.5" fill="none" />
        </g>

        {/* Small gear connected to big gear */}
        <g id="middle-gear" style={{transformOrigin: "275px 100px"}} className={isSubmitting ? 'animate-spin-fast' : ''}>
            <circle cx="275" cy="100" r="10" fill="none" stroke="black" strokeWidth="0.5"/>
            <path d="M 275 90 L 272 88 L 275 86 L 278 88 Z M 283.66 95 L 280.16 92.5 L 285 90 L 285 95 Z M 283.66 105 L 280.16 107.5 L 285 110 L 285 105 Z M 275 110 L 272 112 L 275 114 L 278 112 Z M 266.34 105 L 269.84 107.5 L 265 110 L 265 105 Z M 266.34 95 L 269.84 92.5 L 265 90 L 265 95 Z " stroke="black" fill="none" strokeWidth="0.5"/>
            <circle cx="275" cy="100" r="2" fill="black" />
        </g>
        
        {/* Hand cranking lever */}
        <g id="crank" className="cursor-pointer" onClick={handleSubmitClick}>
            <title>Submit</title>
            <line x1="275" y1="110" x2="275" y2="150" stroke="black" />
            <path d="M 275 150 l-5 5 h -5 l -5 -5 l 5 -5 h 5 z" stroke="black" fill="white" />
            <path d="M 265 150 l 5 10 l 5 0 l 5 -10" stroke="black" fill="none" />
            <path d="M 270 160 l 0 5 l 5 0 l 0 -5" stroke="black" fill="none" />
            <path d="M 272.5 165 l 0 10 l -5 0 l 0 -5" stroke="black" fill="white" />
            {isSubmitting && <path d="M 267.5 170 l 5 5" stroke="black" fill="none" />}
            {isSubmitting && <path d="M 267.5 175 l 5 -5" stroke="black" fill="none" />}
        </g>
        
        {/* Spray bottle */}
        <g id="spray-bottle">
            <rect x="310" y="190" width="30" height="40" stroke="black" fill="white" />
            <rect x="305" y="180" width="40" height="10" stroke="black" fill="gray" />
            <rect x="320" y="170" width="5" height="10" stroke="black" fill="gray" />
            <path d="M 322.5 170 l 15 -10 l 0 5 z" stroke="black" fill="gray" />
        </g>


        {/* Checkbox rope system */}
        <g id="checkbox-system">
            <line x1="107.5" y1="135" x2="107.5" y2="250" stroke="black" />
            <circle cx="107.5" cy="250" r="4" stroke="black" fill="white" />
            <line x1="107.5" y1="250" x2="280" y2="280" stroke="black" />
        </g>

        {/* Bottom-left hand mechanism */}
        <g id="hand-mechanism">
            <line x1="80" y1="250" x2="80" y2="300" stroke="black" />
            <path d="M 70 300 h 20 l 5 5 v 5 h -30 v -5 z" stroke="black" fill="white"/>
            <path d="M 65 310 h 40" stroke="black" fill="none" />
        </g>

        {/* Conveyor belt thing */}
        <g id="conveyor">
            <rect x="30" y="280" width="20" height="50" rx="5" ry="5" stroke="black" fill="none" />
            <circle cx="40" cy="285" r="3" fill="gray" />
            <circle cx="40" cy="325" r="3" fill="gray" />
            <line x1="30" y1="330" x2="30" y2="350" stroke="black"/>
            <line x1="50" y1="330" x2="50" y2="350" stroke="black"/>

            {/* little cart */}
            <path d="M 20 350 h 40 v 10 h -40 z" stroke="black" fill="none" />
            <circle cx="30" cy="365" r="3" fill="gray" />
            <circle cx="50" cy="365" r="3" fill="gray" />
            <line x1="0" y1="370" x2="80" y2="370" stroke="black" />

            {/* seesaw */}
            <path d="M 120 280 l 10 10 l -10 10 z" fill="black" stroke="black" />
            <line x1="80" y1="280" x2="150" y2="290" stroke="black" />
            <circle cx="150" cy="290" r="1.5" fill="black" />

             {/* dots on conveyor */}
             <circle cx="35" cy="290" r="1" fill="gray" />
             <circle cx="45" cy="290" r="1" fill="gray" />
             <circle cx="35" cy="300" r="1" fill="gray" />
             <circle cx="45" cy="300" r="1" fill="gray" />
             <circle cx="35" cy="310" r="1" fill="gray" />
             <circle cx="45" cy="310" r="1" fill="gray" />
             <circle cx="35" cy="320" r="1" fill="gray" />
             <circle cx="45" cy="320" r="1" fill="gray" />
        </g>

        {/* Loading indicator as smoke from spray bottle */}
        {isSubmitting && (
          <g>
            <circle cx="340" cy="155" r="3" fill="rgba(0,0,0,0.2)" className="animate-smoke-1" />
            <circle cx="345" cy="145" r="4" fill="rgba(0,0,0,0.3)" className="animate-smoke-2" />
            <circle cx="355" cy="150" r="5" fill="rgba(0,0,0,0.25)" className="animate-smoke-3" />
          </g>
        )}
      </svg>

      {/* Actual HTML form elements positioned over the SVG */}
      <div className="absolute top-0 left-0 w-full h-full p-4 md:p-8">
        <div className="relative w-full h-full">
            <div style={{ position: 'absolute', top: 'calc(12.5% - 10px)', left: '25%', width: '37.5%', height: '5%' }}>
                 <Input 
                    id="hello" 
                    type="text" 
                    className="w-full h-full bg-transparent border-none focus-visible:ring-0 text-sm" 
                    style={{ caretColor: 'black' }}
                />
            </div>
             <div style={{ position: 'absolute', top: 'calc(20% - 10px)', left: '25%', width: '37.5%', height: '5%' }}>
                <Input 
                    id="email" 
                    type="email" 
                    className="w-full h-full bg-transparent border-none focus-visible:ring-0 text-sm" 
                    style={{ caretColor: 'black' }}
                />
            </div>
             <div style={{ position: 'absolute', top: 'calc(30% - 7.5px)', left: '25%', width: '3.75%', height: '3.75%' }}>
                 <Checkbox 
                    id="agree" 
                    className="w-full h-full bg-white border-none rounded-none data-[state=checked]:bg-gray-400"
                    onCheckedChange={(checked) => setIsChecked(!!checked)}
                />
            </div>
        </div>
      </div>

       <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }

        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-fast {
          animation: spin-fast 1s linear infinite;
        }
        
        @keyframes spin-fast-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-fast-reverse {
            animation: spin-fast-reverse 1s linear infinite;
        }

        @keyframes smoke-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(5px, -30px) scale(2); opacity: 0; }
        }
        .animate-smoke-1 {
          animation: smoke-1 1.5s linear infinite;
        }

        @keyframes smoke-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-5px, -40px) scale(2.5); opacity: 0; }
        }
        .animate-smoke-2 {
          animation: smoke-2 1.5s linear infinite 0.3s;
        }
        @keyframes smoke-3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(8px, -35px) scale(2.2); opacity: 0; }
        }
        .animate-smoke-3 {
          animation: smoke-3 1.5s linear infinite 0.6s;
        }
      `}</style>
    </div>
  );
}
