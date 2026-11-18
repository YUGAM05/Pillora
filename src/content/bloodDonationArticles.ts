import type { HealthArticle } from '@/data/healthHubData';
import {
    ELIGIBILITY_POINTS,
    PILLORA_DONOR_REGISTRATION_RULE,
    RED_CELL_COMPATIBILITY,
    SOURCES,
} from '@/content/bloodConnect';

/**
 * Draft blood donation articles for the Health Hub (www.pillora.in/health-hub).
 *
 * - draft: true → hidden everywhere (listing, sitemap, article URL) unless
 *   NEXT_PUBLIC_SHOW_DRAFTS=true for local review.
 * - reviewPending: true → the page shows "Medical review pending" and never
 *   claims a medical review.
 * - Facts come only from the official sources listed on each article.
 *
 * To publish: a doctor reviews the article (TODO(reviewer)), then set
 * draft: false, reviewPending: false and the real publication date.
 */

const AUTHOR = {
    name: 'Pillora Editorial Team',
    // TODO(reviewer): add the reviewing doctor's name and credentials once confirmed.
    role: 'Health information',
};

export const BLOOD_DONATION_DRAFTS: HealthArticle[] = [
    {
        _id: 'who-can-donate-blood-in-india',
        slug: 'who-can-donate-blood-in-india',
        title: 'Who can donate blood in India?',
        description:
            'Who can donate blood in India: age, weight, the gap between donations and common reasons to wait, based on official eRaktKosh and NBTC guidance.',
        category: 'Blood Donation',
        readTime: '5 min read',
        date: '2026-11-19',
        author: AUTHOR,
        mediaType: 'image',
        tags: ['Blood donation', 'Eligibility', 'India'],
        draft: true,
        reviewPending: true,
        keyTakeaways: [
            'Most healthy adults aged 18 and above who weigh at least 45 kg can donate blood.',
            'Leave three to four months between whole blood donations.',
            'Tell the blood centre about recent illness, surgery, tattoos or medicines. They make the final decision.',
            'Blood donation in India is voluntary and unpaid.',
        ],
        sections: [
            {
                heading: 'The basic requirements',
                paragraphs: [
                    'Blood donation in India follows the national donor selection guidelines of the National Blood Transfusion Council (NBTC). The government’s eRaktKosh portal summarises the main points for donors:',
                ],
                bulletPoints: ELIGIBILITY_POINTS.slice(0, 3),
            },
            {
                heading: 'Reasons you may need to wait',
                paragraphs: [
                    'Some situations mean you should wait before donating, to protect both you and the patient. The blood centre will ask about them before you donate:',
                ],
                bulletPoints: ELIGIBILITY_POINTS.slice(3, 6),
            },
            {
                heading: 'Who makes the final decision?',
                paragraphs: [
                    'The blood centre does. Before you donate, staff ask about your health and do a short check. If they ask you to wait, it is to keep you and the patient safe.',
                ],
            },
            {
                heading: 'Donation is voluntary and unpaid',
                paragraphs: [
                    'WHO recommends that blood is collected from voluntary, unpaid donors. In India, buying or selling blood is illegal. Never pay a donor or accept money for donating.',
                ],
            },
            {
                heading: 'Registering as a donor on Pillora',
                paragraphs: [
                    `${PILLORA_DONOR_REGISTRATION_RULE} Registering means people who need your blood group in your area can contact you; you still donate at a hospital or licensed blood bank, which checks your eligibility first.`,
                ],
                callout:
                    'In an emergency, also contact the nearest hospital or licensed blood bank, or call 108. Pillora is not a blood bank.',
            },
        ],
        faqs: [
            {
                question: 'What is the minimum age to donate blood in India?',
                answer: 'The eRaktKosh guidance sets the minimum age for whole blood donation at 18 years. The upper age limit depends on the type of donation; the blood centre will confirm it.',
            },
            {
                question: 'How often can I donate blood?',
                answer: 'eRaktKosh advises a gap of three to four months between whole blood donations.',
            },
            {
                question: 'Can I donate blood if I have a tattoo?',
                answer: 'Tell the blood centre. The eRaktKosh donor questionnaire asks about tattoos, piercings or acupuncture in the last 6 months, and the centre will advise you.',
            },
        ],
        sources: [SOURCES.eraktkoshFaq, SOURCES.nbtcGuidelines, SOURCES.whoDonorSelection, SOURCES.whoFactSheet],
    },
    {
        _id: 'blood-group-compatibility-chart',
        slug: 'blood-group-compatibility-chart',
        title: 'Blood group compatibility chart',
        description:
            'Blood group compatibility chart for red cell transfusion: which blood groups each patient can receive from, explained simply, based on WHO guidance.',
        category: 'Blood Donation',
        readTime: '4 min read',
        date: '2026-11-19',
        author: AUTHOR,
        mediaType: 'image',
        tags: ['Blood groups', 'Compatibility', 'Transfusion'],
        draft: true,
        reviewPending: true,
        keyTakeaways: [
            'Blood groups are A, B, AB and O, each either RhD positive (+) or negative (−).',
            'O− red cells can be given to patients of any blood group; AB+ patients can receive red cells from any group.',
            'RhD-negative patients should receive RhD-negative red cells.',
            'The hospital always cross-matches blood before a transfusion.',
        ],
        sections: [
            {
                heading: 'How blood groups work',
                paragraphs: [
                    'Your blood group depends on markers (antigens) on your red cells. The ABO system gives the groups A, B, AB and O, and the RhD system makes each group positive (+) or negative (−). A patient’s plasma contains antibodies against the ABO markers they do not have, which is why red cells must be matched.',
                ],
            },
            {
                heading: 'Red cell compatibility chart',
                paragraphs: ['Which donor blood groups a patient can usually receive red cells from:'],
                bulletPoints: RED_CELL_COMPATIBILITY.map((r) => `Patient ${r.recipient}: can receive ${r.canReceiveFrom.join(', ')}`),
                callout: 'This chart is for red cells. Plasma and platelet compatibility follow different rules; the hospital decides what to transfuse.',
            },
            {
                heading: 'Why the hospital still cross-matches',
                paragraphs: [
                    'A chart shows which groups are usually compatible, but the hospital always tests the patient’s blood against the donor’s before transfusion (a cross-match). This is the final safety check and can catch problems a chart cannot.',
                ],
            },
            {
                heading: 'How Pillora matches donors',
                paragraphs: [
                    'When you request blood on Pillora, we look for registered donors with the same blood group in your city and area who have not donated in the last 90 days. The hospital decides whether blood from a compatible group can also be used.',
                ],
                callout:
                    'In an emergency, also contact the nearest hospital or licensed blood bank, or call 108. Pillora is not a blood bank.',
            },
        ],
        faqs: [
            {
                question: 'Which blood group is the universal donor?',
                answer: 'For red cells, O negative (O−) can be given to patients of any blood group. The hospital still cross-matches before transfusion.',
            },
            {
                question: 'Which blood group can receive from all groups?',
                answer: 'For red cells, AB positive (AB+) patients can receive from any ABO and RhD group.',
            },
            {
                question: 'Can an RhD-positive patient receive RhD-negative blood?',
                answer: 'Yes. RhD-positive patients can receive red cells from RhD-positive or RhD-negative donors of a compatible ABO group. RhD-negative patients should receive RhD-negative red cells.',
            },
        ],
        sources: [SOURCES.whoSerology, SOURCES.whoDonorSelection, SOURCES.nbtcGuidelines],
    },
];
