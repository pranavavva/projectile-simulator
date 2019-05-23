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
      canvasHeight: 400,
      canvasWidth: 400,
      framePeriod: 1, // ms
      frameWidth: 400,
      frameHeight: 400
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.name === "angleDegrees") {
      const angle = event.target.value * (Math.PI / 180);
      this.setState({
        angleRadians: angle,
        angleDegrees: event.target.value,
        velX: Math.cos(angle) * this.state.velocityVector,
        velY: Math.sin(angle) * this.state.velocityVector
      });
    } else if (event.target.name === "velocityVector") {
      this.setState({
        velocityVector: event.target.value,
        velX: Math.cos(this.state.angleRadians) * event.target.value,
        velY: Math.sin(this.state.angleRadians) * event.target.value
      });
    } else if (event.target.name === "velX") {
      const value = event.target.value;
      const angle = Math.atan2(this.state.velY, value);
      this.setState({
        angleRadians: angle,
        angleDegrees: angle * (180 / Math.PI),
        velX: value,
        velocityVector: value / Math.cos(angle),
      });
    } else if (event.target.name === "velY") {
      const value = event.target.value;
      const angle = Math.atan2(value, this.state.velX);
      this.setState({
        angleRadians: angle,
        angleDegrees: angle * (180 / Math.PI),
        velY: value,
        velocityVector: value / Math.cos(angle),
      });
    } else {
      this.setState({[event.target.name]: event.target.value})
    }
  }

  handleSubmit(event) {
    event.preventDefault(); // don't refresh
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
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
              canvasWidth={this.state.canvasWidth}
              framePeriod={this.state.framePeriod}
              frameWidth={this.state.frameWidth}
              frameHeight={this.state.frameHeight} />

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
              canvasWidth={this.state.canvasWidth}
              framePeriod={this.state.framePeriod}
              frameWidth={this.state.frameWidth}
              frameHeight={this.state.frameHeight} />

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
        <canvas id="canvas" ref="canvas" width={this.state.canvasWidth} height={this.state.canvasHeight} />
      </Container>
    )
  }
}