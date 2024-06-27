const BASE_URL = "https://api.exchangerate-api.com/v4/latest/USD";

// Function to fill dropdowns with currency codes
const fillDropdowns = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch currency data");
    }
    const data = await response.json();
    const currencies = Object.keys(data.rates);

    // Fill dropdowns with currency options
    const dropdowns = document.querySelectorAll(".dropdown select");
    dropdowns.forEach((select) => {
      currencies.forEach((currency) => {
        let option = document.createElement("option");
        option.value = currency;
        option.textContent = currency;
        select.appendChild(option);
      });

      // Add change event listener to update flag when currency changes
      select.addEventListener("change", () => {
        updateFlag(select);
      });
    });

    // Set default selections
    dropdowns[0].value = "USD";
    dropdowns[1].value = "INR";

    // Update flags on page load
    updateFlag(dropdowns[0]);
    updateFlag(dropdowns[1]);
  } catch (error) {
    console.error("Error filling dropdowns:", error);
  }
};

// Function to update exchange rate
const updateExchangeRate = async () => {
  const form = document.querySelector("form");
  const amountInput = form.elements["amount"];
  const fromCurr = form.elements["from"].value;
  const toCurr = form.elements["to"].value;
  const msg = document.querySelector(".msg");

  // Validate input amount
  if (amountInput.value === "" || isNaN(amountInput.value)) {
    msg.textContent = "Please enter a valid amount";
    return;
  }

  const amount = parseFloat(amountInput.value);

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }
    const data = await response.json();

    if (!data.rates[toCurr]) {
      throw new Error(`Exchange rate for ${toCurr} not available`);
    }

    const rate = data.rates[toCurr];
    const convertedAmount = amount * rate;

    msg.textContent = `${amount} ${fromCurr} = ${convertedAmount.toFixed(
      2
    )} ${toCurr}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.textContent = "Failed to fetch exchange rate. Please try again later.";
  }
};

// Function to update flag image
const updateFlag = (select) => {
  const countryCode = countryList[select.value];
  const img = select.parentElement.querySelector("img");

  if (countryCode) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    img.alt = select.value;
  } else {
    img.src = "";
    img.alt = "Flag";
  }
};

// Event listener for form submission
const form = document.querySelector("form");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Initialize on page load
window.addEventListener("load", () => {
  fillDropdowns();
});
