import { emptyFill, lightningChart, Themes, UIElementBuilders, UILayoutBuilders, UIOrigins } from "@arction/lcjs";
import { createProgressiveTraceGenerator } from "@arction/xydata";

// Use theme if provided
const urlParams = new URLSearchParams(window.location.search);
let theme = Themes[urlParams.get("theme") as keyof Themes] || Themes.darkGold;

const dataAmountNumber = 5 * 1000 * 1000
const dataAmountString = `${dataAmountNumber / 10 ** 6}M`

const chart = lightningChart().ChartXY({
    container: document.getElementById('chart-container') as HTMLDivElement,
    theme
})
    .setTitleFillStyle(emptyFill)
    .setPadding({right: 40})

const axisX = chart.getDefaultAxisX()
const axisY = chart.getDefaultAxisY()

const series = chart.addLineSeries({
    dataPattern: {
        pattern: 'ProgressiveX',
        regularProgressiveStep: true,
    }
})

const uiLayout = chart.addUIElement(UILayoutBuilders.Column, {x: axisX, y: axisY})
    .setOrigin(UIOrigins.LeftTop)

const positionUiLayout = () => {
    uiLayout.setPosition({
        x: axisX.getInterval().start, 
        y: axisY.getInterval().end
    })
}
positionUiLayout()
axisX.onIntervalChange(positionUiLayout)
axisY.onIntervalChange(positionUiLayout)

const labelGenerate = uiLayout.addElement(UIElementBuilders.TextBox).setText(`Generating ${dataAmountString} data points...`)
const labelGenerateResult = uiLayout.addElement(UIElementBuilders.TextBox).setText(``).setTextFont((font) => font.setWeight('bold').setSize(12))
const labelAppend = uiLayout.addElement(UIElementBuilders.TextBox).setText(``)
const labelAppendResult = uiLayout.addElement(UIElementBuilders.TextBox).setText(``).setTextFont((font) => font.setWeight('bold').setSize(12))
const labelRender = uiLayout.addElement(UIElementBuilders.TextBox).setText(``)
const labelRenderResult = uiLayout.addElement(UIElementBuilders.TextBox).setText(``).setTextFont((font) => font.setWeight('bold').setSize(12))
const labelSubsequentRender = uiLayout.addElement(UIElementBuilders.TextBox).setText(``)
const labelSubsequentRenderResult = uiLayout.addElement(UIElementBuilders.TextBox).setText(``).setTextFont((font) => font.setWeight('bold').setSize(12))

const t0 = window.performance.now()
createProgressiveTraceGenerator()
    .setNumberOfPoints(dataAmountNumber)
    .generate()
    .toPromise()
    .then(data => {
        const t1 = window.performance.now()
        const dGenerateData = t1 - t0
        labelGenerate.setText(`Generate ${dataAmountString} data points`)
        labelGenerateResult.setText(`${Math.round(dGenerateData)} ms`)
        labelAppend.setText(`Append ${dataAmountString} data points`)
        labelRender.setText(`Render first frame with data`)

        requestAnimationFrame(() => {
            const t2 = window.performance.now()
            series.add(data)
            axisX.fit(false)
            axisY.fit(false)
            const t3 = window.performance.now()
            const dAppendData = t3 - t2
            labelAppendResult.setText(`${Math.round(dAppendData)} ms`)

            requestAnimationFrame(() => {
                const t4 = window.performance.now()
                const dRenderFrame = t4 - t3
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
