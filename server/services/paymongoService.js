const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

module.exports.createPaymentIntent = async (
  amount,
  description,
  statement_descriptor
) => {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amount * 100,
            payment_method_allowed: ["card", "paymaya", "gcash", "grab_pay"],
            payment_method_options: { card: { request_three_d_secure: "any" } },
            currency: "PHP",
            capture_type: "automatic",
            description: description,
            statement_descriptor: statement_descriptor,
          },
        },
      }),
    };

    const res = await fetch(
      "https://api.paymongo.com/v1/payment_intents",
      options
    );

    if (!res.ok) {
      throw new Error("Failed to create payment intent, please try again");
    }

    const data = await res.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error("PayMongo API Error:", error.response?.data || error);
    throw new Error("Failed to create payment intent, please try again later");
  }
};

module.exports.createPaymentMethod = async (
  contactInformation,
  paymentMethod,
  cardDetails
) => {
  console.log("Creating payment method with:", {
    contactInformation,
    paymentMethod,
    cardDetails,
  });

  try {
    let options = {};
    if (cardDetails) {
      options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
            "base64"
          )}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              details: {
                card_number: cardDetails.cardNumber,
                exp_month: parseInt(cardDetails.expiryMonth, 10),
                exp_year: parseInt(cardDetails.expiryYear, 10),
                cvc: cardDetails.cvc,
              },

              billing: {
                name: contactInformation.name,
                email: contactInformation.email,
                phone: contactInformation.phone,
              },
              type: paymentMethod,
            },
          },
        }),
      };
    } else {
      options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
            "base64"
          )}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              billing: {
                name: contactInformation.name,
                email: contactInformation.email,
                phone: contactInformation.phone,
              },
              type: paymentMethod,
            },
          },
        }),
      };
    }

    const res = await fetch(
      "https://api.paymongo.com/v1/payment_methods",
      options
    );
    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error("PayMongo API Error:", error.response?.data || error);
    throw error;
  }
};

module.exports.attachPaymentMethodToIntent = async (
  paymentIntentId,
  paymentMethodId,
  clientKey,
  bookingId
) => {
  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            payment_method: paymentMethodId,
            client_key: clientKey,
            return_url: `${process.env.PAYMENT_SUCCESS_RETURN_URL}/${bookingId}`,
          },
        },
      }),
    };

    const res = await fetch(
      `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`,
      options
    );

    if (!res.ok) {
      throw new Error(
        "Failed to attach payment method to intent, please try again"
      );
    }

    const data = await res.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error("PayMongo API Error:", error.response?.data || error);
    throw new Error("Failed to attach payment method to intent");
  }
};

module.exports.retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
          "base64"
        )}`,
      },
    };

    const res = await fetch(
      `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}`,
      options
    );

    if (!res.ok) {
      throw new Error("Failed to retrieve payment intent");
    }

    const data = await res.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.error("PayMongo API Error:", error.response?.data || error);
    throw new Error("Failed to retrieve payment intent");
  }
};
