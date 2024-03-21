import React, { useState, useEffect } from "react";
import { Form, Button, Card, Collapse, Alert, Spinner } from "react-bootstrap";
import { ArrowBarDown, ArrowBarUp } from "react-bootstrap-icons";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";

function Calculator(props) {
  // INITIALISE STATE PARAMETERS
  const [isDataLoaded, setIsDataLoaded] = useState({});
  const [isCopied, setIsCopied] = useState({});
  const [system, setSystem] = useState(null);
  const [systemValues, setSystemValues] = useState({});

  useEffect(() => {
    system != null &&
      recalculatePrices(
        system.id,
        system.material,
        system.colId,
        system.parent_id,
        system.value
      );
    setSystem(null);
  });

  // HANDEL MATERIAL DISCOUNT FORM
  const handleInputChange = async (material, e) => {
    const tempId = e.target.id;
    const splitedId = tempId.split(/_(.*)/s);
    const parent_id = splitedId[1];
    const id = splitedId[0];
    const colId = "col_" + parent_id;
    const value = e.target.value;
    recalculatePrices(id, material, colId, parent_id, value);
  };

  async function recalculatePrices(id, material, colId, parent_id, value) {
    let blueprintMe = "";
    let buildingRig = "";
    let building = "";
    let system = "";
    let facilityTax;
    if (id === "me") {
      blueprintMe = value;
      buildingRig = document.getElementById("rig_" + parent_id).value;
      building = document.getElementById("build_" + parent_id).value;
      system = facilityTax = document.getElementById(
        "facility_" + parent_id
      ).value;
    }
    if (id === "rig") {
      blueprintMe = document.getElementById("me_" + parent_id).value;
      buildingRig = value;
      building = document.getElementById("build_" + parent_id).value;
      system = systemValues["system_" + parent_id];
      facilityTax = document.getElementById("facility_" + parent_id).value;
    }
    if (id === "build") {
      blueprintMe = document.getElementById("me_" + parent_id).value;
      buildingRig = document.getElementById("rig_" + parent_id).value;
      system = systemValues["system_" + parent_id];
      facilityTax = document.getElementById("facility_" + parent_id).value;
      building = value;
    }
    if (id === "system") {
      blueprintMe = document.getElementById("me_" + parent_id).value;
      buildingRig = document.getElementById("rig_" + parent_id).value;
      system = value;
      facilityTax = document.getElementById("facility_" + parent_id).value;
      building = document.getElementById("build_" + parent_id).value;
    }
    if (id === "facility") {
      blueprintMe = document.getElementById("me_" + parent_id).value;
      buildingRig = document.getElementById("rig_" + parent_id).value;
      system = systemValues["system_" + parent_id];
      facilityTax = value;
      building = document.getElementById("build_" + parent_id).value;
    }
    try {
      const response = await axios.post(props.backend + "type", {
        blueprintName: material.name,
        quantity: material.jobsCount,
        blueprintMe: blueprintMe,
        buildingRig: buildingRig,
        building: building,
        system: system,
        facilityTax: facilityTax,
      });
      if (response.status !== 200) {
        throw new Error(`Server Error: ${response.statusText}`);
      }
      const data = response.data;
      material.craftPrice = data.craftPrice;
      material.materialsList = data.materialsList;
      props.setMaterialsList(...[props.materialsList]);
      updateLoadedData(colId);
    } catch (error) {
      console.error("Error:", error.message);
      props.setErrorMessage(error.message);
    }
  }

  // COPY FUNCTION
  async function handleCopy(material, id) {
    try {
      const textToCopy = material.materialsList
        .map((mat) => `${mat.name} x${mat.quantity}`)
        .join("\n");
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied({ [id]: true });
    } catch (error) {
      console.error("Error copying text: ", error);
      alert("Failed to copy text.");
    }
  }
  // INITIAL BACKEND CALL TO OBTAIN INITIAL DATA

  const craftPrice = () => {
    const price = props.initialBlueprint.materialsList.reduce(
      (accumulator, mat, index) => {
        const elementId = (
          "card_" +
          props.initialBlueprint.name +
          "_" +
          mat.name +
          index
        ).replace(" ", "_");
        const state = props.openState[elementId];
        return (
          accumulator +
          (mat.craftPrice && state ? mat.craftPrice : mat.sellPrice)
        );
      },
      0
    );
    return price;
  };
  // BACKEND CALL FOR THE SUBMATERIALS DATA
  async function getSubmatsData(material, colId) {
    if (!Array.isArray(material.materialsList)) {
      try {
        const response = await axios.post(props.backend + "type", {
          blueprintName: material.name,
          quantity: material.jobsCount,
          blueprintMe: 10,
          building: props.formData.building,
          buildingRig: props.formData.buildingRig,
          system: props.formData.system,
          facilityTax: props.formData.facilityTax
        });
        if (response.status !== 200) {
          throw new Error(`Server Error: ${response.statusText}`);
        }
        const data = response.data;
        material.craftPrice = data.craftPrice;
        material.materialsList = data.materialsList;
        props.setMaterialsList(...[props.materialsList]);
        updateLoadedData(colId);
      } catch (error) {
        console.error("Error:", error.message);
        props.setErrorMessage(error.message);
      }
    }
  }

  // COLLABSIBLE TOGGLING
  const toggleCollapsible = (id, isCreatable) => {
    if (isCreatable) {
      props.setOpenState((prevState) => ({
        ...prevState,
        [id]: !prevState[id], // Toggle the state for the given ID
      }));
    }
  };
  // UPDATE LOADED DATA
  const updateLoadedData = (id) =>
    setIsDataLoaded((prevState) => ({
      ...prevState,
      [id]: true,
    }));

  // DISPLAY RESULT
  const displayResult = () => {
    return (
      <>
   
        {props.initialBlueprint.materialsList && (
          
          <div id="blueprintHeader">
   
            <h4>
              Materials for creating {props.initialBlueprint.quantity}{" "}
              <img src={props.initialBlueprint.icon} loading="lazy" />{" "}
              {props.initialBlueprint.name}.
              <p id="bpheader" />
              Estimate Material price:{" "}
              {craftPrice().toLocaleString("en-US", {
                style: "currency",
                currency: "ISK",
                minimumFractionDigits: 2,
              })}{" "}
              <p id="bpheader" />
              Estimate Sell order :{" "}
              {props.initialBlueprint.sellPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "ISK",
                minimumFractionDigits: 2,
              })}
              <p id="bpheader" />
              <Button
                className="btn btn-primary"
                onClick={() =>
                  handleCopy(
                    props.initialBlueprint,
                    "copy_" + props.initialBlueprint.name
                  )
                }
                disabled={isCopied["copy_" + props.initialBlueprint.name]}
              >
                {!isCopied["copy_" + props.initialBlueprint.name]
                  ? "multi buy copy"
                  : "Copied"}
              </Button>
            </h4>
          </div>
        )}
        {props.materialsList.map((mat, index) =>
          render(props.initialBlueprint.name, mat, index)
        )}
      </>
    );
  };

  // RENDER MATERIALS
  function render(parent, material, index) {
    const id = (parent + "_" + material.name + index).replace(" ", "_"); // Unique ID for the card
    const openId = "card_" + id;
    const colId = "col_" + id;
    const isOpen = props.openState[openId]; // Get the open state for the card
    const isLoaded = isDataLoaded[colId];
 
    
    return (
      <>
        <div className="card d-grid gap-3 border border-primary shadow p-3 mb-5">
          <Card.Header
            className={`card-header border border-secondary ${
              isOpen ? "collapsed" : ""
            }`}
            key={`header_${id}`}
          >
            {material.isCreatable && isOpen && (
              <Button
                id={`copy_${id}`}
                onClick={() => handleCopy(material, "copy_" + id)}
                disabled={isCopied["copy_" + id]}
              >
                {!isCopied["copy_" + id] ? "Copy" : "Copied"}
              </Button>
            )}
            <p>
              {" "}
              <img src={material.icon} loading="lazy" />
              {material.name}</p> 
            <p>Quantity: {material.quantity}</p>
            <p>Volume: {material.volume} m³</p>
            <p>
              Market price:{" "}
              {material.sellPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "ISK",
                minimumFractionDigits: 2,
              })}
            </p>
            {material.craftPrice && (
              <p id={id}>
                Crafting price:{" "}
                {material.craftPrice.toLocaleString("en-US", {
                  style: "currency",
                  currency: "ISK",
                  minimumFractionDigits: 2,
                })}
              </p>
            )}
            {material.isCreatable && (
              <div className="card-form">
               {props.advancedMode && <Form>
                  <Form.Group controlId={`me_${id}`}>
                    <Form.Label>Blueprint ME:</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      name={`me_${id}`}
                      placeholder="0"
                      onChange={(e) => handleInputChange(material, e)}
                    />
                  </Form.Group>
                  <Form.Group controlId={`build_${id}`}>
                    <Form.Label>Building:</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleInputChange(material, e)}
                    >
                      <option value="0">Select Building</option>
                      <option value="1">Azbel</option>
                      <option value="2">Raitaru</option>
                      <option value="3">Sotiyo</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId={`rig_${id}`}>
                    <Form.Label>Building Rig:</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => handleInputChange(material, e)}
                    >
                      <option value="0">Select Building Rig</option>
                      <option value="1">T1</option>
                      <option value="2">T2</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>System:</Form.Label>
                    <Typeahead
                      id={`system_${id}`}
                      minLength={2}
                      onChange={(selected) => {
                        setSystemValues((prevState) => ({
                          ...prevState,
                          [`system_${id}`]: selected[0],
                        }));
                        setSystem({
                          value: selected[0],
                          id: "system",
                          material: material,
                          parent_id: id,
                          colId: "col_" + id,
                        });
                      }}
                      options={props.optionsSys}
                      placeholder="Choose a System..."
                    />
                  </Form.Group>
                  <Form.Group controlId={`facility_${id}`}>
                    <Form.Label>Facility tax:</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      name={`facility_${id}`}
                      placeholder="0"
                      onChange={(e) => handleInputChange(material, e)}
                    />
                  </Form.Group>
                </Form>}
                {material.isCreatable &&
                  (!isOpen ? (
                    <ArrowBarDown
                      aria-controls={`card_${id}`}
                      aria-expanded={isOpen}
                      onClick={() =>
                        toggleCollapsible("card_" + id, material.isCreatable)
                      }
                    ></ArrowBarDown>
                  ) : (
                    <ArrowBarUp
                      aria-controls={`card_${id}`}
                      aria-expanded={isOpen}
                      onClick={() =>
                        toggleCollapsible("card_" + id, material.isCreatable)
                      }
                    ></ArrowBarUp>
                  ))}
              </div>
            )}
          </Card.Header>
          <Collapse
            id={colId}
            in={isOpen}
            onEnter={() => getSubmatsData(material, colId)}
            timeout={10}
          >
            <Card.Body
              className="card-body border border-secondary"
              key={`card_${id}`}
              id={`card_${id}`}
            >
              {isLoaded && Array.isArray(material.materialsList) ? (
                material.materialsList.map((mat, index) =>
                  render(material.name, mat, index)
                )
              ) : (
                <Spinner></Spinner>
              )}
            </Card.Body>
          </Collapse>
        </div>
      </>
    );
  }
  // END RESULT
  return (
    <div className="d-grid gap-5">
      {props.errorMessage ? (
        <Alert>{props.errorMessage}</Alert>
      ) : (
        displayResult()
      )}
    </div>
  );
}

export default Calculator;
