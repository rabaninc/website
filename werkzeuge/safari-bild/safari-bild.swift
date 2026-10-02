// Macht ein Bild einer Seite in Safaris eigener Engine: dem WebKit, das in macOS steckt, nicht Chrome
// und kein heruntergeladener Nachbau. Johannes sieht die Seite in Safari, und manches gibt es nur dort
// (die Schrift wirkte dünner als bei typesafe, 30.09.2026; eine weiße Haarlinie an der roten letzten
// Folie, 01.10.2026). Bauen und Aufruf: siehe README.md.
//
// Die Seite lädt in einem randlosen, fast durchsichtigen Fenster unten links auf dem Bildschirm: es
// muss sichtbar sein, sonst hält WebKit requestAnimationFrame an und das Deck auf /about steht still.
// Nach dem Laden wartet das Werkzeug 4 s (Schriften, Bilder), führt das Skript aus (callAsyncJavaScript,
// `await` erlaubt, z. B. scrollen und warten) und nimmt nach weiteren 1,5 s das Bild in der Auflösung
// des Bildschirms auf (Retina: 2x). Gibt das Skript { height, data } zurück, wird das Fenster vor dem
// Bild auf `height` gestellt und `data` als JSON gespeichert.
import Cocoa
import WebKit

let a = CommandLine.arguments
if a.count < 6 || URL(string: a[1]) == nil || Double(a[2]) == nil || Double(a[3]) == nil {
  FileHandle.standardError.write("Aufruf: safari-bild <url> <breite> <höhe> <skript.js|-> <bild.png> [daten.json]\n".data(using: .utf8)!)
  exit(1)
}
let url = URL(string: a[1])!
let width = Double(a[2])!
var height = Double(a[3])!
let jsPath = a[4]
let outPNG = a[5]
let outJSON: String? = a.count > 6 ? a[6] : nil

final class Bild: NSObject, WKNavigationDelegate {
  var web: WKWebView!
  var win: NSWindow!
  var done = false

  func start() {
    web = WKWebView(frame: NSRect(x: 0, y: 0, width: width, height: height), configuration: WKWebViewConfiguration())
    web.customUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15"
    win = NSWindow(contentRect: web.frame, styleMask: [.borderless], backing: .buffered, defer: false)
    win.contentView = web
    win.alphaValue = 0.01
    win.setFrameOrigin(NSPoint(x: 0, y: 0))
    win.orderFrontRegardless()
    web.navigationDelegate = self
    web.load(URLRequest(url: url))
    DispatchQueue.main.asyncAfter(deadline: .now() + 60) {
      if !self.done { FileHandle.standardError.write("Zeit abgelaufen\n".data(using: .utf8)!); exit(2) }
    }
  }

  func webView(_ w: WKWebView, didFinish n: WKNavigation!) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 4) { self.run() }
  }

  func run() {
    let js = jsPath == "-" ? "await document.fonts.ready; return null;" : (try! String(contentsOfFile: jsPath, encoding: .utf8))
    web.callAsyncJavaScript(js, arguments: [:], in: nil, in: .page) { res in
      var data: Any? = nil
      switch res {
      case .success(let v):
        if let d = v as? [String: Any] {
          if let h = d["height"] as? Double { height = h }
          data = d["data"]
        }
      case .failure(let e):
        FileHandle.standardError.write("Skriptfehler: \(e)\n".data(using: .utf8)!); exit(3)
      }
      self.web.setFrameSize(NSSize(width: width, height: height))
      self.win.setContentSize(NSSize(width: width, height: height))
      DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { self.shoot(data) }
    }
  }

  func shoot(_ data: Any?) {
    let cfg = WKSnapshotConfiguration()
    cfg.rect = NSRect(x: 0, y: 0, width: width, height: height)
    cfg.afterScreenUpdates = true
    web.takeSnapshot(with: cfg) { img, err in
      guard let img = img, let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        FileHandle.standardError.write("Bild fehlgeschlagen: \(String(describing: err))\n".data(using: .utf8)!); exit(4)
      }
      let rep = NSBitmapImageRep(cgImage: cg)
      try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: outPNG))
      if let o = outJSON, let d = data { try! JSONSerialization.data(withJSONObject: d).write(to: URL(fileURLWithPath: o)) }
      print("ok \(cg.width)x\(cg.height), Maßstab \(self.win.backingScaleFactor)")
      self.done = true
      exit(0)
    }
  }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let bild = Bild()
bild.start()
app.run()
