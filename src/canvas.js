const cWidth = 900
const cHeight = 600

window.onload = async function () {
    const elemCanvas = document.getElementById("canvas")
    const context = elemCanvas.getContext("2d")

    // init image object
    const imgLen = 12
    const imgArr = await loadImages(imgLen)

    // get current and next imgLength's row and col
    const { row, col } = getCollageSize(imgLen)
    const { nextRow, nextCol } = getCollageSize(imgLen + 1)

    const imgSize = getImgSize(imgArr, row, col)

    // set collage by different types
    if (row !== 0 && col !== 0) {
        // picNum: 1 2 4 6 8 10 12 15 16 20
        setCollageByMainType(context, imgArr, imgSize, row, col, imgSize)
    } else if (imgLen % 2 !== 0 && nextRow !== 0 && nextCol !== 0) {
        // picNum: 3 5 7 11 19
        setCollageBySecType(context, imgArr, imgSize, row, col)
    } else if (imgLen % 9 === 0) {
        // picNum: 9 18
        setCollageByFreeType(context, imgArr, imgSize, row, col)
    } else {
        // picNum: 13 14 17
        setCollageByEmphasizeType(context, imgArr, imgSize, row, col)
    }
}

async function loadImages(imgLen) {
    const imgArr = []
    for (let i = 0; i < imgLen; i++) {
        const imageObj = new Image()
        imageObj.src = `assets/${i + 1}.jpg`
        await imageObj.decode()
        imgArr.push(imageObj)
    }
    return imgArr
}

function getCollageSize(imgLen) {
    const maxPicNumPerRow = 5
    let row = imgLen > 2 ? 2 : 1
    let col = 0

    while (imgLen / row > maxPicNumPerRow) {
        row++
    }

    if (imgLen % row == 0) {
        col = imgLen / row
    }
    return { row, col }
}

function getImgSize(imgArr, row, col) {
    const size = []
    imgArr.forEach((img) => {
        let h = img.height
        let w = img.width
        let resizedH, resizedW = 0

        if (h > w) {
            resizedH = cHeight * 0.9 / row
            resizedW = resizedH * img.width / img.height
        } else {
            resizedW = cWidth * 0.9 / col
            resizedH = resizedW * img.height / img.width
        }
        size.push([resizedW, resizedH])
    })
    return size
}

function drawImage(ctx, img, x, y, imgWidth, imgHeight, angle = 0, scale = 1) {
    let ang = Math.random() < 0.5 ? -angle : angle

    ctx.save();
    ctx.translate(x + imgWidth * scale / 2, y + imgHeight * scale / 2);
    ctx.rotate(ang);
    ctx.translate(- x - imgWidth * scale / 2, - y - imgHeight * scale / 2);
    ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    ctx.restore();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function setCollageByMainType(context, imgArr, imgSize, row, col) {
    const blockWidth = (cWidth - 20) / col
    const blockHeight = (cHeight - 20) / row
    const radian = Math.PI / 180
    var imagePosition = []
    for (let i = 0; i < row; i++) {
        for (let k = 0; k < col; k++) {
            let nextStartX = 10 + (k + 1) * blockWidth
            let nextStartY = 20 + (i + 1) * blockHeight
            let startX = 10 + k * blockWidth
            let startY = 20 + i * blockHeight

            let x = startX + Math.ceil((nextStartX - startX) / 2 - imgSize[i * col + k][0] / 2)
            let y = startY + Math.ceil((nextStartY - startY) / 2 - imgSize[i * col + k][1] / 2)

            imagePosition.push([x, y])
        }
    }

    imgArr.forEach((img, i) => {
        drawImage(context, img, imagePosition[i][0], imagePosition[i][1], imgSize[i][0], imgSize[i][1], getRandomInt(10) * radian)
    })
}

// below functions are not implemented yet
function setCollageBySecType(context, imgArr, imgSize, row, col) {
    // sec type logic
}

function setCollageByFreeType(context, imgArr, imgSize, row, col) {
    // free type logic
}

function setCollageByEmphasizeType(context, imgArr, imgSize, row, col) {
    // emphasize type logic
}
