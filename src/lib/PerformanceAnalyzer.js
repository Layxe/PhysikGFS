export let RESOLUTION = 1

export class PerformanceAnalyzer {

    static _checkPerformance() {

        let a = 0;

        for(var i = 0; i < 50000; i++) {
            
            a += Math.random()*2

        }

    }

    static execute() {

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

}