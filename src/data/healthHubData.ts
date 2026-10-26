export interface AuthorInfo {
    name: string;
    role: string;
    avatar?: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface ArticleSection {
    heading: string;
    paragraphs: string[];
    bulletPoints?: string[];
    callout?: string;
}

export interface HealthArticle {
    _id: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    readTime: string;
    date: string;
    author: AuthorInfo;
    mediaType: 'image' | 'video' | 'url';
    imageUrl?: string;
    videoUrl?: string;
    linkUrl?: string;
    tags: string[];
    featured?: boolean;
    keyTakeaways: string[];
    sections: ArticleSection[];
    faqs?: FAQItem[];
    aliases?: string[];
}

export const HEALTH_CATEGORIES = [
    'All',
    'Heart Health',
    'Nutrition & Diet',
    'Mental Health',
    'Diagnostics & Labs',
    'Diabetes & Chronic',
    'Preventive Wellness',
    'Emergency & First Aid',
    'Sleep & Recovery'
] as const;

export const HEALTH_HUB_ARTICLES: HealthArticle[] = [
    {
        _id: 'hydration-science-metabolism',
        slug: 'hydration-science-metabolism',
        aliases: ['tip1', 'default-hydration'],
        title: 'Hydration is Key: The Science of Morning Water & Daily Metabolism',
        category: 'Preventive Wellness',
        readTime: '4 min read',
        date: '2026-03-24',
        author: {
            name: 'Dr. Ananya Sharma',
            role: 'Preventive Medicine Specialist',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
        },
        mediaType: 'image',
        imageUrl: '/tip1.png',
        tags: ['Hydration', 'Metabolism', 'Detox', 'Wellness', 'Daily Habits'],
        featured: true,
        description: 'Starting your day with clean warm water activates your internal organs, kickstarts cellular metabolism, and aids kidney filtration after hours of sleep.',
        keyTakeaways: [
            'Drink 400-500ml of room-temperature or lukewarm water within 15 minutes of waking up.',
            'Overnight respiratory and perspiration losses leave the blood mildly hypertonic; rehydrating lowers blood viscosity.',
            'Aim for 30-35ml of fluid intake per kilogram of healthy body weight throughout the day.',
            'Adding a slice of lemon or a pinch of pink salt provides gentle bioavailable electrolytes without sugar.'
        ],
        sections: [
            {
                heading: 'Why Morning Rehydration Outperforms Any Caffeine Boost',
                paragraphs: [
                    'During a typical 7-8 hour sleep cycle, the human body expels between 300 to 700 milliliters of water vapor through respiration and perspiration. By the time you open your eyes, your circulating blood plasma is mildly concentrated, causing transient morning sluggishness often mistaken for fatigue.',
                    'Drinking 400 to 500 ml of lukewarm water stimulates the vagus nerve and activates gastric stretching receptors, initiating peristalsis and flushing metabolic byproducts processed overnight by your kidneys and liver.'
                ],
                callout: 'Clinical Pro-Tip: Avoid ice-cold water immediately upon waking. Lukewarm water reduces gastrointestinal thermal shock and is absorbed across mucosal membranes up to 20% faster.'
            },
            {
                heading: 'The 24-Hour Hydration Schedule for Peak Energy',
                paragraphs: [
                    'Hydration is not about chugging large volumes when thirsty; thirst is a delayed signal that indicates you are already 1-2% dehydrated. Implementing a structured rhythm keeps cellular hydration steady:'
                ],
                bulletPoints: [
                    '7:00 AM: 450ml lukewarm water with an optional lemon squeeze to awaken metabolic enzymes.',
                    '11:00 AM: 250ml water or coconut water to prevent mid-morning cognitive slump.',
                    '1:00 PM (30 min before lunch): 200ml to prepare digestive enzymes without diluting stomach acid.',
                    '4:30 PM: 300ml herbal infusion (chamomile, tulsi, or peppermint) to stabilize afternoon energy.',
                    '8:30 PM: 150ml room-temperature water to support overnight cardiovascular flow without disrupting sleep.'
                ]
            },
            {
                heading: 'Signs Your Body is Craving More Fluids',
                paragraphs: [
                    'Beyond dark urine, subtle dehydration symptoms include dry mouth, afternoon tension headaches, brain fog, sudden sugar cravings, and reduced skin elasticity. Maintaining consistent hydration also cushions joint cartilage and lubricates spinal discs.'
                ]
            }
        ],
        faqs: [
            {
                question: 'Can I substitute tea or coffee for my morning water?',
                answer: 'While tea and coffee count toward total fluid intake, their mild diuretic effect and acidity make pure water far superior for the initial morning rehydration window.'
            },
            {
                question: 'How do I know if I am overhydrating?',
                answer: 'Completely clear urine accompanied by frequent urination (more than 8-10 times a day) may indicate hyponatremia. Aim for a pale straw color.'
            }
        ]
    },
    {
        _id: 'eat-the-rainbow-antioxidants',
        slug: 'eat-the-rainbow-antioxidants',
        aliases: ['tip2', 'default-rainbow'],
        title: 'Eat the Rainbow: Maximizing Micronutrients & Cellular Longevity',
        category: 'Nutrition & Diet',
        readTime: '5 min read',
        date: '2026-03-23',
        author: {
            name: 'Rhea Sen, RD',
            role: 'Clinical Nutritionist & Dietitian',
            avatar: 'https://images.unsplash.com/photo-1594824813583-0504d60920a0?w=150&auto=format&fit=crop&q=80'
        },
        mediaType: 'image',
        imageUrl: '/tip2.png',
        tags: ['Nutrition', 'Antioxidants', 'Diet', 'Vitamins', 'Longevity'],
        featured: false,
        description: 'Incorporate deeply pigmented fruits and vegetables into your meals to shield cells against oxidative stress, chronic inflammation, and premature aging.',
        keyTakeaways: [
            'Each vibrant plant pigment represents a distinct biochemical class of antioxidants and polyphenols.',
            'Red foods (tomatoes, pomegranates) deliver lycopene for heart and prostate wellness.',
            'Deep greens provide folate, lutein, and chlorophyll that aid phase II liver detoxification.',
            'Aim for at least three distinct natural colors on your plate at both lunch and dinner.'
        ],
        sections: [
            {
                heading: 'The Biochemical Power Behind Plant Colors',
                paragraphs: [
                    'Phytochemicals are secondary plant metabolites evolved to shield plants from ultraviolet radiation and pests. When humans consume them, these compounds modulate genetic pathways involved in cellular longevity, mitochondrial efficiency, and DNA repair.',
                    'Relying solely on one or two staple vegetables leaves critical biological pathways undernourished. A diverse color spectrum acts like a broad-spectrum shield for cellular health.'
                ]
            },
            {
                heading: 'The 5-Color Dietary Matrix',
                paragraphs: [
                    'Here is how each color group benefits your organ systems:'
                ],
                bulletPoints: [
                    'Red (Lycopene, Anthocyanins): Watermelon, tomatoes, beets, red bell peppers — supports endothelial nitric oxide production and cardiovascular elasticity.',
                    'Orange & Yellow (Beta-Carotene, Hesperidin, Vitamin C): Carrots, sweet potatoes, papaya, oranges — strengthens epithelial barrier integrity and protects macular pigment.',
                    'Green (Lutein, Chlorophyll, Sulforaphane): Spinach, broccoli, moringa, methi — activates the Nrf2 antioxidant response pathway and aids cellular detox.',
                    'Blue & Purple (Resveratrol, Anthocyanins): Jamun, blueberries, purple cabbage, eggplant — crosses the blood-brain barrier to reduce neuroinflammation.',
                    'White & Brown (Allicin, Quercetin): Garlic, onions, mushrooms, ginger — exhibits natural anti-microbial properties and enhances immune macrophage function.'
                ],
                callout: 'Culinary Tip: Fat-soluble carotenoids (lycopene, beta-carotene) require healthy dietary fats (cold-pressed olive oil, mustard oil, or avocado) for up to 300% greater intestinal absorption.'
            }
        ],
        faqs: [
            {
                question: 'Can synthetic multivitamin tablets replace colorful vegetables?',
                answer: 'No. Whole plants offer a synergistic matrix of dietary fiber, trace minerals, and hundreds of micronutrients that cannot be replicated in isolated tablet form.'
            }
        ]
    },
    {
        _id: 'essential-tips-healthy-heart',
        slug: 'essential-tips-healthy-heart',
        aliases: ['default-1'],
        title: '10 Evidence-Based Habits for a Resilient & Healthy Heart',
        category: 'Heart Health',
        readTime: '6 min read',
        date: '2026-03-22',
        author: {
            name: 'Dr. Arvind Mehta',
            role: 'Senior Consultant Cardiologist',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
        },
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200&auto=format&fit=crop&q=80',
        tags: ['Heart', 'Cardio', 'Blood Pressure', 'Cholesterol', 'Longevity'],
        featured: true,
        description: 'Cardiovascular wellness is built on consistent daily rituals. Discover 10 clinically validated lifestyle changes that preserve endothelial elasticity and normalize blood pressure.',
        keyTakeaways: [
            'Engage in 150 minutes of weekly moderate aerobic exercise (Zone-2) to improve stroke volume and lower resting heart rate.',
            'Restrict dietary sodium below 2,000 mg/day while boosting dietary potassium through bananas, spinach, and lentils.',
            'Monitor both ApoB and non-HDL cholesterol alongside standard lipid panels for accurate cardiovascular risk assessment.',
            'Prioritize 7-8 hours of uninterrupted sleep to permit nocturnal blood pressure dipping.'
        ],
        sections: [
            {
                heading: 'Understanding Cardiovascular Prevention',
                paragraphs: [
                    'Atherosclerosis and coronary artery disease do not develop overnight; they are the cumulative result of decades of low-grade endothelial irritation, oxidative stress, and lipid peroxidation. Modern cardiology emphasizes proactive primordial prevention rather than reactive post-event management.',
                    'Simple daily adjustments can drastically reduce arterial stiffness and prevent microvascular damage across vital organs.'
                ]
            },
            {
                heading: 'Top 10 Daily Heart Health Protocols',
                paragraphs: [
                    'Adopt these evidence-backed protocols into your routine:'
                ],
                bulletPoints: [
                    '1. Zone-2 Brisk Walking: 30 minutes daily at a pace where you can talk but not sing keeps mitochondria efficient.',
                    '2. Optimize Sodium-to-Potassium Ratio: Cook at home with fresh herbs rather than processed convenience foods.',
                    '3. Include Omega-3 Rich Sources: Walnuts, chia seeds, flaxseed, and fatty fish dampen arterial inflammation.',
                    '4. Monitor Resting Heart Rate: An optimal adult resting pulse ranges between 55 and 72 beats per minute.',
                    '5. Limit Ultra-Processed Trans Fats: Avoid hydrogenated oils and repeatedly reheated frying oils.',
                    '6. Manage Chronic Cortisol: Chronic stress constricts coronary microvasculature; practice deep box breathing daily.',
                    '7. Screen for Sleep Apnea: Loud snoring and morning headaches can trigger dangerous hypertensive surges.',
                    '8. Maintain Dental Hygiene: Periodontal gum bacteria can enter bloodstream and correlate with cardiac plaque instability.',
                    '9. Avoid Active & Passive Tobacco Smoke: Nicotine causes immediate vasoconstriction and arterial wall stiffness.',
                    '10. Regular Blood Work Checks: Know your numbers — Blood Pressure (< 120/80), Fasting Glucose (< 100 mg/dL), and HbA1c (< 5.7%).'
                ],
                callout: 'Emergency Reminder: If you or someone nearby experiences sudden crushing chest pain, radiating discomfort to left arm or jaw, and shortness of breath, call emergency services immediately.'
            }
        ],
        faqs: [
            {
                question: 'At what age should I start having regular lipid profile checks?',
                answer: 'Most clinical guidelines recommend initial screening at age 20, and annually after age 30, especially if there is a family history of premature heart disease.'
            }
        ]
    },
    {
        _id: 'understanding-blood-test-results',
        slug: 'understanding-blood-test-results',
        aliases: ['default-2'],
        title: 'Demystifying Your Blood Test: A Patient Guide to CBC, Lipids & HbA1c',
        category: 'Diagnostics & Labs',
        readTime: '7 min read',
        date: '2026-03-20',
        author: {
            name: 'Dr. Priya Nair, MD',
            role: 'Pathologist & Diagnostic Consultant',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
        },
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&auto=format&fit=crop&q=80',
        tags: ['Blood Test', 'CBC', 'Cholesterol', 'HbA1c', 'Diagnostics'],
        featured: false,
        description: 'Stop feeling overwhelmed by confusing lab ranges. Learn how to interpret Hemoglobin, WBC differentials, Lipid ratios, and Liver enzymes with clarity.',
        keyTakeaways: [
            'Hemoglobin below 12 g/dL in women or 13.5 g/dL in men indicates anemia requiring ferritin evaluation.',
            'Triglycerides-to-HDL ratio below 2.0 is an excellent surrogate marker for metabolic and insulin health.',
            'HbA1c reflects average blood sugar over the preceding 90 days: Normal is under 5.7%, Prediabetes is 5.7%-6.4%.',
            'Always consult your ordering physician before adjusting any medications based on lab reports.'
        ],
        sections: [
            {
                heading: '1. The Complete Blood Count (CBC) Breakdown',
                paragraphs: [
                    'The CBC is the most frequently prescribed screening blood test. It provides a snapshot of your oxygen transport system, immune response army, and blood clotting competence.'
                ],
                bulletPoints: [
                    'Hemoglobin (Hb): Normal range 12.0 - 17.5 g/dL. Low values signify anemia; elevated values may suggest chronic hypoxia, dehydration, or polycythemia.',
                    'White Blood Cells (WBC): Normal range 4,000 - 11,000 /µL. Elevated neutrophils suggest bacterial infection; elevated lymphocytes point to viral defense.',
                    'Platelets: Normal range 150,000 - 450,000 /µL. Critical for clotting; lower counts can increase bleeding tendencies.'
                ]
            },
            {
                heading: '2. The Lipid Profile: Beyond Total Cholesterol',
                paragraphs: [
                    'Standard lipid profiles report Total Cholesterol, HDL (protective cholesterol), LDL (atherogenic cholesterol), and Triglycerides (circulating fat particles). Modern preventive diagnostics place major emphasis on the Triglyceride-to-HDL ratio:'
                ],
                bulletPoints: [
                    'Ideal Triglyceride level: Under 150 mg/dL (optimally under 100 mg/dL).',
                    'Optimal HDL level: Above 50 mg/dL for men, above 60 mg/dL for women.',
                    'Target LDL level: Below 100 mg/dL for healthy individuals, and below 70 mg/dL for patients with established cardiovascular disease.'
                ],
                callout: 'Diagnostic Note: Fasting for 10-12 hours prior to lipid panel drawing is essential for accurate triglyceride measurement.'
            }
        ],
        faqs: [
            {
                question: 'Can drinking water break my fasting blood test?',
                answer: 'Plain water is completely allowed and recommended before fasting blood tests because it keeps veins pliant and prevents hemoconcentration.'
            }
        ]
    },
    {
        _id: 'mental-wellness-modern-age',
        slug: 'mental-wellness-modern-age',
        aliases: ['default-3'],
        title: 'Mental Wellness & Cognitive Grounding in the High-Paced Digital Era',
        category: 'Mental Health',
        readTime: '5 min read',
        date: '2026-03-18',
        author: {
            name: 'Dr. K. S. Ramanujam',
            role: 'Neuropsychiatrist & Behavioral Specialist',
            avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
        },
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80',
        tags: ['Mental Health', 'Anxiety', 'Stress', 'Mindfulness', 'Neuroscience'],
        featured: false,
        description: 'Practical neuro-grounding protocols, digital boundary techniques, and sleep hygiene practices to counter burnout and chronic sympathetic overload.',
        keyTakeaways: [
            'Chronic notifications keep the sympathetic nervous system in persistent fight-or-flight mode.',
            'The physiological sigh (two quick nasal inhales followed by an extended sigh exhale) rapidly reduces heart rate in 60 seconds.',
            'Establish a 60-minute no-screen boundary before bed to facilitate melatonin secretion.',
            'Regular social connection and time outdoors physically lower amygdala hyperactivity.'
        ],
        sections: [
            {
                heading: 'The Biology of Modern Chronic Burnout',
                paragraphs: [
                    'Our biological stress response evolved to survive acute, transient physical predators. In the modern hyper-connected era, the nervous system interprets relentless emails, news alerts, and social comparison as persistent low-grade stressors, flooding the circulation with adrenaline and cortisol.',
                    'Over time, unmanaged sympathetic overdrive causes memory fog, unrefreshing sleep, digestive irregularities, and immune suppression.'
                ]
            },
            {
                heading: '3 Evidence-Backed Vagal Grounding Exercises',
                paragraphs: [
                    'When anxiety or cognitive overwhelm strikes, apply these somatic reset techniques:'
                ],
                bulletPoints: [
                    'The Double Inhale Sigh: Take a deep breath through the nose, top it off with a second sharp inhale, then sigh deeply through mouth. Repeat 3 times to reopen collapsed alveoli and trigger parasympathetic activation.',
                    '5-4-3-2-1 Sensory Reset: Acknowledge 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste to snap out of ruminative loops.',
                    'Cold Water Face Splash: Immersion of the forehead and eyes in cool water stimulates the mammalian dive reflex, instantly lowering heart rate.'
                ],
                callout: 'Healthcare Reminder: If overwhelming anxiety, panic attacks, or prolonged low mood interferes with your daily responsibilities, reach out to a licensed psychologist or psychiatrist. Asking for support is a sign of strength.'
            }
        ],
        faqs: [
            {
                question: 'How long does it take for meditation to produce measurable brain changes?',
                answer: 'Neuroimaging studies from Harvard demonstrate measurable increases in prefrontal cortex gray matter and reductions in amygdala size in as little as 8 weeks of 15-minute daily practice.'
            }
        ]
    },
    {
        _id: 'managing-type-2-diabetes-guide',
        slug: 'managing-type-2-diabetes-guide',
        title: 'Managing Type 2 Diabetes: Meal Sequencing, Glycemic Index & Glucose Control',
        category: 'Diabetes & Chronic',
        readTime: '6 min read',
        date: '2026-03-15',
        author: {
            name: 'Dr. Vikram Sethi',
            role: 'Endocrinologist & Diabetologist',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
        },
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
        tags: ['Diabetes', 'Blood Sugar', 'Insulin', 'Diet', 'Endocrinology'],
        featured: false,
        description: 'Learn how food sequencing, continuous glucose monitoring, and post-meal light walking can naturally blunt blood sugar spikes by up to 40%.',
        keyTakeaways: [
            'Eat foods in the correct order: Veggies/Fiber first, Protein and Healthy Fats second, Carbohydrates last.',
            'A 10-15 minute casual walk immediately after meals prompts skeletal muscles to uptake glucose without insulin.',
            'Pair carbohydrates with vinegar or fermented food to slow gastric emptying.',
            'Inspect feet daily for micro-cuts or pressure spots to prevent diabetic neuropathy complications.'
        ],
        sections: [
            {
                heading: 'The Power of Food Sequencing',
                paragraphs: [
                    'Clinical trials published in diabetes care journals demonstrate that consuming fiber and protein before simple carbohydrates creates a protective gel matrix along the small intestine wall.',
                    'This simple habit delays carbohydrate breakdown and glucose absorption, flattening postprandial glucose peaks by up to 40% and keeping energy levels steady throughout the afternoon.'
                ]
            },
            {
                heading: 'Crucial Lifestyle Pillars for Glycemic Stability',
                paragraphs: [
                    'Integrate these daily habits to protect your pancreas and insulin sensitivity:'
                ],
                bulletPoints: [
                    'Post-Meal Movement: Skeletal muscle contractions activate GLUT-4 transporters, drawing glucose out of circulation without demanding excess insulin.',
                    'Resistance Training: Muscle is your primary metabolic sink for glucose; 2 sessions of strength training weekly improves insulin sensitivity for up to 48 hours.',
                    'Manage Sleep Fragmentation: Even two nights of restricted sleep can increase morning insulin resistance by up to 25%.'
                ]
            }
        ],
        faqs: [
            {
                question: 'Can I reverse early prediabetes through lifestyle changes?',
                answer: 'Yes. With disciplined nutritional adjustments, fat mass reduction, and regular physical activity, prediabetes is highly reversible, returning HbA1c to normal baseline levels.'
            }
        ]
    },
    {
        _id: 'boosting-immunity-fact-vs-fiction',
        slug: 'boosting-immunity-fact-vs-fiction',
        title: 'Immunity Building: What Science Actually Says vs. Modern Myths',
        category: 'Preventive Wellness',
        readTime: '5 min read',
        date: '2026-03-12',
        author: {
            name: 'Dr. Sneha Roy',
            role: 'Immunologist & Public Health Researcher',
            avatar: 'https://images.unsplash.com/photo-1594824813583-0504d60920a0?w=150&auto=format&fit=crop&q=80'
        },
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=1200&auto=format&fit=crop&q=80',
        tags: ['Immunity', 'Vitamins', 'Gut Health', 'Vaccines', 'Wellness'],
        featured: false,
        description: 'Separating clinically validated immunonutrition from quick-fix marketing fads: The critical roles of Vitamin D3, Zinc, gut microbiota, and restorative sleep.',
        keyTakeaways: [
            'Over 70% of the body’s active immune cells reside in the gut-associated lymphoid tissue (GALT).',
            'Vitamin D3 acts as a key gene transcription regulator for natural killer (NK) cells and macrophage defense.',
            'Chronic sleep deprivation suppresses production of cytokines and antigen-specific antibodies.',
            'Immune systems cannot be "boosted" into overdrive; optimal immunity is balanced, discerning, and resilient.'
        ],
        sections: [
            {
                heading: 'The Fallacy of "Boosting" Immunity',
                paragraphs: [
                    'The term "immune booster" is a marketing concept rather than a medical reality. An immune system operating in hyper-drive results in allergies, autoimmune conditions, and systemic inflammation.',
                    'Medical science focuses on immune modulation and competence — equipping leukocytes and antibodies with the essential micronutrients and rest required to respond swiftly to pathogens and stand down when the threat is neutralized.'
                ]
            },
            {
                heading: 'Clinically Proven Pillars of Immune Competence',
                paragraphs: [
                    'Here is what peer-reviewed immunological research actually recommends:'
                ],
                bulletPoints: [
                    'Vitamin D3 & K2: Serum levels of 40-60 ng/mL correlate with significantly reduced incidence of upper respiratory tract infections.',
                    'Zinc & Bioflavonoids: Zinc halts viral replication within infected mucosal cells; pair with citrus, bell peppers, or pumpkin seeds.',
                    'Microbiome Diversity: Consume prebiotic fibers (garlic, oats, onions) and fermented foods (curd, kefir) to reinforce the gut barrier.',
                    'Restorative Sleep: During slow-wave sleep, memory T-cells consolidate immunological memory against previously encountered microbes.'
                ]
            }
        ],
        faqs: [
            {
                question: 'Do mega-doses of Vitamin C prevent the common cold?',
                answer: 'Studies show mega-doses cannot prevent colds in non-athletes, though regular adequate intake slightly shortens cold duration by about 8-14%.'
            }
        ]
    },
    {
        _id: 'essential-first-aid-family-guide',
        slug: 'essential-first-aid-family-guide',
        title: 'Family Emergency Readiness: Critical First Aid Protocols Every Home Needs',
        category: 'Emergency & First Aid',
        readTime: '6 min read',
        date: '2026-03-10',
        author: {
            name: 'Dr. Rajesh K. Varma',
            role: 'Chief of Emergency Medicine',
            avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
        },
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
        tags: ['First Aid', 'Emergency', 'Stroke', 'CPR', 'Choking'],
        featured: false,
        description: 'From recognizing the "FAST" signs of stroke to the Heimlich maneuver for choking and burn management, master the critical actions that save lives in the golden hour.',
        keyTakeaways: [
            'Remember the FAST acronym for Stroke: Face drooping, Arm weakness, Speech difficulty, Time to call emergency.',
            'For burns: Cool immediately under running tap water for 15-20 minutes. Never apply ice, butter, or toothpaste.',
            'For severe bleeding: Apply direct, uninterrupted firm pressure with a clean cloth. Do not remove the first cloth if soaked — add more on top.',
            'Keep emergency numbers, nearby hospital contacts, and your blood type handy in your phone and home first aid kit.'
        ],
        sections: [
            {
                heading: '1. Recognizing a Stroke: Time is Brain',
                paragraphs: [
                    'During an ischemic stroke, roughly 1.9 million brain neurons die every minute that treatment is delayed. Immediate recognition using the FAST protocol allows emergency teams to administer clot-busting therapies within the 4.5-hour golden window:'
                ],
                bulletPoints: [
                    'F - Face: Ask the person to smile. Does one side of the face droop?',
                    'A - Arms: Ask them to raise both arms. Does one arm drift downward?',
                    'S - Speech: Ask them to repeat a simple sentence. Is their speech slurred or strange?',
                    'T - Time: If you observe any of these signs, call an ambulance immediately. Note the exact time symptoms started.'
                ]
            },
            {
                heading: '2. Immediate Actions for Household Emergencies',
                paragraphs: [
                    'Keep these high-priority protocols in mind for day-to-day emergencies:'
                ],
                bulletPoints: [
                    'Choking in Adults: Stand behind them, place a fist just above their navel, grasp with other hand, and deliver quick inward and upward abdominal thrusts.',
                    'Heat Exhaustion: Move to shade or AC, loosen tight clothing, sip cool salted water, and apply damp cloths to neck and underarms.',
                    'Nosebleeds: Lean forward slightly (never tilt head backward), pinch soft part of nose firmly for 10 full minutes without releasing.'
                ],
                callout: 'Pillora Emergency Network: You can quickly find nearby verified emergency blood donors, verified blood banks, and hospital facilities across the Pillora platform 24/7.'
            }
        ],
        faqs: [
            {
                question: 'Why should I never put ice directly on a burn?',
                answer: 'Ice causes severe vasoconstriction, which impairs microcirculation and can paradoxically induce secondary frostbite tissue damage on already burned skin.'
            }
        ]
    },
    {
        _id: 'power-of-quality-sleep',
        slug: 'power-of-quality-sleep',
        title: 'The Restorative Power of Sleep: Brain Detoxification & Hormonal Reset',
        category: 'Sleep & Recovery',
        readTime: '5 min read',
        date: '2026-03-08',
        author: {
            name: 'Dr. K. S. Ramanujam',
            role: 'Neuropsychiatrist & Sleep Medicine Consultant',
            avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
        },
        mediaType: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=1200&auto=format&fit=crop&q=80',
        tags: ['Sleep', 'Circadian', 'Brain Health', 'Melatonin', 'Recovery'],
        featured: false,
        description: 'Discover how deep slow-wave sleep activates the glymphatic system to clear amyloid beta, regulates appetite hormones, and accelerates muscle recovery.',
        keyTakeaways: [
            'The glymphatic system opens during deep non-REM sleep to pump cerebrospinal fluid and clear neurotoxic waste products.',
            'Sleep deprivation elevates Ghrelin (hunger hormone) while suppressing Leptin (satiety hormone), driving unhealthy cravings.',
            'Keep bedroom temperature between 18°C and 21°C to facilitate natural nocturnal core body temperature drop.',
            'Avoid caffeine at least 8 to 10 hours before your scheduled sleep time due to its extended metabolic half-life.'
        ],
        sections: [
            {
                heading: 'How the Brain Cleans Itself While You Sleep',
                paragraphs: [
                    'For decades, scientists wondered how the brain eliminates metabolic waste without a conventional lymphatic network. Breakthrough neuro-research identified the "glymphatic system" — an intricate network of glial channels along cerebral blood vessels.',
                    'During deep slow-wave sleep, interstitial space expands by up to 60%, allowing cerebrospinal fluid to rush through brain tissue and flush out metabolic debris, including amyloid-beta and tau proteins associated with neurodegeneration.'
                ]
            },
            {
                heading: '5 Pillars for Sleep Architecture Optimization',
                paragraphs: [
                    'Upgrade your sleep quality with these behavioral interventions:'
                ],
                bulletPoints: [
                    'Morning Sunlight Anchor: View 10-15 minutes of outdoor natural light within an hour of waking to set your central circadian suprachiasmatic nucleus clock.',
                    'Consistent Sleep-Wake Windows: Waking up at the same hour every day anchors circadian rhythms better than going to bed at varied times.',
                    'Cool Ambient Temperature: A bedroom maintained at 18-20°C promotes deep restorative stages.',
                    'Dim Evening Lighting: Swap bright white LED bulbs for warm amber lights after 8:00 PM to protect natural melatonin synthesis.',
                    'Wind-Down Buffer: Dedicate the final 45 minutes of the night to journaling, light stretching, or reading printed books.'
                ]
            }
        ],
        faqs: [
            {
                question: 'Can I "catch up" on lost weekday sleep during the weekend?',
                answer: 'While weekend catch-up sleep provides temporary relief, it does not fully reverse metabolic dysregulation and often induces "social jetlag," disrupting Sunday night sleep quality.'
            }
        ]
    }
];

export function getAllHealthArticles(): HealthArticle[] {
    return HEALTH_HUB_ARTICLES;
}

export function getHealthArticleById(idOrSlug: string): HealthArticle | undefined {
    if (!idOrSlug) return undefined;
    const clean = idOrSlug.toLowerCase().trim();
    return HEALTH_HUB_ARTICLES.find(
        (a) => a._id.toLowerCase() === clean || 
               a.slug.toLowerCase() === clean || 
               a.aliases?.some(alias => alias.toLowerCase() === clean)
    );
}

export function getRelatedHealthArticles(currentId: string, category: string, limit: number = 3): HealthArticle[] {
    return HEALTH_HUB_ARTICLES
        .filter((a) => a._id !== currentId && (category === 'All' || a.category === category))
        .slice(0, limit);
}
