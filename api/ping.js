export default function handler(req,res){res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');res.status(200).send('ok')}
