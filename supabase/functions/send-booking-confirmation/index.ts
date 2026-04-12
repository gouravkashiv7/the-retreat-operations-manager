import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const { 
      guestName, 
      guestEmail, 
      bookingId,
      startDate, 
      endDate, 
      numNights, 
      numGuests,
      accommodations, // Array of objects { label, number, description, price } or strings (legacy)
      totalPrice,
      status // "unconfirmed", "confirmed", or "checked-in"
    } = await req.json();

    const bookingStatus = status || "unconfirmed";
    const isConfirmed = bookingStatus === "confirmed" || bookingStatus === "checked-in";

    if (!guestEmail) {
      throw new Error("Guest email is required.");
    }

    const transporter = nodemailer.createTransport({
      host: Deno.env.get("EMAIL_HOST"),
      port: Number(Deno.env.get("EMAIL_PORT")),
      secure: false,
      auth: {
        user: Deno.env.get("EMAIL_USER"),
        pass: Deno.env.get("EMAIL_PASSWORD"),
      },
    });

    const brandGold = "#C69963";
    const brandDark = "#141C24";
    const brandCream = "#FAF5F0";
    const brandAccent = "#855F37";

    // Handle both object format { label, number, description, price } and legacy string format
    const formatAccPrice = (price: number) => {
      return Number(price).toLocaleString('en-IN');
    };

    const accommodationListHtml = (accommodations || [])
      .map((acc: any) => {
        // Support legacy string format
        if (typeof acc === "string") {
          return `
          <tr>
            <td style="padding: 14px 16px; border-bottom: 1px solid #F0E6D6;">
              <span style="font-weight: 700; font-size: 15px; color: ${brandDark};">${acc}</span>
            </td>
          </tr>`;
        }

        const label = acc.label || "Room";
        const number = acc.number || "—";
        const description = acc.description 
          ? (acc.description.length > 120 ? acc.description.substring(0, 120) + "..." : acc.description)
          : "";
        const price = acc.price ? `₹${formatAccPrice(acc.price)}` : "";

        return `
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid #F0E6D6;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding: 0;">
                  <span style="font-size: 11px; font-weight: 700; color: ${brandGold}; text-transform: uppercase; letter-spacing: 1px;">${label}</span>
                  <span style="font-weight: 700; font-size: 17px; color: ${brandDark}; display: block; margin-top: 3px;">${label} ${number}</span>
                  ${description ? `<p style="font-size: 12px; color: #888; margin: 6px 0 0; line-height: 1.5;">${description}</p>` : ""}
                </td>
                ${price ? `<td align="right" valign="top" style="padding-left: 10px; white-space: nowrap;">
                  <span style="font-size: 16px; font-weight: 700; color: ${brandAccent};">${price}</span>
                </td>` : ""}
              </tr>
            </table>
          </td>
        </tr>`;
      })
      .join("");

    // Format dates nicely
    const formatDate = (dateStr: string) => {
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
      } catch {
        return dateStr;
      }
    };

    const checkInFormatted = formatDate(startDate);
    const checkOutFormatted = formatDate(endDate);
    const formattedPrice = Number(totalPrice).toLocaleString('en-IN');

    // Status-specific content
    const statusBadge = isConfirmed
      ? `<td style="background-color: #E8F5E9; border-radius: 30px; padding: 10px 28px;">
           <span style="color: #2E7D32; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">✓ Reservation Confirmed</span>
         </td>`
      : `<td style="background-color: #FFF3E0; border-radius: 30px; padding: 10px 28px;">
           <span style="color: #E65100; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">⏳ Awaiting Confirmation</span>
         </td>`;

    const greetingMessage = isConfirmed
      ? `We are thrilled to confirm your reservation. Our team is preparing to welcome you to the tranquility of the Himalayas, where luxury and nature intertwine seamlessly.`
      : `Thank you for your interest in The Retreat Cottage. We have received your reservation request and the details are noted below. Please note that your booking is not yet confirmed.`;

    const unconfirmedNotice = !isConfirmed ? `
            <!-- Unconfirmed Notice -->
            <tr>
              <td style="padding: 0 20px 25px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FFF8E1; border: 1px solid #FFE082; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="padding: 20px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="padding-bottom: 10px;">
                            <span style="font-size: 15px; font-weight: 700; color: #E65100;">⚠ Action Required: Confirm Your Booking</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.6;">
                              To secure your stay, please pay the advance amount at your earliest convenience. You can reach us via WhatsApp or phone call:
                            </p>
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="background-color: #2E7D32; border-radius: 4px;">
                                  <a href="tel:+919906039157" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none;">📞 Call +91 99060 39157</a>
                                </td>
                              </tr>
                            </table>
                            <p style="margin: 12px 0 0; font-size: 12px; color: #999; line-height: 1.5;">
                              Your reservation will be held for a limited time. Unconfirmed bookings may be released to other guests.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>` : "";

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Reservation Confirmed — The Retreat Cottage</title>
    <!--[if mso]>
    <style type="text/css">
      table { border-collapse: collapse; }
      .fallback-font { font-family: Arial, sans-serif; }
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${brandCream}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <!-- Outer wrapper -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${brandCream};">
      <tr>
        <td align="center" style="padding: 20px 10px;">
          
          <!-- Email container -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <tr>
              <td style="background-color: ${brandDark}; padding: 50px 30px; text-align: center;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td align="center">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: ${brandGold}; text-transform: uppercase; letter-spacing: 4px;">The Retreat Cottage</h1>
                      <p style="margin: 10px 0 0; font-size: 14px; color: rgba(198,153,99,0.7); letter-spacing: 3px; text-transform: uppercase;">Boutique Mountain Sanctuary</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Status Badge -->
            <tr>
              <td align="center" style="padding: 30px 30px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    ${statusBadge}
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Greeting -->
            <tr>
              <td style="padding: 30px 30px 10px;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 300; color: ${brandDark};">Namaste, <strong>${guestName}</strong></h2>
              </td>
            </tr>
            
            <!-- Message -->
            <tr>
              <td style="padding: 0 30px 30px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #555;">
                  ${greetingMessage}
                </p>
              </td>
            </tr>

            ${unconfirmedNotice}
            
            <!-- Booking Card -->
            <tr>
              <td style="padding: 0 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FDFCFA; border: 1px solid #F0E6D6; border-radius: 8px; overflow: hidden;">
                  
                  <!-- Card Header -->
                  <tr>
                    <td style="padding: 20px 20px 15px; border-bottom: 2px solid ${brandGold};">
                      <span style="font-size: 12px; font-weight: 700; color: ${brandDark}; text-transform: uppercase; letter-spacing: 2px;">Stay Itinerary</span>
                    </td>
                  </tr>
                  
                  <!-- Booking ID -->
                  <tr>
                    <td style="padding: 16px 20px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Confirmation ID</td>
                          <td align="right" style="font-size: 15px; font-weight: 700; color: ${brandDark}; padding-bottom: 4px;">#${bookingId}</td>
                        </tr>
                      </table>
                      <div style="border-bottom: 1px solid #F0E6D6; padding-top: 8px;"></div>
                    </td>
                  </tr>
                  
                  <!-- Check-in -->
                  <tr>
                    <td style="padding: 12px 20px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Check-in</td>
                          <td align="right" style="font-size: 15px; font-weight: 600; color: ${brandDark}; padding-bottom: 4px;">${checkInFormatted}</td>
                        </tr>
                      </table>
                      <div style="border-bottom: 1px solid #F0E6D6; padding-top: 8px;"></div>
                    </td>
                  </tr>
                  
                  <!-- Check-out -->
                  <tr>
                    <td style="padding: 12px 20px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Check-out</td>
                          <td align="right" style="font-size: 15px; font-weight: 600; color: ${brandDark}; padding-bottom: 4px;">${checkOutFormatted}</td>
                        </tr>
                      </table>
                      <div style="border-bottom: 1px solid #F0E6D6; padding-top: 8px;"></div>
                    </td>
                  </tr>
                  
                  <!-- Duration -->
                  <tr>
                    <td style="padding: 12px 20px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Duration</td>
                          <td align="right" style="font-size: 15px; font-weight: 600; color: ${brandDark}; padding-bottom: 4px;">${numNights} Night${numNights > 1 ? 's' : ''}</td>
                        </tr>
                      </table>
                      <div style="border-bottom: 1px solid #F0E6D6; padding-top: 8px;"></div>
                    </td>
                  </tr>
                  
                  <!-- Guests -->
                  <tr>
                    <td style="padding: 12px 20px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Guests</td>
                          <td align="right" style="font-size: 15px; font-weight: 600; color: ${brandDark}; padding-bottom: 4px;">${numGuests} Guest${numGuests > 1 ? 's' : ''}</td>
                        </tr>
                      </table>
                      <div style="border-bottom: 1px solid #F0E6D6; padding-top: 8px;"></div>
                    </td>
                  </tr>
                  
                  <!-- Accommodations Section -->
                  <tr>
                    <td style="padding: 20px 20px 8px;">
                      <span style="font-size: 12px; font-weight: 700; color: ${brandDark}; text-transform: uppercase; letter-spacing: 2px;">Accommodations</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 20px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fff; border: 1px solid #F0E6D6; border-radius: 6px; overflow: hidden;">
                        ${accommodationListHtml}
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Total -->
                  <tr>
                    <td style="padding: 25px 20px 20px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 2px solid ${brandGold}; padding-top: 15px;">
                        <tr>
                          <td style="padding-top: 15px;">
                            <span style="font-size: 14px; font-weight: 700; color: ${brandDark}; text-transform: uppercase;">Grand Total</span>
                          </td>
                          <td align="right" style="padding-top: 15px;">
                            <span style="font-size: 22px; font-weight: 700; color: ${brandAccent};">₹${formattedPrice}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- What to Expect -->
            <tr>
              <td style="padding: 40px 30px 10px;">
                <span style="font-size: 12px; font-weight: 700; color: ${brandDark}; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid ${brandGold}; padding-bottom: 5px; display: inline-block;">What Awaits You</span>
              </td>
            </tr>
            
            <tr>
              <td style="padding: 20px 30px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 18px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td valign="top" style="padding-right: 12px; color: ${brandGold}; font-size: 16px;">✦</td>
                          <td>
                            <strong style="color: ${brandDark}; font-size: 15px;">Mountain Serenity</strong>
                            <p style="margin: 4px 0 0; font-size: 13px; color: #888; line-height: 1.5;">Panoramic Himalayan views from your private balcony.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 18px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td valign="top" style="padding-right: 12px; color: ${brandGold}; font-size: 16px;">✦</td>
                          <td>
                            <strong style="color: ${brandDark}; font-size: 15px;">Gourmet Dining</strong>
                            <p style="margin: 4px 0 0; font-size: 13px; color: #888; line-height: 1.5;">Locally sourced, chef-curated meals in a scenic setting.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td valign="top" style="padding-right: 12px; color: ${brandGold}; font-size: 16px;">✦</td>
                          <td>
                            <strong style="color: ${brandDark}; font-size: 15px;">Curated Experiences</strong>
                            <p style="margin: 4px 0 0; font-size: 13px; color: #888; line-height: 1.5;">Nature trails, starlit evenings, and moments crafted just for you.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- CTA Button -->
            <tr>
              <td align="center" style="padding: 25px 30px 40px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background-color: ${brandDark}; border-radius: 4px;">
                      <a href="https://retreatcottage.in" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 13px; font-weight: 700; color: ${brandGold}; text-decoration: none; text-transform: uppercase; letter-spacing: 2px;">Explore Our Property</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 30px;">
                <div style="border-top: 1px solid #F0E6D6;"></div>
              </td>
            </tr>

            <!-- Contact Note -->
            <tr>
              <td style="padding: 25px 30px;">
                <p style="margin: 0; font-size: 14px; color: #888; text-align: center; line-height: 1.6;">
                  Need anything? Simply reply to this email or call us at<br>
                  <a href="tel:+919906039157" style="color: ${brandAccent}; text-decoration: none; font-weight: 600;">+91 99060 39157</a>
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: ${brandDark}; padding: 30px; text-align: center;">
                <p style="margin: 0 0 6px; font-size: 14px; font-weight: 700; color: ${brandGold};">The Retreat Cottage</p>
                <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Dharampur, Himachal Pradesh, India</p>
                <p style="margin: 0; font-size: 12px;">
                  <a href="https://retreatcottage.in" style="color: ${brandGold}; text-decoration: none;">retreatcottage.in</a>
                </p>
              </td>
            </tr>

          </table>
          
        </td>
      </tr>
    </table>
    
</body>
</html>
    `;

    const subjectLine = isConfirmed 
      ? `Reservation Confirmed — Your Mountain Escape Awaits (#${bookingId})`
      : `Reservation Received — Action Required to Confirm (#${bookingId})`;

    const info = await transporter.sendMail({
      from: `"The Retreat Cottage" <${Deno.env.get("EMAIL_USER")}>`,
      to: guestEmail,
      subject: subjectLine,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
