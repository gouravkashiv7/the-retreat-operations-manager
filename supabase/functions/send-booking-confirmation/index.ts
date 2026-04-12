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
      accommodations, // Array of strings like ["Master Room", "Family Cabin"]
      totalPrice 
    } = await req.json();

    if (!guestEmail) {
      throw new Error("Guest email is required.");
    }

    const transporter = nodemailer.createTransport({
      host: Deno.env.get("EMAIL_HOST"),
      port: Number(Deno.env.get("EMAIL_PORT")),
      secure: false, // true for 465, false for others
      auth: {
        user: Deno.env.get("EMAIL_USER"),
        pass: Deno.env.get("EMAIL_PASSWORD"),
      },
    });

    const brandGold = "#C69963";
    const brandDark = "#141C24";
    const brandCream = "#FAF5F0";

    const accommodationListHtml = accommodations
      .map(acc => `<li style="margin-bottom: 5px;"><strong>${acc}</strong></li>`)
      .join("");

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation - The Retreat Cottage</title>
    <style>
        body {
            font-family: 'Josefin Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1B2631;
            margin: 0;
            padding: 0;
            background-color: ${brandCream};
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .header {
            background-color: ${brandDark};
            color: ${brandGold};
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .header p {
            margin: 5px 0 0;
            font-style: italic;
            font-size: 14px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 20px;
            color: ${brandDark};
        }
        .message {
            font-size: 16px;
            margin-bottom: 30px;
        }
        .booking-details {
            background-color: #fcfbf9;
            border-left: 4px solid ${brandGold};
            padding: 25px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
        }
        .detail-label {
            font-weight: 700;
            color: ${brandDark};
            font-size: 14px;
            text-transform: uppercase;
        }
        .detail-value {
            color: #1B2631;
            font-weight: 600;
        }
        .cta-container {
            text-align: center;
            margin: 40px 0;
        }
        .btn {
            background-color: ${brandGold};
            color: ${brandDark} !important;
            padding: 18px 40px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .footer {
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #7C99B6;
            background-color: #f9f9f9;
            border-top: 1px solid #eee;
        }
        .footer p {
            margin: 5px 0;
        }
        .accent-text {
          color: ${brandGold};
          font-weight: 700;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>The Retreat Cottage</h1>
            <p>Luxury Mountain Living</p>
        </div>
        <div class="content">
            <div class="greeting">Namaste ${guestName},</div>
            <div class="message">
                We are delighted to confirm your upcoming stay at <span class="accent-text">The Retreat Cottage</span>. Your reservation has been successfully processed, and we are eagerly looking forward to welcoming you to the serenity of our mountain sanctuary.
            </div>
            
            <div class="booking-details">
                <div style="margin-bottom: 20px; color: ${brandDark}; font-weight: 700; font-size: 18px;">Reservation Summary</div>
                
                <div class="detail-row">
                    <span class="detail-label">Booking ID</span>
                    <span class="detail-value">#${bookingId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-in</span>
                    <span class="detail-value">${startDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-out</span>
                    <span class="detail-value">${endDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Nights</span>
                    <span class="detail-value">${numNights}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Guests</span>
                    <span class="detail-value">${numGuests}</span>
                </div>
                
                <div style="margin: 20px 0 10px; font-weight: 700; font-size: 14px; text-transform: uppercase; color: ${brandDark};">Accommodations:</div>
                <ul style="padding-left: 20px; margin: 0; color: #1B2631;">
                  ${accommodationListHtml}
                </ul>

                <div class="detail-row" style="margin-top: 25px; border-bottom: none; border-top: 2px solid ${brandGold}; padding-top: 15px;">
                    <span class="detail-label" style="font-size: 18px;">Total Amount</span>
                    <span class="detail-value" style="font-size: 18px; color: ${brandGold};">₹${totalPrice}</span>
                </div>
            </div>

            <div class="message">
                Please feel free to reach out if you have any special requests or if there's anything we can do to make your stay more comfortable.
            </div>

            <div class="cta-container">
                <a href="https://retreatcottage.in" class="btn">Explore More</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 The Retreat Cottage. Dharampur, Himachal Pradesh, India.</p>
            <p>Phone: +91 99060 39157 | Website: retreatcottage.in</p>
            <p>If you have any questions, simply reply to this email.</p>
        </div>
    </div>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: `"The Retreat Cottage" <${Deno.env.get("EMAIL_USER")}>`,
      to: guestEmail,
      subject: `Booking Confirmed: Your Stay at The Retreat Cottage (#${bookingId})`,
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
