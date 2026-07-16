/* ============================================================
   IndustrCons — Story Data v2
   Each story is a decision-diamond: two decision points, four
   distinct endings, up to 5 pages per playthrough.
   ============================================================ */

const CATEGORIES = ["Concrete","Rebar","Formwork","Excavation","Foundations","Steel Structures","Road Construction","Bridge Construction","Survey & BIM","Procurement & Contracts"];

const STORIES = [
// ==================================================================================
// 1. CONCRETE
// ==================================================================================
{
  id:"concrete-slump",
  title:"The Slump Test Standoff",
  category:"Concrete",
  difficulty:"Beginner",
  readTime:6, xp:160,
  cover:{scene:"site", role:"concrete_insp", sky:"day"},
  description:"A ready-mix truck just arrived and the slump test is borderline. Every choice from here reshapes the raft slab's future.",
  start:"n1",
  nodes:{
    n1:{ scene:"site", roles:["concrete_insp","site_engineer"], sky:"day",
      dialogue:[
        {who:"Concrete Inspector", side:"left", text:"Truck's here for the raft slab. Slump test just came back at 180mm — spec calls for 150±25."},
        {who:"Site Engineer (You)", side:"right", text:"That's outside tolerance. Let's check the batching ticket and delivery time before anything else."}
      ],
      learning:"Concrete must be tested for slump on every truck before placement begins.",
      next:"n2"
    },
    n2:{ scene:"site", roles:["concrete_insp","site_engineer"], sky:"day",
      dialogue:[
        {who:"Concrete Inspector", side:"left", text:"Batching plant admits they added extra water on site to 'help pumpability.'"},
        {who:"Site Engineer (You)", side:"right", text:"Adding water on site raises the water-cement ratio and weakens the mix."}
      ],
      learning:"Water added after batching increases w/c ratio and reduces strength — it must be logged and controlled.",
      decision:{ question:"The driver wants to pour now before the concrete sets in the drum. Do you approve this load?",
        options:[ {label:"🔴 Reject the load", type:"good", next:"n3a"}, {label:"🟢 Approve — it's close enough", type:"bad", next:"n3b"} ] }
    },
    n3a:{ scene:"site", roles:["concrete_insp","hse_officer"], sky:"sunset",
      dialogue:[
        {who:"Concrete Inspector", side:"left", text:"Load rejected and logged. But the replacement truck is 3 hours out, and this raft needs one continuous pour."},
        {who:"HSE Officer", side:"right", text:"If we split the pour, we risk a cold joint right through the slab's load path."}
      ],
      learning:"Large raft foundations usually require a continuous pour to avoid cold joints creating structural weak planes.",
      decision:{ question:"Replacement concrete will only arrive after dark. Do you organize a supervised night pour with lighting and full QA, or rush today's crew through the last light without the extra checks?",
        options:[ {label:"🟢 Organize a proper night pour with lighting & QA", type:"good", next:"n4gg"}, {label:"🔴 Rush it in fading light, skip the extra checks", type:"bad", next:"n4gb"} ] }
    },
    n3b:{ scene:"building", roles:["site_engineer","qa_engineer"], sky:"overcast",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"We poured it. Two days later, hairline cracks are showing on the slab surface as it cures."},
        {who:"QA/QC Engineer", side:"right", text:"That's consistent with a high water-cement ratio. We should decide how to handle this now."}
      ],
      learning:"Excess water often shows up later as plastic shrinkage cracking and reduced strength gain during curing.",
      decision:{ question:"Do you report the cracking immediately for core testing, or stay quiet and hope it cures out fine?",
        options:[ {label:"🟢 Report immediately, order core tests", type:"good", next:"n4bg"}, {label:"🔴 Stay quiet, hope it's just surface cracking", type:"bad", next:"n4bb"} ] }
    },
    n4gg:{ scene:"site", roles:["site_engineer","worker"], sky:"night",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"Floodlights rigged, extra QA on standby. The pour finished clean at 11pm with zero cold joints."},
        {who:"Worker", side:"right", text:"Core samples next week come back at 105% of design strength."}
      ],
      learning:"A well-managed night pour with proper lighting and QA is a normal, safe solution to a delivery delay.",
      next:"end_gg"
    },
    n4gb:{ scene:"site", roles:["worker","qa_engineer"], sky:"dusk",
      dialogue:[
        {who:"Worker", side:"right", text:"We rushed the finish before dark — trowel marks are rough and the joint wasn't fully vibrated."},
        {who:"QA/QC Engineer", side:"right", text:"Surface finish fails the spec, and there's a visible cold joint we'll need to treat."}
      ],
      learning:"Rushing the final stage of a pour to beat the light often trades one risk (waiting) for another (poor finish/joints).",
      next:"end_gb"
    },
    n4bg:{ scene:"inspection", roles:["qa_engineer","project_manager"], sky:"day",
      dialogue:[
        {who:"QA/QC Engineer", side:"right", text:"Core tests confirm strength is 12% under design. We caught it early enough for epoxy injection and load testing."},
        {who:"Project Manager", side:"left", text:"Costs us a week and some budget, but the slab is certified safe to proceed."}
      ],
      learning:"Early detection of a quality issue keeps remediation options open — repair is possible before more load is added.",
      next:"end_bg"
    },
    n4bb:{ scene:"office", roles:["project_manager","client"], sky:"overcast",
      dialogue:[
        {who:"Project Manager", side:"left", text:"Three months later, at final handover, the client's own inspector core-tested the slab independently."},
        {who:"Client", side:"right", text:"This raft is 22% under design strength. We need a full structural review before I'll accept this building."}
      ],
      learning:"Undisclosed quality issues discovered by the client instead of the contractor severely damage trust and contract terms.",
      next:"end_bb"
    },
    end_gg:{ ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:160,
      what:"You rejected an out-of-spec load and then organized a safe, supervised night pour instead of risking a cold joint.",
      correct:"Treating slump tolerance as a hard gate, and treating the raft's continuity requirement as equally non-negotiable.",
      wrong:"Nothing — this is the standard-setting way to resolve a delivery delay on a continuous pour.",
      tip:"When a critical pour is threatened by delay, a well-lit, well-staffed night pour is often safer than splitting the pour or rushing it.",
      mistakes:"Assuming any pour outside normal hours is automatically riskier — it's the planning and lighting that matter, not the clock.",
      practice:"Large raft and mat foundations are frequently poured continuously through the night specifically to avoid cold joints.",
      quiz:{ q:"Why do large raft foundations usually need a continuous pour?",
        options:["To save money on formwork","To avoid a cold joint that would create a structural weak plane","Because concrete cures faster in one go","It has no real technical reason"], answer:1 } },
    },
    end_gb:{ ending:{ type:"client-satisfaction", title:"Client Satisfaction", stars:3, xp:70,
      what:"You correctly rejected the bad load, but then rushed the replacement pour to beat the light and ended up with a rough finish and an untreated cold joint.",
      correct:"Rejecting the original out-of-spec concrete was the right call.",
      wrong:"Rushing the finishing and vibration steps just to avoid waiting for proper lighting.",
      tip:"A pour delay is recoverable; a poorly vibrated joint or rushed finish creates a permanent defect that needs treatment.",
      mistakes:"Treating 'we're already this far behind' as a reason to cut corners on the very last stage of the work.",
      practice:"Contractors often keep portable lighting towers on standby specifically so a late pour is never rushed in fading light.",
      quiz:{ q:"Why do large raft foundations usually need a continuous pour?",
        options:["To save money on formwork","To avoid a cold joint that would create a structural weak plane","Because concrete cures faster in one go","It has no real technical reason"], answer:1 } },
    },
    end_bg:{ ending:{ type:"project-delay", title:"Project Delay", stars:2, xp:60,
      what:"You approved the out-of-spec concrete, but reported the resulting cracking immediately, allowing repair before it became critical.",
      correct:"Reporting the defect the moment it appeared, instead of waiting to see if it 'cured out.'",
      wrong:"Approving the load with excess site-added water in the first place, under time pressure.",
      tip:"Early honesty about a quality issue is what keeps a mistake a 'delay' instead of a 'failure.'",
      mistakes:"Believing driver or schedule pressure justifies skipping the slump/water check on delivery.",
      practice:"Non-conformance reports (NCRs) filed early usually lead to a repair plan; ones discovered later usually lead to disputes.",
      quiz:{ q:"Why do large raft foundations usually need a continuous pour?",
        options:["To save money on formwork","To avoid a cold joint that would create a structural weak plane","Because concrete cures faster in one go","It has no real technical reason"], answer:1 } },
    },
    end_bb:{ ending:{ type:"contract-problem", title:"Contract Problem", stars:1, xp:25,
      what:"You approved bad concrete and then stayed quiet about the cracking — the client's own inspector found the strength deficiency at handover.",
      correct:"Nothing in this path — every decision point chose short-term convenience over verification.",
      wrong:"Both approving out-of-spec concrete and then concealing early evidence that something was wrong.",
      tip:"A defect the client discovers independently costs far more in trust, legal exposure, and remedial scope than one you disclose yourself.",
      mistakes:"Assuming a hairline crack that 'might be fine' isn't worth reporting — it usually is worth a five-minute core test.",
      practice:"Structural deficiencies found at handover frequently trigger full independent audits, withheld payments, and contract disputes.",
      quiz:{ q:"Why do large raft foundations usually need a continuous pour?",
        options:["To save money on formwork","To avoid a cold joint that would create a structural weak plane","Because concrete cures faster in one go","It has no real technical reason"], answer:1 } },
    }
  }
},
// ==================================================================================
// 2. REBAR
// ==================================================================================
{
  id:"rebar-spacing",
  title:"Rebar Spacing Crisis",
  category:"Rebar",
  difficulty:"Beginner",
  readTime:6, xp:150,
  cover:{scene:"building", role:"rebar_eng", sky:"day"},
  description:"The rebar cage for a column looks tighter than the drawing. What you do next decides whether this column ever matches its design.",
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
      decision:{ question:"Formwork is scheduled to close in 2 hours. What do you do?",
        options:[ {label:"🔴 Hold the pour, request re-fixing", type:"good", next:"n3a"}, {label:"🟢 Let it go, close the formwork on schedule", type:"bad", next:"n3b"} ] }
    },
    n3a:{ scene:"building", roles:["rebar_eng","site_engineer"], sky:"day",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"Rebar gang is re-spacing the cage, but they've found two laps shorter than the required 40 bar-diameters too."},
        {who:"Rebar Engineer", side:"left", text:"Those laps need extra bar length spliced in, not just re-tying."}
      ],
      learning:"Lap length deficiencies are a separate defect from spacing and need their own correction — splicing in extra bar length.",
      decision:{ question:"Do you get the structural engineer to confirm the lap-splice fix in writing, or let the rebar foreman fix it on his own judgement to save time?",
        options:[ {label:"🟢 Get written confirmation from the structural engineer", type:"good", next:"n4gg"}, {label:"🔴 Let the foreman fix it on his own judgement", type:"bad", next:"n4gb"} ] }
    },
    n3b:{ scene:"building", roles:["site_engineer","qa_engineer"], sky:"overcast",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"Formwork closed on schedule. A week later, the structural engineer's site visit flags the spacing during a routine check."},
        {who:"QA/QC Engineer", side:"right", text:"He's asking for the pour record and wants to know why this wasn't caught before closure."}
      ],
      learning:"Undocumented rebar deviations discovered after concrete is placed are far harder and costlier to resolve.",
      decision:{ question:"Do you disclose the full inspection record and spacing measurement now, or downplay it as a 'minor variance'?",
        options:[ {label:"🟢 Disclose the full inspection record now", type:"good", next:"n4bg"}, {label:"🔴 Downplay it as a minor variance", type:"bad", next:"n4bb"} ] }
    },
    n4gg:{ scene:"office", roles:["rebar_eng","qa_engineer"], sky:"day",
      dialogue:[
        {who:"Rebar Engineer", side:"left", text:"Structural engineer approved the splice detail in writing. Cage re-fixed and re-inspected — matches drawing exactly."},
        {who:"QA/QC Engineer", side:"right", text:"Pour proceeds today with full confidence in the load path."}
      ],
      learning:"Getting a structural engineer's written sign-off on any reinforcement fix protects everyone if questions arise later.",
      next:"end_gg"
    },
    n4gb:{ scene:"building", roles:["rebar_eng","worker"], sky:"day",
      dialogue:[
        {who:"Rebar Engineer", side:"left", text:"Foreman spliced the laps by eye without checking the exact diameter multiplier."},
        {who:"Worker", side:"right", text:"Post-pour survey shows one splice is 15% short of the required length."}
      ],
      learning:"Lap lengths are calculated from bar diameter and concrete grade — 'by eye' fixes often miss the exact code requirement.",
      next:"end_gb"
    },
    n4bg:{ scene:"meeting", roles:["site_engineer","project_manager"], sky:"day",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"We handed over the full inspection record. The structural engineer designed a bolted plate retrofit for the deficient column."},
        {who:"Project Manager", side:"left", text:"It costs us four days and a fabrication order, but the fix is engineered and certified."}
      ],
      learning:"Full disclosure lets the structural engineer design a proper, certified retrofit instead of guessing at a fix.",
      next:"end_bg"
    },
    n4bb:{ scene:"office", roles:["project_manager","client"], sky:"overcast",
      dialogue:[
        {who:"Project Manager", side:"left", text:"We told the engineer it was a minor variance. He ordered an independent audit anyway."},
        {who:"Client", side:"right", text:"The audit found three more columns with the same issue that were never reported. We're pausing all pours pending a full review."}
      ],
      learning:"Downplaying a known defect often triggers a much broader audit that uncovers more problems than the original one.",
      next:"end_bb"
    },
    end_gg:{ ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:150,
      what:"You held the pour, fixed both the spacing and a hidden lap-length deficiency, and got the structural engineer's written sign-off before proceeding.",
      correct:"Treating every reinforcement deviation — spacing and lap length alike — as a hold-point requiring formal confirmation.",
      wrong:"Nothing — this is the complete, correct process for a reinforcement non-conformance.",
      tip:"Always double-check lap lengths against bar diameter and concrete grade; a spacing fix can reveal a second defect nearby.",
      mistakes:"Assuming that fixing the obvious problem (spacing) fixed everything, without re-checking laps and cover too.",
      practice:"A rebar inspection checklist (bar size, spacing, cover, laps, ties) signed off before every pour catches these issues together.",
      quiz:{ q:"Why does wider rebar spacing than designed matter structurally?",
        options:["It only affects appearance","It reduces the reinforcement ratio and load capacity","It makes concrete cure faster","It has no real effect"], answer:1 } },
    },
    end_gb:{ ending:{ type:"project-delay", title:"Project Delay", stars:3, xp:65,
      what:"You correctly held the pour for spacing, but let the foreman fix a lap-length issue by eye, leaving one splice short of code.",
      correct:"Catching and holding the pour for the spacing defect in the first place.",
      wrong:"Skipping structural engineer sign-off on the lap-splice repair to save time.",
      tip:"Lap length is a calculation (bar diameter × code multiplier), not a visual judgement call — always verify it on paper.",
      mistakes:"Treating a rebar 'fix' as automatically correct just because it was performed by an experienced foreman.",
      practice:"Reinforcement repairs of any kind should be checked against the specific code clause for lap length before cover-up.",
      quiz:{ q:"Why does wider rebar spacing than designed matter structurally?",
        options:["It only affects appearance","It reduces the reinforcement ratio and load capacity","It makes concrete cure faster","It has no real effect"], answer:1 } },
    },
    end_bg:{ ending:{ type:"budget-problem", title:"Project Delay", stars:2, xp:55,
      what:"You let the formwork close over an under-spaced cage, but disclosed the full record once flagged, allowing a certified retrofit.",
      correct:"Full disclosure once the issue was identified by the structural engineer's visit.",
      wrong:"Letting the formwork close in the first place despite already knowing the spacing was wrong.",
      tip:"A retrofit designed by the structural engineer with full information is always safer than concealing the original defect.",
      mistakes:"Prioritizing the formwork schedule over a known, measured reinforcement non-conformance.",
      practice:"Bolted plate or jacket retrofits are a common certified solution for under-reinforced columns discovered after pour.",
      quiz:{ q:"Why does wider rebar spacing than designed matter structurally?",
        options:["It only affects appearance","It reduces the reinforcement ratio and load capacity","It makes concrete cure faster","It has no real effect"], answer:1 } },
    },
    end_bb:{ ending:{ type:"contract-problem", title:"Contract Problem", stars:1, xp:20,
      what:"You let the pour proceed and then downplayed the defect, triggering an independent audit that found several more undisclosed issues.",
      correct:"Nothing in this path — every decision favored convenience over disclosure.",
      wrong:"Both allowing the original defect through and minimizing it once discovered.",
      tip:"Minimizing a known defect to an inspecting engineer almost always backfires into a wider, more disruptive investigation.",
      mistakes:"Believing a single 'minor variance' framing would prevent further scrutiny of the rest of the structure.",
      practice:"Once trust in a contractor's self-reporting breaks down, engineers typically move to 100% independent inspection — far slower and costlier than routine spot checks.",
      quiz:{ q:"Why does wider rebar spacing than designed matter structurally?",
        options:["It only affects appearance","It reduces the reinforcement ratio and load capacity","It makes concrete cure faster","It has no real effect"], answer:1 } },
    }
  }
},
// ==================================================================================
// 3. FORMWORK
// ==================================================================================
{
  id:"formwork-deadline",
  title:"Formwork Deadline",
  category:"Formwork",
  difficulty:"Intermediate",
  readTime:6, xp:170,
  cover:{scene:"building", role:"formwork_eng", sky:"sunset"},
  description:"A formwork prop is missing a locking pin under deadline pressure. What you decide next — twice — determines who goes home safe tonight.",
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
      decision:{ question:"The pour is scheduled to start in 15 minutes and the crew is already positioned. Do you pause for the fix?",
        options:[ {label:"🔴 Stop and fix the prop first", type:"good", next:"n3a"}, {label:"🟢 Proceed, fix it after the pour starts", type:"bad", next:"n3b"} ] }
    },
    n3a:{ scene:"building", roles:["formwork_eng","worker"], sky:"dusk",
      dialogue:[
        {who:"Formwork Engineer", side:"left", text:"Pin fitted. But while re-checking, the crew also finds a second bay with props resting on soft, uncompacted ground."},
        {who:"Worker", side:"right", text:"Ground's been soaked from yesterday's rain — could be settling under load."}
      ],
      learning:"Prop foundations need firm, level bearing — soft or saturated ground can let a prop sink under load even if the prop itself is fine.",
      decision:{ question:"Do you also add sole boards and re-level the second bay before pouring, or accept it since the props 'look' stable?",
        options:[ {label:"🟢 Add sole boards and re-level before pouring", type:"good", next:"n4gg"}, {label:"🔴 Accept it since props look stable", type:"bad", next:"n4gb"} ] }
    },
    n3b:{ scene:"building", roles:["worker","hse_officer"], sky:"dusk",
      dialogue:[
        {who:"Construction Worker", side:"right", text:"Pump's running... bay 4 is starting to sag slightly around the unpinned prop!"},
        {who:"HSE Officer", side:"right", text:"We need a call right now — evacuate or try to save the pour?"}
      ],
      learning:"Once a formwork defect starts to show under load, immediate action is far safer than waiting to see if it worsens.",
      decision:{ question:"Do you sound the evacuation alarm and stop the pour immediately, or try to quickly prop the sagging area while the pump keeps running?",
        options:[ {label:"🟢 Evacuate and stop the pour immediately", type:"good", next:"n4bg"}, {label:"🔴 Try to prop it while the pump keeps running", type:"bad", next:"n4bb"} ] }
    },
    n4gg:{ scene:"building", roles:["formwork_eng","hse_officer"], sky:"night",
      dialogue:[
        {who:"Formwork Engineer", side:"left", text:"Sole boards placed, both bays re-leveled and signed off by HSE. Pour proceeds clean with zero movement recorded."},
        {who:"HSE Officer", side:"right", text:"Best falsework inspection I've seen this month — nothing left to chance."}
      ],
      learning:"Checking beyond the single reported defect for similar hidden risks is what separates good inspection from adequate inspection.",
      next:"end_gg"
    },
    n4gb:{ scene:"building", roles:["formwork_eng","worker"], sky:"night",
      dialogue:[
        {who:"Formwork Engineer", side:"left", text:"We poured bay 2 without re-leveling. Overnight, survey shows 8mm of prop settlement under the wet slab."},
        {who:"Worker", side:"right", text:"Nothing collapsed, but the slab now has a slight dip that needs a levelling screed to fix."}
      ],
      learning:"Even when a prop doesn't fail outright, settlement into soft ground can leave a permanent, correctable defect in the finished slab.",
      next:"end_gb"
    },
    n4bg:{ scene:"building", roles:["hse_officer","worker"], sky:"night",
      dialogue:[
        {who:"HSE Officer", side:"right", text:"Alarm sounded, crew clear in under a minute. Pump stopped, and we lost the partial pour, but nobody was near bay 4 when the prop gave way fully."},
        {who:"Worker", side:"right", text:"We'll break out the partial pour and re-do the shoring properly tomorrow."}
      ],
      learning:"Stopping a pour the moment a defect appears can mean losing some material, but it reliably prevents injury.",
      next:"end_bg"
    },
    n4bb:{ scene:"building", roles:["worker","hse_officer"], sky:"night",
      dialogue:[
        {who:"Worker", side:"right", text:"We tried to wedge in a spare prop while the pump kept going — the whole bay gave way seconds later!"},
        {who:"HSE Officer", side:"right", text:"Two workers caught in the collapse zone. Emergency response is on site now."}
      ],
      learning:"Attempting a live fix under a running pour multiplies the risk instead of reducing it — the load never stops increasing.",
      next:"end_bb"
    },
    end_gg:{ ending:{ type:"safety", title:"Zero Accident Award", stars:5, xp:170,
      what:"You fixed the missing pin, then also caught and corrected a second hidden risk — props on soft ground — before pouring either bay.",
      correct:"Treating the reported defect as a reason to re-check the whole formwork system, not just the one prop.",
      wrong:"Nothing — this is best-practice falsework inspection.",
      tip:"A pre-pour formwork checklist should include ground bearing conditions for every prop, not just the props' own hardware.",
      mistakes:"Assuming that fixing the one reported issue means the rest of the formwork is automatically fine.",
      practice:"Many contractors require a signed falsework certificate from a competent person confirming ground conditions as well as hardware before every pour.",
      quiz:{ q:"Why is formwork especially at risk right when concrete is poured?",
        options:["Wet concrete is lighter than cured concrete","Wet concrete applies its full hydrostatic and weight load before it gains strength","Formwork only matters after curing","Pouring reduces the load on props"], answer:1 } },
    },
    end_gb:{ ending:{ type:"project-delay", title:"Project Delay", stars:3, xp:75,
      what:"You properly fixed the reported pin issue, but accepted a second bay on soft ground, which settled slightly under the wet slab.",
      correct:"The original pin fix and pause-to-check response were correct.",
      wrong:"Accepting a visual 'looks stable' judgement instead of checking the ground bearing conditions.",
      tip:"Firm, level, and adequately sized sole boards under every prop matter as much as the prop hardware itself.",
      mistakes:"Trusting appearance over a proper check when ground has been recently saturated by rain.",
      practice:"A settled slab typically needs a levelling screed — an avoidable extra cost compared to a five-minute sole board check.",
      quiz:{ q:"Why is formwork especially at risk right when concrete is poured?",
        options:["Wet concrete is lighter than cured concrete","Wet concrete applies its full hydrostatic and weight load before it gains strength","Formwork only matters after curing","Pouring reduces the load on props"], answer:1 } },
    },
    end_bg:{ ending:{ type:"project-delay", title:"Project Delay", stars:2, xp:60,
      what:"The unpinned prop began to fail mid-pour, but you evacuated immediately and stopped the pour before anyone was hurt.",
      correct:"Reacting decisively the moment the defect became visible under load, prioritizing evacuation over saving material.",
      wrong:"Proceeding with the pour originally despite the known missing pin.",
      tip:"A partial pour can be broken out and redone; an injury cannot be undone — always choose evacuation first.",
      mistakes:"Waiting until the deadline pressure forced the original decision to skip the fix.",
      practice:"Formwork failures are far more survivable when crews are trained to stop and clear immediately rather than 'wait and see.'",
      quiz:{ q:"Why is formwork especially at risk right when concrete is poured?",
        options:["Wet concrete is lighter than cured concrete","Wet concrete applies its full hydrostatic and weight load before it gains strength","Formwork only matters after curing","Pouring reduces the load on props"], answer:1 } },
    },
    end_bb:{ ending:{ type:"safety-incident", title:"Safety Incident", stars:1, xp:20,
      what:"The pour proceeded despite the missing pin, and a live attempt to fix the sagging bay led to a full formwork collapse with workers caught inside.",
      correct:"Nothing in this path — every decision chose to keep the pour running over stopping for safety.",
      wrong:"Both proceeding with a known defect and then attempting a live repair under load instead of stopping.",
      tip:"Never attempt to fix a failing temporary structure while it's still under active load — stop the load first, always.",
      mistakes:"Believing a quick fix mid-pour is faster than a full stop — it is almost always far more dangerous.",
      practice:"Formwork collapse is one of the leading causes of serious injury in construction; stop-work authority exists precisely for moments like this.",
      quiz:{ q:"Why is formwork especially at risk right when concrete is poured?",
        options:["Wet concrete is lighter than cured concrete","Wet concrete applies its full hydrostatic and weight load before it gains strength","Formwork only matters after curing","Pouring reduces the load on props"], answer:1 } },
    }
  }
},
// ==================================================================================
// 4. EXCAVATION
// ==================================================================================
{
  id:"deep-excavation",
  title:"Deep Excavation Risk",
  category:"Excavation",
  difficulty:"Intermediate",
  readTime:6, xp:170,
  cover:{scene:"site", role:"geotech_eng", sky:"overcast"},
  description:"Overnight rain has soaked a 4m trench. Two decisions stand between the pipe crew and a collapse.",
  start:"n1",
  nodes:{
    n1:{ scene:"site", roles:["geotech_eng","hse_officer"], sky:"overcast", weather:"rain",
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
      decision:{ question:"The pipe-laying crew is ready to enter the trench. Do you allow entry?",
        options:[ {label:"🔴 No entry — re-inspect and improve shoring first", type:"good", next:"n3a"}, {label:"🟢 Allow entry, work carefully", type:"bad", next:"n3b"} ] }
    },
    n3a:{ scene:"site", roles:["geotech_eng","worker"], sky:"overcast",
      dialogue:[
        {who:"Geotechnical Engineer", side:"left", text:"We're pumping out standing water and adding hydraulic shoring. But the client's rep is asking why the pipe crew is idle."},
        {who:"HSE Officer", side:"right", text:"We can explain the ground conditions, or just tell them it'll be a short delay without details."}
      ],
      learning:"Clear communication about ground-safety holds protects the schedule conversation as much as it protects the crew.",
      decision:{ question:"Do you fully explain the geotechnical risk to the client's rep, or just say it's 'a short delay' without details?",
        options:[ {label:"🟢 Fully explain the geotechnical risk", type:"good", next:"n4gg"}, {label:"🔴 Just say it's a short delay, no details", type:"bad", next:"n4gb"} ] }
    },
    n3b:{ scene:"site", roles:["worker","hse_officer"], sky:"overcast",
      dialogue:[
        {who:"Worker", side:"right", text:"We're in the trench laying pipe... I can hear a trickle of soil falling from the north wall!"},
        {who:"HSE Officer", side:"right", text:"That's an active warning sign — we need to decide right now."}
      ],
      learning:"Falling soil or trickling debris from a trench wall is an immediate precursor to collapse, not a background nuisance.",
      decision:{ question:"Do you call an immediate evacuation, or tell the crew to just move to the other end of the trench and keep working?",
        options:[ {label:"🟢 Call immediate evacuation", type:"good", next:"n4bg"}, {label:"🔴 Move crew to the other end, keep working", type:"bad", next:"n4bb"} ] }
    },
    n4gg:{ scene:"site", roles:["geotech_eng","project_manager"], sky:"day",
      dialogue:[
        {who:"Geotechnical Engineer", side:"left", text:"Client's rep appreciated the full explanation and even asked to see the shoring calculations."},
        {who:"Project Manager", side:"left", text:"Trust earned — and the pipe crew enters safely a few hours later with everyone's confidence intact."}
      ],
      learning:"Transparency about safety-driven delays tends to build long-term trust rather than damage the relationship.",
      next:"end_gg"
    },
    n4gb:{ scene:"site", roles:["project_manager","hse_officer"], sky:"overcast",
      dialogue:[
        {who:"Project Manager", side:"left", text:"The client's rep felt kept in the dark and escalated to head office, assuming we were hiding a bigger problem."},
        {who:"HSE Officer", side:"right", text:"We're safe, but now we're also fielding a difficult client call about 'lack of transparency.'"}
      ],
      learning:"Vague explanations for a safety hold can create unnecessary mistrust even when the underlying decision was correct.",
      next:"end_gb"
    },
    n4bg:{ scene:"site", roles:["worker","hse_officer"], sky:"overcast",
      dialogue:[
        {who:"HSE Officer", side:"right", text:"Evacuation was immediate. Thirty seconds later, a section of the north wall sloughed into the empty trench."},
        {who:"Worker", side:"right", text:"Nobody was in there. We'll re-shore properly before anyone goes back down."}
      ],
      learning:"Acting on an active warning sign immediately, rather than debating it, is what keeps a near-miss from becoming an incident.",
      next:"end_bg"
    },
    n4bb:{ scene:"site", roles:["worker","hse_officer"], sky:"overcast",
      dialogue:[
        {who:"Worker", side:"right", text:"We moved down the trench... the wall gave way right where we'd just been standing!"},
        {who:"HSE Officer", side:"right", text:"One worker is partially buried — calling emergency services now!"}
      ],
      learning:"Relocating within an unstable excavation doesn't remove the hazard — the whole trench was compromised by the saturation.",
      next:"end_bb"
    },
    end_gg:{ ending:{ type:"safety", title:"Zero Accident Award", stars:5, xp:170,
      what:"You held entry until shoring was corrected, and openly explained the ground risk to the client, earning their trust instead of their frustration.",
      correct:"Both stopping entry for a genuine hazard and being transparent about why.",
      wrong:"Nothing — this is exactly how a safety hold should be managed and communicated.",
      tip:"When explaining a safety-driven delay, sharing the actual technical reason usually builds more confidence than a vague excuse.",
      mistakes:"Assuming clients only care about schedule and don't want to hear the technical detail behind a hold.",
      practice:"A 'competent person' must inspect excavations daily and after events like rain, and clear communication of findings is part of that responsibility.",
      quiz:{ q:"What is a key warning sign that a trench wall may be about to collapse?",
        options:["The trench smells like wet soil","Cracking at the crest, wall slumping, or trickling soil","The trench is deeper than 1 metre","Workers are wearing high-vis vests"], answer:1 } },
    },
    end_gb:{ ending:{ type:"client-satisfaction", title:"Client Satisfaction", stars:3, xp:80,
      what:"You correctly held entry to fix the shoring, but gave the client's rep only a vague explanation, which led to an escalated, awkward call later.",
      correct:"Making the right safety call to delay entry until the trench was properly re-shored.",
      wrong:"Withholding the technical explanation for the delay from the client's representative.",
      tip:"A five-minute technical explanation is almost always cheaper than an escalated trust conversation with head office.",
      mistakes:"Assuming clients don't need or want the reasoning behind a safety decision.",
      practice:"Many contractors keep a simple one-page 'reason for hold' briefing ready for client reps during any safety-driven pause.",
      quiz:{ q:"What is a key warning sign that a trench wall may be about to collapse?",
        options:["The trench smells like wet soil","Cracking at the crest, wall slumping, or trickling soil","The trench is deeper than 1 metre","Workers are wearing high-vis vests"], answer:1 } },
    },
    end_bg:{ ending:{ type:"project-delay", title:"Project Delay", stars:2, xp:55,
      what:"Entry was allowed despite visible warning signs, but the crew evacuated immediately once soil began trickling, just before a wall section failed.",
      correct:"Reacting instantly to the active warning sign instead of waiting to see if it got worse.",
      wrong:"Allowing entry in the first place despite crest cracking and wall slumping already being visible.",
      tip:"Once inside an excavation, treat any trickling soil or new cracking as an immediate evacuation signal, not a 'watch and see' situation.",
      mistakes:"Underestimating how quickly early warning signs like slumping can progress to full collapse.",
      practice:"Trench rescue statistics show most successful evacuations happen because crews are trained to react to warning signs within seconds, not minutes.",
      quiz:{ q:"What is a key warning sign that a trench wall may be about to collapse?",
        options:["The trench smells like wet soil","Cracking at the crest, wall slumping, or trickling soil","The trench is deeper than 1 metre","Workers are wearing high-vis vests"], answer:1 } },
    },
    end_bb:{ ending:{ type:"safety-incident", title:"Safety Incident", stars:1, xp:15,
      what:"Entry was allowed despite instability, and when soil began trickling the crew relocated within the same trench instead of evacuating — the wall then collapsed on a worker.",
      correct:"Nothing in this path — every decision underestimated how unstable the whole trench had become.",
      wrong:"Both allowing entry initially and treating a mid-trench warning sign as something to work around rather than evacuate from.",
      tip:"A saturated trench is unstable along its whole length, not just at the one visibly cracked spot — moving within it is not a safe response.",
      mistakes:"Believing that repositioning away from a visible crack is equivalent to leaving the hazard area entirely.",
      practice:"Trench collapses are among the deadliest excavation hazards; full evacuation — not repositioning — is the only correct response to active warning signs.",
      quiz:{ q:"What is a key warning sign that a trench wall may be about to collapse?",
        options:["The trench smells like wet soil","Cracking at the crest, wall slumping, or trickling soil","The trench is deeper than 1 metre","Workers are wearing high-vis vests"], answer:1 } },
    }
  }
},
// ==================================================================================
// 5. FOUNDATIONS
// ==================================================================================
{
  id:"retaining-wall-tilt",
  title:"The Leaning Retaining Wall",
  category:"Foundations",
  difficulty:"Professional",
  readTime:6, xp:180,
  cover:{scene:"site", role:"geotech_eng", sky:"day"},
  description:"A newly backfilled retaining wall shows a slight lean. Two calls decide whether it becomes a footnote or a redesign.",
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
      decision:{ question:"Backfilling to full height is scheduled for tomorrow. Do you halt further backfill?",
        options:[ {label:"🔴 Halt backfill, fix drainage and compaction first", type:"good", next:"n3a"}, {label:"🟢 Continue backfilling to stay on schedule", type:"bad", next:"n3b"} ] }
    },
    n3a:{ scene:"site", roles:["geotech_eng","site_engineer"], sky:"day",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"We've cleared the weep holes, but while inspecting we notice the drainage aggregate itself is finer than the design spec — it could clog again."},
        {who:"Geotechnical Engineer", side:"left", text:"Wrong aggregate grading behind a wall is a slow-motion repeat of the same problem."}
      ],
      learning:"Drainage aggregate must match the specified grading — undersized material can clog and silt up over time even after an initial fix.",
      decision:{ question:"Do you reject the current aggregate and source the correct graded stone, or accept it since it's 'mostly draining fine' for now?",
        options:[ {label:"🟢 Reject it, source correctly graded drainage stone", type:"good", next:"n4gg"}, {label:"🔴 Accept it since it drains fine for now", type:"bad", next:"n4gb"} ] }
    },
    n3b:{ scene:"site", roles:["site_engineer","project_manager"], sky:"overcast",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"We finished backfilling. A week later, survey shows the lean has grown from 12mm to 28mm."},
        {who:"Project Manager", side:"left", text:"That's a meaningful acceleration — we need to decide how to respond right now."}
      ],
      learning:"An accelerating lean rate is a far more serious signal than the absolute displacement value alone.",
      decision:{ question:"Do you immediately stop all loading near the wall and call in the structural engineer, or keep monitoring for another week to 'confirm the trend' first?",
        options:[ {label:"🟢 Stop loading now and call the structural engineer", type:"good", next:"n4bg"}, {label:"🔴 Keep monitoring for another week first", type:"bad", next:"n4bb"} ] }
    },
    n4gg:{ scene:"site", roles:["geotech_eng","site_engineer"], sky:"day",
      dialogue:[
        {who:"Geotechnical Engineer", side:"left", text:"Correct 20mm graded stone installed behind the full drainage blanket. Survey monitoring shows zero further movement over two weeks."},
        {who:"Site Engineer (You)", side:"right", text:"Wall is stable and backfilling to full height can now proceed with confidence."}
      ],
      learning:"Matching drainage aggregate grading to spec is what makes a drainage fix permanent rather than temporary.",
      next:"end_gg"
    },
    n4gb:{ scene:"site", roles:["geotech_eng","worker"], sky:"overcast",
      dialogue:[
        {who:"Geotechnical Engineer", side:"left", text:"We backfilled with the finer aggregate. Two months later, the weep holes are silted up again and the wall has resumed a slow lean."},
        {who:"Worker", side:"right", text:"We're back to square one, except now it's buried behind full-height backfill."}
      ],
      learning:"A drainage fix using the wrong aggregate grading is often worse than no fix, since the problem recurs but is now hidden from view.",
      next:"end_gb"
    },
    n4bg:{ scene:"site", roles:["geotech_eng","project_manager"], sky:"day",
      dialogue:[
        {who:"Geotechnical Engineer", side:"left", text:"Loading stopped immediately. The structural engineer designed a soil nail and drainage retrofit before further movement occurred."},
        {who:"Project Manager", side:"left", text:"Costs time and a redesign, but the wall is stabilized before reaching a critical tilt."}
      ],
      learning:"Acting on an accelerating trend immediately — rather than waiting to confirm it — often catches a problem before it becomes structural.",
      next:"end_bg"
    },
    n4bb:{ scene:"site", roles:["project_manager","client"], sky:"overcast",
      dialogue:[
        {who:"Project Manager", side:"left", text:"By the time we confirmed the trend a week later, the wall had leaned to 45mm and cracked visibly at the base."},
        {who:"Client", side:"right", text:"This now needs full demolition and rebuild of that section — I want to understand why we waited to act."}
      ],
      learning:"Waiting to 'confirm' a clearly accelerating structural trend often means acting only after the failure threshold has already been crossed.",
      next:"end_bb"
    },
    end_gg:{ ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:180,
      what:"You halted backfilling, fixed blocked drainage, and then caught and corrected the wrong aggregate grading before it could clog again.",
      correct:"Investigating the root cause thoroughly enough to catch a second, less obvious defect (aggregate grading) hiding behind the first.",
      wrong:"Nothing — this is a genuinely thorough geotechnical response.",
      tip:"When fixing drainage behind a retaining wall, always verify the aggregate grading against spec, not just whether water is currently flowing.",
      mistakes:"Assuming a drainage fix is complete just because water is draining right now, without checking long-term clogging risk.",
      practice:"Drainage blankets are specified with precise aggregate gradations specifically to resist long-term silting and clogging.",
      quiz:{ q:"What commonly causes excess pressure behind a retaining wall during backfilling?",
        options:["Using lighter backfill material","Blocked drainage combined with over-thick compaction lifts","Painting the wall a darker colour","Backfilling too slowly"], answer:1 } },
    },
    end_gb:{ ending:{ type:"project-delay", title:"Project Delay", stars:3, xp:80,
      what:"You correctly halted backfilling for drainage, but accepted incorrectly graded aggregate, and the wall's drainage failed again months later.",
      correct:"Stopping to investigate and fix the original blocked drainage.",
      wrong:"Accepting aggregate that didn't match the specified grading because it 'seemed to drain fine' in the short term.",
      tip:"Drainage aggregate that looks fine on day one can still be wrong for the long-term grading requirement — always check against spec, not just observation.",
      mistakes:"Judging a drainage fix by its immediate performance rather than its specified long-term properties.",
      practice:"Recurring drainage failures behind retaining walls are a common and expensive root cause of long-term wall movement.",
      quiz:{ q:"What commonly causes excess pressure behind a retaining wall during backfilling?",
        options:["Using lighter backfill material","Blocked drainage combined with over-thick compaction lifts","Painting the wall a darker colour","Backfilling too slowly"], answer:1 } },
    },
    end_bg:{ ending:{ type:"project-delay", title:"Project Delay", stars:2, xp:60,
      what:"Backfilling continued despite the original warning, but once the lean accelerated you acted immediately, allowing a retrofit before failure.",
      correct:"Stopping loading and escalating to the structural engineer the moment the lean rate accelerated.",
      wrong:"Continuing backfill originally without resolving the identified drainage and compaction issues.",
      tip:"An accelerating movement rate is itself a red flag independent of the absolute displacement — treat trend changes as urgent.",
      mistakes:"Prioritizing the backfilling schedule over addressing a known geotechnical risk indicator from the start.",
      practice:"Soil nailing and supplementary drainage are common certified retrofits for retaining walls showing early instability.",
      quiz:{ q:"What commonly causes excess pressure behind a retaining wall during backfilling?",
        options:["Using lighter backfill material","Blocked drainage combined with over-thick compaction lifts","Painting the wall a darker colour","Backfilling too slowly"], answer:1 } },
    },
    end_bb:{ ending:{ type:"contract-problem", title:"Contract Problem", stars:1, xp:25,
      what:"Backfilling continued past the original warning, and by the time the accelerating lean was 'confirmed,' the wall had cracked and required full rebuild.",
      correct:"Nothing in this path — every decision point deferred action in favor of schedule or 'more data.'",
      wrong:"Both continuing backfill originally and waiting an extra week to confirm a trend that was already clearly accelerating.",
      tip:"When a structural indicator is already trending toward failure, waiting to 'confirm' it usually just delays the only useful response.",
      mistakes:"Treating monitoring data as a reason to delay action rather than as a trigger for it once a clear trend emerges.",
      practice:"Retaining wall failures like this often lead to significant disputes over design versus construction responsibility, with monitoring records scrutinized closely.",
      quiz:{ q:"What commonly causes excess pressure behind a retaining wall during backfilling?",
        options:["Using lighter backfill material","Blocked drainage combined with over-thick compaction lifts","Painting the wall a darker colour","Backfilling too slowly"], answer:1 } },
    }
  }
},
// ==================================================================================
// 6. STEEL STRUCTURES
// ==================================================================================
{
  id:"steel-erection",
  title:"Steel Erection Day",
  category:"Steel Structures",
  difficulty:"Intermediate",
  readTime:6, xp:170,
  cover:{scene:"factory", role:"crane_operator", sky:"day"},
  description:"Wind is picking up during a heavy steel beam lift. Two calls decide whether the steel gang goes home with a good story or a bad one.",
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
    n2:{ scene:"factory", roles:["crane_operator","hse_officer"], sky:"day", weather:"wind",
      dialogue:[
        {who:"HSE Officer", side:"right", text:"Anemometer's showing gusts up to 14 m/s, and rising. The lift plan caps at 12.5 m/s for this beam."},
        {who:"Crane Operator", side:"left", text:"We're a bit over the limit right now, but it might settle down."}
      ],
      learning:"Wind loading on a large surface-area beam can cause dangerous swing and loss of control during a lift.",
      decision:{ question:"The steel gang is standing by and the schedule is tight. Do you proceed with the lift?",
        options:[ {label:"🔴 Pause the lift until wind drops", type:"good", next:"n3a"}, {label:"🟢 Proceed carefully with taglines", type:"bad", next:"n3b"} ] }
    },
    n3a:{ scene:"factory", roles:["crane_operator","site_engineer"], sky:"sunset", weather:"wind",
      dialogue:[
        {who:"Site Engineer (You)", side:"right", text:"We're on hold. But the steel gang is now approaching the end of their shift, and the relief crew hasn't been briefed on this specific lift plan."},
        {who:"Crane Operator", side:"left", text:"Wind's dropped enough to lift now — but do we wait for a full handover briefing?"}
      ],
      learning:"Shift handovers on a paused critical lift need the same level of briefing as the original plan — fatigue and unfamiliarity are both risk factors.",
      decision:{ question:"Do you delay the lift further to properly brief the relief crew, or let the original tired crew push through since they already know the plan?",
        options:[ {label:"🟢 Delay further, brief the relief crew properly", type:"good", next:"n4gg"}, {label:"🔴 Let the tired original crew push through", type:"bad", next:"n4gb"} ] }
    },
    n3b:{ scene:"factory", roles:["crane_operator","worker"], sky:"day", weather:"wind",
      dialogue:[
        {who:"Crane Operator", side:"left", text:"We're lifting. Taglines are on, but the beam is starting to swing more than expected."},
        {who:"Worker", side:"right", text:"It's swinging toward the platform where two of us are standing!"}
      ],
      learning:"Once a load starts swinging beyond tagline control, the safest response is to regain control immediately, not to keep pushing toward the connection point.",
      decision:{ question:"Do you call an immediate halt and lower the beam back down, or try to complete the final few metres to the connection point quickly?",
        options:[ {label:"🟢 Halt immediately, lower the beam back down", type:"good", next:"n4bg"}, {label:"🔴 Push through the last few metres quickly", type:"bad", next:"n4bb"} ] }
    },
    n4gg:{ scene:"factory", roles:["crane_operator","worker"], sky:"night",
      dialogue:[
        {who:"Crane Operator", side:"left", text:"Relief crew fully briefed on the lift plan, wind confirmed steady and under limit. Lift completed clean, connection bolted in ten minutes."},
        {who:"Worker", side:"right", text:"Zero issues — that's how a critical lift should go, even after a long delay."}
      ],
      learning:"Taking the extra time for a proper handover briefing on a paused critical lift prevents fatigue and unfamiliarity from becoming new risk factors.",
      next:"end_gg"
    },
    n4gb:{ scene:"factory", roles:["crane_operator","worker"], sky:"night",
      dialogue:[
        {who:"Worker", side:"right", text:"The tired original crew rushed the connection bolt-up and mis-aligned two bolt holes."},
        {who:"Crane Operator", side:"left", text:"Beam's now hanging slightly askew — we'll need to re-rig and correct it in the morning."}
      ],
      learning:"Fatigued crews make more small errors even on tasks they're familiar with — timing matters as much as competence.",
      next:"end_gb"
    },
    n4bg:{ scene:"factory", roles:["crane_operator","hse_officer"], sky:"day", weather:"wind",
      dialogue:[
        {who:"Crane Operator", side:"left", text:"Beam lowered back to ground safely the moment the swing exceeded control. Everyone's clear."},
        {who:"HSE Officer", side:"right", text:"We'll wait for a genuine drop in wind and re-rig with an added tagline point for better control."}
      ],
      learning:"Stopping a lift the moment control is lost, even close to completion, is always the safer choice than pushing through.",
      next:"end_bg"
    },
    n4bb:{ scene:"factory", roles:["crane_operator","worker"], sky:"day", weather:"wind",
      dialogue:[
        {who:"Crane Operator", side:"left", text:"We pushed through — the beam swung hard and clipped the platform edge!"},
        {who:"Worker", side:"right", text:"One of the crew was struck trying to get clear — we need medical assistance now!"}
      ],
      learning:"Pushing a swinging load toward its connection point instead of stopping turns a recoverable situation into an injury.",
      next:"end_bb"
    },
    end_gg:{ ending:{ type:"safety", title:"Zero Accident Award", stars:5, xp:170,
      what:"You paused the lift for wind, then paused again to properly brief a relief crew rather than pushing the original tired crew through.",
      correct:"Treating both the wind limit and crew fatigue/familiarity as equally valid reasons to pause a critical lift.",
      wrong:"Nothing — this is exactly how critical lifts should be managed from start to finish.",
      tip:"A paused critical lift is a new lift each time crews change — always re-brief, regardless of how close the previous crew was to finishing.",
      mistakes:"Assuming that because a crew 'already knows the plan,' fatigue doesn't matter for a still-hazardous operation.",
      practice:"Real lift plans (method statements) typically require a fresh toolbox talk any time there's a meaningful gap or crew change during a critical lift.",
      quiz:{ q:"Why are large flat steel beams especially sensitive to wind during a crane lift?",
        options:["They are lighter than other steel members","Their large surface area increases wind force and swing risk","Wind has no effect on steel","They are always lifted indoors"], answer:1 } },
    },
    end_gb:{ ending:{ type:"project-delay", title:"Project Delay", stars:3, xp:75,
      what:"You correctly paused the lift for wind, but let a tired original crew push through the final connection instead of briefing a fresh crew.",
      correct:"Pausing the lift itself until wind speed was safely under the limit.",
      wrong:"Letting fatigue-affected workers rush the final, precision-critical bolt-up step.",
      tip:"The final connection step of a steel lift often requires the same care as the lift itself — don't let it become the rushed afterthought.",
      mistakes:"Assuming a crew that's been on shift longer is still performing at full precision on detail work.",
      practice:"Misaligned bolt connections typically require re-rigging and correction, adding delay that a short handover briefing would have avoided.",
      quiz:{ q:"Why are large flat steel beams especially sensitive to wind during a crane lift?",
        options:["They are lighter than other steel members","Their large surface area increases wind force and swing risk","Wind has no effect on steel","They are always lifted indoors"], answer:1 } },
    },
    end_bg:{ ending:{ type:"project-delay", title:"Project Delay", stars:2, xp:60,
      what:"The lift proceeded despite wind exceeding the limit, and the beam began swinging out of control — but you halted and lowered it safely before contact.",
      correct:"Stopping and lowering the load the instant control was lost, instead of pushing toward the connection.",
      wrong:"Proceeding with the lift in the first place once wind was already confirmed above the safe limit.",
      tip:"A lift plan's wind limit is a hard engineering constraint, not a target to 'try and beat' with careful handling.",
      mistakes:"Believing extra taglines could substitute for respecting the rated wind limit for that specific load shape.",
      practice:"Crane-related incidents are frequently linked to wind and load-swing; many contractors require automatic lift suspension above a set wind speed.",
      quiz:{ q:"Why are large flat steel beams especially sensitive to wind during a crane lift?",
        options:["They are lighter than other steel members","Their large surface area increases wind force and swing risk","Wind has no effect on steel","They are always lifted indoors"], answer:1 } },
    },
    end_bb:{ ending:{ type:"safety-incident", title:"Safety Incident", stars:1, xp:20,
      what:"The lift proceeded despite excess wind, and when the beam swung out of control, the crew pushed to finish instead of stopping — a worker was struck.",
      correct:"Nothing in this path — every decision chose to push forward over stopping for safety.",
      wrong:"Both proceeding with the lift above the wind limit and continuing once the load was visibly out of control.",
      tip:"The instant a load exceeds tagline control, the only safe response is to stop and lower it — never push toward the connection point.",
      mistakes:"Believing that being 'so close' to finishing justifies continuing a lift that has already become unsafe.",
      practice:"Struck-by incidents from swinging loads are among the most common serious crane-related injuries — stopping immediately is always the trained response.",
      quiz:{ q:"Why are large flat steel beams especially sensitive to wind during a crane lift?",
        options:["They are lighter than other steel members","Their large surface area increases wind force and swing risk","Wind has no effect on steel","They are always lifted indoors"], answer:1 } },
    }
  }
},
// ==================================================================================
// 7. ROAD CONSTRUCTION
// ==================================================================================
{
  id:"asphalt-weather",
  title:"Asphalt or Delay",
  category:"Road Construction",
  difficulty:"Beginner",
  readTime:6, xp:160,
  cover:{scene:"road", role:"highway_eng", sky:"overcast"},
  description:"Rain is forecast in an hour but the asphalt paver is already rolling. Two decisions decide how much of this road you redo.",
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
      decision:{ question:"Do you stop paving now to avoid getting caught in the rain?",
        options:[ {label:"🔴 Stop paving, cover the joint, resume later", type:"good", next:"n3a"}, {label:"🟢 Push through to finish the section", type:"bad", next:"n3b"} ] }
    },
    n3a:{ scene:"road", roles:["highway_eng","worker"], sky:"overcast", weather:"rain",
      dialogue:[
        {who:"Highway Engineer", side:"left", text:"Stopped and covered. But the rain is heavier and longer than forecast — the transverse joint has been exposed for two hours now."},
        {who:"Worker", side:"right", text:"Should we re-tack and re-heat the joint edge before resuming, or just butt the new asphalt straight against it tomorrow?"}
      ],
      learning:"A cold joint left exposed too long needs its edge re-tacked and sometimes re-heated to properly bond with the next day's paving.",
      decision:{ question:"Do you re-tack and infrared-heat the joint edge before resuming tomorrow, or just butt fresh asphalt against the cold edge to save time?",
        options:[ {label:"🟢 Re-tack and heat the joint edge properly", type:"good", next:"n4gg"}, {label:"🔴 Just butt fresh asphalt against the cold edge", type:"bad", next:"n4gb"} ] }
    },
    n3b:{ scene:"road", roles:["highway_eng","qa_engineer"], sky:"overcast", weather:"rain",
      dialogue:[
        {who:"Highway Engineer", side:"left", text:"Rain just started, but the paver's still moving. We're now compacting a wet mat."},
        {who:"QA/QC Engineer", side:"right", text:"We can keep pushing to finish the section, or stop right now and accept a mid-section cold joint."}
      ],
      learning:"Once rain begins, every additional metre compacted wet adds to the area that will likely need remediation.",
      decision:{ question:"Do you stop the paver immediately even though it means a joint in the middle of the section, or keep going since 'we're already wet anyway'?",
        options:[ {label:"🟢 Stop immediately despite the mid-section joint", type:"good", next:"n4bg"}, {label:"🔴 Keep going since we're already wet", type:"bad", next:"n4bb"} ] }
    },
    n4gg:{ scene:"road", roles:["highway_eng","worker"], sky:"day",
      dialogue:[
        {who:"Highway Engineer", side:"left", text:"Joint properly re-tacked and heated before resuming. Core samples across the joint show full bond and density on both sides."},
        {who:"Worker", side:"right", text:"You'd never know there was a two-hour rain delay looking at this joint."}
      ],
      learning:"Properly treating a cold joint's edge before resuming paving produces a bond as strong as a continuous pour.",
      next:"end_gg"
    },
    n4gb:{ scene:"road", roles:["highway_eng","qa_engineer"], sky:"day",
      dialogue:[
        {who:"Highway Engineer", side:"left", text:"We butted fresh asphalt straight against the cold, untreated edge to save time."},
        {who:"QA/QC Engineer", side:"right", text:"Core samples show a visible seam with poor bond — that joint will likely open up and let water in within a year."},
      ],
      learning:"A cold, untreated joint edge bonds poorly with fresh asphalt, creating a long-term water infiltration path.",
      next:"end_gb"
    },
    n4bg:{ scene:"road", roles:["highway_eng","worker"], sky:"day",
      dialogue:[
        {who:"Highway Engineer", side:"left", text:"We stopped mid-section the moment rain hit, accepting an extra joint. The compacted-before-rain portion tested at full density."},
        {who:"Worker", side:"right", text:"Just the small wet strip near the joint needs review — much better than losing the whole run."}
      ],
      learning:"Stopping immediately when rain starts limits the wet-compacted area to the smallest possible section, even if it creates an extra joint.",
      next:"end_bg"
    },
    n4bb:{ scene:"road", roles:["highway_eng","qa_engineer"], sky:"overcast", weather:"rain",
      dialogue:[
        {who:"Highway Engineer", side:"left", text:"We paved the entire remaining 200m in the rain, reasoning we were 'already wet.'"},
        {who:"QA/QC Engineer", side:"right", text:"Core samples next week show density 6-9% below spec across the entire wet section."},
      ],
      learning:"Continuing to pave in the rain because 'the damage is already done' simply multiplies the area needing remediation.",
      next:"end_bb"
    },
    end_gg:{ ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:160,
      what:"You stopped paving ahead of the rain, then properly re-tacked and heated the joint edge before resuming — testing showed a fully bonded, dense joint.",
      correct:"Both stopping ahead of the rain and properly treating the resulting cold joint before continuing.",
      wrong:"Nothing significant — a short program delay plus proper joint treatment is standard, expected practice.",
      tip:"Any joint left exposed for an extended period should be re-tacked and often infrared-heated before new asphalt is placed against it.",
      mistakes:"Assuming a joint left in the rain for a couple of hours can simply be built against without any edge preparation.",
      practice:"Infrared joint heaters are commonly used specifically to restore a cold joint's bonding properties before continuing paving.",
      quiz:{ q:"Why does rain during asphalt compaction cause problems?",
        options:["It makes the asphalt too hot","It cools the mix too fast and traps moisture, reducing density","It has no effect on asphalt","It speeds up curing safely"], answer:1 } },
    },
    end_gb:{ ending:{ type:"project-delay", title:"Project Delay", stars:3, xp:80,
      what:"You correctly stopped paving before the rain, but then butted fresh asphalt against the untreated cold joint edge, creating a weak, water-prone seam.",
      correct:"Stopping paving ahead of the rain to protect the bulk of the section from wet compaction.",
      wrong:"Skipping joint edge preparation (re-tacking/heating) when resuming the next day.",
      tip:"Treat every cold joint edge as needing preparation before the next lift is placed against it, regardless of how short the exposure was.",
      mistakes:"Assuming a joint is 'just a line' rather than a bonding surface that needs the same care as the rest of the mat.",
      practice:"Poorly bonded longitudinal or transverse joints are one of the most common early failure points on paved roads, often requiring joint sealing repairs.",
      quiz:{ q:"Why does rain during asphalt compaction cause problems?",
        options:["It makes the asphalt too hot","It cools the mix too fast and traps moisture, reducing density","It has no effect on asphalt","It speeds up curing safely"], answer:1 } },
    },
    end_bg:{ ending:{ type:"project-delay", title:"Project Delay", stars:2, xp:65,
      what:"Paving continued briefly into the rain, but you stopped immediately once it started, limiting the wet-compacted area to a small strip near the joint.",
      correct:"Stopping the moment rain actually began, rather than continuing 'to finish the section.'",
      wrong:"Not stopping earlier when rain was already forecast within the hour.",
      tip:"When rain is imminent, planning the stopping point in advance limits the affected area far more than reacting once it starts.",
      mistakes:"Treating a known forecast as something to 'wait and see' rather than plan around.",
      practice:"Contractors increasingly track live radar during paving operations specifically to plan stopping points ahead of a rain cell's arrival.",
      quiz:{ q:"Why does rain during asphalt compaction cause problems?",
        options:["It makes the asphalt too hot","It cools the mix too fast and traps moisture, reducing density","It has no effect on asphalt","It speeds up curing safely"], answer:1 } },
    },
    end_bb:{ ending:{ type:"quality-failure", title:"Quality Failure", stars:1, xp:25,
      what:"Paving continued into the rain from the start, and once wet, the crew kept going for the full remaining section, resulting in widespread under-density.",
      correct:"Nothing in this path — every decision chose to keep paving over stopping for weather.",
      wrong:"Both pushing through the initial rain onset and continuing further once already compacting wet asphalt.",
      tip:"Once compaction quality is compromised, continuing doesn't 'average it out' — it simply adds more substandard pavement to repair.",
      mistakes:"Reasoning that since some damage was already done, there was no benefit to stopping — this compounds the problem instead of limiting it.",
      practice:"Under-compacted asphalt sections identified by core testing typically require milling and repaving the affected area at the contractor's cost.",
      quiz:{ q:"Why does rain during asphalt compaction cause problems?",
        options:["It makes the asphalt too hot","It cools the mix too fast and traps moisture, reducing density","It has no effect on asphalt","It speeds up curing safely"], answer:1 } },
    }
  }
},
// ==================================================================================
// 8. BRIDGE CONSTRUCTION
// ==================================================================================
{
  id:"bridge-bearing",
  title:"Bridge Bearing Inspection",
  category:"Bridge Construction",
  difficulty:"Professional",
  readTime:6, xp:190,
  cover:{scene:"bridge", role:"bridge_eng", sky:"dusk"},
  description:"An elastomeric bearing looks slightly misaligned before the deck segment is set down. Two decisions decide the pier's next fifty years.",
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
      decision:{ question:"The crane and segment are ready to lower right now. Do you halt the lift to fix the bearing?",
        options:[ {label:"🔴 Halt the lift, re-align the bearing first", type:"good", next:"n3a"}, {label:"🟢 Proceed — it's a small misalignment", type:"bad", next:"n3b"} ] }
    },
    n3a:{ scene:"bridge", roles:["bridge_eng","site_engineer"], sky:"dusk",
      dialogue:[
        {who:"Bridge Engineer", side:"left", text:"Re-aligning the bearing plate now. While we're in there, the surveyor also flags that pier 4's south bearing seat is 6mm out of level."},
        {who:"Site Engineer (You)", side:"right", text:"That's a separate defect — the bedding mortar under that bearing wasn't finished level."}
      ],
      learning:"A bearing seat that isn't level creates the same uneven-loading risk as a rotated bearing, just from a different cause.",
      decision:{ question:"Do you also re-level the south bearing seat with corrective bedding mortar before lowering the segment, or accept 6mm since it's 'within a rough tolerance'?",
        options:[ {label:"🟢 Re-level the seat with corrective bedding mortar", type:"good", next:"n4gg"}, {label:"🔴 Accept 6mm as within rough tolerance", type:"bad", next:"n4gb"} ] }
    },
    n3b:{ scene:"bridge", roles:["bridge_eng","qa_engineer"], sky:"dusk",
      dialogue:[
        {who:"Bridge Engineer", side:"left", text:"We lowered the segment onto the misaligned bearing. A follow-up survey a month later shows a visible 3mm settlement difference across the pier."},
        {who:"QA/QC Engineer", side:"right", text:"We need to decide how to handle this before the next segment is set."}
      ],
      learning:"Settlement differences across a pier are often the first visible sign that a bearing misalignment is causing uneven load transfer.",
      decision:{ question:"Do you report the settlement difference to the bridge designer now for an engineered assessment, or wait to see if it stabilizes on its own over the next few months?",
        options:[ {label:"🟢 Report to the bridge designer now", type:"good", next:"n4bg"}, {label:"🔴 Wait to see if it stabilizes on its own", type:"bad", next:"n4bb"} ] }
    },
    n4gg:{ scene:"bridge", roles:["bridge_eng","site_engineer"], sky:"day",
      dialogue:[
        {who:"Bridge Engineer", side:"left", text:"Both bearings re-aligned and re-leveled. Post-load survey shows perfectly even settlement across all four bearings on pier 4."},
        {who:"Site Engineer (You)", side:"right", text:"That's exactly what fifty years of even load transfer should look like from day one."}
      ],
      learning:"Checking every bearing on a pier — not just the one initially flagged — is what prevents an uneven-loading defect from slipping through.",
      next:"end_gg"
    },
    n4gb:{ scene:"bridge", roles:["bridge_eng","qa_engineer"], sky:"day",
      dialogue:[
        {who:"Bridge Engineer", side:"left", text:"We fixed the rotation but accepted the 6mm bearing seat level difference."},
        {who:"QA/QC Engineer", side:"right", text:"Six months later, that bearing shows early compression wear on one edge — the seat level error is doing exactly what the rotation would have done."}
      ],
      learning:"An out-of-level bearing seat causes the same uneven point-loading as a rotated bearing — 'rough tolerance' isn't a real engineering category for this.",
      next:"end_gb"
    },
    n4bg:{ scene:"office", roles:["bridge_eng","project_manager"], sky:"day",
      dialogue:[
        {who:"Bridge Engineer", side:"left", text:"We reported the settlement difference immediately. The designer confirmed it's within recoverable range with a shim correction under future segments."},
        {who:"Project Manager", side:"left", text:"Costs some fabrication time, but pier 4 is now certified to continue safely."}
      ],
      learning:"Reporting an emerging structural discrepancy quickly gives the designer the best chance to engineer a proportionate fix.",
      next:"end_bg"
    },
    n4bb:{ scene:"office", roles:["project_manager","client"], sky:"overcast",
      dialogue:[
        {who:"Project Manager", side:"left", text:"By the time we reported the settlement, three more segments had been placed on top of the uneven bearing."},
        {who:"Client", side:"right", text:"Now we may need to lift and re-seat multiple segments — I need a full explanation of why we waited months to escalate this."}
      ],
      learning:"Waiting to see if a structural discrepancy 'stabilizes' while continuing to add load on top of it often multiplies the eventual correction needed.",
      next:"end_bb"
    },
    end_gg:{ ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:190,
      what:"You halted the lift to fix a rotated bearing, then caught and corrected an out-of-level bearing seat on the same pier before loading either.",
      correct:"Extending the inspection to every bearing on the pier instead of stopping once the first defect was fixed.",
      wrong:"Nothing — this is exactly the thoroughness a fifty-year structural element deserves.",
      tip:"Bearing seat levelness matters exactly as much as bearing rotation — both cause the same uneven point-loading outcome.",
      mistakes:"Assuming that fixing the one reported defect means the rest of the pier's bearings are automatically fine.",
      practice:"Bridge bearings are typically inspected and certified by a specialist across every seat on a pier, not spot-checked on just the flagged one.",
      quiz:{ q:"Why does a small rotational misalignment in a bridge bearing matter?",
        options:["It doesn't matter for elastomeric bearings","It can cause uneven point-loading and premature wear over the structure's life","It only affects the bearing's colour","It makes the bearing easier to replace"], answer:1 } },
    },
    end_gb:{ ending:{ type:"project-delay", title:"Project Delay", stars:3, xp:85,
      what:"You correctly fixed the rotated bearing, but accepted a 6mm bearing seat level difference as 'rough tolerance,' which caused early wear on that bearing.",
      correct:"Halting the lift and properly correcting the originally identified rotation defect.",
      wrong:"Treating bearing seat levelness as a looser tolerance than bearing rotation, when the structural effect is the same.",
      tip:"There's no separate 'rough tolerance' category for bearing seats — level and alignment both need to meet the same precision standard.",
      mistakes:"Assuming a defect that's harder to see (a level difference under a bearing pad) matters less than one that's visually obvious (rotation).",
      practice:"Bearing seat levelness is typically checked with precision instruments and corrected with engineered bedding mortar, not accepted by eye.",
      quiz:{ q:"Why does a small rotational misalignment in a bridge bearing matter?",
        options:["It doesn't matter for elastomeric bearings","It can cause uneven point-loading and premature wear over the structure's life","It only affects the bearing's colour","It makes the bearing easier to replace"], answer:1 } },
    },
    end_bg:{ ending:{ type:"project-delay", title:"Project Delay", stars:2, xp:70,
      what:"The segment was set on a misaligned bearing, but once settlement differences appeared, you reported them immediately, allowing an engineered shim correction.",
      correct:"Reporting the emerging settlement discrepancy to the bridge designer as soon as it was measured.",
      wrong:"Proceeding with the original lift despite already knowing about the bearing misalignment.",
      tip:"For long-design-life elements like bearings, any measured deviation deserves immediate escalation rather than a 'wait and see' approach.",
      mistakes:"Treating the original misalignment as acceptable because it seemed small at the time of the lift.",
      practice:"Shim correction under subsequent segments is a common, proportionate fix when a bearing issue is caught early, before too much additional load is added.",
      quiz:{ q:"Why does a small rotational misalignment in a bridge bearing matter?",
        options:["It doesn't matter for elastomeric bearings","It can cause uneven point-loading and premature wear over the structure's life","It only affects the bearing's colour","It makes the bearing easier to replace"], answer:1 } },
    },
    end_bb:{ ending:{ type:"contract-problem", title:"Contract Problem", stars:1, xp:25,
      what:"The segment was set on a misaligned bearing, and by the time settlement differences were finally reported, three more segments had already been placed on top.",
      correct:"Nothing in this path — every decision deferred action while more load kept being added.",
      wrong:"Both proceeding with the original known misalignment and waiting months to escalate a worsening settlement discrepancy.",
      tip:"On a multi-segment structure, every additional segment placed on an unresolved defect multiplies the eventual correction required.",
      mistakes:"Believing a structural discrepancy would 'stabilize on its own' while continuing normal construction on top of it.",
      practice:"Retrofit or re-seating of a loaded bridge bearing under multiple placed segments is a major, costly operation — early escalation is always cheaper than a late one.",
      quiz:{ q:"Why does a small rotational misalignment in a bridge bearing matter?",
        options:["It doesn't matter for elastomeric bearings","It can cause uneven point-loading and premature wear over the structure's life","It only affects the bearing's colour","It makes the bearing easier to replace"], answer:1 } },
    }
  }
},
// ==================================================================================
// 9. SURVEY & BIM
// ==================================================================================
{
  id:"missing-survey-point",
  title:"The Missing Survey Point",
  category:"Survey & BIM",
  difficulty:"Intermediate",
  readTime:6, xp:170,
  cover:{scene:"site", role:"surveyor", sky:"day"},
  description:"A benchmark used for foundation setout doesn't match the BIM model. Two decisions decide where every pile in this project actually ends up.",
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
      decision:{ question:"Piling rig is due to mobilise this afternoon. Do you pause to re-establish the benchmark first?",
        options:[ {label:"🔴 Pause piling, re-establish benchmark from a control point", type:"good", next:"n3a"}, {label:"🟢 Proceed with current setout to keep the rig on schedule", type:"bad", next:"n3b"} ] }
    },
    n3a:{ scene:"site", roles:["surveyor","bim_engineer"], sky:"day",
      dialogue:[
        {who:"Surveyor", side:"left", text:"Re-shooting from the primary control network now. But two of the four control points nearby are also inaccessible due to material stockpiles."},
        {who:"BIM Engineer", side:"right", text:"Using just two points reduces our redundancy for the check."}
      ],
      learning:"Surveying with the minimum number of control points removes the redundancy that lets you cross-check for errors.",
      decision:{ question:"Do you get the stockpiles moved to access all four control points for a fully redundant check, or proceed with just the two accessible points to save time?",
        options:[ {label:"🟢 Get stockpiles moved, use all four control points", type:"good", next:"n4gg"}, {label:"🔴 Proceed with just two accessible points", type:"bad", next:"n4gb"} ] }
    },
    n3b:{ scene:"site", roles:["surveyor","project_manager"], sky:"overcast",
      dialogue:[
        {who:"Surveyor", side:"left", text:"Rig mobilized on the questionable setout. A first pile has now been driven."},
        {who:"Project Manager", side:"left", text:"As-built check shows it's off-position — do we stop the rig now or let it finish today's planned piles first?"}
      ],
      learning:"Discovering a setout error after the first pile is driven is the last real chance to limit how many piles are affected.",
      decision:{ question:"Do you stop the rig immediately to re-verify setout before any more piles are driven, or let today's remaining piles finish since they're 'probably fine'?",
        options:[ {label:"🟢 Stop the rig immediately to re-verify setout", type:"good", next:"n4bg"}, {label:"🔴 Let today's remaining piles finish", type:"bad", next:"n4bb"} ] }
    },
    n4gg:{ scene:"site", roles:["surveyor","bim_engineer"], sky:"day",
      dialogue:[
        {who:"Surveyor", side:"left", text:"Stockpiles moved, all four control points used. Setout is confirmed accurate with full redundancy — no ambiguity left at all."},
        {who:"BIM Engineer", side:"right", text:"Model and site match exactly. Piling can mobilise with total confidence."}
      ],
      learning:"Using full redundancy in a control network removes any doubt about which reading was correct.",
      next:"end_gg"
    },
    n4gb:{ scene:"site", roles:["surveyor","worker"], sky:"day",
      dialogue:[
        {who:"Surveyor", side:"left", text:"We used just the two accessible points. Setout looked consistent, so piling proceeded."},
        {who:"Worker", side:"right", text:"A later independent check finds those two points had a small shared error — three piles are now 40mm off design position."}
      ],
      learning:"Two-point checks can agree with each other and still both be wrong if they share a common source of error.",
      next:"end_gb"
    },
    n4bg:{ scene:"site", roles:["surveyor","project_manager"], sky:"day",
      dialogue:[
        {who:"Surveyor", side:"left", text:"Rig stopped after just one pile. Re-verified setout from the primary control network — confirmed the error and corrected it before any more piles were driven."},
        {who:"Project Manager", side:"left", text:"One pile needs remedial grouting, but the rest of the piling can proceed on the corrected setout."}
      ],
      learning:"Stopping immediately after detecting a setout error limits the damage to the smallest possible number of elements.",
      next:"end_bg"
    },
    n4bb:{ scene:"site", roles:["surveyor","project_manager"], sky:"overcast",
      dialogue:[
        {who:"Surveyor", side:"left", text:"We let the day's remaining six piles finish on the same bad setout."},
        {who:"Project Manager", side:"left", text:"As-built survey now shows seven piles are 200mm off design position — that's a full day's piling to review with the structural engineer."}
      ],
      learning:"Continuing to build on a known bad reference point simply multiplies the number of elements needing correction.",
      next:"end_bb"
    },
    end_gg:{ ending:{ type:"quality", title:"Excellent Engineer", stars:5, xp:170,
      what:"You paused piling to re-establish setout, then insisted on full four-point redundancy rather than settling for a partial, less certain check.",
      correct:"Recognizing that a reduced-redundancy survey check carries real residual risk, even if it looks consistent.",
      wrong:"Nothing — this is a textbook example of thorough, defensible survey verification.",
      tip:"Whenever possible, verify setout against a fully redundant set of control points, not just the minimum needed for a single check.",
      mistakes:"Assuming that two points agreeing with each other is the same as being independently confirmed correct.",
      practice:"Primary control networks are deliberately built with redundant points precisely so setout can always be independently cross-checked.",
      quiz:{ q:"What is the safest way to resolve a discrepancy between a benchmark and the BIM model?",
        options:["Always trust the benchmark without question","Trace back to a verified primary control point to confirm which is correct","Split the difference between both readings","Ignore it and continue"], answer:1 } },
    },
    end_gb:{ ending:{ type:"project-delay", title:"Project Delay", stars:3, xp:75,
      what:"You paused piling to re-verify setout, but used only two accessible control points, which shared a hidden error and left three piles slightly mispositioned.",
      correct:"Pausing piling in the first place to properly re-establish the benchmark.",
      wrong:"Accepting reduced survey redundancy to save time moving stockpiles.",
      tip:"When full redundancy isn't immediately convenient, it's usually worth the short delay to get it rather than accept a partial check.",
      mistakes:"Assuming two points agreeing is sufficient proof of accuracy without a third independent check.",
      practice:"Mispositioned piles found after driving typically require a structural review of pile cap and load path adequacy before proceeding.",
      quiz:{ q:"What is the safest way to resolve a discrepancy between a benchmark and the BIM model?",
        options:["Always trust the benchmark without question","Trace back to a verified primary control point to confirm which is correct","Split the difference between both readings","Ignore it and continue"], answer:1 } },
    },
    end_bg:{ ending:{ type:"project-delay", title:"Project Delay", stars:2, xp:60,
      what:"Piling proceeded on unresolved setout, but once the first pile was found off-position, you stopped the rig immediately before any more were driven.",
      correct:"Stopping the rig the moment the first as-built check revealed a problem.",
      wrong:"Mobilizing the rig originally on a setout that hadn't been properly re-verified.",
      tip:"The first pile driven on questionable setout is effectively a test case — always check it before letting the rig continue.",
      mistakes:"Prioritizing keeping the rig moving over resolving a known, unverified benchmark discrepancy from the start.",
      practice:"A single mispositioned pile is a relatively minor, correctable issue compared to a full day's production on the same error.",
      quiz:{ q:"What is the safest way to resolve a discrepancy between a benchmark and the BIM model?",
        options:["Always trust the benchmark without question","Trace back to a verified primary control point to confirm which is correct","Split the difference between both readings","Ignore it and continue"], answer:1 } },
    },
    end_bb:{ ending:{ type:"budget-problem", title:"Project Delay", stars:1, xp:25,
      what:"Piling proceeded on unresolved setout, and even after the first pile was found off-position, the rig continued for the rest of the day.",
      correct:"Nothing in this path — every decision favored keeping the rig moving over resolving a known survey discrepancy.",
      wrong:"Both mobilizing on unverified setout and continuing production after the first as-built check flagged a problem.",
      tip:"An as-built check that reveals a problem is a stop signal, not a data point to note and continue past.",
      mistakes:"Assuming the remaining piles were 'probably fine' once the pattern of error was already visible in the first one.",
      practice:"Foundation position errors across multiple piles often require additional piles, pile cap redesign, or a full load-path re-analysis — all significantly costlier than a single-pile correction.",
      quiz:{ q:"What is the safest way to resolve a discrepancy between a benchmark and the BIM model?",
        options:["Always trust the benchmark without question","Trace back to a verified primary control point to confirm which is correct","Split the difference between both readings","Ignore it and continue"], answer:1 } },
    }
  }
},
// ==================================================================================
// 10. PROCUREMENT & CONTRACTS
// ==================================================================================
{
  id:"tender-trap",
  title:"Tender Trap",
  category:"Procurement & Contracts",
  difficulty:"Professional",
  readTime:6, xp:180,
  cover:{scene:"office", role:"procurement_eng", sky:"day"},
  description:"The lowest bidder's price seems too good to be true. Two decisions decide whether this 'saving' becomes a real one.",
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
      decision:{ question:"The PM wants to award quickly to lock in project budget savings. Do you recommend awarding to Bidder C?",
        options:[ {label:"🔴 Request bid clarification before recommending an award", type:"good", next:"n3a"}, {label:"🟢 Recommend awarding to Bidder C for the savings", type:"bad", next:"n3b"} ] }
    },
    n3a:{ scene:"meeting", roles:["procurement_eng","project_manager"], sky:"day",
      dialogue:[
        {who:"Procurement Engineer", side:"left", text:"We sent a formal clarification request — Bidder C confirmed they'd missed commissioning costs entirely. Their revised price is now closer to the other bids, but still slightly lower."},
        {who:"Project Manager", side:"left", text:"Do we take their word on the revised number, or ask for a full re-priced, itemized breakdown before award?"}
      ],
      learning:"A corrected bid still deserves the same scrutiny as the original — a quick revision can hide new gaps just as easily as the first version did.",
      decision:{ question:"Do you require a full, itemized re-priced breakdown before recommending award, or accept their single revised total figure as sufficient?",
        options:[ {label:"🟢 Require a full itemized re-priced breakdown", type:"good", next:"n4gg"}, {label:"🔴 Accept their single revised total figure", type:"bad", next:"n4gb"} ] }
    },
    n3b:{ scene:"office", roles:["procurement_eng","project_manager"], sky:"overcast",
      dialogue:[
        {who:"Procurement Engineer", side:"left", text:"We awarded to Bidder C to save on budget. Three months in, they've submitted a variation claim for commissioning and testing that wasn't in their price."},
        {who:"Project Manager", side:"left", text:"Do we reject the claim outright, or negotiate a settlement to keep the relationship workable?"}
      ],
      learning:"Once a contract is signed with a scope gap, the contractor typically has strong grounds for a variation claim — the argument shifts from 'if' to 'how much.'",
      decision:{ question:"Do you engage a fair negotiation to settle the claim at a reasonable, documented rate, or reject it outright and risk an adversarial dispute?",
        options:[ {label:"🟢 Negotiate a fair, documented settlement", type:"good", next:"n4bg"}, {label:"🔴 Reject the claim outright", type:"bad", next:"n4bb"} ] }
    },
    n4gg:{ scene:"meeting", roles:["procurement_eng","qs"], sky:"day",
      dialogue:[
        {who:"Procurement Engineer", side:"left", text:"Full itemized breakdown received — every line item now matches real market rates and complete scope, including commissioning."},
        {who:"Quantity Surveyor", side:"right", text:"Now this is a bid we can actually stand behind. Recommending award with full confidence."}
      ],
      learning:"An itemized, fully scoped bid is the only real protection against future variation claims — a single revised total isn't enough.",
      next:"end_gg"
    },
    n4gb:{ scene:"office", roles:["qs","project_manager"], sky:"overcast",
      dialogue:[
        {who:"Quantity Surveyor", side:"right", text:"We accepted their single revised total without an itemized breakdown. Four months in, a different missing item — cable containment — surfaces as a new claim."},
        {who:"Project Manager", side:"left", text:"Turns out the revision only patched the one gap we specifically asked about."}
      ],
      learning:"A revised total figure without an itemized breakdown can quietly leave other scope gaps unaddressed.",
      next:"end_gb"
    },
    n4bg:{ scene:"meeting", roles:["procurement_eng","project_manager"], sky:"day",
      dialogue:[
        {who:"Procurement Engineer", side:"left", text:"We negotiated a fair, documented settlement based on market rates for the missing commissioning scope."},
        {who:"Project Manager", side:"left", text:"Costs more than the original quoted price, but it's a fair number both sides can defend, and the relationship stays workable for the rest of the project."}
      ],
      learning:"A documented, market-rate settlement for a genuine scope gap is usually faster and cheaper than a prolonged dispute.",
      next:"end_bg"
    },
    n4bb:{ scene:"office", roles:["project_manager","client"], sky:"overcast",
      dialogue:[
        {who:"Project Manager", side:"left", text:"We rejected the claim outright. The contractor has now issued formal notice of dispute and paused non-critical works pending resolution."},
        {who:"Client", side:"right", text:"This is now affecting our overall project timeline — I need to understand how we got here."}
      ],
      learning:"Rejecting a claim with genuine merit outright, rather than negotiating it, often escalates into a formal dispute that costs far more in time and legal fees than a fair settlement would have.",
      next:"end_bb"
    },
    end_gg:{ ending:{ type:"budget", title:"Budget Saved", stars:5, xp:180,
      what:"You requested clarification on the low bid, then insisted on a full itemized re-priced breakdown instead of accepting a single revised total.",
      correct:"Treating even a 'corrected' bid with the same scrutiny as the original suspicious one.",
      wrong:"Nothing — this is thorough, professional bid evaluation from start to finish.",
      tip:"Always require an itemized breakdown after a bid revision — a single total number can hide which specific gaps were actually fixed.",
      mistakes:"Assuming that once a contractor acknowledges one missing item, all other items are automatically now correct.",
      practice:"Formal Requests for Clarification (RFCs), followed by itemized re-pricing, are standard practice precisely to catch every scope gap before contract signature.",
      quiz:{ q:"What is a common red flag in an unusually low bid?",
        options:["A detailed cost breakdown","Missing scope items like testing and commissioning","A bid bond included","A realistic programme"], answer:1 } },
    },
    end_gb:{ ending:{ type:"project-delay", title:"Project Delay", stars:3, xp:85,
      what:"You correctly requested clarification on the low bid, but accepted a single revised total figure instead of a full itemized breakdown, missing a second scope gap.",
      correct:"Requesting clarification on the original bid's obvious missing scope items.",
      wrong:"Accepting a revised total number without verifying it against a full itemized breakdown.",
      tip:"A revision that only addresses the specific gap you flagged may leave other, unflagged gaps completely untouched.",
      mistakes:"Treating a bidder's own correction as automatically complete rather than independently verifying it.",
      practice:"Sequential 'discovered' variation claims are a common pattern when a low bid's scope gaps are fixed one at a time instead of comprehensively.",
      quiz:{ q:"What is a common red flag in an unusually low bid?",
        options:["A detailed cost breakdown","Missing scope items like testing and commissioning","A bid bond included","A realistic programme"], answer:1 } },
    },
    end_bg:{ ending:{ type:"project-delay", title:"Project Delay", stars:2, xp:70,
      what:"The contract was awarded without resolving the original red flag, and a variation claim followed — but you negotiated a fair, documented settlement.",
      correct:"Choosing to negotiate a market-rate settlement rather than letting the dispute escalate.",
      wrong:"Recommending award in the first place without resolving the identified scope gap through clarification.",
      tip:"Once a scope gap becomes a live variation claim, a fair, well-documented negotiation is almost always cheaper than a prolonged dispute.",
      mistakes:"Prioritizing apparent budget savings at award stage over verifying whether the full scope was actually priced.",
      practice:"Experienced procurement teams often build a small contingency specifically for anticipated variation claims on suspiciously low-priced packages.",
      quiz:{ q:"What is a common red flag in an unusually low bid?",
        options:["A detailed cost breakdown","Missing scope items like testing and commissioning","A bid bond included","A realistic programme"], answer:1 } },
    },
    end_bb:{ ending:{ type:"contract-problem", title:"Contract Problem", stars:1, xp:20,
      what:"The contract was awarded without resolving the original red flag, and when the resulting variation claim was rejected outright, the contractor filed a formal dispute.",
      correct:"Nothing in this path — every decision avoided addressing the underlying scope gap until it became unavoidable.",
      wrong:"Both awarding without clarification and rejecting a claim that had genuine merit instead of negotiating it.",
      tip:"A claim rooted in a real scope gap rarely disappears by being rejected — it usually just escalates into a costlier, slower formal process.",
      mistakes:"Treating claim rejection as a cost-saving move without first assessing whether the underlying claim actually has merit.",
      practice:"Formal disputes over scope gaps in low bids are one of the most common and expensive sources of construction contract litigation.",
      quiz:{ q:"What is a common red flag in an unusually low bid?",
        options:["A detailed cost breakdown","Missing scope items like testing and commissioning","A bid bond included","A realistic programme"], answer:1 } },
    }
  }
}
];
