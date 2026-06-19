const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function formatCanadianPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (String(phone).startsWith("+")) return phone;
  return phone;
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(200).json({ message: "Send OTP endpoint working" });
  }

  const { phone } = req.body || {};
  const formattedPhone = formatCanadianPhone(phone);

  if (!formattedPhone) {
    return res.status(400).json({ success: false, error: "Phone is required" });
  }

  try {
    await client.verify.v2
      .services(process.env.VERIFY_SERVICE_SID)
      .verifications.create({
        to: formattedPhone,
        channel: "sms"
      });

    return res.status(200).json({ success: true, phone: formattedPhone });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};
