import { Payment } from '@/types'

// Simple PDF generation utility
// You can replace this with a more robust solution like jsPDF if needed
export const generateReceiptPDF = (payment: Payment): void => {
  try {
    // Create receipt content with better formatting
    const receiptContent = `
FOOTBALL FIELD BOOKING RECEIPT
==============================

Receipt Details:
---------------
Payment ID: ${payment._id}
Date: ${new Date(payment.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}
Time: ${new Date(payment.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })}

Payment Information:
-------------------
Amount Invoiced: KSh ${(payment.final_amount_invoiced || 0).toLocaleString()}
Amount Paid: KSh ${(payment.amountPaid || payment.amount || 0).toLocaleString()}
Payment Method: ${payment.payment_method || 'Card'}
Payment Status: ${payment.payment_status || 'Unknown'}
${payment.payment_reference ? `Reference: ${payment.payment_reference}` : ''}

Booking Details:
---------------
Field: ${payment.booking?.field?.name || 'N/A'}
Booking Date: ${payment.booking?.date_requested ? 
  new Date(payment.booking.date_requested).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A'}
Time Slot: ${payment.booking?.time || 'N/A'}
Duration: ${payment.booking?.duration || 'N/A'} hour(s)

${payment.vat ? `VAT: KSh ${payment.vat.toLocaleString()}` : ''}
${payment.notes ? `Notes: ${payment.notes}` : ''}

==============================
Thank you for choosing our football field!
For any inquiries, please contact our support team.

Generated on: ${new Date().toLocaleString('en-US')}
    `.trim()

    // Create a simple HTML content for better PDF formatting
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Receipt - ${payment._id}</title>
    <meta charset="utf-8">
    <style>
        @page {
            margin: 0.5in;
            size: A4;
        }
        
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
            color: #333;
            background-color: #fff;
        }
        
        .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #3A8726 0%, #2d6b1f 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        
        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 24px;
            font-weight: bold;
            color: #3A8726;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .company-info {
            text-align: center;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .company-tagline {
            font-size: 14px;
            opacity: 0.9;
            margin: 5px 0 0 0;
        }
        
        .receipt-title {
            background: rgba(255,255,255,0.1);
            margin: 20px -20px -30px -20px;
            padding: 15px 20px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }
        
        .content {
            padding: 30px;
        }
        
        .receipt-info {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 4px solid #3A8726;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .info-label {
            font-weight: 600;
            color: #555;
        }
        
        .info-value {
            color: #333;
            font-weight: 500;
        }
        
        .section {
            margin: 25px 0;
            background: white;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
            overflow: hidden;
        }
        
        .section-title {
            background: linear-gradient(90deg, #3A8726 0%, #45a028 100%);
            color: white;
            padding: 12px 20px;
            margin: 0;
            font-weight: bold;
            font-size: 16px;
        }
        
        .section-content {
            padding: 20px;
        }
        
        .amount-highlight {
            color: #3A8726;
            font-weight: bold;
            font-size: 18px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            background: #3A8726;
            color: white;
        }
        
        .booking-details {
            background: #f0f8ff;
            border-radius: 6px;
            padding: 15px;
            margin: 10px 0;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 25px;
            text-align: center;
            border-top: 3px solid #3A8726;
            margin-top: 30px;
        }
        
        .footer-message {
            font-size: 16px;
            color: #3A8726;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .footer-contact {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }
        
        .footer-timestamp {
            font-size: 12px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
            border: 2px solid #3A8726;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        
        .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #3A8726;
            margin: 10px 0;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .receipt-container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <div class="logo-container">
                <div class="logo">⚽</div>
                <div class="company-info">
                    <h1 class="company-name">Football Field Booking</h1>
                    <p class="company-tagline">Premium Football Field Services</p>
                </div>
            </div>
            <div class="receipt-title">PAYMENT RECEIPT</div>
        </div>
        
        <div class="content">
            <div class="receipt-info">
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Receipt ID:</span>
                        <span class="info-value">${payment._id}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Date:</span>
                        <span class="info-value">${new Date(payment.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Time:</span>
                        <span class="info-value">${new Date(payment.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status:</span>
                        <span class="info-value"><span class="status-badge">${payment.payment_status || 'Unknown'}</span></span>
                    </div>
                </div>
            </div>

            <div class="highlight-box">
                <div style="font-size: 16px; color: #666; margin-bottom: 5px;">Total Amount</div>
                <div class="total-amount">KSh ${(payment.final_amount_invoiced || payment.amountPaid || payment.amount || 0).toLocaleString()}</div>
            </div>

            <div class="section">
                <h3 class="section-title">💳 Payment Information</h3>
                <div class="section-content">
                    <div class="info-item">
                        <span class="info-label">Amount Invoiced:</span>
                        <span class="info-value amount-highlight">KSh ${(payment.final_amount_invoiced || 0).toLocaleString()}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Amount Paid:</span>
                        <span class="info-value amount-highlight">KSh ${(payment.amountPaid || payment.amount || 0).toLocaleString()}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Payment Method:</span>
                        <span class="info-value">${payment.payment_method || 'Card'}</span>
                    </div>
                    ${payment.payment_reference ? `
                    <div class="info-item">
                        <span class="info-label">Reference:</span>
                        <span class="info-value">${payment.payment_reference}</span>
                    </div>
                    ` : ''}
                    ${payment.vat ? `
                    <div class="info-item">
                        <span class="info-label">VAT:</span>
                        <span class="info-value">KSh ${payment.vat.toLocaleString()}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="section">
                <h3 class="section-title">⚽ Booking Details</h3>
                <div class="section-content">
                    <div class="booking-details">
                        <div class="info-item">
                            <span class="info-label">Field:</span>
                            <span class="info-value">${payment.booking?.field?.name || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Booking Date:</span>
                            <span class="info-value">${payment.booking?.date_requested ? 
                              new Date(payment.booking.date_requested).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Time Slot:</span>
                            <span class="info-value">${payment.booking?.time || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Duration:</span>
                            <span class="info-value">${payment.booking?.duration || 'N/A'} hour(s)</span>
                        </div>
                    </div>
                </div>
            </div>

            ${payment.notes ? `
            <div class="section">
                <h3 class="section-title">📝 Additional Notes</h3>
                <div class="section-content">
                    <p style="margin: 0; padding: 10px; background: #f9f9f9; border-radius: 4px; font-style: italic;">${payment.notes}</p>
                </div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <div class="footer-message">Thank you for choosing our football field!</div>
            <div class="footer-contact">
                For any inquiries, please contact our support team<br>
                📧 support@footballfield.com | 📞 +254 xxx xxx xxx
            </div>
            <div class="footer-timestamp">
                Generated on: ${new Date().toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
            </div>
        </div>
    </div>
</body>
</html>
    `

    // Create a new window and print to PDF
    const printWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes')
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups for this site.')
    }

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      // Add a small delay to ensure styles are loaded
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
        
        // Close the window after printing (longer delay for print dialog)
        setTimeout(() => {
          printWindow.close()
        }, 2000)
      }, 500)
    }

    return

  } catch (error) {
    console.error('Error generating receipt PDF:', error)
    
    // Fallback to text download if PDF generation fails
    const receiptContent = `
FOOTBALL FIELD BOOKING RECEIPT
==============================

Payment ID: ${payment._id}
Date: ${new Date(payment.createdAt).toLocaleDateString()}
Amount: KSh ${(payment.final_amount_invoiced || payment.amountPaid || payment.amount || 0).toLocaleString()}
Status: ${payment.payment_status || 'Unknown'}

Field: ${payment.booking?.field?.name || 'N/A'}
Booking Date: ${payment.booking?.date_requested || 'N/A'}
Time: ${payment.booking?.time || 'N/A'}
Duration: ${payment.booking?.duration || 'N/A'} hours

Thank you for choosing our football field!
    `

    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt_${payment._id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    throw error
  }
}

// Alternative function using jsPDF (you would need to install jspdf package)
// npm install jspdf
// 
// import jsPDF from 'jspdf'
// 
// export const generateReceiptPDFWithJsPDF = (payment: Payment): void => {
//   try {
//     const pdf = new jsPDF()
//     
//     // Set font
//     pdf.setFont('helvetica')
//     
//     // Title
//     pdf.setFontSize(16)
//     pdf.setTextColor(58, 135, 38) // #3A8726
//     pdf.text('FOOTBALL FIELD BOOKING RECEIPT', 105, 20, { align: 'center' })
//     
//     // Reset color
//     pdf.setTextColor(0, 0, 0)
//     pdf.setFontSize(12)
//     
//     let yPosition = 40
//     
//     // Receipt Details
//     pdf.setFontSize(14)
//     pdf.text('Receipt Details:', 20, yPosition)
//     yPosition += 10
//     
//     pdf.setFontSize(10)
//     pdf.text(`Payment ID: ${payment._id}`, 20, yPosition)
//     yPosition += 6
//     pdf.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 20, yPosition)
//     yPosition += 6
//     pdf.text(`Time: ${new Date(payment.createdAt).toLocaleTimeString()}`, 20, yPosition)
//     yPosition += 15
//     
//     // Payment Information
//     pdf.setFontSize(14)
//     pdf.text('Payment Information:', 20, yPosition)
//     yPosition += 10
//     
//     pdf.setFontSize(10)
//     pdf.text(`Amount: KSh ${(payment.final_amount_invoiced || payment.amountPaid || payment.amount || 0).toLocaleString()}`, 20, yPosition)
//     yPosition += 6
//     pdf.text(`Method: ${payment.payment_method || 'Card'}`, 20, yPosition)
//     yPosition += 6
//     pdf.text(`Status: ${payment.payment_status || 'Unknown'}`, 20, yPosition)
//     yPosition += 15
//     
//     // Booking Details
//     pdf.setFontSize(14)
//     pdf.text('Booking Details:', 20, yPosition)
//     yPosition += 10
//     
//     pdf.setFontSize(10)
//     pdf.text(`Field: ${payment.booking?.field?.name || 'N/A'}`, 20, yPosition)
//     yPosition += 6
//     pdf.text(`Booking Date: ${payment.booking?.date_requested || 'N/A'}`, 20, yPosition)
//     yPosition += 6
//     pdf.text(`Time: ${payment.booking?.time || 'N/A'}`, 20, yPosition)
//     yPosition += 6
//     pdf.text(`Duration: ${payment.booking?.duration || 'N/A'} hours`, 20, yPosition)
//     
//     // Footer
//     pdf.setFontSize(10)
//     pdf.setTextColor(128, 128, 128)
//     pdf.text('Thank you for choosing our football field!', 105, 250, { align: 'center' })
//     pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 260, { align: 'center' })
//     
//     // Save the PDF
//     pdf.save(`receipt_${payment._id}.pdf`)
//     
//   } catch (error) {
//     console.error('Error generating PDF receipt:', error)
//     throw error
//   }
// }
