import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Alert  from "react-bootstrap/Alert";

function Calculator(props){

    function displayCommon(){
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
        <Table>
          <thead>
            <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Volume m³</th>
                    <th>Market Cost ISK</th>
            </tr>
            </thead>
            <tbody>
              {props.materialsList.map((mat,index) => {
               return( <tr key={index}>
                  <td><img src={mat.icon} loading="lazy" /></td>
                  <td>{mat.name}</td>
                  <td>{mat.quantity}</td>
                  <td>{mat.volume}</td>
                  <td>{mat.sellPrice}/{mat.quantity*mat.sellPrice}</td>
                </tr> )
              })}              
           </tbody>
          

        </Table>)}
        </>
      
    )}

    function displayParts(){

    }

    function displayReactions(){

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