/**
 * Utilities for recipient management, roles, color assignments,
 * signing order normalization, and field validation in Several People mode.
 */

export const RECIPIENT_ROLES = [
  {
    id: "signer",
    label: "Signer",
    desc: "Completes assigned signing fields."
  },
  {
    id: "validator",
    label: "Validator",
    desc: "Reviews or validates the document."
  },
  {
    id: "witness",
    label: "Witness",
    desc: "Participates as a witness."
  }
];

export const RECIPIENT_COLORS = [
  {
    id: "blue",
    name: "Blue",
    primary: "#2563eb",
    border: "#3b82f6",
    bg: "#eff6ff",
    text: "#1e40af",
    badgeBg: "bg-blue-600",
    ringClass: "ring-blue-500",
    borderClass: "border-blue-500",
    bgClass: "bg-blue-50/20"
  },
  {
    id: "emerald",
    name: "Emerald",
    primary: "#059669",
    border: "#10b981",
    bg: "#ecfdf5",
    text: "#065f46",
    badgeBg: "bg-emerald-600",
    ringClass: "ring-emerald-500",
    borderClass: "border-emerald-500",
    bgClass: "bg-emerald-50/20"
  },
  {
    id: "purple",
    name: "Purple",
    primary: "#7c3aed",
    border: "#8b5cf6",
    bg: "#f5f3ff",
    text: "#5b21b6",
    badgeBg: "bg-purple-600",
    ringClass: "ring-purple-500",
    borderClass: "border-purple-500",
    bgClass: "bg-purple-50/20"
  },
  {
    id: "amber",
    name: "Amber",
    primary: "#d97706",
    border: "#f59e0b",
    bg: "#fffbeb",
    text: "#92400e",
    badgeBg: "bg-amber-600",
    ringClass: "ring-amber-500",
    borderClass: "border-amber-500",
    bgClass: "bg-amber-50/20"
  },
  {
    id: "rose",
    name: "Rose",
    primary: "#e11d48",
    border: "#f43f5e",
    bg: "#fff1f2",
    text: "#9f1239",
    badgeBg: "bg-rose-600",
    ringClass: "ring-rose-500",
    borderClass: "border-rose-500",
    bgClass: "bg-rose-50/20"
  }
];

/**
 * Creates the default initial recipient for Several People mode.
 */
export function createInitialRecipient(index = 1) {
  const color = RECIPIENT_COLORS[(index - 1) % RECIPIENT_COLORS.length];
  return {
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: "Recipient 1",
    email: "",
    role: "signer",
    order: index,
    colorId: color.id,
    color,
    status: "draft"
  };
}

/**
 * Creates a new recipient with the next sequential order and distinct color.
 */
export function createNextRecipient(existingRecipients = []) {
  const nextOrder = existingRecipients.length + 1;
  const colorIndex = (nextOrder - 1) % RECIPIENT_COLORS.length;
  const color = RECIPIENT_COLORS[colorIndex];

  return {
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: `Recipient ${nextOrder}`,
    email: "",
    role: "signer",
    order: nextOrder,
    colorId: color.id,
    color,
    status: "draft"
  };
}

/**
 * Removes a recipient and re-normalizes the sequential signing order (1, 2, 3...).
 */
export function removeRecipientAndNormalize(recipients = [], recipientIdToRemove) {
  const filtered = recipients.filter((r) => r.id !== recipientIdToRemove);
  return filtered.map((r, idx) => {
    const newOrder = idx + 1;
    const color = RECIPIENT_COLORS[idx % RECIPIENT_COLORS.length];
    return {
      ...r,
      order: newOrder,
      colorId: color.id,
      color
    };
  });
}

/**
 * Finds a recipient by ID.
 */
export function getRecipientById(recipientId, recipients = []) {
  if (!recipientId) return null;
  return recipients.find((r) => r.id === recipientId) || null;
}

/**
 * Standard RFC 5322 compatible email validation regex.
 */
export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim());
}

/**
 * Validates recipients and field assignments before preparation completion.
 *
 * @param {Object} params
 * @param {Array<Object>} params.recipients
 * @param {Record<number, Array<Object>>} params.fieldsByPage
 * @param {'sequential' | 'parallel'} params.signingOrderMode
 * @returns {{ isValid: boolean, errors: string[], recipientErrors: Record<string, string[]> }}
 */
export function validatePreparation({
  recipients = [],
  fieldsByPage = {},
  signingOrderMode = "sequential"
}) {
  const errors = [];
  const recipientErrors = {};

  if (!recipients || recipients.length === 0) {
    errors.push("Please add at least one recipient.");
    return { isValid: false, errors, recipientErrors };
  }

  const seenEmails = new Set();
  const recipientIds = new Set(recipients.map((r) => r.id));

  // Validate each recipient
  recipients.forEach((rec, idx) => {
    const rErrors = [];

    if (!rec.name || !rec.name.trim()) {
      rErrors.push(`Recipient ${idx + 1} requires a name.`);
    }

    if (!rec.email || !rec.email.trim()) {
      rErrors.push(`Recipient ${idx + 1} requires a valid email address.`);
    } else if (!isValidEmail(rec.email)) {
      rErrors.push(`Recipient ${idx + 1} has an invalid email format.`);
    } else {
      const lowerEmail = rec.email.trim().toLowerCase();
      if (seenEmails.has(lowerEmail)) {
        rErrors.push(`Duplicate email "${rec.email}" found. Each recipient must have a unique email.`);
      } else {
        seenEmails.add(lowerEmail);
      }
    }

    if (!["signer", "validator", "witness"].includes(rec.role)) {
      rErrors.push(`Invalid role for recipient ${rec.name || idx + 1}.`);
    }

    if (rErrors.length > 0) {
      recipientErrors[rec.id] = rErrors;
      errors.push(...rErrors);
    }
  });

  // Validate fields and check for orphaned recipient IDs
  const allFields = Object.values(fieldsByPage).flat().filter(Boolean);

  if (allFields.length === 0) {
    errors.push("Please place at least one field (Signature, Name, Date, etc.) on the document.");
  }

  allFields.forEach((field) => {
    if (!field.recipientId || !recipientIds.has(field.recipientId)) {
      errors.push(`A ${field.type} field on Page ${field.pageNumber || 1} is not assigned to a valid recipient.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    recipientErrors
  };
}
