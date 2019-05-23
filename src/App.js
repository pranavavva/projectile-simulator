import React from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import VelocityAngleMode from './VelocityAngleMode';
import ComponentMode from './ComponentMode';
import Table from 'react-bootstrap/Table';

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

    const canvas = this.refs.canvas; // save a ref to the canvas
    const ctx = canvas.getContext("2d"); // get the 2D context of the canvas
    
    // clear the canvas
    ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

    const widthMToPixels = this.state.canvasWidth / this.state.frameWidth;
    const heightMToPixels = this.state.canvasHeight / this.state.frameHeight;

    // define kinematics formulae
    const posX = (time) => {return this.state.velocityVector * Math.cos(this.state.angleRadians) * time;}
    const posY = (time) => {return (this.state.velocityVector * Math.sin(this.state.angleRadians) * time) - (this.state.g * time * time);}
    const velX = () => {return this.state.velX;}
    const velY = (time) =>{return this.state.velY - (this.state.g * time);}

    // Calculate max height
    const timeAtMaxHeight = -1 * this.state.velY / this.state.g;
    const maxX = posX(timeAtMaxHeight);
    const maxY = posY(timeAtMaxHeight);

    const range = -1 * this.state.velocityVector * this.state.velocityVector * Math.sin(2 * this.state.angleRadians) / this.state.g;

    const totalTime = -2 * this.state.velY / this.state.g;

    // draw loop
    const draw = (time, animate, maxX, maxY) => {
      this.setState({time: time, posX: posX(time), posY: posY(time)});

      ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
      ctx.fillStyle = "rgb(0,0,200)";
      ctx.strokeStyle = "rgb(200,0,0)";

      ctx.beginPath();
      ctx.moveTo(0, this.state.canvasHeight);
      ctx.quadraticCurveTo(maxX * widthMToPixels,
        this.state.canvasHeight - 2 * maxY * heightMToPixels,
        range * widthMToPixels,
        this.state.canvasHeight);
      ctx.stroke();

      // draw current position
      const x = posX(time) * widthMToPixels;
      const y = this.state.canvasHeight - (posY(time) * heightMToPixels);
      const xv = velX * widthMToPixels;
      const yv = velY(time) * heightMToPixels;
      
      ctx.beginPath();
      ctx.moveTo(x * widthMToPixels, this.state.canvasHeight - (y * heightMToPixels));
      ctx.arc(x, y, 5, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();

      time += this.state.framePeriod / 1000;

      if ((time <= totalTime + this.state.framePeriod*0.001) && animate)
        setTimeout(() => {
          draw(time, true);
        }, this.state.framePeriod);
    }

    draw(0, true, maxX, maxY);
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
        <canvas width={this.state.canvasWidth} height={this.state.canvasHeight} ref="canvas">Get a modern browser!</canvas>
      </Container>
    )
  }
}