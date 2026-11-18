/**
 * Blood Connect content for www.pillora.in: one source for the Blood Connect
 * guide, city pages and Health Hub articles.
 *
 * RULES (agreed with the owner, Nov 2026):
 *  - Eligibility facts only from official sources, cited on the page:
 *    eRaktKosh (MoHFW), NBTC/NACO, WHO. Nothing from memory.
 *  - Donors are NOT verified by Pillora (no verification step exists in code;
 *    only requesters go through ID/KYC). Say "registered donors".
 *  - No flagged claims (src/content/claims.ts) and no "real-time".
 *  - TODO(reviewer): a doctor must review this content. Do not present it as
 *    reviewed until then.
 */

export const SOURCES = {
    eraktkoshFaq: {
        title: 'eRaktKosh FAQ: Ministry of Health and Family Welfare, Government of India',
        url: 'https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/eraktkoshfaq.cnt',
    },
    eraktkosh: {
        title: 'eRaktKosh: blood availability and blood centres (MoHFW)',
        url: 'https://eraktkosh.mohfw.gov.in/',
    },
    nbtcGuidelines: {
        title: 'National Blood Transfusion Council (NBTC): Guidelines for Blood Donor Selection and Blood Donor Referral, 2017',
        url: 'http://nbtc.naco.gov.in/page/publications',
    },
    whoDonorSelection: {
        title: 'WHO: Blood donor selection, guidelines on assessing donor suitability for blood donation',
        url: 'https://www.who.int/publications/i/item/9789241548519',
    },
    whoFactSheet: {
        title: 'WHO fact sheet: Blood safety and availability',
        url: 'https://www.who.int/news-room/fact-sheets/detail/blood-safety-and-availability',
    },
    whoSerology: {
        title: 'WHO: Safe Blood and Blood Products, Module 3: Blood Group Serology',
        url: 'https://cdn.who.int/media/docs/default-source/blood-transfusion-safety/guidelines-and-principles-for-safe-blood-transfusion-practice-module-3-.pdf',
    },
} as const;

/** Shown on every Blood Connect page. Wording matches the Terms and About pages. */
export const EMERGENCY_NOTE =
    'In an emergency, also contact the nearest hospital or licensed blood bank, or call 108. Pillora is not a blood bank: it helps you reach registered voluntary donors.';

/**
 * Eligibility points confirmed on the official eRaktKosh FAQ (checked 19 Nov 2026).
 * TODO(reviewer): a doctor should confirm these against the current NBTC
 * guideline, including the haemoglobin cut-off, the upper age limit and
 * separate donation intervals for men and women, which could not be
 * confirmed from the primary NBTC document during drafting.
 */
/**
 * Donor age: Pillora's own limit and the national guidance are stated
 * SEPARATELY, each with its source (owner decision, 19 Nov 2026).
 * TODO(reviewer): a doctor should confirm the national upper age limit against
 * the current NBTC guideline (eRaktKosh says it depends on the donation type;
 * its questionnaire uses 18–65; older NACO material says 18–60).
 */
export const AGE_GUIDANCE = {
    national: {
        label: 'National guidance',
        text: 'The minimum age for whole blood donation is 18. The maximum age depends on the type of donation; the blood centre will confirm it.',
        source: { title: 'eRaktKosh FAQ (MoHFW)', url: 'https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/eraktkoshfaq.cnt' },
    },
    pillora: {
        label: 'Pillora’s own limit',
        text: 'Pillora accepts donor registrations from age 18 to 60.',
        source: { title: 'Pillora donor registration rule (checked when you register as a donor)' },
    },
} as const;

export const ELIGIBILITY_POINTS: string[] = [
    'You should weigh at least 45 kg.',
    'Leave three to four months between whole blood donations.',
    'Do not donate if you have a fever or an infection, or are under the influence of alcohol.',
    'Tell the blood centre about recent surgery or major dental work (in the last 6–12 months), and any tattoo, piercing or acupuncture in the last 6 months.',
    'Tell the blood centre about any medicines you take, such as antibiotics or blood thinners. Whether you can donate depends on the reason.',
    'The blood centre makes the final decision after a short health check before you donate.',
];

/** Pillora's own rule, enforced by the backend when you register as a donor. */
export const PILLORA_DONOR_REGISTRATION_RULE =
    'To register as a donor on Pillora you must be signed in and aged 18 to 60 (Pillora’s own limit).';

/**
 * Red cell compatibility: which donor blood groups a patient can usually
 * receive red cells from. Source: WHO, Module 3: Blood Group Serology.
 * Always confirmed by the hospital's cross-match before transfusion.
 */
export const RED_CELL_COMPATIBILITY: { recipient: string; canReceiveFrom: string[] }[] = [
    { recipient: 'O−', canReceiveFrom: ['O−'] },
    { recipient: 'O+', canReceiveFrom: ['O+', 'O−'] },
    { recipient: 'A−', canReceiveFrom: ['A−', 'O−'] },
    { recipient: 'A+', canReceiveFrom: ['A+', 'A−', 'O+', 'O−'] },
    { recipient: 'B−', canReceiveFrom: ['B−', 'O−'] },
    { recipient: 'B+', canReceiveFrom: ['B+', 'B−', 'O+', 'O−'] },
    { recipient: 'AB−', canReceiveFrom: ['AB−', 'A−', 'B−', 'O−'] },
    { recipient: 'AB+', canReceiveFrom: ['AB+', 'AB−', 'A+', 'A−', 'B+', 'B−', 'O+', 'O−'] },
];

/** How a blood request works on Pillora, checked against the backend code. */
export const REQUEST_STEPS: { title: string; text: string }[] = [
    {
        title: 'Sign in and submit a request',
        text: 'Enter the patient’s blood group, units needed, hospital and area, and a contact number.',
    },
    {
        title: 'Identity check',
        text: 'Upload an Aadhaar card, PAN card or driving licence. Our team checks each ID before any donor details are shared, to protect donors from misuse.',
    },
    {
        title: 'Matching registered donors',
        text: 'Pillora looks for registered donors with the same blood group in your city and area who agreed to be contacted and have not donated in the last 90 days.',
    },
    {
        title: 'Contact donors directly',
        text: 'You receive the contact details of up to 5 matching donors by WhatsApp and email and coordinate with them. The donation itself happens at a hospital or licensed blood bank.',
    },
];

export const DONOR_STEPS: { title: string; text: string }[] = [
    { title: 'Check you can donate', text: 'Read the eligibility points below. The blood centre makes the final decision.' },
    { title: 'Register as a donor', text: 'Sign in, add your blood group, city, area and contact number, and agree to be contacted. Your donor profile shows whether you are listed as available.' },
    { title: 'Get contacted', text: 'People who need your blood group in your area may contact you. Donation is always voluntary and unpaid.' },
];

export const BLOOD_CONNECT_FAQS: { question: string; answer: string }[] = [
    {
        question: 'Is Pillora a blood bank?',
        answer:
            'No. Pillora is a coordination platform that helps you reach registered voluntary donors. Blood is collected, tested and issued by hospitals and licensed blood banks. In an emergency, also contact the nearest hospital or licensed blood bank, or call 108.',
    },
    {
        question: 'Are donors on Pillora verified?',
        answer:
            'Donors register themselves with their blood group, city and contact details; Pillora does not medically screen donors. Every donor is checked by the blood centre before donating. People requesting blood have their ID document checked by our team before donor details are shared.',
    },
    {
        question: 'Do I have to pay for blood or for a donor?',
        answer:
            'No. Donation on Pillora is voluntary and unpaid. Buying or selling blood is illegal in India; report anyone who asks for money.',
    },
    {
        question: 'How often can I donate blood?',
        answer:
            'The official eRaktKosh guidance is every three to four months for whole blood. Your blood centre will confirm what applies to you.',
    },
    {
        question: 'Where can I check blood stock at blood banks?',
        answer:
            'The government’s eRaktKosh portal shows blood availability at blood centres. Pillora connects you with registered voluntary donors; it does not show blood bank stock.',
    },
];
