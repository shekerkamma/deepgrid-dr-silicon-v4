// The thirty diagnostic tasks, read off the use-case playbook's own tables
// (public/downloads/docs/deepgrid-dg32-ai-30-use-cases.pdf, pages 7-10).
//
// The catalogue used to show four example tasks per domain while the page said thirty, so
// fourteen of them existed only as a number. Every field below is a cell from that document:
// what the task detects, what it needs to sense it, the features and model it runs, and the
// memory, latency and maximum rate the document states. Nothing here is summarised or inferred.
//
// Domain ids are the site's own (rotating, electrical, motion, degradation), not the playbook's
// page titles: the catalogue filters on them, and using the document's wording instead left two
// filters showing zero tasks until scripts/check-usecases.mjs compared the two sets.
// scripts/check-usecases.mjs re-counts these against the document's own headline figure.

export type UseCase = {
  domain: 'rotating' | 'electrical' | 'motion' | 'degradation';
  name: string; detects: string; sensing: string; features: string;
  model: string; memory: string; latency: string; rate: string;
};

export const diagnosticTasks: UseCase[] = [
  {domain: 'rotating', name: 'Bearing fault classification', detects: 'Inner race, outer race, ball and cage defects', sensing: 'Accelerometer, ≥5 kHz bandwidth', features: 'envelope + FFT-256 + moments', model: 'Random forest, 100×d8', memory: '20 KB', latency: '0.92 ms', rate: '890 Hz'},
  {domain: 'rotating', name: 'Bearing severity trending', detects: 'ISO 20816 zone A/B/C/D from broadband RMS velocity', sensing: 'Accelerometer', features: 'decimate + RMS', model: 'LDA', memory: '0.7 KB', latency: '0.14 ms', rate: '>1 kHz'},
  {domain: 'rotating', name: 'Gearbox and gear-mesh faults', detects: 'Tooth damage, mesh-frequency sideband growth', sensing: 'Accelerometer, order-tracked on encoder', features: 'envelope + FFT-512 + moments', model: 'Random forest, 100×d8', memory: '20 KB', latency: '1.69 ms', rate: '480 Hz'},
  {domain: 'rotating', name: 'Pump cavitation and dry-run', detects: 'Separates cavitation, dry running and normal load', sensing: 'Phase current + pressure over SPI', features: 'FFT-256 + moments', model: 'Gradient boosting, 200×d4', memory: '12 KB', latency: '0.82 ms', rate: '>1 kHz'},
  {domain: 'rotating', name: 'Fan and blower imbalance', detects: 'Blade damage, 1× and 2× amplitude ratio', sensing: 'Accelerometer + tachometer', features: 'FFT-256 + moments', model: 'LDA', memory: '0.7 KB', latency: '0.76 ms', rate: '>1 kHz'},
  {domain: 'rotating', name: 'Compressor valve faults', detects: 'Valve leakage and flutter against crank angle', sensing: 'Accelerometer + crank reference', features: 'envelope + FFT-256', model: 'Random forest, 100×d8', memory: '20 KB', latency: '0.78 ms', rate: '>1 kHz'},
  {domain: 'rotating', name: 'Belt slip and misalignment', detects: 'Dual-encoder differential, or vibration harmonic ratio', sensing: 'Dual encoder or accelerometer', features: 'FFT-256', model: 'Logistic regression', memory: '0.7 KB', latency: '0.62 ms', rate: '>1 kHz'},
  {domain: 'rotating', name: 'Shaft misalignment and looseness', detects: '1×, 2×, 3× harmonic pattern', sensing: 'Accelerometer', features: 'FFT-256 + moments', model: 'Random forest, 100×d8', memory: '20 KB', latency: '0.82 ms', rate: '>1 kHz'},
  {domain: 'electrical', name: 'Broken rotor bar detection', detects: 'Twice-slip-frequency sidebands, f₁(1±2ks)', sensing: 'Phase current, ≥12-bit with notch', features: 'Goertzel', model: 'LDA', memory: '0.7 KB', latency: '0.13 ms', rate: '>1 kHz'},
  {domain: 'electrical', name: 'Air-gap eccentricity', detects: 'f₁ ± m·f_r sidebands from mixed eccentricity', sensing: 'Phase current, ≥12-bit', features: 'Goertzel', model: 'LDA', memory: '0.7 KB', latency: '0.13 ms', rate: '>1 kHz'},
  {domain: 'electrical', name: 'Stator inter-turn short', detects: 'Negative-sequence current index against baseline', sensing: 'Three-phase current + voltage', features: 'Park + RMS', model: 'Mahalanobis score', memory: '2 KB', latency: '0.14 ms', rate: '>1 kHz'},
  {domain: 'electrical', name: 'Phase loss and current unbalance', detects: 'Sequence-component imbalance', sensing: 'Phase current, already sampled', features: 'Park', model: 'Logistic regression', memory: '0.7 KB', latency: '<0.01 ms', rate: '>1 kHz'},
  {domain: 'electrical', name: 'Arc-fault and partial discharge', detects: 'Early insulation breakdown signature', sensing: 'HF current transformer + envelope', features: 'envelope + FFT-256', model: 'One-class SVM', memory: '6.9 KB', latency: '0.97 ms', rate: '840 Hz'},
  {domain: 'electrical', name: 'Power-quality events', detects: 'Sag, swell, harmonic distortion, flicker', sensing: 'Line voltage and current, 64 cycles', features: 'Goertzel', model: 'LDA', memory: '0.7 KB', latency: '0.13 ms', rate: '>1 kHz'},
  {domain: 'electrical', name: 'Battery state-of-health', detects: 'SoH and SoC from charge-cycle shape', sensing: 'Slow V / I / T sequence', features: 'moments', model: 'MLP 32-16-8-4', memory: '0.7 KB', latency: '0.19 ms', rate: '>1 kHz'},
  {domain: 'electrical', name: 'Winding thermal estimation', detects: 'Virtual temperature sensor from current history', sensing: 'Current history + ambient', features: 'RMS', model: 'Extended Kalman filter', memory: '2 KB', latency: '0.11 ms', rate: '>1 kHz'},
  {domain: 'motion', name: 'Sensorless rotor position', detects: 'EKF flux observer, removes the position sensor', sensing: 'Phase current, CORDIC- assisted', features: 'Park', model: 'Extended Kalman filter', memory: '2 KB', latency: '0.05 ms', rate: '>1 kHz'},
  {domain: 'motion', name: 'Learned sensor plausibility', detects: 'Encoder vs Hall vs back-EMF consistency', sensing: 'Existing peripherals, no added BOM', features: 'Park', model: 'Nearest centroid', memory: '1 KB', latency: '0.02 ms', rate: '>1 kHz'},
  {domain: 'motion', name: 'Operating-mode classification', detects: 'Which duty regime the machine is in', sensing: 'Encoder, Hall, current, temperature', features: 'RMS', model: 'Gaussian mixture', memory: '2 KB', latency: '0.10 ms', rate: '>1 kHz'},
  {domain: 'motion', name: 'Duty-cycle and state tracking', detects: 'Start counts, dwell times, regime transitions', sensing: 'Existing peripherals', features: 'None', model: 'HMM, 8 state', memory: '2 KB', latency: '0.06 ms', rate: '>1 kHz'},
  {domain: 'motion', name: 'Adaptive friction compensation', detects: 'Learned cogging and friction feedforward', sensing: 'Encoder + current', features: 'Park', model: 'MLP 32-16-8-4', memory: '0.7 KB', latency: '0.06 ms', rate: '>1 kHz'},
  {domain: 'motion', name: 'Kickback and stall detection', detects: 'Sudden load transient classification', sensing: 'Phase current', features: 'RMS', model: 'Gradient boosting, 200×d4', memory: '12 KB', latency: '0.12 ms', rate: '>1 kHz'},
  {domain: 'motion', name: 'Load estimation and torque ripple', detects: 'Torque ripple harmonics from current', sensing: 'Phase current', features: 'FFT-256', model: 'Logistic regression', memory: '0.7 KB', latency: '0.62 ms', rate: '>1 kHz'},
  {domain: 'motion', name: 'Multivariate anomaly scoring', detects: 'Single scalar novelty score, raised as an IRQ', sensing: 'Any fused sensor set', features: 'moments', model: 'Mahalanobis score', memory: '2 KB', latency: '0.22 ms', rate: '>1 kHz'},
  {domain: 'degradation', name: 'Remaining-useful-life regression', detects: 'Trend extrapolation over long feature history', sensing: '64 hourly feature snapshots', features: 'None', model: 'MLP 128-64-32-8', memory: '10.5 KB', latency: '0.84 ms', rate: '970 Hz'},
  {domain: 'degradation', name: 'Unsupervised drift detection', detects: 'Reconstruction error against learned healthy manifold', sensing: 'Any fused sensor set', features: 'moments', model: 'MLP autoencoder', memory: '5.5 KB', latency: '0.58 ms', rate: '>1 kHz'},
  {domain: 'degradation', name: 'Short-horizon forecasting', detects: 'Predicts a slow process variable a few steps ahead', sensing: 'Any slow scalar, 64-step history', features: 'None', model: 'GRU, 16 units', memory: '1.6 KB', latency: '2.95 ms', rate: '270 Hz'},
  {domain: 'degradation', name: 'Raw-waveform fault classification', detects: 'End-to-end from the sampled window, no hand features', sensing: 'Accelerometer or current', features: 'decimate', model: '1D-CNN 8/16/32', memory: '14 KB', latency: '10.32 ms', rate: '79 Hz'},
  {domain: 'degradation', name: 'Novelty detection without labels', detects: 'Isolation-forest outlier score', sensing: 'Any fused sensor set', features: 'moments', model: 'Isolation forest', memory: '8 KB', latency: '0.20 ms', rate: '>1 kHz'},
  {domain: 'degradation', name: 'Per-machine baselining', detects: 'On-device prototype update, no backward pass', sensing: 'Any fused sensor set', features: 'moments', model: 'k-NN, 200 prototypes', memory: '6.4 KB', latency: '0.65 ms', rate: '>1 kHz'},
];

/** The headline the document leads with, and what this file must keep matching. */
export const USE_CASE_TOTAL = 30;

