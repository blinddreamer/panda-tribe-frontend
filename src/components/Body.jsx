import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Calculator from "../components/Calculator";
import GetForm from "./Form";
import axios from "axios";
function Body() {
  const [openState, setOpenState] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [initialBlueprint, setInitialBlueprint] = useState({});
  const [materialsList, setMaterialsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [optionsBp, setOptionsBp] = useState([]);
  const [optionsSys, setOptionsSys] = useState([]);
  const [onStart, setOnstart] = useState(true);
  const backend = "http://thunder:6549/api/v1/";
  //const backend = "http://localhost:8080/api/v1/";
  // SET PAGE TITLE
  useEffect(() => {
    document.title = "eve-helper / Eve Online Industry Calculator"; // Set the new title
  }, []);
  useEffect(() => {
    isClicked && submitForm();
  });
  useEffect(() => {
    onStart && getSystems() && getBlueprints();
    setOnstart(false);
  });

  async function getSystems() {
    const response = await axios.get(backend + "systems");
    if (response.status === 200) {
      setOptionsSys(response.data.map((sys) => sys.systemName));
    }
  }
  async function getBlueprints() {
    const response = await axios.get(backend + "blueprints");
    if (response.status === 200) {
      setOptionsBp(response.data.blueprints.map((bp) => bp.blueprint));
    }
  }
  const submitForm = async () => {
    setIsClicked(false);
    setOpenState({});
    setIsLoading(true);
    try {
      const response = await axios.post(backend + "type", {
        blueprintName: formData.blueprintName,
        quantity: formData.quantity,
        blueprintMe: formData.blueprintMe,
        buildingRig: formData.buildingRig,
        building: formData.building,
        system: formData.system,
        facilityTax: formData.facilityTax,
      });
      if (response.status !== 200) {
        throw new Error(`Server Error: ${response.statusText}`);
      }
      setErrorMessage("");
      const data = response.data;
      setMaterialsList(data.materialsList);
      setInitialBlueprint(data);
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage(
        "Item '" + formData.blueprintName + "' not found in database !"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container>
      <Row>
        <Col>
          <Col>
            1 of 2
            <GetForm
              setFormData={setFormData}
              setIsClicked={setIsClicked}
              isLoading={isLoading}
              optionsBp={optionsBp}
              optionsSys={optionsSys}
            ></GetForm>{" "}
          </Col>
        </Col>
        <Col>
          2 of 2
          <Calculator
            materialsList={materialsList}
            setMaterialsList={setMaterialsList}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            initialBlueprint={initialBlueprint}
            openState={openState}
            setOpenState={setOpenState}
            optionsSys={optionsSys}
            backend={backend}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Body;
