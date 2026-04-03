// worker/api-worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request){
  if(request.method === 'OPTIONS'){
    return new Response(null, {status:204, headers: corsHeaders})
  }

  const {message} = await request.json();

  // استخدام Secret Key من Cloudflare Worker
  const apiKey = OPENAI_API_KEY; // هذا المفتاح موجود في Secrets داخل Cloudflare

  const apiResponse = await fetch('https://api.openai.com/v1/chat/completions',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages:[{role:'user', content:message}],
      max_tokens:500
    })
  });

  const data = await apiResponse.json();
  const reply = data.choices?.[0]?.message?.content || 'لم يتم الرد';

  return new Response(JSON.stringify({reply}), {
    headers:{'Content-Type':'application/json', ...corsHeaders}
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'POST,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type'
}
