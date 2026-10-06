import { html } from "../utils/html.js";

const firstSentence = (text = "") => (text.match(/^.*?[.!?](\s|$)/)?.[0] ?? text).trim();

export function dentistProfile(d) {
  return html`<div class="about-preview">
    <div class="portrait"><img src="${d.profileImage}" alt="Portrait of ${d.name}" width="800" height="1000" loading="lazy" decoding="async"></div>
    <div>
      <h2>Meet ${d.name}</h2>
      <p style="margin-top:1rem;font-size:var(--fs-lead);line-height:1.5">${firstSentence(d.biography[0])}</p>
      <dl class="facts">
        <div><dt>Specialty</dt><dd>${d.specialization[0] ?? ""}</dd></div>
        <div><dt>Experience</dt><dd>${d.experience} years</dd></div>
        <div><dt>University</dt><dd>${d.university}, ${d.graduationYear}</dd></div>
        <div><dt>Professional interests</dt><dd>${d.interests}</dd></div>
      </dl>
      <a class="btn btn--outline" href="about.html">Learn more</a>
    </div>
  </div>`;
}
