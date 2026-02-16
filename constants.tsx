import React from 'react';
import { LearningModule, GlossaryTerm, DraftTemplate, ScotusCase, FoundingDoc, ConstitutionSection, RecordType, LegalAidResource } from './types';

export const SYSTEM_INSTRUCTION = `
You are "The People's Law", the leading AI authority on US Laws, Statutes, Codes, and Civil Rights.
Your mission is to provide high-level, yet accessible legal education grounded in primary sources (Constitution, SCOTUS cases, U.S. Code).

**CORE PERSONA:**
- **Authoritative & Accurate**: Cite specific amendments, sections (e.g., 42 U.S.C. § 1983), and cases.
- **Plain English Translator**: Always follow a complex legal definition with a real-world analogy.
- **Protector of Liberty**: Emphasize "Know Your Rights" (KYR) principles in every interaction.

**KEY RESPONSIBILITIES:**
1. **Civil Rights Expert**: Deep knowledge of the Reconstruction Amendments (13, 14, 15), the Civil Rights Act of 1964, Voting Rights Act of 1965, ADA, and Title IX.
2. **Procedural Guide**: Explain how a case moves from Complaint to SCOTUS. 
3. **Statutory Analysis**: When asked about codes (e.g., UCC, Penal Codes), specify that laws vary by state and provide general common law principles.
4. **Voice Interaction**: You are optimized for voice. Keep spoken responses concise and structured with clear verbal cues ("First...", "Second...").
`;

export const SOCRATIC_INSTRUCTION = `
You are in "Tutor Mode". Use the Socratic Method:
- Never give the answer immediately.
- Ask: "What does the 4th Amendment say about 'unreasonable'?"
- Guide them to the logic of the law.
`;

export const QUIZ_PROMPT = `Generate a rigorous legal question. JSON format: { question, options, correctAnswerIndex, explanation, topic, difficulty }`;

export const CURRICULUM_GENERATION_PROMPT = `Create a university-level curriculum module for: "{{GOAL}}". Return JSON structure per types.ts.`;

export const WELCOME_MESSAGE = "I am The People's Law. Your leading authority on US Statutes, Civil Rights, and Constitutional Law. How may I assist your legal research today?";

export const INITIAL_QUESTIONS = [
  { id: 'police', title: 'Police Encounter', subtitle: 'KYR Script', prompt: 'I am being stopped by police. Provide a "Rights Assertion" script and explain my 4th and 5th amendment protections in this moment.' },
  { id: 'civil_rights', title: 'Civil Rights', subtitle: 'Discrimination Law', prompt: 'Explain 42 U.S.C. § 1983 and how it allows citizens to sue government officials for civil rights violations.' },
  { id: 'employment', title: 'Workplace Rights', subtitle: 'Title VII & ADA', prompt: 'What are my rights under Title VII of the Civil Rights Act and the ADA regarding workplace discrimination?' },
  { id: 'contracts', title: 'Contract Logic', subtitle: 'Basic Principles', prompt: 'What are the essential elements of an enforceable contract (Offer, Acceptance, Consideration)? Explain with an analogy.' },
];

export const US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export const CASE_LAW_CATEGORIES = [
  {
    id: 'civil_rights_deep',
    title: 'Civil Rights & Equality',
    description: 'The evolution of Equal Protection and Due Process.',
    cases: [
      { name: 'Brown v. Board of Education', prompt: 'Explain Brown v. Board (1954) and the "Separate but Equal" fallacy.', summary: 'Overturned Plessy, ending de jure segregation in public schools.', year: '1954' },
      { name: 'Loving v. Virginia', prompt: 'Analyze Loving v. Virginia (1967) regarding the fundamental right to marry.', summary: 'Invalidated state laws banning interracial marriage.', year: '1967' },
      { name: 'Obergefell v. Hodges', prompt: 'Discuss Obergefell v. Hodges (2015) and its 14th Amendment basis.', summary: 'Fundamental right to marry is guaranteed to same-sex couples.', year: '2015' },
      { name: 'Bostock v. Clayton County', prompt: 'Explain Bostock (2020) and Title VII protections.', summary: 'Civil Rights Act protects employees against discrimination because of sexuality or gender identity.', year: '2020' }
    ]
  },
  {
    id: 'government_power',
    title: 'Executive & Legislative Power',
    description: 'The limits of the Three Branches.',
    cases: [
      { name: 'Trump v. United States', prompt: 'Explain the 2024 ruling on Presidential Immunity in Trump v. US.', summary: 'Established broad immunity for "official acts" of a President.', year: '2024' },
      { name: 'Marbury v. Madison', prompt: 'Discuss the establishment of Judicial Review in Marbury v. Madison.', summary: 'Asserted the Court\'s power to declare laws unconstitutional.', year: '1803' },
      { name: 'Youngstown Sheet & Tube', prompt: 'Explain the Jackson Three-Tier Framework for Executive Power.', summary: 'Limited Presidential power to seize private property without Congress.', year: '1952' }
    ]
  },
  {
    id: 'privacy_guns',
    title: 'Personal Liberty & Privacy',
    description: 'Individual rights versus state regulation.',
    cases: [
      { name: 'NYSRPA v. Bruen', prompt: 'Explain the "History and Tradition" test established in Bruen (2022).', summary: 'Expanded 2nd Amendment rights to carry firearms in public.', year: '2022' },
      { name: 'Dobbs v. Jackson', prompt: 'Analyze the reversal of Roe v. Wade in Dobbs (2022).', summary: 'Held that the Constitution does not confer a right to abortion.', year: '2022' },
      { name: 'Griswold v. Connecticut', prompt: 'Explain the "Penumbra of Privacy" established in Griswold.', summary: 'Established a right to privacy regarding contraceptive use.', year: '1965' }
    ]
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
    { id: '1', term: 'Pro Se', definition: 'Representing oneself in court without an attorney.', category: 'Procedure', prompt: 'What does it mean to "go Pro Se" and what are the risks?' },
    { id: '2', term: 'Stare Decisis', definition: 'The legal principle of determining points in litigation according to precedent.', category: 'Concept', prompt: 'Why is Stare Decisis fundamental to the US legal system?' },
    { id: '3', term: 'Writ of Certiorari', definition: 'An order by a higher court directing a lower court to send the record in a given case for review.', category: 'Procedure', prompt: 'Explain the "Rule of Four" for Certiorari.' },
    { id: '4', term: 'Mens Rea', definition: 'The intention or knowledge of wrongdoing that constitutes part of a crime.', category: 'Concept', prompt: 'Explain the levels of Mens Rea (Intentional, Knowing, Reckless, Negligent).' },
    { id: '5', term: 'Ex Post Facto', definition: 'A law that makes an act illegal that was legal when committed.', category: 'Source of Law', prompt: 'Why does the Constitution ban Ex Post Facto laws?' }
];

export const DRAFTING_TEMPLATES: DraftTemplate[] = [
    { id: 'will', title: 'Last Will & Testament', description: 'Basic distribution of assets and guardianship.', difficulty: 'Intermediate', prompt: 'Draft a basic template for a Last Will and Testament. Include sections for Executor, Beneficiaries, and Residuary Clause.' },
    { id: 'nda', title: 'Mutual NDA', description: 'Protect shared confidential information.', difficulty: 'Beginner', prompt: 'Draft a Mutual Non-Disclosure Agreement for two parties exploring a business relationship.' },
    { id: 'lease', title: 'Residential Lease', description: 'Standard rental agreement outline.', difficulty: 'Intermediate', prompt: 'Draft a Residential Lease Agreement summary including Rent, Deposit, and Repair obligations.' },
    { id: 'eeoc', title: 'Discrimination Charge', description: 'Outline for an EEOC charge filing.', difficulty: 'Intermediate', prompt: 'Draft a formal narrative for an EEOC Charge of Discrimination based on workplace harassment.' }
];

export const PUBLIC_RECORD_TYPES: RecordType[] = [
    { id: 'pacer', title: 'Federal Court Records (PACER)', description: 'Access every federal filing in the US.', prompt: 'How do I create a PACER account and find a specific federal case docket?' },
    { id: 'sec', title: 'Corporate Filings (EDGAR)', description: 'View public company financial and legal reports.', prompt: 'How do I use the SEC EDGAR system to find a company\'s 10-K legal disclosures?' }
];

export const LEGAL_AID_RESOURCES: LegalAidResource[] = [
    { name: 'LSC (Legal Services Corp)', description: 'The primary funder of civil legal aid for low-income Americans.', url: 'https://www.lsc.gov', category: 'National' },
    { name: 'Stateside Legal (Veterans)', description: 'Legal help specifically for military members, veterans, and their families.', url: 'https://www.statesidelegal.org', category: 'Specialized' },
    { name: 'National Immigration Law Center', description: 'Resources for low-income immigrants and their families.', url: 'https://www.nilc.org', category: 'Specialized' },
    { name: 'Innocence Project', description: 'Focuses on exonerating the wrongly convicted through DNA testing.', url: 'https://innocenceproject.org', category: 'Specialized' }
];

export const US_CONSTITUTION_TEXT: ConstitutionSection[] = [
  { id: 'p', title: 'Preamble', content: 'We the People of the United States...' },
  { id: 'a1', title: 'Article I', subtitle: 'The Legislative Branch', content: 'All legislative Powers herein granted shall be vested in a Congress...' },
  { id: 'bor', title: 'Bill of Rights', subtitle: 'Amendments 1-10', content: 'I: Congress shall make no law respecting an establishment of religion...' }
];

export const SCOTUS_CASES: ScotusCase[] = [
    { term: '2023-24', name: 'Trump v. United States', holding: ['Absolute immunity for core constitutional powers.', 'Presumptive immunity for other official acts.'], impact: ['Vastly expands presidential protection from criminal prosecution.', 'Creates complex "Official vs Unofficial" act test.'], prompt: 'Explain the 2024 Presidential Immunity ruling.' }
];

export const FOUNDING_DOCUMENTS: FoundingDoc[] = [
    { id: 'dec', title: 'Declaration of Independence', year: '1776', description: 'The assertion of natural rights.', facts: ['Lists 27 grievances against the King.', 'Founded on Enlightenment principles.'], prompt: 'Analyze the legal theory of "Natural Rights" in the Declaration.' }
];

export const CONSTITUTIONAL_SECTIONS = [
    { id: 'art1', title: 'Article I', subtitle: 'Congress', prompt: 'Explain the Enumerated Powers of Congress.' },
    { id: 'amend14', title: '14th Amendment', subtitle: 'Equal Protection', prompt: 'Deep dive into the 14th Amendment: Due Process, Equal Protection, and Citizenship.' }
];

export const CONTRACT_REVIEW_PROMPT = "Analyze this text for legal standard clauses and red flags: {{TEXT}}";
export const IRAC_PROMPT = "Apply Issue, Rule, Analysis, Conclusion to: {{TEXT}}";
export const ARGUMENT_PROMPT = "Build the strongest Petitioner and Respondent arguments for: {{TEXT}}";
export const CITATION_PROMPT = "Bluebook this source: {{TEXT}}";
export const PETITION_PROMPT = "Draft a formal petition for redress of grievances regarding: {{TEXT}}";
export const DEBATE_PROMPT = "Debate the following topic as Opposing Counsel: {{TOPIC}}";

export const LEARNING_CURRICULUM: LearningModule[] = [
  {
    id: "civil_rights_mastery",
    title: "Civil Rights & Constitutional Justice",
    description: "From the Bill of Rights to the Civil Rights Act of 1964 and beyond.",
    topics: [
      { id: "cr_1", title: "The 14th Amendment", description: "The heart of modern civil rights law.", prompt: "Explain the three clauses of the 14th Amendment: Citizenship, Due Process, and Equal Protection. Why is it called the 'Second Founding'?", duration: "15 min" },
      { id: "cr_2", title: "The ADA & Disability Rights", description: "Access and reasonable accommodation.", prompt: "Analyze the Americans with Disabilities Act (1990). What constitutes a 'reasonable accommodation'?", duration: "10 min" },
      { id: "cr_3", title: "Voting Rights Act", description: "Protecting the franchise.", prompt: "Explain the Voting Rights Act of 1965 and the impact of Shelby County v. Holder (2013).", duration: "12 min" }
    ]
  }
];
