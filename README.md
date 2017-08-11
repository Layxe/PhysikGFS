# Simulationsprogramm physikalsicher Wellen
Das Programm dient zur Darstellung verschiedenster Wellen und Schwingungen

---

## Technische Informationen
Das Programm wurde in Javascript mit dem ES6 Standart geschrieben. Um diesen Code für jeden Browser zugänglich zu machen wird er mit Babel, sowie Browserify in alte
Standarts übersetzt und in eine Datei /build/src/js/main.js zusammengefügt. Zum Debuggen eignet sich die Datei /build/src/js/main-debug.js .
Diese Kompilierung / Übersetzung wird durch eine Gulpjs Pipeline vereinfacht. Um lokal die Dateien zu editieren muss also Gulp aktiviert werden

> gulp

Der 'default' Task überprüft hierbei ob die Datein in src/ und src/lib/ verändert wurden und führt davon ausgehend beim Speichern den 'build' Task aus

## Funktionen
- Grafische Darstellung einer 1 dimensionalen transversal Welle
- Überlagerung beliebig vieler Wellen
- Darstellung der Wellen mit Hilfe des Zeigermodells 
- Änderung der Amplitude, Frequenz, Ausbreitungsgeschwindigkeit und Phasenverschiebung
- Benutzerfreundliche Oberfläche
## Anforderungen
- Javascriptfähiger Browser
## Geplante Funktionen
- Benutzerfreundliche Oberfläche
  - Änderung der Überlagerung
- Ausgearbeitetes Zeigermodell
- Darstellung longitudinaler Wellen
- Reflexion an losem sowie festem Ende
- ( Darstellung 2 dimensionaler Wellen )
## Live Demo
[Demo](https://alx0.lima-city.de/)
