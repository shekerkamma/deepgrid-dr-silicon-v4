// DG32's narrated films (public/media), for the pages built on the company-page renderer. Titles follow the
// site's own names for them; lengths are read from the files.
import { url } from './routes';
export type Film = { id: string; title: string; sub: string; length: string; src: string; poster: string; vtt: string };
const f = (id: string, title: string, sub: string, length: string): Film => ({
  id, title, sub, length, src: url('/media/' + id + '.mp4'), poster: url('/media/' + id + '-poster.jpg'), vtt: url('/media/' + id + '.vtt'),
});
export const films: Film[] = [
  f('dg32-fault-path-explained', 'The fault path, explained', 'From a silent CPU fault to a switched-off bridge, in hardware', '1:28'),
  f('dg32-lite-architecture', 'DG32-LITE system architecture', 'The lockstep motor-control chip, block by block', '7:43'),
  f('dg32-lite-datasheet', 'DG32-LITE datasheet', 'The preliminary datasheet, narrated', '5:33'),
  f('dg32-lite-tapein', 'DG32-LITE tape-in', 'From the frozen design to the shuttle', '5:30'),
  f('dg32-2dom-architecture', 'DG32-2DOM system architecture', 'The two-domain chip and its attention engine', '6:16'),
  f('dg32-2dom-datasheet', 'DG32-2DOM datasheet', 'The preliminary datasheet, narrated', '4:19'),
];
