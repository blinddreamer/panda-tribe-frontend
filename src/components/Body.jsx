import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Calculator from "../components/Calculator";

function Body() {
  return (
    <Container>
      <Row>
        <Col>
          <Col>1 of 2</Col>
        </Col>
        <Col>
          2 of 2
          <Calculator />
        </Col>
      </Row>
    </Container>
  );
}

export default Body;
