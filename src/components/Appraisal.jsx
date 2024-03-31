import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner"
import axios from "axios";

function Appraisal() {
  const [onStart, setOnstart] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState([{}]);
  const [appraisals, setAppraisals] = useState([]);
   // const backend = "https://api.eve-helper.com/api/v1/";
   const backend = "http://thunder:8080/api/v1/";
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
  async function calculateAppraisal(){
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
      console.log("Kofti trupka")
    }
    setAppraisals(data.data.appraisals);
    setIsLoading(false);
  }

  return (
    <>
    <div>
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
      <div id="response">
       {appraisals && 
         appraisals.map(ap => {
       return (<p>`Item: ${ap.item} volume: ${ap.quantity*ap.volume} sell order: ${ap.quantity*ap.sellOrderPrice} buy order: ${ap.quantity* ap.buyOrderPrice}`  </p>)
       })
       }   

      </div>
    </>
  );
}
export default Appraisal;
