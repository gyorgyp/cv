// The printable CV as a PDF document (react-pdf). It renders the same data object the web
// CV uses (the `data` returned by useCv), so the PDF always matches what is on screen.
//
// Fonts: the built-in Helvetica covers English text. For Hungarian text with ő / ű (not in the
// built-in encoding) register a TTF that has them, e.g. put /public/fonts/NotoSans-Regular.ttf
// and NotoSans-Bold.ttf in the project and uncomment the Font.register block below, then set
// FONT = "NotoSans" and replace "Helvetica-Bold" / "Helvetica-Oblique" with fontWeight / fontStyle.
import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";

// import { Font } from "@react-pdf/renderer";
// Font.register({
//   family: "NotoSans",
//   fonts: [
//     { src: "/fonts/NotoSans-Regular.ttf" },
//     { src: "/fonts/NotoSans-Bold.ttf", fontWeight: "bold" },
//   ],
// });

const ACCENT = "#1f3a5f";
const TEXT = "#222222";
const MUTED = "#555555";

const s = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 42, paddingHorizontal: 40, fontFamily: "Helvetica", fontSize: 9.5, color: TEXT, lineHeight: 1.35 },
  name: { fontFamily: "Helvetica-Bold", fontSize: 24, lineHeight: 1.2, height: 30, color: ACCENT },
  title: { fontSize: 12, lineHeight: 1.3, color: MUTED, marginTop: 4 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  contactItem: { marginRight: 14, color: ACCENT, textDecoration: "none" },
  section: { marginTop: 14 },
  sectionTitle: { fontFamily: "Helvetica-Bold", fontSize: 11, lineHeight: 1.3, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.8, borderBottomWidth: 1, borderBottomColor: ACCENT, paddingBottom: 2, marginBottom: 6 },
  job: { marginBottom: 9 },
  jobHead: { flexDirection: "row", justifyContent: "space-between" },
  jobRole: { fontFamily: "Helvetica-Bold", fontSize: 10.5 },
  jobCompany: { color: MUTED },
  period: { color: MUTED },
  bulletRow: { flexDirection: "row", marginTop: 2 },
  subBulletRow: { flexDirection: "row", marginTop: 1, marginLeft: 12 },
  bulletMark: { width: 10 },
  subBulletMark: { width: 10, color: MUTED },
  bulletText: { flex: 1 },
  tech: { fontFamily: "Helvetica-Oblique", color: MUTED, marginTop: 3 },
  twoCol: { flexDirection: "row" },
  col: { flex: 1, paddingRight: 10 },
  colTitle: { fontFamily: "Helvetica-Bold", marginBottom: 2 },
  line: { marginTop: 1 },
  eduRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  footer: { position: "absolute", bottom: 20, left: 40, right: 40, fontSize: 8, color: MUTED, textAlign: "right" },
});

// The web data has bullets as plain strings or { text, subBullets }; accept both.
const normBullet = (b) =>
  typeof b === "string" ? { text: b, subBullets: [] } : { text: b.text, subBullets: b.subBullets ?? [] };

const stripProtocol = (url = "") => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

function Section({ title, children }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle} minPresenceAhead={50}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Bullets({ items }) {
  return items.map(normBullet).map((b, i) => (
    <View key={i}>
      <View style={s.bulletRow} wrap={false}>
        <Text style={s.bulletMark}>•</Text>
        <Text style={s.bulletText}>{b.text}</Text>
      </View>
      {b.subBullets.map((sb, j) => (
        <View key={j} style={s.subBulletRow} wrap={false}>
          <Text style={s.subBulletMark}>–</Text>
          <Text style={s.bulletText}>{sb}</Text>
        </View>
      ))}
    </View>
  ));
}

export function CvPdf({ data }) {
  const c = data.contact ?? {};
  const list = (arr = []) => arr.map((x, i) => <Text key={i} style={s.line}>{x}</Text>);

  return (
    <Document title={`${data.name} – CV`} author={data.name} subject={data.title} language="en">
      <Page size="A4" style={s.page}>
        <View>
          <Text style={s.name}>{data.name}</Text>
          <Text style={s.title}>{data.title}</Text>
          <View style={s.contactRow}>
            {c.email && <Link src={`mailto:${c.email}`} style={s.contactItem}>{c.email}</Link>}
            {c.linkedinUrl && <Link src={c.linkedinUrl} style={s.contactItem}>{stripProtocol(c.linkedinUrl)}</Link>}
            {c.githubUrl && <Link src={c.githubUrl} style={s.contactItem}>{stripProtocol(c.githubUrl)}</Link>}
          </View>
        </View>

        <Section title="Profile">
          <Text>{data.profile}</Text>
        </Section>

        <Section title="Experience">
          {data.experience?.map((e, i) => (
            <View key={i} style={s.job}>
              <View style={s.jobHead} wrap={false} minPresenceAhead={40}>
                <Text>
                  <Text style={s.jobRole}>{e.role}</Text>
                  <Text style={s.jobCompany}>  |  {e.company}</Text>
                </Text>
                <Text style={s.period}>{e.period}</Text>
              </View>
              <Bullets items={e.bullets ?? []} />
              {e.tech ? <Text style={s.tech}>Tech: {e.tech}</Text> : null}
            </View>
          ))}
        </Section>

        <Section title="Skills">
          <View style={s.twoCol} wrap={false}>
            <View style={s.col}>
              <Text style={s.colTitle}>Core skills</Text>
              {list(data.coreSkills)}
            </View>
            <View style={s.col}>
              <Text style={s.colTitle}>AI</Text>
              {list(data.ai)}
              <Text style={[s.colTitle, { marginTop: 6 }]}>Currently learning</Text>
              {list(data.currentlyLearning)}
            </View>
            <View style={s.col}>
              <Text style={s.colTitle}>Languages</Text>
              {data.languages?.map((l, i) => (
                <Text key={i} style={s.line}>{l.name} – {l.level}</Text>
              ))}
            </View>
          </View>
        </Section>

        <Section title="Education">
          {data.education?.map((e, i) => (
            <View key={i} style={s.eduRow} wrap={false}>
              <Text style={{ flex: 1 }}>
                <Text style={s.jobRole}>{e.school}</Text>
                {e.degree ? `  –  ${e.degree}` : ""}
              </Text>
              <Text style={s.period}>{e.period}</Text>
            </View>
          ))}
        </Section>

        {(data.certifications?.length > 0 || data.training?.length > 0) && (
          <Section title="Certifications & training">
            {[...(data.certifications ?? []), ...(data.training ?? [])].map((x, i) => (
              <View key={i} style={s.eduRow} wrap={false}>
                <Text style={{ flex: 1 }}>{x.name}</Text>
                <Text style={s.period}>{x.year}</Text>
              </View>
            ))}
          </Section>
        )}

        <Text
          style={s.footer}
          fixed
          render={({ pageNumber, totalPages }) => (totalPages > 1 ? `${pageNumber} / ${totalPages}` : "")}
        />
      </Page>
    </Document>
  );
}
