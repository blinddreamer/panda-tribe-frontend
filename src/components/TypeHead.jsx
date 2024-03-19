import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import {Typeahead} from "react-bootstrap-typeahead";


function TypeaheadGetter(){
const initialState = {
    disabled: false,
    dropup: false,
    flip: false,
    highlightOnlyResult: false,
    minLength: 0,
    open: undefined,
    
  };
  const options = ["gnomak","dakov","milioner"];

      return (
      <>
      <Form>
      <Form.Group controlId="facility-test">
          <Form.Label>Facility tax:</Form.Label>
        <Typeahead
          minLength={2}
          id="basic-behaviors-example"
          options={options}
          placeholder="Choose a state..."
        />
        </Form.Group>
        </Form>
       </>
    );
  }

export default TypeaheadGetter;