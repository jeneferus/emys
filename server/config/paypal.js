import paypal from "@paypal/checkout-server-sdk";

const environment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  // Usar Sandbox si no estamos en producción
  if (process.env.NODE_ENV === "Sandbox") {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  } else {
   console.log("nada no es bien el sendbox")
  }
};

const client = () => {
  return new paypal.core.PayPalHttpClient(environment());
};

export default client;