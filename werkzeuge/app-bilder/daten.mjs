// Erfundene Beispieldaten für die Bilder der App auf raban.ai.
// Firma, Personen, Unterlagen und Fragen sind ausgedacht.

export const HEUTE = '2026-09-28T10:30:00+02:00'

export const FIRMA = { firmen_id: 'firma-muster', firmenname: 'Musterfirma GmbH' }

export const ICH = {
  person_id: '0b5c1d2e-0000-4000-8000-000000000001',
  anzeigename: 'Lena Brandt',
  bereich: 'Qualitätssicherung',
  email: 'lena.brandt@musterfirma.example',
}

export const ARMIN = { person_id: '0b5c1d2e-0000-4000-8000-000000000002', anzeigename: 'Armin Kettenbach', bereich: 'Managementsysteme' }
export const JENS = { person_id: '0b5c1d2e-0000-4000-8000-000000000003', anzeigename: 'Jens Ohlendorf', bereich: 'Fertigung' }
export const KATRIN = { person_id: '0b5c1d2e-0000-4000-8000-000000000004', anzeigename: 'Katrin Albers', bereich: 'Kaufmännische Leitung' }
export const PETRA = { person_id: '0b5c1d2e-0000-4000-8000-000000000005', anzeigename: 'Petra Wendling', bereich: 'Einkauf' }

export const PERSONEN = [ARMIN, JENS, KATRIN, PETRA, ICH].map((p) => ({
  person_id: p.person_id,
  anzeigename: p.anzeigename,
  bereich: p.bereich,
  ist_wissenstraeger: true,
}))

export const ME = {
  nutzer_id: 'nutzer-lena',
  email: ICH.email,
  ...FIRMA,
  rolle: 'mitarbeiter',
  ist_inhaber: false,
  anzeigename: ICH.anzeigename,
  zustaendigkeiten: [],
  person_id: ICH.person_id,
  eingerichtet: true,
  support: null,
}

/** Die offenen Aufzeichnungen im Menü; die erste ist das laufende Gespräch. */
export function menueListe(titelLaufend) {
  const alt = (id, titel, tag) => ({ id, titel, begonnen: `${tag}T08:00:00Z`, beendet: `${tag}T08:20:00Z`, anzahl_beitraege: 6 })
  return {
    gespraeche: [
      { id: 'g-laufend', titel: titelLaufend, begonnen: '2026-09-28T07:10:00Z', beendet: null, anzahl_beitraege: 4 },
      alt('g-2', 'Prüfmittel kalibrieren', '2026-09-25'),
      alt('g-3', 'Reklamation Charge 26-117', '2026-09-24'),
      alt('g-4', 'Erstmusterprüfbericht', '2026-09-23'),
      alt('g-5', 'Sperrlager aufräumen', '2026-09-22'),
    ],
    naechster_cursor: null,
  }
}

/** Zwei offene Fragen an mich — nur für die Zahl am Postfach. */
export const ANFRAGEN_AN_MICH = [
  {
    anfrage_id: '7a1e0000-0000-4000-8000-000000000001',
    praezise_frage: 'Welche Prüfmittel brauchen eine Kalibrierung vor dem Audit?',
    zustand: 'offen',
    erstellt_am: '2026-09-27T09:00:00Z',
    frager: { anzeigename: JENS.anzeigename },
    empfaenger: { anzeigename: ICH.anzeigename },
    antwort_text: null,
    antwort_von: null,
    antwort_am: null,
    aufgabe_id: null,
  },
  {
    anfrage_id: '7a1e0000-0000-4000-8000-000000000002',
    praezise_frage: 'Wo liegt die aktuelle Freigabe für den Lieferanten der Dichtringe?',
    zustand: 'offen',
    erstellt_am: '2026-09-28T06:40:00Z',
    frager: { anzeigename: PETRA.anzeigename },
    empfaenger: { anzeigename: ICH.anzeigename },
    antwort_text: null,
    antwort_von: null,
    antwort_am: null,
    aufgabe_id: null,
  },
]

// ---- Bausteine für den Verlauf ------------------------------------------------------------------

let nummer = 0
function beitrag(rolle, zeit, text, karte = null) {
  nummer += 1
  return { beitrag_id: `b-${nummer}`, gespraech_id: 'g-laufend', rolle, text, karte, erstellt: zeit }
}

function dokument(dokument_id, titel, seite, abschnitt, auszug, gestuetzt) {
  return {
    dokument_id, titel, seite, abschnitt, auszug,
    quelle: 'dokument', pfad: `unterlagen/${dokument_id}.pdf`, punkte: 0.8,
    anfrage_id: null, antwort_name: null, erstellt_am: '2026-03-02T09:00:00Z', gestuetzt,
  }
}

function fundstellenKarte(fundstellen, titel = '') {
  return { art: 'fundstelle', titel, text: '', daten: { fundstellen } }
}

function bitte(vorschlag_id, person, frage, gruppe) {
  return {
    art: 'vorschlag',
    titel: 'kollegen_fragen',
    text: `Soll ich ${person} fragen: ${frage}`,
    daten: {
      vorschlag_id,
      werkzeug: 'kollegen_fragen',
      argumente: { person, frage },
      knopf: 'Ja, senden',
      name: ICH.anzeigename,
      person_id: ICH.person_id,
      ...(gruppe ? { gruppe } : {}),
    },
  }
}

function verlauf(beitraege) {
  return { gespraech_id: 'g-laufend', skill: 'beantworten', beendet: false, beitraege }
}

// ---- Bild 1: Antwort mit Fundstelle -------------------------------------------------------------

export function verlaufFundstelle() {
  return verlauf([
    beitrag('nutzer', '2026-09-28T07:14:00Z', 'Was machen wir, wenn beim Wareneingang das Werkszeugnis fehlt?'),
    beitrag(
      'raban',
      '2026-09-28T07:14:20Z',
      'Die Lieferung wird gesperrt: Sperrschein dran und ab ins Sperrlager. Der Einkauf fordert das Zeugnis beim Lieferanten nach. ' +
        'Freigeben darf erst die Qualitätssicherung, wenn das Zeugnis da ist und zur Bestellung passt.',
    ),
    beitrag(
      'raban',
      '2026-09-28T07:14:21Z',
      '',
      fundstellenKarte([
        dokument(
          'dok-pa-we',
          'Prüfanweisung Wareneingang',
          3,
          '4.2 Fehlende Prüfdokumente',
          'Fehlt ein gefordertes Werkszeugnis (EN 10204 3.1), ist die Lieferung zu sperren, mit Sperrschein zu kennzeichnen und im Sperrlager abzustellen. ' +
            'Der Einkauf fordert das Zeugnis beim Lieferanten an. Die Freigabe erfolgt durch die Qualitätssicherung nach Prüfung des Zeugnisses gegen die Bestellung.',
          true,
        ),
        dokument(
          'dok-rekla',
          'Reklamationsprozess v3',
          2,
          '2.1 Lieferantenreklamation',
          'Fehlende oder fehlerhafte Begleitpapiere werden als Lieferantenreklamation erfasst, wenn sie nicht innerhalb von fünf Arbeitstagen nachgereicht werden.',
          false,
        ),
        dokument(
          'dok-qmh',
          'Qualitätsmanagement-Handbuch',
          12,
          '8.4 Kontrolle extern bereitgestellter Produkte',
          'Zugekaufte Teile werden erst nach bestandener Wareneingangsprüfung für die Fertigung freigegeben; Art und Umfang der Prüfung regeln die Prüfanweisungen.',
          false,
        ),
      ]),
    ),
  ])
}

// ---- Bild 2: Bitte an einen Menschen ------------------------------------------------------------

export function verlaufBitte() {
  return verlauf([
    beitrag('nutzer', '2026-09-28T07:21:00Z', 'Wie lange darf gesperrte Ware ohne Zeugnis im Sperrlager bleiben?'),
    beitrag('raban', '2026-09-28T07:21:15Z', 'Fünf Arbeitstage. Kommt das Zeugnis bis dahin nicht, geht die Lieferung an den Lieferanten zurück.'),
    beitrag(
      'raban',
      '2026-09-28T07:21:16Z',
      '',
      fundstellenKarte([
        {
          dokument_id: 'dok-antwort-armin',
          titel: `Antwort von ${ARMIN.anzeigename}`,
          seite: null,
          abschnitt: null,
          auszug:
            'Frage: Wie lange darf gesperrte Ware ohne Zeugnis im Sperrlager bleiben? ' +
            'Antwort: Fünf Arbeitstage. Kommt das Zeugnis bis dahin nicht, geht die Lieferung auf Kosten des Lieferanten zurück.',
          quelle: 'antwort',
          pfad: 'antworten/armin-sperrlager',
          punkte: 0.9,
          anfrage_id: '7a1e0000-0000-4000-8000-0000000000a1',
          antwort_name: ARMIN.anzeigename,
          erstellt_am: '2026-09-24T13:05:00Z',
          gestuetzt: true,
        },
      ]),
    ),
    beitrag('nutzer', '2026-09-28T07:23:00Z', 'Und welche Lieferanten sind bei uns für Ship-to-Stock freigegeben?'),
    beitrag(
      'raban',
      '2026-09-28T07:23:12Z',
      'Dazu hat bei euch noch niemand etwas hinterlegt. Zuständig für die Lieferantenfreigabe ist Armin Kettenbach. Soll ich ihn fragen?',
    ),
    beitrag(
      'raban',
      '2026-09-28T07:23:13Z',
      '',
      bitte('vorschlag-ship-to-stock', ARMIN.anzeigename, 'Welche Lieferanten sind bei uns für Ship-to-Stock freigegeben, also ohne Wareneingangsprüfung?'),
    ),
  ])
}

// ---- Bild 3: Kundenfragebogen -------------------------------------------------------------------

const zeile = (frage, antwort, quelle) => ({ frage, antwort, quelle, offen: false, zustaendig: '' })
const offen = (frage, person) => ({ frage, antwort: '', quelle: '', offen: true, zustaendig: person })

export const FORMULAR_ZEILEN = [
  zeile('Ist Ihr Unternehmen nach ISO 9001 zertifiziert? Bitte Gültigkeit angeben.', 'Ja, nach ISO 9001:2015 für Entwicklung und Fertigung von Stanz- und Biegeteilen, gültig bis 14.03.2028.', 'Quelle: „ISO 9001 Zertifikat“, Seite 1, Stand 2025'),
  zeile(
    'Wie ist Ihre Wareneingangsprüfung organisiert?',
    'Stichprobe nach AQL 1,0 auf Maß und Oberfläche, bei Erstlieferungen Vollprüfung. Ein Werkszeugnis 3.1 ist Pflicht.',
    'Quelle: „Prüfanweisung Wareneingang“, Abschnitt 4.2, Seite 3, Rev. 5',
  ),
  offen('Wie hoch ist die Deckungssumme Ihrer Produkthaftpflichtversicherung?', KATRIN.anzeigename),
  zeile(
    'In welcher Frist erhalten wir bei einer Reklamation einen 8D-Bericht?',
    'Eingangsbestätigung innerhalb von 24 Stunden, Sofortmaßnahmen innerhalb von 48 Stunden, vollständiger 8D-Bericht nach spätestens zehn Arbeitstagen.',
    'Quelle: „Reklamationsprozess v3“, Abschnitt 3, Seite 2',
  ),
  zeile(
    'Wie lange bewahren Sie Rückstellmuster auf?',
    'Zwei Jahre ab Lieferung, je Charge beschriftet im Musterlager in Halle 2; auf Wunsch des Kunden auch länger.',
    `Quelle: „Antwort von ${JENS.anzeigename}“, so beantwortet 2026 von ${JENS.anzeigename}`,
  ),
  offen('Welche Kapazität haben Sie für das Stanzen von Edelstahlteilen pro Monat?', JENS.anzeigename),
  zeile(
    'Wie stellen Sie die Rückverfolgbarkeit bis zur Rohmaterialcharge sicher?',
    'Jede Fertigungscharge trägt die Chargennummer des Rohmaterials; die Zuordnung steht auf dem Laufzettel und im ERP.',
    'Quelle: „Rückverfolgbarkeit und Kennzeichnung“, Abschnitt 2.3, Seite 4',
  ),
  zeile(
    'Wie oft werden Ihre Prüfmittel kalibriert?',
    'Einmal im Jahr, Messschieber und Bügelmessschrauben alle sechs Monate; überwacht über die Prüfmittelliste.',
    'Quelle: „Prüfmittelüberwachung“, Abschnitt 5, Seite 2, Rev. 3',
  ),
  zeile(
    'Werden Ihre Mitarbeitenden regelmäßig zu Qualitätsthemen geschult?',
    'Ja, jährliche Unterweisung für alle in Fertigung und Prüfung, Nachweis in der Schulungsmatrix.',
    'Quelle: „Schulungsplan 2026“, Seite 1',
  ),
  zeile(
    'Wie gehen Sie mit fehlerhaften Teilen aus der eigenen Fertigung um?',
    'Sperren, kennzeichnen, im Sperrlager ablegen; über Nacharbeit oder Verschrottung entscheidet die Qualitätssicherung.',
    'Quelle: „Lenkung fehlerhafter Produkte“, Abschnitt 3.1, Seite 2',
  ),
  offen('Nennen Sie Ihre Zahlungs- und Lieferbedingungen.', KATRIN.anzeigename),
  zeile(
    'Führen Sie interne Audits durch? In welchem Rhythmus?',
    'Ja, jeder Prozess einmal im Jahr nach Auditprogramm; Ergebnisse gehen in die Managementbewertung.',
    'Quelle: „Auditprogramm 2026“, Seite 1',
  ),
  zeile(
    'Wie bewerten Sie Ihre eigenen Lieferanten?',
    'Einmal im Jahr nach Qualität, Liefertreue und Reaktionszeit; Lieferanten unter 70 Punkten bekommen einen Maßnahmenplan.',
    'Quelle: „Lieferantenbewertung“, Abschnitt 2, Seite 1',
  ),
  offen('Welche Umweltziele verfolgen Sie für die nächsten zwei Jahre?', ARMIN.anzeigename),
  zeile(
    'Wie lange werden Prüfaufzeichnungen archiviert?',
    'Zehn Jahre, digital im Dokumentenmanagement.',
    'Quelle: „Lenkung dokumentierter Information“, Abschnitt 6, Seite 3',
  ),
  zeile(
    'Wer ist Ihr Ansprechpartner für Qualitätsfragen?',
    'Lena Brandt, Qualitätssicherung, und in Vertretung Armin Kettenbach.',
    'Quelle: „Organigramm“, Seite 1, Stand 2026',
  ),
].map((z, i) => ({ nummer: i + 1, ...z }))

export function verlaufFormular() {
  const zeilen = FORMULAR_ZEILEN
  const offenZahl = zeilen.filter((z) => z.offen).length
  const kopfzeile = `${zeilen.length - offenZahl} von ${zeilen.length} beantwortet, ${offenZahl} offen`
  const formularKarte = {
    art: 'hinweis',
    titel: 'Ausgefülltes Formular',
    text: kopfzeile,
    daten: {
      formular: {
        kopfzeile,
        beantwortet: zeilen.length - offenZahl,
        gesamt: zeilen.length,
        offen: offenZahl,
        zeilen,
        freigabe: `Entwurf — vor dem Versand prüft und gibt frei: ${ARMIN.anzeigename}`,
        hinweis: '',
      },
      text: kopfzeile,
    },
  }
  const gruppe = 'gruppe-fragebogen'
  const frageAn = (person) => {
    const fragen = zeilen.filter((z) => z.offen && z.zustaendig === person.anzeigename).map((z) => `- ${z.frage}`)
    const kopf = fragen.length === 1 ? 'Diese Frage aus einem Kundenfragebogen steht' : 'Diese Fragen aus einem Kundenfragebogen stehen'
    return `${kopf} in unseren Unterlagen nicht:\n${fragen.join('\n')}`
  }
  return verlauf([
    beitrag('nutzer', '2026-09-28T08:02:00Z', 'Fragebogen angehängt: Lieferantenselbstauskunft_2026.docx'),
    beitrag(
      'raban',
      '2026-09-28T08:02:40Z',
      `${zeilen.length - offenZahl} von ${zeilen.length} Fragen sind mit Quelle beantwortet, ${offenZahl} bleiben offen. Für die offenen liegt je eine Bitte an Katrin Albers, Jens Ohlendorf und Armin Kettenbach zum Antippen bereit.`,
    ),
    beitrag('raban', '2026-09-28T08:02:41Z', '', formularKarte),
    beitrag('raban', '2026-09-28T08:02:41Z', '', bitte('vorschlag-f-katrin', KATRIN.anzeigename, frageAn(KATRIN), gruppe)),
    beitrag('raban', '2026-09-28T08:02:41Z', '', bitte('vorschlag-f-jens', JENS.anzeigename, frageAn(JENS), gruppe)),
    beitrag('raban', '2026-09-28T08:02:41Z', '', bitte('vorschlag-f-armin', ARMIN.anzeigename, frageAn(ARMIN), gruppe)),
  ])
}

// ---- Bild 4: Sprache mit Faden ------------------------------------------------------------------

const schritt = (id, nr, handlung, gehoert = false) => ({ id, nummer: nr, handlung, gehoert })

export const FADEN = {
  art: 'faden',
  stufe: 'wird_gezeichnet',
  fertig: false,
  titel: 'Stahlcoils im Wareneingang annehmen',
  phasen: [
    {
      id: 'p1',
      nummer: 1,
      titel: 'Anlieferung prüfen',
      gehoert: false,
      schritte: [
        schritt('p1s1', 1, 'Lieferschein abgleichen'),
        schritt('p1s2', 2, 'Transportschäden sichten'),
        schritt('p1s3', 3, 'Werkszeugnis 3.1 prüfen'),
      ],
    },
    {
      id: 'p2',
      nummer: 2,
      titel: 'Messen',
      gehoert: false,
      schritte: [
        schritt('p2s1', 4, 'Banddicke dreimal messen'),
        schritt('p2s2', 5, 'Kanten auf Grat prüfen'),
        schritt('p2s3', 6, 'Werte protokollieren'),
      ],
    },
    {
      id: 'p3',
      nummer: 3,
      titel: 'Entscheiden',
      gehoert: false,
      schritte: [
        schritt('p3s1', 7, 'Über 0,05 mm: QS rufen'),
        schritt('p3s2', 8, 'Sperren oder freigeben'),
        schritt('p3s3', 9, 'Entscheid im ERP buchen'),
      ],
    },
    {
      id: 'p4',
      nummer: 4,
      titel: 'Einlagern',
      gehoert: true,
      schritte: [
        schritt('p4s1', 10, 'Chargenetikett anbringen', true),
        schritt('p4s2', 11, 'Stellplatz buchen', true),
      ],
    },
  ],
}

export function verlaufSprache() {
  return verlauf([])
}
