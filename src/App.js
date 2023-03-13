import './App.css';
import { Row, Col, Container, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [arr, setArr] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
  const [gc, setGc] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [turn, setTurn] = useState(false);
  const [won, setWon] = useState(false);
  const [winner, setWinner] = useState('');

  const getProgress = ()=>{
    if(localStorage.getItem("gamecode")!==null){
      axios.get(`http://127.0.0.1:5500/${localStorage.getItem("gamecode")}`)
      .then((res)=>{
        const grid = res.data.data.game[0].grid;
        setArr(grid);
        if(res.data.data.winning!==null){
          console.log('won', res.data.data.turn==='x'?"y":'X');
          setWon(true);
          setWinner(res.data.data.winning);
          localStorage.removeItem("gamecode");
          localStorage.removeItem("val");
          localStorage.removeItem("val");
        }
        // console.log(res.data.data.turn);
        // console.log(res.data.data.turn, localStorage.getItem("val"));
        if(res.data.data.turn===localStorage.getItem("val")){
          setTurn(true);
        }
        else{
          setTurn(false);
        }
        // console.log(grid);
      });
    }
  }

  useEffect(()=>{
    const inv=setInterval(()=>
    {
      getProgress();
    }, 1000);

    return ()=>clearInterval(inv);
  }, [gc]);

  const createNewGame = ()=>{
    axios.get('http://127.0.0.1:5500/new')
    .then((res)=>{
      // console.log(res);
      const gc = res.data.data.gamecode;
      setGc(gc);
      setTurn(true);
      localStorage.setItem('gamecode', gc);
      localStorage.setItem('val', 'x');
      setTurn(true);
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  const joingame = ()=>{
    axios.get('http://127.0.0.1:5500/new')
    .then((res)=>{
      // console.log(res);
      localStorage.setItem('gamecode', gc);
      localStorage.setItem('val', 'o');
      setTurn(false);
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  const change = (x, y)=>{
    if(arr[x][y]!==""){
      return;
    }
    var tarr=[...arr]
    tarr[x][y]=localStorage.getItem("val");
    axios.post("http://127.0.0.1:5500/", 
    {
      gc:localStorage.getItem("gamecode"),
      x:x,
      y:y,
      val:localStorage.getItem("val")
    })
    .then((res)=>{
      setArr(res.data.data.game.grid);
      // console.log(res);
      if(res.data.data.val===localStorage.getItem("val")){
        setTurn(true);
      }
      else{
        setTurn(false);
      }
      if(res.data.data.winning!==null){
        console.log('won', res.data.data.turn==='x'?"y":'X');
        setWon(true);
        setWinner(res.data.data.winning);
        localStorage.removeItem("gamecode");
        localStorage.removeItem("val");
        localStorage.removeItem("val");
      }
    })
    .catch((err)=>{
      console.log(err);
    });
    setArr(tarr)
  }

  return (
    <div className="App">
      <h2 className="mt-1 mb-3">Tic Tac Toe</h2>
      <Button onClick={()=>{createNewGame(); setIsOpen(true);}}>Create new game</Button><br/><br/>
      <input type="text" onChange={(e)=>setGc(e.target.value)}/>
      <Button onClick={joingame}>Join</Button>
      <br />
      <br />
      <h4>{won?winner:''} WON...</h4>
      <br />
      {isOpen && (
        <div className="popup">
          <h4>Share this game code</h4><h3 className="text-success">{gc}</h3>
        </div>
      )}
    <Container className="mt-3">
        <Row>
            <Col className="px-5 py-5" style={{"border":"solid 2px black"}} onClick={()=>turn?change(0, 0):""}><span style={{"z-index":"2"}}>{arr[0][0]}</span></Col>
            <Col className="px-5 py-5" style={{"border":"solid 2px black"}} onClick={()=>turn?change(0, 1):""}><span style={{"z-index":"2"}}>{arr[0][1]}</span></Col>
            <Col className="px-5 py-5" style={{"border":"solid 2px black"}} onClick={()=>turn?change(0, 2):""}><span style={{"z-index":"2"}}>{arr[0][2]}</span></Col>
        </Row>
        <Row>
            <Col className="px-5 py-5" style={{"border":"solid 2px black"}} onClick={()=>turn?change(1, 0):""}><span style={{"z-index":"2"}}>{arr[1][0]}</span></Col>
            <Col className="px-5 py-5" style={{"border":"solid 2px black"}} onClick={()=>turn?change(1, 1):""}><span style={{"z-index":"2"}}>{arr[1][1]}</span></Col>
            <Col className="px-5 py-5" style={{"border":"solid 2px black"}} onClick={()=>turn?change(1, 2):""}><span style={{"z-index":"2"}}>{arr[1][2]}</span></Col>
        </Row>
        <Row>
            <Col className="px-5 py-5" style={{"border":"solid 2px black"}} onClick={()=>turn?change(2, 0):""}><span style={{"z-index":"2"}}>{arr[2][0]}</span></Col>
            <Col className="px-5 py-5" style={{"border":"solid 2px black"}} onClick={()=>turn?change(2, 1):""}><span style={{"z-index":"2"}}>{arr[2][1]}</span></Col>
            <Col className="px-5 py-5" style={{"border":"solid 2px black"}} onClick={()=>turn?change(2, 2):""}><span style={{"z-index":"2"}}>{arr[2][2]}</span></Col>
        </Row>
    </Container>
    </div>
  );
}

export default App;
