import React from 'react';
import { Line } from "react-chartjs-2";
import {connect, sendMsg} from "../connection/api";

class Home extends React.Component {
  state = {
    valorEditor1: " ",
    codigoDesanidado: "",
    valorEditor3D: " ",
    textot: '',
    encabezado: '',
    codigo3d: '',
    codigooptimizado:'',
    data: {
      labels: ["60", "50", "40", "30", "20", "10", "0"],
      datasets: [
        {
          label: "My First dataset",
          // fill: false,
          // lineTension: 0.1,
          // backgroundColor: "rgba(75,192,192,0.4)",
          // borderColor: "rgba(75,192,192,1)",
          // borderCapStyle: "butt",
          // borderDash: [],
          // borderDashOffset: 0.0,
          // borderJoinStyle: "miter",
          // pointBorderColor: "rgba(75,192,192,1)",
          // pointBackgroundColor: "#fff",
          // pointBorderWidth: 1,
          // pointHoverRadius: 5,
          // pointHoverBackgroundColor: "rgba(75,192,192,1)",
          // pointHoverBorderColor: "rgba(220,220,220,1)",
          // pointHoverBorderWidth: 2,
          // pointRadius: 1,
          // pointHitRadius: 10,
          data: [26, 30, 40, 55, 60, 45]
        }
      ]
    }
  };

  componentDidMount(){
    connect((msg) => {
      console.log("New Message from Server: ");
      console.log(msg);
      /*this.setState(prevState => ({
        chatHistory: [...this.state.chatHistory, msg.data]
      }))
      console.log("STATE");
      console.log(this.state);*/
    });
  }


  render() {

    return (
      <div className="container">
        
        <h2>Line Example</h2>
        <Line ref="chart" data={this.state.data} />

      </div>
    );
  }
}



export default Home