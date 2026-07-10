/* ============================================================
   IndustrCons — Story Data
   Each story is a small decision graph. The reader plays the
   engineer in the "you" role; every choice steers the path.
   ============================================================ */

const CATEGORIES = ["Concrete","Rebar","Formwork","Excavation","Foundations","Steel Structures","Road Construction","Bridge Construction","Survey & BIM","Procurement & Contracts"];

const STORIES = [
// ------------------------------------------------------------------
{
  id:"concrete-slump",
  title:"The Slump Test Standoff",
  category:"Concrete",
  difficulty:"Beginner",
  readTime:4, xp:120,
  cover:{scene:"site", role:"concrete_insp", sky:"day"},
  description:"A ready-mix truck just arrived and the slump test is borderline. Do you approve the pour?",
  start:"n1",
  nodes:{
    n1:{ scene:"site", roles:["concrete_insp","site_engineer"], sky:"day",
      dialogue:[
        {who:"Concrete Inspector", side:"left", text:"Truck's here for the raft slab. Slump test just came back at 180mm — spec calls for 150±25."},
        {who:"Site Engineer (You)", side:"right", text:"That's outside tolerance. Let's check the ticket and batching time before anything else."}
      ],
      learning:"Concrete must be tested for slump on every truck before placement.",
      next:"n2"
    },
    n2:{ scene:"site", roles:["concrete_insp","site_engineer"], sky:"day",
      dialogue:[
        {who:"Concrete Inspector", side:"left", text:"Batching plant says they added extra water on site to 'help pumpability.'"},
        {who:"Site Engineer (You)", side:"right", text:"Adding water on site changes the water-cement ratio and weakens the mix."}
      ],
      learning:"Water added after batching increases w/c ratio and reduces strength — it must be logged and controlled.",
      decision:{
        question:"The driver is pushing to pour now before the concrete sets in the drum. Do you approve this load?",
        options:[
          {label:"🔴 Reject the load", type:"good", next:"n3a"},
          {label:"🟢 Approve — it's close enough", type:"bad", next:"n3b"}
        ]
      }
    },
    n3a:{ scene:"inspection", roles:["concrete_insp","hse_officer"], sky:"day",
      dialogue:[
        {who:"Concrete Inspector", side:"left", text:"Load rejected. I'm logging it as non-conforming and calling the batching plant supervisor."},
        {who:"HSE Officer", side:"right", text:"Good call — a weak raft slab under a crane base would've been a real risk."}
      ],
      learning:"Rejecting non-conforming concrete protects long-term structural integrity, even if it costs time today.",
      next:"end_good"
    },
    n3b:{ scene:"site", roles:["site_engineer","project_manager"], sky:"overcast",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"Let's just pour it, we're already behind schedule."},
        {who:"Project Manager", side:"left", text:"Three weeks later: core tests show the slab is 22% under design strength."}
      ],
      learning:"Skipping quality control to save time often costs far more later in remedial works.",
      next:"end_bad"
    },
    end_good:{ scene:"site", roles:["concrete_insp"], sky:"day",
      ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:120,
        what:"You rejected an out-of-spec concrete load instead of letting site pressure override the mix design.",
        correct:"Checking the slump test and refusing water added after batching is standard QA/QC practice.",
        wrong:"Nothing — this is the textbook-correct decision, even though it delays the pour.",
        tip:"Always verify the batching ticket time, slump result, and any water added on site before allowing a pour.",
        mistakes:"New engineers often feel pressured by drivers/PMs to 'just pour it' — don't let schedule pressure override QA.",
        practice:"On real sites, a rejected truck is sent back or used for non-structural elements like kerbs, with the incident logged in the QA register.",
        quiz:{ q:"What is the main risk of adding water to concrete after batching?",
          options:["It makes the concrete cheaper","It increases the water-cement ratio and reduces strength","It speeds up curing with no downside","It only affects the colour"],
          answer:1 }
      }
    },
    end_bad:{ scene:"office", roles:["project_manager","qa_engineer"], sky:"overcast",
      ending:{ type:"quality-failure", title:"Quality Failure", stars:2, xp:30,
        what:"You approved out-of-spec concrete under time pressure, and the slab later failed strength testing.",
        correct:"Recognizing the schedule pressure was real — but that doesn't excuse skipping the check.",
        wrong:"Approving a load with excess site-added water without retesting or documenting it.",
        tip:"A rejected truck costs hours; a failed structural element costs weeks of remedial work and client trust.",
        mistakes:"Common mistake: treating slump tolerance as a 'suggestion' instead of a hard quality gate.",
        practice:"Real sites require core sampling and a full non-conformance report (NCR) before any remedial decision is made.",
        quiz:{ q:"What is the main risk of adding water to concrete after batching?",
          options:["It makes the concrete cheaper","It increases the water-cement ratio and reduces strength","It speeds up curing with no downside","It only affects the colour"],
          answer:1 }
      }
    }
  }
},
// ------------------------------------------------------------------
{
  id:"rebar-spacing",
  title:"Rebar Spacing Crisis",
  category:"Rebar",
  difficulty:"Beginner",
  readTime:4, xp:110,
  cover:{scene:"building", role:"rebar_eng", sky:"day"},
  description:"The rebar cage for a column looks tighter than the drawing. Do you stop the pour?",
  start:"n1",
  nodes:{
    n1:{ scene:"building", roles:["rebar_eng","qa_engineer"], sky:"day",
      dialogue:[
        {who:"Rebar Engineer", side:"left", text:"Column C12 cage is tied. Bar spacing looks off compared to the drawing."},
        {who:"QA/QC Engineer", side:"right", text:"Let's measure it before the formwork closes up."}
      ],
      learning:"Rebar spacing, cover, and lap lengths must be checked against the structural drawing before formwork closes.",
      next:"n2"
    },
    n2:{ scene:"inspection", roles:["rebar_eng","qa_engineer"], sky:"day",
      dialogue:[
        {who:"QA/QC Engineer", side:"right", text:"Measured spacing is 180mm — drawing calls for 150mm centers. Cover looks fine though."},
        {who:"Rebar Engineer", side:"left", text:"Fewer bars than designed means less load capacity in this column."}
      ],
      learning:"Wider-than-specified spacing effectively reduces the reinforcement ratio, which affects the column's capacity.",
      decision:{
        question:"Formwork is scheduled to close in 2 hours. What do you do?",
        options:[
          {label:"🔴 Hold the pour, request re-fixing", type:"good", next:"n3a"},
          {label:"🟢 Let it go, close the formwork on schedule", type:"bad", next:"n3b"}
        ]
      }
    },
    n3a:{ scene:"building", roles:["rebar_eng","site_engineer"], sky:"day",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"Hold the pour. Get the rebar gang back to re-space and re-tie the cage correctly."},
        {who:"Rebar Engineer", side:"left", text:"Two hours of rework now — but the column will match the design."}
      ],
      learning:"A short delay for rebar correction is far cheaper than a structural retrofit later.",
      next:"end_good"
    },
    n3b:{ scene:"building", roles:["site_engineer","qa_engineer"], sky:"overcast",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"We'll note it and move on, the formwork crew is waiting."},
        {who:"QA/QC Engineer", side:"right", text:"Structural engineer flagged the as-built survey — this column doesn't meet design capacity."}
      ],
      learning:"Undocumented deviations from structural drawings can trigger a full design review or demolition order.",
      next:"end_bad"
    },
    end_good:{ ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:110,
      what:"You held the pour to correct rebar spacing instead of letting an under-reinforced column proceed.",
      correct:"Verifying spacing against the structural drawing before formwork closure is a mandatory QA checkpoint.",
      wrong:"Nothing here — this is best practice, even if it costs two hours.",
      tip:"Use a rebar spacing template or tape measure at multiple points along the cage, not just the top.",
      mistakes:"Assuming 'close enough' spacing is fine without checking the reinforcement ratio calculation.",
      practice:"Many contractors keep a rebar inspection checklist (bar size, spacing, cover, laps, ties) signed off before every pour.",
      quiz:{ q:"Why does wider rebar spacing than designed matter structurally?",
        options:["It only affects appearance","It reduces the reinforcement ratio and load capacity","It makes concrete cure faster","It has no real effect"],
        answer:1 } }
    },
    end_bad:{ ending:{ type:"quality-failure", title:"Quality Failure", stars:2, xp:25,
      what:"You allowed the formwork to close over an under-spaced rebar cage, and the column didn't meet design capacity.",
      correct:"Spotting the discrepancy in the first place was correct — the failure was not acting on it.",
      wrong:"Prioritizing the formwork schedule over a structural non-conformance.",
      tip:"Any deviation from the reinforcement drawing needs sign-off from the structural engineer, not just the site team.",
      mistakes:"Treating rebar inspection as a formality rather than a hard hold-point in the quality plan.",
      practice:"On real projects this triggers a Non-Conformance Report (NCR) and often core-cutting or load testing to verify capacity.",
      quiz:{ q:"Why does wider rebar spacing than designed matter structurally?",
        options:["It only affects appearance","It reduces the reinforcement ratio and load capacity","It makes concrete cure faster","It has no real effect"],
        answer:1 } }
    }
  }
},
// ------------------------------------------------------------------
{
  id:"formwork-deadline",
  title:"Formwork Deadline",
  category:"Formwork",
  difficulty:"Intermediate",
  readTime:5, xp:130,
  cover:{scene:"building", role:"formwork_eng", sky:"sunset"},
  description:"A formwork prop is missing a locking pin under deadline pressure. What do you do?",
  start:"n1",
  nodes:{
    n1:{ scene:"building", roles:["formwork_eng","worker"], sky:"sunset",
      dialogue:[
        {who:"Formwork Engineer", side:"left", text:"We're pouring the first floor slab tonight to hit the schedule."},
        {who:"Construction Worker", side:"right", text:"Boss, one of the shoring props under bay 4 is missing its locking pin."}
      ],
      learning:"Formwork and shoring must be fully inspected and certified before any concrete pour.",
      next:"n2"
    },
    n2:{ scene:"inspection", roles:["formwork_eng","hse_officer"], sky:"dusk",
      dialogue:[
        {who:"HSE Officer", side:"right", text:"That prop is load-bearing for the whole bay. A missing pin can allow it to slip under wet concrete load."},
        {who:"Formwork Engineer", side:"left", text:"We have a spare pin in the store, five minutes to fit it."}
      ],
      learning:"Wet concrete is significantly heavier than the finished slab and formwork must be checked for the full temporary load.",
      decision:{
        question:"The pour is scheduled to start in 15 minutes and the crew is already positioned. Do you pause for the fix?",
        options:[
          {label:"🔴 Stop and fix the prop first", type:"good", next:"n3a"},
          {label:"🟢 Proceed, fix it after the pour starts", type:"bad", next:"n3b"}
        ]
      }
    },
    n3a:{ scene:"building", roles:["formwork_eng","worker"], sky:"dusk",
      dialogue:[
        {who:"Formwork Engineer", side:"left", text:"Pour delayed 15 minutes. Pin is fitted and the formwork engineer has re-checked the whole bay."},
        {who:"Construction Worker", side:"right", text:"Feels a lot safer starting the pump now."}
      ],
      learning:"A short pause to correct shoring prevents catastrophic formwork collapse under fresh concrete load.",
      next:"end_good"
    },
    n3b:{ scene:"building", roles:["worker","hse_officer"], sky:"dusk",
      dialogue:[
        {who:"Construction Worker", side:"right", text:"Pump's running... bay 4 is starting to sag!"},
        {who:"HSE Officer", side:"right", text:"Stop the pour! Evacuate the bay now!"}
      ],
      learning:"An unpinned prop under load can shift or buckle, risking a full formwork collapse mid-pour.",
      next:"end_bad"
    },
    end_good:{ ending:{ type:"safety", title:"Zero Accident Award", stars:5, xp:130,
      what:"You paused the pour for 15 minutes to correct a missing locking pin on a load-bearing prop.",
      correct:"Treating shoring/formwork inspection as a hold-point before pouring, regardless of schedule pressure.",
      wrong:"Nothing — safety-critical fixes always come before schedule.",
      tip:"A pre-pour formwork checklist should include every prop, pin, and bracing member, not just a visual walk-through.",
      mistakes:"Rushing shoring checks because the pump truck is already on site and billing by the hour.",
      practice:"Many contractors require a signed formwork/falsework certificate from a competent person before every pour above a certain height or span.",
      quiz:{ q:"Why is formwork especially at risk right when concrete is poured?",
        options:["Wet concrete is lighter than cured concrete","Wet concrete applies its full hydrostatic and weight load before it gains strength","Formwork only matters after curing","Pouring reduces the load on props"],
        answer:1 } }
    },
    end_bad:{ ending:{ type:"safety-incident", title:"Safety Incident", stars:1, xp:20,
      what:"The bay's formwork began to fail mid-pour because a shoring prop was missing its locking pin.",
      correct:"The worker who reported the missing pin acted correctly and should always be listened to immediately.",
      wrong:"Proceeding with a known structural defect in temporary works under time pressure.",
      tip:"Any reported defect in shoring or formwork should stop work until a competent person confirms it's safe.",
      mistakes:"Assuming a missing pin is 'minor' because the rest of the formwork looks fine.",
      practice:"Formwork collapse is one of the leading causes of serious construction injuries worldwide — near-miss reports on props/pins should never be ignored.",
      quiz:{ q:"Why is formwork especially at risk right when concrete is poured?",
        options:["Wet concrete is lighter than cured concrete","Wet concrete applies its full hydrostatic and weight load before it gains strength","Formwork only matters after curing","Pouring reduces the load on props"],
        answer:1 } }
    }
  }
},
// ------------------------------------------------------------------
{
  id:"deep-excavation",
  title:"Deep Excavation Risk",
  category:"Excavation",
  difficulty:"Intermediate",
  readTime:5, xp:130,
  cover:{scene:"site", role:"geotech_eng", sky:"overcast"},
  description:"Overnight rain has soaked a 4m trench. Do you allow workers to enter today?",
  start:"n1",
  nodes:{
    n1:{ scene:"site", roles:["geotech_eng","hse_officer"], sky:"overcast",
      dialogue:[
        {who:"Geotechnical Engineer", side:"left", text:"That trench is 4 metres deep for the sewer line, and it rained heavily overnight."},
        {who:"HSE Officer", side:"right", text:"The shoring looks okay from up here, but I want to check the sides properly."}
      ],
      learning:"Excavations over 1.2m generally require shoring, benching, or shielding, and daily inspection — especially after rain.",
      next:"n2"
    },
    n2:{ scene:"inspection", roles:["geotech_eng","hse_officer"], sky:"overcast",
      dialogue:[
        {who:"Geotechnical Engineer", side:"left", text:"There's visible cracking at the crest and some slumping on the north wall."},
        {who:"HSE Officer", side:"right", text:"Those are classic signs the soil is saturated and the trench walls could collapse."}
      ],
      learning:"Cracking at the crest and wall slumping are early warning signs of trench wall failure.",
      decision:{
        question:"The pipe-laying crew is ready to enter the trench. Do you allow entry?",
        options:[
          {label:"🔴 No entry — re-inspect and improve shoring first", type:"good", next:"n3a"},
          {label:"🟢 Allow entry, work carefully", type:"bad", next:"n3b"}
        ]
      }
    },
    n3a:{ scene:"site", roles:["geotech_eng","worker"], sky:"overcast",
      dialogue:[
        {who:"Geotechnical Engineer", side:"left", text:"No entry until we add extra shoring and let the water table drop with pumping."},
        {who:"Worker", side:"right", text:"Understood. We'll prep the trench box while we wait."}
      ],
      learning:"Delaying entry until ground conditions are verified safe is standard excavation practice after heavy rain.",
      next:"end_good"
    },
    n3b:{ scene:"site", roles:["worker","hse_officer"], sky:"overcast",
      dialogue:[
        {who:"Worker", side:"right", text:"We're laying pipe now... the wall's moving!"},
        {who:"HSE Officer", side:"right", text:"Get out now! Trench collapse!"}
      ],
      learning:"Trench collapses can happen in seconds and are one of the deadliest hazards in excavation work.",
      next:"end_bad"
    },
    end_good:{ ending:{ type:"safety", title:"Zero Accident Award", stars:5, xp:130,
      what:"You held entry into a saturated trench showing crest cracking until shoring was reinforced.",
      correct:"Recognizing visible signs of instability and stopping entry until conditions are verified.",
      wrong:"Nothing — this is exactly what a competent person should do after heavy rain.",
      tip:"After rain, always re-inspect excavations for cracking, slumping, water seepage, and shoring integrity before allowing entry.",
      mistakes:"Assuming shoring installed days ago is still adequate without re-checking after weather changes.",
      practice:"On real sites, a 'competent person' must inspect excavations daily and after any event that could affect stability (rain, vibration, nearby loading).",
      quiz:{ q:"What is a key warning sign that a trench wall may be about to collapse?",
        options:["The trench smells like wet soil","Cracking at the crest and wall slumping","The trench is deeper than 1 metre","Workers are wearing high-vis vests"],
        answer:1 } }
    },
    end_bad:{ ending:{ type:"safety-incident", title:"Safety Incident", stars:1, xp:15,
      what:"A trench wall collapsed while workers were laying pipe in ground that had visible instability signs.",
      correct:"The initial inspection correctly identified the risk indicators.",
      wrong:"Allowing entry despite visible cracking and slumping, based on time pressure rather than ground conditions.",
      tip:"Never allow entry into an excavation with visible signs of instability, regardless of shoring installed earlier.",
      mistakes:"Treating 'the shoring was fine yesterday' as sufficient justification without re-inspecting after rain.",
      practice:"Trench collapses account for a large share of excavation fatalities worldwide — stop-work authority should always be respected.",
      quiz:{ q:"What is a key warning sign that a trench wall may be about to collapse?",
        options:["The trench smells like wet soil","Cracking at the crest and wall slumping","The trench is deeper than 1 metre","Workers are wearing high-vis vests"],
        answer:1 } }
    }
  }
},
// ------------------------------------------------------------------
{
  id:"retaining-wall-tilt",
  title:"The Leaning Retaining Wall",
  category:"Foundations",
  difficulty:"Professional",
  readTime:5, xp:140,
  cover:{scene:"site", role:"geotech_eng", sky:"day"},
  description:"A newly backfilled retaining wall shows a slight lean. Do you halt further backfilling?",
  start:"n1",
  nodes:{
    n1:{ scene:"site", roles:["site_engineer","geotech_eng"], sky:"day",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"Retaining wall RW-2 is backfilled to half height. Survey shows a 12mm lean at the top."},
        {who:"Geotechnical Engineer", side:"left", text:"That's more than I'd expect at this stage — let's check the drainage behind the wall."}
      ],
      learning:"Retaining wall movement during backfilling is an early indicator that must be investigated before continuing.",
      next:"n2"
    },
    n2:{ scene:"inspection", roles:["geotech_eng","site_engineer"], sky:"day",
      dialogue:[
        {who:"Geotechnical Engineer", side:"left", text:"The weep holes are blocked and backfill was compacted in layers thicker than the spec allows."},
        {who:"Site Engineer (You)", side:"right", text:"So hydrostatic pressure is building up behind the wall on top of the earth pressure."}
      ],
      learning:"Blocked drainage plus over-thick compaction lifts can cause excess pressure behind a retaining wall.",
      decision:{
        question:"Backfilling to full height is scheduled for tomorrow. Do you halt further backfill?",
        options:[
          {label:"🔴 Halt backfill, fix drainage and compaction first", type:"good", next:"n3a"},
          {label:"🟢 Continue backfilling to stay on schedule", type:"bad", next:"n3b"}
        ]
      }
    },
    n3a:{ scene:"site", roles:["geotech_eng","site_engineer"], sky:"day",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"We're halting backfill. Clear the weep holes, install a proper drainage blanket, and redo compaction in correct lifts."},
        {who:"Geotechnical Engineer", side:"left", text:"That will stabilise the wall — survey monitoring shows movement has stopped."}
      ],
      learning:"Correcting drainage and compaction method early prevents a much larger structural failure later.",
      next:"end_good"
    },
    n3b:{ scene:"site", roles:["site_engineer","project_manager"], sky:"overcast",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"Let's finish backfilling — the client wants the area cleared for handover."},
        {who:"Project Manager", side:"left", text:"Two weeks later: the wall has rotated further and cracked — we need a full remediation design."}
      ],
      learning:"Continuing backfill without fixing drainage can turn a minor lean into a full structural failure.",
      next:"end_bad"
    },
    end_good:{ ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:140,
      what:"You halted backfilling to fix blocked drainage and over-thick compaction lifts behind a leaning retaining wall.",
      correct:"Investigating the root cause of wall movement (drainage + compaction) instead of just monitoring it.",
      wrong:"Nothing — the geotechnical instinct to check drainage first was exactly right.",
      tip:"Weep holes and drainage blankets must stay clear during backfilling — always check them, not just the compaction records.",
      mistakes:"Assuming a small lean is 'within tolerance' without checking the underlying cause.",
      practice:"On real projects, inclinometers or simple survey targets monitor retaining wall movement daily during backfilling.",
      quiz:{ q:"What commonly causes excess pressure behind a retaining wall during backfilling?",
        options:["Using lighter backfill material","Blocked drainage combined with over-thick compaction lifts","Painting the wall a darker colour","Backfilling too slowly"],
        answer:1 } }
    },
    end_bad:{ ending:{ type:"contract-problem", title:"Contract Problem", stars:2, xp:25,
      what:"Backfilling continued despite blocked drainage, and the retaining wall later rotated and cracked, triggering a remediation claim.",
      correct:"Spotting the initial 12mm lean and investigating drainage was the right first step.",
      wrong:"Continuing backfill under schedule pressure without resolving the identified root cause.",
      tip:"Wall movement during construction should always pause further loading until the cause is confirmed and corrected.",
      mistakes:"Prioritising handover deadlines over addressing a known geotechnical risk indicator.",
      practice:"Retaining wall failures often lead to disputes over design vs. construction responsibility — documentation of decisions at each stage matters greatly.",
      quiz:{ q:"What commonly causes excess pressure behind a retaining wall during backfilling?",
        options:["Using lighter backfill material","Blocked drainage combined with over-thick compaction lifts","Painting the wall a darker colour","Backfilling too slowly"],
        answer:1 } }
    }
  }
},
// ------------------------------------------------------------------
{
  id:"steel-erection",
  title:"Steel Erection Day",
  category:"Steel Structures",
  difficulty:"Intermediate",
  readTime:5, xp:130,
  cover:{scene:"factory", role:"crane_operator", sky:"day"},
  description:"Wind is picking up during a heavy steel beam lift. Do you continue the lift?",
  start:"n1",
  nodes:{
    n1:{ scene:"factory", roles:["crane_operator","site_engineer"], sky:"day",
      dialogue:[
        {who:"Crane Operator", side:"left", text:"Beam's rigged and ready — 12 tonnes, lifting to the third level connection."},
        {who:"Site Engineer (You)", side:"right", text:"Let's check the wind speed reading before we start the lift."}
      ],
      learning:"Crane lifts have manufacturer wind speed limits that must be checked before every critical lift, especially for large flat components like steel beams.",
      next:"n2"
    },
    n2:{ scene:"factory", roles:["crane_operator","hse_officer"], sky:"day",
      dialogue:[
        {who:"HSE Officer", side:"right", text:"Anemometer's showing gusts up to 14 m/s, and rising. The lift plan caps at 12.5 m/s for this beam."},
        {who:"Crane Operator", side:"left", text:"We're a bit over the limit right now, but it might settle down."}
      ],
      learning:"Wind loading on a large surface-area beam can cause dangerous swing and loss of control during a lift.",
      decision:{
        question:"The steel gang is standing by and the schedule is tight. Do you proceed with the lift?",
        options:[
          {label:"🔴 Pause the lift until wind drops", type:"good", next:"n3a"},
          {label:"🟢 Proceed carefully with a taglines", type:"bad", next:"n3b"}
        ]
      }
    },
    n3a:{ scene:"factory", roles:["crane_operator","site_engineer"], sky:"sunset",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"We wait. Log the wind readings every 15 minutes until we're under the limit."},
        {who:"Crane Operator", side:"left", text:"Wind's dropped to 9 m/s now — we're clear to lift safely."}
      ],
      learning:"Waiting out unsafe wind conditions is standard practice; lift plans specify hard limits for a reason.",
      next:"end_good"
    },
    n3b:{ scene:"factory", roles:["crane_operator","worker"], sky:"day",
      dialogue:[
        {who:"Crane Operator", side:"left", text:"Beam's swinging hard, I'm losing control of the taglines!"},
        {who:"Worker", side:"right", text:"Everyone clear the drop zone now!"}
      ],
      learning:"Exceeding lift plan wind limits can cause loss of load control even with taglines in use.",
      next:"end_bad"
    },
    end_good:{ ending:{ type:"safety", title:"Zero Accident Award", stars:5, xp:130,
      what:"You paused a 12-tonne steel beam lift when wind exceeded the lift plan's limit, and resumed once conditions were safe.",
      correct:"Treating the lift plan's wind limit as a hard stop rather than a guideline to push past under schedule pressure.",
      wrong:"Nothing — this is exactly how critical lifts should be managed.",
      tip:"Large flat components like beams and panels are especially wind-sensitive due to their surface area — always check the specific lift plan limit, not a generic rule of thumb.",
      mistakes:"Assuming taglines alone can control a load that exceeds the rated wind limit for that lift.",
      practice:"Real lift plans (method statements) specify exact wind limits per load type, and site anemometers should be logged continuously during critical lifts.",
      quiz:{ q:"Why are large flat steel beams especially sensitive to wind during a crane lift?",
        options:["They are lighter than other steel members","Their large surface area increases wind force and swing risk","Wind has no effect on steel","They are always lifted indoors"],
        answer:1 } }
    },
    end_bad:{ ending:{ type:"safety-incident", title:"Safety Incident", stars:1, xp:20,
      what:"The beam lift proceeded despite wind exceeding the plan's limit, and the crane operator lost control of the load mid-lift.",
      correct:"Identifying and reading the wind limit correctly in the lift plan.",
      wrong:"Proceeding with the lift once wind speed was already confirmed above the safe limit.",
      tip:"A lift plan's wind limit is a hard engineering constraint, not a target to 'try and beat.'",
      mistakes:"Believing extra taglines or careful operation can substitute for respecting the rated wind limit.",
      practice:"Crane-related incidents are frequently linked to wind and load-swing — many contractors now require automatic lift suspension above a set wind speed.",
      quiz:{ q:"Why are large flat steel beams especially sensitive to wind during a crane lift?",
        options:["They are lighter than other steel members","Their large surface area increases wind force and swing risk","Wind has no effect on steel","They are always lifted indoors"],
        answer:1 } }
    }
  }
},
// ------------------------------------------------------------------
{
  id:"asphalt-weather",
  title:"Asphalt or Delay",
  category:"Road Construction",
  difficulty:"Beginner",
  readTime:4, xp:110,
  cover:{scene:"road", role:"highway_eng", sky:"overcast"},
  description:"Rain is forecast in an hour but the asphalt paver is already rolling. Do you continue paving?",
  start:"n1",
  nodes:{
    n1:{ scene:"road", roles:["highway_eng","site_engineer"], sky:"overcast",
      dialogue:[
        {who:"Highway Engineer", side:"left", text:"We're halfway through paving this 400m section. Forecast now says rain in about an hour."},
        {who:"Site Engineer (You)", side:"right", text:"Let's check the mix temperature and compaction progress before deciding."}
      ],
      learning:"Asphalt must be compacted while within its working temperature range, and before it gets wet.",
      next:"n2"
    },
    n2:{ scene:"road", roles:["highway_eng","qa_engineer"], sky:"overcast",
      dialogue:[
        {who:"QA/QC Engineer", side:"right", text:"Rollers are keeping pace with the paver so far, but if rain hits mid-compaction, density will suffer badly."},
        {who:"Highway Engineer", side:"left", text:"We could stop the paver now and cover the last stretch, or push through hoping the rain holds off."}
      ],
      learning:"Rain during compaction cools the asphalt too fast and traps moisture, causing poor density and premature failure.",
      decision:{
        question:"Do you stop paving now to avoid getting caught in the rain?",
        options:[
          {label:"🔴 Stop paving, cover the joint, resume later", type:"good", next:"n3a"},
          {label:"🟢 Push through to finish the section", type:"bad", next:"n3b"}
        ]
      }
    },
    n3a:{ scene:"road", roles:["highway_eng","worker"], sky:"overcast",
      dialogue:[
        {who:"Highway Engineer", side:"left", text:"Stopping here. We'll form a proper cold joint and cover it until the rain passes."},
        {who:"Worker", side:"right", text:"Rest of the section can be paved tomorrow once it's dry."}
      ],
      learning:"A well-formed cold joint is far less risky than asphalt compacted in the rain.",
      next:"end_good"
    },
    n3b:{ scene:"road", roles:["highway_eng","qa_engineer"], sky:"overcast",
      dialogue:[
        {who:"Highway Engineer", side:"left", text:"Rain just started, but the paver's still moving — let's finish this stretch."},
        {who:"QA/QC Engineer", side:"right", text:"Core samples next week show density is 6% below spec across the wet section."}
      ],
      learning:"Paving through rain compromises compaction density, leading to a section that may need to be milled and repaved.",
      next:"end_bad"
    },
    end_good:{ ending:{ type:"quality", title:"Excellent Engineer", stars:4, xp:110,
      what:"You stopped paving ahead of the rain and formed a proper cold joint instead of risking wet compaction.",
      correct:"Prioritising compaction density over finishing the section in one continuous run.",
      wrong:"Nothing significant — a short program delay is normal and expected here.",
      tip:"Track weather forecasts hourly during paving operations and always have a cold-joint plan ready.",
      mistakes:"Trying to 'race the rain' instead of accepting a planned stopping point.",
      practice:"Contractors often keep an emergency tarpaulin and joint-forming plan on hand specifically for weather interruptions during paving.",
      quiz:{ q:"Why does rain during asphalt compaction cause problems?",
        options:["It makes the asphalt too hot","It cools the mix too fast and traps moisture, reducing density","It has no effect on asphalt","It speeds up curing safely"],
        answer:1 } }
    },
    end_bad:{ ending:{ type:"quality-failure", title:"Quality Failure", stars:2, xp:25,
      what:"You continued paving into the rain, resulting in a section with density well below specification.",
      correct:"Monitoring compaction progress against the paver was the right instinct.",
      wrong:"Continuing compaction after rain started instead of stopping at a safe joint.",
      tip:"Once rain begins, stop compaction immediately rather than trying to 'finish the run.'",
      mistakes:"Underestimating how much rain affects density even during a short, final stretch.",
      practice:"Under-compacted asphalt sections are typically identified by core testing and often require milling and repaving at the contractor's cost.",
      quiz:{ q:"Why does rain during asphalt compaction cause problems?",
        options:["It makes the asphalt too hot","It cools the mix too fast and traps moisture, reducing density","It has no effect on asphalt","It speeds up curing safely"],
        answer:1 } }
    }
  }
},
// ------------------------------------------------------------------
{
  id:"bridge-bearing",
  title:"Bridge Bearing Inspection",
  category:"Bridge Construction",
  difficulty:"Professional",
  readTime:5, xp:150,
  cover:{scene:"bridge", role:"bridge_eng", sky:"dusk"},
  description:"An elastomeric bearing looks slightly misaligned before the deck segment is set down. Do you halt the lift?",
  start:"n1",
  nodes:{
    n1:{ scene:"bridge", roles:["bridge_eng","qa_engineer"], sky:"dusk",
      dialogue:[
        {who:"Bridge Engineer", side:"left", text:"Pier 4's elastomeric bearings are set. We're about to lower the precast deck segment onto them."},
        {who:"QA/QC Engineer", side:"right", text:"Wait — bearing on the north side looks slightly rotated compared to the layout drawing."}
      ],
      learning:"Bearings must be perfectly aligned before a deck segment is set, since misalignment causes uneven load distribution.",
      next:"n2"
    },
    n2:{ scene:"inspection", roles:["bridge_eng","qa_engineer"], sky:"dusk",
      dialogue:[
        {who:"Bridge Engineer", side:"left", text:"Survey confirms it: bearing is rotated about 4 degrees from the design orientation."},
        {who:"QA/QC Engineer", side:"right", text:"That's enough to cause uneven contact once the deck load comes down."}
      ],
      learning:"Even small rotational misalignment in bearings can cause point-loading and premature wear or bearing damage.",
      decision:{
        question:"The crane and segment are ready to lower right now. Do you halt the lift to fix the bearing?",
        options:[
          {label:"🔴 Halt the lift, re-align the bearing first", type:"good", next:"n3a"},
          {label:"🟢 Proceed — it's a small misalignment", type:"bad", next:"n3b"}
        ]
      }
    },
    n3a:{ scene:"bridge", roles:["bridge_eng","site_engineer"], sky:"dusk",
      dialogue:[
        {who:"Bridge Engineer", side:"left", text:"Lift is on hold. We're re-aligning the bearing plate now, should take 30 minutes."},
        {who:"Site Engineer (You)", side:"right", text:"Worth every minute — this bearing carries load for the next 50+ years."}
      ],
      learning:"Correcting bearing alignment before loading avoids a defect that would be extremely costly to fix later.",
      next:"end_good"
    },
    n3b:{ scene:"bridge", roles:["bridge_eng","qa_engineer"], sky:"dusk",
      dialogue:[
        {who:"Bridge Engineer", side:"left", text:"Lower it — 4 degrees isn't going to matter that much."},
        {who:"QA/QC Engineer", side:"right", text:"Six months later: the bearing shows uneven wear and the deck has developed a slight tilt at that pier."},
      ],
      learning:"Small bearing misalignments compound over time into visible structural issues that are very expensive to retrofit.",
      next:"end_bad"
    },
    end_good:{ ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:150,
      what:"You halted a deck segment lift to correct a 4-degree bearing misalignment before it took load.",
      correct:"Surveying the bearing precisely and treating any rotational misalignment as a hold-point before loading.",
      wrong:"Nothing — this decision protects the bridge's long-term performance.",
      tip:"Bearing alignment should be checked with survey equipment, not by eye, since even a few degrees matters under sustained load.",
      mistakes:"Assuming a 'small' misalignment doesn't matter for a component designed to perform for decades.",
      practice:"Bridge bearings are typically inspected and certified by a specialist before every deck segment is set, with survey records kept as part of the permanent project record.",
      quiz:{ q:"Why does a small rotational misalignment in a bridge bearing matter?",
        options:["It doesn't matter for elastomeric bearings","It can cause uneven point-loading and premature wear over the structure's life","It only affects the bearing's colour","It makes the bearing easier to replace"],
        answer:1 } }
    },
    end_bad:{ ending:{ type:"contract-problem", title:"Contract Problem", stars:2, xp:30,
      what:"The deck was set on a misaligned bearing, which later caused uneven wear and a visible tilt at the pier.",
      correct:"Detecting the misalignment through careful inspection before the lift.",
      wrong:"Proceeding with the lift despite a known, measured deviation from the design orientation.",
      tip:"For long-design-life elements like bearings, 'close enough' should never override a measured deviation from drawings.",
      mistakes:"Underestimating how small deviations compound under decades of live and dead load cycling.",
      practice:"Retrofit or replacement of a loaded bridge bearing is a major, costly operation often requiring the deck to be re-jacked — prevention is always cheaper.",
      quiz:{ q:"Why does a small rotational misalignment in a bridge bearing matter?",
        options:["It doesn't matter for elastomeric bearings","It can cause uneven point-loading and premature wear over the structure's life","It only affects the bearing's colour","It makes the bearing easier to replace"],
        answer:1 } }
    }
  }
},
// ------------------------------------------------------------------
{
  id:"missing-survey-point",
  title:"The Missing Survey Point",
  category:"Survey & BIM",
  difficulty:"Intermediate",
  readTime:4, xp:120,
  cover:{scene:"site", role:"surveyor", sky:"day"},
  description:"A benchmark used for foundation setout doesn't match the BIM model. Do you keep excavating?",
  start:"n1",
  nodes:{
    n1:{ scene:"site", roles:["surveyor","bim_engineer"], sky:"day",
      dialogue:[
        {who:"Surveyor", side:"left", text:"Setout for the pile caps is done, but this benchmark reads 200mm off from what's in the model."},
        {who:"BIM Engineer", side:"right", text:"That's a big enough gap to shift every pile position if we don't resolve it."}
      ],
      learning:"All setout must be verified against a confirmed, undisturbed benchmark before excavation begins.",
      next:"n2"
    },
    n2:{ scene:"office", roles:["surveyor","bim_engineer"], sky:"day",
      dialogue:[
        {who:"BIM Engineer", side:"right", text:"Checking the federated model — this benchmark was actually disturbed during earthworks last month."},
        {who:"Surveyor", side:"left", text:"So our reference point itself may be wrong, not the model."}
      ],
      learning:"A disturbed or moved benchmark can silently shift every measurement taken from it.",
      decision:{
        question:"Piling rig is due to mobilise this afternoon. Do you pause to re-establish the benchmark first?",
        options:[
          {label:"🔴 Pause piling, re-establish benchmark from a control point", type:"good", next:"n3a"},
          {label:"🟢 Proceed with current setout to keep the rig on schedule", type:"bad", next:"n3b"}
        ]
      }
    },
    n3a:{ scene:"site", roles:["surveyor","bim_engineer"], sky:"day",
      dialogue:[
        {who:"Surveyor", side:"left", text:"Re-shot everything from the primary control network. Setout is now confirmed accurate."},
        {who:"BIM Engineer", side:"right", text:"Model and site now match exactly — piling can mobilise with confidence."}
      ],
      learning:"Re-establishing setout from a verified control network prevents costly foundation position errors.",
      next:"end_good"
    },
    n3b:{ scene:"site", roles:["surveyor","project_manager"], sky:"overcast",
      dialogue:[
        {who:"Surveyor", side:"left", text:"We piled based on the questionable benchmark to keep the rig moving."},
        {who:"Project Manager", side:"left", text:"As-built survey shows the pile caps are 200mm off — we may need additional piles to correct the load path."}
      ],
      learning:"Foundation elements built on inaccurate setout are extremely costly and difficult to correct after concrete is placed.",
      next:"end_bad"
    },
    end_good:{ ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:120,
      what:"You paused piling to re-establish setout from a verified control network after discovering a disturbed benchmark.",
      correct:"Cross-checking a discrepancy against the federated BIM model instead of assuming the model was wrong.",
      wrong:"Nothing — this is exactly the right verification step before permanent works.",
      tip:"Always trace discrepancies back to a primary, undisturbed control point rather than trusting the most recent benchmark.",
      mistakes:"Assuming survey benchmarks are permanent — they can be disturbed by earthworks, traffic, or nearby excavation.",
      practice:"Projects typically maintain a primary control network in protected locations specifically so setout can always be re-verified.",
      quiz:{ q:"What is the safest way to resolve a discrepancy between a benchmark and the BIM model?",
        options:["Always trust the benchmark without question","Trace back to a verified primary control point to confirm which is correct","Split the difference between both readings","Ignore it and continue"],
        answer:1 } }
    },
    end_bad:{ ending:{ type:"budget-problem", title:"Project Delay", stars:2, xp:30,
      what:"Piling proceeded on a disturbed benchmark, and as-built survey later showed the pile caps were 200mm off design position.",
      correct:"Identifying the initial discrepancy between the benchmark and the model.",
      wrong:"Proceeding with a known, unresolved survey discrepancy to keep equipment on schedule.",
      tip:"A 200mm error at setout stage becomes an expensive structural correction once concrete is placed.",
      mistakes:"Treating survey verification as a formality rather than a hard prerequisite for permanent works.",
      practice:"Foundation position errors often require additional piles, pile cap redesign, or load-path re-analysis — all significantly more costly than a survey delay.",
      quiz:{ q:"What is the safest way to resolve a discrepancy between a benchmark and the BIM model?",
        options:["Always trust the benchmark without question","Trace back to a verified primary control point to confirm which is correct","Split the difference between both readings","Ignore it and continue"],
        answer:1 } }
    }
  }
},
// ------------------------------------------------------------------
{
  id:"tender-trap",
  title:"Tender Trap",
  category:"Procurement & Contracts",
  difficulty:"Professional",
  readTime:5, xp:140,
  cover:{scene:"office", role:"procurement_eng", sky:"day"},
  description:"The lowest bidder's price seems too good to be true. Do you recommend awarding the contract to them?",
  start:"n1",
  nodes:{
    n1:{ scene:"office", roles:["procurement_eng","qs"], sky:"day",
      dialogue:[
        {who:"Procurement Engineer", side:"left", text:"Three bids for the MEP package. Bidder C is 30% below the other two and the engineer's estimate."},
        {who:"Quantity Surveyor", side:"right", text:"That's a big enough gap that we need to check their pricing breakdown carefully."}
      ],
      learning:"An unusually low bid should trigger a detailed commercial and technical review before being accepted at face value.",
      next:"n2"
    },
    n2:{ scene:"meeting", roles:["procurement_eng","qs"], sky:"day",
      dialogue:[
        {who:"Quantity Surveyor", side:"right", text:"Their breakdown is missing testing & commissioning costs and has unrealistically low labour rates."},
        {who:"Procurement Engineer", side:"left", text:"That could mean scope gaps, or a bid built to win first and claim variations later."}
      ],
      learning:"Missing scope items or unrealistic rates in a low bid are common red flags for future claims and disputes.",
      decision:{
        question:"The PM wants to award quickly to lock in project budget savings. Do you recommend awarding to Bidder C?",
        options:[
          {label:"🔴 Request bid clarification before recommending an award", type:"good", next:"n3a"},
          {label:"🟢 Recommend awarding to Bidder C for the savings", type:"bad", next:"n3b"}
        ]
      }
    },
    n3a:{ scene:"meeting", roles:["procurement_eng","project_manager"], sky:"day",
      dialogue:[
        {who:"Procurement Engineer", side:"left", text:"We sent a formal clarification request — Bidder C confirmed they'd missed commissioning costs entirely."},
        {who:"Project Manager", side:"left", text:"Good thing we caught that before award — updated price is now much closer to the other bids."}
      ],
      learning:"Formal bid clarification protects the project from awarding a contract based on an incomplete scope.",
      next:"end_good"
    },
    n3b:{ scene:"office", roles:["procurement_eng","project_manager"], sky:"overcast",
      dialogue:[
        {who:"Procurement Engineer", side:"left", text:"We awarded to Bidder C to save on budget."},
        {who:"Project Manager", side:"left", text:"Three months in, they've submitted variation claims for commissioning and testing that weren't in their price."}
      ],
      learning:"Awarding a contract with an incomplete scope often leads to variation claims that erase the apparent savings.",
      next:"end_bad"
    },
    end_good:{ ending:{ type:"budget", title:"Budget Saved", stars:5, xp:140,
      what:"You requested formal bid clarification on an unusually low bid before recommending contract award.",
      correct:"Treating a large pricing gap as a signal to investigate scope completeness, not just a discount to celebrate.",
      wrong:"Nothing — thorough bid evaluation is standard commercial practice.",
      tip:"Always compare a low bid's cost breakdown item-by-item against the engineer's estimate to spot missing scope.",
      mistakes:"Assuming a low price is automatically good value without checking what's actually included.",
      practice:"Formal Requests for Clarification (RFCs) during tender evaluation are standard practice precisely to catch scope gaps before contract signature.",
      quiz:{ q:"What is a common red flag in an unusually low bid?",
        options:["A detailed cost breakdown","Missing scope items like testing and commissioning","A bid bond included","A realistic programme"],
        answer:1 } }
    },
    end_bad:{ ending:{ type:"contract-problem", title:"Contract Problem", stars:2, xp:30,
      what:"The contract was awarded to the lowest bidder without resolving a missing-scope red flag, leading to variation claims later.",
      correct:"Identifying the pricing gap and missing items during the initial review.",
      wrong:"Recommending award before resolving the identified scope gap through formal clarification.",
      tip:"A price that looks 'too good to be true' at tender stage often becomes a variation claim during construction.",
      mistakes:"Prioritising apparent budget savings over verifying whether the full scope was actually priced.",
      practice:"Poorly scoped low bids are one of the most common sources of contract disputes and variation claims on real projects.",
      quiz:{ q:"What is a common red flag in an unusually low bid?",
        options:["A detailed cost breakdown","Missing scope items like testing and commissioning","A bid bond included","A realistic programme"],
        answer:1 } }
    }
  }
}
];
