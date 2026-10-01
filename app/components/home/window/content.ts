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
    asks: string;
    question: string;
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
    /** The button beside a photo waiting in the message box. */
    removePhoto: string;
  };
  ask: {
    title: string;
    /** The exchange before the one that plays: asked and answered. */
    before: string;
    beforeAnswer: string;
    beforeSource: string;
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
  inputs: {
    title: string;
    state: string;
    name: string;
    lead: string;
    tabs: [string, string];
    systems: { label: string; count: string; rows: { name: string; what: string; read?: string; on: boolean; icon: "database" | "camera" | "book" | "printer" | "mail" }[] };
    files: { label: string; count: string; add: string; rows: { name: string; by: string }[] };
    heads: { label: string; count: string; rows: { who: string; what: string; when: string }[] };
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
        "Übergabe Spätschicht",
        "Neuer Leim im Test",
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
        {
          title: "Erkennen",
          steps: [
            "Bogen ziehen, linken Rand ansehen",
            "Farbzonen links prüfen",
            "Farbdichte messen",
          ],
        },
        {
          title: "Anhalten",
          steps: [
            "Maschine stoppen",
            "Fehlbogen aus der Auslage nehmen",
            "Farbwerk links waschen",
            "Gummituch links prüfen",
            "Feuchtung links prüfen",
            "Gummituch waschen",
            "Druckplatte links prüfen",
            "Puderbestäubung prüfen",
            "Stillstand im System melden",
          ],
        },
        {
          title: "Walze einstellen",
          steps: [
            "Streifenprobe machen",
            "Auftragswalze links nachstellen",
            "Reiberwalze links prüfen",
            "Walzenlager auf Spiel prüfen",
            "Walzen auf Risse prüfen",
            "Farbzonen links zurücknehmen",
            "Druckbeistellung prüfen",
            "Feuchtung nachregeln",
            "Farbwerk einlaufen lassen",
            "Zweite Streifenprobe machen",
          ],
        },
        {
          title: "Probedruck",
          steps: [
            "Probebogen drucken",
            "Mit OK-Bogen vergleichen",
          ],
        },
      ],
      added: "Streifen überall 4–5 mm breit",
      asks: "Raban fragt nach",
      question: "Woran siehst du, dass die Walze richtig steht?",
      mute: "Stumm",
      pause: "Pause",
      end: "Beenden",
    },
    plan: {
      title: "Herausfinden",
      question: "Die Schachteln gehen an der Klebelasche manchmal auf. Was kann ich tun?",
      lead: "Auf deinem Foto ist die Klebelasche an der Ecke aufgegangen. Meist liegt es am Leimauftrag. So gehst du vor:",
      head: "Plan · 5 Schritte",
      from: "aus 3 Quellen",
      steps: [
        { text: "Aufgegangene Schachteln ziehen", source: "Arbeitsanweisung 5.2" },
        { text: "Leimbild an der Leimüberwachung prüfen", source: "Arbeitsanweisung 5.2" },
        { text: "Spur unterbrochen? Düse reinigen", source: "Bedienungsanleitung S. 41" },
        { text: "Andruck am Anpressband prüfen", source: "Markus Wendel" },
        { text: "Zehn Schachteln probekleben", source: "Markus Wendel" },
      ],
      removePhoto: "Foto entfernen",
    },
    ask: {
      title: "Herausfinden",
      before: "Mit wie viel Makulatur rechnen wir bei der Pralinenschachtel?",
      beforeAnswer: "Mit 12 %. So steht es in der Kalkulation der Pralinenschachtel, Zeile 14.212.",
      beforeSource: "Kalkulation Pralinenschachtel 2026",
      question: "Warum so viel? Sonst sind es 6 %.",
      reply: "Dazu hat bei euch noch niemand etwas hinterlegt. Die 12 % hat Sabine Roth im März eingetragen, ohne Begründung. Soll ich sie fragen?",
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
    inputs: {
      title: "Aufgabe",
      state: "In Arbeit",
      name: "Reklamation: Schachteln gehen auf",
      lead: "Worauf diese Aufgabe zugreift",
      tabs: ["Ablauf", "Eingaben"],
      systems: {
        label: "Aus Systemen",
        count: "3 von 5 gewählt",
        rows: [
          { name: "ERP", what: "Aufträge, Kunden, Chargen", read: "gelesen 09:12", on: true, icon: "database" },
          { name: "Leimüberwachung", what: "Kamera-Protokoll, Klebemaschine 2", read: "gelesen 09:10", on: true, icon: "camera" },
          { name: "Schichtbuch", what: "Einträge der Kleberei", read: "gelesen 08:55", on: true, icon: "book" },
          { name: "Druckdaten", what: "Meldungen der Druckmaschinen", on: false, icon: "printer" },
          { name: "Postfach Qualität", what: "E-Mails an die Qualität", on: false, icon: "mail" },
        ],
      },
      files: {
        label: "Aus Dateien",
        count: "4 Dateien",
        add: "Datei hinzufügen",
        rows: [
          { name: "Arbeitsanweisung Faltschachtel-Kleben.pdf", by: "Markus Wendel, 12.09." },
          { name: "QM-Handbuch, 8.7 Reklamationen.pdf", by: "Katrin Albers, 03.09." },
          { name: "Spezifikation Confiserie Lenz.pdf", by: "Katrin Albers, 15.09." },
          { name: "Bedienungsanleitung Leimsystem.pdf", by: "Markus Wendel, 12.09." },
        ],
      },
      heads: {
        label: "Aus Köpfen",
        count: "3 Beiträge",
        rows: [
          { who: "Katrin Albers", what: "Aufzeichnung „Reklamation bearbeiten“", when: "26.09.2026" },
          { who: "Markus Wendel", what: "Aufzeichnung „Schachteln gehen auf“", when: "24.09.2026" },
          { who: "Markus Wendel", what: "Antwort auf eine Bitte: Andruck am Anpressband", when: "25.09.2026" },
        ],
      },
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
        { label: "Kunde", value: "Confiserie Lenz", source: "ERP" },
        { label: "Auftrag", value: "A-24117, 18.000 Pralinenschachteln", source: "ERP" },
        { label: "Charge", value: "26-0917-3", source: "Leimprotokoll" },
        { label: "Maschine", value: "Klebemaschine 2, Leimstation 3", source: "Leimprotokoll" },
        { label: "Befund", value: "Leimspur an Düse 3 unterbrochen, 214 Schachteln betroffen", source: "Leimüberwachung, 17.09." },
        { label: "Sofortmaßnahme", value: "Düse 3 gereinigt, Restmenge gesperrt", source: "Schichtbuch" },
        { label: "Abstellmaßnahme", value: "Offen: Markus Wendel ist gefragt", open: true },
      ],
      count: "6 von 7 Feldern mit Quelle",
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
        "Late shift handover",
        "Testing a new glue",
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
        {
          title: "Spot it",
          steps: [
            "Pull a sheet, look at the left edge",
            "Check the ink zones on the left",
            "Measure the ink density",
          ],
        },
        {
          title: "Stop",
          steps: [
            "Stop the press",
            "Take the spoiled sheets out of the delivery",
            "Wash the inking unit on the left",
            "Check the blanket on the left",
            "Check the dampening on the left",
            "Wash the blanket",
            "Check the plate on the left",
            "Check the spray powder",
            "Log the stop in the system",
          ],
        },
        {
          title: "Set the roller",
          steps: [
            "Run a stripe test",
            "Reset the form roller on the left",
            "Check the vibrator roller on the left",
            "Check the roller bearings for play",
            "Check the rollers for cracks",
            "Turn down the ink zones on the left",
            "Check the impression setting",
            "Adjust the dampening",
            "Let the inking unit run in",
            "Run a second stripe test",
          ],
        },
        {
          title: "Proof",
          steps: [
            "Print a proof sheet",
            "Compare it with the OK sheet",
          ],
        },
      ],
      added: "Stripe 4–5 mm wide all across",
      asks: "Raban asks",
      question: "How do you see that the roller is set right?",
      mute: "Mute",
      pause: "Pause",
      end: "End",
    },
    plan: {
      title: "Find out",
      question: "The cartons sometimes pop open at the glue flap. What can I do?",
      lead: "In your photo the glue flap has come open at the corner. It's usually the glue. Here's what to do:",
      head: "Plan · 5 steps",
      from: "from 3 sources",
      steps: [
        { text: "Pull the cartons that popped open", source: "Work instruction 5.2" },
        { text: "Check the glue pattern on the glue monitor", source: "Work instruction 5.2" },
        { text: "Line broken? Clean the nozzle", source: "Manual p. 41" },
        { text: "Check the compression belt pressure", source: "Markus Wendel" },
        { text: "Glue ten test cartons", source: "Markus Wendel" },
      ],
      removePhoto: "Remove photo",
    },
    ask: {
      title: "Find out",
      before: "How much waste do we plan on the praline box?",
      beforeAnswer: "12%. That's what the costing for the praline box says, row 14,212.",
      beforeSource: "Costing, praline box 2026",
      question: "Why so much? Usually it's 6%.",
      reply: "Nobody at your company has written down why. Sabine Roth entered the 12% in March, without a reason. Shall I ask her?",
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
    inputs: {
      title: "Task",
      state: "In progress",
      name: "Complaint: cartons pop open",
      lead: "What this task draws on",
      tabs: ["Steps", "Inputs"],
      systems: {
        label: "From systems",
        count: "3 of 5 selected",
        rows: [
          { name: "ERP", what: "Orders, customers, batches", read: "read 09:12", on: true, icon: "database" },
          { name: "Glue monitor", what: "Camera log, folder-gluer 2", read: "read 09:10", on: true, icon: "camera" },
          { name: "Shift log", what: "Entries from the gluing team", read: "read 08:55", on: true, icon: "book" },
          { name: "Press data", what: "Messages from the presses", on: false, icon: "printer" },
          { name: "Quality inbox", what: "Emails to the quality team", on: false, icon: "mail" },
        ],
      },
      files: {
        label: "From files",
        count: "4 files",
        add: "Add a file",
        rows: [
          { name: "Work instruction, folding-carton gluing.pdf", by: "Markus Wendel, 12 Sep" },
          { name: "QM handbook, 8.7 Complaints.pdf", by: "Katrin Albers, 3 Sep" },
          { name: "Specification Confiserie Lenz.pdf", by: "Katrin Albers, 15 Sep" },
          { name: "Glue system manual.pdf", by: "Markus Wendel, 12 Sep" },
        ],
      },
      heads: {
        label: "From people",
        count: "3 contributions",
        rows: [
          { who: "Katrin Albers", what: "Recording “Handling a complaint”", when: "26 Sep 2026" },
          { who: "Markus Wendel", what: "Recording “Cartons pop open”", when: "24 Sep 2026" },
          { who: "Markus Wendel", what: "Answer to a request: compression belt pressure", when: "25 Sep 2026" },
        ],
      },
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
        { label: "Customer", value: "Confiserie Lenz", source: "ERP" },
        { label: "Order", value: "A-24117, 18,000 praline boxes", source: "ERP" },
        { label: "Batch", value: "26-0917-3", source: "Glue log" },
        { label: "Machine", value: "Folder-gluer 2, glue station 3", source: "Glue log" },
        { label: "Finding", value: "Glue line broken at nozzle 3, 214 cartons affected", source: "Glue monitor, 17 Sep" },
        { label: "Immediate action", value: "Nozzle 3 cleaned, rest of the batch blocked", source: "Shift log" },
        { label: "Corrective action", value: "Open: Markus Wendel has been asked", open: true },
      ],
      count: "6 of 7 fields with a source",
      submit: "Check and send",
    },
  },
};
