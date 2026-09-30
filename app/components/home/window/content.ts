// What the four app windows on home show, in both languages: a day in a
// folding-carton works — print that smears on the left, cartons that pop open
// at the glue flap, a figure in the costing nobody can explain any more, a
// customer complaint. Colleagues, customer and numbers are invented; the
// account is Johannes Koch's in the firm "Raban", as in the founders' own
// login.

export type Step = { text: string; source?: string };

export type WindowCopy = {
  menu: {
    search: string;
    home: string;
    inbox: string;
    recordings: string;
    tasks: string;
    openLabel: string;
    /** The open recordings in the menu, most recent first. */
    open: string[];
    /** A recording that is still running shows under this name. */
    running: string;
    all: string;
    person: string;
    firm: string;
  };
  me: string;
  meInitial: string;
  placeholder: string;
  done: string;
  record: {
    title: string;
    hearing: string;
    topic: string;
    phase: string;
    phases: { title: string; steps: string[] }[];
    /** The step Raban's question brings in, added to phase 3. */
    added: string;
    legend: string;
    asks: string;
    question: string;
    answer: string;
    mute: string;
    pause: string;
    end: string;
  };
  plan: {
    title: string;
    question: string;
    lead: string;
    head: string;
    from: string;
    steps: Step[];
  };
  ask: {
    title: string;
    question: string;
    reply: string;
    status: string;
    waiting: string;
    request: string;
    person: string;
    initials: string;
    suggested: string;
    asked: string;
    change: string;
    send: string;
    discard: string;
    sent: string;
    sentNote: string;
  };
  task: {
    title: string;
    state: string;
    name: string;
    meta: string;
    steps: string[];
    working: string;
    waiting: string;
    raban: string;
    form: string;
    source: string;
    fields: { label: string; value: string; source?: string; open?: boolean }[];
    count: string;
    submit: string;
  };
};

export const WINDOWS: Record<"de" | "en", WindowCopy> = {
  de: {
    menu: {
      search: "Suchen",
      home: "Start",
      inbox: "Postfach",
      recordings: "Aufzeichnungen",
      tasks: "Aufgaben",
      openLabel: "Offene Aufzeichnungen",
      open: [
        "Druck schmiert links",
        "Schachteln gehen auf",
        "Makulatur Pralinenschachtel",
        "Rüsten Stanze 2",
        "Farbabgleich Sonderfarbe",
      ],
      running: "Läuft gerade",
      all: "Alle offenen Aufzeichnungen",
      person: "Johannes Koch",
      firm: "Raban",
    },
    me: "Du",
    meInitial: "D",
    placeholder: "Nachricht an Raban",
    done: "Fertig",
    record: {
      title: "Aufzeichnen",
      hearing: "Das höre ich",
      topic: "Druck schmiert links",
      phase: "Phase",
      phases: [
        { title: "Erkennen", steps: ["Bogen ziehen, linken Rand ansehen", "Farbzonen links prüfen"] },
        { title: "Anhalten", steps: ["Maschine stoppen", "Farbwerk links waschen"] },
        { title: "Walze einstellen", steps: ["Streifenprobe machen", "Auftragswalze links nachstellen"] },
        { title: "Probedruck", steps: ["Probebogen drucken", "Mit OK-Bogen vergleichen"] },
      ],
      added: "Streifen überall 4–5 mm breit",
      legend: "Raban zeichnet mit. Grau: gehört, noch nicht zusammengefasst.",
      asks: "Raban fragt nach",
      question: "Woran siehst du, dass die Walze richtig steht?",
      answer: "Der Streifen ist überall vier bis fünf Millimeter breit.",
      mute: "Stumm",
      pause: "Pause",
      end: "Beenden",
    },
    plan: {
      title: "Herausfinden",
      question: "Die Schachteln gehen an der Klebelasche manchmal auf. Was kann ich tun?",
      lead: "Meist liegt es am Leimauftrag. So gehst du vor:",
      head: "Plan · 5 Schritte",
      from: "aus 3 Quellen",
      steps: [
        { text: "Aufgegangene Schachteln ziehen", source: "Arbeitsanweisung 5.2" },
        { text: "Leimbild an der Leimüberwachung prüfen", source: "Arbeitsanweisung 5.2" },
        { text: "Spur unterbrochen? Düse reinigen", source: "Bedienungsanleitung S. 41" },
        { text: "Andruck am Anpressband prüfen", source: "Markus Wendel" },
        { text: "Zehn Schachteln probekleben", source: "Markus Wendel" },
      ],
    },
    ask: {
      title: "Herausfinden",
      question: "Warum rechnen wir bei der Pralinenschachtel mit 12 % Makulatur?",
      reply: "Dazu hat bei euch noch niemand etwas hinterlegt. Die Zahl hat Sabine Roth in die Kalkulation eingetragen. Soll ich sie fragen?",
      status: "Bitte an einen Menschen",
      waiting: "wartet auf deinen Tipp",
      request: "Warum rechnen wir bei der Pralinenschachtel mit 12 % Makulatur? Sonst sind es 6 %.",
      person: "Sabine Roth",
      initials: "SR",
      suggested: "vorgeschlagen",
      asked: "gefragt",
      change: "Ändern",
      send: "Ja, an Sabine Roth senden",
      discard: "Verwerfen",
      sent: "gesendet, 09:29",
      sentNote: "Sabine bekommt die Bitte in ihr Postfach. Ihre Antwort gilt dann für alle, mit Namen und Datum.",
    },
    task: {
      title: "Aufgabe",
      state: "In Arbeit",
      name: "Reklamation: Schachteln gehen auf",
      meta: "Festgehalten von Katrin Albers · geprüft am 26.09.2026",
      steps: [
        "Muster vom Kunden sichern",
        "Leimprotokoll der Charge ziehen",
        "Ursache mit der Kleberei klären",
        "Reklamationsbericht ausfüllen",
        "Kunde informieren",
      ],
      working: "Raban füllt aus …",
      waiting: "Wartet auf deine Prüfung",
      raban: "Raban · Schritt 4",
      form: "Reklamationsbericht",
      source: "Quelle",
      fields: [
        { label: "Kunde", value: "Confiserie Lenz, Auftrag A-24117", source: "ERP" },
        { label: "Charge", value: "26-0917-3, Klebemaschine 2", source: "Leimprotokoll" },
        { label: "Befund", value: "Leimspur an Düse 3 unterbrochen, 214 von 18.000 Schachteln", source: "Leimüberwachung, 17.09." },
        { label: "Sofortmaßnahme", value: "Düse 3 gereinigt, Restmenge gesperrt", source: "Schichtbuch" },
        { label: "Abstellmaßnahme", value: "Offen: Markus Wendel ist gefragt", open: true },
      ],
      count: "4 von 5 mit Quelle",
      submit: "Prüfen und senden",
    },
  },
  en: {
    menu: {
      search: "Search",
      home: "Home",
      inbox: "Inbox",
      recordings: "Recordings",
      tasks: "Tasks",
      openLabel: "Open recordings",
      open: [
        "Print smears on the left",
        "Cartons pop open",
        "Waste on the praline box",
        "Setting up die cutter 2",
        "Matching a spot colour",
      ],
      running: "Running now",
      all: "All open recordings",
      person: "Johannes Koch",
      firm: "Raban",
    },
    me: "You",
    meInitial: "Y",
    placeholder: "Message Raban",
    done: "Done",
    record: {
      title: "Record",
      hearing: "What I'm hearing",
      topic: "Print smears on the left",
      phase: "Phase",
      phases: [
        { title: "Spot it", steps: ["Pull a sheet, look at the left edge", "Check the ink zones on the left"] },
        { title: "Stop", steps: ["Stop the press", "Wash the inking unit on the left"] },
        { title: "Set the roller", steps: ["Run a stripe test", "Reset the form roller on the left"] },
        { title: "Proof", steps: ["Print a proof sheet", "Compare it with the OK sheet"] },
      ],
      added: "Stripe 4–5 mm wide all across",
      legend: "Raban is drawing along. Grey: heard, not summed up yet.",
      asks: "Raban asks",
      question: "How do you see that the roller is set right?",
      answer: "The stripe is four to five millimetres wide all the way across.",
      mute: "Mute",
      pause: "Pause",
      end: "End",
    },
    plan: {
      title: "Find out",
      question: "The cartons sometimes pop open at the glue flap. What can I do?",
      lead: "It's usually the glue. Here's what to do:",
      head: "Plan · 5 steps",
      from: "from 3 sources",
      steps: [
        { text: "Pull the cartons that popped open", source: "Work instruction 5.2" },
        { text: "Check the glue pattern on the glue monitor", source: "Work instruction 5.2" },
        { text: "Line broken? Clean the nozzle", source: "Manual p. 41" },
        { text: "Check the compression belt pressure", source: "Markus Wendel" },
        { text: "Glue ten test cartons", source: "Markus Wendel" },
      ],
    },
    ask: {
      title: "Find out",
      question: "Why do we plan 12% waste on the praline box?",
      reply: "Nobody at your company has written that down yet. Sabine Roth put the figure into the costing. Shall I ask her?",
      status: "Request to a person",
      waiting: "waiting for your tap",
      request: "Why do we plan 12% waste on the praline box? Usually it's 6%.",
      person: "Sabine Roth",
      initials: "SR",
      suggested: "suggested",
      asked: "asked",
      change: "Change",
      send: "Yes, send to Sabine Roth",
      discard: "Discard",
      sent: "sent, 09:29",
      sentNote: "Sabine gets the request in her inbox. Her answer then holds for everyone, with name and date.",
    },
    task: {
      title: "Task",
      state: "In progress",
      name: "Complaint: cartons pop open",
      meta: "Recorded by Katrin Albers · checked 26 Sep 2026",
      steps: [
        "Secure the customer's samples",
        "Pull the glue log for the batch",
        "Clarify the cause with the gluing team",
        "Fill in the complaint report",
        "Inform the customer",
      ],
      working: "Raban is filling it in …",
      waiting: "Waiting for your check",
      raban: "Raban · step 4",
      form: "Complaint report",
      source: "Source",
      fields: [
        { label: "Customer", value: "Confiserie Lenz, order A-24117", source: "ERP" },
        { label: "Batch", value: "26-0917-3, folder-gluer 2", source: "Glue log" },
        { label: "Finding", value: "Glue line broken at nozzle 3, 214 of 18,000 cartons", source: "Glue monitor, 17 Sep" },
        { label: "Immediate action", value: "Nozzle 3 cleaned, rest of the batch blocked", source: "Shift log" },
        { label: "Corrective action", value: "Open: Markus Wendel has been asked", open: true },
      ],
      count: "4 of 5 with a source",
      submit: "Check and send",
    },
  },
};
