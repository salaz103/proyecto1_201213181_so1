import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { connect_cpu, sendMsg } from "../connection/api";


class MonitorCPU extends React.Component {
  state = {
    data: [],
    porcentajeUtilizacion:0
  };

  componentDidMount() {
    connect_cpu((msg) => {
      console.log("New Message from Server, CPU: ");
      let infoCPU = JSON.parse(msg.data);
      console.log(infoCPU);
      let porcentaje= (infoCPU.CPU_1+infoCPU.CPU_2+infoCPU.CPU_3+infoCPU.CPU_4)/(4);
      //console.log("STATE: ");

      this.setState(prevState => ({
        data: [...prevState.data, { name: 0, cpu1: infoCPU.CPU_1, cpu2: infoCPU.CPU_2, cpu3: infoCPU.CPU_3, cpu4: infoCPU.CPU_4 }],
        porcentajeUtilizacion: porcentaje
      }))
      /*console.log("STATE");
      console.log(this.state);*/
    });
  }


  render() {

    return (
      <div>

        <h2 className="header__subtitle2">Monitor CPU</h2>

        <div className="container-inline2">
          <LineChart width={1000} height={500} data={this.state.data} margin={{ top: 5, right: 5, bottom: 70, left: 15 }}>
            <CartesianGrid stroke="white" strokeDasharray="5 5" />
            <XAxis dataKey="cpu" label={{ value: 'Segundos', position: 'bottom', fill: "white" }} stroke="white" />
            <YAxis label={{ value: '%', angle: -90, position: 'left', fill: "white" }} stroke="white" />
            <Tooltip />
            <Legend  verticalAlign="top" height={36} iconSize={25}/>
            <Line type="monotone" dataKey="cpu1" strokeWidth={5} stroke="#fc2e17" />
            <Line type="monotone" dataKey="cpu2" strokeWidth={5} stroke="#ff7700" />
            <Line type="monotone" dataKey="cpu3" strokeWidth={5} stroke="#ffea00" />
            <Line type="monotone" dataKey="cpu4" strokeWidth={5} stroke="#2ea10b" />
          </LineChart>

          <div>
            <h2>Porcentaje de CPU utilizado</h2><br></br>
            <h3>{this.state.porcentajeUtilizacion}%</h3><br></br>
          </div>

        </div>

      </div>
    );
  }
}


export default MonitorCPU