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

  // Do not validate in the cart so we can reduce / remove cart items
  console.error("buyerJourney.step", input.buyerJourney.step);
  if(input.buyerJourney.step === "CART_INTERACTION") {
    console.error("NO VALIDATION in cart");
    return { errors: [] };
  }

  // Check if minimum order amount is set
  const minimumOrderAmountStr = input.cart.buyerIdentity?.purchasingCompany?.location?.metafield?.value;
  if (!minimumOrderAmountStr) {
    console.error("No B2B minimum order amount found");
    return { errors: [] };
  }

  // Currency code
  const currencyCode = input.cart.cost.subtotalAmount.currencyCode;
  console.error("currencyCode", currencyCode);

  // The error
  const errorMinimumOrderAmount = {
    localizedMessage:
        `The order amount MUST be ${minimumOrderAmountStr} ${currencyCode} or greater for this B2B customer`,
    target: "cart"
  };

  // Parse the decimal (serialized as a string) into a float.
  const orderSubtotal = parseFloat(input.cart.cost.subtotalAmount.amount);
  const minimumOrderAmount = parseFloat(minimumOrderAmountStr);
  console.error("orderSubtotal", orderSubtotal);
  console.error("minimumOrderAmount", minimumOrderAmount);

  // Orders with subtotals greater than $1,000 are available only to established customers.
  const errors = [];
  if (orderSubtotal < minimumOrderAmount) {
    errors.push(errorMinimumOrderAmount);
  }

  return { errors };
};