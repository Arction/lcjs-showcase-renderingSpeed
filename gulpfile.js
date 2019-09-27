const fs = require('fs')
const showdown = require('showdown')
const buildOutput = 'dist'

const build = function () {
    return new Promise(( resolve, reject ) => {
        // Convert showcase description markdown to HTML understandable format, and include in build.
        const source = "./README.md"
        const target = `${buildOutput}/description.md`
        fs.readFile( source, (err, buffer) => {
            if ( err )
                reject( err )
            
            let md = buffer.toString()
            // Grab very first line of markdown as "Title".
            const title = md.split('\n')[0]

            // Filter everything out except "Description" chapter.
            md = title + '\n' + getChapterFromMarkdown(
                md,
                /^#+\s+Description/,
            )
        
            const converter = new showdown.Converter()
            converter.setFlavor( 'github' )
            const htmlMd = converter.makeHtml( md )
        
            // Write to build output.
            fs.writeFile( target, htmlMd, (err) => {
                if ( err )
                    reject( err )
                resolve()
            })
        })
    })
}
/**
 * Get a single chapter from markdown.
 * @param   {string}    input       Markdown string.
 * @param   {RegExp}    regExp      Regular expression to look for chapter.
 * @returns {string}                Stripped markdown string.
 */
const getChapterFromMarkdown = (input, regExp) => {
    // Split the input into a easily manageable array.
    let splitInput = input.split('\n')
    let iChapterStart = splitInput.findIndex(( row ) =>
        regExp.test( row )
    )
    // Count amount of #'s in chapter declaration.
    const chapterDepth = 1 + splitInput[ iChapterStart ].lastIndexOf( '#' )
    // Find index of next Chapter with same or lesser amount of #'s.
    let iChapterEnd = -1 + splitInput.findIndex(( row, i ) => {
        if ( i <= iChapterStart )
            return false
            
        for ( let iChar = 0; iChar < row.length; iChar ++ ) {
            if ( row.charAt( iChar ) !== '#' ) {
                if ( iChar > 0 && iChar <= chapterDepth ) {
                    return true
                } else
                    return false
            }
        }
        return false
    })

    // Remove empty lines from stripped chapter.
    iChapterStart += 1
    iChapterEnd -= 1

    // Join lines of Chapter.
    return splitInput.filter((_, i) => i > iChapterStart && i <= iChapterEnd).join('\n')
}

exports.build = build
