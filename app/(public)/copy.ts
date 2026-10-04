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
    deck: "Frag Raban, und du bekommst die Antwort\naus dem aufbereiteten Wissen eurer\nFirma, mit Fundstelle. Steht sie nirgends,\nfragt Raban den Menschen, der es weiß.",
    why: {
      label: "Warum Raban",
      display: "Das Wichtigste steht in keinem Ordner.",
      sub: "Es steckt in den Köpfen weniger Menschen. Gehen sie in Rente oder wechseln sie, geht es mit. Raban hält es fest: aus den Unterlagen, wo es steht, und von den Menschen, wo es fehlt.",
      principles: [
        ["Mit Fundstelle", "Jede Antwort zeigt, woher sie kommt: Dokument und Stelle, oder die Person."],
        ["Kein Raten", "Weiß Raban etwas nicht, sagt Raban das offen und fragt nach."],
        ["Mit Namen", "Was Menschen beitragen, steht mit Namen und Datum da."],
      ],
    },
    how: "So arbeitet Raban",
    rows: [
      {
        tag: "01 Aufzeichnen",
        panel: "Aufzeichnen per Sprache",
        scene: "record",
        alt: "Raban hört zu, wie jemand erklärt, was zu tun ist, wenn der Druck links schmiert, fragt nach und hält die Schritte in vier Phasen fest; am ersten Schritt hängt ein Foto der Bogenauslage.",
        title: "Erzähl es einmal. Raban schreibt mit.",
        body: "Erklär eine Aufgabe, wie du sie einem Azubi erklären würdest. Raban hört zu, fragt nach, wo etwas fehlt, und hält die Schritte fest, während du sprichst.",
        points: [
          "Sprechen, tippen oder ein Foto machen, wie es gerade passt",
          "Raban fragt nach, bis es verstanden hat",
          "Du siehst sofort, was angekommen ist",
        ],
      },
      {
        tag: "02 Fragen",
        panel: "Plan mit Quellen",
        scene: "plan",
        alt: "Jemand fragt mit einem Foto der aufgegangenen Schachtel, was zu tun ist, und Raban antwortet mit einem Plan in fünf Schritten, jeder mit seiner Quelle.",
        title: "Frag, wie es geht, und Raban zeigt dir den Plan.",
        body: "Stell deine Frage in eigenen Worten. Raban antwortet multimodal: Du liest den Plan Schritt für Schritt, oder Raban erklärt ihn dir laut. Die Schritte stammen aus Arbeitsanweisung, Bedienungsanleitung und dem, was Kollegen erzählt haben.",
        points: [
          "Lesen oder zuhören, wie es gerade passt",
          "Jeder Schritt zeigt, woher er kommt",
          "Am Rechner und am Handy",
        ],
      },
      {
        tag: "03 Nachfragen",
        panel: "Bitte an einen Menschen",
        scene: "ask",
        alt: "Raban findet zu einer Frage nichts in den Unterlagen, schlägt vor, die Kollegin zu fragen, die die Zahl eingetragen hat; ein Tipp, und die Bitte geht an sie.",
        title: "Steht es nirgends, fragt Raban den Menschen, der es weiß.",
        body: "Raban rät nicht. Raban sagt offen, dass die Antwort fehlt, und schlägt vor, wen es fragen soll. Ein Tipp von dir, und die Bitte geht raus. Die Person antwortet einmal, und ab da gilt ihre Antwort für alle, mit Namen und Datum.",
        points: [
          "Raban schlägt die zuständige Person vor, du kannst sie ändern",
          "Jede Antwort zeigt, wer sie bestätigt hat und wann",
          "Stimmt etwas nicht mehr, korrigierst du es direkt an der Antwort",
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
          "Quelle zu jedem ausgefüllten Feld",
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
        ["250 €", "Grundgebühr im Monat, für Wartung und Upgrades"],
        ["~5 €", "je Million Tokens: Ihr zahlt nur so viel für die KI, wie ihr auch benutzt"],
      ],
      pilot: "Diese Preise treffen nicht auf unsere Pilotprojekte zu. Wir wollen nur bezahlt werden, wenn wir auch Mehrwert liefern.",
    },
    data: {
      label: "Eure Daten",
      display: "Euer Wissen gehört euch.",
      sub: "Was Raban für euch festhält, holt ihr euch jederzeit selbst heraus: Ein Klick, und alles ist als ZIP gepackt.",
      cta: "Pilot anfragen",
      // Words in the drawings of the section (preview of the variants, 2026-10-04).
      items: ["Aufgaben", "Antworten", "Unterlagen"],
      formats: ["CSV", "JSON", "Originale"],
      file: "raban-export.zip",
      zipperAlt: "Ein Reißverschluss schließt sich über Aufgaben, Antworten und Unterlagen; am Schieber hängt „ZIP“.",
      flowAlt: "Aufgaben, Antworten und Unterlagen laufen in ein ZIP und kommen als CSV, JSON und Originale wieder heraus.",
    },
    faq: {
      title: "Häufige Fragen",
      items: [
        {
          q: "Wie sichern wir das Wissen eines Mitarbeiters, bevor er in Rente geht?",
          a: "Fangt an, solange die Person noch da ist. Lasst sie ihre Aufgaben erklären, wie sie es einem Azubi erklären würde, und lasst danach einen Kollegen die Aufgabe einmal selbst machen, während sie danebensteht. Raban hört dabei zu, fragt nach, wo etwas fehlt, und hält alles fest, mit Namen und Datum.",
        },
        {
          q: "Für welche Betriebe ist Raban gedacht?",
          a: "Für Betriebe, in denen wichtiges Können in den Köpfen einiger erfahrener Leute steckt, etwa in der Fertigung. Unser erstes Pilotunternehmen ist eine Verpackungsfertigung mit rund hundert Mitarbeitern.",
        },
        {
          q: "Unsere Leute haben wenig Zeit und schreiben nicht gern. Geht das trotzdem?",
          a: "Ja. Niemand muss schreiben: Man erzählt eine Aufgabe einmal, am Rechner oder am Handy, und Raban schreibt mit. Nachgefragt wird nur, wo etwas fehlt.",
        },
        {
          q: "Was ist anders als bei einem Wiki oder einer Dokumentenablage?",
          a: "Ein Wiki enthält nur, was jemand aufschreibt. Raban holt das Wissen im Gespräch ab, beantwortet Fragen Schritt für Schritt mit Quelle und fragt den zuständigen Menschen, wenn etwas fehlt.",
        },
        {
          q: "Woher wissen wir, dass die Antworten stimmen?",
          a: "Jede Antwort zeigt ihre Quelle: das Dokument und die Stelle oder die Person, die es gesagt hat. Weiß Raban etwas nicht, sagt Raban das offen, statt zu raten. Fehlt etwas, entscheidet ein Mensch, was gilt, mit Namen und Datum.",
        },
        {
          q: "Müssen wir Raban an unsere Systeme anschließen?",
          a: "Nein. Zum Start genügt ein Ordner mit euren Unterlagen. Systeme wie das ERP könnt ihr später einmal für die ganze Firma anschließen.",
        },
        {
          q: "Wo liegen unsere Daten, und wem gehören sie?",
          a: "Eure Unterlagen und Antworten liegen bei unserem Datenbank-Anbieter in Frankfurt, und sie gehören euch: Ihr holt sie euch jederzeit selbst als ZIP. Welche KI-Dienste wo rechnen, legen wir vor dem Start offen.",
        },
        {
          q: "Wie fangen wir an?",
          a: "Schreibt uns an humans@raban.ai. Wir suchen gerade ein zweites Pilotunternehmen.",
        },
      ],
    },
  },
  en: {
    lede: "Keeps knowledge\nwhen people\nleave.",
    ledeEm: 8.3,
    deck: "Ask Raban and get the answers from your\ncompany's refined knowledge, with the\nsource. If it isn't written down anywhere,\nRaban asks the person who knows.",
    why: {
      label: "Why Raban",
      display: "What matters most isn't in any folder.",
      sub: "It lives in the heads of a few people. When they retire or move on, it leaves with them. Raban holds on to it: from your documents where it's written down, and from your people where it isn't.",
      principles: [
        ["With source", "Every answer shows where it comes from: the document and passage, or the person."],
        ["No guessing", "When Raban doesn't know, it says so and asks."],
        ["With a name", "What people contribute carries their name and the date."],
      ],
    },
    how: "How Raban works",
    rows: [
      {
        tag: "01 Record",
        panel: "Recording by voice",
        scene: "record",
        alt: "Raban listens to someone explaining what to do when the print smears on the left, asks back, and writes the steps down in four phases; a photo of the press delivery hangs on the first step.",
        title: "Explain it once. Raban takes notes.",
        body: "Explain a task the way you'd explain it to a trainee. Raban listens, asks where something is missing, and writes the steps down while you talk.",
        points: [
          "Speak, type or take a photo, whatever suits",
          "Raban asks until it has understood",
          "You see right away what came across",
        ],
      },
      {
        tag: "02 Ask",
        panel: "Plan with sources",
        scene: "plan",
        alt: "Someone asks with a photo of a carton that has popped open what to do, and Raban answers with a plan in five steps, each with its source.",
        title: "Ask how it's done, and Raban shows you the plan.",
        body: "Ask in your own words. Raban answers multimodally: read the plan step by step, or have Raban explain it out loud. The steps come from work instructions, manuals and what colleagues have explained.",
        points: [
          "Read or listen, whatever suits",
          "Every step shows where it comes from",
          "On the desktop and on the phone",
        ],
      },
      {
        tag: "03 Follow up",
        panel: "Request to a person",
        scene: "ask",
        alt: "Raban finds nothing in the documents for a question, suggests asking the colleague who entered the figure; one tap and the request goes to her.",
        title: "If it's nowhere, Raban asks the person who knows.",
        body: "Raban doesn't guess. It says the answer is missing and suggests who to ask. One tap from you and the request goes out. The person answers once, and from then on their answer holds for everyone, with name and date.",
        points: [
          "Raban suggests the person responsible, you can change it",
          "Every answer shows who confirmed it and when",
          "If something is no longer right, you correct it right at the answer",
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
          "A source for every filled-in field",
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
        ["€250", "Base fee per month, for maintenance and upgrades"],
        ["~€5", "Per million tokens: you only pay for as much AI as you actually use"],
      ],
      pilot: "These prices don't apply to our pilot projects. We only want to be paid if we actually deliver value.",
    },
    data: {
      label: "Your data",
      display: "Your knowledge is yours.",
      sub: "What Raban holds on to for you, you can take out yourself at any time: one click, and it's all zipped up.",
      cta: "Request a pilot",
      items: ["Tasks", "Answers", "Documents"],
      formats: ["CSV", "JSON", "Originals"],
      file: "raban-export.zip",
      zipperAlt: "A zipper closes over tasks, answers and documents; a tag reading “ZIP” hangs from its slider.",
      flowAlt: "Tasks, answers and documents run into a ZIP and come out again as CSV, JSON and the originals.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          q: "How do we secure an employee's knowledge before they retire?",
          a: "Start while the person is still there. Have them explain their tasks the way they'd explain them to a trainee, then have a colleague do the task once while they stand by. Raban listens, asks where something is missing, and writes it all down, with name and date.",
        },
        {
          q: "Which companies is Raban for?",
          a: "For companies where important know-how sits in the heads of a few experienced people, in manufacturing for example. Our first pilot company is a packaging manufacturer with around a hundred employees.",
        },
        {
          q: "Our people are short on time and don't like writing. Does it still work?",
          a: "Yes. Nobody has to write: you explain a task once, on the desktop or the phone, and Raban takes notes. It only asks where something is missing.",
        },
        {
          q: "How is this different from a wiki or a shared drive?",
          a: "A wiki only holds what someone writes down. Raban collects the knowledge in conversation, answers questions step by step with the source, and asks the person responsible when something is missing.",
        },
        {
          q: "How do we know the answers are right?",
          a: "Every answer shows its source: the document and passage, or the person who said it. When Raban doesn't know, it says so instead of guessing. Where something is missing, a person decides what holds, with name and date.",
        },
        {
          q: "Do we have to connect Raban to our systems?",
          a: "No. A folder of your documents is enough to start. Systems like your ERP can be connected later, once for the whole company.",
        },
        {
          q: "Where does our data live, and who owns it?",
          a: "Your documents and answers are stored with our database provider in Frankfurt, and they're yours: you can take them out yourself as a ZIP at any time. Which AI services run where, we disclose before you start.",
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
 *  so there is no picture to link), the prices, who owns the data and the
 *  questions. */
export function markdown(locale: Locale): string {
  const t = T[locale];
  return blocks(
    `# ${t.lede.replace(/\n/g, " ")}`,
    t.deck.replace(/\n/g, " "),
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
    `## ${t.pricing.title}\\*`,
    list(t.pricing.stats.map(([value, label]) => `**${value}:** ${label}`)),
    `\\*${t.pricing.pilot}`,
    `## ${t.data.label}`,
    `**${t.data.display}**`,
    t.data.sub,
    link(t.data.cta, "/contact"),
    `## ${t.faq.title}`,
    ...t.faq.items.map(({ q, a }) => blocks(`### ${q}`, a)),
  );
}
