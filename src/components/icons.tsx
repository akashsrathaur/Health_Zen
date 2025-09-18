import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 100"
    >
      <image 
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAA+CAMAAAA32rIkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAP////8A//8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/ANJ0XzYAAACBdFJOUwAEBQYICQoLDQ4PERIUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyNzg5Ojs8PT5AQUJDREZHSElLTE5PUVJTU1VWV1hZWltdXV5fYWJjZWZnaGlqa2xtbm9xcnN0dnh5enx9fn+AgYSGiouMj5CRlJWXmJmanZ6foaSmp6qrra+wsrS2t7i7vb/Aw8XHyMrO0NLT1NXW19ja3N3f4OHj5OXn6Onr7O7w8vT19/n7/v7Xn/gRAAAACXBIWXMAABcRAAAXEQHKJvM/AAADPUlEQVR4Xu2ai1MbRxCHo157x547p3XamXPOmXY3nEOHEWJAkoADxImT4g/k5+R3cgWf52fA9CgCg156U1VlV0+Xz4pYFEoEwLg8X/o+AgD0fAIA6P0GACCR4eEzAIBfPQMAIBwG/vT55wAAX/4AABgY+NfnnwMAfPECABAY+Pj17gIAH7wAADwG/vq1LwCA5wAASGAf+PVrXwAALwMAkMD+8KvffAwAeAEAQAj7hq+++RkAoAcAgBD2LV9+43MAgAMAQAj71i+//e23v/0GgH4BIAjhXwCAx/D/AgCQ2p+zVf8A9A4AENL+AQAAYR8AQAj7AACAsA8AIIQBAP8CAJDaHwAAhD0AAAgAGADiPqQvY/sSAAAg7AMACOE/AADE/QAAEAAbQNxHYF/8AAACAGAAiPsI7IsfAABgAID4H4B98SMAAAAJAJgH8L4Af+I7AACIBwBgHMD7AvyJ7wAAAQAAYBzA+yC++AEAAgBgHMD7YLz4AQAACYD6AOwL8CffAQBAPMCxL8C/eA8AAIgHABgHcN+ff/4PAADiAYB98QMAAAMAIu5P/vUvAACgDwB+A7Dv/gQAANAAAIBw/P/vAgDwCAAgDP8dAEAA/wMAoP8HAEAO+4P3f/8LAODbAQCh/D4AYP/gBQAAl4cAhO/9AAAAYB8AAEAIfwAAgLAPAACEAQD/AwCQ2t/nBwAAYQ8AAAIAZgDSHgAgpP0DAMgA6CMAQEj7BwCQAeiPAMhL+w8AyAEYfQAAQAAoA4P+BgAA/uE/wAAGEPcHACA+wMAA/AAAgP/wTwAAvk8AQAj7hgAAvk8AQAj7RgAAvkMAAIQ9AAAEAAAAAABoHwAAABi//wEAABAACgAw7AOA92EAgAAGEPcHACA+wMAA/PdvAIAPeABs/+4DACD+AgCQ+P5eCgDg8+9+AIDwD7x8AQAQ8HwBAGAg/P19AAD4DwCAv37fAwAgAMj+9Q0A4PMPAIAMjP8DABA+AwAg5w+EfwQAICQCyPz1CQBAqPz1DQCAUAkAkPrjAQAg/n+8AQCgHwAA9A8AQP8PANAAAIB+AABoBgCAfgAAIAZ+/gIAgAcAAMQAACA+AwAgBoAAYQ+AfwEAED4CAEAIfwAAQAj/AQCQ+h8Awj4AAPwJAGAA/AcAAPAHAABhHwBACAAYQOzPAACQ2h/yP+kHqgN6D51SAAAAAElFTkSuQmCC" 
        width="400" 
        height="100"
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
