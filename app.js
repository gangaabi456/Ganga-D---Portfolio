var $=function(s){return document.querySelector(s)},uid=function(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)};
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function okUrl(u){try{var x=new URL(u);return x.protocol=="https:"||x.protocol=="http:"}catch(e){return false}}
var K="gp_portfolio_v1",D=null,OWN=false,PUB=null,SRC="<!DOCTYPE html>\n"+document.documentElement.outerHTML;
try{PUB=JSON.parse(document.getElementById("pub").textContent)}catch(e){}
D=JSON.parse(JSON.stringify(SEED));D.edit=false;
function save(){if(!OWN)return;try{localStorage.setItem(K,JSON.stringify(D))}catch(e){toast("Browser storage is full or blocked. Changes may not persist.")}}
function toast(m){var t=$("#tt");t.textContent=m;t.style.display="block";clearTimeout(toast.h);toast.h=setTimeout(function(){t.style.display="none"},3200)}

/* image storage (IndexedDB) */
function idb(){return new Promise(function(r,j){var q=indexedDB.open("gp_files",1);q.onupgradeneeded=function(){q.result.createObjectStore("f")};q.onsuccess=function(){r(q.result)};q.onerror=function(){j(q.error)}})}
function tx(m,f){return idb().then(function(d){return new Promise(function(r,j){var t=d.transaction("f",m),q=f(t.objectStore("f"));t.oncomplete=function(){r(q&&q.result)};t.onerror=function(){j(t.error)}})})}
function fPut(k,b){return tx("readwrite",function(s){return s.put(b,k)})}
function fGet(k){return tx("readonly",function(s){return s.get(k)})}
function fDel(k){return tx("readwrite",function(s){return s.delete(k)}).catch(function(){})}
var U={};
async function hyd(){var els=document.querySelectorAll("[data-img]");for(var i=0;i<els.length;i++){var id=els[i].dataset.img;if(/^(images\/|files\/|https?:|\/_blob\/)/.test(id)){els[i].src=id;continue}try{if(!U[id]){var b=await fGet(id);if(b)U[id]=URL.createObjectURL(b)}if(U[id])els[i].src=U[id]}catch(e){}}}
function im(id,alt,cls){return id?'<img class="'+cls+'" data-img="'+esc(id)+'" alt="'+esc(alt)+'">':'<div class="'+cls+' ph">No image uploaded yet</div>'}

/* schemas: [key,label,type,required,options] */
var S={
profile:{n:"profile",f:[["name","Name","text",1],["role","Role","text"],["intro","Short introduction","area"],["photo","Profile photo","img"],["resume","Resume (PDF or Word)","file"],["about","About me","area"],["interests","Technical interests","area"],["goal","Career goal","area"],["journey","Learning journey","area"],["strengths","Professional strengths","area"],["email","Email address","email"],["phone","Phone (optional)","text"],["location","Location (optional)","text"],["github","GitHub link","url"],["linkedin","LinkedIn link","url"],["endpoint","Contact form endpoint URL (Formspree, Web3Forms or similar)","url"]]},
projects:{n:"project",f:[["title","Project title","text",1],["desc","Description","area"],["img","Project image","img"],["tech","Technologies (comma separated)","list"],["features","Features (one per line)","lines"],["cat","Category","text"],["github","GitHub repository link","url"],["demo","Live demo link","url"]]},
internships:{n:"internship",f:[["company","Company name","text",1],["role","Internship role","text"],["duration","Duration","text"],["img","Certificate or image","img"],["desc","Description","area"],["tech","Technologies learned (comma separated)","list"],["details","Experience details","area"]]},
certificates:{n:"certificate",f:[["img","Certificate image","img"],["name","Certificate name","text",1],["by","Issued by","text"],["date","Issue date","text"],["desc","Description (optional)","area"]]},
education:{n:"education entry",f:[["degree","Degree or qualification","text",1],["inst","Institution","text"],["dept","Department","text"],["years","Year or duration","text"],["desc","Description","area"]]},
skills:{n:"skill",f:[["name","Skill name","text",1],["cat","Category","sel",0,CATS]]}};

/* modal */
var md=$("#md"),M=null;
function openM(h){$("#mbody").innerHTML=h;if(!md.open)md.showModal();document.body.classList.add("lock")}
md.addEventListener("close",function(){document.body.classList.remove("lock");M=null});
md.addEventListener("click",function(e){if(e.target===md)md.close()});
function fld(f,v){var k=f[0],t=f[2],id="f_"+k,val=v==null?"":v,h='<label for="'+id+'">'+f[1]+(f[3]?" *":"")+'</label>';
 if(Array.isArray(val))val=val.join(t=="lines"?"\n":", ");
 if(t=="area"||t=="lines")h+='<textarea id="'+id+'" rows="4">'+esc(val)+'</textarea>';
 else if(t=="img"||t=="file")h+='<input id="'+id+'" type="file" accept="'+(t=="img"?"image/*":".pdf,.doc,.docx")+'">'+(v?'<p class="hint">A file is saved. Choose another to replace it.</p>':"");
 else if(t=="sel")h+='<select id="'+id+'">'+f[4].map(function(o){return"<option"+(o==val?" selected":"")+">"+esc(o)+"</option>"}).join("")+"</select>";
 else h+='<input id="'+id+'" type="text" value="'+esc(val)+'"'+(t=="url"?' placeholder="https://"':"")+'>';
 return h+'<p class="err" id="e_'+k+'"></p>'}
function form(c,id){var s=S[c],it=c=="profile"?D.profile:(id?D[c].find(function(x){return x.id==id}):{});M={c:c,id:id};
 openM('<h2 id="mt">'+(c=="profile"?"Edit profile":(id?"Edit ":"Add ")+s.n)+'</h2><form id="ef" novalidate>'+s.f.map(function(f){return fld(f,it[f[0]])}).join("")+'<div class="ed"><button class="btn p" type="submit">Save</button><button class="btn" type="button" data-a="x">Cancel</button></div></form>');
 $("#ef").addEventListener("submit",function(e){e.preventDefault();saveForm()});setTimeout(function(){var i=$("#ef input,#ef textarea,#ef select");if(i)i.focus()},50)}
async function saveForm(){var c=M.c,id=M.id,s=S[c],ok=true,nv={},files=[];
 s.f.forEach(function(f){var k=f[0],t=f[2],el=$("#f_"+k),v;if(t=="img"||t=="file"){if(el.files[0])files.push([k,el.files[0]]);return}
  v=el.value.trim();var er="";if(t=="list")v=v.split(",").map(function(x){return x.trim()}).filter(Boolean);if(t=="lines")v=v.split("\n").map(function(x){return x.trim()}).filter(Boolean);
  if(f[3]&&!(Array.isArray(v)?v.length:v))er="This field is required.";
  if(t=="url"&&v&&!okUrl(v))er="Enter a full link starting with https://";
  if(t=="email"&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))er="Enter a valid email address.";
  $("#e_"+k).textContent=er;if(er)ok=false;nv[k]=v});
 if(!ok){var b=document.querySelector(".err:not(:empty)");if(b)b.previousElementSibling.focus();return}
 var it=c=="profile"?D.profile:(id?D[c].find(function(x){return x.id==id}):{id:uid()});
 try{for(var i=0;i<files.length;i++){var nid=uid();await fPut(nid,files[i][1]);if(it[files[i][0]])fDel(it[files[i][0]]);nv[files[i][0]]=nid;nv[files[i][0]+"Name"]=files[i][1].name}}catch(e){toast("Could not save the file. Browser storage may be blocked.");return}
 Object.assign(it,nv);if(c!="profile"&&!id){D[c].push(it);if(c=="certificates")ci=D[c].length-1}
 save();md.close();render();toast("Saved")}
function del(c,id){var s=S[c];M={c:c,id:id};openM('<h2 id="mt">Delete '+s.n+'?</h2><p class="mu">Are you sure you want to delete this '+s.n+'?</p><div class="ed"><button class="btn" type="button" data-a="x">Cancel</button><button class="btn d" type="button" data-a="yes">Yes, Delete</button></div>')}
function doDel(){var c=M.c,id=M.id,it=D[c].find(function(x){return x.id==id});if(it)S[c].f.forEach(function(f){if((f[2]=="img"||f[2]=="file")&&it[f[0]])fDel(it[f[0]])});
 D[c]=D[c].filter(function(x){return x.id!=id});if(ci>=D.certificates.length)ci=Math.max(0,D.certificates.length-1);save();md.close();render();toast("Deleted")}

/* page builders */
var ci=0;
function ctl(c,id){return '<div class="ed"><button class="btn s" data-a="edit" data-c="'+c+'" data-id="'+id+'">Edit</button><button class="btn s d" data-a="del" data-c="'+c+'" data-id="'+id+'">Delete</button></div>'}
function addBtn(c,label){return '<button class="btn p ed-only" data-a="add" data-c="'+c+'">'+label+'</button>'}
function head(t,c,label){return '<div class="sh"><h2>'+t+'</h2>'+(c?'<div class="ed-wrap">'+addBtn(c,label)+'</div>':"")+'</div>'}
function bgs(a){return(a||[]).map(function(x){return'<span class="bg">'+esc(x)+"</span>"}).join("")}
function link(u,l,cls){return u&&okUrl(u)?'<a class="btn s '+(cls||"")+'" href="'+esc(u)+'" target="_blank" rel="noopener">'+l+"</a>":""}
function empty(c,t){return'<div class="empty"><p>'+t+'</p><div class="ed-wrap">'+addBtn(c,"Add one now")+"</div></div>"}
var P={
home:function(){var p=D.profile;return'<div class="hero"><div><p class="mu">Hello, I am</p><h1 class="gt">'+esc(p.name)+'</h1><div class="ty"><span id="ty">'+esc(p.role)+'</span><span class="cur"></span></div><p class="mu" style="max-width:34em">'+esc(p.intro)+'</p><div class="row" style="margin:22px 0">'+(p.resume?'<button class="btn p" data-a="resume">Download Resume</button>':"")+'<a class="btn" href="#projects">View Projects</a><a class="btn" href="#contact">Contact Me</a></div><div class="row">'+(okUrl(p.github)?'<a class="soc" href="'+esc(p.github)+'" target="_blank" rel="noopener" aria-label="GitHub profile">GH</a>':"")+(okUrl(p.linkedin)?'<a class="soc" href="'+esc(p.linkedin)+'" target="_blank" rel="noopener" aria-label="LinkedIn profile">in</a>':"")+'<span class="ed-wrap"><button class="btn s" data-a="edit" data-c="profile">Edit profile</button></span></div></div><div class="ph0">'+im(p.photo,"Portrait of "+p.name,"photo")+"</div></div>"},
about:function(){var p=D.profile;function bx(t,v){return'<div class="card rv"><h3>'+t+'</h3><p class="mu">'+(v?esc(v):'Not added yet. Use Edit profile to fill this in.')+"</p></div>"}
 var e=D.education[0],i=D.internships[0];
 return head("About me")+'<div class="two" style="align-items:center;margin-bottom:24px"><div>'+im(p.photo,"Portrait of "+p.name,"photo")+'</div><div><p style="font-size:1.1rem">'+esc(p.about)+'</p><div class="ed-wrap"><button class="btn s" data-a="edit" data-c="profile">Edit profile</button></div></div></div><div class="grid">'+bx("Technical interests",p.interests)+bx("Career goal",p.goal)+bx("Learning journey",p.journey)+bx("Professional strengths",p.strengths)+(e?'<div class="card rv"><h3>Education</h3><p class="mu">'+esc(e.degree)+", "+esc(e.inst)+" ("+esc(e.years)+")</p></div>":"")+(i?'<div class="card rv"><h3>Internship</h3><p class="mu">'+esc(i.role)+", "+esc(i.company)+"</p></div>":"")+"</div>"},
skills:function(){var h=head("Skills","skills","Add skill")+'<div class="grid">';var any=0;CATS.forEach(function(c){var l=D.skills.filter(function(s){return s.cat==c});if(!l.length)return;any=1;h+='<div class="card rv"><h3>'+c+"</h3>"+l.map(function(s){return'<span class="bg">'+esc(s.name)+'<span class="ed-wrap"> <button class="ib" style="min-height:24px;padding:0 6px" data-a="edit" data-c="skills" data-id="'+s.id+'" aria-label="Edit '+esc(s.name)+'">Edit</button> <button class="ib" style="min-height:24px;padding:0 6px" data-a="del" data-c="skills" data-id="'+s.id+'" aria-label="Delete '+esc(s.name)+'">×</button></span></span>'}).join("")+"</div>"});
 return h+"</div>"+(any?"":empty("skills","No skills added yet."))},
projects:function(){var l=D.projects;return head("Projects","projects","Add New Project")+(l.length?'<div class="grid">'+l.map(function(p){return'<article class="card rv">'+im(p.img,p.title+" screenshot","cimg")+(p.cat?'<span class="mu" style="font-size:.85rem">'+esc(p.cat)+"</span>":"")+"<h3>"+esc(p.title)+'</h3><p class="mu">'+esc(p.desc)+"</p>"+bgs(p.tech)+(p.features&&p.features.length?'<ul class="ul">'+p.features.map(function(f){return"<li>"+esc(f)+"</li>"}).join("")+"</ul>":"")+'<div class="row">'+link(p.demo,"Live Demo","")+link(p.github,"GitHub","")+"</div>"+ctl("projects",p.id)+"</article>"}).join("")+"</div>":empty("projects","No projects yet."))},
internships:function(){var l=D.internships;return head("Internships","internships","Add Internship")+(l.length?'<div class="tl">'+l.map(function(i){return'<article class="card rv">'+im(i.img,i.company+" certificate","cimg")+"<h3>"+esc(i.role)+'</h3><p style="margin:0">'+esc(i.company)+'</p><p class="mu">'+esc(i.duration)+"</p>"+(i.desc?"<p>"+esc(i.desc)+"</p>":"")+bgs(i.tech)+(i.details?'<p class="mu">'+esc(i.details)+"</p>":"")+ctl("internships",i.id)+"</article>"}).join("")+"</div>":empty("internships","No internships yet."))},
education:function(){var l=D.education;return head("Education","education","Add education")+(l.length?'<div class="tl">'+l.map(function(e){return'<article class="card rv"><h3>'+esc(e.degree)+'</h3><p style="margin:0">'+esc(e.inst)+'</p><p class="mu" style="margin:0">'+esc(e.dept)+" · "+esc(e.years)+"</p>"+(e.desc?"<p>"+esc(e.desc)+"</p>":"")+ctl("education",e.id)+"</article>"}).join("")+"</div>":empty("education","No education entries yet."))},
certificates:function(){var l=D.certificates,c=l[ci];
 return head("Certificates","certificates","Add New Certificate")+(l.length?'<div class="cv"><div class="side" role="list">'+l.map(function(x,i){return'<button role="listitem" data-a="cert" data-i="'+i+'" aria-current="'+(i==ci)+'">'+esc(x.name)+"</button>"}).join("")+'</div><div class="card prev">'+im(c.img,"Certificate: "+c.name,"")+'<h3 style="margin-top:14px">'+esc(c.name)+'</h3><p class="mu" style="margin:0">Issued by '+esc(c.by)+" · "+esc(c.date)+"</p>"+(c.desc?"<p>"+esc(c.desc)+"</p>":"")+'<div class="row" style="margin-top:14px"><button class="btn s" data-a="cn" data-d="-1"'+(ci==0?" disabled":"")+'>Previous Certificate</button><button class="btn s" data-a="cn" data-d="1"'+(ci==l.length-1?" disabled":"")+'>Next Certificate</button></div>'+ctl("certificates",c.id)+"</div></div>":empty("certificates","No certificates yet."))},
contact:function(){var p=D.profile;return head("Contact")+'<div class="two"><div class="card"><p>'+(p.email?'<a href="mailto:'+esc(p.email)+'">'+esc(p.email)+"</a>":'<span class="mu">No email set</span>')+"</p>"+(p.phone?'<p><a href="tel:'+esc(p.phone)+'">'+esc(p.phone)+"</a></p>":"")+(p.location?'<p class="mu">'+esc(p.location)+"</p>":"")+'<div class="row">'+(okUrl(p.github)?'<a class="soc" href="'+esc(p.github)+'" target="_blank" rel="noopener" aria-label="GitHub profile">GH</a>':"")+(okUrl(p.linkedin)?'<a class="soc" href="'+esc(p.linkedin)+'" target="_blank" rel="noopener" aria-label="LinkedIn profile">in</a>':"")+'</div><div class="ed-wrap"><button class="btn s" data-a="edit" data-c="profile">Edit contact details</button></div></div><form class="card" id="cf" novalidate><div class="hp"><label for="hp">Leave empty</label><input id="hp" tabindex="-1" autocomplete="off"></div>'+[["n","Name","name"],["e","Email","email"],["s","Subject",""]].map(function(f){return'<label for="c_'+f[0]+'">'+f[1]+'</label><input id="c_'+f[0]+'" autocomplete="'+(f[2]||"off")+'"><p class="err" id="ce_'+f[0]+'"></p>'}).join("")+'<label for="c_m">Message</label><textarea id="c_m" rows="5"></textarea><p class="err" id="ce_m"></p><button class="btn p" id="cs" type="submit" style="margin-top:12px">Send Message</button><div id="st" role="status"></div></form></div>'}};

/* contact form */
var CR={n:function(v){return v.trim().length<2?"Enter your name.":""},e:function(v){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?"":"Enter a valid email address."},s:function(v){return v.trim().length<3?"Enter a subject.":""},m:function(v){return v.trim().length<10?"Write at least 10 characters.":""}};
function cchk(k){var el=$("#c_"+k),m=CR[k](el.value);$("#ce_"+k).textContent=m;el.setAttribute("aria-invalid",!!m);return!m}
function initForm(){var f=$("#cf");if(!f)return;Object.keys(CR).forEach(function(k){$("#c_"+k).addEventListener("input",function(){cchk(k)});$("#c_"+k).addEventListener("blur",function(){cchk(k)})});
 f.addEventListener("submit",async function(e){e.preventDefault();var st=$("#st");st.style.display="none";
  if(!Object.keys(CR).map(cchk).every(Boolean)){f.querySelector('[aria-invalid="true"]').focus();return}
  if($("#hp").value)return;var b=$("#cs"),p=D.profile;b.disabled=true;b.textContent="Sending…";
  var mail=p.email?' You can email <a href="mailto:'+esc(p.email)+"?subject="+encodeURIComponent($("#c_s").value)+"&body="+encodeURIComponent($("#c_m").value)+'">'+esc(p.email)+"</a> directly instead.":"";
  try{if(!p.endpoint)throw 0;var r=await fetch(p.endpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({name:$("#c_n").value,email:$("#c_e").value,subject:$("#c_s").value,message:$("#c_m").value})});if(!r.ok)throw 1;st.textContent="Message sent. Thank you!";f.reset()}
  catch(x){st.innerHTML=(x===0?"No email service is connected yet, so your message was <strong>not sent</strong>.":"The message service did not confirm delivery, so your message was <strong>not sent</strong>.")+mail}
  st.style.display="block";b.disabled=false;b.textContent="Send Message"})}

/* router + render */
var tyT=null;
function route(){var r=location.hash.slice(1);return PAGES.indexOf(r)>=0?r:"home"}
function render(){var r=route(),a=$("#app");clearInterval(tyT);a.className="w pg";a.innerHTML=P[r]();a.classList.toggle("hid",!(OWN&&D.edit));
 var st=document.getElementById("edcss");if(!st){st=document.createElement("style");st.id="edcss";document.head.appendChild(st)}st.textContent=(OWN&&D.edit)?"":".ed,.ed-wrap,.ed-only{display:none!important}";
 $("#em").textContent="Editing: "+(D.edit?"on":"off");$("#em").setAttribute("aria-pressed",D.edit);$("#em").hidden=!OWN;$("#pb").hidden=!OWN;
 document.querySelectorAll("#nl a").forEach(function(l){if(l.getAttribute("href")=="#"+r)l.setAttribute("aria-current","page");else l.removeAttribute("aria-current")});
 document.title=(r=="home"?"":r[0].toUpperCase()+r.slice(1)+" – ")+D.profile.name+" – "+D.profile.role;
 hyd();initForm();reveal();if(r=="home")typer()}
function reveal(){var els=document.querySelectorAll(".rv");if(!("IntersectionObserver" in window)){els.forEach(function(e){e.classList.add("on")});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(e,i){e.style.transitionDelay=Math.min(i*60,300)+"ms";io.observe(e)})}
function typer(){var R=[D.profile.role,"Frontend Developer","React Developer","Software Developer"].filter(function(v,i,a){return v&&a.indexOf(v)==i}),el=$("#ty"),ri=0,n=0,dir=1;if(!el||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 tyT=setInterval(function(){var w=R[ri];n+=dir;el.textContent=w.slice(0,n);if(dir==1&&n>=w.length){dir=0;setTimeout(function(){dir=-1},1400)}else if(dir==-1&&n<=0){dir=1;ri=(ri+1)%R.length}},70)}
$("#nl").innerHTML=PAGES.map(function(p){return'<li><a href="#'+p+'">'+p[0].toUpperCase()+p.slice(1)+"</a></li>"}).join("");
window.addEventListener("hashchange",function(){setMenu(false);window.scrollTo(0,0);render()});

/* events */
document.addEventListener("click",function(e){var b=e.target.closest("[data-a]");if(!b)return;var a=b.dataset.a,c=b.dataset.c,id=b.dataset.id;
 if(!OWN&&/^(add|edit|del|yes)$/.test(a))return;if(a=="add")form(c);else if(a=="edit")form(c,id);else if(a=="del")del(c,id);else if(a=="x")md.close();else if(a=="yes")doDel();
 else if(a=="cert"){ci=+b.dataset.i;render()}else if(a=="cn")step(+b.dataset.d);
 else if(a=="resume"&&/^(images\/|files\/|https?:|\/_blob\/)/.test(D.profile.resume)){var l0=document.createElement("a");l0.href=D.profile.resume;l0.download=D.profile.resumeName||"resume";l0.click()}else if(a=="resume")fGet(D.profile.resume).then(function(bl){if(!bl)return toast("Resume file not found.");var l=document.createElement("a");l.href=URL.createObjectURL(bl);l.download=D.profile.resumeName||"resume";l.click()})});
function step(d){var n=ci+d;if(n>=0&&n<D.certificates.length){ci=n;render()}}
document.addEventListener("keydown",function(e){if(route()=="certificates"&&!md.open&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){if(e.key=="ArrowLeft")step(-1);if(e.key=="ArrowRight")step(1)}if(e.key=="Escape")setMenu(false)});
$("#em").onclick=function(){D.edit=!D.edit;save();render()};$("#pb").onclick=function(){pubAll()};
var nav=$("#nav"),mb=$("#mb");function setMenu(o){nav.classList.toggle("open",o);mb.setAttribute("aria-expanded",o);mb.textContent=o?"Close":"Menu"}
mb.onclick=function(){setMenu(!nav.classList.contains("open"))};

/* background particles */
var cv=$("#fx"),cx=cv.getContext("2d"),PT=[];function rs(){cv.width=innerWidth;cv.height=innerHeight}rs();addEventListener("resize",rs);
for(var i=0;i<45;i++)PT.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.8+.4,v:Math.random()*.25+.05});
function dr(){cx.clearRect(0,0,cv.width,cv.height);cx.fillStyle="rgba(150,170,255,.55)";PT.forEach(function(p){p.y-=p.v;if(p.y<0){p.y=cv.height;p.x=Math.random()*cv.width}cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()});if(!matchMedia("(prefers-reduced-motion: reduce)").matches)requestAnimationFrame(dr)}dr();
async function pubAll(){var b=$("#pb");b.disabled=true;b.textContent="Publishing…";
 try{var as=await claude.use("assets"),ar=await claude.use("artifact");if(!as||!ar)throw new Error("Publishing is not available in this view.");
  var X=JSON.parse(JSON.stringify(D));var its=[X.profile].concat(X.projects,X.internships,X.certificates,X.education);
  for(var n=0;n<its.length;n++){var ks=["photo","resume","img"];for(var j=0;j<3;j++){var v=its[n][ks[j]];if(v&&v.indexOf("/_blob/")!=0){var bl=await fGet(v);if(!bl)throw new Error("A saved file is missing. Upload it again.");var r=await as.upload(bl);its[n][ks[j]]="/_blob/"+r.id}}}
  D=X;save();var Y=JSON.parse(JSON.stringify(X));delete Y.edit;var json=JSON.stringify(Y).replace(/</g,"\\u003c");
  var html=SRC.replace(/(<script id="pub" type="application\/json">)[\s\S]*?(<\/script>)/,function(m,a,c){return a+json+c});
  await ar.publish(html)}
 catch(e){toast((e&&e.message)||"Publishing failed. Your changes are still saved in this browser.")}
 b.disabled=false;b.textContent="Publish changes"}
render();

document.addEventListener("error",function(e){var t=e.target;if(t.tagName=="IMG"&&t.dataset.img){var d=document.createElement("div");d.className=t.className+" ph";d.textContent="Add image file: "+t.dataset.img;t.replaceWith(d)}},true);
