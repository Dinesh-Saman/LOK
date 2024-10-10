import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header'; 
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@material-ui/core';

const PaymentReportPage = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/payment/get-payments');
        setPaymentData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setError('Failed to load payment data.');
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF('p', 'mm', 'a3');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const startY = 15;

    // Add Letterhead
    doc.setFontSize(22);
    doc.setFont('courier', 'bold');
    doc.setTextColor(75, 0, 130); 
    doc.text("Land Of Kings", pageWidth / 2, startY, { align: 'center' });

    // Subtitle
    doc.setFontSize(17);
    doc.setFont('courier', 'bold');
    doc.setTextColor(0, 128, 0);
    const subtitleY = startY + 7; 
    doc.text('Payment Report', pageWidth / 2, subtitleY, { align: 'center' });

    // Address
    doc.setFontSize(12);
    doc.setFont('courier', 'normal');
    doc.setTextColor(0, 0, 255); 
    const addressY = subtitleY + 10; 
    doc.text('Castle Black 1096, Pannipitiya Road Battaramulla, Sri Lanka', pageWidth / 2, addressY, { align: 'center' });

    // Contact
    doc.setFontSize(12);
    doc.setFont('courier', 'normal');
    doc.setTextColor(0, 128, 0);
    const contactY = addressY + 12; 
    doc.text('Contact - 071 790 1354', pageWidth / 2, contactY, { align: 'center' });

    // Draw a horizontal line below the address
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0); 
    doc.line(margin, addressY + 18, pageWidth - margin, addressY + 18);

    // Prepare table data
    const tableColumn = ['Payment ID', 'First Name', 'Last Name', 'Total Price', 'Delivery District', 'Card Type', 'Card Number', 'Expiry Date'];
    const tableRows = paymentData.map((payment) => [
      payment._id, 
      payment.firstName,
      payment.lastName,
      payment.totalPrice,
      payment.deliveryDistrict,
      payment.cardType,
      payment.cardNumber ? `${payment.cardNumber.slice(0, -3)}XXX` : 'N/A', 
      payment.expiryDate
    ]);

    doc.autoTable({
      startY: addressY + 22,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 10,
        overflow: 'linebreak',
        cellPadding: 4,
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [123, 31, 162],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
      },
    });

    // Add Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
    }

    doc.save('payment_report.pdf');
  };

  return (
    <Box>
      <Header />
      <Box display="flex">
        <Sidebar />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{
            flex: 1,
            minHeight: '100vh',
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            margin: '15px',
            position: 'relative',
            marginTop: '15px',
            marginBottom: '15px',
          }}
          id="printable-section"
        >
          <Box
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              padding: '10px',
              borderBottom: '2px solid purple',
              backgroundColor: '#232B2B',
              width: '100%',
              boxSizing: 'border-box',
            }}>
            <Typography variant="h4" style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'white', marginTop: '20px' }}>
              Land Of Kings
            </Typography>
            <Typography variant="h6" style={{ fontFamily: 'serif', fontStyle: 'bold', color: 'cyan' }}>
              Payment Report
            </Typography>
            <Typography variant="body1" style={{ fontFamily: 'sans-serif', color: 'cyan', marginTop: 10 }}>
              Castle Black 1096, Pannipitiya Road Battaramulla, Sri Lanka 
              <br />
              Contact: 071 790 1354
            </Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Payment ID</strong></TableCell>
                  <TableCell><strong>First Name</strong></TableCell>
                  <TableCell><strong>Last Name</strong></TableCell>
                  <TableCell><strong>Total Price</strong></TableCell>
                  <TableCell><strong>Delivery District</strong></TableCell>
                  <TableCell><strong>Card Type</strong></TableCell>
                  <TableCell><strong>Card Number</strong></TableCell>
                  <TableCell><strong>Expiry Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentData.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment._id}</TableCell>
                    <TableCell>{payment.firstName}</TableCell>
                    <TableCell>{payment.lastName}</TableCell>
                    <TableCell>{payment.totalPrice}</TableCell>
                    <TableCell>{payment.deliveryDistrict}</TableCell>
                    <TableCell>{payment.cardType}</TableCell>
                    <TableCell>
                      {payment.cardNumber
                        ? `${payment.cardNumber.slice(0, -3)}XXX`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{payment.expiryDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={4}>
            <Button variant="contained" color="secondary" onClick={handleDownload}>
              Download PDF
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentReportPage;
