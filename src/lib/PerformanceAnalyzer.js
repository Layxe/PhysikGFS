import World from './World.js'

export let RESOLUTION = 1

export class PerformanceAnalyzer {

    static _checkPerformance() {

        let a = 0;

        for(var i = 0; i < 50000; i++) {
            
            a += Math.random()*2

        }

    }

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

            console.log('System optimization!')

            RESOLUTION += 1
            World.reInit()

        } else if(PerformanceAnalyzer.averageFPS > 52 && RESOLUTION > 1) {

            RESOLUTION -= 1
            World.reInit()

        }

    }

}