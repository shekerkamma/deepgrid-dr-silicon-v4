"""Writes compositions/frames/NN-*.html for the DG32 fault-path explainer.

One generator so every frame shares the same fonts, tokens and label styles (frame.md).
Cue times are the narration's word starts (audio_meta.json, Groq word timestamps aligned to
SCRIPT.md). Content stays above y=880: the caption band is 900-1080.
"""
import os

FONTS = """
@font-face{font-family:"DG Serif";src:url("assets/fonts/georgia.ttf") format("truetype");font-weight:400;font-style:normal}
@font-face{font-family:"DG Serif";src:url("assets/fonts/georgiai.ttf") format("truetype");font-weight:400;font-style:italic}
@font-face{font-family:"DG Sans";src:url("assets/fonts/arial.ttf") format("truetype");font-weight:400}
@font-face{font-family:"DG Sans";src:url("assets/fonts/arialbd.ttf") format("truetype");font-weight:700}
@font-face{font-family:"DG Mono";src:url("assets/fonts/cour.ttf") format("truetype");font-weight:400}
"""

def base_css(p):
    return f"""
#root{{position:absolute;inset:0;color:#eeeae2;font-family:"DG Sans",sans-serif;overflow:hidden}}
#{p}-bg{{position:absolute;inset:0;background:#101212}}
#{p}-grid{{position:absolute;inset:0;opacity:.35;background-image:linear-gradient(#3d453b22 1px,transparent 1px),linear-gradient(90deg,#3d453b22 1px,transparent 1px);background-size:80px 80px}}
.{p}-kicker{{position:absolute;left:120px;top:92px;font-family:"DG Mono",monospace;font-size:24px;letter-spacing:4px;color:#d4a36e;text-transform:uppercase}}
.{p}-title{{position:absolute;left:120px;top:132px;font-family:"DG Serif",serif;font-size:76px;line-height:1.05;letter-spacing:-1.5px;color:#eeeae2;margin:0}}
.{p}-title em{{font-style:italic;color:#c5c2b3}}
.{p}-lbl{{font-family:"DG Mono",monospace;font-size:24px;letter-spacing:3px;color:#a7b09f;text-transform:uppercase}}
.{p}-box{{position:absolute;border:2px solid #3d453b;border-radius:10px;background:#191d1b;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px}}
.{p}-box b{{font-family:"DG Sans",sans-serif;font-weight:700;font-size:30px;letter-spacing:1px;color:#eeeae2}}
.{p}-box span{{font-family:"DG Mono",monospace;font-size:22px;letter-spacing:2px;color:#a7b09f;text-transform:uppercase}}
.{p}-val{{font-family:"DG Mono",monospace;font-size:34px;letter-spacing:2px;color:#eeeae2}}
"""

def frame(fid, p, css, body, tl):
    return f"""<template>
<style>
{FONTS}
{base_css(p)}
{css}
</style>
<div id="root" data-composition-id="{fid}" data-width="1920" data-height="1080">
  <div id="{p}-bg" class="clip" data-start="0" data-duration="__DUR__" data-track-index="0"></div>
  <div id="{p}-grid" class="clip" data-start="0" data-duration="__DUR__" data-track-index="1"></div>
  <div id="{p}-stage" class="clip" data-start="0" data-duration="__DUR__" data-track-index="2">
{body}
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
(function(){{
  const tl = gsap.timeline({{ paused: true }});
  const E = "power3.out";
{tl}
  window.__timelines["{fid}"] = tl;
}})();
</script>
</template>
"""

FRAMES = []

# ---------------------------------------------------------------- 01 one wrong value (13.2s)
p = "f01"
legs = ""
for i, x in enumerate([0, 150, 300]):
    legs += f"""
      <g class="{p}-leg" id="{p}-leg{i}">
        <line x1="{x+60}" y1="40" x2="{x+60}" y2="360" stroke="#3d453b" stroke-width="3"/>
        <rect x="{x+30}" y="80" width="60" height="70" rx="6" fill="#191d1b" stroke="#a7b09f" stroke-width="2"/>
        <rect x="{x+30}" y="250" width="60" height="70" rx="6" fill="#191d1b" stroke="#a7b09f" stroke-width="2"/>
        <line x1="{x+60}" y1="200" x2="{x+60+ (120 if i==2 else 0)}" y2="200" stroke="#3d453b" stroke-width="3"/>
      </g>"""
FRAMES.append(("01-wrong-value", p, f"""
#{p}-bridge{{position:absolute;left:180px;top:360px;width:560px;height:420px}}
#{p}-pwm{{position:absolute;left:880px;top:380px;width:860px;height:240px}}
#{p}-lb{{position:absolute;left:190px;top:800px}}
#{p}-lp{{position:absolute;left:880px;top:640px}}
#{p}-flare{{position:absolute;left:470px;top:420px;width:180px;height:300px;border-radius:14px;background:radial-gradient(closest-side,#bf7f3bcc,#bf7f3b00);opacity:0}}
""", f"""
    <div class="{p}-kicker" id="{p}-k">DG32-LITE · Safety</div>
    <h1 class="{p}-title" id="{p}-t">One wrong <em>value</em></h1>
    <svg id="{p}-bridge" viewBox="0 0 560 420">
      <line x1="30" y1="40" x2="420" y2="40" stroke="#3d453b" stroke-width="3"/>
      <line x1="30" y1="360" x2="420" y2="360" stroke="#3d453b" stroke-width="3"/>
      {legs}
      <circle id="{p}-motor" cx="500" cy="200" r="46" fill="none" stroke="#a7b09f" stroke-width="3"/>
      <text x="500" y="210" text-anchor="middle" font-family="DG Serif" font-size="34" fill="#a7b09f">M</text>
    </svg>
    <div id="{p}-flare"></div>
    <svg id="{p}-pwm" viewBox="0 0 860 240">
      <path id="{p}-wave" d="M0 180 H60 V60 H160 V180 H260 V60 H360 V180 H460 V60 H560 V180 H660 V60 H760 V180 H860" fill="none" stroke="#d4a36e" stroke-width="4"/>
      <path id="{p}-bad" d="M460 180 V60 H500 V180" fill="none" stroke="#bf7f3b" stroke-width="6" stroke-dasharray="10 8"/>
      <line id="{p}-ghost" x1="500" y1="40" x2="500" y2="200" stroke="#bf7f3b" stroke-width="2"/>
    </svg>
    <div class="{p}-lbl" id="{p}-lb">Three-phase bridge</div>
    <div class="{p}-lbl" id="{p}-lp">PWM · gate signals</div>
""", f"""
  tl.fromTo("#{p}-k",{{opacity:0,y:12}},{{opacity:1,y:0,duration:.5,ease:E}},0.1);
  tl.fromTo("#{p}-t",{{opacity:0,y:24}},{{opacity:1,y:0,duration:.7,ease:E}},0.2);
  tl.fromTo("#{p}-bridge",{{opacity:0,y:20}},{{opacity:1,y:0,duration:.9,ease:E}},0.9);
  tl.fromTo(".{p}-leg",{{opacity:0}},{{opacity:1,duration:.4,stagger:.12}},1.3);
  tl.fromTo("#{p}-lb",{{opacity:0}},{{opacity:1,duration:.5}},2.0);
  tl.fromTo("#{p}-pwm",{{opacity:0}},{{opacity:1,duration:.3}},4.0);
  tl.fromTo("#{p}-wave",{{strokeDasharray:2400,strokeDashoffset:2400}},{{strokeDashoffset:0,duration:2.2,ease:"none"}},4.0);
  tl.fromTo("#{p}-lp",{{opacity:0}},{{opacity:1,duration:.5}},4.6);
  tl.fromTo("#{p}-bad",{{opacity:0}},{{opacity:1,duration:.3}},5.4);
  tl.fromTo("#{p}-ghost",{{opacity:0}},{{opacity:1,duration:.2,yoyo:true,repeat:3}},7.4);
  tl.fromTo("#{p}-flare",{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:.5,ease:"power2.out"}},11.6);
  tl.to("#{p}-leg2 rect",{{stroke:"#bf7f3b",duration:.3}},11.6);
  tl.to("#{p}-bridge",{{x:6,duration:.05,yoyo:true,repeat:5}},11.7);
"""))

# ---------------------------------------------------------------- 02 the gap (10.1s)
p = "f02"
ticks = "".join(f'<div class="{p}-tick" style="left:{x}px"><i></i><span>SELF-TEST</span></div>' for x in [0, 420, 840, 1260])
gaps = "".join(f'<div class="{p}-gap" style="left:{x+40}px"></div>' for x in [0, 420, 840])
FRAMES.append(("02-the-gap", p, f"""
#{p}-line{{position:absolute;left:180px;top:560px;width:1560px;height:2px;background:#3d453b}}
#{p}-track{{position:absolute;left:180px;top:420px;width:1560px;height:300px}}
.{p}-tick{{position:absolute;top:60px;width:40px;display:flex;flex-direction:column;align-items:center;gap:14px}}
.{p}-tick i{{display:block;width:40px;height:160px;border-radius:6px;background:#d4a36e}}
.{p}-tick span{{font-family:"DG Mono",monospace;font-size:22px;letter-spacing:2px;color:#d4a36e;white-space:nowrap}}
.{p}-gap{{position:absolute;top:60px;width:380px;height:160px;border:2px dashed #3d453b;border-radius:6px;background:repeating-linear-gradient(135deg,#a7b09f14 0 10px,transparent 10px 22px)}}
#{p}-blind{{position:absolute;left:430px;top:340px;font-family:"DG Mono",monospace;font-size:22px;letter-spacing:4px;color:#a7b09f}}
#{p}-spark{{position:absolute;left:1220px;top:470px;width:60px;height:60px;border-radius:50%;background:radial-gradient(closest-side,#bf7f3b,#bf7f3b00)}}
#{p}-sl{{position:absolute;left:1205px;top:760px;font-family:"DG Mono",monospace;font-size:20px;letter-spacing:3px;color:#bf7f3b}}
#{p}-time{{position:absolute;left:180px;top:760px}}
""", f"""
    <div class="{p}-kicker" id="{p}-k">The usual defence</div>
    <h1 class="{p}-title" id="{p}-t">Blind <em>between runs</em></h1>
    <div id="{p}-line"></div>
    <div id="{p}-track">{gaps}{ticks}</div>
    <div id="{p}-blind">UNCHECKED</div>
    <div id="{p}-spark"></div>
    <div id="{p}-sl">FAULT</div>
    <div class="{p}-lbl" id="{p}-time">time →</div>
""", f"""
  tl.fromTo("#{p}-k",{{opacity:0,y:12}},{{opacity:1,y:0,duration:.5,ease:E}},0.1);
  tl.fromTo("#{p}-line",{{scaleX:0}},{{scaleX:1,transformOrigin:"0 50%",duration:1.2,ease:"power2.inOut"}},0.4);
  tl.fromTo("#{p}-time",{{opacity:0}},{{opacity:1,duration:.4}},1.2);
  tl.fromTo(".{p}-tick",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.45,stagger:.35,ease:E}},1.4);
  tl.fromTo("#{p}-t",{{opacity:0,y:24}},{{opacity:1,y:0,duration:.7,ease:E}},3.6);
  tl.fromTo(".{p}-gap",{{opacity:0}},{{opacity:1,duration:.5,stagger:.25}},5.4);
  tl.fromTo("#{p}-blind",{{opacity:0}},{{opacity:1,duration:.5}},6.4);
  tl.fromTo("#{p}-spark",{{opacity:0,scale:.2}},{{opacity:1,scale:1.4,duration:.4,ease:"power2.out"}},7.8);
  tl.to("#{p}-spark",{{scale:1,duration:.3}},8.2);
  tl.fromTo("#{p}-sl",{{opacity:0}},{{opacity:1,duration:.4}},8.4);
"""))

# ---------------------------------------------------------------- 03 two cores (15.6s)
p = "f03"
FRAMES.append(("03-two-cores", p, f"""
#{p}-main{{left:420px;top:330px;width:360px;height:170px}}
#{p}-chk{{left:420px;top:600px;width:360px;height:170px}}
#{p}-cmp{{left:1300px;top:465px;width:320px;height:170px}}
#{p}-in{{position:absolute;left:160px;top:545px;font-family:"DG Mono",monospace;font-size:20px;letter-spacing:3px;color:#a7b09f}}
#{p}-lag{{position:absolute;left:810px;top:665px;font-family:"DG Mono",monospace;font-size:22px;letter-spacing:3px;color:#d4a36e}}
#{p}-wires{{position:absolute;inset:0;width:1920px;height:1080px}}
.{p}-chip{{position:absolute;padding:8px 16px;border:2px solid #3d453b;border-radius:8px;background:#101212;font-family:"DG Mono",monospace;font-size:28px;color:#eeeae2}}
#{p}-ok{{position:absolute;left:1640px;top:512px;font-family:"DG Serif",serif;font-size:72px;color:#d4a36e}}
""", f"""
    <div class="{p}-kicker" id="{p}-k">DG32-LITE · Lockstep</div>
    <h1 class="{p}-title" id="{p}-t">Two cores, <em>one answer</em></h1>
    <svg id="{p}-wires" viewBox="0 0 1920 1080">
      <path id="{p}-win" d="M300 560 H360 V415 H420 M360 560 V685 H420" fill="none" stroke="#3d453b" stroke-width="3"/>
      <path id="{p}-wout" d="M780 415 H1040 V520 H1300 M780 685 H1040 V580 H1300" fill="none" stroke="#3d453b" stroke-width="3"/>
    </svg>
    <div class="{p}-box" id="{p}-main"><b>MAIN</b><span>RV32IM · runs the code</span></div>
    <div class="{p}-box" id="{p}-chk"><b>CHECKER</b><span>same instructions</span></div>
    <div class="{p}-box" id="{p}-cmp"><b>COMPARATOR</b><span>every committed store</span></div>
    <div id="{p}-in">INPUTS</div>
    <div id="{p}-lag">+2 CYCLES</div>
    <div class="{p}-chip" id="{p}-c1" style="left:830px;top:388px">0x3A7F</div>
    <div class="{p}-chip" id="{p}-c2" style="left:830px;top:658px">0x3A7F</div>
    <div id="{p}-ok">=</div>
""", f"""
  tl.fromTo("#{p}-k",{{opacity:0,y:12}},{{opacity:1,y:0,duration:.5,ease:E}},0.1);
  tl.fromTo("#{p}-t",{{opacity:0,y:24}},{{opacity:1,y:0,duration:.7,ease:E}},0.3);
  tl.fromTo("#{p}-main",{{opacity:0,y:20}},{{opacity:1,y:0,duration:.6,ease:E}},1.4);
  tl.fromTo("#{p}-chk",{{opacity:0,y:20}},{{opacity:1,y:0,duration:.6,ease:E}},4.3);
  tl.fromTo("#{p}-lag",{{opacity:0,x:-16}},{{opacity:1,x:0,duration:.5,ease:E}},6.2);
  tl.fromTo("#{p}-win",{{strokeDasharray:900,strokeDashoffset:900}},{{strokeDashoffset:0,duration:1.2,ease:"none"}},8.3);
  tl.fromTo("#{p}-in",{{opacity:0}},{{opacity:1,duration:.4}},8.6);
  tl.fromTo("#{p}-cmp",{{opacity:0,y:20}},{{opacity:1,y:0,duration:.6,ease:E}},11.3);
  tl.fromTo("#{p}-wout",{{strokeDasharray:1400,strokeDashoffset:1400}},{{strokeDashoffset:0,duration:1.0,ease:"none"}},11.6);
  tl.fromTo("#{p}-c1",{{opacity:0,x:0}},{{opacity:1,x:280,duration:1.4,ease:"power1.inOut"}},12.0);
  tl.fromTo("#{p}-c2",{{opacity:0,x:0}},{{opacity:1,x:280,duration:1.4,ease:"power1.inOut"}},12.9);
  tl.fromTo("#{p}-ok",{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:.5,ease:"back.out(2)"}},14.6);
"""))

# ---------------------------------------------------------------- 04 fault path (26.9s)
p = "f04"
nodes = [("cmp", "COMPARATOR", "flags the store", 470), ("latch", "FAULT LATCH", "first cause", 800),
         ("fn", "FAULT_N", "pin", 1130), ("gd", "GATE DRIVER", "enable", 1460)]
nb = "".join(f'<div class="{p}-box {p}-node" id="{p}-{k}" style="left:{x}px;top:470px;width:260px;height:150px"><b style="font-size:24px">{t}</b><span>{s}</span></div>' for k, t, s, x in nodes)
FRAMES.append(("04-fault-path", p, f"""
#{p}-main{{left:100px;top:330px;width:270px;height:130px}}
#{p}-chk{{left:100px;top:630px;width:270px;height:130px}}
#{p}-v1{{position:absolute;left:390px;top:360px}}
#{p}-v2{{position:absolute;left:390px;top:660px}}
#{p}-wire{{position:absolute;inset:0;width:1920px;height:1080px}}
#{p}-bridge{{left:1560px;top:250px;width:260px;height:150px}}
#{p}-off{{position:absolute;left:1440px;top:200px;width:500px;white-space:nowrap;text-align:center;font-family:"DG Mono",monospace;font-size:22px;letter-spacing:4px;color:#2f9e8c}}
#{p}-fw{{position:absolute;left:470px;top:760px;width:1250px;height:90px;border:2px dashed #3d453b;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:"DG Mono",monospace;font-size:22px;letter-spacing:4px;color:#a7b09f}}
#{p}-ctr{{position:absolute;left:800px;top:650px;width:260px;text-align:center;font-family:"DG Serif",serif;font-size:56px;color:#d4a36e}}
#{p}-ctrl{{position:absolute;left:760px;top:716px;width:340px;text-align:center;font-family:"DG Mono",monospace;font-size:22px;letter-spacing:3px;color:#a7b09f}}
#{p}-ne{{position:absolute;left:545px;top:420px;font-family:"DG Serif",serif;font-size:44px;color:#bf7f3b}}
""", f"""
    <div class="{p}-kicker" id="{p}-k">The fault path</div>
    <h1 class="{p}-title" id="{p}-t">Mismatch <em>to safe state</em></h1>
    <svg id="{p}-wire" viewBox="0 0 1920 1080">
      <path d="M370 395 H420 V545 H470 M370 695 H420 V545" fill="none" stroke="#3d453b" stroke-width="3"/>
      <path id="{p}-sig" d="M730 545 H800 M1060 545 H1130 M1390 545 H1460 M1590 470 V400" fill="none" stroke="#3d453b" stroke-width="3"/>
      <path id="{p}-hot" d="M730 545 H800 M1060 545 H1130 M1390 545 H1460 M1590 470 V400" fill="none" stroke="#d4a36e" stroke-width="5"/>
    </svg>
    <div class="{p}-box" id="{p}-main"><b style="font-size:26px">MAIN</b></div>
    <div class="{p}-box" id="{p}-chk"><b style="font-size:26px">CHECKER</b></div>
    <div class="{p}-val" id="{p}-v1">0x3A7E</div>
    <div class="{p}-val" id="{p}-v2">0x3A7F</div>
    {nb}
    <div id="{p}-ne">≠</div>
    <div class="{p}-box" id="{p}-bridge"><b style="font-size:24px">BRIDGE</b><span id="{p}-bs" style="position:relative"><i id="{p}-bs1" style="font-style:normal">switching</i><i id="{p}-bs2" style="font-style:normal;position:absolute;left:0;right:0;opacity:0;color:#2f9e8c">gates off</i></span></div>
    <div id="{p}-off">OFF · SAFE STATE</div>
    <div id="{p}-ctr">0</div>
    <div id="{p}-ctrl">cycles · simulated</div>
    <div id="{p}-fw">FIRMWARE · not in this path</div>
""", f"""
  tl.fromTo("#{p}-k",{{opacity:0,y:12}},{{opacity:1,y:0,duration:.5,ease:E}},0.0);
  tl.fromTo("#{p}-t",{{opacity:0,y:24}},{{opacity:1,y:0,duration:.7,ease:E}},0.1);
  tl.fromTo("#{p}-main, #{p}-chk, .{p}-node, #{p}-bridge, #{p}-wire",{{opacity:0}},{{opacity:.55,duration:.8,stagger:.05}},0.3);
  tl.to("#{p}-main",{{opacity:1,borderColor:"#bf7f3b",duration:.4}},1.0);
  tl.fromTo("#{p}-v1",{{opacity:0,y:-10}},{{opacity:1,y:0,color:"#bf7f3b",duration:.5,ease:E}},2.0);
  tl.to("#{p}-chk",{{opacity:1,duration:.4}},3.2);
  tl.fromTo("#{p}-v2",{{opacity:0,y:10}},{{opacity:1,y:0,duration:.5,ease:E}},3.8);
  tl.to("#{p}-cmp",{{opacity:1,borderColor:"#d4a36e",duration:.4}},5.9);
  tl.fromTo("#{p}-ne",{{opacity:0,scale:.5}},{{opacity:1,scale:1,duration:.4,ease:"back.out(2)"}},6.2);
  tl.fromTo("#{p}-hot",{{strokeDasharray:1200,strokeDashoffset:1200}},{{strokeDashoffset:1130,duration:.4}},10.4);
  tl.to("#{p}-latch",{{opacity:1,borderColor:"#d4a36e",duration:.4}},11.7);
  tl.to("#{p}-hot",{{strokeDashoffset:1060,duration:.4}},14.0);
  tl.to("#{p}-fn",{{opacity:1,borderColor:"#d4a36e",duration:.4}},14.1);
  tl.to("#{p}-hot",{{strokeDashoffset:990,duration:.4}},16.0);
  tl.to("#{p}-gd",{{opacity:1,borderColor:"#d4a36e",duration:.4}},16.2);
  tl.to("#{p}-hot",{{strokeDashoffset:0,duration:.6}},17.2);
  tl.to("#{p}-bridge",{{opacity:1,borderColor:"#2f9e8c",duration:.5}},17.7);
  tl.to("#{p}-bs1",{{opacity:0,duration:.3}},17.8);
  tl.to("#{p}-bs2",{{opacity:1,duration:.3}},17.9);
  tl.fromTo("#{p}-off",{{opacity:0,y:8}},{{opacity:1,y:0,duration:.5,ease:E}},17.9);
  tl.fromTo("#{p}-ctr, #{p}-ctrl",{{opacity:0}},{{opacity:1,duration:.4}},19.2);
  const c={{n:0}}; const ctr=document.getElementById("{p}-ctr");
  tl.fromTo(c,{{n:0}},{{n:39,duration:2.6,ease:"none",onUpdate:()=>{{ctr.textContent=String(Math.round(c.n));}}}},20.3);
  tl.fromTo("#{p}-fw",{{opacity:0}},{{opacity:1,duration:.6}},24.5);
"""))

# ---------------------------------------------------------------- 05 inject (12.4s)
p = "f05"
FRAMES.append(("05-inject", p, f"""
#{p}-csr{{left:160px;top:420px;width:340px;height:190px}}
#{p}-lock{{position:absolute;left:250px;top:320px;width:60px;height:80px}}
#{p}-path{{position:absolute;inset:0;width:1920px;height:1080px}}
#{p}-latch{{left:1100px;top:420px;width:320px;height:190px}}
#{p}-cause{{position:absolute;left:1100px;top:640px;width:320px;text-align:center;font-family:"DG Mono",monospace;font-size:26px;letter-spacing:2px;color:#d4a36e}}
#{p}-pulse{{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#d4a36e}}
#{p}-bench{{position:absolute;left:1480px;top:470px;width:360px;font-family:"DG Mono",monospace;font-size:24px;letter-spacing:3px;color:#a7b09f;line-height:1.6}}
""", f"""
    <div class="{p}-kicker" id="{p}-k">On real silicon</div>
    <h1 class="{p}-title" id="{p}-t">Proven <em>by firing it</em></h1>
    <svg id="{p}-lock" viewBox="0 0 60 80"><path id="{p}-shackle" d="M14 36 V22 a16 16 0 0 1 32 0 V36" fill="none" stroke="#d4a36e" stroke-width="5"/><rect x="6" y="36" width="48" height="40" rx="6" fill="#191d1b" stroke="#d4a36e" stroke-width="4"/></svg>
    <div class="{p}-box" id="{p}-csr"><b>FAULT CSR</b><span>locked register</span></div>
    <svg id="{p}-path" viewBox="0 0 1920 1080"><path id="{p}-line" d="M500 515 H1100" fill="none" stroke="#3d453b" stroke-width="3"/></svg>
    <div id="{p}-pulse"></div>
    <div class="{p}-box" id="{p}-latch"><b>FAULT LATCH</b><span>first cause</span></div>
    <div id="{p}-cause">CAUSE 001</div>
    <div id="{p}-bench">NEXT: FIRST-SILICON BRING-UP BENCH</div>
""", f"""
  tl.fromTo("#{p}-k",{{opacity:0,y:12}},{{opacity:1,y:0,duration:.5,ease:E}},0.1);
  tl.fromTo("#{p}-t",{{opacity:0,y:24}},{{opacity:1,y:0,duration:.7,ease:E}},0.3);
  tl.fromTo("#{p}-latch, #{p}-line",{{opacity:0}},{{opacity:.6,duration:.6}},1.3);
  tl.fromTo("#{p}-csr",{{opacity:0,y:20}},{{opacity:1,y:0,duration:.6,ease:E}},2.9);
  tl.fromTo("#{p}-lock",{{opacity:0}},{{opacity:1,duration:.4}},3.7);
  tl.fromTo("#{p}-shackle",{{y:0}},{{y:-12,duration:.4,ease:"power2.out"}},4.9);
  tl.fromTo("#{p}-pulse",{{opacity:0,x:500,y:502}},{{opacity:1,x:500,y:502,duration:.2}},5.6);
  tl.to("#{p}-pulse",{{x:1074,duration:1.4,ease:"power1.inOut"}},5.8);
  tl.to("#{p}-latch",{{opacity:1,borderColor:"#d4a36e",duration:.4}},7.2);
  tl.to("#{p}-pulse",{{opacity:0,duration:.3}},7.3);
  tl.fromTo("#{p}-cause",{{opacity:0,y:10}},{{opacity:1,y:0,duration:.5,ease:E}},8.6);
  tl.fromTo("#{p}-bench",{{opacity:0,x:-12}},{{opacity:1,x:0,duration:.6,ease:E}},10.9);
"""))

# ---------------------------------------------------------------- 06 close (10.7s)
p = "f06"
FRAMES.append(("06-close", p, f"""
#{p}-a{{position:absolute;left:0;right:0;top:330px;text-align:center;font-family:"DG Serif",serif;font-size:120px;letter-spacing:-3px;color:#eeeae2}}
#{p}-b{{position:absolute;left:0;right:0;top:470px;text-align:center;font-family:"DG Serif",serif;font-style:italic;font-size:120px;letter-spacing:-3px;color:#c5c2b3}}
#{p}-rule{{position:absolute;left:760px;top:660px;width:400px;height:2px;background:#d4a36e}}
#{p}-m{{position:absolute;left:0;right:0;top:700px;text-align:center;font-family:"DG Mono",monospace;font-size:26px;letter-spacing:5px;color:#a7b09f}}
#{p}-logo{{position:absolute;left:0;right:0;top:760px;text-align:center;font-family:"DG Sans",sans-serif;font-weight:700;font-size:34px;letter-spacing:-1px;color:#eeeae2}}
""", f"""
    <div id="{p}-a">Safety in the core.</div>
    <div id="{p}-b">Control in silicon.</div>
    <div id="{p}-rule"></div>
    <div id="{p}-m">DG32-LITE · SEP 2026 MPW · PRE-SILICON</div>
    <div id="{p}-logo">deepgrid</div>
""", f"""
  tl.fromTo("#{p}-a",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.8,ease:E}},0.0);
  tl.fromTo("#{p}-b",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.8,ease:E}},0.8);
  tl.fromTo("#{p}-rule",{{scaleX:0}},{{scaleX:1,transformOrigin:"50% 50%",duration:.8,ease:"power2.inOut"}},2.7);
  tl.fromTo("#{p}-m",{{opacity:0}},{{opacity:1,duration:.6}},4.5);
  tl.fromTo("#{p}-logo",{{opacity:0,y:10}},{{opacity:1,y:0,duration:.6,ease:E}},7.3);
"""))

import json, re
meta = {v["frame"]: v["duration_s"] for v in json.load(open("audio_meta.json"))["voices"]}
os.makedirs("compositions/frames", exist_ok=True)
for i, (fid, p, css, body, tl) in enumerate(FRAMES, 1):
    html = frame(fid, p, css, body, tl).replace("__DUR__", f"{meta[i]:.3f}")
    open(f"compositions/frames/{fid}.html", "w").write(html)
    print("wrote", fid, meta[i])
