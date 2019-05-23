import React from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import VelocityAngleMode from './VelocityAngleMode';
import ComponentMode from './ComponentMode';
import Table from 'react-bootstrap/Table';
import Chart from 'chart.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0, // s
      posX: 0, // m
      posY: 0, // m
      velX: 0, // m/s
      velY: 0, // m/s
      angleDegrees: 0, // degrees
      angleRadians: 0, // radians
      velocityVector: 0, // m/s
      g: 9.81, // m/s^2
      canvasHeight: 100,
      canvasWidth: 100
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.name === "angleDegrees") {
      const angle = event.target.value * (Math.PI / 180);
      this.setState({
        angleRadians: Number.parseFloat(angle).toFixed(3),
        angleDegrees: Number.parseFloat(event.target.value).toFixed(3),
        velX: Number.parseFloat(Math.cos(angle) * this.state.velocityVector).toFixed(3),
        velY: Number.parseFloat(Math.sin(angle) * this.state.velocityVector).toFixed(3)
      });
    } else if (event.target.name === "velocityVector") {
      this.setState({
        velocityVector: Number.parseFloat(event.target.value).toFixed(3),
        velX: Number.parseFloat(Math.cos(this.state.angleRadians) * event.target.value).toFixed(3),
        velY: Number.parseFloat(Math.sin(this.state.angleRadians) * event.target.value).toFixed(3)
      });
    } else if (event.target.name === "velX") {
      const value = event.target.value;
      const angle = Math.atan2(this.state.velY, value);
      this.setState({
        angleRadians: Number.parseFloat(angle).toFixed(3),
        angleDegrees: Number.parseFloat(angle * (180 / Math.PI)).toFixed(3),
        velX: Number.parseFloat(value).toFixed(3),
        velocityVector: Number.parseFloat(value / Math.cos(angle)).toFixed(3),
      });
    } else if (event.target.name === "velY") {
      const value = event.target.value;
      const angle = Math.atan2(value, this.state.velX);
      this.setState({
        angleRadians: Number.parseFloat(angle).toFixed(3),
        angleDegrees: Number.parseFloat(angle * (180 / Math.PI)).toFixed(3),
        velY: Number.parseFloat(value).toFixed(3),
        velocityVector: Number.parseFloat(value / Math.cos(angle)).toFixed(3),
      });
    } else {
      this.setState({[event.target.name]: event.target.value})
    }
  }

  handleSubmit(event) {
    event.preventDefault(); // don't refresh

    // get a ref to the canvas
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    
    // kinematics equations
    const posX = (time) => { return this.state.velX * time; }
    const posY = (time) => { return (this.state.velY * time) - (0.5 * this.state.g * time * time); }
    const velY = (time) => { return (this.state.velY - (this.state.g * time)); }
    const velX = (time) => { return this.state.velX; }

    // find the end posX for the end point of the graph
    const timeOfFlight = (2 * this.state.velY) / this.state.g;
    const xAtEnd = posX(timeOfFlight);
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
                time={this.state.time}
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
                time={this.state.time}
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
              <tr>
                <td>{this.state.time} s</td>
                <td>{this.state.posX} m</td>
                <td>{this.state.posY} m</td>
                <td>{this.state.velX} m/s</td>
                <td>{this.state.velY} m/s</td>
                <td>{this.state.velocityVector} m/s</td>
                <td>{this.state.angleDegrees}&deg;</td>
              </tr>
            </tbody>
          </Table>
          <canvas id="canvas" style={{display: "block"}} ref="canvas" width={this.state.canvasWidth} height={this.state.canvasHeight} />
        </Container>
      );
   }
}