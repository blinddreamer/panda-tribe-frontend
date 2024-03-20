import { Form, Button, Spinner } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import React, { useState, useEffect } from "react";
import axios from "axios";

function GetForm(props) {
  const [system, setSystem] = useState("");
  const [blueprint, setBlueprint] = useState("");

  function sendData() {
    let building = document.getElementById("building").value;
    let quantity = document.getElementById("quantity").value;
    let buildingRig = document.getElementById("buildingRig").value;
    let blueprintMe = document.getElementById("blueprintMe").value;
    let facilityTax = document.getElementById("facility").value;
    props.setFormData({
      blueprintName: blueprint,
      quantity: quantity,
      blueprintMe: blueprintMe,
      buildingRig: buildingRig,
      building: building,
      system: system,
      facilityTax: facilityTax,
    });
    props.setIsClicked(true);
  }

  return (
    <Form>
      <Form.Group controlId="blueprintName">
        <Form.Label>Blueprint Name:</Form.Label>
        <Typeahead
          minLength={2}
          onChange={(selected) => {
            setBlueprint(selected[0]);
          }}
          id="basic-behaviors-example"
          options={props.optionsBp}
          // onInputChange={(e)=> typeheadSearch(e)}
          placeholder="Choose a Blueprint..."
        />
      </Form.Group>
      <Form.Group controlId="quantity">
        <Form.Label>Quantity:</Form.Label>
        <Form.Control
          type="number"
          min={1}
          name="quantity"
          placeholder="Enter quantity number. Default 1"
        />
      </Form.Group>

      <Form.Group controlId="blueprintMe">
        <Form.Label>Blueprint ME:</Form.Label>
        <Form.Control
          type="number"
          min={0}
          name="blueprintMe"
          placeholder="Enter blueprint material efficiency. Default 0"
        />
      </Form.Group>

      <Form.Group controlId="building">
        <Form.Label>Building:</Form.Label>
        <Form.Select aria-label="Default select example">
          <option value={0}>Select Building</option>
          <option value="1">Azbel</option>
          <option value="2">Raitaru</option>
          <option value="3">Sotiyo</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="buildingRig">
        <Form.Label>Building Rig:</Form.Label>
        <Form.Select aria-label="Default select example">
          <option value={0}>Select Building Rig</option>
          <option value="1">T1</option>
          <option value="2">T2</option>
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="systemName">
        <Form.Label>System:</Form.Label>
        <Typeahead
          minLength={2}
          onChange={(selected) => {
            setSystem(selected[0]);
          }}
          id="basic-behaviors-example"
          options={props.optionsSys}
          // onInputChange={(e)=> typeheadSearch(e)}
          placeholder="Choose a system..."
        />
      </Form.Group>
      <Form.Group controlId="facility">
        <Form.Label>Facility tax:</Form.Label>
        <Form.Control
          type="number"
          min={0}
          name="facility"
          placeholder="Enter facility tax. Default 0"
        />
      </Form.Group>
      <p />
      <Button variant="primary" onClick={sendData}>
        {props.isLoading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading...
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </Form>
  );
}
export default GetForm;
