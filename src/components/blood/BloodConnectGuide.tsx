import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import {
    AGE_GUIDANCE,
    BLOOD_CONNECT_FAQS,
    DONOR_STEPS,
    ELIGIBILITY_POINTS,
    EMERGENCY_NOTE,
    RED_CELL_COMPATIBILITY,
    REQUEST_STEPS,
    SOURCES,
} from "@/content/bloodConnect";

/**
 * Server-rendered Blood Connect content (visual style matches the existing
 * red Blood Connect page). All facts come from src/content/bloodConnect.ts.
 * TODO(reviewer): a doctor should review the eligibility and compatibility
 * sections; until then nothing here is presented as reviewed.
 */

/** Short, plain emergency note shown on every Blood Connect page. */
export function EmergencyNote({ className = "" }: { className?: string }) {
    return (
        <div role="note" className={`bg-red-50 border-y border-red-100 ${className}`}>
            <p className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-sm text-red-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
                <span>{EMERGENCY_NOTE}</span>
            </p>
        </div>
    );
}

function Steps({ steps }: { steps: { title: string; text: string }[] }) {
    return (
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s, i) => (
                <li key={s.title} className="bg-white border border-red-100 rounded-2xl p-5">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wide">Step {i + 1}</p>
                    <h4 className="font-bold text-gray-900 mt-1">{s.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{s.text}</p>
                </li>
            ))}
        </ol>
    );
}

export function CompatibilityTable() {
    return (
        <div className="overflow-x-auto rounded-2xl border border-red-100 bg-white">
            <table className="w-full text-sm">
                <caption className="sr-only">Red cell compatibility by patient blood group</caption>
                <thead className="bg-red-50 text-red-900">
                    <tr>
                        <th scope="col" className="text-left px-4 py-3 font-bold">Patient&apos;s blood group</th>
                        <th scope="col" className="text-left px-4 py-3 font-bold">Can usually receive red cells from</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-red-50">
                    {RED_CELL_COMPATIBILITY.map((r) => (
                        <tr key={r.recipient}>
                            <th scope="row" className="text-left px-4 py-3 font-black text-gray-900">{r.recipient}</th>
                            <td className="px-4 py-3 text-gray-700">{r.canReceiveFrom.join(", ")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function SourceList({ sources }: { sources: { title: string; url?: string }[] }) {
    return (
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {sources.map((s) => (
                <li key={s.title}>
                    {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">{s.title}</a>
                    ) : s.title}
                </li>
            ))}
        </ul>
    );
}

export default function BloodConnectGuide() {
    return (
        <section aria-labelledby="blood-guide-heading" className="bg-gradient-to-b from-white to-red-50/40">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-12">
                <header>
                    <h2 id="blood-guide-heading" className="text-2xl md:text-3xl font-black text-gray-900">
                        How Blood Connect works
                    </h2>
                    <p className="text-gray-600 mt-2 max-w-3xl">
                        Pillora connects people who need blood with registered voluntary donors in their city. Pillora is not a blood bank:
                        blood is collected, tested and issued by hospitals and licensed blood banks.
                    </p>
                </header>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Requesting blood</h3>
                    <Steps steps={REQUEST_STEPS} />
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Becoming a donor</h3>
                    <Steps steps={DONOR_STEPS} />
                </div>

                <div id="eligibility" className="space-y-4 scroll-mt-24">
                    <h3 className="text-xl font-bold text-gray-900">Who can donate blood in India</h3>
                    <p className="text-sm text-gray-600">
                        Summary of the official guidance on the government&apos;s eRaktKosh portal. Donor selection in India follows the
                        National Blood Transfusion Council (NBTC) guidelines.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[AGE_GUIDANCE.national, AGE_GUIDANCE.pillora].map((g) => (
                            <div key={g.label} className="bg-white border border-red-100 rounded-2xl p-4">
                                <p className="text-xs font-bold text-red-600 uppercase tracking-wide">Age: {g.label}</p>
                                <p className="text-sm text-gray-700 mt-1">{g.text}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Source:{" "}
                                    {"url" in g.source ? (
                                        <a href={g.source.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">{g.source.title}</a>
                                    ) : g.source.title}
                                </p>
                            </div>
                        ))}
                    </div>
                    <ul className="space-y-2">
                        {ELIGIBILITY_POINTS.map((p) => (
                            <li key={p} className="flex gap-3 text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" aria-hidden="true" />
                                <span>{p}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div id="compatibility" className="space-y-4 scroll-mt-24">
                    <h3 className="text-xl font-bold text-gray-900">Blood group compatibility (red cells)</h3>
                    <CompatibilityTable />
                    <p className="text-sm text-gray-600">
                        Based on WHO guidance on blood group serology. The hospital always cross-matches blood before a transfusion, and
                        plasma and platelets follow different rules. When you request blood on Pillora, we look for donors with the same
                        blood group.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Safety</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" aria-hidden="true" /><span>Donation is voluntary and unpaid. Buying or selling blood is illegal in India; never pay or accept money.</span></li>
                        <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" aria-hidden="true" /><span>When you request blood, donor contact details are shared only after your Aadhaar or PAN check.</span></li>
                        <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" aria-hidden="true" /><span>Donate only at a hospital or licensed blood bank, which checks every donor before donation.</span></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Questions about Blood Connect</h3>
                    <div className="space-y-4">
                        {BLOOD_CONNECT_FAQS.map((f) => (
                            <div key={f.question}>
                                <h4 className="font-bold text-gray-900">{f.question}</h4>
                                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{f.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-base font-bold text-gray-900">Sources</h3>
                    <SourceList sources={[SOURCES.eraktkoshFaq, SOURCES.nbtcGuidelines, SOURCES.whoDonorSelection, SOURCES.whoSerology, SOURCES.eraktkosh]} />
                    <p className="text-sm text-gray-600 pt-2">
                        See also: <Link href="/blood-donors" className="text-blue-700 hover:underline">blood donors by city</Link>.
                    </p>
                </div>
            </div>
        </section>
    );
}
