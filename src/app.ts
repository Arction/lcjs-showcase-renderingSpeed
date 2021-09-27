import { lightningChart, emptyFill, Point, UILayoutBuilders, UIBackgrounds, UIOrigins, UIDraggingModes, SolidFill, emptyLine, UIElementBuilders, Themes, UIRectangle, UIElementColumn, UITextBox, UICheckBox } from "@arction/lcjs"
import { createProgressiveTraceGenerator } from "@arction/xydata"

// Use theme if provided
const urlParams = new URLSearchParams(window.location.search);
let theme = Themes.darkGold
if (urlParams.get('theme') == 'light')
    theme = Themes.lightNew

let dataAmount = 1 * 1000 * 1000

// Generate random data using 'xydata' library.
let data: Point[]
const generateData = (amount: number, after: () => void) => {
    createProgressiveTraceGenerator()
        .setNumberOfPoints(amount + 1)
        .generate()
        .toPromise()
        .then((generatedData) => {
            data = generatedData
            after()
        })
}
generateData(dataAmount, () => {
    measureRenderingSpeed()
})

const container = document.getElementById('chart-container') as HTMLDivElement
// Create Chart.
const chart = lightningChart().ChartXY({
    theme,
    container
})
    // Hide title.
    .setTitleFillStyle(emptyFill)
    // Minimize paddings.
    .setPadding({ left: 0, bottom: 0, right: 30, top: 10 })

// Hide Chart with CSS until data is ready for rendering.
container.style.width = '0'

// Disable scrolling animations to view loaded data instantly.
const axisX = chart.getDefaultAxisX()
    .setAnimationScroll(undefined)
const axisY = chart.getDefaultAxisY()
    .setAnimationScroll(undefined)

const series = chart.addLineSeries({
    // Specifying progressive DataPattern enables some otherwise unusable optimizations.
    dataPattern: {
        pattern: 'ProgressiveX'
    }
})

const measureRenderingSpeed = () => {
    // Sync with next animation frame for correct time measurement.
    requestAnimationFrame(() => {
        // Show chart.
        container.style.width = '100%'
        indicatorRenderingSpeed.setText('Rendering ...')

        // Measure time required to render supplied data.
        const tStart = window.performance.now()

        series.add(data)

        // Subscribe to next animation frame to know how long it took to render.
        requestAnimationFrame(() => {
            const tNow = window.performance.now()
            const delay = tNow - tStart
            // Display result using UI indicator.
            indicatorRenderingSpeed.setText(`${(delay / 1000).toFixed(3)} seconds`)
        })
    })
}

// Create indicator for displaying rendering speed.
const indicatorLayout = chart.addUIElement<UIElementColumn<UIRectangle>>(
    UILayoutBuilders.Column
        .setBackground(UIBackgrounds.Rectangle),
    // Position UIElement with Axis coordinates.
    {
        x: axisX,
        y: axisY
    }
)
    .setOrigin(UIOrigins.LeftTop)
    .setDraggingMode(UIDraggingModes.notDraggable)

// Reposition indicators whenever Axis scale is changed (to keep position static).
const repositionIndicator = () =>
    indicatorLayout.setPosition({ x: axisX.getInterval().start, y: axisY.getInterval().end })
repositionIndicator()
axisX.onScaleChange(repositionIndicator)
axisY.onScaleChange(repositionIndicator)

indicatorLayout.addElement<UITextBox>(UIElementBuilders.TextBox)
    .setText(`Rendering speed ${(dataAmount / (1 * 1000 * 1000)).toFixed(1)} million data points:`)

// Rendering speed indicator.
const indicatorRenderingSpeed = indicatorLayout.addElement<UITextBox>(UIElementBuilders.TextBox)
    .setTextFont((font) => font
        .setWeight('bold')
    )

// Create button for rendering and measuring again.
const reRender = () => {
    series
        .clear()
    indicatorRenderingSpeed
        .setText('Rendering ...')

    measureRenderingSpeed()
}
const buttonRerender = indicatorLayout.addElement(UIElementBuilders.ButtonBox)
    .setText('Render again')
    .setMargin({ left: 10 })
buttonRerender.onSwitch((_, state) => {
    if (state) {
        reRender()
    }
})
