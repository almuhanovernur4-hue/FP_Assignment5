const form = document.getElementById('ticket-form');
const eventInput = document.getElementById('event-select');
const dateInput = document.getElementById('ticket-date');
const typeInput = document.getElementById('ticket-type');
const quantityInput = document.getElementById('ticket-quantity');
const nameInput = document.getElementById('user-name');
const emailInput = document.getElementById('user-email');
const promoInput = document.getElementById('promo-code');
const soldoutNotice = document.getElementById('soldout-notice');

const previewTitle = document.getElementById('preview-title');
const previewEvent = document.getElementById('preview-event');
const previewDate = document.getElementById('preview-date');
const previewType = document.getElementById('preview-type');
const previewName = document.getElementById('preview-name');
const previewEmail = document.getElementById('preview-email');
const previewQuantity = document.getElementById('preview-quantity');
const previewTotal = document.getElementById('preview-total');
const errorSummary = document.getElementById('error-summary');

const eventError = document.getElementById('event-error');
const dateError = document.getElementById('date-error');
const typeError = document.getElementById('type-error');
const qtyError = document.getElementById('qty-error');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');

const concertSoldOutDates = ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04'];
const ticketInventory = [
  { type: 'Standard', seatsLeft: 8 },
  { type: 'VIP', seatsLeft: 3 }
];
const validPromos = { 'SALE10': 0.1, 'SUMMER20': 0.2 };
const takenNames = ['admin', 'root', 'test'];

let touched = { event: false, date: false, type: false, qty: false, name: false, email: false };

function validateEvent() {
  if (!eventInput.value) {
    if (touched.event) {
      eventInput.setAttribute('aria-invalid', 'true');
      eventError.textContent = 'Please select an event.';
    }
    return false;
  }
  eventInput.setAttribute('aria-invalid', 'false');
  eventError.textContent = '';
  return true;
}

function validateDate() {
  const val = dateInput.value;
  const eventVal = eventInput.value;

  if (!val) {
    if (touched.date) {
      dateInput.setAttribute('aria-invalid', 'true');
      dateError.textContent = 'Date is required.';
    }
    return false;
  } else if (eventVal === 'Concert' && concertSoldOutDates.includes(val)) {
    dateInput.setAttribute('aria-invalid', 'true');
    dateError.textContent = 'This date is sold out for concerts.';
    return false;
  }
  dateInput.setAttribute('aria-invalid', 'false');
  dateError.textContent = '';
  return true;
}

function validateType() {
  if (!typeInput.value) {
    if (touched.type) {
      typeInput.setAttribute('aria-invalid', 'true');
      typeError.textContent = 'Please select ticket type.';
    }
    return false;
  }
  typeInput.setAttribute('aria-invalid', 'false');
  typeError.textContent = '';
  return true;
}

function validateQuantity() {
  let qty = Number(quantityInput.value);
  let selectedType = typeInput.value;
  let inv = ticketInventory.find(i => i.type === selectedType);
  let maxSeats = inv ? inv.seatsLeft : 5;

  if (qty < 1) {
    if (touched.qty) {
      quantityInput.setAttribute('aria-invalid', 'true');
      qtyError.textContent = 'Quantity must be at least 1.';
    }
    return false;
  } else if (qty > maxSeats) {
    if (touched.qty) {
      quantityInput.setAttribute('aria-invalid', 'true');
      qtyError.textContent = `Only ${maxSeats} seats left for this type.`;
    }
    return false;
  }
  quantityInput.setAttribute('aria-invalid', 'false');
  qtyError.textContent = '';
  return true;
}

function validateName() {
  let val = nameInput.value.trim().toLowerCase();
  if (!val) {
    if (touched.name) {
      nameInput.setAttribute('aria-invalid', 'true');
      nameError.textContent = 'Name is required.';
    }
    return false;
  } else if (takenNames.includes(val)) {
    if (touched.name) {
      nameInput.setAttribute('aria-invalid', 'true');
      nameError.textContent = 'This name is already taken.';
    }
    return false;
  } else if (val.length < 2) {
    if (touched.name) {
      nameInput.setAttribute('aria-invalid', 'true');
      nameError.textContent = 'Name must be at least 2 chars.';
    }
    return false;
  }
  nameInput.setAttribute('aria-invalid', 'false');
  nameError.textContent = '';
  return true;
}

function validateEmail() {
  let val = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) {
    if (touched.email) {
      emailInput.setAttribute('aria-invalid', 'true');
      emailError.textContent = 'Email is required.';
    }
    return false;
  } else if (!emailRegex.test(val)) {
    if (touched.email) {
      emailInput.setAttribute('aria-invalid', 'true');
      emailError.textContent = 'Invalid email format.';
    }
    return false;
  }
  emailInput.setAttribute('aria-invalid', 'false');
  emailError.textContent = '';
  return true;
}

function updatePreview() {
  const selectedEvent = eventInput.value;

  if (selectedEvent === 'Concert') {
    soldoutNotice.style.display = 'block';
    previewTitle.textContent = 'Concert Ticket';
  } else if (selectedEvent === 'Football Match') {
    soldoutNotice.style.display = 'none';
    previewTitle.textContent = 'Football Match Ticket';
  } else if (selectedEvent === 'Theatre') {
    soldoutNotice.style.display = 'none';
    previewTitle.textContent = 'Theatre Ticket';
  } else {
    soldoutNotice.style.display = 'none';
    previewTitle.textContent = 'Ticket Preview';
  }

  previewEvent.textContent = selectedEvent || '—';
  previewDate.textContent = dateInput.value || '—';
  previewType.textContent = typeInput.value || '—';
  previewName.textContent = nameInput.value || '—';
  previewEmail.textContent = emailInput.value || '—';
  previewQuantity.textContent = quantityInput.value || '1';

  let basePrice = typeInput.value === 'VIP' ? 2500 : 1000;
  let qty = Number(quantityInput.value) || 0;
  let total = basePrice * qty;

  let promo = promoInput.value.trim();
  if (validPromos[promo]) {
    total = total * (1 - validPromos[promo]);
  }

  previewTotal.textContent = total + ' tg';
}

form.addEventListener('input', () => {
  updatePreview();
  if (touched.event) validateEvent();
  if (touched.date) validateDate();
  if (touched.type) validateType();
  if (touched.qty) validateQuantity();
  if (touched.name) validateName();
  if (touched.email) validateEmail();
});

eventInput.addEventListener('change', () => {
  updatePreview();
  if (touched.date) validateDate();
});

eventInput.addEventListener('blur', () => { touched.event = true; validateEvent(); });
dateInput.addEventListener('blur', () => { touched.date = true; validateDate(); });
typeInput.addEventListener('blur', () => { touched.type = true; validateType(); });
quantityInput.addEventListener('blur', () => { touched.qty = true; validateQuantity(); });
nameInput.addEventListener('blur', () => { touched.name = true; validateName(); });
emailInput.addEventListener('blur', () => { touched.email = true; validateEmail(); });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  touched = { event: true, date: true, type: true, qty: true, name: true, email: true };

  const valid = validateEvent() && validateDate() && validateType() && validateQuantity() && validateName() && validateEmail();

  if (!valid) {
    errorSummary.textContent = 'Form contains errors. Please check the fields above.';
    errorSummary.style.color = '#dc2626';

    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
  } else {
    let bookingCode = Math.floor(Math.random() * 90000 + 10000);
    errorSummary.textContent = 'Ticket booked successfully. Booking code: ' + bookingCode;
    errorSummary.style.color = '#16a34a';
    form.reset();
    soldoutNotice.style.display = 'none';
    touched = { event: false, date: false, type: false, qty: false, name: false, email: false };
    updatePreview();
  }
});
