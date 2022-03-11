import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export default function Sockets() {

  const [mysock, setMysock] = useState(null)
  const [txt, setTxt] = useState("")
  const [msgs, setMsgs] = useState([])
  const [mousePos, setMousePos] = useState({
    left:0,
    top:0
  })

  const [users, setUsers] = useState({})
  useEffect(()=>{
    // const socket = io("ws://example.com/my-namespace", {
    //   reconnectionDelayMax: 10000,
    //   auth: {
    //     token: "123"
    //   },
    //   query: {
    //     "my-key": "my-value"
    //   }
    // });

  
    // const socket = io("http://localhost:8888")
    const socket = io("https://quotinator1.herokuapp.com/")
    socket.on("init_user", (users)=>{
      //set user to object so you store the users
      console.log(users)
      setUsers(users)
    })
    socket.on("update_mouse", (x, y)=>{
      setMousePos({
        left:x,
        top:y
      })
    })
    socket.on("joined", (id, txt)=>{
      // alert(`${id} says ${txt}`)
      /* const new_msgs = [
          ...msgs,
           `${id} says ${txt}`
          setMsgs(new_msgs)
      ]
      */
      setMsgs((prev)=>([
        ...prev,
        `${id} says ${txt}`
      ]))
    })
    setMysock(socket)
  }, [])

  const emitToIO = async ()=>{
    if(mysock !== null){
      mysock.emit("user_ready", txt)
    }
  }

  const emitMouseMove = async (x, y) => {
    console.log(x, y)
    if(mysock !== null){
      mysock.emit('mouse_xy', x, y)
    }
  }
  const colors =["green", "blue", "teal", "aqua", "yellow"]
  return (
    <div style={{height:"100vh"}} 
    onMouseMove={(e)=>emitMouseMove(e.clientX, e.clientY)}>
      {Object.values(users).map((o,i)=><div key={i} style={{
        position:"fixed",
        left:o.left,
        top:o.top,
        width:10,
        height:10,
        background:colors[i%5]
      }}>

      </div>)}
  
      <input type='text' onChange={(e)=> setTxt(e.target.value)}></input>
      {msgs.map((o,i)=><div key={i} style={{background:"teal", padding:10}}>{o}</div>)}
      <button onClick={emitToIO}>Join and Aleart</button>
    </div>
  )
}
