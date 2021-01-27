import { lightningChart, emptyFill, DataPatterns, Point, UILayoutBuilders, UIBackgrounds, UIOrigins, UIDraggingModes, SolidFill, ColorHEX, emptyLine, UIElementBuilders, Themes, UIRectangle, UIElementColumn, UITextBox, UICheckBox } from "@arction/lcjs"
import { createProgressiveTraceGenerator } from "@arction/xydata"

// Use theme if provided
const urlParams = new URLSearchParams(window.location.search);
let theme = Themes.dark
if (urlParams.get('theme') == 'light')
    theme = Themes.light

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

const container = document.getElementById( 'chart-container' ) as HTMLDivElement
// Create Chart.
const chart = lightningChart().ChartXY({
    theme,
    container
})
    // Hide title.
    .setTitleFillStyle( emptyFill )
    // Minimize paddings.
    .setPadding({ left: 0, bottom: 0, right: 30, top: 10 })

// Hide Chart with CSS until data is ready for rendering.
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
    
        series.add( data )
    
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
const indicatorLayout = chart.addUIElement<UIElementColumn<UIRectangle>>(
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
        .setFillStyle( new SolidFill({ color: theme.chartBackgroundFillStyle.get('color').setA(150) }) )
        .setStrokeStyle( emptyLine )
    )
// Reposition indicators whenever Axis scale is changed (to keep position static).
const repositionIndicator = () =>
    indicatorLayout.setPosition({ x: axisX.scale.getInnerStart(), y: axisY.scale.getInnerEnd() })
repositionIndicator()
axisX.onScaleChange( repositionIndicator )
axisY.onScaleChange( repositionIndicator )
// Rendering speed indicator.
const indicatorRenderingSpeed = indicatorLayout.addElement<UITextBox<UIRectangle>>( UIElementBuilders.TextBox )
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
const buttonRerender = indicatorLayout.addElement<UICheckBox<UIRectangle>>( UIElementBuilders.ButtonBox )
    .setText( 'Render again' )
    .setMargin({ left: 10 })
buttonRerender.onSwitch((_, state) => {
    if ( state ) {
        reRender()
    }
})
