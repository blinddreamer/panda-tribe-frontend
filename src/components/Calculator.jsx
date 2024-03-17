import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Collapse, Alert, Spinner } from 'react-bootstrap';
import {ArrowBarDown, ArrowBarUp} from 'react-bootstrap-icons';
import axios from 'axios';

function Calculator() {
  // INITIALISE STATE PARAMETERS
  const [openState, setOpenState] = useState({});
  const [initialBlueprint,setInitialBlueprint] = useState({});
  const [materialsList, setMaterialsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState({});
 

  // SET PAGE TITLE
  useEffect(() => {
    document.title = 'Eve Industry Calculator'; // Set the new title
  }, []);

  // HANDEL MATERIAL DISCOUNT FORM 
  const handleInputChange = async (material,e) => {
    const tempId = e.target.id;
    const splitedId = tempId.split(/_(.*)/s);
    const parent_id = splitedId[1];
    const id = splitedId[0];
    const colId = "col_"+ parent_id;
    let blueprintMe='';
    let buildingRig='';
    let building = '';
    let system = '';
    let facilityTax;
    if(id === "me"){
      blueprintMe = e.target.value;
      buildingRig = document.getElementById("rig_"+parent_id).value;
      building = document.getElementById("build_"+parent_id).value;
      system = document.getElementById("system_"+parent_id).value;
      facilityTax = document.getElementById("facility_"+parent_id).value;
    }
    if(id === "rig"){
      blueprintMe = document.getElementById("me_"+parent_id).value;
       buildingRig = e.target.value;
       building = document.getElementById("build_"+parent_id).value;
       system = document.getElementById("system_"+parent_id).value;
       facilityTax = document.getElementById("facility_"+parent_id).value;
    }
    if(id === "build"){
      blueprintMe = document.getElementById("me_"+parent_id).value;
      buildingRig = document.getElementById("rig_"+parent_id).value;
      system = document.getElementById("system_"+parent_id).value;
      facilityTax = document.getElementById("facility_"+parent_id).value;
      building = e.target.value;
    }
    if(id === "system"){
      blueprintMe = document.getElementById("me_"+parent_id).value;
      buildingRig = document.getElementById("rig_"+parent_id).value;
      system = e.target.value;
      facilityTax = document.getElementById("facility_"+parent_id).value;
      building = document.getElementById("build_"+parent_id).value;
    }
    if(id === "facility"){
      blueprintMe = document.getElementById("me_"+parent_id).value;
      buildingRig = document.getElementById("rig_"+parent_id).value;
      system = document.getElementById("system_"+parent_id).value;
      facilityTax = e.target.value;
      building = document.getElementById("build_"+parent_id).value;
    }
    try {
      const response = await axios.post("http://localhost:8080/api/v1/type", { blueprintName: material.name, quantity: material.jobsCount, blueprintMe: blueprintMe, buildingRig: buildingRig, building: building, system: system, facilityTax: facilityTax  });
      if (response.status !== 200) {
        throw new Error(`Server Error: ${response.statusText}`);
      }
      const data = response.data;
      material.craftPrice = data.craftPrice;
      material.materialsList = data.materialsList;
      setMaterialsList(...[materialsList]);
      updateLoadedData(colId);
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage(error.message);
    }
  };

  // COPY FUNCTION 
async function handleCopy(material,id) {
  try {
    const textToCopy = material.materialsList.map(mat => `${mat.name} x ${mat.quantity}`).join("\n");
    await navigator.clipboard.writeText(textToCopy);
    setIsCopied({[id]: true});
  } catch (error) {
    console.error('Error copying text: ', error);
    alert('Failed to copy text.');
  }
}
  // INITIAL BACKEND CALL TO OBTAIN INITIAL DATA
  const submitForm = async () => {
    let blueprint = document.getElementById("blueprintName").value;
    let building = document.getElementById("building").value;
    let quantity = document.getElementById("quantity").value;
    let buildingRig = document.getElementById("buildingRig").value;
    let blueprintMe = document.getElementById("blueprintMe").value;
    let system = document.getElementById("systemName").value;
    let facilityTax = document.getElementById("facility").value;
    setOpenState({})
    setIsLoading(true);
    try {
      
      const response = await axios.post("http://localhost:8080/api/v1/type", {blueprintName: blueprint, quantity: quantity, blueprintMe: blueprintMe, buildingRig: buildingRig, building: building, system: system, facilityTax: facilityTax});
      if (response.status !== 200) {
        throw new Error(`Server Error: ${response.statusText}`);
      }
      setErrorMessage('');
      const data = response.data;
      setMaterialsList(data.materialsList);
      setInitialBlueprint(data);
      } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage("Item '"+ blueprint+"' not found in database !");
    }
    setIsLoading(false)
  };

  const craftPrice = ()=> {
    const price = initialBlueprint.materialsList.reduce((accumulator, mat, index) => {
      const elementId = ("card_"+initialBlueprint.name + "_" + mat.name + index).replace(" ","_");
      const state = openState[elementId]
      return accumulator + (mat.craftPrice && state ? mat.craftPrice : mat.sellPrice);
  }, 0);
    return price;
  };
  // BACKEND CALL FOR THE SUBMATERIALS DATA
  async function getSubmatsData(material,colId) {
    if (!Array.isArray(material.materialsList)) {
      try {
        const response = await axios.post("http://localhost:8080/api/v1/type", { blueprintName: material.name, quantity: material.jobsCount });
        if (response.status !== 200) {
          throw new Error(`Server Error: ${response.statusText}`);
        }
        const data = response.data;
        material.craftPrice = data.craftPrice;
        material.materialsList = data.materialsList;
        setMaterialsList(...[materialsList]);
        updateLoadedData(colId);
      } catch (error) {
        console.error("Error:", error.message);
        setErrorMessage(error.message);
      }
    }
  
   };

   // COLLABSIBLE TOGGLING 
  const toggleCollapsible = (id,isCreatable) => {
     if(isCreatable){
    setOpenState(prevState => ({
      ...prevState,
      [id]: !prevState[id] // Toggle the state for the given ID
    }));
    }
    };
    // UPDATE LOADED DATA
    const updateLoadedData = (id) => setIsDataLoaded(prevState => ({
      ...prevState,
      [id]: true
    }));

    // DISPLAY RESULT
    const displayResult = ()=> {
      return (<> 
      {initialBlueprint.materialsList && <div id='blueprintHeader'><h1>Materials for creating {initialBlueprint.quantity} <img src={initialBlueprint.icon} loading="lazy"/> {initialBlueprint.name}. Material price: {craftPrice().toLocaleString('en-US', {
        style: 'currency',
        currency: 'ISK', 
        minimumFractionDigits: 2 })} Sell order price: {initialBlueprint.sellPrice.toLocaleString('en-US', {
          style: 'currency',
          currency: 'ISK', 
          minimumFractionDigits: 2 })} 
          <Button className="btn btn-primary" onClick={() => handleCopy(initialBlueprint, "copy_"+initialBlueprint.name)} disabled={isCopied["copy_"+initialBlueprint.name]}>{!isCopied["copy_"+initialBlueprint.name] ? "Copy": "Copied"}</Button></h1></div>}
      {materialsList.map((mat,index)=>render(initialBlueprint,mat,index))}</>);
    }

 
 
    // RENDER MATERIALS 
    function render (parent, material, index) {
    const id = (parent.name + "_"+ material.name+index).replace(" ","_"); // Unique ID for the card
    const openId = "card_"+id;
    const colId = "col_"+ id;
    const isOpen = openState[openId]; // Get the open state for the card
    const isLoaded = isDataLoaded[colId]
    
    return (
      <>
      <div className='card d-grid gap-3 border border-primary shadow p-3 mb-5'>
      <Card.Header className={`card-header border border-secondary ${isOpen ? "collapsed": ""}`}  key={`header_${id}`}>
      {material.isCreatable && isOpen && <Button id={`copy_${id}`} onClick={()=>handleCopy(material,"copy_"+id)} disabled={isCopied["copy_"+id]}>{!isCopied["copy_"+id] ? "Copy" : "Copied"}</Button>}
      <p> <img src={material.icon} loading="lazy" />{material.name}</p> 
             <p>Quantity: {material.quantity} </p>
             <p>Crafting Jobs: {material.jobsCount}</p>
             <p>Volume: {material.volume} m³</p>
             <p>Market price: {material.sellPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'ISK', 
    minimumFractionDigits: 2 })}</p>
            {material.craftPrice && <p id={id}>Crafting price: {material.craftPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'ISK', 
    minimumFractionDigits: 2 })}</p>}
      {material.isCreatable && <div className='card-form'>
        <Form>
        <Form.Group controlId={`me_${id}`}>
          <Form.Label>Blueprint ME:</Form.Label>
          <Form.Control type="number" min={0} name={`me_${id}`} placeholder='0' onChange={(e)=>handleInputChange(material,e)}/>
        </Form.Group>
        <Form.Group controlId={`build_${id}`}>
        <Form.Label>Building:</Form.Label>
        <Form.Select aria-label="Default select example" onChange={(e)=> handleInputChange(material,e)}>
      <option value="0">Select Building</option>
      <option value="1">Azbel</option>
      <option value="2">Raitaru</option>
      <option value="3">Sotiyo</option>
    </Form.Select>

        </Form.Group>
        <Form.Group controlId={`rig_${id}`}>
          <Form.Label>Building Rig:</Form.Label>
          <Form.Select aria-label="Default select example" onChange={(e)=>handleInputChange(material,e)}>
      <option value="0">Select Building Rig</option>
      <option value="1">T1</option>
      <option value="2">T2</option>
      </Form.Select>
        </Form.Group>

     
        <Form.Group controlId={`system_${id}`}>
          <Form.Label>System:</Form.Label>
          <Form.Control type="text" name={`system_${id}`} placeholder='Jita' onChange={(e)=>handleInputChange(material,e)} />
        </Form.Group>
        <Form.Group controlId={`facility_${id}`}>
          <Form.Label>Facility tax:</Form.Label>
          <Form.Control type="number" min={0}  name={`facility_${id}`} placeholder='0' onChange={(e)=>handleInputChange(material,e)} />
        </Form.Group>
        </Form>
        {material.isCreatable && (!isOpen ? <ArrowBarDown aria-controls={`card_${id}`} aria-expanded={isOpen} onClick={() => toggleCollapsible("card_"+id,material.isCreatable)}></ArrowBarDown>: <ArrowBarUp aria-controls={`card_${id}`} aria-expanded={isOpen} onClick={() => toggleCollapsible("card_"+id,material.isCreatable)}></ArrowBarUp>)}
        </div>}
      </Card.Header>
      <Collapse id={colId}  in={isOpen} onEnter={()=>getSubmatsData(material, colId)} timeout={10}>
      <Card.Body className='card-body border border-secondary' key={`card_${id}`} id={`card_${id}`}>
         {isLoaded && Array.isArray(material.materialsList) ? material.materialsList.map((mat,index)=>render(material.name,mat,index)):<Spinner></Spinner>}
        </Card.Body>
      </Collapse>
      </div>
      </>
    )

  }
  // END RESULT
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
          <Form.Control type="text" name="systemName" placeholder='Enter sytem name.Default Jita' />
        </Form.Group>
        <Form.Group controlId="facility">
          <Form.Label>Facility tax:</Form.Label>
          <Form.Control type="number" min={0} name="facility" placeholder='Enter facility tax. Default 0' />
        </Form.Group>
        <Button variant="primary" onClick={submitForm}>{isLoading ? (
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
)}</Button>
      </Form>
      {errorMessage ? <Alert>{errorMessage}</Alert> : displayResult() }
      </div>
  );
}

export default Calculator;
