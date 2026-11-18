import BloodBankPage from "./BloodBankClient";
import BloodConnectGuide, { EmergencyNote } from "@/components/blood/BloodConnectGuide";
import { BLOOD_CONNECT_FAQS } from "@/content/bloodConnect";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structuredData";

// Server wrapper: adds the emergency note and the server-rendered Blood Connect
// guide (how it works, eligibility, compatibility, FAQ, sources) around the
// unchanged interactive donor/request page. Metadata lives in layout.tsx.
export default function BloodConnectPage() {
    return (
        <>
            <JsonLd
                data={[
                    faqJsonLd(BLOOD_CONNECT_FAQS),
                    breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blood Connect", path: "/blood-bank" }]),
                ]}
            />
            <EmergencyNote />
            <BloodBankPage />
            <BloodConnectGuide />
        </>
    );
}
