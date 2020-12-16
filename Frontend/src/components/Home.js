import React from 'react';

class Home extends React.Component {
  state = {
    data: []
  };

  componentDidMount() {
    /*connect((msg) => {
      console.log("New Message from Server: ");
      let inforam = JSON.parse(msg.data);
      console.log(inforam.MUso);
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