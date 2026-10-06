export function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(d);
}

const digits = (v) => String(v ?? "").replace(/\D/g, "");

export const phoneHref = (phone) => `tel:+${digits(phone)}`;

export function whatsappHref(number, text = "") {
  const base = `https://wa.me/${digits(number)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
