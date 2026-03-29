import { SITE_NAME, SITE_URL } from "./constants";

export function generateLeadNotificationEmail(params: {
  businessName: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  leadMessage?: string;
  listingUrl: string;
}) {
  return {
    subject: `New lead from ${SITE_NAME}: ${params.leadName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #b91c1c; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">${SITE_NAME}</h1>
        </div>
        <div style="padding: 24px; background: #fdfcfa;">
          <h2 style="color: #111; margin-top: 0;">New Lead for ${params.businessName}!</h2>
          <p style="color: #555;">Someone found your business on Triad Directory and wants to connect:</p>
          <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Name:</strong> ${params.leadName}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${params.leadEmail}">${params.leadEmail}</a></p>
            ${params.leadPhone ? `<p style="margin: 4px 0;"><strong>Phone:</strong> <a href="tel:${params.leadPhone}">${params.leadPhone}</a></p>` : ""}
            ${params.leadMessage ? `<p style="margin: 4px 0;"><strong>Message:</strong></p><p style="margin: 4px 0; color: #555;">${params.leadMessage}</p>` : ""}
          </div>
          <p style="color: #555; font-size: 14px;">Respond quickly — businesses that reply within 1 hour are 7x more likely to win the job.</p>
          <a href="${params.listingUrl}" style="display: inline-block; background: #b91c1c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Your Listing</a>
        </div>
        <div style="padding: 16px 24px; background: #f5f5f5; font-size: 12px; color: #888; text-align: center;">
          <p>You received this because your business is listed on <a href="${SITE_URL}" style="color: #b91c1c;">${SITE_NAME}</a>.</p>
          <p><a href="${SITE_URL}/dashboard" style="color: #b91c1c;">Manage your listing</a> | <a href="${SITE_URL}/pricing" style="color: #b91c1c;">Upgrade to Premium</a></p>
        </div>
      </div>
    `,
  };
}

export function generateClaimNotificationEmail(params: {
  businessName: string;
  claimUrl: string;
}) {
  return {
    subject: `Your business "${params.businessName}" is listed on ${SITE_NAME}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #b91c1c; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">${SITE_NAME}</h1>
        </div>
        <div style="padding: 24px; background: #fdfcfa;">
          <h2 style="color: #111; margin-top: 0;">Your Business Is Already Listed!</h2>
          <p style="color: #555;">Good news — <strong>${params.businessName}</strong> already has a listing on Triad Directory, the Piedmont Triad's fastest-growing business directory.</p>
          <p style="color: #555;">Claim your listing to:</p>
          <ul style="color: #555;">
            <li>Update your business information</li>
            <li>Respond to customer reviews</li>
            <li>Receive lead notifications directly</li>
            <li>Access your analytics dashboard</li>
            <li>Upgrade to Premium for top placement</li>
          </ul>
          <a href="${params.claimUrl}" style="display: inline-block; background: #b91c1c; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">Claim Your Listing — Free</a>
          <p style="color: #888; font-size: 14px; margin-top: 16px;">This takes less than 2 minutes. No credit card required.</p>
        </div>
        <div style="padding: 16px 24px; background: #f5f5f5; font-size: 12px; color: #888; text-align: center;">
          <p>You received this because ${params.businessName} is listed on <a href="${SITE_URL}" style="color: #b91c1c;">${SITE_NAME}</a>.</p>
        </div>
      </div>
    `,
  };
}

export function generateWelcomeEmail(params: {
  businessName: string;
  ownerName: string;
  tier: string;
  dashboardUrl: string;
}) {
  return {
    subject: `Welcome to ${SITE_NAME}${params.tier !== "free" ? " Premium" : ""}!`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #b91c1c; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">${SITE_NAME}</h1>
        </div>
        <div style="padding: 24px; background: #fdfcfa;">
          <h2 style="color: #111; margin-top: 0;">Welcome, ${params.ownerName}!</h2>
          <p style="color: #555;">${params.businessName} is now ${params.tier === "free" ? "listed" : "a Premium member"} on Triad Directory. Here's what to do next:</p>
          <div style="margin: 20px 0;">
            <div style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
              <strong style="color: #111;">1. Complete Your Profile</strong>
              <p style="color: #555; margin: 4px 0; font-size: 14px;">Add your hours, description, photos, and service tags to improve your visibility.</p>
            </div>
            <div style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
              <strong style="color: #111;">2. Ask for Reviews</strong>
              <p style="color: #555; margin: 4px 0; font-size: 14px;">Businesses with 10+ reviews get 3x more leads. Send your customers a link to review you.</p>
            </div>
            <div style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
              <strong style="color: #111;">3. Share Your Listing</strong>
              <p style="color: #555; margin: 4px 0; font-size: 14px;">Post your Triad Directory listing on social media and your website for an SEO boost.</p>
            </div>
            ${params.tier === "free" ? `
            <div style="padding: 12px 0;">
              <strong style="color: #b91c1c;">4. Upgrade to Premium</strong>
              <p style="color: #555; margin: 4px 0; font-size: 14px;">Premium listings get 10x more visibility, top placement, and lead tracking. <a href="${SITE_URL}/pricing" style="color: #b91c1c;">View plans →</a></p>
            </div>
            ` : ""}
          </div>
          <a href="${params.dashboardUrl}" style="display: inline-block; background: #b91c1c; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">Go to Your Dashboard</a>
        </div>
        <div style="padding: 16px 24px; background: #f5f5f5; font-size: 12px; color: #888; text-align: center;">
          <p>Questions? Reply to this email or contact us at hello@triaddirectory.com</p>
        </div>
      </div>
    `,
  };
}
