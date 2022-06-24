import React, {useState} from "react"

const Homepage = () => {
    const [message, setMessage] = useState("")

    const generateAndLoopString = () => {

        const randomString = Math.random().toString(12)
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds;
        var dateTime = date+' '+time;
        console.log(dateTime + ": " + randomString)
        setMessage(dateTime + ": " + randomString)
        setTimeout(generateAndLoopString,5000)
      }
      
      generateAndLoopString()

    return(
    <div>
        <h1>Hello World, Koa folks!</h1>
        <p>{message}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
    </div>)
}

export default Homepage