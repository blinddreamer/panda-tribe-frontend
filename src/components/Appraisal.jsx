import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import axios from "axios";

function Appraisal() {
  const [onStart, setOnstart] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState([{}]);
  const [appraisal, setAppraisal] = useState({});
  const [errorMessage, setErrorMessage] = useState();
   const backend = "https://api.eve-helper.com/api/v1/";
   //const backend = "http://thunder:8080/api/v1/";
  useEffect(() => {
    onStart && getRegions();
    setOnstart(false);
  });

  async function getRegions() {
    const response = await axios.get(backend + "regions");
    if (response.status === 200) {
      setRegions(response.data);
    }
  }
  function formatPrice(price) {
    if (price >= 1e6) { // If price is million or more
      return (price / 1e6).toFixed(1) + "M"; // Convert to million and add "m"
    } else if (price >= 1e3) { // If price is thousand or more
      return (price / 1e3).toFixed(1) + "K"; // Convert to thousand and add "k"
    } else {
      return price.toFixed(0); // Otherwise, return as it is
    }
  }

  async function calculateAppraisal(){
    setErrorMessage();
    try { 
    setIsLoading(true);
    const text = document.getElementById("appraisal").value;
    const lines = text.split(`\n`);
    const items = [];
    lines.forEach(line => {
    if (line.trim() !== ""){
      const [quantity, itemName] = line.split(/\s+(.+)/);
      const item = {quantity: quantity.trim(), name: itemName.trim() }
      items.push(item);
    }
    });
    const region = document.getElementById("marketRegion").value;
    const data = await axios.post(backend + "appraisal", {appraisalRequestEntityList: items, regionId: region});
    if (data.status != 200){
      throw new Error(`Server Error: ${response.statusText}`);
    }
    setAppraisal(data.data);
  }catch(error){
    setErrorMessage(error.message);

  }finally{
    setIsLoading(false);
  }
}

  function renderResult(){
    if(appraisal.appraisals){
    let volumeFormat = new Intl.NumberFormat();  
    let priceFormat = new Intl.NumberFormat('en-US')
      return(
        <>
        <h3>Estimate volume: {volumeFormat.format(appraisal.totalVolume)} m³ Estimate sell: {formatPrice(appraisal.estimateTotalSell)} ISK Estimate buy: {formatPrice(appraisal.estimateTotalBuy)} ISK</h3>
        <Table striped bordered hover size="sm">
          <thead><tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit Volume</th>
            <th>Total Volume</th>
            <th>Sell Price</th>
            <th>Total Sell Price</th>
            <th>Buy Price</th>
            <th>Total Buy Price</th>
            </tr>
          </thead>
          <tbody>
        {appraisal.appraisals.map((ap,index) => 
          <tr key={index}><td><img src={ap.icon} loading="lazy"/>{ap.item}</td><td>{ap.quantity}</td>
          <td>{volumeFormat.format(ap.volume)} m³</td><td>{volumeFormat.format(ap.quantity*ap.volume)} m³ </td>
          <td>{priceFormat.format(ap.sellOrderPrice)}</td>
          <td>{priceFormat.format(ap.quantity*ap.sellOrderPrice)}</td>
          <td>{priceFormat.format(ap.buyOrderPrice)}</td>
          <td>{priceFormat.format(ap.quantity * ap.buyOrderPrice)}</td></tr>)}
        </tbody>
        </Table>
        </>
        ) 
      }
  }

  return (
    <>
    <div id="appraisalForm">
      {errorMessage && <Alert>{errorMessage}</Alert>}
      <Form>
      <Form.Group controlId="appraisal">
        <Form.Label>Appraisal:</Form.Label>
        <Form.Control
         key="appraisal" 
          as="textarea"
          name="appraisal"
          placeholder="Paste a list of items from ingame"
        />
      </Form.Group>
      <Form.Group controlId="marketRegion">
        <Form.Label>Market Region:</Form.Label>
        <Form.Select  key="appraisal-select" aria-label="Default select example">
          {regions.map((region,index) => {
            return (
              <option
              key={index}
              selected={region.regionId == 10000002}
                value={region.regionId}
              >
                {region.regionName}
              </option>
            );
          })}
        </Form.Select>
      </Form.Group>
      <Button variant="secondary" onClick={calculateAppraisal}>
        {isLoading ? (
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

      </div>
      <div id="appraisalResponse">
        
       {renderResult()}

      </div>
    </>
  );
}
export default Appraisal;
