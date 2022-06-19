const generateAndLoopString = () => {

    const randomString = Math.random().toString(12)
    console.log(randomString)
    setTimeout(generateAndLoopString,5000)
}

generateAndLoopString()