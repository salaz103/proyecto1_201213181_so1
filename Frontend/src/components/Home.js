import React from 'react';
import { connect_procesos, sendMsg } from "../connection/api";
import Tree from 'react-animated-tree'
import Table from 'react-bootstrap/Table'


const treeStyles = {
  top: 40,
  left: 40,
  color: 'white',
  fill: 'white',
  width: '100%'
}

const typeStyles = {
  fontSize: '2em',
  verticalAlign: 'middle'
}

class Home extends React.Component {
  state = {
    procesos: [],
    ejecucion: 0,
    suspendidos: 0,
    detenidos: 0,
    zombie: 0,
    otros: 0,
    total: 0
  };

  componentDidMount() {
    connect_procesos((msg) => {
      console.log("New Message from Server, PROCESOS: ");
      let infoCPU = JSON.parse(msg.data);
      console.log(infoCPU.total);
      //console.log("STATE: ");

      this.setState(prevState => ({
        procesos: infoCPU.procesos,
        ejecucion: infoCPU.ejecucion,
        suspendidos: infoCPU.suspendidos,
        detenidos: infoCPU.detenidos,
        zombie: infoCPU.zombies,
        otros: infoCPU.otros,
        total: infoCPU.total
      }))
      console.log("STATE");
      console.log(this.state);
    });
  }




  render() {

    return (
      <div className="container">

        <h2 className="header__subtitle2">Listado de Procesos en Servidor</h2>

        <div className="container-inline2">

          <div>
            <h2>Arból de Procesos</h2>
            <Tree content="Procesos" type="ITEM" canHide open style={treeStyles}>
              {
                this.state.procesos.map((x, i) => {
                  return (
                    <Tree content={x.Nombre} canHide>
                      {x.hijos.map((y) => <Tree content={y.Nombre}></Tree>)}
                    </Tree>
                  )
                })
              }
            </Tree>
          </div>

          <div >
          <h2>Tabla de procesos</h2>
            <table >
              <thead>
                <tr>
                  <th>PID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th> % Uso de RAM</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.procesos.map((x, i) => {
                    return (
                      <tr key={i}>
                        <td >{x.PID}</td>
                        <td >{x.Nombre}</td>
                        <td >{x.Usuario==0?"root":x.Usuario==1000?"luis":x.Usuario}</td>
                        <td >{x.Estado}</td>
                        <td >{x.Memoria ? (x.Memoria / 5743) : 0}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>


          </div>


        </div>




      </div>
    );
  }
}

function tree_jsx(procesos) {
  if (procesos) {
    return procesos.map((proceso, index) => (
      <Tree content={proceso.Nombre} canHide>
      </Tree>
      //  <tr key={index}>
      //     <td>{error_e.tipo}</td>
      //     <td>{error_e.descripcion}</td>
      //     <td>{error_e.ambito}</td>
      //     <td>{error_e.linea}</td>
      //     <td>{error_e.columna}</td>
      //  </tr>
    ))
  }
}

export default Home