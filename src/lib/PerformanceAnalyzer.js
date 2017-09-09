import World from './World.js'

/*
 * Eine Welle besteht aus mehreren Punkte die abhängig von einander unterschiedliche
 * Werte zugewiesen bekommen. Die Anzahl der Punkte hängt von dieser Variable ab.
 * Dies bedeuetet, dass bei 1 jedes Pixel einen Punkt zugewiesen bekommt.
 * Bei 2 nur jedes zweite Pixel etc.
 */

export let RESOLUTION = 1

/**
 * Analysiere die Leistung des Rechners und passe abhängig von der
 * Leistungsfähigkeit das Programm an.
 * Falls der Rechner nicht leistungsstark genug ist um die Welle in
 * aktzeptabler Zeit darzustellen wird die schärfe der Darstellung herunter
 * gedreht und somit der Rechenprozess vereinfacht
 * 
 * @export
 * @class PerformanceAnalyzer
 */

export class PerformanceAnalyzer {

    /**
     * Analyisiere die ungefähre Rechenleistung ( sehr primitiv )
     * 
     * @private
     * @static
     * @memberof PerformanceAnalyzer
     */

    static _checkPerformance() {

        let a = 0;

        for(var i = 0; i < 50000; i++) {
            
            a += Math.random()*2

        }

    }

    /**
     * Analysiere 10x die Rechenleistung und bilde den Mittelwert
     * 
     * @static
     * @memberof PerformanceAnalyzer
     */

    static execute() {

        // Initialisierung

        PerformanceAnalyzer.FPS = 0
        PerformanceAnalyzer.oldTime = new Date().getTime()
        PerformanceAnalyzer.averageFPS = 60
        
        // Messung der durchschnittlichen Leistung
        PerformanceAnalyzer.performanceScore = 0

        for(var i = 0; i < 10; i++) {

            let time = new Date().getTime()
            PerformanceAnalyzer._checkPerformance()
            PerformanceAnalyzer.performanceScore += new Date().getTime() - time

        }

        RESOLUTION = Math.round(PerformanceAnalyzer.performanceScore / 15)

        if(RESOLUTION <= 0) {
            RESOLUTION = 1
        }

    } 

    /**
     * Messe die Bilder pro Sekunde und passe das Programm dynamisch an,
     * falls ein Einbruch der Bildrate erkennbar wird
     * 
     * @static
     * @memberof PerformanceAnalyzer
     */

    static update() {

        PerformanceAnalyzer.FPS += 1;

        if(new Date().getTime() > PerformanceAnalyzer.oldTime + 1000) {

            document.getElementById('info-log').innerHTML = `FPS: ${PerformanceAnalyzer.FPS} at ${RESOLUTION}`

            PerformanceAnalyzer.averageFPS = PerformanceAnalyzer.FPS

            PerformanceAnalyzer.optimizeProgram()

            PerformanceAnalyzer.FPS = 0
            PerformanceAnalyzer.oldTime = new Date().getTime()

        }

    }

    static optimizeProgram() {

        if(PerformanceAnalyzer.averageFPS < 35 && RESOLUTION < 10) {

            RESOLUTION += 1
            World.reInit()

        } else if(PerformanceAnalyzer.averageFPS > 52 && RESOLUTION > 1) {

            RESOLUTION -= 1
            World.reInit()

        }

    }

}