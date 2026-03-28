import type { APIRoute } from 'astro'

// Simple in-memory rate limiter: max 5 submissions per IP per hour
const submissionMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = submissionMap.get(ip)

  if (!entry || entry.resetAt < now) {
    submissionMap.set(ip, { count: 1, resetAt: now + 3600_000 })
    return true
  }

  if (entry.count >= 5) return false

  entry.count++
  return true
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? '0.0.0.0'

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: { name?: string; email?: string; message?: string; lang?: string }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { name, email, message } = body

  if (!name?.trim() || name.trim().length > 100) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_name' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
  if (!email?.trim() || !isValidEmail(email.trim()) || email.length > 200) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
  if (!message?.trim() || message.trim().length > 2000) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_message' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  const RESEND_API_KEY = import.meta.env.RESEND_API_KEY
  const CONTACT_TO = import.meta.env.CONTACT_TO ?? 'info@ljanlji.com'
  const CONTACT_FROM = import.meta.env.CONTACT_FROM ?? 'noreply@ljanlji.com'

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set')
    return new Response(JSON.stringify({ ok: false, error: 'server_config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const html = `
    <div style="font-family:Georgia,serif;color:#3A2010;max-width:600px">
      <h2 style="color:#C4622D;margin-bottom:8px">Nova poruka — Ljanlji.com</h2>
      <p style="font-size:13px;color:#7A4A28;margin-bottom:24px">Primljeno putem kontakt forme</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:10px 0;border-bottom:1px solid #F0E4CE;color:#7A4A28;width:120px"><strong>Ime:</strong></td><td style="padding:10px 0;border-bottom:1px solid #F0E4CE">${name.trim()}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #F0E4CE;color:#7A4A28"><strong>Email:</strong></td><td style="padding:10px 0;border-bottom:1px solid #F0E4CE"><a href="mailto:${email.trim()}" style="color:#5A9060">${email.trim()}</a></td></tr>
      </table>
      <div style="margin-top:24px">
        <strong style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#7A4A28">Poruka:</strong>
        <div style="margin-top:10px;padding:16px;background:#FAF3E8;border-radius:4px;font-size:14px;line-height:1.7;white-space:pre-wrap">${message.trim()}</div>
      </div>
    </div>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Ljanlji <${CONTACT_FROM}>`,
        to: [CONTACT_TO],
        reply_to: email.trim(),
        subject: `Nova poruka od ${name.trim()} — Ljanlji`,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Resend error:', errText)
      return new Response(JSON.stringify({ ok: false, error: 'send_failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Contact form error:', err)
    return new Response(JSON.stringify({ ok: false, error: 'network_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
