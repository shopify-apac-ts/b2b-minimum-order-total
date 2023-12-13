// @ts-check
// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
*/
// The configured entrypoint for the 'purchase.validation.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {
  // The error
  const errorMinimumOrderAmount = {
    localizedMessage:
        "There is an order minimum of location.custom.minimum_order_amount for B2B customers",
    target: "cart"
  };
  const errorCurrencyCode = {
    localizedMessage:
        "B2B customer can only place an order in USD",
    target: "cart"
  };

  // Check if minimum order amount is set
  const minimumOrderAmountStr = input.cart.buyerIdentity?.purchasingCompany?.location?.metafield?.value;
  if (!minimumOrderAmountStr) {
    console.error("No B2B minimum order amount found");
    return { errors: [] };
  }

  // Parse the decimal (serialized as a string) into a float.
  const orderSubtotal = parseFloat(input.cart.cost.subtotalAmount.amount);
  const minimumOrderAmount = parseFloat(minimumOrderAmountStr);
  const currencyCode = input.cart.cost.subtotalAmount.currencyCode;
  const errors = [];
  console.error("orderSubtotal", orderSubtotal);
  console.error("minimumOrderAmount", minimumOrderAmount);
  console.error("currencyCode", currencyCode);

  // Orders with subtotals greater than $1,000 are available only to established customers.
  if (orderSubtotal < minimumOrderAmount) {
    errors.push(errorMinimumOrderAmount);
  }
  if (currencyCode !== "USD") {
    errors.push(errorCurrencyCode);
  }

  return { errors };
};