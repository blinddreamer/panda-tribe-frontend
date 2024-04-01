import Table from "react-bootstrap/Table";

function AppraisalResult(props){
    let volumeFormat = new Intl.NumberFormat();  
    let priceFormat = new Intl.NumberFormat('en-US')
    
function formatPrice(price) {
        if (price >= 1e6) { // If price is million or more
          return (price / 1e6).toFixed(1) + "M"; // Convert to million and add "m"
        } else if (price >= 1e3) { // If price is thousand or more
          return (price / 1e3).toFixed(1) + "K"; // Convert to thousand and add "k"
        } else {
          return price.toFixed(0); // Otherwise, return as it is
        }
      }
      
return(
    <div id="appraisalResponse">
    <h3>Estimate volume: {volumeFormat.format(props.appraisal.totalVolume)} m³ Estimate sell: {formatPrice(props.appraisal.estimateTotalSell)} ISK Estimate buy: {formatPrice(props.appraisal.estimateTotalBuy)} ISK</h3>
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
    {props.appraisal.appraisals.map((ap,index) => 
      <tr key={index}><td><img src={ap.icon} loading="lazy"/>{ap.item}</td><td>{ap.quantity}</td>
      <td>{volumeFormat.format(ap.volume)} m³</td><td>{volumeFormat.format(ap.quantity*ap.volume)} m³ </td>
      <td>{priceFormat.format(ap.sellOrderPrice)}</td>
      <td>{priceFormat.format(ap.quantity*ap.sellOrderPrice)}</td>
      <td>{priceFormat.format(ap.buyOrderPrice)}</td>
      <td>{priceFormat.format(ap.quantity * ap.buyOrderPrice)}</td></tr>)}
    </tbody>
    </Table>
    </div>
)
}
export default AppraisalResult;