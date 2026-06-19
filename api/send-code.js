const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = async (req, res) => {
  const { phone } = req.body;

  try {
    await client.verify.v2
      .services(process.env.VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: "sms"
      });

    return res.status(200).json({
      success: true
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
