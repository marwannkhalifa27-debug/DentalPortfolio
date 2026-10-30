import { html } from "../utils/html.js";

const firstSentence = (text = "") => (text.match(/^.*?[.!?](\s|$)/)?.[0] ?? text).trim();

export function dentistProfile(d) {
  const education = [d.university, d.graduationYear].filter(Boolean).join(", ");
  const facts = [
    ["Specialty", d.specialization?.[0]],
    ["Experience", d.experience != null ? `${d.experience} years` : ""],
    ["University", education],
    ["Professional interests", d.interests],
  ].filter(([, value]) => value);

  return html`<div class="about-preview">
    <div class="portrait">${d.profileImage ? html`<img src="${d.profileImage}" alt="Portrait of ${d.name}" width="800" height="1000" loading="lazy" decoding="async">` : ""}</div>
    <div>
      <h2>Meet ${d.name}</h2>
      ${d.biography?.[0] ? html`<p style="margin-top:1rem;font-size:var(--fs-lead);line-height:1.5">${firstSentence(d.biography[0])}</p>` : ""}
      ${facts.length ? html`<dl class="facts">${facts.map(([label, value]) => html`<div><dt>${label}</dt><dd>${value}</dd></div>`)}</dl>` : ""}
      <a class="btn outline" href="about.html">Learn more</a>
    </div>
  </div>`;
}