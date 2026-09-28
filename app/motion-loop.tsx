'use client';
// A short silent motion loop for an overview section (HyperFrames renders, source in
// docs/films/dg32-overview-loops/). It plays only while on screen, never under reduced motion
// (the poster is the resting frame), and always carries a pause control: WCAG 2.2.2 requires one
// for motion that runs longer than five seconds.
import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';
import {useReduced} from './shell';
import {url} from './routes';

export function MotionLoop({name, label, wide}: {name: string; label: string; wide?: boolean}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReduced();
  const [stopped, setStopped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const want = !reduced && !stopped;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!want) { v.pause(); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, {threshold: 0.3});
    io.observe(v);
    return () => io.disconnect();
  }, [want]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (playing) { setStopped(true); v.pause(); }
    else { setStopped(false); v.play().catch(() => {}); }
  };

  return (
    <figure className={'st-loop' + (wide ? ' st-loop-wide' : '')}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={url(`/media/loops/${name}.jpg`)}
        width={wide ? 1920 : 800}
        height={wide ? 640 : 450}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={url(`/media/loops/${name}.mp4`)} type="video/mp4"/>
      </video>
      <button type="button" className="st-loop-btn" onClick={toggle} aria-pressed={!playing}
        aria-label={playing ? 'Pause animation' : 'Play animation'}>
        {playing ? <Pause size={14} aria-hidden="true"/> : <Play size={14} aria-hidden="true"/>}
      </button>
    </figure>
  );
}
