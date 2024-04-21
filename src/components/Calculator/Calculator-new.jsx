import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Alert  from "react-bootstrap/Alert";
import Button from 'react-bootstrap/Button';
import { GiBasket } from "react-icons/gi";
import AdvancedModeToggle from "../AdvancedModeToggle";
import axios from "axios";
function Calculator(props){
const [isCopied, setIsCopied] = useState({});
const [parts, setIsParts] = useState(false);
const [partsLoaded, setPartsLoaded] = useState({});
const [outputParts, setOutputParts] = useState([]);
const [reactions, setReaactions] = useState(false);
  function craftPrice(material){
    const price = material.materialsList.reduce((accumulator, mat, index) => {
      return (
        accumulator + mat.sellPrice * mat.quantity
      );
    }, 0);
    return price + material.industryCosts;
  }

    function displayCommon(){
      let volumeFormat = new Intl.NumberFormat();
      let priceFormat = new Intl.NumberFormat("en-US");
      return (
        <>
        {!props.initialBlueprint.materialsList && (
          <div id="start-message">
            <Alert variant="success">
              Choose blueprint or reaction formula to start.
            </Alert>
          </div>
        )}

        {props.initialBlueprint.materialsList && (
          <>
                 <div id="blueprintHeader">
            <div>
              <img
                id="propimage"
                src={props.initialBlueprint.icon}
                loading="lazy"
              />{" "}
            </div>
            <div id="propvolume">
              Volume :{" "}
              {volumeFormat.format(props.initialBlueprint.volume) + " m³"}
              <p id="bpheader" />
              Crafting price:{" "}
              {craftPrice(
                props.initialBlueprint
                ).toLocaleString("en-US", {
                style: "currency",
                currency: "ISK",
                minimumFractionDigits: 2,
              })}{" "}
              <p id="bpheader" />
              Sell order :{" "}
              {props.initialBlueprint.sellPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "ISK",
                minimumFractionDigits: 2,
              })}
              <p id="bpheader" />
              Profit :{" "}
              <span
                className={
                  props.initialBlueprint.sellPrice -
                    craftPrice(
                      props.initialBlueprint
                    ) <
                  0
                    ? "redmilcho"
                    : "greenmilcho"
                }
              >
                {(
                  props.initialBlueprint.sellPrice -
                  craftPrice(
                    props.initialBlueprint
                  )
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "ISK",
                  minimumFractionDigits: 2,
                })}
              </span>
              <p id="bpheader" />
              Margin :{" "}
              <span
                className={
                  props.initialBlueprint.sellPrice -
                    craftPrice(
                      props.initialBlueprint
                     
                    ) <
                  0
                    ? "redmilcho"
                    : "greenmilcho"
                }
              >
                {(
                  ((props.initialBlueprint.sellPrice -
                    craftPrice(
                      props.initialBlueprint
                      
                    )) /
                    props.initialBlueprint.sellPrice) *
                  100
                ).toFixed(2) + " %"}
              </span>
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
                {!isCopied["copy_" + props.initialBlueprint.name] ? (
                  <>
                    <GiBasket /> Copy Mats
                  </>
                ) : (
                  "Copied"
                )}
              </Button>
              <p />
              <AdvancedModeToggle
                setAdvancedMode={props.setAdvancedMode}
                advancedMode={props.advancedMode}
              />
            </div>
          </div>
          {generateTable(props.materialsList)}
       </>)}
        {props.initialBlueprint.materialsList && <Button disabled={props.initialBlueprint.materialsList[0].activityId==11} onClick={()=>updateParts(props.initialBlueprint)}>Calculate Parts</Button>}
        {props.initialBlueprint.materialsList && <Button onClick={()=> updateReactions()}>Calculate Reactions</Button>}
        </>
      
    )}
    
    function generateOutputParts(materialsList,type){
    let outputResult = [];
    materialsList.forEach((mat, index) => {
        if(mat.isCreatable && partsLoaded[index+type]) {
            mat.materialsList.forEach((newMat) => {
                const existingMaterial = outputResult.find((item) => item.name === newMat.name);
                if (existingMaterial) {
                    existingMaterial.quantity += newMat.quantity;
                } else {
                    outputResult.push(newMat);
                }
            });
        }
    });
    return outputResult;
  }  
  function displayParts(material){
      let outputResult = generateOutputParts(material.materialsList,"parts");
      return generateTable(outputResult);
  }

  function generateTable(materialsList){
      let volumeFormat = new Intl.NumberFormat();
      let priceFormat = new Intl.NumberFormat("en-US");
    return( <Table 
      bordered
      hover
      size="sm">
      <thead>
          <tr>
              <th>#</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Volume m³</th>
              <th>Market Cost ISK per unit/total</th>
              <th>Activity</th>
          </tr>
      </thead>
      <tbody>
          {materialsList.map((mat, index) => (
              <tr key={index}>
                  <td><img src={mat.icon} loading="lazy" alt={mat.name} /></td>
                  <td>{mat.name}</td>
                  <td>{volumeFormat.format(mat.quantity)}</td>
                  <td>{volumeFormat.format(mat.volume * mat.quantity)}</td>
                  <td>{priceFormat.format(mat.sellPrice)} / {priceFormat.format(mat.quantity * mat.sellPrice)}</td>
                  <td>{mat.activityId == 1 ? "part" : mat.activityId == 11 ? "reaction":"none"}</td>
              </tr>
          ))}
      </tbody>
  </Table>);
  }
   
  function updateReactions(){
    getSubmatsData(outputParts, "react");
    setReaactions(true);
  }
   function updateParts(material){
      getSubmatsData(material.materialsList, "parts");
      setOutputParts(generateOutputParts(material.materialsList,"parts"))
      setIsParts(true);
    }
    function displayReactions(outputParts){
      let outputReactResult = generateOutputParts(outputParts, "react");
      return generateTable(outputReactResult);
    }
    function updateLoadedData(index){
      setPartsLoaded((prevState) => ({
        ...prevState,
        [index]: true,
      }));
    }
    async function getSubmatsData(materialsList, type) {
      try {
          materialsList.map(async (mat,index) => {
          if(mat.isCreatable){
          const response =  await axios.post(props.backend + "type", {
            blueprintName: mat.name,
            runs: mat.quantity,
            blueprintMe: mat.activityId == 11 ? 0 : 10,
            building: props.formData.building,
            buildingRig: props.formData.buildingRig,
            system: props.formData.system,
            facilityTax: props.formData.facilityTax,
          }).then()
          if (response.status !== 200) {
            throw new Error(`Server Error: ${response.statusText}`);
          }
          const data = response.data;
          mat.materialsList = data.materialsList;
          
          props.setMaterialsList(...[props.materialsList]);
          updateLoadedData(index+type);
         }
        });
        } catch (error) {
          console.error("Error:", error.message);
          props.setErrorMessage(error.message);
        }
      }
    return (
<>
      {props.errorMessage ? (
        <Alert>{props.errorMessage}</Alert>
      ) : (
        displayCommon()
        
      )}
      {parts && displayParts(props.initialBlueprint)}
      {reactions && displayReactions(outputParts)}
    </>
    )
}
export default Calculator;