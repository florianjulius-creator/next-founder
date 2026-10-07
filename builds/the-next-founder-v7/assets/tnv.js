/* The Next Founder: ventures, founders, the venture lightbox and the interview with Eva, in Dutch and English.
   Scripted prototype: Eva speaks with the browser's own voice, nothing is recorded or sent. */
(function(){
const LANG=(document.documentElement.lang||'nl').slice(0,2)==='en'?'en':'nl';
const T=(nl,en)=>LANG==='en'?en:nl;
const P=(window.TNV_ROOT||'')+'assets/img/';

const people=[
 ["barbara-van-erp","Barbara van Erp","Founder","Saar Magazine","Bouwde Saar uit tot een magazine voor vrouwen van 50+ met 20.000 abonnees.","Built Saar into a magazine for women over 50 with 20,000 subscribers.",["Media","Abonnementen","Doelgroep 50+"],["Media","Subscriptions","Audience 50+"]],
 ["bas-blokhuis","Bas Blokhuis","Founder","Dharma","Leidt al 17 jaar softwarebureau Dharma, voor zorg en impactorganisaties.","Has run the software agency Dharma for 17 years, for healthcare and impact organisations.",["Software","Zorg","Impact"],["Software","Healthcare","Impact"]],
 ["emilie-oostenbroek","Emilie Oostenbroek","Founder","AIM","Was Head of Growth & Experience bij Adyen en runt nu haar eigen CX-bureau AIM.","Was Head of Growth & Experience at Adyen and now runs her own CX agency, AIM.",["Groei","Klantervaring","Fintech"],["Growth","Customer experience","Fintech"]],
 ["florian-julius","Florian Julius","Founder","Breinpro AI","Webdeveloper van Texel die AI-bouwer werd: praktische AI voor kleine bedrijven.","A web developer from Texel turned AI builder: practical AI for small businesses.",["AI","Webontwikkeling","MKB"],["AI","Web development","SMB"]],
 ["hugo-hemmen","Hugo Hemmen","Founder","Gapstars","Bouwde Gapstars uit tot zo'n 300 mensen in tech- en financeteams op afstand.","Grew Gapstars to some 300 people in remote tech and finance teams.",["Teams op afstand","Tech-werving","Opschalen"],["Remote teams","Tech hiring","Scaling"]],
 ["jeroen-derwort","Jeroen Derwort","Founder","Dutch Games Association","Maakte in 2001 Online Soccer Manager op zolder en is nu voorzitter van de Dutch Games Association.","Made Online Soccer Manager in his attic in 2001 and now chairs the Dutch Games Association.",["Games","Community","Branche"],["Games","Community","Industry"]],
 ["joachim-de-boer","Joachim de Boer","Founder","De Online Drogist","Richtte in 2007 De Online Drogist mee op, nu de grootste online drogist van Nederland.","Co-founded De Online Drogist in 2007, now the largest online drugstore in the Netherlands.",["E-commerce","Retail","Opschalen"],["E-commerce","Retail","Scaling"]],
 ["lenneke-van-ingen","Lenneke van Ingen","Founder","A Million Faces","Serieel ondernemer achter casting- en talentbureau A Million Faces.","Serial entrepreneur behind the casting and talent agency A Million Faces.",["Talent","Casting","Serieel ondernemen"],["Talent","Casting","Serial founder"]],
 ["lisa-wals","Lisa Wals","Founder","Iconic Design Objects","Maakt van de beeldwereld van kunstenaars en merken verzamelobjecten en art toys.","Turns the worlds of artists and brands into collectibles and art toys.",["Design","Merken","Verzamelobjecten"],["Design","Brands","Collectibles"]],
 ["marco-nobel","Marco Nobel","Founder","Fuse","Oprichter van studentenhuisvester Fuse, angel investor en DJ.","Founder of the student housing company Fuse, angel investor and DJ.",["Vastgoed","Investeren","Muziek"],["Real estate","Investing","Music"]],
 ["marleen-evertsz","Marleen Evertsz","Founder","GoldRepublic","Was directeur bij Optiver en werd serieel fintech-founder: GoldRepublic, Nxchange en Digital Notary.","A former director at Optiver who became a serial fintech founder: GoldRepublic, Nxchange and Digital Notary.",["Fintech","Handel","Serieel ondernemen"],["Fintech","Trading","Serial founder"]],
 ["mike-van-klaveren","Mike van Klaveren","Founder","Elektramat","Leidt Elektramat, de online elektrogroothandel die groeide naar zo'n 300 mensen.","Runs Elektramat, the online electrical wholesaler that grew to some 300 people.",["E-commerce","Groothandel","Opschalen"],["E-commerce","Wholesale","Scaling"]],
 ["nick-velten","Nick Velten","Founder","Hello World","Twee exits (Stimmt, Fangage). Investeert nu en zoekt een DTC-merk om over te nemen.","Two exits (Stimmt, Fangage). Now invests and is looking for a DTC brand to acquire.",["Exit","Investeren","DTC-merken"],["Exit","Investing","DTC brands"]],
 ["niels-verwij","Niels Verwij","Founder","Dekbed Discounter","Begon Dekbed Discounter met 5.000 euro van zijn ouders. Het groeide voorbij 100 miljoen omzet.","Started Dekbed Discounter with 5,000 euros from his parents. It grew past 100 million in revenue.",["E-commerce","Bootstrappen","Opschalen"],["E-commerce","Bootstrapping","Scaling"]],
 ["pepijn-meddens","Pepijn Meddens","Founder","Billink","Medeoprichter van achterafbetaler Billink en venture builder bij TMM Ventures.","Co-founder of the pay-later company Billink and venture builder at TMM Ventures.",["Fintech","Betalen","Venture building"],["Fintech","Payments","Venture building"]],
 ["stefan-witkamp","Stefan Witkamp","Founder","Homey","Medeoprichter en CEO van smart-homeplatform Homey, sinds 2024 voor de meerderheid van LG.","Co-founder and CEO of the smart home platform Homey, majority owned by LG since 2024.",["Hardware","Smart home","Exit"],["Hardware","Smart home","Exit"]],
 ["timothy-scheek","Timothy Scheek","Founder","Saef","Verkocht Mayht aan Sonos en bouwt nu Saef: onzichtbare diefstalbeveiliging voor luxe horloges.","Sold Mayht to Sonos and now builds Saef: invisible theft protection for luxury watches.",["Hardware","Exit","Beveiliging"],["Hardware","Exit","Security"]],
 ["alex-butter","Alex Butter","Builder","GoldRepublic","CTO van GoldRepublic en Nxchange, en eerder al bij House of Founders.","CTO of GoldRepublic and Nxchange, and at House of Founders before.",["Techniek","Fintech"],["Engineering","Fintech"]],
 ["giorgio-orsucci","Giorgio Orsucci","Builder","Builders","Product- en systeemontwerper bij startupstudio Builders.","Product and systems designer at the startup studio Builders.",["Product","Systeemontwerp","AI"],["Product","Systems design","AI"]],
 ["sander-belaen","Sander Belaen","Builder","Century","Indie-appbouwer achter Century, een Whoop-alternatief voor het horloge dat je al draagt.","Indie app maker behind Century, a Whoop alternative for the watch you already wear.",["Apps","Gezondheid","Indie"],["Apps","Health","Indie"]],
 ["wouter-van-den-hoven","Wouter van den Hoven","Builder","Vesper","CTO van Vesper: een AI-platform voor grondstoffenmarkten in food en landbouw.","CTO of Vesper: an AI platform for commodity markets in food and agriculture.",["Techniek","AI","Food en landbouw"],["Engineering","AI","Food and agriculture"]],
 ["ruben-maas","Ruben Maas","Builder","Seatchamp","CTO van Seatchamp, dat complete sportreizen verkoopt.","CTO of Seatchamp, which sells complete sports trips.",["Techniek","Reizen","AI"],["Engineering","Travel","AI"]],
 ["guido-schmitz","Guido Schmitz","Builder","Oneteam","Richtte Oneteam op zijn negentiende op: de app voor medewerkers in de frontlinie.","Founded Oneteam at nineteen: the app for frontline employees.",["Apps","HR-tech","Frontlinie"],["Apps","HR tech","Frontline"]],
 ["martin-deumens","Martin Deumens","Builder","BLEACH","Merkontwerper uit de Maastrichtse scene die net creatief bureau BLEACH begon.","Brand designer from the Maastricht scene who just started the creative agency BLEACH.",["Merk","Design"],["Brand","Design"]],
 ["gwen","Gwen Nijs","Builder","BLEACH","Merk- en digitaal ontwerper, medeoprichter van BLEACH.","Brand and digital designer, co-founder of BLEACH.",["Merk","Digitaal ontwerp"],["Brand","Digital design"]]
].map(([id,name,group,company,lnl,len,tnl,ten])=>({id,name,group,company,line:T(lnl,len),tags:T(tnl,ten),photo:P+'founders/'+id+'.webp'}));

const deel2=()=>({level:'sketch',origin:T('Gepitcht in Deel II','Pitched at Part II'),proof:[1,0,0,0,0],
 has:T(['Pitch in Deel II op 5 oktober 2026, met probleem en oplossing uitgewerkt','Makers die de overdracht begeleiden'],['Pitched at Part II on 5 October 2026, with the problem and the solution worked out','Makers who guide the handover']),
 lacks:T(['Een eigenaar die fulltime doorpakt en de eerste betalende klant binnenhaalt','BV en overdrachtsakte'],['An owner who goes full time and lands the first paying customer','A company and a transfer deed'])});
const ventures=[
 {...deel2(),id:'exit-buddy',name:'Exit Buddy',line:T('Vindt de juiste begeleider voor de exit van je bedrijf.','Finds the right adviser for selling your business.'),topic:T('ondernemers die hun bedrijf willen verkopen','business owners who want to sell their company')},
 {...deel2(),id:'apk-opa',name:'APK Opa',line:T('Gepensioneerde monteurs keuren je tweedehands auto voordat je koopt.','Retired mechanics inspect a used car before you buy it.'),topic:T('mensen die een tweedehands auto kopen','people buying a used car')},
 {...deel2(),id:'whoop-dog',name:'Whoop Dog',line:T('Een tracker die meet hoe je hond slaapt en herstelt.','A tracker that measures how your dog sleeps and recovers.'),topic:T('hondenbezitters','dog owners')},
 {...deel2(),id:'eitje',name:'Eitje',line:T('Een vruchtbaarheidscheck voor vrouwen.','A fertility check for women.'),topic:T('vrouwen die willen weten waar ze staan','women who want to know where they stand')},
 {...deel2(),id:'zonde',name:'Zonde',line:T('Helpt huishoudens verder als hun zonnepanelen straks niets meer opbrengen.','Helps households once their solar panels stop paying off.'),topic:T('huishoudens met zonnepanelen','households with solar panels')},
 {id:'biedmeester',name:'Biedmeester',line:T('Een AI die de Google Ads van meerdere klanten bewaakt, uitlegt en bijstuurt.','An AI that watches, explains and adjusts the Google Ads of several clients.'),level:'turnkey',origin:T('Ingebracht door Florian Julius','Brought in by Florian Julius'),seeks:T('Commerciële CEO','Commercial CEO'),proof:[1,1,1,0,0],topic:T('bureaus die Google Ads voor klanten beheren','agencies that run Google Ads for clients'),
  has:T(['Werkend platform: signaleert afwijkingen, legt ze in gewone taal uit en stelt wijzigingen voor','Elke wijziging met akkoord en terugdraaiknop','Draait live met de eerste pilotaccounts'],['A working platform: it flags anomalies, explains them in plain language and proposes changes','Every change needs approval and can be rolled back','Live with the first pilot accounts']),
  lacks:T(['Klanten op schaal en iemand die de verkoop trekt','BV en IP-akte'],['Customers at scale and someone to lead sales','A company and an IP deed'])},
 {id:'vaste-prik',name:'Vaste Prik',line:T('Digitale stempelkaarten in Apple en Google Wallet, zonder app.','Digital loyalty cards in Apple and Google Wallet, no app needed.'),level:'turnkey',origin:T('Ingebracht door Florian Julius','Brought in by Florian Julius'),seeks:T('Commerciële CEO','Commercial CEO'),proof:[1,1,0,0,0],topic:T('zaken in horeca en detailhandel','cafés, restaurants and shops'),
  has:T(['Stempelkaarten in Apple en Google Wallet, zonder app voor de klant','Scanner-webapp voor personeel en een dashboard voor de zaak','Live en klaar voor de eerste zaken'],['Loyalty cards in Apple and Google Wallet, with no app for the customer','A scanner web app for staff and a dashboard for the business','Live and ready for the first businesses']),
  lacks:T(['De eerste betalende zaken in horeca en detailhandel','BV en IP-akte'],['The first paying businesses in hospitality and retail','A company and an IP deed'])}
];

/* ten more ventures as mockups for the prototype (marked mock: true) */
const MOCK=(id,name,nl,en,level,tnl,ten)=>({id,name,line:T(nl,en),level,mock:true,origin:T('Voorbeeld voor het prototype','Example for the prototype'),proof:level==='turnkey'?[1,1,1,1,0]:level==='prototype'?[1,1,0,0,0]:[1,0,0,0,0],topic:T(tnl,ten),
 has:level==='turnkey'?T(['Werkend product met betalende klanten','BV opgericht'],['A working product with paying customers','A company in place']):level==='prototype'?T(['Werkend prototype','Eerste gesprekken met klanten'],['A working prototype','First conversations with customers']):T(['Idee uitgewerkt en getest in gesprekken','Makers die de overdracht begeleiden'],['Idea worked out and tested in conversations','Makers who guide the handover']),
 lacks:T(['Een founder die fulltime doorpakt','Financiering voor de eerste fase'],['A founder who goes full time','Funding for the first phase'])});
ventures.push(
 MOCK('fietsdokter','Fietsdokter','Een fietsenmaker die bij je thuis of op kantoor langskomt, op abonnement.','A bike mechanic who comes to your home or office, on subscription.','prototype','forenzen en bedrijven met fietsers','commuters and companies with cyclists'),
 MOCK('klusbieb','Klusbieb','Leen gereedschap van je buren, per dag.','Borrow tools from your neighbours, by the day.','sketch','huishoudens die af en toe klussen','households that do the odd job'),
 MOCK('oogstrijk','Oogstrijk','Overschot van boeren direct naar restaurants.','Farm surplus straight to restaurants.','prototype','restaurants en boeren','restaurants and farmers'),
 MOCK('stille-uren','Stille Uren','Boek een rustige werkplek in een café, per uur.','Book a quiet seat in a café, by the hour.','sketch','zelfstandigen die buiten de deur werken','freelancers who work away from home'),
 MOCK('kinderkast','Kinderkast','Een kledingabonnement voor kinderen, tweedehands en meegroeiend.','A clothing subscription for kids, second hand and growing with them.','turnkey','ouders van jonge kinderen','parents of young children'),
 MOCK('pensioenpraat','Pensioenpraat','Legt zzp\'ers in vijf minuten uit wat ze voor hun pensioen moeten doen.','Explains to freelancers in five minutes what to do about their pension.','sketch','zzp\'ers','freelancers'),
 MOCK('beweegmaatje','Beweegmaatje','Koppelt ouderen aan een wandelmaatje uit de buurt.','Matches older people with a walking buddy nearby.','sketch','ouderen en hun familie','older people and their families'),
 MOCK('bouwlog','Bouwlog','Een digitaal logboek voor aannemers, ingesproken op de bouwplaats.','A digital site diary for contractors, dictated on site.','prototype','aannemers','contractors'),
 MOCK('zorgrooster','Zorgrooster','Een AI die roosters maakt voor de thuiszorg.','An AI that builds rosters for home care.','prototype','thuiszorgorganisaties','home care organisations'),
 MOCK('bakdeel','Bakdeel','Deel een bakfiets met je straat.','Share a cargo bike with your street.','turnkey','gezinnen in de stad','families in the city')
);
/* V5: sector and the roles each venture is looking for (placeholders to confirm with the makers) */
const SECTORS={fin:T('Fintech','Fintech'),care:T('Zorg','Care'),mob:T('Mobiliteit','Mobility'),energy:T('Energie','Energy'),retail:T('Retail en horeca','Retail and hospitality'),ai:T('AI en marketing','AI and marketing'),food:T('Food','Food'),build:T('Bouw','Construction'),pets:T('Huisdieren','Pets'),share:T('Delen en circulair','Sharing and circular')};
const ROLE={ceo:T('CEO, commercieel','CEO, commercial'),cto:T('CTO, technisch','CTO, technical'),cmo:T('CMO, marketing','CMO, marketing')};
const ROLE_S={ceo:'CEO',cto:'CTO',cmo:'CMO'};
const META={'exit-buddy':['fin',['ceo','cmo']],'apk-opa':['mob',['ceo','cmo']],'whoop-dog':['pets',['cto','ceo']],'eitje':['care',['ceo','cto']],'zonde':['energy',['ceo']],'biedmeester':['ai',['ceo','cmo']],'vaste-prik':['retail',['ceo','cmo']],'fietsdokter':['mob',['ceo']],'klusbieb':['share',['cto','cmo']],'oogstrijk':['food',['ceo']],'stille-uren':['retail',['cmo']],'kinderkast':['share',['ceo','cmo']],'pensioenpraat':['fin',['cto','cmo']],'beweegmaatje':['care',['ceo']],'bouwlog':['build',['cto']],'zorgrooster':['care',['cto','ceo']],'bakdeel':['mob',['ceo']]};
ventures.forEach(v=>{v.sector=META[v.id][0];v.roles=META[v.id][1]});
/* V7: six founder skills, what each venture's team already has (example data, 0 to 3), the founder profile and the match */
const SKILLS=[['sales',T('Verkoop','Sales')],['marketing',T('Marketing','Marketing')],['product',T('Product','Product')],['tech',T('Techniek','Engineering')],['ops',T('Operatie','Operations')],['finance',T('Financiën','Finance')]];
const SKL=Object.fromEntries(SKILLS);
const RSK={ceo:['sales','ops'],cto:['tech','product'],cmo:['marketing']};
const hsh=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const TEAM=Object.fromEntries(ventures.map(v=>{const need=new Set(v.roles.flatMap(r=>RSK[r]));const t={};SKILLS.forEach(([k])=>{t[k]=need.has(k)?hsh(v.id+k)%2:2+hsh(v.id+k)%2});return [v.id,t]}));
const PKEY='tnf-profile';
function getProfile(){try{return JSON.parse(localStorage.getItem(PKEY)||'null')}catch(e){return null}}
function setProfile(p){try{p?localStorage.setItem(PKEY,JSON.stringify(p)):localStorage.removeItem(PKEY)}catch(e){}}
function match(v,p){if(!p||!p.skills)return null;const t=TEAM[v.id];let need=0,got=0;SKILLS.forEach(([k])=>{const n=Math.max(0,3-t[k]);need+=n;got+=Math.min(n,p.skills[k]||0)});const m=need?got/need:0;return Math.min(99,Math.round(35+m*55+((p.industries||[]).includes(v.sector)?9:0)))}
const teamHas=v=>SKILLS.filter(([k])=>TEAM[v.id][k]>=2).map(x=>x[1]);
const youBring=(v,p)=>p?SKILLS.filter(([k])=>TEAM[v.id][k]<=1&&(p.skills[k]||0)>=2).map(x=>x[1]):[];
function teamHTML(v,p){const t=TEAM[v.id],m=match(v,p);
 return '<div class="tm"><div class="tm-hd"><p class="k">'+T('Het team','The team')+'</p>'+(m!=null?'<b class="tm-m">'+m+'% match</b>':'')+'</div>'+
  SKILLS.map(([k,l])=>{const you=p?Math.min(3-t[k],p.skills[k]||0):0;return '<div class="tm-r"><span class="tm-l">'+l+'</span><span class="tm-b"><i class="t" style="width:'+(t[k]/3*100)+'%"></i>'+(you?'<i class="y" style="left:'+(t[k]/3*100)+'%;width:'+(you/3*100)+'%"></i>':'')+'</span><em>'+(t[k]>=2?T('In het team','In the team'):you?T('Jij vult dit','You fill this'):T('Gezocht','Wanted'))+'</em></div>'}).join('')+
  '<p class="tm-key"><i class="t"></i>'+T('Het team','The team')+(p?'<i class="y"></i>'+T('Wat jij meebrengt','What you bring'):'')+'</p>'+
  (p?(youBring(v,p).length?'<p class="tm-sum">'+T('Jij brengt ','You bring ')+'<b>'+youBring(v,p).join(', ').toLowerCase()+'</b>, '+T('het team heeft al ','the team already has ')+teamHas(v).join(', ').toLowerCase()+'.</p>':'<p class="tm-sum">'+T('Het team heeft al ','The team already has ')+teamHas(v).join(', ').toLowerCase()+T('. Jouw sterke punten overlappen vooral.','. Your strengths mostly overlap.')+'</p>'):'<p class="tm-sum">'+T('Maak je founderprofiel en zie wat jij aan dit team toevoegt.','Make your founder profile and see what you add to this team.')+' <a href="'+(window.TNV_ROOT||'')+'app/index.html#/'+(LANG==='en'?'en/':'')+'signup">'+T('Maak je profiel','Make your profile')+'</a></p>')+'</div>'}
/* what is already there, as a checklist */
const STAGECHK=T(['Idee getest','Prototype','Tractie','BV opgericht','IP geregeld'],['Idea tested','Prototype','Traction','Company set up','IP sorted']);
const LEVEL={sketch:T('Schets','Sketch'),prototype:T('Prototype','Prototype'),turnkey:T('Sleutelklaar','Turnkey')};
const PROOF=T(['Team','Product','Klant','BV','IP-akte'],['Team','Product','Customer','Company','IP deed']);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tiles=i=>'<span class="nv-tiles">'+[0,1,2,3].map(k=>'<i'+(k===i?' class="on"':'')+'></i>').join('')+'</span>';
const vimg=v=>(window.TNV_ROOT||'')+'assets/img/ventures/'+v.id+'.jpg';

/* V3: what each venture needs, how strict it is, and its milestones. Milestones and tranches are examples:
   the idea owner sets them at onboarding, amounts stay open until then. */
const STRICT={loose:T('Ruim','Flexible'),standard:T('Standaard','Standard'),strict:T('Streng','Strict')};
const STRICT_D={loose:T('Mijlpalen mogen schuiven als je laat zien waarom.','Milestones may move if you show why.'),standard:T('Mijlpalen staan vast, één keer bijsturen mag in overleg.','Milestones are fixed, one adjustment by agreement.'),strict:T('Mijlpalen en deadlines staan vast. Geen mijlpaal, geen volgende tranche.','Milestones and deadlines are fixed. No milestone, no next tranche.')};
const M=(nl,en,day,kind)=>({goal:T(nl,en),day,kind});
const PLAN={
 'exit-buddy':{tech:25,strict:'standard',ms:[M('Twintig ondernemers die willen verkopen in gesprek','Twenty owners who want to sell in conversation',30,'leads'),M('De eerste drie betaalde begeleidingen','The first three paid engagements',90,'customers'),M('Tien begeleiders onder contract','Ten advisers under contract',180,'supply')]},
 'apk-opa':{tech:30,strict:'loose',ms:[M('Tien gepensioneerde monteurs aangesloten','Ten retired mechanics on board',30,'supply'),M('De eerste vijftig keuringen in één regio','The first fifty inspections in one region',90,'customers'),M('Een tweede regio open','A second region open',180,'growth')]},
 'whoop-dog':{tech:75,strict:'loose',ms:[M('Werkend prototype op vijftien honden','A working prototype on fifteen dogs',45,'product'),M('Crowdfundingcampagne live','Crowdfunding campaign live',90,'crowdfunding'),M('Productiepartner gekozen','Manufacturing partner chosen',180,'product')]},
 'eitje':{tech:45,strict:'strict',ms:[M('Medisch partnerlab gekozen','Medical partner lab chosen',30,'partner'),M('Wachtlijst van vijfhonderd vrouwen','A waiting list of five hundred women',90,'leads'),M('De eerste betaalde checks','The first paid checks',180,'customers')]},
 'zonde':{tech:35,strict:'standard',ms:[M('Vijftig leads van huishoudens met panelen','Fifty leads from households with panels',30,'leads'),M('De eerste installateur als partner','The first installer as partner',90,'partner'),M('Twintig huishoudens geholpen','Twenty households helped',180,'customers')]},
 'biedmeester':{tech:20,strict:'strict',ms:[M('Vijf betalende bureaus','Five paying agencies',30,'customers'),M('BV en IP-akte rond','Company and IP deed in place',60,'legal'),M('Twintig betalende bureaus','Twenty paying agencies',180,'customers')]},
 'vaste-prik':{tech:15,strict:'strict',ms:[M('Tien betalende zaken','Ten paying businesses',30,'customers'),M('Een kassasysteem als verkooppartner','A till system as sales partner',90,'partner'),M('Honderd zaken live','A hundred businesses live',180,'growth')]}
};

Object.assign(PLAN,{
 'fietsdokter':{tech:20,strict:'standard',ms:[M('Honderd abonnees in één stad','A hundred subscribers in one city',45,'customers'),M('Drie bedrijven met een teamabonnement','Three companies on a team plan',90,'customers'),M('Een tweede monteur aan het werk','A second mechanic at work',180,'growth')]},
 'klusbieb':{tech:55,strict:'loose',ms:[M('Tweehonderd stuks gereedschap online','Two hundred tools listed',30,'supply'),M('Vijfhonderd uitleningen','Five hundred loans',90,'customers'),M('Een tweede wijk live','A second neighbourhood live',180,'growth')]},
 'oogstrijk':{tech:30,strict:'standard',ms:[M('Tien boeren aangesloten','Ten farmers on board',30,'supply'),M('Twintig restaurants bestellen wekelijks','Twenty restaurants ordering weekly',90,'customers'),M('Eigen bezorgroute rendabel','Own delivery route profitable',180,'growth')]},
 'stille-uren':{tech:50,strict:'loose',ms:[M('Vijftien cafés doen mee','Fifteen cafés on board',30,'supply'),M('Duizend geboekte uren','A thousand hours booked',90,'customers'),M('Een abonnement voor bedrijven','A plan for companies',180,'product')]},
 'kinderkast':{tech:15,strict:'strict',ms:[M('Driehonderd actieve abonnementen','Three hundred active subscriptions',45,'customers'),M('Retourproces onder de twee dagen','Returns under two days',90,'product'),M('Duizend actieve abonnementen','A thousand active subscriptions',180,'growth')]},
 'pensioenpraat':{tech:45,strict:'standard',ms:[M('Wachtlijst van duizend zzp\'ers','A waiting list of a thousand freelancers',30,'leads'),M('Een pensioenpartner op papier','A pension partner on paper',90,'partner'),M('De eerste betalende gebruikers','The first paying users',180,'customers')]},
 'beweegmaatje':{tech:30,strict:'loose',ms:[M('Vijftig koppels in één gemeente','Fifty pairs in one municipality',45,'customers'),M('Een gemeente als opdrachtgever','A municipality as client',120,'partner'),M('Drie gemeenten','Three municipalities',180,'growth')]},
 'bouwlog':{tech:70,strict:'standard',ms:[M('Tien aannemers in een pilot','Ten contractors in a pilot',30,'customers'),M('Koppeling met een boekhoudpakket','Integration with an accounting package',90,'product'),M('Vijftig betalende aannemers','Fifty paying contractors',180,'customers')]},
 'zorgrooster':{tech:80,strict:'strict',ms:[M('Een pilot bij één thuiszorgteam','A pilot with one home care team',45,'customers'),M('Rooster in de helft van de tijd','Rosters in half the time',90,'product'),M('Drie organisaties betalen','Three organisations paying',180,'customers')]},
 'bakdeel':{tech:25,strict:'standard',ms:[M('Tien straten met een bakfiets','Ten streets with a cargo bike',30,'customers'),M('Een woningcorporatie als partner','A housing association as partner',90,'partner'),M('Honderd straten','A hundred streets',180,'growth')]}
});
const KIND={leads:T('Leads','Leads'),customers:T('Klanten','Customers'),supply:T('Aanbod','Supply'),product:T('Product','Product'),crowdfunding:T('Crowdfunding','Crowdfunding'),partner:T('Partner','Partner'),legal:T('Juridisch','Legal'),growth:T('Groei','Growth')};
const STATUS={planned:T('Gepland','Planned'),active:T('Bezig','In progress'),done:T('Gehaald','Hit'),released:T('Tranche vrijgegeven','Tranche released')};
const need=v=>{const t=PLAN[v.id].tech;return t>=60?T('Technisch','Technical'):t<=35?T('Commercieel','Commercial'):T('Technisch en commercieel','Technical and commercial')};

const WHO={'exit-buddy':['nick-velten','marco-nobel','pepijn-meddens'],'apk-opa':['mike-van-klaveren','niels-verwij','joachim-de-boer'],'whoop-dog':['sander-belaen','stefan-witkamp','timothy-scheek'],'eitje':['emilie-oostenbroek','lenneke-van-ingen','barbara-van-erp'],'zonde':['stefan-witkamp','hugo-hemmen','bas-blokhuis'],'biedmeester':['florian-julius','emilie-oostenbroek','alex-butter'],'vaste-prik':['florian-julius','joachim-de-boer','mike-van-klaveren']};
const AMT={sketch:[15000,25000,40000],prototype:[20000,35000,60000],turnkey:[30000,50000,80000]};
const eur=n=>'€ '+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const CHECK={leads:T('Gesprekken vastgelegd in het dossier','Conversations logged in the file'),customers:T('Facturen gedeeld met de makers','Invoices shared with the makers'),supply:T('Afspraken getekend','Agreements signed'),product:T('Getest met echte gebruikers','Tested with real users'),crowdfunding:T('Campagne live, met video','Campaign live, with video'),partner:T('Afspraak op papier','Agreement on paper'),legal:T('Getekend bij de notaris','Signed at the notary'),growth:T('Cijfers gedeeld met de partners','Numbers shared with the partners')};
/* the milestone card: one object for the site, the dashboard and the TV graphic */
function mcard(v,i,o={}){
  const m=PLAN[v.id].ms[i],st=o.status||'planned',amt=(AMT[v.level]||AMT.sketch)[i];
  const done=st==='released'?2:st==='active'?1:0;
  const lock=st==='released'?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>':'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  return '<div class="mc mc-'+st+'"><div class="mc-h"><span class="mc-t">Tranche '+(i+1)+'</span><span class="mc-amt">'+eur(amt)+'</span></div>'+
   '<div class="mc-d">'+T('Vrij bij mijlpaal ','Released at milestone ')+(i+1)+' · '+T('vóór dag ','by day ')+m.day+'</div>'+
   '<ul class="mc-l">'+[m.goal,CHECK[m.kind]].map((c,k)=>'<li class="'+(k<done?'ok':'')+'"><i>'+(k<done?'<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5"><path d="M20 6 9 17l-5-5"/></svg>':'')+'</i>'+esc(c)+'</li>').join('')+'</ul>'+
   '<div class="mc-f">'+lock+'<span>'+(st==='released'?T('Vrijgegeven','Released'):st==='active'?T('Bezig','In progress'):T('Vergrendeld','Locked'))+'</span></div></div>';
}

/* product mockups: a phone screen of each venture on a field of its own colour */
const BC={'exit-buddy':['#2F3E5C','#fff'],'apk-opa':['#C96F4A','#fff'],'whoop-dog':['#E9C46A','#3A2E12'],'eitje':['#EFE7DA','#5A4A33'],'zonde':['#E07A3F','#fff'],'biedmeester':['#3E5B8C','#fff'],'vaste-prik':['#1F1F1F','#fff'],'fietsdokter':['#4F8A8B','#fff'],'klusbieb':['#D9A441','#2C2210'],'oogstrijk':['#6E8B5B','#fff'],'stille-uren':['#A99BC9','#fff'],'kinderkast':['#E8A598','#fff'],'pensioenpraat':['#5B6B7A','#fff'],'beweegmaatje':['#A8C9B0','#1E3326'],'bouwlog':['#F2B48C','#3B2414'],'zorgrooster':['#7FA7C9','#fff'],'bakdeel':['#3F6B4F','#fff']};
const R3=(a,b,c)=>[a,b,c];
const MK={
 'exit-buddy':()=>({l:T('Jouw exit','Your exit'),big:T('3 begeleiders','3 advisers'),sub:T('passen bij jouw bedrijf','fit your company'),rows:[[T('Fusies en overnames, retail','M&A, retail'),'4,9'],[T('Familiebedrijven','Family businesses'),'4,8'],[T('Tech-exits','Tech exits'),'4,7']],cta:T('Plan een kennismaking','Book an intro')}),
 'apk-opa':()=>({l:T('Keuring','Inspection'),big:'VW Golf 2017',sub:T('Gekeurd door Henk, 41 jaar monteur','Checked by Henk, 41 years a mechanic'),rows:[[T('Remmen','Brakes'),'OK'],[T('Distributieriem','Timing belt'),T('Let op','Check')],[T('Roest','Rust'),'OK']],cta:T('Bekijk het rapport','See the report')}),
 'whoop-dog':()=>({l:T('Vannacht','Last night'),big:'9u 12m',sub:T('Slaap van Bowie','Bowie’s sleep'),rows:[[T('Diepe slaap','Deep sleep'),'3u 40m'],[T('Herstel','Recovery'),'86%'],[T('Onrustig','Restless'),'4x']],cta:T('Weekoverzicht','Weekly view')}),
 'eitje':()=>({l:T('Jouw check','Your check'),big:T('Binnen 5 dagen','Within 5 days'),sub:T('Uitslag met uitleg van een arts','Results explained by a doctor'),rows:[[T('AMH-waarde','AMH level'),T('Lab','Lab')],[T('Cyclus','Cycle'),T('App','App')],[T('Gesprek','Call'),'20 min']],cta:T('Bestel de check','Order the check')}),
 'zonde':()=>({l:T('Jouw panelen','Your panels'),big:'€ 214',sub:T('per jaar terug met een thuisbatterij','back per year with a home battery'),rows:[[T('Salderen stopt','Net metering ends'),'2027'],[T('Opbrengst','Yield'),'3.420 kWh'],[T('Eigen verbruik','Own use'),'38%']],cta:T('Bekijk je opties','See your options')}),
 'biedmeester':()=>({l:T('Vandaag','Today'),big:T('2 afwijkingen','2 anomalies'),sub:T('in 14 accounts','across 14 accounts'),rows:[[T('Bakkerij Smit · CPC +38%','Bakkerij Smit · CPC +38%'),T('Bekijk','View')],[T('Fietsplein · budget op','Fietsplein · budget spent'),T('Fix','Fix')],[T('12 accounts stabiel','12 accounts stable'),'OK']],cta:T('Akkoord op 2 wijzigingen','Approve 2 changes')}),
 'vaste-prik':()=>({l:'Koffiebar Noord',big:T('7 van 10','7 of 10'),sub:T('stempels, de tiende is gratis','stamps, the tenth is free'),rows:[[T('Flat white','Flat white'),T('vandaag','today')],[T('Cappuccino','Cappuccino'),T('ma','Mon')],[T('Espresso','Espresso'),T('vr','Fri')]],cta:T('In Apple Wallet','In Apple Wallet')}),
 'fietsdokter':()=>({l:T('Onderweg','On the way'),big:'14:30',sub:T('Monteur Sam komt naar je kantoor','Sam the mechanic comes to your office'),rows:[[T('Remmen afstellen','Adjust brakes'),'15 min'],[T('Ketting smeren','Oil chain'),'5 min'],[T('Volgende beurt','Next service'),T('mei','May')]],cta:T('Volg de monteur','Track the mechanic')}),
 'klusbieb':()=>({l:T('In je buurt','Nearby'),big:T('Klopboor','Hammer drill'),sub:T('bij Ruud, 120 m verderop','at Ruud’s, 120 m away'),rows:[[T('Per dag','Per day'),'€ 4'],[T('Borg','Deposit'),'€ 25'],[T('Beschikbaar','Available'),T('morgen','tomorrow')]],cta:T('Reserveer','Reserve')}),
 'oogstrijk':()=>({l:T('Vers van het land','Fresh from the field'),big:T('42 kg','42 kg'),sub:T('overschot bij Hoeve de Linde','surplus at Hoeve de Linde'),rows:[[T('Pompoen','Squash'),'€ 1,10/kg'],[T('Spinazie','Spinach'),'€ 2,40/kg'],[T('Bieten','Beetroot'),'€ 0,90/kg']],cta:T('Bestel voor morgen','Order for tomorrow')}),
 'stille-uren':()=>({l:T('Vandaag rustig','Quiet today'),big:'Café Loos',sub:T('3 werkplekken vrij tot 17:00','3 seats free until 5pm'),rows:[[T('Stopcontact','Power socket'),T('ja','yes')],[T('Wifi','Wifi'),'120 Mb'],[T('Per uur','Per hour'),'€ 3']],cta:T('Boek 2 uur','Book 2 hours')}),
 'kinderkast':()=>({l:T('Volgende doos','Next box'),big:T('Maat 104','Size 104'),sub:T('8 stuks, op 12 mei bij je','8 items, arriving 12 May'),rows:[[T('Broeken','Trousers'),'3'],[T('Truien','Jumpers'),'2'],[T('Jas','Coat'),'1']],cta:T('Stuur je oude doos terug','Send your old box back')}),
 'pensioenpraat':()=>({l:T('Jouw pensioen','Your pension'),big:'€ 1.840',sub:T('per maand met je huidige inleg','per month at your current rate'),rows:[[T('AOW','State pension'),'€ 1.420'],[T('Eigen opbouw','Own savings'),'€ 420'],[T('Doel','Goal'),'€ 2.500']],cta:T('Zo kom je er','How to get there')}),
 'beweegmaatje':()=>({l:T('Je maatje','Your buddy'),big:'Ans, 74',sub:T('woont twee straten verder','lives two streets away'),rows:[[T('Dinsdag','Tuesday'),'10:00'],[T('Rondje park','Walk in the park'),'3 km'],[T('Samen gelopen','Walked together'),'12x']],cta:T('Stuur Ans een berichtje','Message Ans')}),
 'bouwlog':()=>({l:T('Vandaag ingesproken','Dictated today'),big:T('Badkamer, Pijp','Bathroom, Pijp'),sub:T('Tegels geleverd, kitwerk morgen','Tiles delivered, sealing tomorrow'),rows:[[T('Uren','Hours'),'6,5'],[T('Materiaal','Materials'),T('3 regels','3 lines')],[T('Foto’s','Photos'),'8']],cta:T('Naar de factuur','To the invoice')}),
 'zorgrooster':()=>({l:T('Week 20','Week 20'),big:T('Klaar in 4 min','Done in 4 min'),sub:T('46 cliënten, 12 medewerkers','46 clients, 12 staff'),rows:[[T('Reistijd','Travel time'),'-18%'],[T('Vaste gezichten','Familiar faces'),'92%'],[T('Open diensten','Open shifts'),'0']],cta:T('Publiceer het rooster','Publish the roster')}),
 'bakdeel':()=>({l:T('Jouw straat','Your street'),big:T('Vrij om 15:00','Free at 3pm'),sub:T('De bakfiets staat bij nummer 12','The cargo bike is at number 12'),rows:[[T('Leden','Members'),'14'],[T('Deze week','This week'),T('9 ritten','9 rides')],[T('Accu','Battery'),'82%']],cta:T('Reserveer','Reserve')})
};
function mockup(v){
  const c=BC[v.id]||['#111','#fff'],m=MK[v.id]&&MK[v.id]();if(!m)return '';
  const root=(window.TNV_ROOT||'');
  return '<div class="mk" style="--c:'+c[0]+';--ci:'+c[1]+'"><div class="mk-phone"><div class="mk-bar"><img src="'+root+'assets/img/badges/'+v.id+'.svg" alt=""><b>'+esc(v.name)+'</b><i></i></div>'+
   '<div class="mk-hero"><small>'+esc(m.l)+'</small><strong>'+esc(m.big)+'</strong><em>'+esc(m.sub)+'</em></div>'+
   '<ul class="mk-list">'+m.rows.map(r=>'<li><i></i><span>'+esc(r[0])+'</span><b>'+esc(r[1])+'</b></li>').join('')+'</ul>'+
   '<div class="mk-cta">'+esc(m.cta)+'</div></div></div>';
}

const CSS=`
.nv-call{--a:var(--nv-accent,#C6F05A);--r:var(--nv-radius,24px);display:grid;grid-template-columns:minmax(0,1.7fr) minmax(300px,1fr);gap:12px;font-family:inherit}
.nv-screen{position:relative;border-radius:var(--r);overflow:hidden;background:#0c0d10;aspect-ratio:16/10;color:#fff;isolation:isolate}
.nv-face{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transform-origin:50% 40%;animation:nv-breathe 7s ease-in-out infinite}
.nv-screen::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 22%,transparent 55%,rgba(0,0,0,.78))}
.nv-call.talking .nv-face{animation:nv-breathe 7s ease-in-out infinite,nv-talk .42s ease-in-out infinite alternate}
@keyframes nv-breathe{50%{transform:scale(1.025)}}
@keyframes nv-talk{to{filter:brightness(1.05)}}
.nv-top{position:absolute;left:16px;right:16px;top:14px;display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600}
.nv-pill{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 12px;border-radius:999px;background:rgba(0,0,0,.45);backdrop-filter:blur(8px)}
.nv-pill i{width:8px;height:8px;border-radius:50%;background:#ff4d3d;animation:nv-rec 1.4s infinite}
@keyframes nv-rec{50%{opacity:.3}}
.nv-who{position:absolute;left:18px;bottom:18px;right:200px}
.nv-who b{display:block;font-size:17px;font-weight:600}
.nv-who span{font-size:13px;opacity:.75}
.nv-wave{display:inline-flex;gap:3px;align-items:center;height:18px;margin-left:10px;vertical-align:-3px}
.nv-wave i{width:3px;height:4px;border-radius:2px;background:var(--a);transition:height .12s}
.nv-cap{position:absolute;left:50%;bottom:84px;transform:translateX(-50%);width:min(62%,640px);text-align:center;font-size:clamp(16px,1.6vw,21px);line-height:1.4;font-weight:500;text-shadow:0 1px 12px rgba(0,0,0,.6)}
.nv-cap .me{color:var(--a)}
.nv-self{position:absolute;right:16px;bottom:16px;width:150px;aspect-ratio:16/10;border-radius:14px;background:#24262d;border:1px solid rgba(255,255,255,.14);display:grid;place-items:center;overflow:hidden}
.nv-self video{width:100%;height:100%;object-fit:cover;transform:scaleX(-1)}
.nv-self span{font-size:13px;font-weight:600;opacity:.8}
.nv-self.on span{display:none}
.nv-self .lvl{position:absolute;left:8px;bottom:8px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.5)}
.nv-self.listen{outline:2px solid var(--a)}
.nv-lobby{position:absolute;inset:0;display:grid;place-items:center;background:rgba(8,9,12,.55);backdrop-filter:blur(3px);text-align:center;padding:24px}
.nv-lobby h4{margin:0 0 6px;font-size:22px;font-weight:600}
.nv-lobby p{margin:0 auto 20px;max-width:40ch;font-size:15px;opacity:.85}
.nv-go{height:52px;padding:0 26px;border-radius:999px;border:0;background:var(--a);color:#111;font-weight:700;font-size:16px;cursor:pointer}
.nv-bar[hidden]{display:none!important}
.nv-bar{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);display:flex;gap:8px}
.nv-btn{width:46px;height:46px;border-radius:50%;border:0;background:rgba(255,255,255,.16);backdrop-filter:blur(8px);color:#fff;display:grid;place-items:center;cursor:pointer}
.nv-btn[aria-pressed="true"]{background:var(--a);color:#111}
.nv-btn.end{background:#e5483b}
.nv-btn svg{width:20px;height:20px}
.nv-side{display:flex;flex-direction:column;gap:10px;min-height:0}
.nv-steps{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
.nv-steps i{height:5px;border-radius:3px;background:var(--nv-line,rgba(127,127,127,.25))}
.nv-steps i.on{background:var(--nv-ink,currentColor)}
.nv-log{flex:1;min-height:180px;max-height:340px;overflow:auto;display:flex;flex-direction:column;gap:12px;font-size:14.5px;line-height:1.45;padding:16px;border-radius:var(--r);background:var(--nv-panel,rgba(127,127,127,.08))}
.nv-log p{margin:0}
.nv-log b{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin-bottom:2px}
.nv-log .me{padding-left:12px;border-left:2px solid var(--a)}
.nv-pick{display:flex;flex-wrap:wrap;gap:6px}
.nv-pick button{min-height:38px;padding:6px 14px;border-radius:999px;border:1.5px solid var(--nv-line,rgba(127,127,127,.3));background:transparent;font-size:14px;font-weight:600;cursor:pointer;text-align:left}
.nv-pick button:hover{border-color:var(--a);background:var(--a);color:#111}
.nv-type{display:flex;gap:6px}
.nv-type input{flex:1;min-width:0;height:46px;border-radius:999px;border:1.5px solid var(--nv-line,rgba(127,127,127,.3));background:transparent;padding:0 16px;font-size:15px}
.nv-type button{height:46px;padding:0 18px;border-radius:999px;border:0;background:var(--nv-ink,#111);color:var(--nv-on-ink,#fff);font-weight:600;cursor:pointer}
.nv-meta{display:flex;justify-content:space-between;gap:10px;align-items:center;font-size:12.5px;opacity:.75}
.nv-meta select{height:34px;border-radius:999px;border:1.5px solid var(--nv-line,rgba(127,127,127,.3));background:transparent;padding:0 10px;font-size:13px;font-weight:600}
.nv-sum2 dl{margin:0;display:grid;gap:8px;font-size:14px}
.nv-sum2 dt{font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.6}
.nv-sum2 dd{margin:0;font-weight:600}
@media (max-width:900px){.nv-cap{width:86%;bottom:150px}.nv-call{grid-template-columns:1fr}.nv-screen{aspect-ratio:4/5}.nv-face{object-position:50% 30%}.nv-self{width:110px}.nv-who{right:140px}.nv-cap{bottom:84px}}
@media (prefers-reduced-motion:reduce){.nv-face{animation:none!important}}
`;
const LBCSS=`
.nv-lb{position:fixed;inset:0;z-index:1000;background:rgba(10,8,6,0);transition:background .45s ease}
.nv-lb.in{background:rgba(10,8,6,.62);backdrop-filter:blur(6px)}
.nv-lbp{position:fixed;z-index:1001;overflow:hidden;background:var(--nv-lb-bg,#fff);color:var(--nv-lb-ink,#111);border-radius:var(--nv-lb-r0,18px);box-shadow:0 40px 120px -20px rgba(0,0,0,.5);transition:top .56s cubic-bezier(.2,.8,.2,1),left .56s cubic-bezier(.2,.8,.2,1),width .56s cubic-bezier(.2,.8,.2,1),height .56s cubic-bezier(.2,.8,.2,1),border-radius .56s cubic-bezier(.2,.8,.2,1)}
.nv-lbin{transition:grid-template-columns .56s cubic-bezier(.2,.8,.2,1)}.nv-lbp.closing .nv-lbin{grid-template-columns:minmax(0,1fr) minmax(0,0fr)}.nv-lbp.closing .nv-lbtxt{opacity:0;transform:none;transition:opacity .16s ease}.nv-lbp.closing .nv-lbtag,.nv-lbp.closing .nv-lbbar{opacity:0;transition:opacity .16s}.nv-lbp.closing .nv-lbimg img{transform:none}.nv-lbp.closing{box-shadow:0 0 0 rgba(0,0,0,0);transition-property:top,left,width,height,border-radius,box-shadow}.nv-lbp.cur,.nv-lbp.cur *{cursor:none}.nv-lbp.cur button,.nv-lbp.cur a,.nv-lbp.cur select{cursor:pointer}.nv-lbp.cur .nv-lbcta{display:none}.nv-lbcur{position:fixed;left:0;top:0;z-index:1002;pointer-events:none}.nv-lbcur span{position:absolute;left:-46px;top:-46px;width:92px;height:92px;border-radius:50%;background:#111;color:#fff;display:grid;place-items:center;font-weight:600;font-size:14px;transform:scale(0);opacity:0;transition:transform .32s cubic-bezier(.3,1.4,.5,1),opacity .2s;box-shadow:0 12px 30px -12px rgba(0,0,0,.55)}.nv-lbcur.on span{transform:scale(1);opacity:1}.nv-lbchk{border-radius:18px;box-shadow:inset 0 0 0 1px var(--nv-lb-line,rgba(127,127,127,.25));padding:18px 20px;margin:0 0 26px}.nv-lbchk .hd{display:flex;justify-content:space-between;align-items:baseline}.nv-lbchk .hd .k{margin:0}.nv-lbchk .hd b{font-size:22px;font-weight:700;font-variant-numeric:tabular-nums}.nv-lbchk .bar{display:block;height:6px;border-radius:3px;background:rgba(127,127,127,.15);margin:10px 0 14px;overflow:hidden}.nv-lbchk .bar i{display:block;height:100%;background:#CD633F;border-radius:3px}.nv-lbchk ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}.nv-lbchk li{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;padding:7px 11px;border-radius:999px;background:rgba(127,127,127,.08);opacity:.5}.nv-lbchk li i{width:14px;height:14px;border-radius:50%;box-shadow:inset 0 0 0 1.5px currentColor;position:relative}.nv-lbchk li.on{opacity:1;background:rgba(127,127,127,.12)}.nv-lbchk li.on i{background:#CD633F;box-shadow:none}.nv-lbchk li.on i::after{content:"";position:absolute;left:5px;top:2px;width:3px;height:7px;border:solid #fff;border-width:0 1.5px 1.5px 0;transform:rotate(45deg)}.nv-lbgoals{list-style:none;margin:0 0 8px;padding:0}.nv-lbgoals li{display:grid;grid-template-columns:26px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-top:1px solid var(--nv-lb-line,rgba(127,127,127,.2));font-size:15px}.nv-lbgoals li span{width:24px;height:24px;border-radius:50%;background:var(--nv-lb-ink,#111);color:var(--nv-lb-bg,#fff);display:grid;place-items:center;font-size:12px;font-weight:700}.nv-lbgoals li b{font-weight:600}.nv-lbgoals li em{font-style:normal;font-size:13px;opacity:.6;white-space:nowrap}.nv-lbsmall{font-size:13px;opacity:.6;margin:6px 0 26px;max-width:52ch}.nv-lbp.big{border-radius:var(--nv-lb-r,24px)}
.nv-lbin{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)}
.nv-lbimg{position:relative;overflow:hidden}
.nv-lbimg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.nv-lbimg .nv-lbtag{position:absolute;left:24px;top:24px;display:flex;gap:6px}
.nv-lbimg .nv-lbtag span{background:var(--nv-accent,#FF5F1F);color:#fff;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:8px 11px;border-radius:999px}
.nv-lbimg .nv-lbtag span+span{background:rgba(0,0,0,.55)}
.nv-lbtxt{overflow:auto;padding:56px 56px 40px;opacity:0;transform:translateY(14px);transition:opacity .35s ease .22s,transform .5s cubic-bezier(.2,.8,.2,1) .22s}
.nv-lbp.big .nv-lbtxt{opacity:1;transform:none}
.nv-lbimg img{transform:scale(1.06);transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
.nv-lbp.big .nv-lbimg img{transform:none}
.nv-lbtxt .k{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin:0 0 10px}
.nv-lbtxt h3{font-family:inherit;font-weight:800;font-size:clamp(44px,5vw,80px);line-height:.92;letter-spacing:-.045em;margin:0 0 16px}
.nv-lbtxt .line{font-size:20px;line-height:1.45;margin:0 0 32px;opacity:.8;max-width:34ch}
.nv-lbgrid{display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:24px 0;border-top:1px solid var(--nv-lb-line,rgba(127,127,127,.25))}
.nv-lbgrid ul{margin:0;padding:0 0 0 18px;font-size:15.5px;line-height:1.5}
.nv-lbgrid li+li{margin-top:8px}
.nv-lbproof{display:flex;gap:6px;flex-wrap:wrap;padding:20px 0;border-top:1px solid var(--nv-lb-line,rgba(127,127,127,.25))}
.nv-lbproof span{font-size:13px;font-weight:700;padding:7px 12px;border-radius:999px;border:1.5px solid var(--nv-lb-line,rgba(127,127,127,.3));opacity:.55}
.nv-lbproof span.on{opacity:1;background:var(--nv-lb-ink,#111);color:var(--nv-lb-bg,#fff);border-color:var(--nv-lb-ink,#111)}
.nv-lbdeal{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--nv-lb-line,rgba(127,127,127,.25));border-radius:14px;overflow:hidden;margin:8px 0 28px}
.nv-lbdeal div{background:var(--nv-lb-bg,#fff);padding:14px 16px;font-size:14px}
.nv-lbdeal b{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin-bottom:4px}
.nv-lbcta{display:flex;gap:10px;flex-wrap:wrap}
.nv-lbcta .nv-lbbtn{display:inline-flex;align-items:center;text-decoration:none;height:52px;padding:0 24px;border-radius:999px;border:0;font-weight:700;font-size:15px;cursor:pointer;background:var(--nv-accent,#FF5F1F);color:#fff}
.nv-lbcta .nv-lbbtn.alt{background:transparent;color:inherit;box-shadow:inset 0 0 0 1.5px currentColor}
.nv-lbbar{position:absolute;right:16px;top:16px;display:flex;gap:8px;z-index:2;opacity:0;transition:opacity .3s ease .3s}
.nv-lbp.big .nv-lbbar{opacity:1}
.nv-lbbar button{width:44px;height:44px;border-radius:50%;border:0;background:var(--nv-lb-bg,#fff);color:var(--nv-lb-ink,#111);box-shadow:0 2px 10px rgba(0,0,0,.18);cursor:pointer;font-size:18px;display:grid;place-items:center}
@media (max-width:820px){.nv-lbin{grid-template-columns:1fr;grid-template-rows:38% 1fr}.nv-lbtxt{padding:28px 22px}.nv-lbgrid,.nv-lbdeal{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.nv-lbp,.nv-lb,.nv-lbtxt,.nv-lbimg img{transition:none!important}}
`;
const ico={mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
cam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></svg>',
cc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 10.5a2 2 0 1 0 0 3M17 10.5a2 2 0 1 0 0 3"/></svg>',
snd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></svg>',
end:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 15c5-4 13-4 18 0l-2 3-4-1v-3a10 10 0 0 0-6 0v3l-4 1z"/></svg>'};


function style(id,css){if(!document.getElementById(id)){const s=document.createElement('style');s.id=id;s.textContent=css;document.head.appendChild(s)}}

/* Lightbox: the clicked card grows into a near-full-viewport detail, and shrinks back on close */
function lightbox(id,host,o={}){
  style('nv-lbcss',LBCSS);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let v=ventures.find(x=>x.id===id);
  const card=()=>host.querySelector('.nv-v[data-id="'+v.id+'"]');
  const r0=card().getBoundingClientRect();
  const ov=document.createElement('div');ov.className='nv-lb';
  const p=document.createElement('div');p.className='nv-lbp';p.setAttribute('role','dialog');p.setAttribute('aria-modal','true');
  const cs=getComputedStyle(host);['--nv-accent','--nv-lb-bg','--nv-lb-ink','--nv-lb-line','--nv-lb-r0','--nv-lb-r'].forEach(k=>{const x=cs.getPropertyValue(k);if(x)p.style.setProperty(k,x.trim())});p.style.fontFamily=cs.fontFamily;
  const place=r=>{p.style.top=r.top+'px';p.style.left=r.left+'px';p.style.width=r.width+'px';p.style.height=r.height+'px'};
  const target=()=>{const W=innerWidth,H=innerHeight,w=Math.min(W-(W<700?16:64),1360),h=H-(W<700?16:56);return{top:(H-h)/2,left:(W-w)/2,width:w,height:h}};
  let src;
  function fill(){
    const n=v.proof.reduce((a,b)=>a+b,0);
    p.setAttribute('aria-label',v.name);
    p.innerHTML='<div class="nv-lbin"><div class="nv-lbimg">'+'<img src="'+vimg(v)+'" alt="">'+'<div class="nv-lbtag"><span>'+LEVEL[v.level]+'</span><span>'+n+T(' van 5 bewijzen',' of 5 proofs')+'</span></div></div>'+
    '<div class="nv-lbtxt"><img class="nv-lbbadge" src="'+(window.TNV_ROOT||'')+'assets/img/badges/'+v.id+'.svg" alt=""><p class="k">'+esc(v.origin)+(v.seeks?T(' · zoekt ',' · seeks ')+esc(v.seeks):'')+'</p><h3>'+esc(v.name)+'</h3><p class="line">'+esc(v.line)+'</p>'+(typeof PLAN!=='undefined'&&PLAN[v.id]?'<div class="nv-lbneed"><span class="av">'+(WHO[v.id]||[]).map(id=>{const p=people.find(q=>q.id===id);return '<img src="'+p.photo.replace(/^/,(window.TNV_ROOT&&p.photo.indexOf(window.TNV_ROOT)!==0)?'':'')+'" alt="" title="'+esc(p.name)+'">'}).join('')+'</span><span>'+T('Zoekt: ','Looking for: ')+v.roles.map(r=>ROLE_S[r]).join(', ')+'</span><span>'+SECTORS[v.sector]+'</span><span>'+T('Strengheid: ','Strictness: ')+esc(STRICT[PLAN[v.id].strict])+'</span></div>':'')+
    '<div class="nv-team">'+teamHTML(v,getProfile())+'</div>'+'<div class="nv-lbgrid"><div><p class="k">'+T('Wat er staat','What is there')+'</p><ul>'+v.has.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div><div><p class="k">'+T('Wat ontbreekt','What is missing')+'</p><ul>'+v.lacks.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div></div>'+
    '<div class="nv-lbchk"><div class="hd"><p class="k">'+T('Waar het staat','Where it stands')+'</p><b>'+n+'/5</b></div><span class="bar"><i style="width:'+(n*20)+'%"></i></span><ul>'+STAGECHK.map((c,i)=>'<li class="'+(v.proof[i]?'on':'')+'"><i></i>'+c+'</li>').join('')+'</ul></div>'+
    (typeof PLAN!=='undefined'&&PLAN[v.id]?'<p class="k">'+T('Wat de eerste fase moet opleveren','What the first phase has to deliver')+'</p><ol class="nv-lbgoals">'+PLAN[v.id].ms.map((m,i)=>'<li><span>'+(i+1)+'</span><b>'+esc(m.goal)+'</b><em>'+T('dag ','day ')+m.day+'</em></li>').join('')+'</ol><p class="nv-lbsmall">'+T('Een voorstel van de makers. Na de keuze in de show maak je de mijlpalen samen definitief, en pas dan komt de financiering per mijlpaal vrij.','A proposal from the makers. After you are chosen on the show you settle the milestones together, and only then is the funding released per milestone.')+'</p>':'')+
    '<p class="k" style="margin-top:8px">'+T('De deal','The deal')+'</p><div class="nv-lbdeal"><div><b>'+T('Jij wordt','You become')+'</b>'+T('CEO en meerderheids&shy;aandeelhouder','CEO and majority shareholder')+'</div><div><b>'+T('Koopprijs','Purchase price')+'</b>'+T('Geen','None')+'</div><div><b>'+T('Eerste fase','First phase')+'</b>'+T('Gefinancierd door partners, in tranches','Funded by partners, in tranches')+'</div></div>'+
    '<div class="nv-lbcta"><a class="nv-lbbtn" href="'+o.applyHref(v)+'">'+T('Solliciteer bij Eva','Apply with Eva')+'</a></div></div></div>'+
    '<div class="nv-lbbar"><button type="button" data-a="prev" aria-label="'+T('Vorige venture','Previous venture')+'">&#8592;</button><button type="button" data-a="next" aria-label="'+T('Volgende venture','Next venture')+'">&#8594;</button><button type="button" data-a="close" aria-label="'+T('Sluiten','Close')+'">&#10005;</button></div>';
    p.querySelector('[data-a=close]').onclick=()=>close();
    p.querySelector('[data-a=prev]').onclick=()=>step(-1);
    p.querySelector('[data-a=next]').onclick=()=>step(1);
  }
  function step(d){const list=[...host.querySelectorAll('.nv-v:not(.hide)')].map(x=>x.dataset.id);const i=list.indexOf(v.id);v=ventures.find(x=>x.id===list[(i+d+list.length)%list.length]);
    if(src)src.style.visibility='';src=card();if(src)src.style.visibility='hidden';
    fill();const t=p.querySelector('.nv-lbtxt');t.style.transition='none';t.style.opacity=0;requestAnimationFrame(()=>{t.style.transition='opacity .3s';t.style.opacity=1})}
  function key(e){if(e.key==='Escape')close();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)}
  function close(){
    document.removeEventListener('keydown',key);
    const c=card();const im=c&&(c.querySelector('.vc-img')||c.querySelector('img'));const r=im?im.getBoundingClientRect():c?c.getBoundingClientRect():r0;
    p.classList.add('closing');p.classList.remove('big');ov.classList.remove('in');place(r);if(cur)cur.remove();
    setTimeout(()=>{if(src)src.style.visibility='';ov.remove();p.remove();document.documentElement.style.overflow='';if(c){const h=c.querySelector('.nv-vhead');h&&h.focus({preventScroll:true})}},reduce?0:560);
  }
  fill();place(r0);src=card();src.style.visibility='hidden';
  /* on a mouse, the pointer becomes a black Apply circle and a click anywhere applies */
  let cur=null;
  if(matchMedia('(hover: hover) and (pointer: fine)').matches&&o.applyHref){
    p.classList.add('cur');cur=document.createElement('div');cur.className='nv-lbcur';cur.setAttribute('aria-hidden','true');cur.innerHTML='<span>'+T('Solliciteer','Apply')+'</span>';cur.style.fontFamily=getComputedStyle(host).fontFamily;document.body.appendChild(cur);
    const off=t=>!!t.closest('button,a,select,input,.nv-lbbar');
    p.addEventListener('pointermove',e=>{cur.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)';cur.classList.toggle('on',p.classList.contains('big')&&!off(e.target))});
    p.addEventListener('pointerleave',()=>cur.classList.remove('on'));
    p.addEventListener('click',e=>{if(!off(e.target)&&p.classList.contains('big'))location.href=o.applyHref(v)});
  }
  ov.onclick=()=>close();
  document.body.append(ov,p);
  document.documentElement.style.overflow='hidden';
  p.getBoundingClientRect();
  requestAnimationFrame(()=>{ov.classList.add('in');p.classList.add('big');place(target());p.querySelector('[data-a=close]').focus({preventScroll:true})});
  document.addEventListener('keydown',key);
  addEventListener('resize',()=>{if(p.isConnected&&p.classList.contains('big'))place(target())});
}

/* The interview: a video call with Eva, an AI interviewer (a generated, fictional person) */
function qs(v){return [
  {q:T('Hoi, ik ben Eva, de AI-interviewer van The Next Founder. Fijn dat je er bent. Eerste vraag: waarom wil jij '+v.name+' overnemen, en niet een eigen idee beginnen?','Hi, I am Eva, the AI interviewer at The Next Founder. Glad you are here. First question: why do you want to take over '+v.name+', rather than start an idea of your own?'),
   a:T(['Ik wil bouwen, niet bedenken','Dit probleem ken ik zelf','Ik zoek een team om mee te starten'],['I want to build, not invent','I know this problem first hand','I want a team to start with'])},
  {q:T(v.name+' is er voor '+v.topic+'. Wat weet jij van die mensen dat een ander niet weet?',v.name+' is for '+v.topic+'. What do you know about them that others do not?'),
   a:T(['Ik werkte in die markt','Ik ben zelf die klant','Nog weinig, ik leer snel'],['I worked in that market','I am that customer myself','Not much yet, I learn fast'])},
  {q:T(v.name+' zoekt vooral iemand die '+need(v).toLowerCase()+' sterk is. Waar ligt jouw kracht?',v.name+' mostly needs someone strong on the '+need(v).toLowerCase()+' side. Where does your strength lie?'),
   a:T(['Verkopen en klanten binnenhalen','Bouwen en het product','Allebei, met een team om me heen'],['Selling and winning customers','Building and the product','Both, with a team around me'])},
  {q:T('De eerste mijlpaal is: '+PLAN[v.id].ms[0].goal.toLowerCase()+', voor dag '+PLAN[v.id].ms[0].day+'. Waarom ben jij de persoon die die haalt, en hoe?','The first milestone is: '+PLAN[v.id].ms[0].goal.toLowerCase()+', by day '+PLAN[v.id].ms[0].day+'. Why are you the person to hit it, and how?'),
   a:T(['Eerst twintig klantgesprekken','Meteen verkopen, dan bouwen','Product scherper, dan verkopen'],['Twenty customer calls first','Sell right away, then build','Sharpen the product, then sell'])},
  {q:T('Laatste vraag. Wat moeten de makers van jou weten voordat ze koffie met je drinken?','Last question. What should the makers know about you before they have coffee with you?'),
   a:T(['Ik heb eerder iets opgebouwd','Ik geef niet snel op','Ik wil eerst hun verhaal horen'],['I have built something before','I do not give up easily','I want to hear their story first'])}
]}
const synth=window.speechSynthesis;let voice=null;
function pickVoice(){if(!synth)return;const re=LANG==='en'?/^en/i:/^nl/i;const vs=synth.getVoices().filter(v=>re.test(v.lang));voice=vs.find(v=>(LANG==='en'?/Samantha|Karen|Moira|Serena|female/i:/Ellen|Claire|Fenna|Colette|female|vrouw/i).test(v.name))||vs.find(v=>/Google/i.test(v.name))||vs[0]||null}
if(synth){pickVoice();synth.onvoiceschanged=pickVoice}
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
let iv=null;
function interview(el,o={}){style('nv-css',CSS);iv={el,o};startInterview(o.venture||'biedmeester',true)}
function startInterview(id,quiet){
  if(!iv)return;
  if(synth)synth.cancel();
  const v=ventures.find(x=>x.id===id)||ventures[0];
  const Q=qs(v),ans=[];let i=-1,sound=true,rec=null,stream=null,timer=null;
  const el=iv.el,face=(window.TNV_ROOT||'')+'assets/img/eva.jpg';
  el.innerHTML='<div class="nv-call"><div class="nv-screen"><img class="nv-face" src="'+face+'" alt="'+T('Eva, een AI-interviewer (een gegenereerd, fictief persoon)','Eva, an AI interviewer (a generated, fictional person)')+'">'+
   '<div class="nv-top"><span class="nv-pill"><i></i>'+T('Sollicitatie','Application')+' · '+esc(v.name)+'</span><span class="nv-pill">'+T('AI-interviewer','AI interviewer')+'</span></div>'+
   '<div class="nv-who"><b>Eva <span class="nv-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></b><span>'+T('AI-interviewer van The Next Founder','AI interviewer at The Next Founder')+'</span></div>'+
   '<div class="nv-cap" aria-live="polite"></div>'+
   '<div class="nv-self"><span>'+T('Jij','You')+'</span><div class="lvl">'+ico.mic.replace('<svg','<svg width="12" height="12"')+'</div></div>'+
   '<div class="nv-bar" hidden><button type="button" class="nv-btn" data-k="mic" aria-pressed="false" aria-label="'+T('Antwoord hardop','Answer out loud')+'">'+ico.mic+'</button><button type="button" class="nv-btn" data-k="cam" aria-pressed="false" aria-label="'+T('Camera aan of uit','Camera on or off')+'">'+ico.cam+'</button><button type="button" class="nv-btn" data-k="snd" aria-pressed="true" aria-label="'+T('Geluid aan of uit','Sound on or off')+'">'+ico.snd+'</button><button type="button" class="nv-btn" data-k="cc" aria-pressed="true" aria-label="'+T('Ondertiteling aan of uit','Captions on or off')+'">'+ico.cc+'</button><button type="button" class="nv-btn end" data-k="end" aria-label="'+T('Gesprek beëindigen','End the call')+'">'+ico.end+'</button></div>'+
   '<div class="nv-lobby"><div><h4>'+T('Eva staat klaar voor ','Eva is ready for ')+esc(v.name)+'</h4><p>'+T('Vijf vragen, ongeveer tien minuten. Je antwoordt hardop, met een klik of door te typen. Je camera hoeft niet aan.','Five questions, about ten minutes. Answer out loud, with a click or by typing. Your camera can stay off.')+'</p><button type="button" class="nv-go">'+T('Start het gesprek','Start the call')+'</button></div></div>'+
   '</div><div class="nv-side"><div class="nv-meta"><span>'+T('Vraag','Question')+' <b class="nv-n">0</b> '+T('van','of')+' 5</span><select aria-label="'+T('Kies een venture','Choose a venture')+'">'+ventures.map(x=>'<option value="'+x.id+'"'+(x.id===v.id?' selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></div><div class="nv-steps">'+Q.map(()=>'<i></i>').join('')+'</div><div class="nv-log" aria-live="polite"><p style="opacity:.7">'+T('Het transcript verschijnt hier. Eva is een AI met een gegenereerd gezicht. In dit prototype wordt niets opgenomen of verstuurd.','The transcript appears here. Eva is an AI with a generated face. In this prototype nothing is recorded or sent.')+'</p></div><div class="nv-in"></div></div></div>';
  const $=s=>el.querySelector(s),call=$('.nv-call'),cap=$('.nv-cap'),log=$('.nv-log'),inp=$('.nv-in'),waves=[...el.querySelectorAll('.nv-wave i')];
  $('.nv-meta select').onchange=e=>{stop();if(iv.o.onVenture)iv.o.onVenture(e.target.value);startInterview(e.target.value,true)};
  $('.nv-go').onclick=()=>{$('.nv-lobby').remove();$('.nv-bar').hidden=false;log.innerHTML='';next()};
  el.querySelectorAll('.nv-btn').forEach(b=>b.onclick=()=>ctl(b));
  function ctl(b){const k=b.dataset.k,on=b.getAttribute('aria-pressed')!=='true';
    if(k==='snd'){sound=on;b.setAttribute('aria-pressed',on);if(!on&&synth)synth.cancel()}
    if(k==='cc'){b.setAttribute('aria-pressed',on);cap.style.visibility=on?'':'hidden'}
    if(k==='cam'){if(on&&navigator.mediaDevices){navigator.mediaDevices.getUserMedia({video:true}).then(s=>{stream=s;const vd=document.createElement('video');vd.autoplay=true;vd.muted=true;vd.playsInline=true;vd.srcObject=s;$('.nv-self').prepend(vd);$('.nv-self').classList.add('on');b.setAttribute('aria-pressed','true')}).catch(()=>{})}else{camOff();b.setAttribute('aria-pressed','false')}}
    if(k==='mic')listen(b);
    if(k==='end'){stop();startInterview(v.id,true)}}
  function camOff(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}const vd=$('.nv-self video');if(vd)vd.remove();$('.nv-self')&&$('.nv-self').classList.remove('on')}
  function stop(){if(synth)synth.cancel();clearInterval(timer);if(rec)try{rec.abort()}catch(e){};camOff()}
  function wave(on){call.classList.toggle('talking',on);clearInterval(timer);if(on)timer=setInterval(()=>waves.forEach(w=>w.style.height=(4+Math.random()*14)+'px'),120);else waves.forEach(w=>w.style.height='4px')}
  function line(who,t){const p=document.createElement('p');if(who==='me')p.className='me';p.innerHTML='<b>'+(who==='me'?T('Jij','You'):'Eva')+'</b>'+esc(t);log.appendChild(p);log.scrollTop=log.scrollHeight}
  function say(t,then){
    line('ai',t);const words=t.split(' ');cap.textContent='';wave(true);let k=0,done=false;
    const show=n=>{cap.textContent=words.slice(Math.max(0,n-14),n).join(' ')};
    const finish=()=>{if(done)return;done=true;wave(false);show(words.length);then&&then()};
    function fallback(){if(done)return;if(synth)synth.cancel();const it=setInterval(()=>{k++;show(k);if(k>=words.length){clearInterval(it);setTimeout(finish,500)}},170)}
    if(sound&&synth){const u=new SpeechSynthesisUtterance(t);u.lang=T('nl-NL','en-GB');if(voice)u.voice=voice;u.rate=1.02;
      u.onboundary=e=>{if(e.charIndex!=null){k=t.slice(0,e.charIndex).split(' ').length;show(k)}};u.onend=finish;u.onerror=fallback;synth.speak(u);
      setTimeout(()=>{if(!synth.speaking&&!done)fallback()},900)}else fallback();
  }
  function steps(){el.querySelectorAll('.nv-steps i').forEach((s,j)=>s.classList.toggle('on',j<=i&&i<Q.length));$('.nv-n').textContent=Math.min(i+1,5)}
  function next(){
    i++;steps();inp.innerHTML='';
    if(i>=Q.length)return end();
    say(Q[i].q,()=>{
      inp.innerHTML='<div class="nv-pick">'+Q[i].a.map(a=>'<button type="button">'+esc(a)+'</button>').join('')+'</div><form class="nv-type"><label class="nv-sr" for="nv-a">'+T('Je antwoord','Your answer')+'</label><input id="nv-a" autocomplete="off" placeholder="'+(SR?T('Praat via de microfoon, of typ','Use the microphone, or type'):T('Typ je antwoord','Type your answer'))+'"><button type="submit">'+T('Stuur','Send')+'</button></form>';
      inp.querySelectorAll('.nv-pick button').forEach(b=>b.onclick=()=>answer(b.textContent));
      inp.querySelector('form').onsubmit=e=>{e.preventDefault();const t=e.target.querySelector('input').value.trim();if(t)answer(t)};
    });
  }
  function answer(t){if(rec)try{rec.abort()}catch(e){};ans.push(t);line('me',t);cap.innerHTML='<span class="me">'+esc(t)+'</span>';inp.innerHTML='';setTimeout(next,700)}
  function listen(b){
    if(!SR){cap.textContent=T('Spraak werkt niet in deze browser. Typ of kies je antwoord.','Speech does not work in this browser. Type or pick your answer.');return}
    if(i<0||i>=Q.length||!inp.querySelector('form'))return;
    rec=new SR();rec.lang=T('nl-NL','en-GB');rec.interimResults=true;b.setAttribute('aria-pressed','true');$('.nv-self').classList.add('listen');let final='';
    rec.onresult=e=>{let t='';for(const r of e.results){t+=r[0].transcript;if(r.isFinal)final=t}cap.innerHTML='<span class="me">'+esc(t)+'</span>'};
    rec.onend=()=>{b.setAttribute('aria-pressed','false');$('.nv-self')&&$('.nv-self').classList.remove('listen');if(final.trim())answer(final.trim())};
    rec.onerror=()=>{};rec.start();
  }
  function end(){
    say(T('Dank je wel. Je video gaat nu door de analyse. Binnen een paar tellen zie je je score en feedback, ook als het deze keer niet doorgaat.','Thank you. Your video now goes through the analysis. In a few seconds you will see your score and feedback, even if it is not a match this time.'),()=>{
      if(iv.o.onDone){iv.o.onDone(v,ans);return}
      const K=T(['Waarom','Wat je weet','Je kracht','De eerste mijlpaal','Wat ze moeten weten'],['Why','What you know','Your strength','The first milestone','What they should know']);
      inp.innerHTML='<div class="nv-sum2"><dl>'+K.map((k,j)=>'<div><dt>'+k+'</dt><dd>'+esc(ans[j]||'')+'</dd></div>').join('')+'</dl></div><form class="nv-type" style="margin-top:12px"><label class="nv-sr" for="nv-e">'+T('Je e-mailadres','Your email address')+'</label><input id="nv-e" type="email" placeholder="'+T('je@email.nl','you@email.com')+'"><button type="submit">'+T('Plan koffie','Plan a coffee')+'</button></form>';
      inp.querySelector('form').onsubmit=e=>{e.preventDefault();e.target.outerHTML='<p style="font-weight:600;margin:12px 0 0">'+T('In het echt krijg je binnen een week een uitnodiging voor koffie. Dit prototype verstuurt niets.','For real, you would get an invitation for coffee within a week. This prototype sends nothing.')+'</p>'};
    });
  }
  if(!quiet){(iv.o.scrollTo||el).scrollIntoView({behavior:'smooth',block:'center'})}
}

window.TNV={SKILLS,SKL,TEAM,getProfile,setProfile,match,teamHas,youBring,teamHTML,SECTORS,ROLE,ROLE_S,STAGECHK,mockup,WHO,AMT,eur,LANG,T,people,ventures,LEVEL,PROOF,esc,vimg,lightbox,interview,startInterview,PLAN,STRICT,STRICT_D,KIND,STATUS,need,mcard};
})();

/* V7: the founder profile changes the site: header link, match on the cards, sorted ventures, team fit on venture pages */
(function(){if(typeof document==='undefined'||!document.addEventListener)return;
 const {getProfile,teamHTML,ventures,match,esc,T,LANG}=window.TNV;
 function run(){const p=getProfile();
  document.querySelectorAll('[data-team]').forEach(el=>{const v=ventures.find(x=>x.id===el.dataset.team);if(v)el.innerHTML=teamHTML(v,p)});
  if(!p)return;
  const a=document.querySelector('header.site .right .pill');
  if(a){a.innerHTML='<span class="hp-av">'+esc((p.name||'?').trim().charAt(0).toUpperCase())+'</span>'+T('Jouw profiel','Your profile');a.href=a.getAttribute('href').replace(/#\/(en\/)?login$/,'#/$1me');a.classList.add('hp')}
  const g=document.getElementById('vroot');if(!g)return;
  const cards=[...g.querySelectorAll('.nv-v')];
  cards.forEach(c=>{const v=ventures.find(x=>x.id===c.dataset.id);const m=match(v,p);const img=c.querySelector('.vc-img');if(img&&m!=null){const b=document.createElement('span');b.className='vc-match'+(m>=75?' hi':'');b.textContent=m+'% match';img.appendChild(b)}c.dataset.m=m});
  if(document.getElementById('fs')){cards.sort((x,y)=>y.dataset.m-x.dataset.m).forEach(c=>g.appendChild(c));
   const n=document.createElement('div');n.className='vsorted';n.innerHTML='<span class="hp-av">'+esc((p.name||'?').trim().charAt(0).toUpperCase())+'</span><span>'+T('Gesorteerd op jouw match, ','Sorted by your match, ')+'<b>'+esc(p.name||'')+'</b></span><a href="'+(window.TNV_ROOT||'')+'app/index.html#/'+(LANG==='en'?'en/':'')+'me">'+T('Bekijk je profiel','See your profile')+'</a>';g.parentNode.insertBefore(n,g)}}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run()})();
