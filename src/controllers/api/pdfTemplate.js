require('dotenv').config();
exports.updatePdf = async finalInvoiceDetails => {
  if (finalInvoiceDetails) {
    const data = finalInvoiceDetails.itemDetails;
    const neftDatas = finalInvoiceDetails.neftDetail;
    const upiDatas = finalInvoiceDetails.upiDetail;
    const taxData = finalInvoiceDetails.taxArray;
    function humanize(str) {
      var i, frags = str.split('_');
      for (i=0; i<frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(' ');
    }
    const formatedInvoice1 = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>GST  HTML Invoice</title>
  <link href="https://fonts.googleapis.com/css2?family=Muli:wght@200;300;400;500;700&display=swap" rel="stylesheet">
  <style type="text/css">
    strong {
      font-size: 11px;
    }
  
    table { page-break-inside:auto }
    tr    { page-break-inside:avoid; page-break-after:auto }
    thead { display:table-header-group }
    tfoot { display:tenter code hereable-footer-group }

   
  </style>
</head>
<body>
  <div id="header">
    <table style="border:1px solid #999999;"  width="100%" border="0" cellpadding="0" cellspacing="0" class="tb">
      <tbody>
        <tr>
          <td height="20" colspan="5" align="center" class="txt" style="border-bottom:1px solid #ddd; color:#d04e00; font-weight:800; font-family: 'Muli', sans-serif;">TAX INVOICE</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td colspan="2">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td height="49" valign="bottom" style=" font-size:16px; color:#d04e00; font-weight:800; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.companyName ? finalInvoiceDetails.companyName : 'N/A'}</td>
                  </tr>
                <tr>
                  <td style=" font-size:13px; color:#000; padding:5px 0px; font-family: 'Muli', sans-serif;"><strong>Regd. Office : </strong> ${finalInvoiceDetails.regdOffice ? finalInvoiceDetails.regdOffice : 'N/A'}</td>
                </tr>
                <tr>
                  <td style=" font-size:13px; color:#000; padding:5px 0px; font-family: 'Muli', sans-serif;"><strong>Tel No : </strong> ${finalInvoiceDetails.telNo ? finalInvoiceDetails.telNo : 'N/A'}</td>
                </tr>
                <tr>
                  <td style=" font-size:13px; color:#000; padding:5px 0px; font-family: 'Muli', sans-serif;" ><strong>Email Id : </strong> ${finalInvoiceDetails.userEmail ? finalInvoiceDetails.userEmail : 'N/A'}</td>
                </tr>
                <tr>
                  <td style=" font-size:13px; color:#000; padding:5px 0px; font-family: 'Muli', sans-serif;"><strong>Website : </strong> <a href="${finalInvoiceDetails.userWebsite ? finalInvoiceDetails.userWebsite : 'N/A'}" target="_blank">${finalInvoiceDetails.userWebsite ? finalInvoiceDetails.userWebsite : 'N/A'}</a></td>
                </tr>
                <tr>
                  <td style=" font-size:13px; color:#000; padding:5px 0px; font-family: 'Muli', sans-serif;" ><strong>GSTIN : </strong> ${finalInvoiceDetails.clientGSTIN ? finalInvoiceDetails.clientGSTIN : 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td height="20" valign="bottom" style=" font-size:16px; color:#d04e00; font-weight:800; font-family: 'Muli', sans-serif;" align="right">
                    <img src="${process.env.BASE_URL}uploads/${finalInvoiceDetails.invoiceLogo}" style="width:100px;">
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td width="3%">&nbsp;</td>
          <td colspan="3">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="tb1">
            <tbody>
              <tr>
                <td>
                  <table style="border:1px solid #999999;" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                      <tr>
                        <td width="20%"><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Contact Person</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.customerName ? finalInvoiceDetails.customerName : 'N/A'}</span></td>
                        <td width="20%"><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Invoice Number</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.invoiceId ? finalInvoiceDetails.invoiceId : 'N/A'}</span></td>
                      </tr>
                      <tr>
                        <td height="25"><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Buyer Name </span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.buyerCompanyName ? finalInvoiceDetails.buyerCompanyName : 'N/A'}</span></td>
                        <td><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Invoice Date</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.invoiceDate ? finalInvoiceDetails.invoiceDate : 'N/A'}</span></td>
                      </tr>
                      <tr>
                        <td height="25"><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">GSTIN of Buyer</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.companyGSTIN ? finalInvoiceDetails.companyGSTIN : 'N/A'}</span></td>
                        <td><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">P.O. No.</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.purchaseOrderNum ? finalInvoiceDetails.purchaseOrderNum : 'N/A'}</span></td>
                      </tr>
                      <tr>
                        <td height="25"><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Address</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.customerAddress ? finalInvoiceDetails.customerAddress : 'N/A'}</span></td>
                        <td><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">P.O. Date</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.purchaseOrderDate ? finalInvoiceDetails.purchaseOrderDate : 'N/A'}</span></td>
                      </tr>
                      <tr>
                        <td height="25"><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">City</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.city ? finalInvoiceDetails.city : 'N/A'}</span></td>
                        <td height="25"><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Mobile Number</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.customerWorkPhone ? finalInvoiceDetails.customerWorkPhone : 'N/A'}</span></td>
                      </tr>
                      <tr>
                        <td height="25"  width="40%"><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Place of Supply(State)</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.state ? finalInvoiceDetails.state : 'N/A'}</span></td>
                        <td height="25"><strong><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Email Id</span></strong></td>
                        <td><span style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${finalInvoiceDetails.customerEmail ? finalInvoiceDetails.customerEmail : 'N/A'}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td height="20" style="border-top:1px solid #999999;">&nbsp;</td>
              </tr>
              <tr>
                <td>
                <table style="border:1px solid #999999;" width="100%" border="1" cellpadding="0" cellspacing="0" class="tb2">
                  <tbody>
                    <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                      <td width="2%" height="15" align="center"><strong>S.N</strong></td>
                      <td width="10%" align="center"><strong>PRODUCT</strong></td>
                      <td width="15%" align="center"><strong>DESCRIPTION</strong></td>
                      <td width="10%" align="center"><strong>HSN/SAC</strong></td>
                      <td width="6%" align="center"><strong>QTY</strong></td>
                      <td width="8%" align="center"><strong>PRICE</strong></td>
                      <td width="10%" align="center"><strong>AMOUNT</strong></td>
                      <td width="7%" align="center"><strong>TAX%</strong></td>
                      <td width="7%" align="center"><strong>IGST</strong></td>
                      <td width="8%" align="center"><strong>CGST</strong></td>
                      <td width="8%" align="center"><strong>SGST</strong></td>
                      <td width="10%" align="center"><strong>TOTAL</strong></td>
                    </tr>
                    ${data.map((item, index) => {
                      return `
                      <tr style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                        <td height="15" align="center">${index+1}</td>
                        <td align="center"> ${item.itemName}</td>
                        <td align="center"> ${item.itemDescription}</td>
                        <td align="center"> ${item.type === 1 ? item.hsnSac : item.hsnSac}</td>
                        <td align="center">${item.itemQuantity}</td>
                        <td align="center">${item.itemPrice?.toFixed(2)}</td>
                        <td align="center">${(item.itemQuantity * item.itemPrice)?.toFixed(2)}</td>
                        <td align="center">${item.itemGstPercentage}</td>
                        <td align="center">${finalInvoiceDetails.invoiceGstType === 'igst' ? ((item.itemSubtotal * item.itemGstPercentage) / 100)?.toFixed(2) : 'N/A'}</td>
                        <td align="center">${finalInvoiceDetails.invoiceGstType === 'cgst' || finalInvoiceDetails.invoiceGstType === 'sgst' ? (item.taxSubtotal / 2)?.toFixed(2) : 'N/A'}</td>
                        <td align="center">${finalInvoiceDetails.invoiceGstType === 'cgst' || finalInvoiceDetails.invoiceGstType === 'sgst' ? (item.taxSubtotal / 2)?.toFixed(2) : 'N/A'}</td>
                        <td align="center">${(item.taxSubtotal + item.itemQuantity * item.itemPrice)?.toFixed(2)}</td>
                      </tr>
                      `}).join('')}
                    <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                      <td height="15" align="center">&nbsp;</td>
                      <td align="center">&nbsp;</td>
                      <td align="center">&nbsp;</td>
                      <td align="center"><strong>TOTAL</strong></td>
                      <td align="center">&nbsp;</td>
                      <td align="center">&nbsp;</td>
                      <td align="center"><strong>${finalInvoiceDetails.invoiceTotal?.toFixed(2)}</strong></td>
                      <td align="center"><strong>&nbsp;</strong></td>
                      <td align="center"><strong>${finalInvoiceDetails.invoiceGstType === 'igst' ?  finalInvoiceDetails.igstSum?.toFixed(2) : 'N/A'}</strong></td>
                      <td align="center"><strong>${finalInvoiceDetails.invoiceGstType === 'cgst' || finalInvoiceDetails.invoiceGstType === 'sgst' ? (finalInvoiceDetails.igstSum)?.toFixed(2) / 2 : 'N/A'}</strong></td>
                      <td align="center"><strong>${finalInvoiceDetails.invoiceGstType === 'cgst' || finalInvoiceDetails.invoiceGstType === 'sgst' ? (finalInvoiceDetails.igstSum)?.toFixed(2) / 2 : 'N/A'}</strong></td>
                      <td align="center"><strong>${finalInvoiceDetails.invoiceTotalAmounts?.toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                      <td colspan="12"><strong>Amount Chargeable(in words) : Rupees ${finalInvoiceDetails.totalAmountInWords} Only</strong></td>
                    </tr>
                  </tbody>
                </table></td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
              
              <tr>
                <td>
                  <table width="100%" border="1" cellpadding="0" cellspacing="0" class="tb2">
                    <tbody>
                      <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                        <td colspan ="2" height="25" align="left"><strong>BANK DETAILS</strong></td>
                        <td align="center" colspan ="2"><strong>QR CODE</strong></td>
                      </tr>
                      <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                        <td width="20%" height="25"><strong>Beneficiary Name</strong></td>
                        <td width="70%" align="left" height="25">&nbsp;<strong>${finalInvoiceDetails.beneficiaryName ? finalInvoiceDetails.beneficiaryName : 'N/A'}</strong></td>
                        <td width="50%" align="center" rowspan="2"><img src='${process.env.BASE_URL}uploads/${finalInvoiceDetails.paymentQrCode}' style="width:215px;"></td>
                      </tr>
                      ${neftDatas ? `
                      <tr>
                        <td colspan="2">
                          <table style="border:0px solid #999999;padding:10px;" width="100%" border="1" cellpadding="0" cellspacing="0" class="tb2">
                            <tbody>
                              <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                                <td width="25%" align="center"><strong>BANK NAME</strong></td>
                                <td width="25%" align="center"><strong>ACCOUNT NUMBER</strong></td>
                                <td width="15%" align="center"><strong>IFSC CODE</strong></td>
                                <td width="35%" align="center"><strong>BRANCH NAME</strong></td>
                              </tr>                            
                             
                              ${neftDatas.map((neft,index) => {
                              return `
                                <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                                <td align="center">${neft.bank_name ? neft.bank_name : 'N/A'}</td>
                                <td align="center">${neft.account_number ? neft.account_number : 'N/A'}</td>
                                <td align="center">${neft.ifsc_code ? neft.ifsc_code : 'N/A'}</td>
                                <td align="center">${neft.address ? neft.address : 'N/A'}</td>
                                </tr>`
                              }).join('')}
                            </tbody>
                          </table>
                        </td>
                      </tr>` : '<tr><td>No Bank Data Available</td></tr>'}
                      ${upiDatas ? `
                      ${upiDatas.map(upi => {
                        return `
                      <tr>
                        <td width="40%"align="left" style="font-size:11px;"><strong>UPI NUMBER & ID</strong></td>
                        <td width="13%" align="left" colspan="3" style="font-size:11px;">&nbsp;${upi.upi_number}, ${upi.upi_id} On ${humanize(upi.upi_type)}</td>
                      </tr>
                      ` }).join('')}
                      `: '<tr><td>No Upi Data Available</td></tr>'}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <table width="100%" border="1" cellpadding="0" cellspacing="0" class="tb2">
                    <tbody>
                      <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                        <td  colspan ="2" height="25" align="left"><strong>TERMS and CONDITIONS</strong></td>
                        <td  align="right" colspan ="2"><strong>FOR ${finalInvoiceDetails.companyName ? finalInvoiceDetails.companyName : 'N/A'}</strong>&nbsp;</td>
                      </tr>
                      <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                        <td class="termslist" colspan="2" >
                          ${finalInvoiceDetails.terms ? finalInvoiceDetails.terms : 'N/A'}
                        </td>
                        <td  colspan="2" style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;" align="right" valign="bottom"><strong>Authorised Signatory</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <table width="100%" border="1" cellpadding="0" cellspacing="0" class="tb2">
                    <tbody>
                      <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                        <td  id="footer" colspan ="2" height="25" align="left" padding="10pt 0"><strong>POWERED BY</strong> : 
                          <a href="http://gstsahayak.com/" target="_blank">
                            <img src="${process.env.BASE_URL}assets/images/gstlogofooter.png" style="width:30px;">
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
            </table>
          </td>
          <td width="3%">&nbsp;</td>
        </tr>        
        <tr>
          <td colspan="5" align="center" class="txt" style="font-size:12px;font-family: 'Muli', sans-serif;padding-top:20px;">DESIGNED BY : <a href="https://www.tychotechnologies.com" target="_blank" style="color:#000;text-decoration: none;">TYCHO TECHNOLOGIES PVT. LTD.</a></td>
        </tr>
        <tr>
          <td height="20">&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>
`;
    return formatedInvoice1;
  }
};