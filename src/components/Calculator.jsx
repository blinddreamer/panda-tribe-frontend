import React, { useState, useEffect } from "react";
import { Form, Button, Collapse, Alert, Spinner } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";
import AdvancedModeToggle from "../components/AdvancedMode";
import Table from "react-bootstrap/Table";

function Calculator(props) {
  // INITIALISE STATE PARAMETERS
  const [isDataLoaded, setIsDataLoaded] = useState({});
  const [isCopied, setIsCopied] = useState({});
  const [system, setSystem] = useState(null);
  const [systemValues, setSystemValues] = useState({});
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    system != null &&
      recalculatePrices(
        system.id,
        system.material,
        system.colId,
        system.parent_id,
        system.value
      ) &&
      setInputValues((prevState) => ({
        ...prevState,
        [system.id]: system.value,
      }));

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
    setInputValues((prevState) => ({
      ...prevState,
      [tempId]: e.target.value,
    }));
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
      material.industryCosts = data.industryCosts;
      material.materialsList = data.materialsList;
      props.setMaterialsList(...[props.materialsList]);
      updateLoadedData(colId);
    } catch (error) {
      console.error("Error:", error.message);
      props.setErrorMessage(error.message);
    }
  }

  // COPY FUNCTION
  async function handleMultiBuyCopy(id) {
    const matsToCopy = Object.values(props.multiBuy);
    try {
      const textToCopy = matsToCopy
        .map((mat) =>
          mat.materialsList
            .map((subMat) => `${subMat.name} x${subMat.quantity}`)
            .join("\n")
        )
        .join("\n");
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied({ [id]: true });
    } catch (error) {
      console.error("Error copying text: ", error);
      alert("Failed to copy text.");
    }
  }

  // COPY FUNCTION
  async function handleSingleCopy(material, id) {
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

  const craftPrice = (material,id) => {
    const price = material.materialsList.reduce(
      (accumulator, mat, index) => {
     //   const elementId = (
        //   "card_" +
        //   props.initialBlueprint.name +
        //   "_" +
        //   mat.name +
        //   index
        // ).replace(" ", "_");
        const state = props.openState[id];
        return (
          accumulator +
          (mat.craftPrice && state
            ? mat.craftPrice + mat.industryCosts
            : mat.sellPrice)
        );
      },
      0
    );
    return price + props.initialBlueprint.industryCosts;
  };

  function handleCheck(material, colId, checkId) {
    props.setMultiBuy((prevState) => {
      const newState = { ...prevState }; // Copy the state object
      if (newState[checkId]) {
        delete newState[checkId]; // Remove the item if it exists
      } else {
        newState[checkId] = material; // Add the item if it doesn't exist
      }
      return newState; // Return the new state object
    });
    getSubmatsData(material, colId);
  }
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
          facilityTax: props.formData.facilityTax,
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
            <div>
              <img
                id="gnomorocks"
                src={props.initialBlueprint.icon}
                loading="lazy"
              />{" "}
            </div>
            <div id="hukurocks">
              Volume : {props.initialBlueprint.volume + " m³"}
              <p id="bpheader" />
              Estimate Crafting price:{" "}
              {craftPrice(props.initialBlueprint, "card_"+ props.initialBlueprint.name).toLocaleString("en-US", {
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
              Estimate Profit :{" "}
              {(props.initialBlueprint.sellPrice - craftPrice(props.initialBlueprint, "card_"+props.initialBlueprint.name)).toLocaleString(
                "en-US",
                {
                  style: "currency",
                  currency: "ISK",
                  minimumFractionDigits: 2,
                }
              )}
              <p id="bpheader" />
              Margin :{" "}
              {(
                ((props.initialBlueprint.sellPrice - craftPrice(props.initialBlueprint, "card_"+props.initialBlueprint.name)) /
                  props.initialBlueprint.sellPrice) *
                100
              ).toFixed(2) + " %"}
              <p id="bpheader" />
            </div>
            <div>
              <Button
                id="button-top"
                variant="secondary"
                onClick={() =>
                  handleMultiBuyCopy("copy_" + props.initialBlueprint.name)
                }
              >
                {!isCopied["copy_" + props.initialBlueprint.name]
                  ? "Multibuy"
                  : "Copied"}
              </Button>
              <p />
              <AdvancedModeToggle
                setAdvancedMode={props.setAdvancedMode}
                advancedMode={props.advancedMode}
              />
            </div>
          </div>
        )}
        {props.initialBlueprint.materialsList && (
          <div id="pinkrainbow">
            Materials for creating {props.initialBlueprint.quantity}{" "}
            {props.initialBlueprint.name}.
          </div>
        )}
        {props.initialBlueprint.materialsList && (
          <Table
            bordered
            hover
            size="sm"
            key={`header_${props.initialBlueprint.name}`}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Volume</th>
                <th>Market Cost</th>
                <th>Craft Cost</th>
                <th>Add Multibuy</th>
                {props.advancedMode && <th id="fackbpme">BP ME</th>}
                {props.advancedMode && <th id="fackbuilding">Building</th>}
                {props.advancedMode && <th id="fackrig">Rig</th>}
                {props.advancedMode && <th id="facksystem">System</th>}
                {props.advancedMode && <th id="facktax">Facility tax</th>}
                <th>Copy</th>
              </tr>
            </thead>
            <tbody>
              {props.materialsList.map((mat, index) =>
                render(props.initialBlueprint.name, mat, index)
              )}
            </tbody>
          </Table>
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
    const trColor = index % 2 == 0 ? "huku" : "gnomo";
    return (
      <>
        <tr className={trColor}>
          <td
            onClick={() =>
              toggleCollapsible("card_" + id, material.isCreatable)
            }
          >
            <img src={material.icon} loading="lazy" />
          </td>
          <td
            onClick={() =>
              toggleCollapsible("card_" + id, material.isCreatable)
            }
          >
            {material.name}
          </td>
          <td
            onClick={() =>
              toggleCollapsible("card_" + id, material.isCreatable)
            }
          >
            {material.quantity}
          </td>
          <td
            onClick={() =>
              toggleCollapsible("card_" + id, material.isCreatable)
            }
          >
            {material.volume.toFixed(0)}
          </td>
          <td
            onClick={() =>
              toggleCollapsible("card_" + id, material.isCreatable)
            }
          >
            {material.sellPrice}
          </td>
          <td
            onClick={() =>
              toggleCollapsible("card_" + id, material.isCreatable)
            }
          >
            {material.craftPrice
              ? craftPrice(material, openId)
              : "-"}
          </td>

          <td>
            <Form.Check
              disabled={!material.isCreatable}
              id={"check_" + id}
              key={"check_" + id}
              type="switch"
              onClick={() => handleCheck(material, "col_" + id, "check_" + id)}
            />
          </td>
         
          {props.advancedMode && (
            <>
              <td>
                <Form.Group controlId={`me_${id}`}>
                  <Form.Control
                    type="number"
                    disabled={!material.isCreatable}
                    min={0}
                    name={`me_${id}`}
                    placeholder="0"
                    defaultValue={
                      inputValues[`me_${id}`] ? inputValues[`me_${id}`] : 10
                    }
                    onChange={(e) => handleInputChange(material, e)}
                  />
                </Form.Group>
              </td>
              <td>
                {" "}
                <Form.Group controlId={`build_${id}`}>
                  <Form.Select
                    disabled={!material.isCreatable}
                    aria-label="Default select example"
                    defaultValue={
                      inputValues[`build_${id}`]
                        ? inputValues[`build_${id}`]
                        : props.formData.building
                    }
                    onChange={(e) => handleInputChange(material, e)}
                  >
                    <option hidden>Select Building</option>
                    <option value="0">None</option>
                    <option value="1">Azbel</option>
                    <option value="2">Raitaru</option>
                    <option value="3">Sotiyo</option>
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                {" "}
                <Form.Group controlId={`rig_${id}`}>
                  <Form.Select
                    disabled={!material.isCreatable}
                    aria-label="Default select example"
                    defaultValue={
                      inputValues[`rig_${id}`]
                        ? inputValues[`rig_${id}`]
                        : props.formData.buildingRig
                    }
                    onChange={(e) => handleInputChange(material, e)}
                  >
                    <option hidden>Select Building Rig</option>
                    <option value="0">None</option>
                    <option value="1">T1</option>
                    <option value="2">T2</option>
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Typeahead
                    id={`system_${id}`}
                    disabled={!material.isCreatable}
                    minLength={2}
                    defaultInputValue={
                      inputValues[`system_${id}`]
                        ? inputValues[`system_${id}`]
                        : props.formData.system
                    }
                    onChange={(selected) => {
                      setSystemValues((prevState) => ({
                        ...prevState,
                        [`system_${id}`]: selected[0],
                      }));
                      setSystem({
                        value: selected[0],
                        id: "system_" + id,
                        material: material,
                        parent_id: id,
                        colId: "col_" + id,
                      });
                    }}
                    options={props.optionsSys}
                    placeholder="Choose a System..."
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId={`facility_${id}`}>
                  <Form.Control
                    disabled={!material.isCreatable}
                    defaultValue={
                      inputValues[`facility_${id}`]
                        ? inputValues[`facility_${id}`]
                        : props.formData.facilityTax
                    }
                    type="number"
                    min={0}
                    name={`facility_${id}`}
                    placeholder="0"
                    onChange={(e) => handleInputChange(material, e)}
                  />
                </Form.Group>
              </td>
             </>
          )}
           <td>
            <Button
              id={`copy_${id}`}
              disabled={!isLoaded}
              onClick={() => handleSingleCopy(material, "copy_" + id)}
              variant="secondary"
            >
              {!isCopied["copy_" + id] ? "Copy" : "Copied"}
            </Button>
          </td>
        </tr>

        <Collapse
          id={colId}
          in={isOpen}
          onEnter={() => getSubmatsData(material, colId)}
          timeout={10}
        >
          <tr>
            <td colSpan={props.advancedMode ? 13 : 8}>
              <Table
                striped
                bordered
                hover
                size="sm"
                key={`card_${id}`}
                id={`card_${id}`}
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Volume</th>
                    <th>Market Cost</th>
                    <th>Craft Cost</th>
                    <th>Add Multibuy</th>
                    {props.advancedMode && <th id="fackbpme">BP ME</th>}
                    {props.advancedMode && <th id="fackbuilding">Building</th>}
                    {props.advancedMode && <th id="fackrig">Rig</th>}
                    {props.advancedMode && <th id="facksystem">System</th>}
                    {props.advancedMode && <th id="facktax">Facility tax</th>}
                    <th>Copy</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoaded && Array.isArray(material.materialsList) ? (
                    material.materialsList.map((mat, index) =>
                      render(material.name, mat, index)
                    )
                  ) : (
                    <Spinner></Spinner>
                  )}
                </tbody>
              </Table>
            </td>
          </tr>
        </Collapse>
      </>
    );
  }
  // END RESULT
  return (
    <>
      {props.errorMessage ? (
        <Alert>{props.errorMessage}</Alert>
      ) : (
        displayResult()
      )}
    </>
  );
}

export default Calculator;
