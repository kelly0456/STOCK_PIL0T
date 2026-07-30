const axios = require("axios");
const Sale = require("../models/Sale");

const baseURL =
  process.env.MPESA_ENVIRONMENT === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

const normalizePhone = (phone) => {
  const digits = String(phone).replace(/[^0-9]/g, "");

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  if (digits.startsWith("7") && digits.length === 9) {
    return `254${digits}`;
  }

  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  return digits;
};

const getTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
};

const getAccessTokenInternal = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.get(
    `${baseURL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
};

exports.getAccessToken = async (req, res) => {
  try {
    const accessToken = await getAccessTokenInternal();

    return res.status(200).json({
      success: true,
      access_token: accessToken,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate access token",
    });
  }
};

const sendStkPush = async ({ phone, amount, accountReference, transactionDesc }) => {
  const normalizedPhone = normalizePhone(phone);
  const accessToken = await getAccessTokenInternal();
  const timestamp = getTimestamp();
  const passkey = process.env.MPESA_PASSKEY || process.env.DARAJA_PASSKEY;

  if (!passkey) {
    throw new Error(
      "Missing M-Pesa passkey. Set MPESA_PASSKEY or DARAJA_PASSKEY in .env."
    );
  }

  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${passkey}${timestamp}`
  ).toString("base64");

  const response = await axios.post(
    `${baseURL}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: normalizedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

exports.stkPush = async (req, res) => {
  try {
    const { phone, amount, accountReference, transactionDesc } = req.body;

    if (!phone || !amount || !accountReference) {
      return res.status(400).json({
        success: false,
        message: "Phone, amount, and account reference are required.",
      });
    }

    const data = await sendStkPush({
      phone,
      amount,
      accountReference,
      transactionDesc: transactionDesc || "StockPilot sale payment",
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "STK push failed.",
      details: error.response?.data || error.message,
    });
  }
};

exports.mpesaCallback = async (req, res) => {
  try {
    const callback = req.body;
    const stkCallback = callback?.Body?.stkCallback;

    if (!stkCallback) {
      return res.status(400).json({
        success: false,
        message: "Invalid callback payload.",
      });
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const metadata = stkCallback.CallbackMetadata?.Item || [];
    const accountReference = metadata.find((item) => item.Name === "AccountReference")?.Value;

    if (accountReference) {
      const sale = await Sale.findOne({ invoiceNumber: accountReference });

      if (sale) {
        sale.checkoutRequestId = checkoutRequestId || sale.checkoutRequestId;
        sale.paymentStatus = resultCode === 0 ? "paid" : "failed";
        await sale.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Callback received.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Callback handling failed.",
    });
  }
};