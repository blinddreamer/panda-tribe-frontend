// import 'bootstrap/dist/css/bootstrap.min.css';
// import React, { useState } from 'react';
// import {} from 'react-bootstrap';

// function CalculatorForm() {
//   const [formData, setFormData] = useState({
//     blueprintName: '',
//     quantity: '',
//     blueprintMe: '',
//     buildingRig: '',
//     building: ''
//   });

//   const [blueprintHeader, setBlueprintHeader] = useState('');
//   const [blueprintTable, setBlueprintTable] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const submitForm = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/api/v1/type", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error(`Server Error: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setBlueprintHeader(`<h1>Materials for creating ${data.quantity} <img src="${data.icon}" loading="lazy">${data.blueprintName}. Material price in ISK: "${data.craftPrice}" Sell order price in ISK: ${data.sellPrice}</h1>`);
//       setBlueprintTable(createTable(data.materialsList, data.blueprintName));
//     } catch (error) {
//       console.error("Error:", error.message);
//     }
//   };

//   const createTable = (materialsList, parentName) => {
//     let tableHtml = "<table border='1'>";
//     tableHtml += "<tr><th>Icon</th><th>Material Name</th><th>Needed Quantity</th><th>Jobs Count</th><th>Sell Price</th><th>Volume</th><th>Blueprint Discount</th><th>Building Discount</th><th>Rig Discount</th></tr>";

//     if (Array.isArray(materialsList)) {
//       materialsList.forEach(material => {
//         const tempId =  parentName + material.name;
//         const materialId = tempId.replace(/[^a-zA-Z0-9-_]/g, '_');
//         tableHtml += `<tr><td><img src="${material.icon}" loading="lazy"></td><td>${material.name}</td><td id='quantity_${materialId}'>${material.neededQuantity}</td><td>${material.jobsCount}</td><td id='sell${materialId}'>${material.sellPrice}</td><td>${material.volume}</td>`;
//         if (material.subMaterials) {
//           tableHtml += `<td><input type='number' id='blueprintDiscount_${materialId}' onChange={updateDiscount}></td>`;
//           tableHtml += `<td><input type='number' id='buildingDiscount_${materialId}' onChange={updateDiscount}></td>`;
//           tableHtml += `<td><input type='number' id='rigDiscount_${materialId}' onChange={updateDiscount}></td>`;
//         } else {
//           tableHtml += "<td></td><td></td><td></td>";
//         }
//         tableHtml += "</tr>";
//         if (material.subMaterials) {
//           tableHtml += `<tr><td colspan='6'><div class='collapsible' onClick={(e) => toggleCollapsible(e, "${materialId}", "${material.jobsCount}", "${material.name}")}>Submaterials (click to expand)</div>`;
//           tableHtml += `<div class='content' id='subMaterial_${materialId}' style={{display: 'none'}}></div></td><td id ='parentSellPrice_${materialId}'></td></tr>`;
//         }
//       });
//     }

//     tableHtml += "</table>";
//     return tableHtml;
//   };

//   const toggleCollapsible = async (e, materialId, jobsCount, materialName) => {
//     const content = document.getElementById(`subMaterial_${materialId}`);
//     if (content.style.display === "none" && !content.innerHTML) {
//       const blueprintMe = document.getElementById(`blueprintDiscount_${materialId}`).value;
//       const building = document.getElementById(`buildingDiscount_${materialId}`).value;
//       const buildingRig = document.getElementById(`rigDiscount_${materialId}`).value;
//       const quantity = jobsCount;
//       const blueprintName = materialName;
//       const request = {
//         quantity,
//         blueprintName,
//         building,
//         buildingRig,
//         blueprintMe
//       };

//       try {
//         const response = await fetch("http://localhost:8080/api/v1/type", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(request),
//         });

//         if (!response.ok) {
//           throw new Error(`Server Error: ${response.statusText}`);
//         }

//         const updatedQuantities = await response.json();
//         const subMaterialsHtml = createTable(updatedQuantities.materialsList, materialId);
//         content.innerHTML = subMaterialsHtml;
//       } catch (error) {
//         console.error("Error:", error.message);
//       }
//     }

//     content.style.display = content.style.display === "none" ? "block" : "none";
//   };

//   const updateDiscount = async (e) => {
//     const materialId = e.target.id.split('_')[1];
//     const content = document.getElementById(`subMaterial_${materialId}`);
//     if (content.style.display === "none") {
//       // If the content is hidden, do nothing
//       return;
//     }
//     const blueprintMe = document.getElementById(`blueprintDiscount_${materialId}`).value;
//     const building = document.getElementById(`buildingDiscount_${materialId}`).value;
//     const buildingRig = document.getElementById(`rigDiscount_${materialId}`).value;
//     const quantity = e.target.parentElement.parentElement.previousElementSibling.children[2].innerHTML;
//     const blueprintName = e.target.parentElement.parentElement.previousElementSibling.children[1].innerHTML;
//     const request = {
//       quantity,
//       blueprintName,
//       building,
//       buildingRig,
//       blueprintMe
//     };

//     try {
//       const response = await fetch("http://localhost:8080/api/v1/type", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(request),
//       });

//       if (!response.ok) {
//         throw new Error(`Server Error: ${response.statusText}`);
//       }

//       const updatedQuantities = await response.json();
//       const subMaterialsHtml = createTable(updatedQuantities.materialsList, materialId);
//       const content = document.getElementById(`subMaterial_${materialId}`);
//       if (content) {
//         content.innerHTML = subMaterialsHtml;
//       }
//     } catch (error) {
//       console.error("Error:", error.message);
//     }
//   };

//   return (
//     <div>
//       <form id="calculatorForm">
//         <label htmlFor="blueprintName">Blueprint Name:</label>
//         <input type="text" id="blueprintName" name="blueprintName" value={formData.blueprintName} onChange={handleInputChange} required /><br />

//         <label htmlFor="quantity">Quantity:</label>
//         <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} required /><br />

//         <label htmlFor="blueprintMe">Blueprint ME:</label>
//         <input type="number" id="blueprintMe" name="blueprintMe" value={formData.blueprintMe} onChange={handleInputChange} required /><br />

//         <label htmlFor="buildingRig">Building Rig:</label>
//         <input type="text" id="buildingRig" name="buildingRig" value={formData.buildingRig} onChange={handleInputChange} required /><br />

//         <label htmlFor="building">Building:</label>
//         <input type="number" id="building" name="building" value={formData.building} onChange={handleInputChange} required /><br />

//         <button type="button" onClick={submitForm}>Submit</button>
//       </form>
//       <div id="blueprintHeader" dangerouslySetInnerHTML={{ __html: blueprintHeader }}></div>
//       <div id="blueprintTable" dangerouslySetInnerHTML={{ __html: blueprintTable }}></div>
//     </div>
//   );
// }

// export default CalculatorForm;
