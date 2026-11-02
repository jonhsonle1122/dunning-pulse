/**
 * DunningPulse In-App Banner Widget (< 3KB)
 * Ultra-lightweight Vanilla JS embed for SaaS apps to alert past-due subscribers.
 */
(function(w,d){
  'use strict';
  if(w.__dp_init)return;w.__dp_init=true;
  function init(){
    var s=d.currentScript||d.querySelector('script[src*="banner.js"]');
    var c=w.DunningPulseConfig||{};
    var pid=c.projectId||(s&&s.getAttribute('data-project-id'));
    var cid=c.customerId||(s&&s.getAttribute('data-customer-id'));
    var host=c.apiHost||(s&&s.src?(new URL(s.src)).origin:w.location.origin);
    if(!pid||!cid)return;
    var url=host+'/api/v1/customer-status?projectId='+encodeURIComponent(pid)+'&customerId='+encodeURIComponent(cid);
    var xhr=new XMLHttpRequest();
    xhr.open('GET',url,true);
    xhr.onreadystatechange=function(){
      if(xhr.readyState===4&&xhr.status===200){
        try{var res=JSON.parse(xhr.responseText);if(res&&res.pastDue)render(res);}catch(e){}
      }
    };
    xhr.send();
  }
  function render(data){
    if(d.getElementById('dp-root'))return;
    var text=data.bannerText||'Subscription renewal failed. Please update your payment method.';
    var btn=data.buttonText||'Update Payment Method';
    var link=data.updateUrl||'#';
    var col=data.primaryColor||'#dc2626';
    var css='#dp-root{position:fixed;top:0;left:0;right:0;z-index:999999;background:'+col+';color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:dp-in .25s ease-out}'+
      '@keyframes dp-in{from{transform:translateY(-100%)}to{transform:translateY(0)}}'+
      '.dp-c{max-width:1200px;margin:0 auto;padding:8px 16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}'+
      '.dp-t{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;line-height:1.4}'+
      '.dp-a{display:flex;align-items:center;gap:8px}'+
      '.dp-b{background:#fff;color:'+col+';border:none;border-radius:5px;padding:5px 12px;font-size:12px;font-weight:600;text-decoration:none;cursor:pointer;white-space:nowrap}'+
      '.dp-x{background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:0 4px;opacity:.8}'+
      '.dp-x:hover{opacity:1}';
    var st=d.createElement('style');st.textContent=css;d.head.appendChild(st);
    var el=d.createElement('div');el.id='dp-root';el.setAttribute('role','alert');
    el.innerHTML='<div class="dp-c"><div class="dp-t"><span>⚠️</span><span>'+text+'</span></div><div class="dp-a"><a href="'+link+'" target="_blank" rel="noopener" class="dp-b">'+btn+'</a><button type="button" class="dp-x" aria-label="Dismiss">&times;</button></div></div>';
    d.body.insertBefore(el,d.body.firstChild);
    var close=el.querySelector('.dp-x');
    if(close)close.onclick=function(){el.style.display='none';};
  }
  if(d.readyState==='loading'){d.addEventListener('DOMContentLoaded',init);}else{init();}
})(window,document);
