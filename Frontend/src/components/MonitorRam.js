import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { connect, sendMsg } from "../connection/api";

class MonitorRam extends React.Component {
  state = {
    data: [],
    totalram:0,
    totalramconsumida:0,
    porcentajeconsumo:0
  };

  componentDidMount() {
    connect((msg) => {
      console.log("New Message from Server: ");
      let inforam = JSON.parse(msg.data);
      console.log(inforam.MUso);
      //console.log("STATE: ");

      this.setState(prevState => ({
        data: [...prevState.data,{name:0,ram:inforam.MUso}],
        totalram: inforam.MTotal,
        totalramconsumida: inforam.MUso,
        porcentajeconsumo: inforam.MPUso
      }))
      console.log("STATE");
      console.log(this.state);
    });
  }


  render() {

    return (
      <div>

        <h2 className="header__subtitle2">Monitor Memoria Ram</h2>

        <div className="container-inline2">
        <LineChart width={1000} height={500} data={this.state.data} margin={{ top: 5, right: 5, bottom: 20, left: 15 }}>
          <XAxis dataKey="name" label={{ value: 'Segundos', position: 'bottom', fill:"white" }} stroke="white" />
          <YAxis label={{ value: 'MB', angle: -90, position: 'left', fill:"white" }} stroke="white"/>
          <CartesianGrid stroke="white" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="ram" strokeWidth={5} stroke="#6A31C8" />
        </LineChart>

        <div>
        <h2>Total memoria ram del servidor</h2> 
        <h3>{this.state.totalram} MB</h3><br></br>

        <h2>Total de memoria RAM consumida</h2><br></br>
        <h3>{this.state.totalramconsumida} MB</h3><br></br>

        <h2>Porcentaje de consumo de RAM</h2><br></br>
        <h3>{this.state.porcentajeconsumo}%</h3><br></br>
        </div>

        </div>

      </div>
    );
  }
}



export default MonitorRam