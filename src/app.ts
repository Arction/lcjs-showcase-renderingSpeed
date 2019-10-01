import { lightningChart, emptyFill, DataPatterns, Point, UILayoutBuilders, UIBackgrounds, UIOrigins, UIDraggingModes, SolidFill, ColorHEX, emptyLine, UIElementBuilders } from "@arction/lcjs"
import { createProgressiveTraceGenerator } from "@arction/xydata"

let dataAmount = 1 * 1000 * 1000

// Generate random data using 'xydata' library.
let data: Point[]
const generateData = ( amount: number, after: () => void ) => {
    createProgressiveTraceGenerator()
        .setNumberOfPoints( amount + 1 )
        .generate()
        .toPromise()
        .then((generatedData) => {
            data = generatedData
            after()
        })
}
generateData( dataAmount, () => {
    measureRenderingSpeed()
} )

// Create Chart.
const containerId = 'chart-container'
const chart = lightningChart().ChartXY({
    containerId
})
    // Hide title.
    .setTitleFillStyle( emptyFill )
    // Minimize paddings.
    .setPadding({ left: 0, bottom: 0, right: 30, top: 10 })

// Hide Chart with CSS until data is ready for rendering.
const container = document.getElementById( containerId )
container.style.width = '0'

// Disable scrolling animations to view loaded data instantly.
const axisX = chart.getDefaultAxisX()
    .setAnimationScroll( undefined )
const axisY = chart.getDefaultAxisY()
    .setAnimationScroll( undefined )

const series = chart.addLineSeries({
    // Specifying progressive DataPattern enables some otherwise unusable optimizations.
    dataPattern: DataPatterns.horizontalProgressive
})

const measureRenderingSpeed = () => {
    // Sync with next animation frame for correct time measurement.
    requestAnimationFrame(() => {
        // Show chart.
        container.style.width = '100%'
        indicatorRenderingSpeed.setText('Rendering ...')

        // Measure time required to render supplied data.
        const tStart = window.performance.now()
    
        const dataN = data.slice( 0, dataAmount )
        series.add( dataN )
    
        // Subscribe to next animation frame to know how long it took to render.
        requestAnimationFrame(() => {
            const tNow = window.performance.now()
            const delay = tNow - tStart
            // Display result using UI indicator.
            indicatorRenderingSpeed.setText(`Rendering speed (${(dataAmount / (1 * 1000 * 1000)).toFixed(1)}M data-points): ${delay.toFixed(0)} ms`)
        })
    })
}

// Create indicator for displaying rendering speed.
const indicatorLayout = chart.addUIElement(
    UILayoutBuilders.Column
        .setBackground( UIBackgrounds.Rectangle ),
    // Position UIElement with Axis coordinates.
    {
        x: axisX.scale,
        y: axisY.scale
    }
)
    .setOrigin( UIOrigins.LeftTop )
    .setDraggingMode( UIDraggingModes.notDraggable )
    // Set dark, tinted Background style.
    .setBackground(( background ) => background
        .setFillStyle( new SolidFill({ color: ColorHEX('#000').setA(150) }) )
        .setStrokeStyle( emptyLine )
    )
// Reposition indicators whenever Axis scale is changed (to keep position static).
const repositionIndicator = () =>
    indicatorLayout.setPosition({ x: axisX.scale.getInnerStart(), y: axisY.scale.getInnerEnd() })
repositionIndicator()
axisX.onScaleChange( repositionIndicator )
axisY.onScaleChange( repositionIndicator )
// Rendering speed indicator.
const indicatorRenderingSpeed = indicatorLayout.addElement( UIElementBuilders.TextBox )
    .setText( 'Rendering ...' )
    .setFont(( font ) => font
        .setWeight( 'bold' )
    )

// Create button for rendering and measuring again.
const reRender = () => {
    series
        .clear()
    indicatorRenderingSpeed
        .setText( 'Rendering ...' )

    measureRenderingSpeed()
}
const buttonRender1M = indicatorLayout.addElement( UIElementBuilders.ButtonBox )
    .setText( 'Render 1M' )
    .setMargin({ left: 10 })
buttonRender1M.onSwitch((_, state) => {
    if ( state ) {
        dataAmount = 1 * 1000 * 1000
        reRender()
    }
})
const buttonRender10M = indicatorLayout.addElement( UIElementBuilders.ButtonBox )
    .setText( 'Render 10M' )
    .setMargin({ left: 10 })
let generating10M = false
buttonRender10M.onSwitch((_, state) => {
    if ( state && !generating10M ) {
        // Generate 10M data.
        generating10M = true
        buttonRender10M.setText('Generating 10M random data-points...')
        generateData( 10 * 1000 * 1000, () => {
            dataAmount = 10 * 1000 * 1000
            reRender()

            buttonRender10M
                .setText( 'Render 10M' )
                .onSwitch((_, state) => {
                    if ( state ) {
                        dataAmount = 10 * 1000 * 1000
                        reRender()
                    }
                })
        } )
    }
})
