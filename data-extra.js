/* ============================================================
   IndustrCons Engineering Comics — Expansion Pack (8 new stories)
   Compact generator that builds the same 12-node "decision diamond"
   used by the original stories. Loaded after data.js.
   ============================================================ */
(function(){
  const YOU = "Site Engineer (You)";
  const nm = (k)=> (ROLES[k] && ROLES[k].name) || k;
  const TYPES = { gg:["quality",5], gb:["project-delay",3], bg:["budget",3], bb:["contract-problem",1] };

  function node(sc, roles, sky, A, B, learning, extra){
    const n = { scene:sc, roles, sky,
      dialogue:[ {who:nm(roles[0]), side:"left", text:A}, {who: roles[1]==="site_engineer"?YOU:nm(roles[1]), side:"right", text:B} ],
      learning };
    return Object.assign(n, extra||{});
  }
  const dec = (q, good, bad, g, b)=>({ decision:{ question:q, options:[ {label:"🟢 "+good, type:"good", next:g}, {label:"🔴 "+bad, type:"bad", next:b} ] } });

  function diamond(m, S){
    const [r1,r2,r3] = S.r, [s1,s2,s3] = S.sc, sky = S.sky || ["day","dusk","overcast"];
    const N = {};
    N.n1  = node(s1,[r1,"site_engineer"],sky[0],...S.n1,S.l1,{next:"n2"});
    N.n2  = node(s1,[r1,"site_engineer"],sky[0],...S.n2,S.l2,dec(S.q2,S.o2[0],S.o2[1],"n3a","n3b"));
    N.n3a = node(s2,[r2,"site_engineer"],sky[1],...S.n3a,S.l3a,dec(S.q3a,S.o3a[0],S.o3a[1],"n4gg","n4gb"));
    N.n3b = node(s3,[r3,"site_engineer"],sky[2],...S.n3b,S.l3b,dec(S.q3b,S.o3b[0],S.o3b[1],"n4bg","n4bb"));
    ["gg","gb","bg","bb"].forEach(k=>{
      const sc = k[0]==="g"? s2 : s3;
      N["n4"+k] = node(sc,[k==="gg"?r2:r3, k==="bb"?r1:"site_engineer"],k==="gg"?"sunset":sky[2],...S["n4"+k],S["l4"+k],{next:"end_"+k});
    });
    ["gg","gb","bg","bb"].forEach(k=>{
      const e = S.e[k], t = TYPES[k];
      N["end_"+k] = { ending:{ type:t[0], title:e[0], stars:t[1], xp: [m.xp, Math.round(m.xp*.6), Math.round(m.xp*.5), 25][["gg","gb","bg","bb"].indexOf(k)],
        what:e[1], correct:e[2], wrong:e[3], tip:e[4], mistakes:e[5], practice:e[6], quiz:S.quiz } };
    });
    return Object.assign({
      readTime:6, genres:["Engineering","Construction"], author:"IndustrCons Studio", rating:4.7, start:"n1",
      easterEgg:{ node:"n3a", icon:S.egg[0], name:S.egg[1], hint:S.egg[2] }, nodes:N
    }, m);
  }

  const EX = [];

  // 1 ── PILE WORKS ──────────────────────────────────────────
  EX.push(diamond({ id:"pile-refusal", title:"Pile Refusal at 14 Metres", category:"Piling", difficulty:"Intermediate", xp:190,
    cover:{scene:"site", role:"geotech_eng", sky:"overcast"},
    description:"The rig hits refusal 6 m above the design toe level. Do you trust the blow count, or the borehole log?",
    skills:["Pile Installation","Geotechnical Judgement","Load Testing"], mentor:"Chief Geotechnical Engineer" },
  { r:["geotech_eng","project_manager","qa_engineer"], sc:["site","site","inspection"], egg:["🪨","Odd Boulder","A boulder sits suspiciously near pile P-17."],
    n1:["Pile P-17 hit refusal at 14 m. Design toe is 20 m. The hammer just bounces.","Let's compare the blow-count record against the borehole log before anyone cuts the pile."],
    l1:"Refusal must be checked against the ground investigation — it can mean bedrock, a boulder, or a hammer problem.",
    n2:["The log shows dense sand at 14 m, but BH-3 nearby hit a cobble layer.","Then this could be a boulder, not the bearing stratum. Capacity is not proven."],
    l2:"A premature refusal on an obstruction does not prove design capacity.",
    q2:"The rig operator wants to cut the pile off at 14 m and move on. What do you do?",
    o2:["Hold the pile, request a dynamic load test","Accept refusal and cut off"],
    n3a:["The dynamic test shows only 60% of the design capacity.","Good thing we tested. Re-drive or add a supplementary pile?"],
    l3a:"Dynamic (PDA) testing gives fast capacity evidence without a full static test.",
    q3a:"A designer's review offers two fixes. Which do you adopt?", o3a:["Add two supplementary piles with a revised cap","Re-strike and hope it improves"],
    n3b:["Six weeks later the column above P-17 settles 18 mm during loading.","The pile never reached the bearing layer. We have to act now."],
    l3b:"Settlement during early loading is a warning that pile capacity was never verified.",
    q3b:"Settlement is growing. Do you disclose and order a static load test, or monitor quietly?", o3b:["Disclose and order a static load test","Monitor quietly and say nothing"],
    n4gg:["Supplementary piles are in, cap redesigned, and the static test passes at 1.5× working load.","Zero settlement under full building load."],l4gg:"Proving capacity before loading is far cheaper than repairing after.",
    n4gb:["Re-striking took four days of rig time and the result still needs a verification test.","The programme slips, and the rig standby is charged to us."],l4gb:"A quick re-strike without a clear plan often only buys delay.",
    n4bg:["The static test confirms a shortfall, but we caught it before the superstructure rose.","Underpinning with micropiles is possible, at a cost."],l4bg:"Early disclosure keeps remedial options open.",
    n4bb:["The client's monitoring shows 40 mm differential settlement at handover.","We need a full independent pile integrity review of the whole foundation."],l4bb:"Hidden foundation defects are the costliest kind to discover late.",
    e:{ gg:["Foundation Hero","You refused to accept a refusal blindly, tested the pile and fixed the shortfall before loading.","Pairing logs with load tests.","Nothing — textbook pile QA.","Refusal ≠ capacity: verify with a dynamic or static test.","Assuming a bouncing hammer always means rock.","Pile load tests are mandatory on most major foundations."],
        gb:["Slow Fix","You tested well but chose the weaker remedy and lost days.","Testing first.","Re-striking without a plan.","Choose a remedy with measurable acceptance criteria.","Hoping a re-drive will 'fix' capacity.","Supplementary piles are routine when capacity is short."],
        bg:["Late Save","You hid the problem at first but then disclosed in time to repair it.","Eventually ordering the static test.","Waiting for settlement to appear before acting.","Act on early warning signs; don't wait for numbers to grow.","Believing small settlement will stop by itself.","Micropile underpinning is a common retrofit."],
        bb:["Foundation Failure","You accepted refusal and stayed silent; the client discovered the settlement.","Nothing in this path.","Skipping tests and concealing movement.","Disclosure is cheaper than discovery.","Thinking 18 mm 'is probably fine'.","Late foundation defects trigger independent audits."] },
    quiz:{ q:"What does pile refusal NOT guarantee?", options:["That the pile is stuck","That the design capacity has been reached","That the hammer is working","That the ground is dense"], answer:1 } }));

  // 2 ── TUNNEL ──────────────────────────────────────────────
  EX.push(diamond({ id:"tunnel-convergence", title:"Tunnel Convergence Alarm", category:"Tunnelling", difficulty:"Advanced", xp:230,
    cover:{scene:"inspection", role:"geotech_eng", sky:"night"},
    description:"Convergence pins show the tunnel crown moving faster than predicted. The face crew wants to keep mining.",
    skills:["Ground Monitoring","Tunnel Support","Risk Escalation"], mentor:"Tunnel Design Lead" },
  { r:["geotech_eng","hse_officer","project_manager"], sc:["inspection","site","office"], sky:["night","night","overcast"], egg:["🔦","Lost Torch","A torch glows by the shotcrete wall."],
    n1:["Convergence at chainage 420 is 14 mm/day. Trigger level is 10.","That passes the amber trigger. The Trigger Action Response Plan applies."],
    l1:"Monitoring only works if trigger levels are tied to predefined actions.",
    n2:["Face crew says progress matters. Bolts are in, shotcrete is fresh.","Fresh shotcrete is weak. We should stop and look at the cause first."],
    l2:"Shotcrete gains strength over hours; early loading can overstress it.",
    q2:"Do you pause mining at the face per the plan?", o2:["Pause, add monitoring and review","Keep mining while watching"],
    n3a:["Paused. Extensometers show the ground is still moving ahead of the face.","We can install forepoles and extra rock bolts now."],
    l3a:"Ahead-of-face reinforcement stabilises weak ground before excavating it.",
    q3a:"Designer offers two measures. Which do you approve?", o3a:["Forepoling and shorter advance rounds","Resume full-round advance, add bolts later"],
    n3b:["Two days later the crown shows cracking and a small fall of ground.","Nobody was hurt, but it's close. What now?"],
    l3b:"A small ground fall is a near miss that demands full investigation.",
    q3b:"Do you evacuate and report, or clear it quietly?", o3b:["Evacuate, report, investigate","Clear it quietly"],
    n4gg:["Forepoles and short rounds stabilised the face. Convergence slowed to 2 mm/day.","Advance resumed safely."],l4gg:"Adapting the support to the ground is the heart of observational design.",
    n4gb:["Full rounds resumed but the ground squeezed again, costing a week of repair.","Safe, but slow."],l4gb:"Reverting to the original method ignores what the monitoring told you.",
    n4bg:["The investigation found a fault zone the survey had missed.","Redesign is costly, but nobody was harmed."],l4bg:"Reporting a near miss reveals hidden ground conditions.",
    n4bb:["A second fall injured a miner; the regulator suspended the drive.","The unreported first fall is now part of the inquiry."],l4bb:"Unreported near misses become the evidence in later accident investigations.",
    e:{ gg:["Ground Master","You respected the trigger levels and adapted the support to the ground.","Following the TARP.","Nothing.","Triggers exist to be acted on.","Treating monitoring as paperwork.","Tunnel sites run daily TARP reviews."],
        gb:["Safe but Slow","You stopped on time but chose the faster, weaker method.","Pausing at the amber trigger.","Reverting to full rounds.","Match the advance to the ground.","Assuming fresh support is fully effective.","Shorter rounds are a standard response in weak ground."],
        bg:["Costly Lesson","You kept mining but then reported the near miss honestly.","Reporting the fall.","Mining past an amber trigger.","Escalate when triggers pass.","Believing a small fall is 'normal'.","Near-miss reports prevent major accidents."],
        bb:["Site Shutdown","You ignored the trigger and hid a fall; a worker was injured.","Nothing.","Ignoring alarms and concealing incidents.","Silence turns near misses into injuries.","Thinking no injury means no incident.","Regulators can suspend works after concealed incidents."] },
    quiz:{ q:"What is a TARP in tunnelling?", options:["A waterproof cover","A Trigger Action Response Plan","A type of shotcrete","A survey tool"], answer:1 } }));

  // 3 ── ENVIRONMENT ─────────────────────────────────────────
  EX.push(diamond({ id:"silt-runoff", title:"Silty Runoff After the Storm", category:"Environmental", difficulty:"Beginner", xp:150,
    cover:{scene:"site", role:"hse_officer", sky:"overcast"},
    description:"Heavy rain sends muddy water toward a neighbouring stream. The silt fence has failed.",
    skills:["Erosion Control","Environmental Compliance","Incident Reporting"], mentor:"Environmental Manager" },
  { r:["hse_officer","project_manager","client"], sc:["site","site","office"], sky:["overcast","day","overcast"], egg:["🐸","Little Frog","A frog watches from the settlement pond."],
    n1:["The silt fence collapsed. Brown water is reaching the stream.","Stop the flow first, then inspect the controls."],
    l1:"Contain discharge first; investigate second.",
    n2:["Our permit limits suspended solids. We have no sample yet.","We must sample upstream and downstream now."],
    l2:"Evidence of impact (or its absence) is built with timely samples.",
    q2:"The regulator hasn't noticed. Do you notify them?", o2:["Notify the regulator and sample","Wait and see if it clears"],
    n3a:["Regulator thanks us for notifying. They want a corrective action plan.","Add a sediment basin and check dams?"],
    l3a:"A basin plus check dams slows flow and settles solids.",
    q3a:"Which corrective plan do you adopt?", o3a:["Sediment basin, check dams, daily inspection","Replace the fence only"],
    n3b:["A resident photographs the muddy stream and posts it online.","The regulator calls: why didn't we report?"],
    l3b:"Unreported discharges are discovered by third parties surprisingly fast.",
    q3b:"Do you admit the failure and fix it, or deny it?", o3b:["Admit and fix it","Deny it"],
    n4gg:["Basin installed, no further breach. Regulator closes the case with no penalty.","Residents appreciate the quick action."],l4gg:"Transparent response preserves your licence to operate.",
    n4gb:["The new fence failed again in the next storm.","A warning notice was issued."],l4gb:"A like-for-like replacement does not fix a design problem.",
    n4bg:["You admitted the failure and installed a basin, but a fine still applies.","The client is unhappy but accepts the plan."],l4bg:"Late honesty reduces, but doesn't remove, penalties.",
    n4bb:["Photos prove the discharge. The regulator issues a stop-work notice.","The client threatens to terminate."],l4bb:"Denial after evidence is the most damaging response.",
    e:{ gg:["Green Guardian","You contained, notified and fixed it properly.","Notify early, fix properly.","Nothing.","Report first, then fix.","Hoping rain will wash it away.","Sediment basins are standard on most earthwork sites."],
        gb:["Half Fix","You reported but chose a weak fix.","Reporting.","Replacing only the fence.","Fix the cause, not just the symptom.","Assuming the same fence will cope.","Basins and check dams complement fences."],
        bg:["Honest, but Late","You delayed but then admitted the failure.","Admitting it.","Waiting to report.","Report immediately.","Hoping it clears.","Early notification often reduces penalties."],
        bb:["Stop-Work Notice","You denied a documented discharge.","Nothing.","Denial.","Evidence beats denial.","Believing nobody noticed.","Social media makes concealment unrealistic."] },
    quiz:{ q:"What should you do first when a silt fence fails?", options:["Write a report","Contain the discharge","Call the client","Replace the fence"], answer:1 } }));

  // 4 ── MEP ────────────────────────────────────────────────
  EX.push(diamond({ id:"mep-clash", title:"The Duct vs. Beam Clash", category:"MEP Coordination", difficulty:"Intermediate", xp:180,
    cover:{scene:"building", role:"mep_eng", sky:"day"},
    description:"A large HVAC duct collides with a transfer beam on level 3 — discovered after the beam is poured.",
    skills:["Clash Detection","BIM Coordination","Change Management"], mentor:"BIM Coordinator" },
  { r:["mep_eng","bim_engineer","client"], sc:["building","office","office"], egg:["📐","Hidden Scale","A scale ruler hides on the drawing table."],
    n1:["The 600 mm duct runs straight through the transfer beam on level 3.","Check the latest model against the shop drawings."],
    l1:"Clashes between trades are cheapest to fix in the model, not on site.",
    n2:["The clash was flagged in the model last month but nobody closed it out.","We need a decision now, before the ceiling closes in."],
    l2:"Unresolved clash reports are a process failure, not just a design one.",
    q2:"How do you proceed?", o2:["Raise an RFI and agree a coordinated fix","Ask the crew to cut the beam"],
    n3a:["The structural engineer suggests a sleeve through the beam web, or rerouting.","Both are possible. Which wins?"],
    l3a:"Beam penetrations must be approved and detailed by the structural engineer.",
    q3a:"Which option do you take?", o3a:["Reroute the duct below, in agreed zone","Core a big hole in the beam web"],
    n3b:["Crew cored a hole; a crack appears near the beam's support.","Structural engineer is furious."],
    l3b:"Unapproved penetrations can destroy shear capacity.",
    q3b:"Do you report and strengthen, or patch and hide?", o3b:["Report and strengthen","Patch and hide"],
    n4gg:["Ductwork rerouted with a small ceiling drop agreed by the architect.","No structural change, no delay."],l4gg:"Coordinated rerouting is the safest fix.",
    n4gb:["The beam penetration was approved, but extra checks added a week.","Cost: modest."],l4gb:"A sound but heavier fix costs time.",
    n4bg:["The beam was strengthened with carbon-fibre plating; costs rose.","Safe, but expensive."],l4bg:"Reporting allowed an engineered repair.",
    n4bb:["Crack grew; load test failed at handover.","Level 3 closed pending reconstruction."],l4bb:"Concealed structural damage is the worst outcome.",
    e:{ gg:["Coordination Ace","You used the RFI process and chose the cleanest fix.","Using RFIs.","Nothing.","Close clashes before pouring.","Letting clash reports sit.","Weekly coordination meetings catch clashes early."],
        gb:["Heavy Fix","Approved fix, but slower.","Asking the engineer.","Choosing the heavier fix.","Prefer the lighter, cleaner option.","Assuming any hole is okay.","Penetration zones should be planned."],
        bg:["Pricey Repair","Mistake, but you reported it.","Reporting.","Cutting without approval.","Approvals first.","Cutting first.","Strengthening is standard."],
        bb:["Beam Failure","You cut without approval and hid the crack.","Nothing.","Unapproved cutting and concealment.","Never conceal structural damage.","Patching cracks.","Load tests find hidden damage."] },
    quiz:{ q:"Who must approve a hole in a structural beam?", options:["The MEP foreman","The structural engineer","The client","Anyone on site"], answer:1 } }));

  // 5 ── PLANNING ───────────────────────────────────────────
  EX.push(diamond({ id:"critical-path-slip", title:"The Critical Path Slips", category:"Planning & Scheduling", difficulty:"Intermediate", xp:170,
    cover:{scene:"meeting", role:"planning_eng", sky:"day"},
    description:"A late steel delivery pushes the critical path. The client wants a recovery plan by Friday.",
    skills:["Critical Path Method","Schedule Recovery","Stakeholder Communication"], mentor:"Senior Planner" },
  { r:["planning_eng","project_manager","client"], sc:["meeting","office","office"], egg:["📅","Wall Calendar","Someone circled Friday in red."],
    n1:["The steel delivery is 3 weeks late. It's on the critical path.","So the completion date moves unless we recover time."],
    l1:"A delay to a critical activity delays the finish date day-for-day.",
    n2:["We could add shifts, resequence, or ask for an extension.","Which is cheapest depends on float and resource availability."],
    l2:"Recovery options trade time against cost and risk.",
    q2:"How do you build the recovery plan?", o2:["Analyse float, resequence and cost options","Promise the original date without analysis"],
    n3a:["Resequencing the façade and fit-out saves 10 days at no cost.","We can also add a second shift for the rest."],
    l3a:"Resequencing non-critical work into the gap is the cheapest recovery.",
    q3a:"Do you present options with costs to the client?", o3a:["Yes — with costs and risks","Only show the cheapest, hide risks"],
    n3b:["Two weeks pass with no recovery. The programme is now 5 weeks late.","The client demands answers."],
    l3b:"Promising dates without analysis erodes trust.",
    q3b:"Do you admit and reforecast, or blame the supplier?", o3b:["Admit and reforecast","Blame the supplier"],
    n4gg:["The client chose option B and approved a small premium.","Completion is held within 3 days of target."],l4gg:"Transparent options let clients make informed trade-offs.",
    n4gb:["Hidden risks surfaced; the second shift failed to deliver.","Delay of 10 days."],l4gb:"Hiding risks undermines recovery plans.",
    n4bg:["Honest reforecast gives a realistic date; the client is annoyed but supportive.","Costs are known."],l4bg:"A realistic date is better than a fantasy.",
    n4bb:["Supplier blame fails; liquidated damages apply.","Relations break down."],l4bb:"Blame doesn't change contract obligations.",
    e:{ gg:["Schedule Strategist","Float analysis, options and honesty.","Transparent options.","Nothing.","Present options with costs and risks.","Promising before analysing.","CPM tools support recovery planning."],
        gb:["Risky Plan","Partial transparency backfired.","Presenting options.","Hiding risks.","Share risks too.","Selective reporting.","Risk registers belong in recovery plans."],
        bg:["Late Honesty","You corrected course.","Reforecasting.","Delaying analysis.","Do it early.","Waiting.","Early reforecasting helps."],
        bb:["Damages Applied","You blamed instead of planned.","Nothing.","Blame.","Own the plan.","Hoping for luck.","LDs are enforced strictly."] },
    quiz:{ q:"What does a delay on the critical path cause?", options:["Nothing","A delay to project completion","Extra float","A cost saving"], answer:1 } }));

  // 6 ── COST CONTROL ───────────────────────────────────────
  EX.push(diamond({ id:"cost-overrun-alert", title:"The 12% Cost Overrun", category:"Cost Control", difficulty:"Intermediate", xp:170,
    cover:{scene:"office", role:"qs", sky:"overcast"},
    description:"Monthly cost report shows concrete and rebar tracking 12% over budget. Variation claims are unrecorded.",
    skills:["Cost Reporting","Variation Management","Forecasting"], mentor:"Commercial Manager" },
  { r:["qs","project_manager","client"], sc:["office","office","meeting"], egg:["🧮","Old Calculator","A battered calculator sits on the desk."],
    n1:["Concrete and rebar are 12% over budget this month.","Let's find whether it's quantity, price or waste."],
    l1:"Variance analysis separates quantity, rate and waste effects.",
    n2:["Waste on site is high, and three client-instructed changes were never priced.","We lost the right to claim if we don't notify in time."],
    l2:"Variation notices have contractual time limits.",
    q2:"What is your first action?", o2:["Notify variations formally and reforecast","Absorb the cost quietly"],
    n3a:["Notices submitted in time. Client agrees two of three variations.","The third is disputed."],
    l3a:"Contemporary records win variation disputes.",
    q3a:"How do you handle the disputed variation?", o3a:["Submit records and negotiate","Drop it to keep the peace"],
    n3b:["The month-end report shows a 17% overrun and nobody can explain it.","The director asks why you didn't flag it."],
    l3b:"Unflagged overruns compound.",
    q3b:"Do you present a full recovery plan, or blame site waste?", o3b:["Present a recovery plan","Blame site waste"],
    n4gg:["Records supported all variations. Overrun cut to 3%.","Client signs the variation order."],l4gg:"Good records equal recovered money.",
    n4gb:["The disputed variation was lost; overrun settles at 7%.","Lesson learned."],l4gb:"Dropping valid claims costs real money.",
    n4bg:["Recovery plan trims overrun to 9%, but time claims were missed.","Partial recovery."],l4bg:"Late action recovers less.",
    n4bb:["Overrun hits 20%; the director removes you from the commercial lead.","Margin is gone."],l4bb:"Blame does not recover money.",
    e:{ gg:["Commercial Ace","Early notices and records.","Notice and record.","Nothing.","Notify variations immediately.","Absorbing costs silently.","Monthly cost reports are standard."],
        gb:["Left Money Behind","You dropped a valid claim.","Notices.","Dropping the claim.","Pursue valid claims.","Avoiding conflict.","Negotiation is routine."],
        bg:["Partial Recovery","Late but useful action.","Recovery plan.","Waiting.","Be early.","Delay.","Early action recovers more."],
        bb:["Margin Lost","Blame instead of plan.","Nothing.","Blaming.","Own the numbers.","Ignoring.","Overruns compound."] },
    quiz:{ q:"Why must variation notices be timely?", options:["Tradition","Contracts set time limits for claims","To please auditors","They don't need to be"], answer:1 } }));

  // 7 ── EARTHWORKS ─────────────────────────────────────────
  EX.push(diamond({ id:"compaction-fail", title:"Compaction Test Fails", category:"Earthworks", difficulty:"Beginner", xp:150,
    cover:{scene:"road", role:"highway_eng", sky:"day"},
    description:"Field density tests on the embankment came back at 92% — the spec demands 95%.",
    skills:["Compaction Control","Field Testing","Material Selection"], mentor:"Roads Engineer" },
  { r:["highway_eng","geotech_eng","project_manager"], sc:["road","road","office"], egg:["🚜","Toy Roller","A toy roller sits on the dashboard."],
    n1:["Nuclear density test gave 92% MDD. Spec is 95%.","That layer fails. Check moisture content first."],
    l1:"Compaction depends on moisture content as much as roller passes.",
    n2:["Moisture is 4% above optimum, after last night's rain.","More passes will only pump the soil."],
    l2:"Over-wet soil can't be compacted; it must be dried or replaced.",
    q2:"What do you instruct?", o2:["Scarify, dry back and recompact","Add roller passes and hope"],
    n3a:["After drying, density reaches 96%.","The next layer is ready."],
    l3a:"Drying back and recompacting restores the layer.",
    q3a:"Before the next layer, do you retest this layer and document?", o3a:["Yes — log the test and approve the layer","Skip the retest"],
    n3b:["After extra passes, the surface is rutted and pumping.","Another test shows 90%."],
    l3b:"Extra passes on wet soil make it worse.",
    q3b:"Do you cut it out and rebuild, or cover it?", o3b:["Cut out and rebuild","Cover with the next layer"],
    n4gg:["All layers pass, and the embankment is accepted.","No settlement after surcharge."],l4gg:"Process discipline equals performance.",
    n4gb:["The unlogged layer is questioned by the auditor.","Retesting needed."],l4gb:"No record, no acceptance.",
    n4bg:["Rebuild cost three days, but the embankment is sound.","Painful, but correct."],l4bg:"Replacing failed layers is expected.",
    n4bb:["The buried weak layer causes road settlement after six months.","Pavement must be rebuilt."],l4bb:"Covering failures just hides them.",
    e:{ gg:["Earthworks Pro","Dry-back, retest, log.","Controlling moisture.","Nothing.","Test, then build.","Over-rolling wet soil.","Moisture control is key."],
        gb:["Paper Gap","Good work, poor records.","Dry-back.","Skipping record.","Always log.","Skipping.","Audits check records."],
        bg:["Rebuild Needed","Honest fix after mistake.","Cutting out.","Over-rolling.","Be patient.","Rushing.","Rebuild is routine."],
        bb:["Road Settles","You buried a failed layer.","Nothing.","Covering.","Never hide.","Hoping.","Settlement shows up later."] },
    quiz:{ q:"What affects compaction most besides roller passes?", options:["Soil colour","Moisture content","Weather forecast","Roller colour"], answer:1 } }));

  // 8 ── FALL PROTECTION ────────────────────────────────────
  EX.push(diamond({ id:"edge-protection", title:"Missing Edge Protection", category:"Site Safety", difficulty:"Beginner", xp:160,
    cover:{scene:"building", role:"hse_officer", sky:"sunset"},
    description:"Level 6 slab edge has no guardrail while the crew prepares to start formwork.",
    skills:["Work at Height","Permit to Work","Safety Leadership"], mentor:"HSE Director" },
  { r:["hse_officer","formwork_eng","project_manager"], sc:["building","building","office"], sky:["sunset","day","overcast"], egg:["⛑️","Spare Helmet","A spare helmet hangs on a rebar."],
    n1:["Level 6 edge has no guardrail and the crew is starting in ten minutes.","Stop work at that edge until protection is installed."],
    l1:"Edge protection must be in place before work at height begins.",
    n2:["The foreman says it'll cost them an hour.","An hour is cheaper than a fall."],
    l2:"Falls from height are a leading cause of construction fatalities.",
    q2:"Do you stop work and install guardrails?", o2:["Stop work, install guardrails","Allow work with harnesses only"],
    n3a:["Guardrails installed in 40 minutes. Crew thanks you for the clarity.","Now the toe-boards and nets."],
    l3a:"Collective protection beats personal protection.",
    q3a:"Do you also require a permit-to-work and daily inspection?", o3a:["Yes — permit and daily inspection","No — it's already fine"],
    n3b:["A worker slips near the edge but is caught by a colleague.","Near miss! The crew is shaken."],
    l3b:"A harness without a proper anchor isn't protection.",
    q3b:"Do you stop all work and report the near miss, or move on?", o3b:["Stop work and report","Move on quietly"],
    n4gg:["Daily inspections found a loose guardrail post early.","Zero incidents on level 6."],l4gg:"Inspections catch problems before they matter.",
    n4gb:["A nets-free corner was missed; an audit flags it.","Corrective action required."],l4gb:"Partial compliance is still non-compliance.",
    n4bg:["Reporting the near miss led to new anchor points and training.","Everyone is safer."],l4bg:"Near-miss reports drive improvements.",
    n4bb:["A week later, a worker falls and is seriously injured.","The regulator investigates."],l4bb:"Ignored near misses often precede serious injuries.",
    e:{ gg:["Safety Leader","You stopped work and built a system.","Stopping unsafe work.","Nothing.","Stop work authority saves lives.","Relying on harnesses alone.","Permits and inspections are standard."],
        gb:["Almost There","Good start, incomplete follow-up.","Guardrails.","Skipping inspection.","Inspect daily.","Assuming OK.","Audits find gaps."],
        bg:["Learned in Time","You acted after a near miss.","Reporting.","Waiting.","Act early.","Delay.","Near-miss reporting works."],
        bb:["Serious Injury","You ignored a near miss.","Nothing.","Ignoring.","Never ignore.","Silence.","Regulators investigate."] },
    quiz:{ q:"Which protection is preferred at a slab edge?", options:["Personal harness only","Collective guardrails","A warning sign","Nothing if careful"], answer:1 } }));

  // register
  EX.forEach(s=>{
    if(!CATEGORIES.includes(s.category)) CATEGORIES.push(s.category);
    if(!STORIES.some(x=>x.id===s.id)) STORIES.push(s);
  });
})();
