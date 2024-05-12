import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Alert  from "react-bootstrap/Alert";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";

import { GiBasket } from "react-icons/gi";
import AdvancedModeToggle from "../AdvancedModeToggle";
import axios from "axios";
function Calculator(props){
const [isCopied, setIsCopied] = useState({});
const [isLoading, setIsLoading] = useState(false);




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
                    ? "negativeprice"
                    : "positiveprice"
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
          {generateTable(props.materialsList.filter(mat=>mat.tier==0), 1)}
          {props.materialsList.filter(mat=> mat.tier==1).length>0 && generateTable(props.materialsList.filter(mat=> mat.tier==1), 2)}
          {props.materialsList.filter(mat=> mat.tier==2).length>0 && generateTable(props.materialsList.filter(mat=> mat.tier==2), 3)}
          {props.materialsList.filter(mat=> mat.tier==3).length>0 && generateTable(props.materialsList.filter(mat=> mat.tier==3), 4)}
          {props.materialsList.filter(mat=> mat.tier==4).length>0 && generateTable(props.materialsList.filter(mat=> mat.tier==4), 5)}
          {props.fuelList.length>0 && generateTable(props.fuelList, "fuelPart")}
          {props.materialsList.filter(mat=> mat.tier ==="fuelPart").length>0 && generateTable(props.materialsList.filter(mat=> mat.tier ==="fuelPart"), 6)}
          <Modal size="sm" className="loadingModal" centered={true} show={isLoading}><span className="d-flex justify-content-center"><Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
            />
            <span className="loading">Loading</span></span></Modal>
       </>)}
      </>
      
    )}
    
    function handleCheck(material){
      material.checked = !material.checked;
      let updatedMaterialsList = [...props.materialsList];
      if(material.checked==false){
        material.materialsList.map(mat=> {
          const existingMaterial = updatedMaterialsList.find((item) => item.name === mat.name);
          if(existingMaterial.checked){
           updatedMaterialsList = recursiveRemove(existingMaterial, updatedMaterialsList);
          }
          existingMaterial.quantity -= mat.quantity;
          if (existingMaterial.quantity == 0){
            updatedMaterialsList = updatedMaterialsList.filter(mat => mat.id !== existingMaterial.id);
          }
          
          });
          props.setMaterialsList(updatedMaterialsList);
      } else {
        if(material.materialsList) {
          material.materialsList.map(mat=> {
            const existingMaterial = updatedMaterialsList.find((item) => item.name === mat.name);
            if(existingMaterial) {
              existingMaterial.quantity += mat.quantity;
            } else{
              const matToAdd = JSON.parse(JSON.stringify(mat));
              updatedMaterialsList.push(matToAdd);
            } 
          });
          props.setMaterialsList(updatedMaterialsList);
        } else {

          getSubData(material);
        }
      }
    }
    function recursiveRemove(material, updatedMaterialsList){
      
      
        material.materialsList.map(mat=> {
          const existingMaterial = updatedMaterialsList.find((item) => item.name === mat.name);
          if (existingMaterial.materialsList){
           updatedMaterialsList = recursiveRemove(existingMaterial, updatedMaterialsList);
          }
          existingMaterial.quantity -= mat.quantity;
          if (existingMaterial.quantity == 0){
            updatedMaterialsList = updatedMaterialsList.filter(mat => mat.id !== existingMaterial.id);
          }
      });
      return updatedMaterialsList;
    }
  
    const getParts = (e)=>{
      let tier = e.target.id;
      tier !== "fuelPart" ? getSubmatsData(props.materialsList, tier) :
      getSubmatsData(props.fuelList, tier);
    }

   function generateTable(materialsList, tier){
      let volumeFormat = new Intl.NumberFormat();
      let priceFormat = new Intl.NumberFormat("en-US");
      
    return( 
    <>
    <Table 
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
              <th>Excess</th>
              <th>Buy / Craft</th>
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
                  <td>{mat.activityId == 1 ? "component" : mat.activityId == 11 ? "reaction":"none"}</td>
                  <td>{mat.excessMaterials}</td>
                  <td>
                  <Form.Check
              role={mat.isCreatable ? "button" : ""}
              defaultChecked={mat.checked}
              disabled={!mat.isCreatable}
              id={mat.id}
              key={"key_"+ mat.id}
              type="switch"
              onClick={()=>handleCheck(mat)}
            />
                  </td>
              </tr>
          ))}
      </tbody>
  </Table>
  {/* {props.initialBlueprint.materialsList && 
  <Button id={tier} onClick={(e)=>getParts(e)}> {isLoading[tier] ? (
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
          "Calculate"
        )}</Button>} */}
  </>);
  }
   


    function updateLoadedData(index){
      setPartsLoaded((prevState) => ({
        ...prevState,
        [index]: true,
      }));
    }
    async function getSubData(material){
      try{
        setIsLoading(true);
        const response = await axios.post(props.backend + "type", {
          blueprintName: material.name,
          runs: material.quantity,
          blueprintMe: material.activityId === 11 ? props.formDataReaction.blueprintMe : props.formDataPart.blueprintMe,
          building: material.activityId === 11 ? props.formDataReaction.building : props.formDataPart.building,
          buildingRig: material.activityId === 11 ? props.formDataReaction.buildingRig : props.formDataPart.buildingRig,
          system: material.activityId === 11 ? props.formDataReaction.system : props.formDataPart.system,
          facilityTax: material.activityId === 11 ? props.formDataReaction.facilityTax : props.formDataPart.facilityTax,
      });
        let materials = response.data.materialsList.map(mat=> {
        mat.tier = material.tier + 1 ;
        return mat;
      });
      const materialsSave = JSON.parse(JSON.stringify(materials));
      const materialsDisplay = JSON.parse(JSON.stringify(materials));
      material.materialsList = materialsSave;
      let updateMaterilsList = [...props.materialsList];
      materialsDisplay.map(mat=> {
        let existingMaterial = updateMaterilsList.find((item) => item.name === mat.name);
        if(existingMaterial) {
          existingMaterial.quantity += mat.quantity;
        } else{
          updateMaterilsList.push(mat);
        } 
      });
      props.setMaterialsList(updateMaterilsList);
      }catch(error){
        console.error("Error:", error.message);
        props.setErrorMessage(error.message);
      }finally{
        setIsLoading(false);
      }
    }
    async function getSubmatsData(materialsList, tier) {
      try {
        // setIsLoading((prevState) => ({
        //   ...prevState,
        //   [tier]: !prevState[tier],
        // }));
        setIsLoading(true)
          // Create a copy of the state object
          const newMatList = tier === "fuelPart" ?  props.materialsList : [];
          const newFuelList = [];
          // Map through the keys of the object (assuming each key is a material)
          for (const key of Object.keys(materialsList)) {
              const mat = materialsList[key]; // Get the material object
            if (mat.tier < tier-1){
              mat.isFuel ?
              newFuelList.push(mat) :
              newMatList.push(mat);
              continue;  
            }
            if (mat.tier == tier-1 || mat.tier === "fuel"){
              mat.isFuel ?
              newFuelList.push(mat) :
              newMatList.push(mat);
              
            if (mat.isCreatable && mat.checked) {
                  mat.craft = true;
                  const response = await axios.post(props.backend + "type", {
                      blueprintName: mat.name,
                      runs: mat.quantity,
                      blueprintMe: mat.activityId === 11 ? props.formDataReaction.blueprintMe : props.formDataPart.blueprintMe,
                      building: mat.activityId === 11 ? props.formDataReaction.building : props.formDataPart.building,
                      buildingRig: mat.activityId === 11 ? props.formDataReaction.buildingRig : props.formDataPart.buildingRig,
                      system: mat.activityId === 11 ? props.formDataReaction.system : props.formDataPart.system,
                      facilityTax: mat.activityId === 11 ? props.formDataReaction.facilityTax : props.formDataPart.facilityTax,
                  });
  
                  const materials = response.data.materialsList.map(subMat => {
                      subMat.tier = subMat.isFuel ? "fuel" : tier;
                      subMat.checked = false;
                      let existingMaterial = null;
                      subMat.isFuel ?
                      existingMaterial = newFuelList.find((item) => item.name === subMat.name) : 
                      existingMaterial = newMatList.find((item) => item.name === subMat.name)
                      if (existingMaterial) {
                          existingMaterial.quantity += subMat.quantity;
                      } else {
                        subMat.isFuel ?
                        newFuelList.push(subMat) :
                        newMatList.push(subMat);
                      }
                      return subMat;
                  });
                   // Update the materials list with the new materials
                 mat.materialsList = materials;
                }
                 
              }
          }
  
          // Update the state with the updated object
          
          props.setMaterialsList(newMatList);
          props.setFuelList(newFuelList);
          // All requests completed successfully
          console.log("All requests completed successfully");
      } catch (error) {
          console.error("Error:", error.message);
          props.setErrorMessage(error.message);
      } finally {
        // setIsLoading((prevState) => ({
        //   ...prevState,
        //   [tier]: !prevState[tier],
        // }));
        setIsLoading(false);
      }
  }
      
    return (
<>
      {props.errorMessage ? (
        <Alert>{props.errorMessage}</Alert>
      ) : (
        displayCommon()
        
      )}
      
      </>
    )
}
export default Calculator;