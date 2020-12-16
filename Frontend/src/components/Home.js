import React from 'react';
class Home extends React.Component {
  state = {
    data : [ ]
  };

  componentDidMount() {
    /*connect_cpu((msg) => {
      console.log("New Message from Server, CPU: ");
      let infoCPU = JSON.parse(msg.data);
      console.log(infoCPU);
      //console.log("STATE: ");

      this.setState(prevState => ({
        data: [...prevState.data,{name:0,ram:inforam.MUso}]
      }))
      console.log("STATE");
      console.log(this.state);
    });*/
  }


  render() {

    return (
      <div className="container">

        <h2>Procesos</h2>
       

      </div>
    );
  }
}



export default Home