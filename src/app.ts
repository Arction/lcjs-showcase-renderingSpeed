import {
    disableThemeEffects,
    emptyFill,
    lightningChart,
    Themes,
    UIElementBuilders,
    UILayoutBuilders,
    UIOrigins,
} from '@lightningChart/lcjs'

// Use theme if provided
const urlParams = new URLSearchParams(window.location.search)
const theme = Themes[urlParams.get('theme') as keyof Themes] || Themes.darkGold

const dataAmountNumber = 5 * 1000 * 1000
const dataAmountString = `${dataAmountNumber / 10 ** 6}M`

const chart = lightningChart({
    resourcesBaseUrl: `${window.location.origin}${window.location.pathname}resources`,
})
    .ChartXY({
        container: document.getElementById('chart-container') as HTMLDivElement,
        // NOTE: Effects are implemented quite performantly, but regardless, best performance is got without them.
        theme: disableThemeEffects(theme),
        animationsEnabled: false,
    })
    .setTitleFillStyle(emptyFill)
    .setPadding({ right: 40 })

const axisX = chart.getDefaultAxisX().setInterval({ start: 0, end: dataAmountNumber + 1 })
const axisY = chart.getDefaultAxisY()

const series = chart
    .addPointLineAreaSeries({
        dataPattern: 'ProgressiveX',
    })
    .setAreaFillStyle(emptyFill)
    .setMaxSampleCount(dataAmountNumber)

const uiLayout = chart.addUIElement(UILayoutBuilders.Column, { x: axisX, y: axisY }).setOrigin(UIOrigins.LeftTop)
const positionUiLayout = () => {
    uiLayout.setPosition({
        x: axisX.getInterval().start,
        y: axisY.getInterval().end,
    })
}
positionUiLayout()
axisX.addEventListener('intervalchange', positionUiLayout)
axisY.addEventListener('intervalchange', positionUiLayout)

const labelGenerate = uiLayout.addElement(UIElementBuilders.TextBox).setText(`Generating ${dataAmountString} data points...`)
const labelGenerateResult = uiLayout
    .addElement(UIElementBuilders.TextBox)
    .setText(``)
    .setTextFont((font) => font.setWeight('bold').setSize(12))
const labelRender = uiLayout.addElement(UIElementBuilders.TextBox).setText(``)
const labelRenderResult = uiLayout
    .addElement(UIElementBuilders.TextBox)
    .setText(``)
    .setTextFont((font) => font.setWeight('bold').setSize(12))
const labelSubsequentRender = uiLayout.addElement(UIElementBuilders.TextBox).setText(``)
const labelSubsequentRenderResult = uiLayout
    .addElement(UIElementBuilders.TextBox)
    .setText(``)
    .setTextFont((font) => font.setWeight('bold').setSize(12))

const t0 = window.performance.now()
new Promise<[Float64Array, Float64Array]>((resolve) => {
    const xs: Float64Array = new Float64Array(dataAmountNumber)
    const ys: Float64Array = new Float64Array(dataAmountNumber)
    let prev = 0
    for (let i = 0; i < dataAmountNumber; i += 1) {
        const y = prev + (Math.random() * 2 - 1)
        xs[i] = i
        ys[i] = y
        prev = y
    }
    resolve([xs, ys])
}).then((data) => {
    const t1 = window.performance.now()
    const dGenerateData = t1 - t0
    labelGenerate.setText(`Generate ${dataAmountString} data points`)
    labelGenerateResult.setText(`${Math.round(dGenerateData)} ms`)
    labelRender.setText(`Render first frame with data`)

    requestAnimationFrame(() => {
        const t2 = window.performance.now()
        series.appendSamples({ xValues: data[0], yValues: data[1] })
        requestAnimationFrame(() => {
            const t4 = window.performance.now()
            const dRenderFrame = t4 - t2
            labelRenderResult.setText(`${Math.round(dRenderFrame)} ms`)
            requestAnimationFrame(() => {
                const t5 = window.performance.now()
                const dRenderSubsequentFrame = t5 - t4
                labelSubsequentRender.setText(`Render subsequent frame`)
                labelSubsequentRenderResult.setText(`${Math.round(dRenderSubsequentFrame)} ms`)
            })
        })
    })
})
