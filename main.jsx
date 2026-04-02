import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const TRIGGERS = [
  { id: "chat_direct",   label: "Contact chats direct",    icon: "🐱" },
  { id: "chat_presence", label: "Présence chats",          icon: "🏠" },
  { id: "stress",        label: "Stress / angoisse",       icon: "😰" },
  { id: "pollen",        label: "Pollen / sortie",         icon: "🌿" },
  { id: "poussiere",     label: "Poussière",               icon: "🌫️" },
  { id: "sommeil",       label: "Mauvaise nuit",           icon: "🌙" },
  { id: "savon",         label: "Savon / gel douche",      icon: "🧼" },
  { id: "shampoing",     label: "Shampoing",               icon: "🧴" },
  { id: "eau_chaude",    label: "Eau chaude prolongée",    icon: "🚿" },
  { id: "piscine",       label: "Piscine / chlore",        icon: "🏊" },
  { id: "aliment",       label: "Aliment suspect",         icon: "🍽️" },
  { id: "eau",           label: "Eau / humidité autre",    icon: "💧" },
  { id: "vetement",      label: "Vêtement / tissu",        icon: "👕" },
  { id: "chaleur",       label: "Chaleur",                 icon: "☀️" },
];

const TREATMENTS = [
  { id: "tridesonit",    label: "Tridésonit",             type: "cortico" },
  { id: "diprosone",     label: "Diprosone",              type: "cortico" },
  { id: "elidel",        label: "Elidel 10mg/g",          type: "immuno"  },
  { id: "cicalfate",     label: "Cicalfate+ crème",       type: "repara"  },
  { id: "cicalfate_gel", label: "Cicalfate+ gel",         type: "repara"  },
  { id: "cicaplast",     label: "Cicaplast",              type: "repara"  },
  { id: "zyrtec",        label: "Zyrtec (cétirizine)",    type: "antih"   },
  { id: "aerius",        label: "Aérius (desloratadine)", type: "antih"   },
];

const TC = {
  cortico: { bg:"rgba(244,132,95,0.15)",  border:"rgba(244,132,95,0.4)",  text:"#f4845f" },
  immuno:  { bg:"rgba(165,120,220,0.15)", border:"rgba(165,120,220,0.4)", text:"#a578dc" },
  repara:  { bg:"rgba(106,159,216,0.15)", border:"rgba(106,159,216,0.4)", text:"#6a9fd8" },
  antih:   { bg:"rgba(168,216,168,0.15)", border:"rgba(168,216,168,0.4)", text:"#a8d8a8" },
};

const FOOD_BAD = [
  { id:"vin_rouge",    label:"Vin rouge",                 icon:"🍷" },
  { id:"biere",        label:"Bière",                     icon:"🍺" },
  { id:"autre_alcool", label:"Autre alcool",              icon:"🥃" },
  { id:"fromage",      label:"Fromage affiné",            icon:"🧀" },
  { id:"charcuterie",  label:"Charcuterie / viande froide", icon:"🥩" },
  { id:"tomates",      label:"Tomates / sauce tomate",    icon:"🍅" },
  { id:"poisson_fume", label:"Poisson fumé / conserve",   icon:"🐟" },
  { id:"chocolat",     label:"Chocolat",                  icon:"🍫" },
  { id:"epices",       label:"Épices fortes",             icon:"🌶️" },
];

const FOOD_GOOD = [
  { id:"poisson_frais", label:"Poisson frais",                icon:"🐟" },
  { id:"legumes",       label:"Légumes verts",                icon:"🥦" },
  { id:"olive",         label:"Huile d'olive / avocat / noix", icon:"🫒" },
];

const MEAL_Q = [
  { value:"good",   label:"🥗 Équilibré" },
  { value:"medium", label:"😐 Moyen"     },
  { value:"bad",    label:"🍕 Mal mangé" },
];

const HYDRA = [
  { value:"low",  label:"Insuffisant", sub:"< 1L",   color:"#f4845f" },
  { value:"ok",   label:"Correct",     sub:"1–1,5L", color:"#f5c842" },
  { value:"good", label:"Bon",         sub:"> 1,5L", color:"#a8d8a8" },
];

const ACTIVITIES = [
  { id:"tennis",     label:"Tennis",     icon:"🎾" },
  { id:"piscine",    label:"Piscine",    icon:"🏊" },
  { id:"meditation", label:"Méditation", icon:"🧘" },
  { id:"yoga",       label:"Yoga",       icon:"🌿" },
  { id:"autre",      label:"Autre",      icon:"🏃" },
];

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

const SLEEP_Q = [
  { value:1, label:"Très mauvaise" },
  { value:2, label:"Mauvaise"      },
  { value:3, label:"Correcte"      },
  { value:4, label:"Bonne"         },
];

const FOOD_TIP = "Ces aliments libèrent de l'histamine dans le corps, ce qui peut déclencher ou aggraver l'inflammation cutanée.";
const KEY = "hadrien_eczema_log";

function today() { return new Date().toISOString().split("T")[0]; }
function fmtDate(d) { return new Date(d+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"}); }
function load() { try { const r=localStorage.getItem(KEY); return r?JSON.parse(r):[]; } catch{return[];} }
function save(e) { try{localStorage.setItem(KEY,JSON.stringify(e));}catch{} }

const BLANK = {
  date:today(), zones:[], intensity:null, triggers:[],
  activities:[], treatments:[], treatmentNote:"",
  sleepHours:"", sleepQuality:null, wakeUp4h:false,
  stressLevel:null, workLocation:null,
  hydration:null, foodBad:[], foodGood:[],
  mealQuality:null, foodNote:"", darkCircles:null, note:"",
};

function App() {
  const [view,setView]       = useState("log");
  const [entries,setEntries] = useState(load);
  const [form,setForm]       = useState(BLANK);
  const [saved,setSaved]     = useState(false);

  useEffect(()=>{ save(entries); },[entries]);

  const todayEntry = entries.find(e=>e.date===form.date);
  const s = (k,v) => setForm(f=>({...f,[k]:v}));
  const t = (k,v) => setForm(f=>({...f,[k]:f[k].includes(v)?f[k].filter(x=>x!==v):[...f[k],v]}));

  function submit() {
    if (!form.intensity||!form.zones.length) return;
    const entry={...form,id:Date.now()};
    setEntries(prev=>[entry,...prev.filter(e=>e.date!==form.date)].sort((a,b)=>b.date.localeCompare(a.date)));
    setSaved(true); setTimeout(()=>setSaved(false),2500);
  }

  function exportCSV() {
    if (!entries.length) return;
    const H=["Date","Zones","Intensité","Déclencheurs","Activités","Traitements",
      "Sommeil(h)","Qualité sommeil","Réveil 4h","Stress","Lieu travail",
      "Hydratation","Qualité repas","Peut aggraver","Plutôt bien","Note aliment","Cernes","Note libre"];
    const R=entries.map(e=>[
      e.date,
      (e.zones||[]).map(z=>ZONES.find(x=>x.id===z)?.label||z).join("|"),
      INTENSITY.find(x=>x.value===e.intensity)?.label||"",
      (e.triggers||[]).map(x=>TRIGGERS.find(y=>y.id===x)?.label||x).join("|"),
      (e.activities||[]).map(x=>ACTIVITIES.find(y=>y.id===x)?.label||x).join("|"),
      [...(e.treatments||[]).map(x=>TREATMENTS.find(y=>y.id===x)?.label||x),e.treatmentNote||""].filter(Boolean).join("|"),
      e.sleepHours||"",
      SLEEP_Q.find(x=>x.value===e.sleepQuality)?.label||"",
      e.wakeUp4h?"Oui":"Non",
      e.stressLevel||"",
      e.workLocation||"",
      HYDRA.find(x=>x.value===e.hydration)?.label||"",
      MEAL_Q.find(x=>x.value===e.mealQuality)?.label||"",
      (e.foodBad||[]).map(x=>FOOD_BAD.find(y=>y.id===x)?.label||x).join("|"),
      (e.foodGood||[]).map(x=>FOOD_GOOD.find(y=>y.id===x)?.label||x).join("|"),
      e.foodNote||"",
      e.darkCircles??"",
      e.note||"",
    ]);
    const csv=[H,...R].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const url=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"}));
    Object.assign(document.createElement("a"),{href:url,download:`suivi-eczema-${today()}.csv`}).click();
    URL.revokeObjectURL(url);
  }

  function insights() {
    if (entries.length<3) return null;
    const cnt={},sum={};
    entries.forEach(e=>(e.triggers||[]).forEach(x=>{cnt[x]=(cnt[x]||0)+1;sum[x]=(sum[x]||0)+(e.intensity||0);}));
    return Object.entries(cnt).map(([id,c])=>({id,c,avg:(sum[id]/c).toFixed(1)})).sort((a,b)=>b.c-a.c);
  }
  const ins=insights();

  const wl={bureau:"🏢 Bureau",maison:"🏠 Maison",mixte:"↔️ Mixte",off:"🌴 Congé/WE"};

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f1923 0%,#1a2a3a 50%,#0f1923 100%)",fontFamily:"Georgia,serif",color:"#e8dcc8",paddingBottom:80}}>

      {/* NAV */}
      <div style={{padding:"28px 24px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:4}}>
          <span style={{fontSize:22,fontWeight:700,color:"#f0e6d3"}}>Suivi Eczéma</span>
          <span style={{fontSize:13,color:"#8a9ab5",fontStyle:"italic"}}>Hadrien · 46 ans · Barcelone</span>
        </div>
        <nav style={{display:"flex",gap:0,marginTop:16}}>
          {[["log","Saisie"],["history","Historique"],["insights","Tendances"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"10px 4px",background:"none",border:"none",
              borderBottom:view===v?"2px solid #c8956c":"2px solid transparent",
              color:view===v?"#c8956c":"#6a7d96",fontSize:13,fontFamily:"inherit",cursor:"pointer",fontWeight:view===v?600:400}}>
              {l}
            </button>
          ))}
          <button onClick={exportCSV} disabled={!entries.length} style={{flex:1,padding:"10px 4px",background:"none",border:"none",
            borderBottom:"2px solid transparent",color:entries.length?"#6a9fd8":"#3a4a5a",
            fontSize:13,fontFamily:"inherit",cursor:entries.length?"pointer":"not-allowed"}}>
            ↓ Export
          </button>
        </nav>
      </div>

      <div style={{padding:"24px 20px"}}>

        {/* ── SAISIE ── */}
        {view==="log" && (
          <div style={{maxWidth:500,margin:"0 auto"}}>
            {todayEntry && (
              <div style={{background:"rgba(200,149,108,0.12)",border:"1px solid rgba(200,149,108,0.3)",borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:13,color:"#c8956c"}}>
                ✓ Entrée du jour déjà saisie — tu peux la remplacer.
              </div>
            )}

            <Sec label="Date">
              <input type="date" value={form.date} onChange={e=>s("date",e.target.value)} style={inp} />
            </Sec>

            <Sec label="Zone(s) touchée(s) *">
              <Chips2 items={ZONES} active={form.zones} onToggle={v=>t("zones",v)} />
            </Sec>

            <Sec label="Intensité *">
              <div style={{display:"flex",gap:8}}>
                {INTENSITY.map(i=>(
                  <Btn key={i.value} on={form.intensity===i.value} color={i.color} onClick={()=>s("intensity",i.value)}>
                    <div style={{fontSize:18,marginBottom:3}}>{"●".repeat(i.value)}</div>
                    <div style={{fontSize:11}}>{i.label}</div>
                  </Btn>
                ))}
              </div>
            </Sec>

            <Sec label="Déclencheurs suspectés">
              <Chips2 items={TRIGGERS} active={form.triggers} onToggle={v=>t("triggers",v)} />
            </Sec>

            <Sec label="Activité physique du jour">
              <Chips2 items={ACTIVITIES} active={form.activities} onToggle={v=>t("activities",v)} color="#a8d8a8" />
            </Sec>

            <Sec label="Traitements appliqués aujourd'hui">
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
                {TREATMENTS.map(tr=>{
                  const c=TC[tr.type], on=form.treatments.includes(tr.id);
                  return <button key={tr.id} onClick={()=>t("treatments",tr.id)} style={{padding:"7px 12px",borderRadius:20,
                    border:on?`1.5px solid ${c.border}`:"1.5px solid rgba(255,255,255,0.1)",
                    background:on?c.bg:"rgba(255,255,255,0.04)",color:on?c.text:"#8a9ab5",
                    fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer"}}>{tr.label}</button>;
                })}
              </div>
              <input type="text" placeholder="Autre produit..." value={form.treatmentNote} onChange={e=>s("treatmentNote",e.target.value)} style={{...inp,fontSize:13,marginBottom:8}} />
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {Object.entries({cortico:"Dermocorticoïde",immuno:"Immunomodulateur",repara:"Réparateur",antih:"Antihistaminique"}).map(([k,l])=>(
                  <span key={k} style={{fontSize:10,color:TC[k].text,display:"flex",alignItems:"center",gap:4}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:TC[k].text,display:"inline-block"}} />{l}
                  </span>
                ))}
              </div>
            </Sec>

            <Sec label="Sommeil (nuit précédente)">
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:13,color:"#8a9ab5",minWidth:60}}>Durée</span>
                <input type="number" min="2" max="12" step="0.5" placeholder="ex: 6" value={form.sleepHours}
                  onChange={e=>s("sleepHours",e.target.value)} style={{...inp,width:80,textAlign:"center"}} />
                <span style={{fontSize:13,color:"#8a9ab5"}}>h</span>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:10}}>
                {SLEEP_Q.map(q=>(
                  <button key={q.value} onClick={()=>s("sleepQuality",q.value)} style={{flex:1,padding:"7px 2px",borderRadius:7,
                    border:form.sleepQuality===q.value?"2px solid #6a9fd8":"2px solid rgba(255,255,255,0.08)",
                    background:form.sleepQuality===q.value?"rgba(106,159,216,0.15)":"rgba(255,255,255,0.04)",
                    color:form.sleepQuality===q.value?"#6a9fd8":"#6a7d96",fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>{q.label}</button>
                ))}
              </div>
              <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                <input type="checkbox" checked={form.wakeUp4h} onChange={e=>s("wakeUp4h",e.target.checked)} style={{width:16,height:16,accentColor:"#c8956c"}} />
                <span style={{fontSize:13,color:"#8a9ab5"}}>Réveil nocturne (~4h)</span>
              </label>
            </Sec>

            <Sec label="Niveau de stress du jour">
              <div style={{display:"flex",gap:8}}>
                {[1,2,3,4,5].map(v=>{
                  const c=["#a8d8a8","#c8d870","#f5c842","#f4845f","#c0392b"][v-1], on=form.stressLevel===v;
                  return <button key={v} onClick={()=>s("stressLevel",v)} style={{flex:1,padding:"10px 4px",borderRadius:8,
                    border:on?`2px solid ${c}`:"2px solid rgba(255,255,255,0.08)",background:on?`${c}22`:"rgba(255,255,255,0.04)",
                    color:on?c:"#6a7d96",fontSize:13,fontWeight:on?700:400,fontFamily:"inherit",cursor:"pointer"}}>{v}</button>;
                })}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:10,color:"#4a5a6a"}}>Calme</span>
                <span style={{fontSize:10,color:"#4a5a6a"}}>Très stressé</span>
              </div>
            </Sec>

            <Sec label="Journée de travail">
              <div style={{display:"flex",gap:8}}>
                {Object.entries(wl).map(([val,label])=>(
                  <button key={val} onClick={()=>s("workLocation",form.workLocation===val?null:val)} style={{flex:1,padding:"9px 2px",borderRadius:8,
                    border:form.workLocation===val?"2px solid #6a9fd8":"2px solid rgba(255,255,255,0.08)",
                    background:form.workLocation===val?"rgba(106,159,216,0.15)":"rgba(255,255,255,0.04)",
                    color:form.workLocation===val?"#6a9fd8":"#6a7d96",fontSize:11,fontFamily:"inherit",cursor:"pointer",textAlign:"center"}}>{label}</button>
                ))}
              </div>
            </Sec>

            <Sec label="💧 Hydratation du jour">
              <div style={{display:"flex",gap:8}}>
                {HYDRA.map(h=>(
                  <button key={h.value} onClick={()=>s("hydration",h.value)} style={{flex:1,padding:"10px 4px",borderRadius:8,
                    border:form.hydration===h.value?`2px solid ${h.color}`:"2px solid rgba(255,255,255,0.08)",
                    background:form.hydration===h.value?`${h.color}22`:"rgba(255,255,255,0.04)",
                    color:form.hydration===h.value?h.color:"#6a7d96",fontSize:12,fontFamily:"inherit",cursor:"pointer",textAlign:"center"}}>
                    <div style={{fontWeight:600,marginBottom:2}}>{h.label}</div>
                    <div style={{fontSize:10,opacity:0.7}}>{h.sub}</div>
                  </button>
                ))}
              </div>
            </Sec>

            <Sec label="🍽️ Alimentation">
              <Sub label="Qualité générale" />
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                {MEAL_Q.map(q=>(
                  <button key={q.value} onClick={()=>s("mealQuality",q.value)} style={{flex:1,padding:"9px 4px",borderRadius:8,
                    border:form.mealQuality===q.value?"2px solid #c8956c":"2px solid rgba(255,255,255,0.08)",
                    background:form.mealQuality===q.value?"rgba(200,149,108,0.15)":"rgba(255,255,255,0.04)",
                    color:form.mealQuality===q.value?"#c8956c":"#6a7d96",fontSize:12,fontFamily:"inherit",cursor:"pointer"}}>{q.label}</button>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <Sub label="Peut aggraver" color="#f4845f" />
                <Tip text={FOOD_TIP} />
              </div>
              <Chips2 items={FOOD_BAD} active={form.foodBad} onToggle={v=>t("foodBad",v)} color="#f4845f" style={{marginBottom:16}} />
              <Sub label="Plutôt bien" color="#a8d8a8" />
              <Chips2 items={FOOD_GOOD} active={form.foodGood} onToggle={v=>t("foodGood",v)} color="#a8d8a8" style={{marginBottom:12}} />
              <input type="text" placeholder="Aliment inhabituel du jour..." value={form.foodNote} onChange={e=>s("foodNote",e.target.value)} style={{...inp,fontSize:13}} />
            </Sec>

            <Sec label="Cernes (0 = aucun · 5 = très marqués)">
              <div style={{display:"flex",gap:8}}>
                {[0,1,2,3,4,5].map(v=>(
                  <button key={v} onClick={()=>s("darkCircles",v)} style={{flex:1,borderRadius:8,padding:"10px 0",
                    border:form.darkCircles===v?"2px solid #8a7ab5":"2px solid rgba(255,255,255,0.08)",
                    background:form.darkCircles===v?`rgba(138,122,181,${0.1+v*0.12})`:"rgba(255,255,255,0.04)",
                    color:form.darkCircles===v?"#b8a8e8":"#6a7d96",
                    fontSize:form.darkCircles===v?16:14,fontWeight:form.darkCircles===v?700:400,
                    fontFamily:"inherit",cursor:"pointer"}}>{v}</button>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:10,color:"#4a5a6a"}}>Aucun</span>
                <span style={{fontSize:10,color:"#4a5a6a"}}>Très marqués</span>
              </div>
            </Sec>

            <Sec label="Note libre">
              <textarea placeholder="Situation stressante, changement de routine, remarque..." value={form.note}
                onChange={e=>s("note",e.target.value)} style={{...inp,height:80,resize:"vertical",lineHeight:1.5}} />
            </Sec>

            <button onClick={submit} disabled={!form.intensity||!form.zones.length} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",
              background:(!form.intensity||!form.zones.length)?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#c8956c,#d4a574)",
              color:(!form.intensity||!form.zones.length)?"#4a5a6a":"#0f1923",fontSize:15,fontFamily:"inherit",
              fontWeight:700,cursor:(!form.intensity||!form.zones.length)?"not-allowed":"pointer",letterSpacing:"0.5px"}}>
              {saved?"✓ Enregistré !":"Enregistrer"}
            </button>
            <p style={{textAlign:"center",fontSize:11,color:"#4a5a6a",marginTop:12,fontStyle:"italic"}}>
              ⚕️ Ce suivi est informatif. Consulte toujours un médecin pour tout diagnostic ou traitement.
            </p>
          </div>
        )}

        {/* ── HISTORIQUE ── */}
        {view==="history" && (
          <div style={{maxWidth:500,margin:"0 auto"}}>
            {!entries.length ? <Empty text="Aucune entrée encore. Commence par la saisie !" /> : entries.map(e=>(
              <div key={e.id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 16px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:13,color:"#c8956c",fontWeight:600}}>{fmtDate(e.date)}</span>
                  <IBadge value={e.intensity} />
                </div>
                <TagRow items={e.zones}       list={ZONES}      />
                <TagRow items={e.triggers}    list={TRIGGERS}   muted />
                <ColorRow items={e.activities} list={ACTIVITIES} color="#a8d8a8" />
                {(e.treatments?.length||e.treatmentNote) && (
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
                    {(e.treatments||[]).map(id=>{const tr=TREATMENTS.find(x=>x.id===id),c=tr&&TC[tr.type];
                      return tr?<span key={id} style={{padding:"2px 7px",borderRadius:6,fontSize:11,background:c.bg,color:c.text}}>💊 {tr.label}</span>:null;})}
                    {e.treatmentNote&&<Tag muted>+ {e.treatmentNote}</Tag>}
                  </div>
                )}
                <div style={{display:"flex",flexWrap:"wrap",gap:10,fontSize:12,color:"#6a7d96",marginBottom:4}}>
                  {e.sleepHours&&<span>🌙 {e.sleepHours}h</span>}
                  {e.wakeUp4h&&<span>⏰ Réveil 4h</span>}
                  {e.sleepQuality&&<span>Qualité: {SLEEP_Q.find(x=>x.value===e.sleepQuality)?.label}</span>}
                  {e.stressLevel!=null&&<span>😰 Stress: {e.stressLevel}/5</span>}
                  {e.workLocation&&<span>{wl[e.workLocation]}</span>}
                  {e.hydration&&<span>💧 {HYDRA.find(x=>x.value===e.hydration)?.label}</span>}
                  {e.mealQuality&&<span>{MEAL_Q.find(x=>x.value===e.mealQuality)?.label}</span>}
                  {e.darkCircles!=null&&<span>👁️ Cernes: {e.darkCircles}/5</span>}
                </div>
                <ColorRow items={e.foodBad}  list={FOOD_BAD}  color="#f4845f" />
                <ColorRow items={e.foodGood} list={FOOD_GOOD} color="#a8d8a8" />
                {e.note&&<p style={{fontSize:12,color:"#8a9ab5",marginTop:6,fontStyle:"italic"}}>{e.note}</p>}
              </div>
            ))}
          </div>
        )}

        {/* ── TENDANCES ── */}
        {view==="insights" && (
          <div style={{maxWidth:500,margin:"0 auto"}}>
            {!ins ? <Empty text="Il faut au moins 3 entrées pour voir des tendances. Continue le suivi !" /> : (
              <>
                <div style={{marginBottom:20,padding:"12px 16px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12}}>
                  <div style={{fontSize:13,color:"#8a9ab5",marginBottom:4}}>Entrées enregistrées</div>
                  <div style={{fontSize:28,fontWeight:700,color:"#c8956c"}}>{entries.length}</div>
                </div>
                <h3 style={{fontSize:13,color:"#8a9ab5",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12,fontWeight:400}}>Déclencheurs les plus fréquents</h3>
                {ins.map((item,i)=>{
                  const tr=TRIGGERS.find(x=>x.id===item.id);
                  return <div key={item.id} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:13}}>{tr?.icon} {tr?.label}</span>
                      <span style={{fontSize:12,color:"#8a9ab5"}}>{item.c}× · moy. {item.avg}</span>
                    </div>
                    <div style={{height:6,background:"rgba(255,255,255,0.08)",borderRadius:3}}>
                      <div style={{height:"100%",width:`${(item.c/ins[0].c)*100}%`,
                        background:i===0?"#c8956c":i===1?"#d4a574":"#8a9ab5",borderRadius:3,transition:"width 0.5s"}} />
                    </div>
                  </div>;
                })}
                <h3 style={{fontSize:13,color:"#8a9ab5",textTransform:"uppercase",letterSpacing:"1px",margin:"24px 0 12px",fontWeight:400}}>Sommeil & eczéma</h3>
                {(()=>{
                  const ws=entries.filter(e=>e.sleepHours);
                  if (ws.length<2) return <p style={{color:"#6a7d96",fontSize:13}}>Pas encore assez de données sommeil.</p>;
                  const avg=(ws.reduce((a,e)=>a+parseFloat(e.sleepHours),0)/ws.length).toFixed(1);
                  const wr=Math.round((entries.filter(e=>e.wakeUp4h).length/entries.length)*100);
                  return <div style={{display:"flex",gap:10}}>
                    <SBox label="Durée moy." value={`${avg}h`} />
                    <SBox label="Réveil 4h" value={`${wr}%`} sub="des nuits" />
                  </div>;
                })()}
                <p style={{fontSize:11,color:"#4a5a6a",marginTop:20,fontStyle:"italic"}}>
                  ⚕️ Ces tendances sont indicatives. Partage-les avec ton dermatologue ou allergologue.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Composants ──────────────────────────────────────────────────────

function Sec({label,children}) {
  return <div style={{marginBottom:20}}>
    <div style={{fontSize:12,color:"#8a9ab5",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10,fontWeight:600}}>{label}</div>
    {children}
  </div>;
}

function Sub({label,color="#8a9ab5"}) {
  return <div style={{fontSize:11,color,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</div>;
}

function Btn({on,color,onClick,children}) {
  return <button onClick={onClick} style={{flex:1,padding:"10px 4px",borderRadius:8,
    border:on?`2px solid ${color}`:"2px solid rgba(255,255,255,0.1)",
    background:on?`${color}22`:"rgba(255,255,255,0.04)",
    color:on?color:"#8a9ab5",fontFamily:"inherit",cursor:"pointer",transition:"all 0.2s"}}>{children}</button>;
}

function Chips2({items,active,onToggle,color="#c8956c"}) {
  return <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
    {items.map(x=>{
      const on=active.includes(x.id);
      return <button key={x.id} onClick={()=>onToggle(x.id)} style={{padding:"7px 12px",borderRadius:20,
        border:on?`1.5px solid ${color}`:"1.5px solid rgba(255,255,255,0.1)",
        background:on?`${color}22`:"rgba(255,255,255,0.04)",
        color:on?color:"#8a9ab5",fontSize:12,fontFamily:"Georgia,serif",cursor:"pointer",whiteSpace:"nowrap"}}>
        {x.icon} {x.label}
      </button>;
    })}
  </div>;
}

function Tip({text}) {
  const [show,setShow]=useState(false);
  return <span style={{position:"relative",display:"inline-block"}}>
    <button onClick={()=>setShow(s=>!s)} style={{width:16,height:16,borderRadius:"50%",border:"1px solid #6a7d96",
      background:"none",color:"#6a7d96",fontSize:10,cursor:"pointer",padding:0,
      display:"inline-flex",alignItems:"center",justifyContent:"center"}}>?</button>
    {show&&<div style={{position:"absolute",left:20,top:-4,width:220,background:"#1e2f40",
      border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"10px 12px",
      fontSize:11,color:"#c8d8e8",zIndex:10,lineHeight:1.5,boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>
      {text}
      <button onClick={()=>setShow(false)} style={{display:"block",marginTop:6,fontSize:10,color:"#8a9ab5",background:"none",border:"none",cursor:"pointer"}}>Fermer</button>
    </div>}
  </span>;
}

function Tag({children,muted}) {
  return <span style={{padding:"3px 8px",borderRadius:6,fontSize:11,
    background:muted?"rgba(106,125,150,0.12)":"rgba(200,149,108,0.12)",
    color:muted?"#6a7d96":"#c8956c"}}>{children}</span>;
}

function TagRow({items,list,muted}) {
  if (!items?.length) return null;
  return <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
    {items.map(id=>{const x=list.find(l=>l.id===id);return x?<Tag key={id} muted={muted}>{x.icon} {x.label}</Tag>:null;})}
  </div>;
}

function ColorRow({items,list,color}) {
  if (!items?.length) return null;
  return <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:4}}>
    {items.map(id=>{const x=list.find(l=>l.id===id);
      return x?<span key={id} style={{padding:"2px 7px",borderRadius:6,fontSize:11,background:`${color}1a`,color}}>{x.icon} {x.label}</span>:null;})}
  </div>;
}

function IBadge({value}) {
  const i=INTENSITY.find(x=>x.value===value); if(!i) return null;
  return <span style={{padding:"3px 10px",borderRadius:20,background:`${i.color}22`,color:i.color,fontSize:11,fontWeight:600}}>{i.label}</span>;
}

function SBox({label,value,sub}) {
  return <div style={{flex:1,padding:"14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,textAlign:"center"}}>
    <div style={{fontSize:24,fontWeight:700,color:"#6a9fd8"}}>{value}</div>
    <div style={{fontSize:12,color:"#8a9ab5",marginTop:2}}>{label}</div>
    {sub&&<div style={{fontSize:11,color:"#4a5a6a"}}>{sub}</div>}
  </div>;
}

function Empty({text}) {
  return <div style={{textAlign:"center",padding:"40px 20px",color:"#6a7d96",fontSize:14,fontStyle:"italic"}}>{text}</div>;
}

const inp = {
  width:"100%",padding:"10px 12px",borderRadius:8,
  border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",
  color:"#e8dcc8",fontSize:14,fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box",
};

// ── Démarrage ───────────────────────────────────────────────────────
createRoot(document.getElementById("root")).render(<App />);
