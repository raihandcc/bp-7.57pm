const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = async (req, res) => {
  const { phone, code } = req.body;

  try {
    const result = await client.verify.v2
      .services(process.env.VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code: code
      });

    return res.status(200).json({
      success: result.status === "approved"
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
