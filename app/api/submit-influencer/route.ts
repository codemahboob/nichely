import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").trim();
  const instagramHandle = String(body.instagramHandle ?? "").trim();
  const followers = String(body.followers ?? "").trim();
  const avgLikes = String(body.avgLikes ?? "").trim();
  const avgViews = String(body.avgViews ?? "").trim();
  const niches = Array.isArray(body.niches) ? body.niches.map(String) : [];
  const otherNiche = String(body.otherNiche ?? "").trim();
  const reelCharge = String(body.reelCharge ?? "").trim();

  const missing: string[] = [];
  if (!fullName) missing.push("fullName");
  if (whatsapp.replace(/\D/g, "").length < 10) missing.push("whatsapp");
  if (!instagramHandle) missing.push("instagramHandle");
  if (!followers) missing.push("followers");
  if (!avgLikes) missing.push("avgLikes");
  if (!avgViews) missing.push("avgViews");
  if (niches.length === 0) missing.push("niches");
  if (niches.includes("Other") && !otherNiche) missing.push("otherNiche");
  if (!reelCharge) missing.push("reelCharge");

  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Missing or invalid fields", fields: missing },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.TO_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || "AdFex <onboarding@resend.dev>";

  if (!apiKey || !toEmail) {
    console.error("Missing RESEND_API_KEY or TO_EMAIL env vars");
    return NextResponse.json(
      { error: "Server is not configured to send email" },
      { status: 500 }
    );
  }

  const nicheList = niches
    .map((n) => (n === "Other" && otherNiche ? `Other — ${otherNiche}` : n))
    .join(", ");

  const html = `
    <div style="font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <div style="background:#0B0B0C; padding:20px 24px; border-radius:12px 12px 0 0;">
        <span style="color:#D7FF3D; font-weight:700; font-size:15px;">New creator application</span>
      </div>
      <div style="border:1px solid #E7E7E4; border-top:none; border-radius:0 0 12px 12px; padding:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#0B0B0C;">
          <tr><td style="padding:8px 0; color:#8A8A8E; width:160px;">Full name</td><td style="padding:8px 0; font-weight:600;">${escapeHtml(fullName)}</td></tr>
          <tr><td style="padding:8px 0; color:#8A8A8E;">WhatsApp</td><td style="padding:8px 0;">${escapeHtml(whatsapp)}</td></tr>
          <tr><td style="padding:8px 0; color:#8A8A8E;">Instagram</td><td style="padding:8px 0;">@${escapeHtml(instagramHandle)}</td></tr>
          <tr><td style="padding:8px 0; color:#8A8A8E;">Followers</td><td style="padding:8px 0;">${escapeHtml(followers)}</td></tr>
          <tr><td style="padding:8px 0; color:#8A8A8E;">Avg. Reel likes</td><td style="padding:8px 0;">${escapeHtml(avgLikes)}</td></tr>
          <tr><td style="padding:8px 0; color:#8A8A8E;">Avg. Reel views</td><td style="padding:8px 0;">${escapeHtml(avgViews)}</td></tr>
          <tr><td style="padding:8px 0; color:#8A8A8E; vertical-align:top;">Niche</td><td style="padding:8px 0;">${escapeHtml(nicheList)}</td></tr>
          <tr><td style="padding:8px 0; color:#8A8A8E;">Charge for 1 Reel</td><td style="padding:8px 0; font-weight:600;">₹${escapeHtml(reelCharge)}</td></tr>
        </table>
      </div>
    </div>
  `;

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New creator application: ${fullName} (@${instagramHandle})`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unexpected error sending email:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
