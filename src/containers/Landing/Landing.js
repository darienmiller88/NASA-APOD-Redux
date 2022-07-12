import React, { useEffect, useState } from 'react'
import "./Landing.scss"

export default function Landing() {
    const [nasaData, setNasaData] = useState({})
    const [date, setDate] = useState("")
    const [isErrorMessage, setIsErrorMessage] = useState(false)
    const [nasaErrorMessage, setNasaErrorMessage] = useState("")

    useEffect(() => {
        (async () => {
            document.title = "Nasa App"
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_API_KEY}`)
            const result = await response.json()

            setDate(new Date().toLocaleDateString('en-CA'))
            setNasaData(result)
        })()
    }, [])
 
    const getNasaData = async () => {
        try {
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_API_KEY}&date=${date}`)
            const result = await response.json()
            
            if(result.code === 400){
                setIsErrorMessage(true)
                setNasaErrorMessage(result.msg)
                setTimeout(() => {
                    setIsErrorMessage(false)
                    setNasaErrorMessage("")
                }, 3000)

                return
            }

            console.log("res:", result);
            setNasaData(result)
        } catch (error) {
            console.log("error:", error);
        }
    }

    const changeDate = (e) => {
        setDate(e.target.value)
    }

    return (
            
        <div className='landing'>
            <div className='nasa-data'>
                {
                    nasaData["media_type"] === "image"
                    ?
                    <img src={nasaData["hdurl"]} alt='nasa'/>
                    :
                    <iframe src={nasaData["hdurl"]} title="nasa-video"/>
                }
                <div className='information'>
                    <div className='title-wrapper'>
                        <div className='title'>{nasaData["title"]}</div> 
                        <div className='date'>{nasaData["date"]}</div>
                    </div>
                    <div className='explanation'>{nasaData["explanation"]}</div>
                    {
                        isErrorMessage 
                        ?
                        <div className="error-message">{nasaErrorMessage}</div>
                        :
                        <div className='input-wrapper'>
                            <input type="date" id="start" name="trip-start" max={date} value={date} onChange={changeDate}></input>
                            <button onClick={getNasaData}>Search Nasa Data</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
