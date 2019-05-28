import React from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import VelocityAngleMode from './VelocityAngleMode';
import ComponentMode from './ComponentMode';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import Chart from 'chart.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0, // s
      deltaTime: 0.100,
      posX: 0, // m
      posY: 0, // m
      velX: 0, // m/s
      velY: 0, // m/s
      angleDegrees: 0, // degrees
      angleRadians: 0, // radians
      velocityVector: 0, // m/s
      g: 9.81, // m/s^2
      canvasHeight: 400,
      canvasWidth: window.innerWidth,
      data: []
    }

    this.ctx = undefined;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext("2d");
  }

  handleChange(event) {
    if (event.target.name === "angleDegrees") {
      const angle = event.target.value * (Math.PI / 180);
      this.setState({
        angleRadians: (angle),
        angleDegrees: (event.target.value),
        velX: (Math.cos(angle) * this.state.velocityVector),
        velY: (Math.sin(angle) * this.state.velocityVector)
      });
    } else if (event.target.name === "velocityVector") {
      this.setState({
        velocityVector: (event.target.value),
        velX: (Math.cos(this.state.angleRadians) * event.target.value),
        velY: (Math.sin(this.state.angleRadians) * event.target.value)
      });
    } else if (event.target.name === "velX") {
      const value = event.target.value;
      const angle = Math.atan2(this.state.velY, value);
      this.setState({
        angleRadians: (angle),
        angleDegrees: (angle * (180 / Math.PI)),
        velX: (value),
        velocityVector: (value / Math.cos(angle)),
      });
    } else if (event.target.name === "velY") {
      const value = event.target.value;
      const angle = Math.atan2(value, this.state.velX);
      this.setState({
        angleRadians: (angle),
        angleDegrees: (angle * (180 / Math.PI)),
        velY: (value),
        velocityVector: (value / Math.cos(angle)),
      });

    } else {
      this.setState({[event.target.name]: event.target.value})
    }
  }

  handleSubmit(event) {
    event.preventDefault(); // don't refresh

    // kinematics equations
    const posX = (time) => { return this.state.velX * time; }
    const posY = (time) => { return (this.state.velY * time) - (0.5 * this.state.g * time * time); }
    const velY = (time) => { return (this.state.velY - (this.state.g * time)); }
    const velX = (time) => { return this.state.velX; }

    // find the end posX for the end point of the graph
    const timeOfFlight = (2 * this.state.velY) / this.state.g;
    
    let newData = [];
    let xPosition = [];
    let yPosition = [];
    let yVelocity = [];

    for (let t = 0; t <= timeOfFlight; t += this.state.deltaTime) {
      newData.push({
        time: Number.parseFloat(t).toFixed(3),
        posX: Number.parseFloat(posX(t)).toFixed(3),
        posY: Number.parseFloat(posY(t)).toFixed(3),
        velX: Number.parseFloat(velX(t)).toFixed(3),
        velY: Number.parseFloat(velY(t)).toFixed(3),
        velocityVector: Number.parseFloat(Math.sqrt( (velX(t) * velX(t)) + (velY(t) * velY(t)) ).toFixed(3)),
        angleDegrees: Number.parseFloat(Math.atan(velY(t) / velX(t)) * (180 / Math.PI) ).toFixed(3)
      });
      xPosition.push(Number.parseFloat(posX(t)).toFixed(3));
      yPosition.push(Number.parseFloat(posY(t)).toFixed(3));
      yVelocity.push(Number.parseFloat(velY(t)).toFixed(3));
    }

    let t = timeOfFlight + this.state.deltaTime;
    newData.push({
      time: Number.parseFloat(t).toFixed(3),
      posX: Number.parseFloat(posX(t)).toFixed(3),
      posY: Number.parseFloat(posY(t)).toFixed(3),
      velX: Number.parseFloat(velX(t)).toFixed(3),
      velY: Number.parseFloat(velY(t)).toFixed(3),
      velocityVector: Number.parseFloat(Math.sqrt( (velX(t) * velX(t)) + (velY(t) * velY(t)) ).toFixed(3)),
      angleDegrees: Number.parseFloat(Math.atan(velY(t) / velX(t)) * (180 / Math.PI) ).toFixed(3)
    });
    xPosition.push(Number.parseFloat(posX(t)).toFixed(3));
    yPosition.push(Number.parseFloat(posY(t)).toFixed(3));
    yVelocity.push(Number.parseFloat(velY(t)).toFixed(3));

    this.setState({data: newData});

    let colorSet = ["rgba(43, 159, 243, 0.7)", "rgba(50, 243, 43, 0.7)"]


    let chart = new Chart(this.ctx, {
      type: 'line',
      data: {
          labels: xPosition,
          datasets: [
            {
              label: 'Height',
              data: yPosition,
              backgroundColor: colorSet[0],
              borderColor: colorSet[0],
              borderWidth: 1,
              yAxisID: "height"
            },
            {
              label: "Y Velocity",
              data: yVelocity,
              backgroundColor: colorSet[1],
              borderColor: colorSet[1],
              borderWidth: 1,
              yAxisID: "yVelocity"
            }]
      },
      options: {
          scales: {
              yAxes: [{
                  id: 'height',
                  type: 'linear',
                  position: 'left',
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 50,
                  },
                  scaleLabel: {
                    labelString: "Height"
                  }
              }, {
                id: 'yVelocity',
                type: 'linear',
                position: 'right',
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 50
                },
                scaleLabel: {
                  labelString: "Y Velocity"
                }
              }]
          },
          responsive: false
      }
  });
  }

  handleReset() {
    this.setState({
      time: 0, // s
      deltaTime: 0.1,
      posX: 0, // m
      posY: 0, // m
      velX: 0, // m/s
      velY: 0, // m/s
      angleDegrees: 0, // degrees
      angleRadians: 0, // radians
      velocityVector: 0, // m/s
      g: 9.81, // m/s^2
      data: []
    })
  }

  render() {
    return (
        <Container fluid={true}>
          <h1 className="display-4">Projectile Simulator</h1>
          <p className="lead">Select a mode from below. Velocity-Angle Mode takes the the magnitude of the initial velocity and the launch angle.
          Component Mode takes the magnitude of each of the initial components.</p>
          <Tabs defaultActiveKey="VelocityAngleMode" id="mode-selector">
            <Tab eventKey="VelocityAngleMode" title="Velocity-Angle Mode">

              <VelocityAngleMode
                handleChange={this.handleChange.bind(this)}
                handleSubmit={this.handleSubmit.bind(this)}
                handleReset={this.handleReset.bind(this)}
                time={this.state.time}
                deltaTime={this.state.deltaTime}
                posX={this.state.posX}
                posY={this.state.posY}
                velX={this.state.velX}
                velY={this.state.velY}
                angleDegrees={this.state.angleDegrees}
                angleRadians={this.state.angleRadians}
                velocityVector={this.state.velocityVector}
                g={this.state.g}
                canvasHeight={this.state.canvasHeight}
                canvasWidth={this.state.canvasWidth} />

            </Tab>
            <Tab eventKey="ComponentMode" title="Component Mode">

              <ComponentMode 
                handleChange={this.handleChange.bind(this)}
                handleSubmit={this.handleSubmit.bind(this)}
                handleReset={this.handleReset.bind(this)}
                time={this.state.time}
                deltaTime={this.state.deltaTime}
                posX={this.state.posX}
                posY={this.state.posY}
                velX={this.state.velX}
                velY={this.state.velY}
                angleDegrees={this.state.angleDegrees}
                angleRadians={this.state.angleRadians}
                velocityVector={this.state.velocityVector}
                g={this.state.g}
                canvasHeight={this.state.canvasHeight}
                canvasWidth={this.state.canvasWidth} />

            </Tab>
          </Tabs>
          {this.state.data.length > 0 && 
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>X Position</th>
                  <th>Y Position</th>
                  <th>X Velocity</th>
                  <th>Y Velocity</th>
                  <th>Speed</th>
                  <th>Angle</th>
                </tr>
              </thead>

              <tbody>
                {this.state.data.map(dataPoint => (
                  <tr>
                  <td>{dataPoint.time} s</td>
                  <td>{dataPoint.posX} m</td>
                  <td>{dataPoint.posY} m</td>
                  <td>{dataPoint.velX} m/s</td>
                  <td>{dataPoint.velY} m/s</td>
                  <td>{dataPoint.velocityVector} m/s</td>
                  <td>{dataPoint.angleDegrees}&deg;</td>
                </tr>
                ))}
              </tbody>
            </Table>
          }
          <canvas ref="canvas" id="canvas" height={this.state.canvasHeight} width={this.state.canvasWidth}></canvas>
          {this.state.data.length > 0 && <Navbar sticky="bottom"><p className="small">Copyright &copy; 2019 Pranav Avva. All Right Reserved</p></Navbar> }
          {this.state.data.length === 0 && <Navbar fixed="bottom"><p className="small">Copyright &copy; 2019 Pranav Avva. All Right Reserved</p></Navbar> }
        </Container>
      );
   }
}