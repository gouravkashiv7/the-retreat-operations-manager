import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { guestName, guestEmail } = await req.json();

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

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to The Retreat</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f7f9;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .header {
            background-color: #4f46e5;
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #111827;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
        }
        .cta-container {
            text-align: center;
            margin: 40px 0;
        }
        .btn {
            background-color: #4f46e5;
            color: #ffffff !important;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
            transition: background-color 0.3s ease;
        }
        .btn:hover {
            background-color: #4338ca;
        }
        .activities {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 8px;
            margin-top: 30px;
        }
        .activities h3 {
            margin-top: 0;
            color: #111827;
            font-size: 18px;
        }
        .activities ul {
            padding-left: 20px;
            margin: 0;
            color: #4b5563;
        }
        .activities li {
            margin-bottom: 10px;
        }
        .footer {
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>The Retreat Cottage</h1>
        </div>
        <div class="content">
            <div class="greeting">Hello ${guestName},</div>
            <div class="message">
                We are delighted to inform you that you are now officially registered with <strong>The Retreat Cottage</strong>. Your journey to relaxation and premium mountain living starts here.
            </div>
            
            <div class="message">
                You can now access our portal to manage your bookings, view your stay details, and discover the unique activities we offer at our boutique property.
            </div>

            <div class="cta-container">
                <a href="https://retreatcottage.in/login" class="btn">Manage Your Stay</a>
            </div>

            <div class="activities">
                <h3>Discover What Awaits You:</h3>
                <ul>
                    <li><strong>Mountain Treks:</strong> Explore the breathtaking trails around the cottage.</li>
                    <li><strong>Starlit Dining:</strong> Enjoy intimate meals under the pristine night sky.</li>
                    <li><strong>Wellness sessions:</strong> Rejuvenate with yoga and meditation overlooking the valley.</li>
                    <li><strong>Boutique Activities:</strong> curated local experiences just for our guests.</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 The Retreat Cottage. All rights reserved.</p>
            <p>If you have any questions, feel free to reply to this email.</p>
        </div>
    </div>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: `"The Retreat Cottage" <${Deno.env.get("EMAIL_USER")}>`,
      to: guestEmail,
      subject: `Your Registration at The Retreat Cottage is Complete!`,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
