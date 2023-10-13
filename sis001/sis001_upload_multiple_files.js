// ==UserScript==
// @name         sis001 upload multiple files
// @namespace    https://github.com/fear1999/tampermonkey-scripts
// @version      0.3
// @description  sis001 upload multiple files
// @author       fear1999
// @match        https://sis001.com/forum/post.php?action=newthread*
// @match        https://sis001.com/forum/post.php?action=edit*
// @match        https://sis001.com/forum/post.php?action=reply*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sis001.com
// @grant        none
// @license MIT
// ==/UserScript==

var origainalInsertAttach

function main() {
    configMultipleInput()
    origainalInsertAttach = this.insertAttach
    this.insertAttach = customInsertAttach
}

function configMultipleInput() {
    console.log('configMultipleInput')
    Array.from(
        document
        .getElementById('posteditor_bottom')
        .getElementsByTagName('input')
    ).forEach((ele) => {
        if (ele.name == 'attach[]') {
            replaceInput(ele, (newInput) => {
                newInput.setAttribute('multiple', 'multiple')
            })
        }
    })
}

function customInsertAttach(id) {
    try {
        console.log('customInsertAttach')
        let input = document.getElementById('attach_' + id)
        let files = input.files
        Array.from(files)
            .forEach((file, index) => {
                let currentId = id + index
                let currentInput = document.getElementById('attach_' + currentId)
                replaceInput(currentInput, (newInput) => {
                    newInput.files = createFileList(file)
                })
                origainalInsertAttach(currentId)
            })
    } catch (e) {
        console.log(e)
    }
}

function replaceInput(old, op) {
    let newInput = old.cloneNode()
    newInput.onchange = old.onchange
    op(newInput)
    old.parentElement.replaceChild(newInput, old)
    return newInput
}

function createFileList(file) {
    let newList = new DataTransfer()
    newList.items.add(file)
    return newList.files
}

main()
