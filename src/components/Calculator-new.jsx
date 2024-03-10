import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Collapse, Alert } from 'react-bootstrap';
import {ArrowBarDown, ArrowBarUp} from 'react-bootstrap-icons';
import axios from 'axios';

function Calculator() {
  const [openState, setOpenState] = useState({});
  const [initialBlueprint,setInitialBlueprint] = useState("");
  const [materialsList, setMaterialsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState({});
  const [blueprintHeader,setBlueprintHeader] = useState("");
 
  useEffect(() => {
    document.title = 'Eve Industry Calculator'; // Set the new title
  }, []);

  const handleInputChange = (material,e) => {
    const id = e.target.id;
    if (id="build"){

    }
      const value = e.target.value;
   if (Array.isArray(material.subMaterials)){
      material.subMaterials.map(mat=>{
        mat.quantity = calculateDynamicDiscount(mat.quantity, value)
      })
    }
  };
  function calculateDynamicDiscount(currentQuantity, discountValue){

   // return quantityAfterDiscounts;
  }
  const submitForm = async () => {
    let blueprint = document.getElementById("blueprintName").value;
    let building = document.getElementById("building").value;
    let quantity = document.getElementById("quantity").value;
    let buildingRig = document.getElementById("buildingRig").value;
    let blueprintMe = document.getElementById("blueprintMe").value;
    
    try {
      const response = await axios.post("http://localhost:8080/api/v1/type", {blueprintName: blueprint, quantity: quantity, blueprintMe: blueprintMe, buildingRig: buildingRig, building: building});
      if (response.status !== 200) {
        throw new Error(`Server Error: ${response.statusText}`);
      }
      setErrorMessage('');
      const data = response.data;
      setMaterialsList(data.materialsList);
      setInitialBlueprint(data.blueprintName);
      setBlueprintHeader(`<h1>Materials for creating ${data.quantity} <img src="${data.icon}" loading="lazy"> ${data.blueprintName}. Material price in ISK: "${data.craftPrice}" Sell order price in ISK: ${data.sellPrice}</h1>`);
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage("Item '"+ blueprint+"' not found in database !");
    }
  };

  async function getSubmatsData(material,colId) {
    if (!Array.isArray(material.subMaterials)) {
      try {
        const response = await axios.post("http://localhost:8080/api/v1/type", { blueprintName: material.name, quantity: material.jobsCount });
        if (response.status !== 200) {
          throw new Error(`Server Error: ${response.statusText}`);
        }
        const data = response.data;
        material.subMaterials = data.materialsList;
        setMaterialsList(...[materialsList]);
        updateLoadedData(colId);
      } catch (error) {
        console.error("Error:", error.message);
        setErrorMessage(error.message);
      }
    }
  
   };
  const toggleCollapsible = (id,subMaterials) => {
     if(subMaterials){
    setOpenState(prevState => ({
      ...prevState,
      [id]: !prevState[id] // Toggle the state for the given ID
    }));
    }
    };
    const updateLoadedData = (id) => setIsDataLoaded(prevState => ({
      ...prevState,
      [id]: true
    }));
    const displayResult = ()=> {
      return (<> <div id="blueprintHeader" dangerouslySetInnerHTML={{ __html: blueprintHeader }}></div>
      {materialsList.map((mat,index)=>render(initialBlueprint,mat,index))}</>);
    }

  function render (parent, material, index) {
    
    const id = parent + "_"+ material.name+index; // Unique ID for the card
    const openId = "card_"+id;
    const colId = "col_"+ id;
    const isOpen = openState[openId]; // Get the open state for the card
    const isLoaded = isDataLoaded[colId]
    return (
      <>
      <div className='card d-grid gap-3 border border-primary shadow p-3 mb-5'>
      <Card.Header className={`card-header border border-secondary ${isOpen ? "collapsed": ""}`}  key={`header_${id}`}>
      <p> <img src={material.icon} loading="lazy" />{material.name}</p> 
             <p>Quantity: {material.neededQuantity} </p>
             <p>Crafting Jobs: {material.jobsCount}</p>
             <p>Volume: {material.volume}</p>
             <p>Market price: {material.sellPrice}</p>
             <p id={id}>Crafting price: </p>
      {material.subMaterials && <div className='card-form'>
        <Form>
        <Form.Group controlId={`me`}>
          <Form.Label>Blueprint ME:</Form.Label>
          <Form.Control type="number" min={0} name="card_me" placeholder='0' onChange={handleInputChange}/>
        </Form.Group>

        <Form.Group controlId={`rig`}>
          <Form.Label>Building Rig:</Form.Label>
          <Form.Control type="number"  name="card_rig" min={0} step={.1} placeholder='0' onChange={handleInputChange} />
        </Form.Group>

        <Form.Group controlId={`build`}>
          <Form.Label>Building:</Form.Label>
          <Form.Control type="number" min={0}  name="card_build" placeholder='0' onChange={(e)=>handleInputChange(material,e)} />
        </Form.Group>
        </Form>
        {material.subMaterials && (!isOpen ? <ArrowBarDown aria-controls={`card_${id}`} aria-expanded={isOpen} onClick={() => toggleCollapsible("card_"+id,material.subMaterials)}></ArrowBarDown>: <ArrowBarUp aria-controls={`card_${id}`} aria-expanded={isOpen} onClick={() => toggleCollapsible("card_"+id,material.subMaterials)}></ArrowBarUp>)}
        </div>}
      </Card.Header>
      <Collapse id={colId}  in={isOpen} onEnter={()=>getSubmatsData(material, colId)} timeout={10}>
      <Card.Body className='card-body border border-secondary' key={`card_${id}`} id={`card_${id}`}>
         {isLoaded && Array.isArray(material.subMaterials) && material.subMaterials.map((mat,index)=>render(material.name,mat,index))}
        </Card.Body>
      </Collapse>
      </div>
      </>
    )

  }
  return (
    <div className='d-grid gap-5'>
      <Form>
        <Form.Group controlId="blueprintName">
          <Form.Label>Blueprint Name:</Form.Label>
          <Form.Control type="text" name="blueprintName" placeholder='Enter material name'/>
        </Form.Group>
        <Form.Group controlId="quantity">
          <Form.Label>Quantity:</Form.Label>
          <Form.Control type="number" min={1} name="quantity" placeholder='Enter quantity number. Default 1' />
        </Form.Group>

        <Form.Group controlId="blueprintMe">
          <Form.Label>Blueprint ME:</Form.Label>
          <Form.Control type="number" min={0}  name="blueprintMe" placeholder='Enter blueprint material efficiency. Default 0' />
        </Form.Group>

        <Form.Group controlId="buildingRig">
          <Form.Label>Building Rig:</Form.Label>
          <Form.Control type="number" min={0} step={.1} name="buildingRig" placeholder='Enter building rig number. Default 0' />
        </Form.Group>

        <Form.Group controlId="building">
          <Form.Label>Building:</Form.Label>
          <Form.Control type="number" min={0}  name="building" placeholder='Enter building discount number. Default 0' />
        </Form.Group>
        <Button variant="primary" onClick={submitForm}>Submit</Button>
      </Form>
      {errorMessage ? <Alert>{errorMessage}</Alert> : displayResult() }
      </div>
  );
}

export default Calculator;
