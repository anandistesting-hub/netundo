export default async function handler(req,res){
  try{
    const forwarded = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '';
    const clientIp = String(forwarded).split(',')[0].trim();
    const url = clientIp
      ? `https://ipwho.is/${encodeURIComponent(clientIp)}`
      : 'https://ipwho.is/';
    const r=await fetch(url,{headers:{'Accept':'application/json'}});
    if(!r.ok) throw new Error('network lookup failed');
    const d=await r.json();
    if(d.success===false) throw new Error('geolocation failed');
    res.setHeader('Cache-Control','no-store');
    res.status(200).json({
      provider:d.connection?.org || d.connection?.isp || d.connection?.domain || 'Provider detected',
      city:d.city||'',
      region:d.region||'',
      country:d.country||'',
      asn:d.connection?.asn||''
    });
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(200).json({provider:'Provider lookup unavailable',city:'',region:'',country:'',asn:''});
  }
}