import type { Locale } from "@/utils/locale";
import { blocks, link, list } from "@/utils/markdown";

// The home page's words, in both languages: page.tsx sets them on the page,
// markdown() below writes the same words for agents (utils/markdown.ts).
// Every sentence is a draft until the founders sign it off; the app is
// addressed with "Du", as inside the app.
export const T = {
  de: {
    lede: "Behält Wissen\nwenn Leute\ngehen.",
    ledeEm: 6.5,
    deck: "Frag Raban, und du bekommst die Antwort aus euren Unterlagen, mit Fundstelle. Steht sie nirgends, fragt Raban den Menschen, der es weiß.",
    why: {
      label: "Warum Raban",
      display: "Das Wichtigste steht in keinem Ordner.",
      sub: "Es steckt in den Köpfen weniger Menschen. Gehen sie in Rente oder wechseln sie, geht es mit. Raban hält es fest: aus den Unterlagen, wo es steht, und von den Menschen, wo es fehlt.",
      principles: [
        ["Mit Fundstelle", "Jede Antwort zeigt, woher sie kommt: Dokument und Stelle, oder die Person."],
        ["Kein Raten", "Weiß Raban etwas nicht, sagt Raban das offen und fragt nach."],
        ["Mit Namen", "Für jede Antwort steht ein Mensch ein, mit Namen und Datum."],
      ],
    },
    how: "So arbeitet Raban",
    rows: [
      {
        tag: "01 Aufzeichnen",
        panel: "Aufzeichnen per Sprache",
        scene: "record",
        alt: "Raban hört zu, wie jemand erklärt, was zu tun ist, wenn der Druck links schmiert, fragt nach und hält die Schritte in vier Phasen fest.",
        title: "Erzähl es einmal. Raban schreibt mit.",
        body: "Erklär eine Aufgabe, wie du sie einem Azubi erklären würdest. Raban hört zu, fragt nach, wo etwas fehlt, und hält die Schritte fest, während du sprichst.",
        points: [
          "Sprechen oder tippen, wie es gerade passt",
          "Raban fragt nach, bis es verstanden hat",
          "Du siehst sofort, was angekommen ist",
        ],
      },
      {
        tag: "02 Fragen",
        panel: "Plan mit Quellen",
        scene: "plan",
        alt: "Jemand fragt, was zu tun ist, wenn Schachteln an der Klebelasche aufgehen, und Raban antwortet mit einem Plan in fünf Schritten, jeder mit seiner Quelle.",
        title: "Frag, wie es geht, und Raban zeigt dir den Plan.",
        body: "Stell deine Frage in eigenen Worten. Raban antwortet in Schritten, zusammengesetzt aus Arbeitsanweisung, Bedienungsanleitung und dem, was Kollegen erzählt haben.",
        points: [
          "Schritt für Schritt statt langer Texte",
          "Jeder Schritt zeigt, woher er kommt",
          "Am Rechner und am Handy",
        ],
      },
      {
        tag: "03 Nachfragen",
        panel: "Bitte an eine Person",
        scene: "ask",
        alt: "Raban findet zu einer Frage nichts in den Unterlagen, schlägt vor, die Kollegin zu fragen, die die Zahl eingetragen hat, und schickt ihr die Bitte.",
        title: "Steht es nirgends, fragt Raban den Menschen, der es weiß.",
        body: "Raban rät nicht. Raban sagt offen, dass die Antwort fehlt, und schlägt vor, wen es fragen soll. Ein Tipp von dir, und die Bitte geht raus. Die Person antwortet einmal, und ab da gilt ihre Antwort für alle, mit Namen und Datum.",
        points: [
          "Raban schlägt die zuständige Person vor, du kannst sie ändern",
          "Jede Antwort zeigt, wer sie bestätigt hat und wann",
          "Stimmt etwas nicht mehr, korrigierst du es mit einem Tipp",
        ],
      },
      {
        tag: "04 Erledigen",
        panel: "Raban füllt den Bericht",
        scene: "task",
        alt: "Links eine festgehaltene Aufgabe in fünf Schritten, rechts füllt Raban beim vierten Schritt den Reklamationsbericht aus, mit Quelle je Feld.",
        title: "Was Raban selbst kann, erledigt Raban.",
        body: "Steht in einem Ablauf ein Bericht oder Formular an, füllt Raban es aus: aus euren Unterlagen und Protokollen, mit Quelle je Feld. Was Raban nicht weiß, geht an die richtige Person. Bevor etwas rausgeht, prüfst du.",
        points: [
          "Formulare und Berichte vorausgefüllt",
          "Quelle zu jedem Feld",
          "Nach außen gibt ein Mensch frei",
        ],
      },
      {
        tag: "05 Anschließen",
        panel: "Eingaben einer Aufgabe",
        scene: "inputs",
        alt: "Die Eingaben der Aufgabe „Reklamation: Schachteln gehen auf“: drei gewählte Systeme, vier hochgeladene Dateien und drei Beiträge von Kollegen.",
        title: "Du siehst, woraus Raban schöpft.",
        body: "Eure Systeme schließt ihr einmal für die ganze Firma an. Für jede Aufgabe wählst du, woraus Raban liest: aus Systemen wie dem ERP, aus Dateien, die ihr hochgeladen habt, und aus dem, was Kollegen erzählt haben. So siehst du immer, was in eine Antwort einfließt.",
        points: [
          "Systeme einmal anschließen, je Aufgabe auswählen",
          "Dateien einfach hochladen",
          "Zum Start genügt ein Ordner",
        ],
      },
    ],
    pricing: {
      label: "Preise",
      title: "Preise",
      stats: [
        ["1.000–9.000 €", "Einrichtung, einmalig, je nach Standort"],
        ["250 €", "Grundgebühr im Monat, für Wartung und Updates"],
        ["~25 €", "je Mitarbeiter und Monat, deckt die KI-Kosten"],
      ],
      note: "Euer Wissen gehört euch. Ihr bekommt eure Daten jederzeit als ZIP.",
      cta: "Pilot anfragen",
    },
    faq: {
      title: "Häufige Fragen",
      items: [
        {
          q: "Müssen wir Raban an unsere Systeme anschließen?",
          a: "Nein. Zum Start genügt ein Ordner mit euren Unterlagen.",
        },
        {
          q: "Was passiert, wenn Raban etwas nicht weiß?",
          a: "Raban sagt es offen und schlägt vor, die zuständige Person zu fragen. Ein Tipp von dir, und die Bitte geht raus.",
        },
        {
          q: "Wer entscheidet, was als Antwort gilt?",
          a: "Ein Mensch. Was jemand selbst sagt oder korrigiert, gilt mit Namen und Datum. Was Raban nur vorschlägt, steht als Vorschlag da.",
        },
        {
          q: "Wo liegen unsere Daten?",
          a: "Eure Unterlagen und Antworten liegen bei unserem Datenbank-Anbieter in Frankfurt. Welche KI-Dienste wo rechnen, legen wir vor dem Start offen.",
        },
        {
          q: "Wem gehört das Wissen?",
          a: "Euch. Ihr bekommt eure Daten jederzeit als ZIP.",
        },
        {
          q: "Wie fangen wir an?",
          a: "Schreib uns an humans@raban.ai. Wir suchen gerade ein zweites Pilotunternehmen.",
        },
      ],
    },
  },
  en: {
    lede: "Keeps knowledge\nwhen people\nleave.",
    ledeEm: 8.3,
    deck: "Ask Raban and get the answer from your company's documents, with the source. If it isn't written down anywhere, Raban asks the person who knows.",
    why: {
      label: "Why Raban",
      display: "What matters most isn't in any folder.",
      sub: "It lives in the heads of a few people. When they retire or move on, it leaves with them. Raban holds on to it: from your documents where it's written down, and from your people where it isn't.",
      principles: [
        ["With source", "Every answer shows where it comes from: the document and passage, or the person."],
        ["No guessing", "When Raban doesn't know, it says so and asks."],
        ["With a name", "A person vouches for every answer, with name and date."],
      ],
    },
    how: "How Raban works",
    rows: [
      {
        tag: "01 Record",
        panel: "Recording by voice",
        scene: "record",
        alt: "Raban listens to someone explaining what to do when the print smears on the left, asks back, and writes the steps down in four phases.",
        title: "Explain it once. Raban takes notes.",
        body: "Explain a task the way you'd explain it to a trainee. Raban listens, asks where something is missing, and writes the steps down while you talk.",
        points: [
          "Speak or type, whatever suits",
          "Raban asks until it has understood",
          "You see right away what came across",
        ],
      },
      {
        tag: "02 Ask",
        panel: "Plan with sources",
        scene: "plan",
        alt: "Someone asks what to do when cartons pop open at the glue flap, and Raban answers with a plan in five steps, each with its source.",
        title: "Ask how it's done, and Raban shows you the plan.",
        body: "Ask in your own words. Raban answers in steps, put together from work instructions, manuals and what colleagues have explained.",
        points: [
          "Step by step instead of long texts",
          "Every step shows where it comes from",
          "On the desktop and on the phone",
        ],
      },
      {
        tag: "03 Follow up",
        panel: "Request to a person",
        scene: "ask",
        alt: "Raban finds nothing in the documents for a question, suggests asking the colleague who entered the figure, and sends her the request.",
        title: "If it's nowhere, Raban asks the person who knows.",
        body: "Raban doesn't guess. It says the answer is missing and suggests who to ask. One tap from you and the request goes out. The person answers once, and from then on their answer holds for everyone, with name and date.",
        points: [
          "Raban suggests the person responsible, you can change it",
          "Every answer shows who confirmed it and when",
          "If something is no longer right, you correct it with one tap",
        ],
      },
      {
        tag: "04 Get it done",
        panel: "Raban fills in the report",
        scene: "task",
        alt: "On the left a recorded task in five steps, on the right Raban fills in the complaint report at step four, with a source for every field.",
        title: "What Raban can do itself, Raban does.",
        body: "When a process calls for a report or a form, Raban fills it in from your documents and logs, with a source for every field. What Raban doesn't know goes to the right person. You check before anything goes out.",
        points: [
          "Forms and reports pre-filled",
          "A source for every field",
          "A person signs off before anything goes out",
        ],
      },
      {
        tag: "05 Connect",
        panel: "A task's inputs",
        scene: "inputs",
        alt: "The inputs of the task “Complaint: cartons pop open”: three selected systems, four uploaded files and three contributions from colleagues.",
        title: "See what Raban draws on.",
        body: "You connect your systems once for the whole company. For each task you choose what Raban reads from: systems like the ERP, files you've uploaded, and what colleagues have explained. So you always see what goes into an answer.",
        points: [
          "Connect systems once, choose them per task",
          "Upload files as they are",
          "A folder is enough to start",
        ],
      },
    ],
    pricing: {
      label: "Pricing",
      title: "Pricing",
      stats: [
        ["€1,000–9,000", "Setup, one time, scoped by site"],
        ["€250", "Base fee per month, for maintenance and updates"],
        ["~€25", "Per employee per month, covers the AI costs"],
      ],
      note: "Your knowledge is yours. You can take your data out as a ZIP at any time.",
      cta: "Request a pilot",
    },
    faq: {
      title: "Questions",
      items: [
        {
          q: "Do we have to connect Raban to our systems?",
          a: "No. A folder of your documents is enough to start.",
        },
        {
          q: "What happens when Raban doesn't know something?",
          a: "Raban says so and suggests asking the person responsible. One tap from you and the request goes out.",
        },
        {
          q: "Who decides what counts as an answer?",
          a: "A person. What someone says or corrects holds with their name and date. What Raban only suggests is marked as a suggestion.",
        },
        {
          q: "Where does our data live?",
          a: "Your documents and answers are stored with our database provider in Frankfurt. Which AI services run where, we disclose before you start.",
        },
        {
          q: "Who owns the knowledge?",
          a: "You do. You can take your data out as a ZIP at any time.",
        },
        {
          q: "How do we start?",
          a: "Write to humans@raban.ai. We're looking for a second pilot company right now.",
        },
      ],
    },
  },
} as const;

/** The home page in Markdown: the hero as the title, then each section under
 *  its label, the rows with what their window shows (the windows are drawn,
 *  so there is no picture to link), the prices and the questions. */
export function markdown(locale: Locale): string {
  const t = T[locale];
  return blocks(
    `# ${t.lede.replace(/\n/g, " ")}`,
    t.deck,
    `## ${t.why.label}`,
    `**${t.why.display}**`,
    t.why.sub,
    list(t.why.principles.map(([label, text]) => `**${label}:** ${text}`)),
    `## ${t.how}`,
    ...t.rows.map((row) =>
      blocks(
        `### ${row.tag}`,
        `**${row.title}**`,
        row.body,
        list(row.points),
        `*${row.panel}: ${row.alt}*`,
      ),
    ),
    `## ${t.pricing.title}`,
    list(t.pricing.stats.map(([value, label]) => `**${value}:** ${label}`)),
    t.pricing.note,
    link(t.pricing.cta, "/contact"),
    `## ${t.faq.title}`,
    ...t.faq.items.map(({ q, a }) => blocks(`### ${q}`, a)),
  );
}
