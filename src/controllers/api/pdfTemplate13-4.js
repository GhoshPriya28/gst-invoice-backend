require('dotenv').config();
exports.updatePdf = async finalInvoiceDetails => {
  if (finalInvoiceDetails) {
    const data = finalInvoiceDetails.itemDetails;
    console.log("data",data);
    const neftDatas = finalInvoiceDetails.neftDetail;
    const taxData = finalInvoiceDetails.taxArray;
    const formatedInvoice1 = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tax Invoice</title>
  <style>
    
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
    }
.topSection{
  display:flex;
  
}
    .invoiceclass {
      color: #5D6975;
      text-decoration: underline;
    }

    .body {
      position: relative;
      // width: 21cm;
      // height: 29.7cm;
      margin: 0 auto;
      color: #001028;
      background: #FFFFFF;
      font-family: Arial, sans-serif;
      font-size: 12px;
      font-family: Arial;
      padding:20px;
    }

    .poweredBy {
      position:relative;
      left: 0;
      bottom: 0.6cm;
      width: 100%;
      color: black;
      text-align: left;
    }

    .header {
      padding: 10px 0;
      margin-bottom: 30px;
    }

    h1.invoiceheader {
      border-bottom: 1px solid #5D6975;
      color: #5D6975;
      font-size: 1.2em;
      line-height: 1.4em;
      font-weight: normal;
      text-align: center;
      margin: 0 0 20px 0;
    }

    .terms {
      text-align: justify;
    }

    .neftbox tr {
      border: 1px solid #000000;
      border-collapse: collapse;
      width: 150%;
    }

    #logo {
      text-align: left;
    }

    #logo img {
      width: 120px;
    }

    #qrlogo {
      display: flex;
      align-items: center;
    }

    #qrlogo img {
      width: 80px;
      height: 80px;
    }

    .einvqr img {
      float: right;
    }

    .textqr {
      text-align: right;
      padding: 30px;
    }

    #project {
      float: left;
      width: 100%;
    }

    #project span {
      color: #5D6975;
      white-space: normal;
      width: 68px;
      margin-right: 10px;
      display: inline;
      font-size: 0.9em;
    }

    #company {
      text-align: left;
      width: 100%;
    }

    .strongfont {
      font-size: 1.1em;
    }

    #project div,
    #company div {
      white-space: nowrap;
    }

    #project div {
      font-size: 1.1em;
      padding-top: 0.2rem;
      padding-bottom: 0.2rem;
    }

    .projcolor {
      color: #B4B4B4;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 10px;
    }

    .table tr:nth-child(2n-1) td {
      background: #F5F5F5;
    }

    .table th {
      padding-top: 1.2rem;
      padding-bottom: 0.6rem;
    }

    .table th,
    .table td {
      text-align: center;
    }

    .table th {
      padding: 5px 2px;
      color: #5D6975;
      border-bottom: 1px solid #C1CED9;
      white-space: nowrap;
      font-weight: normal;
    }

    .table .service,
    .table .desc {
      text-align: left;
    }

    .table .headtotal {
      text-align: right;
    }

    .table td {
      padding: 20px 0;
      text-align: right;
    }

    .table td.service,
    .table td.desc {
      vertical-align: top;
    }

    .table td.price,
    .table td.qty,
    .table td.grossTotal,
    .table td.taxPercentage,
    .table td.CGST,
    .table td.SGST,
    .table td.IGST {
      text-align: center;
    }

    .table td.grand {
      border-top: 1px solid #5D6975;
    }

    #notices .notice {
      color: #5D6975;
      font-size: 1.2em;
    }

    .footer {
      color: #5D6975;
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 8px 0;
      text-align: right;
    }

    .boldtotal {
      font-weight: 600;
    }

    .totalPriceContainer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      border-top: 1px solid #5D6975;
    }

    .totalPriceContainer .subtotaleWrap {
      width: 80%;
    }
    .totalPriceContainer .gsttotalwrap {
      width: 40%;
    }
    .totalPriceContainer .grandtotalwrap {
      width: 40%;
    }

    .totalPriceContainer p.pricing {
      text-align: right;
    }

    .totalPriceContainer p.pricing span {
      padding-right: 12px;
    }

    .maindiv {
      display: flex;
    }

    .termsContainer {
      display:flex;
      justify-content:space-between;
      width:100%;
    }
  </style>
</head>
<body class="body">
  <header class="clearfix header pdfheader">
    <h1 class="invoiceheader">TAX INVOICE</h1>
    <div id="logo" class="maindiv">
      

      <table width="100%" style="border-collapse: collapse;">
      <tr>
        <td width="40%" style="background:#eee;padding:10px;">
          <strong>${finalInvoiceDetails.companyName ? finalInvoiceDetails.companyName : 'N/A'}</strong><br>
          <strong>Regd.Office :</strong>  ${finalInvoiceDetails.regdOffice ? finalInvoiceDetails.regdOffice : 'N/A'}<br>
          <strong>Tel No. :</strong> ${finalInvoiceDetails.telNo ? finalInvoiceDetails.telNo : 'N/A'}<br>
          <strong>Website :</strong>  ${finalInvoiceDetails.userWebsite ? finalInvoiceDetails.userWebsite : 'N/A'}<br>
          <strong>GSTIN :</strong>  ${finalInvoiceDetails.clientGSTIN ? finalInvoiceDetails.clientGSTIN : 'N/A'}<br>
        </td>
        <td width="40%" style="background:#eee;padding:20px;">
          <strong>Bill No:</strong> ${finalInvoiceDetails.invoiceId ? finalInvoiceDetails.invoiceId : 'N/A'}<br>
          <strong>Bill Date:</strong> ${finalInvoiceDetails.invoiceDate ? finalInvoiceDetails.invoiceDate : 'N/A'}<br>
          <strong>P.O. No.:</strong> ${finalInvoiceDetails.purchaseOrderNum ? finalInvoiceDetails.purchaseOrderNum : 'N/A'}<br>
          <strong>P.O. Date:</strong> ${finalInvoiceDetails.purchaseOrderDate ? finalInvoiceDetails.purchaseOrderDate : 'N/A'}<br>
        </td>
      </tr>
    </table>
        <img src="${process.env.BASE_URL}uploads/${finalInvoiceDetails.invoiceLogo}" alt="logo" />
      
    </div>
    <hr />
    <div id="project">
      <table style="width:100%;">
        <tr>
          <td class="projcolor">Buyer Name:</td>
          <td>${finalInvoiceDetails.buyerCompanyName ? finalInvoiceDetails.buyerCompanyName : 'N/A'}</td>
          <td class="projcolor" style="visibility:hidden">display</td>
          <td class="projcolor">Contact Person:</td>
          <td style="padding-left:0.6rem">${finalInvoiceDetails.customerName ? finalInvoiceDetails.customerName : 'N/A'}</td>
        </tr>
        <tr>
          <td class="projcolor">GSTIN of Buyer:</td>
          <td>${finalInvoiceDetails.companyGSTIN ? finalInvoiceDetails.companyGSTIN : 'N/A'}</td>
          <td class="projcolor" style="visibility:hidden">display</td>
          <td class="projcolor">Mobile Number:</td>
          <td style="padding-left:0.6rem">${finalInvoiceDetails.customerMobile ? finalInvoiceDetails.customerMobile : 'N/A'}</td>
        </tr>
        <tr>
          <td class="projcolor">Address:</td>
          <td>${finalInvoiceDetails.customerAddress ? finalInvoiceDetails.customerAddress : 'N/A'}</td>
          <td class="projcolor" style="visibility:hidden">display</td>
          <td class="projcolor">Phone Number:</td>
          <td style="padding-left:0.6rem">${finalInvoiceDetails.customerWorkPhone ? finalInvoiceDetails.customerWorkPhone : 'N/A'}</td>
        </tr>
        <tr>
          <td class="projcolor">City:</td>
          <td>${finalInvoiceDetails.city ? finalInvoiceDetails.city : 'N/A'}</td>
          <td class="projcolor" style="visibility:hidden">display</td>
          <td class="projcolor">Email Id:</td>
          <td style="padding-left:0.6rem">${finalInvoiceDetails.customerEmail ? finalInvoiceDetails.customerEmail : 'N/A'}</td>
        </tr>
        <tr>
          <td class="projcolor">Place of Supply(State):</td>
          <td>${finalInvoiceDetails.state ? finalInvoiceDetails.state : 'N/A'}</td>
        </tr>
      </table>
    </div>
  </header>
  <main class="pdfmain">
    <table class="table">
      <thead>
        <tr>
          <th class="service">PRODUCT</th>
          <th>QTY</th>
          <th>PRICE</th>
          <th>G.Amt.</th>
          <th>TAX%</th>
          <th>IGST ₹</th>
          <th>CGST ₹</th>
          <th>SGST ₹</th>
          <th class="headtotal">TOTAL</th>
        </tr>
      </thead>
      <tbody>
      ${data.map(item => {
      console.log("item.taxSubtotal", item.taxSubtotal);
      return ` 
        <tr>
          <td class="service" style="width: fit-content">${item.itemName}</td>
          <td class="qty">${item.itemQuantity}</td>
          <td class="price">${item.itemPrice.toFixed(2)}</td>
          <td class="grossTotal">${(item.itemQuantity * item.itemPrice).toFixed(2)}</td>
          <td class="taxPercentage">${item.itemGstPercentage}</td>
          <td class="IGST">${finalInvoiceDetails.invoiceGstType === 'igst' ? ((item.itemSubtotal * item.itemGstPercentage) / 100).toFixed(2) : 'N/A'}</td>
          <td class="CGST">${finalInvoiceDetails.invoiceGstType === 'cgst' || finalInvoiceDetails.invoiceGstType === 'sgst' ? (item.taxSubtotal / 2).toFixed(2) : 'N/A'}</td>
                <td class="SGST">${finalInvoiceDetails.invoiceGstType === 'cgst' || finalInvoiceDetails.invoiceGstType === 'sgst' ? (item.taxSubtotal / 2).toFixed(2) : 'N/A'}</td>
                <td class="total">${(item.taxSubtotal + item.itemQuantity * item.itemPrice).toFixed(2)}</td>
              </tr>
              ` })}
      </tbody>
    </table>
  
    <div class="totalPriceContainer">
      <div class="subtotaleWrap">
        <p class="boldtotal pricing"><span>SUB TOTAL: </span> ${finalInvoiceDetails.invoiceTotal.toFixed(2)}</p>
      </div>
      <div class="gsttotalwrap">
        <p class="boldtotal pricing"><span>IGST TOTAL: </span> ${finalInvoiceDetails.invoiceGstType === 'igst'? finalInvoiceDetails.igstSum.toFixed(2): 'N/A'}</p>
      </div>
      <div class="gsttotalwrap">
        <p class="boldtotal pricing"><span>CGST TOTAL: </span> ${finalInvoiceDetails.invoiceGstType === 'cgst' || finalInvoiceDetails.invoiceGstType === 'sgst'? (finalInvoiceDetails.igstSum).toFixed(2) / 2: 'N/A'}</p>
      </div>
      <div class="gsttotalwrap">
        <p class="boldtotal pricing"><span>SGST TOTAL: </span> ${finalInvoiceDetails.invoiceGstType === 'cgst'|| finalInvoiceDetails.invoiceGstType === 'sgst' ? (finalInvoiceDetails.igstSum).toFixed(2) / 2: 'N/A'}</p>
      </div>
      <div class="grandtotalwrap">
        <p class="boldtotal pricing"><span>GRAND TOTAL:</span> ${finalInvoiceDetails.invoiceTotalAmounts.toFixed(2)}</p>
      </div>
    </div>
   
  
    <p style="text-align: left">Amount Chargeable(in words)</p>
    <p style="text-align: left"><strong>Indian Rupees &nbsp;${finalInvoiceDetails.totalAmountInWords}&nbsp;Only</strong>
    </p>

    <table border="1" class="neftbox">
      <tr><td><strong>Bank Details</strong></td></tr>
        ${neftDatas.map(neft => {
          console.log("neft",neft);
        return `
        <tr>
          <td><strong>Bank Name : </strong></td>
          <td>${neft.bank_name ? neft.bank_name : 'N/A'}</td>
          <td><strong>IFSC CODE : </strong></td>
          <td>${neft.ifsc_code ? neft.ifsc_code : 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Account Number : </strong></td>
          <td>${neft.account_number ? neft.account_number : 'N/A'}</td>
          <td><strong>Account Holder Name : </strong></td>
          <td>${neft.account_holder ? neft.account_holder : 'N/A'}</td>
          <td><strong>Account Holder Email : </strong></td>
          <td>${neft.account_email ? neft.account_email : 'N/A'}</td>
        </tr>
        ` })}
      <tr>
        <td><strong>Beneficiary name : </strong></td>
        <td>${finalInvoiceDetails.beneficiaryName ? finalInvoiceDetails.beneficiaryName : 'N/A'}</td>
      </tr>
    </table>
    <br />
    <p style="text-align: left"><strong>Payment QR Code</strong></p>
    <img align="middle" src="${process.env.BASE_URL}uploads/${finalInvoiceDetails.paymentQrCode}" alt="qrlogo" style="width:250px;height:250px;" />
    <p id="qrlogo">
      You can make payment through Paytm by scanning the given QR Code or use the mobile number -: 9971167235
    </p>    
  <tr>
  <td><p style="border-top: 1px solid #000;margin-top: 20px;padding-top: 20px;"> <b> Terms and Conditions</b></p></td>
  <td>
  <div class="termsContainer" style="line-height:20px;">
    <div>
       ${finalInvoiceDetails.terms ? finalInvoiceDetails.terms : 'N/A'}
    </div>
  </div>
    </td>
    </tr>
    <tr>
    <td>
    <div style="display:flex; flex-direction: column; align-items: flex-end">
      <p>For &nbsp;${finalInvoiceDetails.companyName ? finalInvoiceDetails.companyName : 'N/A'}</p>
      <div style="margin-top:50px"><b> Authorized Signature </b></div>
    </div>
  </td>
  <td>
  <div class="poweredBy">Powered By<img style='max-width:30px' src="${process.env.BASE_URL}assets/images/gstlogofooter.png" alt="logo" /></div> 
  </td>
  </tr>
  </main>
</body>

</html>`;
    return formatedInvoice1;
  }
};