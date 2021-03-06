# Simulationsprogramm physikalsicher Wellen
Das Programm dient zur Darstellung verschiedenster Wellen und Schwingungen

---

## Programm installieren
Zum Installieren müssen Sie nur den ./build Ordner herunterladen und die index.html Datei in Ihrem Browser der Wahl öffnen

## Technische Informationen
Das Programm wurde in Javascript mit dem ES6 Standart geschrieben. Um diesen Code für jeden Browser zugänglich zu machen wird er mit Babel, sowie Browserify in alte
Standarts übersetzt und in eine Datei /build/src/js/main.js zusammengefügt. Zum Debuggen eignet sich die Datei /build/src/js/main-debug.js .
Diese Kompilierung / Übersetzung wird durch eine Gulpjs Pipeline vereinfacht. Um lokal die Dateien zu editieren muss also Gulp aktiviert werden

> $ gulp

Gulp muss davor natürlich installiert werden, dies geschieht mit diesem Befehl ( benötigt wird ebenso NodeJS sowie NPM )

> $ npm install --global gulp-cli

Der 'default' Task überprüft hierbei ob die Datein in src/ und src/lib/ verändert wurden und führt davon ausgehend beim Speichern den 'build' Task aus

## Funktionen
- Grafische Darstellung einer 1 dimensionalen transversalen sowie longitudinalen Welle
- Überlagerung beliebig vieler Wellen
- Darstellung der Wellen mit Hilfe des Zeigermodells 
- Änderung der Amplitude, Frequenz, Ausbreitungsgeschwindigkeit und Phasenverschiebung
- Benutzerfreundliche Oberfläche
- Reflektion transversaler Wellen am losen sowie festen Ende
## Anforderungen
- Javascriptfähiger Browser
## Geplante Funktionen
-
## Live Demo
[Demo](http://31.214.243.205/PhysikGFS/)
