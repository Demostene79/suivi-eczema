import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
 
// ── Données ──────────────────────────────────────────────────────────
 
const ZONES = [
  { id:"paupieres",    label:"Paupières",            icon:"👁️" },
  { id:"doigts",       label:"Doigts (main droite)", icon:"✋" },
  { id:"coude",        label:"Intérieur coude",      icon:"💪" },
  { id:"cuir_chevelu", label:"Cuir chevelu",         icon:"🧑" },
  { id:"autre",        label:"Autre zone",           icon:"📍" },
];
 
const INTENSITY = [
  { value:1, label:"Léger",        color:"#a8d8a8" },
  { value:2, label:"Modéré",       color:"#f5c842" },
  { value:3, label:"Intense",      color:"#f4845f" },
  { value:4, label:"Très intense", color:"#c0392b" },
];
 
const TRIGGERS = [
  { id:"chat_direct",    label:"Contact chats direct",     icon:"🐱" },
  { id:"chat_presence",  label:"Présence chats",           icon:"🏠" },
  { id:"stress",         label:"Stress / angoisse",        icon:"😰" },
  { id:"pollen",         label:"Pollen / sortie",          icon:"🌿" },
  { id:"poussiere",      label:"Poussière",                icon:"🌫️" },
  { id:"savon",          label:"Savon / gel douche",       icon:"🧼" },
  { id:"shampoing",      label:"Shampoing",                icon:"🧴" },
  { id:"aliment",        label:"Aliment suspect",          icon:"🍽️" },
  { id:"vetement",       label:"Vêtement / tissu",         icon:"👕" },
  { id:"chaleur",        label:"Chaleur",                  icon:"☀️" },
];
 
const SOLEIL_OPTS = [
  { value:"non",            label:"Pas de soleil",         icon:"🌥️" },
  { value:"sans",           label:"Sans protection",       icon:"☀️"  },
  { value:"lunettes",       label:"+ Lunettes",            icon:"🕶️" },
  { value:"creme",          label:"+ Crème solaire",       icon:"🧴"  },
  { value:"lunettes_creme", label:"Lunettes + crème",      icon:"✅"  },
];
 
const SLEEP_Q = [
  { value:1, label:"Très mauvaise" },
  { value:2, label:"Mauvaise"      },
  { value:3, label:"Correcte"      },
  { value:4, label:"Bonne"         },
];
 
const ACTIVITIES = [
  { id:"tennis",     label:"Tennis",     icon:"🎾" },
  { id:"piscine",    label:"Piscine",    icon:"🏊" },
  { id:"meditation", label:"Méditation", icon:"🧘" },
  { id:"yoga",       label:"Yoga",       icon:"🌿" },
  { id:"autre",      label:"Autre",      icon:"🏃" },
];
 
const DOUCHES = [
  { id:"froide",  label:"Maison eau froide", icon:"🚿" },
  { id:"chaude",  label:"Maison eau chaude", icon:"🌡️" },
  { id:"piscine", label:"À la piscine",      icon:"🏊" },
];
 
const HYDRA = [
  { value:"low",  label:"Insuffisant", sub:"< 1L",   color:"#f4845f" },
  { value:"ok",   label:"Correct",     sub:"1–1,5L", color:"#f5c842" },
  { value:"good", label:"Bon",         sub:"> 1,5L", color:"#a8d8a8" },
];
 
const FOOD_BAD = [
  { id:"alcool",   label:"Alcool",                     icon:"🍷" },
  { id:"viande",   label:"Viande rouge / charcuterie", icon:"🥩" },
  { id:"epices",   label:"Épices / plats gras",        icon:"🌶️" },
  { id:"chocolat", label:"Chocolat / sucres",          icon:"🍫" },
  { id:"cafe",     label:"Café en excès",              icon:"☕" },
];
 
const FOOD_GOOD = [
  { id:"legumes",  label:"Légumes / fibres",       icon:"🥦" },
  { id:"poisson",  label:"Poisson frais",          icon:"🐟" },
  { id:"olive",    label:"Huile d'olive / avocat", icon:"🫒" },
  { id:"fruits",   label:"Fruits rouges / kiwi",  icon:"🫐" },
  { id:"yaourt",   label:"Yaourt / probiotiques",  icon:"🥛" },
];
 
const TREATMENTS = [
  { id:"tridesonit",    label:"Tridésonit",          type:"cortico" },
  { id:"diprosone",     label:"Diprosone",           type:"cortico" },
  { id:"elidel",        label:"Elidel 10mg/g",       type:"immuno"  },
  { id:"cicalfate",     label:"Cicalfate+ crème",    type:"repara"  },
  { id:"cicalfate_gel", label:"Cicalfate+ gel",      type:"repara"  },
  { id:"cicaplast",     label:"Cicaplast",           type:"repara"  },
  { id:"zyrtec",        label:"Zyrtec",              type:"antih"   },
  { id:"aerius",        label:"Aérius",              type:"antih"   },
];
 
const TC = {
  cortico:{ bg:"rgba(244,132,95,0.15)",  border:"rgba(244,132,95,0.4)",  text:"#f4845f" },
  immuno: { bg:"rgba(165,120,220,0.15)", border:"rgba(165,120,220,0.4)", text:"#a578dc" },
  repara: { bg:"rgba(106,159,216,0.15)", border:"rgba(106,159,216,0.4)", text:"#6a9fd8" },
  antih:  { bg:"rgba(168,216,168,0.15)", border:"rgba(168,216,168,0.4)", text:"#a8d8a8" },
};
 
const WORK = [
  { value:"bureau",      label:"🏢 Bureau"        },
  { value:"teletravail", label:"🏠 Télétravail"   },
  { value:"voyage",      label:"✈️ Voyage"        },
  { value:"off",         label:"🌴 WE / Vacances" },
];
 
const STRESS_COLORS = ["#a8d8a8","#c8d870","#f5c842","#f4845f","#c0392b"];
const HUMEUR_COLORS = ["#c0392b","#f4845f","#f5c842","#c8d870","#a8d8a8"];
 
const KEY = "hadrien_sante_log";
function today() { return new Date().toISOString().split("T")[0]; }
function fmtDate(d) { return new Date(d+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"}); }
function load() { try { const r=localStorage.getItem(KEY); return r?JSON.parse(r):[]; } catch{return[];} }
function save(e) { try{localStorage.setItem(KEY,JSON.stringify(e));}catch{} }
 
const BLANK = {
  date:today(),
  zones:[], intensity:null, triggers:[],
  soleil:null,
  sleepHours:"", sleepQuality:null, wakeUp4h:false, angoisseNuit:false,
  stress:null, humeur:null, workLocation:null,
  activities:[],
  douches:[],
  hydration:null,
  foodBad:[], foodGood:[], snackNocturne:false, foodNote:"",
  treatments:[], treatmentNote:"",
  darkCircles:null,
  poids:"",
  note:"",
};
 
// ── App ──────────────────────────────────────────────────────────────
 
function App() {
  const [view,setView]       = useState("log");
  const [entries,setEntries] = useState(load);
  const [form,setForm]       = useState(BLANK);
  const [saved,setSaved]     = useState(false);
 
  useEffect(()=>{ save(entries); },[entries]);
 
  const todayEntry = entries.find(e=>e.date===form.date);
  const sv = (k,v) => setForm(f=>({...f,[k]:v}));
  const tg = (k,v) => setForm(f=>({...f,[k]:f[k].includes(v)?f[k].filter(x=>x!==v):[...f[k],v]}));
 
  function submit() {
    if (!form.intensity||!form.zones.length) return;
    const entry={...form,id:Date.now()};
    setEntries(prev=>[entry,...prev.filter(e=>e.date!==form.date)].sort((a,b)=>b.date.localeCompare(a.date)));
    setSaved(true); setTimeout(()=>setSaved(false),2500);
    window.scrollTo({top:0,behavior:"smooth"});
  }
 
  function exportCSV() {
    if (!entries.length) return;
    const H=["Date","Zones","Intensité","Déclencheurs","Soleil","Sommeil(h)","Qualité sommeil",
      "Réveil 4h","Angoisse nuit","Stress","Humeur","Lieu travail","Activités","Douches",
      "Hydratation","Peut aggraver","Plutôt bien","Snack nocturne","Note aliment",
      "Traitements","Cernes","Poids(kg)","Note libre"];
    const R=entries.map(e=>[
      e.date,
      (e.zones||[]).map(z=>ZONES.find(x=>x.id===z)?.label||z).join("|"),
      INTENSITY.find(x=>x.value===e.intensity)?.label||"",
      (e.triggers||[]).map(x=>TRIGGERS.find(y=>y.id===x)?.label||x).join("|"),
      SOLEIL_OPTS.find(x=>x.value===e.soleil)?.label||"",
      e.sleepHours||"",
      SLEEP_Q.find(x=>x.value===e.sleepQuality)?.label||"",
      e.wakeUp4h?"Oui":"Non",
      e.angoisseNuit?"Oui":"Non",
      e.stress||"",
      e.humeur||"",
      WORK.find(x=>x.value===e.workLocation)?.label||"",
      (e.activities||[]).map(x=>ACTIVITIES.find(y=>y.id===x)?.label||x).join("|"),
      (e.douches||[]).map(x=>DOUCHES.find(y=>y.id===x)?.label||x).join("|"),
      HYDRA.find(x=>x.value===e.hydration)?.label||"",
      (e.foodBad||[]).map(x=>FOOD_BAD.find(y=>y.id===x)?.label||x).join("|"),
      (e.foodGood||[]).map(x=>FOOD_GOOD.find(y=>y.id===x)?.label||x).join("|"),
      e.snackNocturne?"Oui":"Non",
      e.foodNote||"",
      [...(e.treatments||[]).map(x=>TREATMENTS.find(y=>y.id===x)?.label||x),e.treatmentNote||""].filter(Boolean).join("|"),
      e.darkCircles??"",
      e.poids||"",
      e.note||"",
    ]);
    const csv=[H,...R].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const url=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"}));
    Object.assign(document.createElement("a"),{href:url,download:`suivi-sante-${today()}.csv`}).click();
    URL.revokeObjectURL(url);
  }
 
  function getInsights() {
    if (entries.length<3) return null;
    const cnt={},sum={};
    entries.forEach(e=>(e.triggers||[]).forEach(x=>{cnt[x]=(cnt[x]||0)+1;sum[x]=(sum[x]||0)+(e.intensity||0);}));
    return Object.entries(cnt).map(([id,c])=>({id,c,avg:(sum[id]/c).toFixed(1)})).sort((a,b)=>b.c-a.c);
  }
  const ins=getInsights();
 
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0d1821 0%,#1a2635 60%,#0d1821 100%)",fontFamily:"Georgia,serif",color:"#e8dcc8",paddingBottom:80}}>
 
      {/* HEADER */}
      <div style={{padding:"24px 20px 0",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:14}}>
          <span style={{fontSize:22,fontWeight:700,color:"#f0e6d3",letterSpacing:"-0.5px"}}>Suivi Santé</span>
          <span style={{fontSize:12,color:"#6a7d96",fontStyle:"italic"}}>Hadrien · Barcelone</span>
        </div>
        <nav style={{display:"flex",gap:0}}>
          {[["log","Saisie"],["history","Historique"],["insights","Tendances"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"10px 4px",background:"none",border:"none",
              borderBottom:view===v?"2px solid #c8956c":"2px solid transparent",
              color:view===v?"#c8956c":"#6a7d96",fontSize:13,fontFamily:"inherit",cursor:"pointer",fontWeight:view===v?600:400}}>{l}</button>
          ))}
          <button onClick={exportCSV} disabled={!entries.length} style={{flex:1,padding:"10px 4px",background:"none",border:"none",
            borderBottom:"2px solid transparent",color:entries.length?"#6a9fd8":"#3a4a5a",
            fontSize:13,fontFamily:"inherit",cursor:entries.length?"pointer":"not-allowed"}}>↓ Export</button>
        </nav>
      </div>
 
      <div style={{padding:"20px 20px 0"}}>
        <div style={{maxWidth:500,margin:"0 auto"}}>
 
          {/* ══ SAISIE ══ */}
          {view==="log" && <>
 
            {todayEntry&&<div style={{background:"rgba(200,149,108,0.12)",border:"1px solid rgba(200,149,108,0.3)",borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:13,color:"#c8956c"}}>
              ✓ Entrée du jour déjà saisie — tu peux la remplacer.
            </div>}
 
            <Sec label="Date">
              <input type="date" value={form.date} onChange={e=>sv("date",e.target.value)} style={inp} />
            </Sec>
 
            <STitle icon="🩺" label="Eczéma" color="#c8956c" />
 
            <Sec label="Zone(s) touchée(s) *">
              <Pills items={ZONES} active={form.zones} onToggle={v=>tg("zones",v)} />
            </Sec>
 
            <Sec label="Intensité *">
              <div style={{display:"flex",gap:8}}>
                {INTENSITY.map(i=>(
                  <button key={i.value} onClick={()=>sv("intensity",i.value)} style={{flex:1,padding:"10px 4px",borderRadius:8,
                    border:form.intensity===i.value?`2px solid ${i.color}`:"2px solid rgba(255,255,255,0.1)",
                    background:form.intensity===i.value?`${i.color}22`:"rgba(255,255,255,0.04)",
                    color:form.intensity===i.value?i.color:"#8a9ab5",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>
                    <div style={{fontSize:16,marginBottom:2}}>{"●".repeat(i.value)}</div>{i.label}
                  </button>
                ))}
              </div>
            </Sec>
 
            <Sec label="Déclencheurs suspectés">
              <Pills items={TRIGGERS} active={form.triggers} onToggle={v=>tg("triggers",v)} />
            </Sec>
 
            <Divider />
            <STitle icon="☀️" label="Soleil" color="#f5c842" />
 
            <Sec label="Exposition & protection aujourd'hui">
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {SOLEIL_OPTS.map(x=>(
                  <button key={x.value} onClick={()=>sv("soleil",form.soleil===x.value?null:x.value)} style={{padding:"7px 13px",borderRadius:20,
                    border:form.soleil===x.value?"1.5px solid #f5c842":"1.5px solid rgba(255,255,255,0.1)",
                    background:form.soleil===x.value?"rgba(245,200,66,0.15)":"rgba(255,255,255,0.04)",
                    color:form.soleil===x.value?"#f5c842":"#8a9ab5",fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer",whiteSpace:"nowrap"}}>
                    {x.icon} {x.label}
                  </button>
                ))}
              </div>
            </Sec>
 
            <Divider />
            <STitle icon="😴" label="Sommeil" color="#6a9fd8" />
 
            <Sec label="Durée">
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <input type="number" min="2" max="12" step="0.5" placeholder="ex: 6.5" value={form.sleepHours}
                  onChange={e=>sv("sleepHours",e.target.value)} style={{...inp,width:90,textAlign:"center",fontSize:18,fontWeight:600}} />
                <span style={{fontSize:13,color:"#8a9ab5"}}>heures</span>
              </div>
            </Sec>
 
            <Sec label="Qualité">
              <div style={{display:"flex",gap:6}}>
                {SLEEP_Q.map(q=>(
                  <button key={q.value} onClick={()=>sv("sleepQuality",q.value)} style={{flex:1,padding:"8px 2px",borderRadius:8,
                    border:form.sleepQuality===q.value?"2px solid #6a9fd8":"2px solid rgba(255,255,255,0.08)",
                    background:form.sleepQuality===q.value?"rgba(106,159,216,0.15)":"rgba(255,255,255,0.04)",
                    color:form.sleepQuality===q.value?"#6a9fd8":"#6a7d96",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>{q.label}</button>
                ))}
              </div>
            </Sec>
 
            <Sec label="Nuit">
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Check checked={form.wakeUp4h}     onChange={v=>sv("wakeUp4h",v)}     label="Réveil nocturne (~4h)" color="#6a9fd8" />
                <Check checked={form.angoisseNuit} onChange={v=>sv("angoisseNuit",v)} label="Angoisse nocturne"      color="#a578dc" />
              </div>
            </Sec>
 
            <Divider />
            <STitle icon="🧠" label="Mental" color="#a578dc" />
 
            <Sec label="Stress du jour">
              <ScoreRow value={form.stress} onChange={v=>sv("stress",v)} colors={STRESS_COLORS} leftLabel="Calme" rightLabel="Très stressé" />
            </Sec>
 
            <Sec label="Humeur générale">
              <ScoreRow value={form.humeur} onChange={v=>sv("humeur",v)} colors={HUMEUR_COLORS} leftLabel="😔 Bas" rightLabel="😊 Excellent" />
            </Sec>
 
            <Sec label="Journée">
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {WORK.map(w=>(
                  <button key={w.value} onClick={()=>sv("workLocation",form.workLocation===w.value?null:w.value)} style={{padding:"7px 13px",borderRadius:20,
                    border:form.workLocation===w.value?"1.5px solid #a578dc":"1.5px solid rgba(255,255,255,0.1)",
                    background:form.workLocation===w.value?"rgba(165,120,220,0.15)":"rgba(255,255,255,0.04)",
                    color:form.workLocation===w.value?"#a578dc":"#8a9ab5",fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer",whiteSpace:"nowrap"}}>
                    {w.label}
                  </button>
                ))}
              </div>
            </Sec>
 
            <Divider />
            <STitle icon="🏃" label="Activité physique" color="#a8d8a8" />
 
            <Sec label="Aujourd'hui">
              <Pills items={ACTIVITIES} active={form.activities} onToggle={v=>tg("activities",v)} color="#a8d8a8" />
            </Sec>
 
            <Divider />
            <STitle icon="🚿" label="Douches" color="#7ec8c8" />
 
            <Sec label="Douche(s) prise(s) aujourd'hui">
              <Pills items={DOUCHES} active={form.douches} onToggle={v=>tg("douches",v)} color="#7ec8c8" />
            </Sec>
 
            <Divider />
            <STitle icon="💧" label="Hydratation" color="#6ab4f5" />
 
            <Sec label="Niveau du jour">
              <div style={{display:"flex",gap:8}}>
                {HYDRA.map(h=>(
                  <button key={h.value} onClick={()=>sv("hydration",h.value)} style={{flex:1,padding:"12px 4px",borderRadius:10,
                    border:form.hydration===h.value?`2px solid ${h.color}`:"2px solid rgba(255,255,255,0.08)",
                    background:form.hydration===h.value?`${h.color}22`:"rgba(255,255,255,0.04)",
                    color:form.hydration===h.value?h.color:"#6a7d96",fontSize:12,fontFamily:"inherit",cursor:"pointer",textAlign:"center"}}>
                    <div style={{fontWeight:600,marginBottom:3}}>{h.label}</div>
                    <div style={{fontSize:10,opacity:0.7}}>{h.sub}</div>
                  </button>
                ))}
              </div>
            </Sec>
 
            <Divider />
            <STitle icon="🍽️" label="Nutrition" color="#d4a574" />
 
            <Sec label="🔴 Peut aggraver">
              <Pills items={FOOD_BAD} active={form.foodBad} onToggle={v=>tg("foodBad",v)} color="#f4845f" />
            </Sec>
 
            <Sec label="🟢 Plutôt protecteur">
              <Pills items={FOOD_GOOD} active={form.foodGood} onToggle={v=>tg("foodGood",v)} color="#a8d8a8" />
            </Sec>
 
            <Sec label="🌙 Snack après dîner">
              <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"10px 14px",
                borderRadius:10,border:form.snackNocturne?"1.5px solid #d4a574":"1.5px solid rgba(255,255,255,0.1)",
                background:form.snackNocturne?"rgba(212,165,116,0.12)":"rgba(255,255,255,0.04)"}}>
                <input type="checkbox" checked={form.snackNocturne} onChange={e=>sv("snackNocturne",e.target.checked)} style={{width:18,height:18,accentColor:"#d4a574"}} />
                <span style={{fontSize:13,color:form.snackNocturne?"#d4a574":"#8a9ab5"}}>J'ai grignoté après le dîner</span>
              </label>
            </Sec>
 
            <Sec label="Note alimentaire (optionnel)">
              <input type="text" placeholder="Aliment inhabituel, restaurant..." value={form.foodNote}
                onChange={e=>sv("foodNote",e.target.value)} style={{...inp,fontSize:13}} />
            </Sec>
 
            <Divider />
            <STitle icon="💊" label="Traitements" color="#f4845f" />
 
            <Sec label="Appliqués aujourd'hui">
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
                {TREATMENTS.map(tr=>{
                  const c=TC[tr.type],on=form.treatments.includes(tr.id);
                  return <button key={tr.id} onClick={()=>tg("treatments",tr.id)} style={{padding:"7px 13px",borderRadius:20,
                    border:on?`1.5px solid ${c.border}`:"1.5px solid rgba(255,255,255,0.1)",
                    background:on?c.bg:"rgba(255,255,255,0.04)",color:on?c.text:"#8a9ab5",
                    fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer"}}>{tr.label}</button>;
                })}
              </div>
              <input type="text" placeholder="Autre produit..." value={form.treatmentNote}
                onChange={e=>sv("treatmentNote",e.target.value)} style={{...inp,fontSize:13,marginBottom:8}} />
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {[["cortico","Dermocorticoïde"],["immuno","Immunomodulateur"],["repara","Réparateur"],["antih","Antihistaminique"]].map(([k,l])=>(
                  <span key={k} style={{fontSize:10,color:TC[k].text,display:"flex",alignItems:"center",gap:4}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:TC[k].text,display:"inline-block"}}/>{l}
                  </span>
                ))}
              </div>
            </Sec>
 
            <Divider />
            <STitle icon="👁️" label="Cernes" color="#8a7ab5" />
 
            <Sec label="0 = aucun · 5 = très marqués">
              <div style={{display:"flex",gap:8}}>
                {[0,1,2,3,4,5].map(v=>(
                  <button key={v} onClick={()=>sv("darkCircles",v)} style={{flex:1,borderRadius:8,padding:"11px 0",
                    border:form.darkCircles===v?"2px solid #8a7ab5":"2px solid rgba(255,255,255,0.08)",
                    background:form.darkCircles===v?`rgba(138,122,181,${0.1+v*0.12})`:"rgba(255,255,255,0.04)",
                    color:form.darkCircles===v?"#b8a8e8":"#6a7d96",
                    fontSize:form.darkCircles===v?17:14,fontWeight:form.darkCircles===v?700:400,
                    fontFamily:"inherit",cursor:"pointer"}}>{v}</button>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:10,color:"#4a5a6a"}}>Aucun</span>
                <span style={{fontSize:10,color:"#4a5a6a"}}>Très marqués</span>
              </div>
            </Sec>
 
            <Divider />
            <STitle icon="⚖️" label="Poids (optionnel)" color="#8a9ab5" />
 
            <Sec label="Poids du jour">
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <input type="number" min="40" max="200" step="0.1" placeholder="ex: 74.5" value={form.poids}
                  onChange={e=>sv("poids",e.target.value)} style={{...inp,width:110,textAlign:"center",fontSize:18,fontWeight:600}} />
                <span style={{fontSize:13,color:"#8a9ab5"}}>kg</span>
              </div>
            </Sec>
 
            <Divider />
            <STitle icon="📝" label="Note libre" color="#6a7d96" />
 
            <Sec label="Remarques du jour">
              <textarea placeholder="Situation particulière, changement de routine, observation..." value={form.note}
                onChange={e=>sv("note",e.target.value)} style={{...inp,height:90,resize:"vertical",lineHeight:1.6,fontSize:13}} />
            </Sec>
 
            <button onClick={submit} disabled={!form.intensity||!form.zones.length} style={{width:"100%",padding:"15px",borderRadius:10,border:"none",
              background:(!form.intensity||!form.zones.length)?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#c8956c,#d4a574)",
              color:(!form.intensity||!form.zones.length)?"#4a5a6a":"#0d1821",fontSize:15,fontFamily:"inherit",
              fontWeight:700,cursor:(!form.intensity||!form.zones.length)?"not-allowed":"pointer",letterSpacing:"0.3px",marginBottom:8}}>
              {saved?"✓ Enregistré !":"Enregistrer"}
            </button>
            <p style={{textAlign:"center",fontSize:11,color:"#3a4a5a",marginBottom:20,fontStyle:"italic"}}>
              ⚕️ Ce suivi est informatif — consulte toujours un médecin pour tout diagnostic.
            </p>
          </>}
 
          {/* ══ HISTORIQUE ══ */}
          {view==="history" && <>
            {!entries.length?<Empty text="Aucune entrée encore. Commence par la saisie !"/>:entries.map(e=>(
              <div key={e.id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 16px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:13,color:"#c8956c",fontWeight:600}}>{fmtDate(e.date)}</span>
                  <IBadge value={e.intensity}/>
                </div>
                <TagRow items={e.zones}    list={ZONES}    />
                <TagRow items={e.triggers} list={TRIGGERS} muted />
                <div style={{display:"flex",flexWrap:"wrap",gap:10,fontSize:12,color:"#6a7d96",margin:"4px 0"}}>
                  {e.soleil&&<span>{SOLEIL_OPTS.find(x=>x.value===e.soleil)?.icon} {SOLEIL_OPTS.find(x=>x.value===e.soleil)?.label}</span>}
                  {e.sleepHours&&<span>🌙 {e.sleepHours}h</span>}
                  {e.sleepQuality&&<span>{SLEEP_Q.find(x=>x.value===e.sleepQuality)?.label}</span>}
                  {e.wakeUp4h&&<span>⏰ Réveil 4h</span>}
                  {e.angoisseNuit&&<span>😰 Angoisse nuit</span>}
                  {e.stress!=null&&<span>🧠 Stress: {e.stress}/5</span>}
                  {e.humeur!=null&&<span>😊 Humeur: {e.humeur}/5</span>}
                  {e.workLocation&&<span>{WORK.find(x=>x.value===e.workLocation)?.label}</span>}
                  {e.hydration&&<span>💧 {HYDRA.find(x=>x.value===e.hydration)?.label}</span>}
                  {e.snackNocturne&&<span>🌙 Snack dîner</span>}
                  {e.darkCircles!=null&&<span>👁️ Cernes: {e.darkCircles}/5</span>}
                  {e.poids&&<span>⚖️ {e.poids}kg</span>}
                </div>
                <ColorRow items={e.activities} list={ACTIVITIES} color="#a8d8a8" />
                <ColorRow items={e.douches}    list={DOUCHES}    color="#7ec8c8" />
                <ColorRow items={e.foodBad}    list={FOOD_BAD}   color="#f4845f" />
                <ColorRow items={e.foodGood}   list={FOOD_GOOD}  color="#a8d8a8" />
                {(e.treatments?.length||e.treatmentNote)&&(
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>
                    {(e.treatments||[]).map(id=>{const tr=TREATMENTS.find(x=>x.id===id),c=tr&&TC[tr.type];
                      return tr?<span key={id} style={{padding:"2px 7px",borderRadius:6,fontSize:11,background:c.bg,color:c.text}}>💊 {tr.label}</span>:null;})}
                    {e.treatmentNote&&<Tag muted>+ {e.treatmentNote}</Tag>}
                  </div>
                )}
                {e.note&&<p style={{fontSize:12,color:"#8a9ab5",marginTop:6,fontStyle:"italic"}}>{e.note}</p>}
              </div>
            ))}
          </>}
 
          {/* ══ TENDANCES ══ */}
          {view==="insights" && <>
            {!ins?<Empty text="Il faut au moins 3 entrées pour voir des tendances."/>:<>
              <div style={{marginBottom:20,padding:"14px 16px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12}}>
                <div style={{fontSize:12,color:"#8a9ab5",marginBottom:4}}>Entrées enregistrées</div>
                <div style={{fontSize:28,fontWeight:700,color:"#c8956c"}}>{entries.length}</div>
              </div>
 
              <Label>Déclencheurs les plus fréquents</Label>
              {ins.map((item,i)=>{
                const tr=TRIGGERS.find(x=>x.id===item.id);
                return <div key={item.id} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13}}>{tr?.icon} {tr?.label}</span>
                    <span style={{fontSize:12,color:"#8a9ab5"}}>{item.c}× · moy. {item.avg}</span>
                  </div>
                  <div style={{height:6,background:"rgba(255,255,255,0.08)",borderRadius:3}}>
                    <div style={{height:"100%",width:`${(item.c/ins[0].c)*100}%`,
                      background:i===0?"#c8956c":i===1?"#d4a574":"#8a9ab5",borderRadius:3,transition:"width 0.5s"}}/>
                  </div>
                </div>;
              })}
 
              <Label style={{marginTop:24}}>Sommeil</Label>
              {(()=>{
                const ws=entries.filter(e=>e.sleepHours);
                if(ws.length<2) return <p style={{color:"#6a7d96",fontSize:13}}>Pas assez de données.</p>;
                const avg=(ws.reduce((a,e)=>a+parseFloat(e.sleepHours),0)/ws.length).toFixed(1);
                const wr=Math.round((entries.filter(e=>e.wakeUp4h).length/entries.length)*100);
                const an=Math.round((entries.filter(e=>e.angoisseNuit).length/entries.length)*100);
                return <div style={{display:"flex",gap:8}}>
                  <SBox label="Durée moy." value={`${avg}h`}/>
                  <SBox label="Réveil 4h" value={`${wr}%`}/>
                  <SBox label="Angoisse nuit" value={`${an}%`}/>
                </div>;
              })()}
 
              {entries.some(e=>e.poids)&&<>
                <Label style={{marginTop:24}}>Poids</Label>
                {(()=>{
                  const wp=entries.filter(e=>e.poids).map(e=>parseFloat(e.poids));
                  const min=Math.min(...wp).toFixed(1), max=Math.max(...wp).toFixed(1);
                  const avg=(wp.reduce((a,b)=>a+b,0)/wp.length).toFixed(1);
                  return <div style={{display:"flex",gap:8}}>
                    <SBox label="Moy." value={`${avg}kg`}/>
                    <SBox label="Min" value={`${min}kg`}/>
                    <SBox label="Max" value={`${max}kg`}/>
                  </div>;
                })()}
              </>}
 
              <p style={{fontSize:11,color:"#4a5a6a",marginTop:20,fontStyle:"italic"}}>
                ⚕️ Ces tendances sont indicatives. Partage-les avec ton dermatologue.
              </p>
            </>}
          </>}
 
        </div>
      </div>
    </div>
  );
}
 
// ── Composants ────────────────────────────────────────────────────────
 
function STitle({icon,label,color}) {
  return <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingBottom:10,borderBottom:`1px solid ${color}33`}}>
    <span style={{fontSize:20}}>{icon}</span>
    <span style={{fontSize:16,fontWeight:700,color,letterSpacing:"-0.3px"}}>{label}</span>
  </div>;
}
 
function Sec({label,children}) {
  return <div style={{marginBottom:18}}>
    <div style={{fontSize:11,color:"#8a9ab5",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:9,fontWeight:600}}>{label}</div>
    {children}
  </div>;
}
 
function Divider() {
  return <div style={{height:1,background:"rgba(255,255,255,0.06)",margin:"20px 0"}}/>;
}
 
function Label({children,style={}}) {
  return <div style={{fontSize:12,color:"#8a9ab5",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12,fontWeight:400,...style}}>{children}</div>;
}
 
function Pills({items,active,onToggle,color="#c8956c"}) {
  return <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:4}}>
    {items.map(x=>{
      const on=active.includes(x.id);
      return <button key={x.id} onClick={()=>onToggle(x.id)} style={{padding:"7px 13px",borderRadius:20,
        border:on?`1.5px solid ${color}`:"1.5px solid rgba(255,255,255,0.1)",
        background:on?`${color}22`:"rgba(255,255,255,0.04)",
        color:on?color:"#8a9ab5",fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s"}}>
        {x.icon} {x.label}
      </button>;
    })}
  </div>;
}
 
function ScoreRow({value,onChange,colors,leftLabel,rightLabel}) {
  return <>
    <div style={{display:"flex",gap:8,marginBottom:4}}>
      {[1,2,3,4,5].map(v=>{
        const c=colors[v-1],on=value===v;
        return <button key={v} onClick={()=>onChange(v)} style={{flex:1,padding:"11px 4px",borderRadius:8,
          border:on?`2px solid ${c}`:"2px solid rgba(255,255,255,0.08)",
          background:on?`${c}22`:"rgba(255,255,255,0.04)",
          color:on?c:"#6a7d96",fontSize:15,fontWeight:on?700:400,fontFamily:"inherit",cursor:"pointer"}}>{v}</button>;
      })}
    </div>
    <div style={{display:"flex",justifyContent:"space-between"}}>
      <span style={{fontSize:10,color:"#4a5a6a"}}>{leftLabel}</span>
      <span style={{fontSize:10,color:"#4a5a6a"}}>{rightLabel}</span>
    </div>
  </>;
}
 
function Check({checked,onChange,label,color}) {
  return <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
    <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{width:16,height:16,accentColor:color}} />
    <span style={{fontSize:13,color:"#8a9ab5"}}>{label}</span>
  </label>;
}
 
function Tag({children,muted}) {
  return <span style={{padding:"3px 8px",borderRadius:6,fontSize:11,
    background:muted?"rgba(106,125,150,0.12)":"rgba(200,149,108,0.12)",
    color:muted?"#6a7d96":"#c8956c"}}>{children}</span>;
}
 
function TagRow({items,list,muted}) {
  if(!items?.length) return null;
  return <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
    {items.map(id=>{const x=list.find(l=>l.id===id);return x?<Tag key={id} muted={muted}>{x.icon} {x.label}</Tag>:null;})}
  </div>;
}
 
function ColorRow({items,list,color}) {
  if(!items?.length) return null;
  return <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:4}}>
    {items.map(id=>{const x=list.find(l=>l.id===id);
      return x?<span key={id} style={{padding:"2px 7px",borderRadius:6,fontSize:11,background:`${color}1a`,color}}>{x.icon} {x.label}</span>:null;})}
  </div>;
}
 
function IBadge({value}) {
  const i=INTENSITY.find(x=>x.value===value); if(!i) return null;
  return <span style={{padding:"3px 10px",borderRadius:20,background:`${i.color}22`,color:i.color,fontSize:11,fontWeight:600}}>{i.label}</span>;
}
 
function SBox({label,value}) {
  return <div style={{flex:1,padding:"12px 8px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,textAlign:"center"}}>
    <div style={{fontSize:20,fontWeight:700,color:"#6a9fd8"}}>{value}</div>
    <div style={{fontSize:11,color:"#8a9ab5",marginTop:2}}>{label}</div>
  </div>;
}
 
function Empty({text}) {
  return <div style={{textAlign:"center",padding:"40px 20px",color:"#6a7d96",fontSize:14,fontStyle:"italic"}}>{text}</div>;
}
 
const inp={
  width:"100%",padding:"10px 12px",borderRadius:8,
  border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",
  color:"#e8dcc8",fontSize:14,fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box",
};
 
createRoot(document.getElementById("root")).render(<App />);
