import type {Metadata} from 'next';
import './globals.css';
import './ux.css';
import './dr.css';
// Shared story-page layer (beats, indexes, register tables, st-link). Loaded once here: imported per page it
// became a CSS-only chunk shared by five entries, and the bundler preloaded a JS stub it never emitted.
import './story.css';
import './visual-refinement.css';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './company-pages.css';
import './v3.css';
export const metadata:Metadata={title:'DeepGrid Semi — DG32 Lockstep RISC-V Motor-Control Silicon',description:'DG32-LITE and DG32-2DOM: dual-core lockstep RISC-V SoCs that put the MCU, motor-control peripherals and a hardware safety monitor on one 130 nm chip.',icons:{icon:'./brand/deepgrid-d-64.png',apple:'./brand/deepgrid-d-192.png'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
 // content is rewritten by scripts/package-pages.mjs to the real PAGES_BASE; "/" is the dev value.
 return <html lang="en" className="dark"><head><meta name="site-base" content="/"/></head><body>{children}</body></html>;
}
