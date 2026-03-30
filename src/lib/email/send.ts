import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");
  }
  return _resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "NC Service Businesses <noreply@ncservicebusinesses.com>";

export async function sendLeadNotification(params: {
  to: string;
  businessName: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  leadMessage?: string;
  listingUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Resend not configured, skipping email:", params.to);
    return;
  }

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `New lead for ${params.businessName}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#b91c1c;padding:20px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:18px;">NC Service Businesses</h1>
          </div>
          <div style="padding:24px;background:#fdfcfa;">
            <h2 style="margin-top:0;color:#111;">New Lead for ${params.businessName}</h2>
            <div style="background:white;border:1px solid #e5e5e5;border-radius:8px;padding:16px;margin:16px 0;">
              <p style="margin:4px 0;"><strong>Name:</strong> ${params.leadName}</p>
              <p style="margin:4px 0;"><strong>Email:</strong> <a href="mailto:${params.leadEmail}">${params.leadEmail}</a></p>
              ${params.leadPhone ? `<p style="margin:4px 0;"><strong>Phone:</strong> <a href="tel:${params.leadPhone}">${params.leadPhone}</a></p>` : ""}
              ${params.leadMessage ? `<p style="margin:4px 0;"><strong>Message:</strong> ${params.leadMessage}</p>` : ""}
            </div>
            <p style="font-size:14px;color:#555;">Respond quickly — businesses that reply within 1 hour are 7x more likely to win the job.</p>
            <a href="${params.listingUrl}" style="display:inline-block;background:#b91c1c;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View Your Listing</a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send lead notification:", err);
  }
}

export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
  businessName: string;
  tier: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Welcome to NC Service Businesses${params.tier !== "free" ? " Premium" : ""}!`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#b91c1c;padding:20px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:18px;">NC Service Businesses</h1>
          </div>
          <div style="padding:24px;background:#fdfcfa;">
            <h2 style="margin-top:0;">Welcome, ${params.name}!</h2>
            <p>${params.businessName} is now listed on NC Service Businesses.</p>
            <p>Next steps:</p>
            <ol>
              <li><strong>Complete your profile</strong> — add hours, description, photos</li>
              <li><strong>Ask for reviews</strong> — businesses with 10+ reviews get 3x more leads</li>
              <li><strong>Share your listing</strong> — post it on social media for an SEO boost</li>
            </ol>
            <a href="https://ncservicebusinesses.com/business-portal" style="display:inline-block;background:#b91c1c;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Go to Your Dashboard</a>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
}
