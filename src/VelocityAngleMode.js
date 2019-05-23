import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class VelocityAngleMode extends React.Component {
    render() {
        return (
            <Container fluid={true}>
                <h2>Velocity-Angle Mode</h2>

                <Form inline={true} onSubmit={this.props.handleSubmit}>
                    <Form.Label className="mb-2 mr-sm-2">Velocity of Launch (m/s)</Form.Label>
                    <Form.Control type="number" className="mb-2 mr-sm-2" name="velocityVector" value={this.props.velocityVector} onChange={this.props.handleChange} />
                    <Form.Label className="mb-2 mr-sm-2">Angle of Launch (Degrees)</Form.Label>
                    <Form.Control type="number" className="mb-2 mr-sm-2" name="angleDegrees" value={this.props.angleDegrees} onChange={this.props.handleChange} />

                    <Form.Label className="mb02 mr-sm-2">Frame Width</Form.Label>
                    <Form.Control type="number" className="mb-2 mr-sm-2" name="frameWidth" value={this.props.frameWidth} onChange={this.props.handleChange} />
                    <Form.Label className="mb02 mr-sm-2">Frame Height</Form.Label>
                    <Form.Control type="number" className="mb-2 mr-sm-2" name="frameHeight" value={this.props.frameHeight} onChange={this.props.handleChange} />
                    <Button variant="primary" type="submit" className="mb-2 mr-sm-2">Simulate!</Button>
                </Form>
            </Container>
        );
    }
}