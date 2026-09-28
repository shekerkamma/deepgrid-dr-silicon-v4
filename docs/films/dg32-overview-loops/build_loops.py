"""Writes five standalone HyperFrames loop compositions for the DG32 overview (BRIEF.md).

Each is seamless: every tween that builds the scene is undone before the end, so the last frame
is the first. Figures match the site's own records (see BRIEF.md notes).
"""

FONTS = """
@font-face{font-family:"DG Serif";src:url("assets/fonts/georgia.ttf") format("truetype");font-weight:400;font-style:normal}
@font-face{font-family:"DG Serif";src:url("assets/fonts/georgiai.ttf") format("truetype");font-weight:400;font-style:italic}
@font-face{font-family:"DG Sans";src:url("assets/fonts/arial.ttf") format("truetype");font-weight:400}
@font-face{font-family:"DG Sans";src:url("assets/fonts/arialbd.ttf") format("truetype");font-weight:700}
@font-face{font-family:"DG Mono";src:url("assets/fonts/cour.ttf") format("truetype");font-weight:400}
"""


def doc(cid, w, h, dur, css, body, tl):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width={w}, height={h}"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
{FONTS}
body{{margin:0;background:#101212}}
#root{{position:relative;width:100%;height:100%;overflow:hidden;background:#101212;color:#eeeae2;font-family:"DG Sans",sans-serif}}
#grid{{position:absolute;inset:0;opacity:.4;background-image:linear-gradient(#3d453b22 1px,transparent 1px),linear-gradient(90deg,#3d453b22 1px,transparent 1px);background-size:40px 40px}}
.mono{{font-family:"DG Mono",monospace;letter-spacing:2px;text-transform:uppercase}}
.box{{position:absolute;border:2px solid #3d453b;border-radius:10px;background:#191d1b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center}}
{css}
</style>
</head>
<body>
<div id="root" data-composition-id="{cid}" data-start="0" data-width="{w}" data-height="{h}" data-duration="{dur}">
  <div id="grid" class="clip" data-start="0" data-duration="{dur}" data-track-index="0"></div>
  <div id="stage" class="clip" data-start="0" data-duration="{dur}" data-track-index="1">
{body}
  </div>
</div>
<script>
(function(){{
  const tl = gsap.timeline({{ paused: true }});
  const E = "power3.out";
{tl}
  window.__timelines["{cid}"] = tl;
}})();
</script>
</body>
</html>
"""


LOOPS = {}

# ------------------------------------------------ A. loop cost is fixed (800x450, 8s)
rates = [(10, 5000), (20, 2500), (50, 1000), (100, 500)]
LOOPS["loop-cost"] = doc("loop-cost", 800, 450, 8, """
#cap{position:absolute;left:48px;top:36px;font-size:32px;color:#a7b09f}
#rate{position:absolute;left:48px;top:88px;font-family:"DG Serif",serif;font-size:104px;line-height:1;color:#eeeae2}
#rate span{position:absolute;left:0;top:0;white-space:nowrap}
#bar{position:absolute;left:48px;top:250px;width:704px;height:56px;border-radius:6px;background:#2f9e8c;overflow:hidden}
#hw{position:absolute;left:0;top:0;height:100%;width:6%;background:#bf7f3b}
#hwl{position:absolute;left:48px;top:326px;font-size:34px;color:#bf7f3b}
#cpul{position:absolute;right:48px;top:326px;font-size:34px;color:#2f9e8c;text-align:right}
#cpul span{position:absolute;right:0;top:0;white-space:nowrap}
#r1,#r2,#r3,#c1,#c2,#c3{opacity:0}
""", """
    <div id="cap" class="mono">One loop · 50 MHz</div>
    <div id="rate">""" + "".join(f'<span id="r{i}">{k} kHz</span>' for i, (k, _) in enumerate(rates)) + """</div>
    <div id="bar"><div id="hw"></div></div>
    <div id="hwl" class="mono">Hardware ~300</div>
    <div id="cpul" class="mono">""" + "".join(f'<span id="c{i}">CPU ~{p-300:,}</span>' for i, (_, p) in enumerate(rates)) + """</div>
""", """
  // resting state = 10 kHz; step through the rates, then return.
  const W=[6,12,30,60];
  [[1,1.6],[2,3.2],[3,4.8]].forEach(([i,t])=>{
    tl.to(["#r"+(i-1),"#c"+(i-1)],{opacity:0,duration:.25},t);
    tl.fromTo(["#r"+i,"#c"+i],{opacity:0,y:10},{opacity:1,y:0,duration:.35,ease:E,immediateRender:false},t+.2);
    tl.to("#hw",{width:W[i]+"%",duration:.7,ease:"power2.inOut"},t);
  });
  tl.to(["#r3","#c3"],{opacity:0,duration:.25},7.1);
  tl.to("#hw",{width:"6%",duration:.7,ease:"power2.inOut"},7.1);
  tl.to(["#r0","#c0"],{opacity:1,duration:.35},7.4);
""")

# ------------------------------------------------ B. fault response (800x450, 8s)
LOOPS["fault-response"] = doc("fault-response", 800, 450, 8, """
#m{left:40px;top:70px;width:150px;height:80px} #k{left:40px;top:240px;width:150px;height:80px}
.box b{font-size:24px;font-weight:700;letter-spacing:1px}
#vm{position:absolute;left:204px;top:90px;font-family:"DG Mono",monospace;font-size:26px;color:#eeeae2}
#vk{position:absolute;left:204px;top:260px;font-family:"DG Mono",monospace;font-size:26px;color:#eeeae2}
#cmp{left:350px;top:150px;width:150px;height:90px} #fn{left:560px;top:150px;width:180px;height:90px}
#br{left:560px;top:300px;width:180px;height:90px}
#ne{position:absolute;left:406px;top:96px;font-family:"DG Serif",serif;font-size:44px;color:#d4a36e}
#w{position:absolute;inset:0;width:800px;height:450px}
#ctr{position:absolute;left:40px;top:360px;font-size:32px;color:#a7b09f}
#ne,#off,#ctr{opacity:0}
#off{position:absolute;left:560px;top:396px;width:180px;text-align:center;font-size:30px;color:#2f9e8c}
""", """
    <svg id="w" viewBox="0 0 800 450">
      <path d="M190 110 H300 V195 H350 M190 280 H300 V195" fill="none" stroke="#3d453b" stroke-width="3"/>
      <path d="M500 195 H560 M650 240 V300" fill="none" stroke="#3d453b" stroke-width="3"/>
      <path id="hot" d="M500 195 H560 M650 240 V300" fill="none" stroke="#d4a36e" stroke-width="5" stroke-dasharray="120" stroke-dashoffset="120"/>
    </svg>
    <div class="box" id="m"><b>MAIN</b></div>
    <div class="box" id="k"><b>CHECKER</b></div>
    <div id="vm">3A7F</div><div id="vk">3A7F</div>
    <div class="box" id="cmp"><b style="font-size:20px">COMPARE</b></div>
    <div id="ne">≠</div>
    <div class="box" id="fn"><b style="font-size:22px">FAULT_N</b></div>
    <div class="box" id="br"><b style="font-size:22px">BRIDGE</b></div>
    <div id="off" class="mono">off</div>
    <div id="ctr" class="mono"><span style="display:block">39 cycles</span><span style="display:block">simulated</span></div>
""", """
  tl.to("#vm",{color:"#bf7f3b",duration:.2},1.2);
  tl.to("#m",{borderColor:"#bf7f3b",duration:.3},1.2);
  tl.set("#vm",{textContent:"3A7E"},1.2);
  tl.to("#cmp",{borderColor:"#d4a36e",duration:.3},2.0);
  tl.to("#ne",{opacity:1,duration:.3},2.0);
  tl.to("#hot",{strokeDashoffset:60,duration:.4},2.6);
  tl.to("#fn",{borderColor:"#d4a36e",duration:.3},2.9);
  tl.to("#hot",{strokeDashoffset:0,duration:.4},3.4);
  tl.to("#br",{borderColor:"#2f9e8c",duration:.3},3.8);
  tl.to("#off",{opacity:1,duration:.3},3.9);
  tl.to("#ctr",{opacity:1,duration:.4},4.3);
  // reset to the opening frame
  tl.to(["#ne","#off","#ctr"],{opacity:0,duration:.4},7.0);
  tl.to(["#m","#cmp","#fn","#br"],{borderColor:"#3d453b",duration:.4},7.0);
  tl.to("#hot",{strokeDashoffset:120,duration:.4},7.0);
  tl.to("#vm",{color:"#eeeae2",duration:.3},7.2);
  tl.set("#vm",{textContent:"3A7F"},7.2);
""")

# ------------------------------------------------ C. second source (800x450, 8s)
fabs = [("SkyWater", "USA"), ("IHP", "Germany"), ("SCL Mohali", "India")]
fb = "".join(f'<div class="box fab" id="f{i}" style="left:{40+i*250}px;top:150px;width:220px;height:120px"><b>{n}</b><span class="mono">{s}</span></div>' for i, (n, s) in enumerate(fabs))
LOOPS["second-source"] = doc("second-source", 800, 450, 8, """
.fab b{font-family:"DG Serif",serif;font-weight:400;font-size:32px}
.fab span{font-size:26px;letter-spacing:2px;color:#a7b09f;white-space:nowrap}
#cap{position:absolute;left:40px;top:40px;font-size:32px;color:#a7b09f}
#die{position:absolute;left:0;top:0;width:44px;height:44px;border:3px solid #d4a36e;border-radius:4px;background:repeating-linear-gradient(0deg,#d4a36e33 0 6px,transparent 6px 10px)}
#rail{position:absolute;left:150px;top:330px;width:500px;height:2px;background:#3d453b}
#foot{position:absolute;left:40px;top:366px;font-size:32px;color:#a7b09f}
""", f"""
    <div id="cap" class="mono">130 nm · three foundries</div>
    {fb}
    <div id="rail"></div>
    <div id="die"></div>
    <div id="foot" class="mono">198-day shuttle</div>
""", """
  const X=[128,378,628];
  tl.set("#die",{x:X[0],y:308},0);
  tl.to("#f0",{borderColor:"#d4a36e",duration:.3},0.3);
  tl.to("#die",{x:X[1],duration:1.1,ease:"power2.inOut"},2.0);
  tl.to("#f1",{borderColor:"#d4a36e",duration:.3},3.0);
  tl.to("#die",{x:X[2],duration:1.1,ease:"power2.inOut"},4.2);
  tl.to("#f2",{borderColor:"#d4a36e",duration:.3},5.2);
  tl.to(["#f1","#f2"],{borderColor:"#3d453b",duration:.5},7.0);
  tl.to("#die",{opacity:0,duration:.3},7.0);
  tl.set("#die",{x:X[0]},7.35);
  tl.to("#die",{opacity:1,duration:.3},7.4);
""")

# ------------------------------------------------ D. portfolio: ten chips, five systems (1920x640, 9s)
chips = ["sku1", "sku2", "sku3", "sku4", "sku5", "sku6", "sku7", "sku8", "sku9", "d100"]
label = {c: ("D100" if c == "d100" else "SKU-" + c[3:]) for c in chips}
systems = [("motors", "Motors and drives", ["sku1", "sku4"]),
           ("vehicles", "Vehicles", ["sku9", "sku4", "sku7", "sku5"]),
           ("defence", "Defence and drones", ["d100", "sku3", "sku8", "sku7", "sku4"]),
           ("grid", "Grid and metering", ["sku2"]),
           ("boards", "Every board", ["sku6", "sku5", "sku8"])]
cpos = {c: (200, 34 + i * 58) for i, c in enumerate(chips)}
spos = {s: (1180, 70 + i * 104) for i, (s, _, _) in enumerate(systems)}
tiles = "".join(f'<div class="box chip{" dg" if c=="sku4" else ""}" id="c-{c}" style="left:{x}px;top:{y}px;width:220px;height:48px"><b>{label[c]}</b>{"<span class=mono>DG32</span>" if c=="sku4" else ""}</div>' for c, (x, y) in cpos.items())
sysb = "".join(f'<div class="box sys" id="s-{s}" style="left:{x}px;top:{y}px;width:560px;height:84px"><b>{n}</b><span class="mono">{len(m)} chip{"s" if len(m)>1 else ""}</span></div>' for (s, n, m), (x, y) in zip(systems, spos.values()))
paths = ""
for s, _, m in systems:
    sx, sy = spos[s]
    for c in m:
        cx, cy = cpos[c]
        paths += f'<path class="ln ln-{s}" d="M{cx+220} {cy+24} C {cx+560} {cy+24}, {sx-340} {sy+42}, {sx} {sy+42}" fill="none" stroke="#d4a36e" stroke-width="3" stroke-dasharray="900" stroke-dashoffset="900"/>'
tlp = []
for i, (s, _, m) in enumerate(systems):
    t = 0.4 + i * 1.6
    ids = ",".join(f'"#c-{c}"' for c in m)
    tlp.append(f'tl.to(".ln-{s}",{{strokeDashoffset:0,duration:.7,ease:"power2.out"}},{t});')
    tlp.append(f'tl.to([{ids}],{{borderColor:"#d4a36e",duration:.3}},{t});')
    tlp.append(f'tl.to("#s-{s}",{{borderColor:"#d4a36e",duration:.3}},{t+.5});')
    tlp.append(f'tl.to(".ln-{s}",{{strokeDashoffset:900,duration:.5}},{t+1.2});')
    tlp.append(f'tl.to([{ids}],{{borderColor:"#3d453b",duration:.3}},{t+1.3});')
    tlp.append(f'tl.to("#s-{s}",{{borderColor:"#3d453b",duration:.3}},{t+1.3});')
LOOPS["portfolio"] = doc("portfolio", 1920, 640, 9, """
.chip{flex-direction:row;gap:14px}
.chip b{font-size:24px;font-weight:700}
.chip span{font-size:18px;color:#d4a36e}
.chip.dg{background:#1f231f}
.sys{flex-direction:row;justify-content:space-between;padding:0 28px;box-sizing:border-box}
.sys b{font-family:"DG Serif",serif;font-weight:400;font-size:34px}
.sys span{font-size:20px;color:#a7b09f}
#lines{position:absolute;inset:0;width:1920px;height:640px}
#cap{position:absolute;left:40px;top:300px;width:140px;font-size:22px;line-height:1.5;color:#a7b09f}
""", f"""
    <svg id="lines" viewBox="0 0 1920 640">{paths}</svg>
    <div id="cap" class="mono">Ten chips</div>
    {tiles}
    {sysb}
""", "\n".join("  " + x for x in tlp) + "\n  tl.to({}, {duration:.01}, 8.95);")

# ------------------------------------------------ E. evidence: five kinds, silicon lane empty (1920x640, 9s)
kinds = [("Simulated", ["39 cycles", "~100 kHz"]), ("Post-route", ["55–62 MHz"]), ("Analytic", ["82 %"]),
         ("Tool estimate", ["~0.43 W"]), ("Process nominal", ["130 nm"])]
lanes = ""
chipsE = ""
tle = []
t = 0.5
for i, (k, figs) in enumerate(kinds):
    x = 60 + i * 300
    lanes += f'<div class="lane" id="l{i}" style="left:{x}px"><span class="mono">{k}</span></div>'
    for j, f in enumerate(figs):
        cid = f"e{i}{j}"
        chipsE += f'<div class="fig" id="{cid}" style="left:{x+20}px;top:{250+j*110}px">{f}</div>'
        tle.append(f'tl.fromTo("#{cid}",{{opacity:0,y:-60}},{{opacity:1,y:0,duration:.5,ease:"power2.out",immediateRender:false}},{t:.2f});')
        tle.append(f'tl.to("#l{i}",{{borderColor:"#d4a36e",duration:.3}},{t:.2f});')
        t += 0.9
lanes += '<div class="lane sil" id="lsil" style="left:1560px"><span class="mono">Silicon</span><em class="mono">first silicon · Sep 2026 shuttle</em></div>'
tle.append('tl.to(".fig",{opacity:0,duration:.4},8.3);')
tle.append('tl.to(".lane:not(.sil)",{borderColor:"#3d453b",duration:.4},8.3);')
LOOPS["evidence"] = doc("evidence", 1920, 640, 9, """
.lane{position:absolute;top:120px;width:280px;height:460px;border:2px solid #3d453b;border-radius:10px;background:#191d1b;box-sizing:border-box;padding:20px}
.lane span{font-size:22px;color:#a7b09f}
.lane.sil{border-style:dashed;background:transparent}
.lane.sil em{position:absolute;left:20px;right:20px;bottom:24px;font-style:normal;font-size:22px;line-height:1.5;color:#a7b09f}
.fig{opacity:0;position:absolute;width:240px;padding:18px 0;text-align:center;border:2px solid #d4a36e;border-radius:8px;background:#101212;font-family:"DG Serif",serif;font-size:42px;color:#eeeae2}
#cap{position:absolute;left:60px;top:56px;font-size:24px;color:#a7b09f}
""", f"""
    <div id="cap" class="mono">Five kinds of evidence · none is silicon yet</div>
    {lanes}
    {chipsE}
""", "\n".join("  " + x for x in tle))


# ------------------------------------------------ F. procurement: gaps close in order (1920x640, 10s)
gaps = [("adc", "12-bit ADC", 1), ("flash", "Embedded flash", 1), ("can", "CAN-FD", 2), ("dbg", "Interactive debug", 2),
        ("usb", "USB", 0), ("pkg", "Package range", 0), ("mat", "Production maturity", 0)]
gy = {g[0]: 110 + i * 70 for i, g in enumerate(gaps)}
chipsF = "".join(f'<div class="gap" id="g-{k}" style="left:80px;top:{gy[k]}px">{t}</div>' for k, t, _ in gaps)
spins = [("First silicon", "Sep 2026 shuttle"), ("Second spin", "two largest gaps"), ("Then", "connectivity and debug")]
spinsF = "".join(f'<div class="box spin" id="sp{i}" style="left:{720+i*400}px;top:110px;width:360px;height:470px;justify-content:flex-start;padding-top:26px;box-sizing:border-box"><b>{n}</b><span class="mono">{d}</span></div>' for i, (n, d) in enumerate(spins))
tlF = ['tl.to("#sp0",{borderColor:"#d4a36e",duration:.4},0.4);']
slot = {1: 0, 2: 0}
t0 = {1: 2.0, 2: 4.6}
for k, t, sp in gaps:
    if not sp: continue
    tx = 720 + sp * 400 + 20 - 80
    ty = 250 + slot[sp] * 80 - gy[k]
    tt = t0[sp] + slot[sp] * 0.5
    slot[sp] += 1
    tlF.append(f'tl.to("#g-{k}",{{x:{tx},y:{ty},borderColor:"#d4a36e",duration:.9,ease:"power2.inOut"}},{tt});')
tlF.append('tl.to("#sp1",{borderColor:"#d4a36e",duration:.4},2.0);')
tlF.append('tl.to("#sp2",{borderColor:"#d4a36e",duration:.4},4.6);')
tlF.append('tl.to(".gap",{x:0,y:0,borderColor:"#3d453b",duration:.8,ease:"power2.inOut"},8.6);')
tlF.append('tl.to(".spin",{borderColor:"#3d453b",duration:.5},8.6);')
LOOPS["roadmap-gaps"] = doc("roadmap-gaps", 1920, 640, 10, """
.gap{position:absolute;width:320px;padding:12px 18px;box-sizing:border-box;border:2px solid #3d453b;border-radius:8px;background:#191d1b;font-family:"DG Sans",sans-serif;font-weight:700;font-size:26px;color:#eeeae2}
.spin b{font-family:"DG Serif",serif;font-weight:400;font-size:36px}
.spin span{font-size:20px;color:#a7b09f}
#capL{position:absolute;left:80px;top:50px;font-size:24px;color:#a7b09f}
#capR{position:absolute;left:720px;top:50px;font-size:24px;color:#a7b09f}
""", f"""
    <div id="capL" class="mono">Where the incumbent leads today</div>
    <div id="capR" class="mono">The spin that closes it</div>
    {spinsF}
    <div class="gap" style="left:740px;top:250px;border-color:#d4a36e">DG32-LITE</div>
    {chipsF}
""", "\n".join("  " + x for x in tlF))

# ------------------------------------------------ G. company: the 198-day shuttle loop (1920x640, 8s)
import math
stages = ["RTL", "GDSII", "Shuttle", "Bring-up"]
cx, cy, r, ry = 760, 320, 400, 230
st = ""
for i, n in enumerate(stages):
    a = -math.pi / 2 + i * math.pi / 2
    x, y = cx + r * math.cos(a), cy + ry * math.sin(a)
    st += f'<div class="box stg" id="st{i}" style="left:{x-110:.0f}px;top:{y-40:.0f}px;width:220px;height:80px"><b>{n}</b></div>'
LOOPS["shuttle-loop"] = doc("shuttle-loop", 1920, 640, 8, f"""
#ring{{position:absolute;inset:0;width:1920px;height:640px}}
.stg b{{font-family:"DG Serif",serif;font-weight:400;font-size:34px}}
#mid{{position:absolute;left:{cx-170}px;top:{cy-50}px;width:340px;text-align:center}}
#mid b{{display:block;font-family:"DG Serif",serif;font-weight:400;font-size:64px;color:#d4a36e;line-height:1}}
#mid span{{display:block;margin-top:10px;font-size:24px;color:#a7b09f}}
#dot{{position:absolute;left:0;top:0;width:28px;height:28px;border-radius:50%;background:#d4a36e}}
#side{{position:absolute;left:1340px;top:290px;width:480px;font-size:24px;line-height:1.7;color:#a7b09f}}
""", f"""
    <svg id="ring" viewBox="0 0 1920 640"><ellipse cx="{cx}" cy="{cy}" rx="{r}" ry="{ry}" fill="none" stroke="#3d453b" stroke-width="3"/></svg>
    {st}
    <div id="mid"><b>198 days</b><span class="mono">shuttle to shuttle</span></div>
    <div id="dot"></div>
    <div id="side" class="mono">Each spin closes a named gap</div>
""", f"""
  const cx={cx},cy={cy},r={r},ry={ry},p={{a:-Math.PI/2}};
  const dot=document.getElementById("dot");
  const place=()=>{{dot.style.transform="translate("+(cx+r*Math.cos(p.a)-14)+"px,"+(cy+ry*Math.sin(p.a)-14)+"px)";}};
  place();
  tl.fromTo(p,{{a:-Math.PI/2}},{{a:1.5*Math.PI,duration:7.6,ease:"none",onUpdate:place}},0.2);
  [0,1,2,3].forEach(i=>{{
    tl.to("#st"+i,{{borderColor:"#d4a36e",duration:.3}},0.2+i*1.9);
    tl.to("#st"+i,{{borderColor:"#3d453b",duration:.3}},0.2+i*1.9+1.6);
  }});
""")

for name, html in LOOPS.items():
    open(f"src/{name}.html", "w").write(html)
    print("wrote", name)
