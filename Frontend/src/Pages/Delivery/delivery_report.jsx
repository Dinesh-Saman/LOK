import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// CSS for print
const styles = `
@media print {
  body * {
    visibility: hidden;
  }
  .printable-area, .printable-area * {
    visibility: visible;
  }
  .printable-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: 2px solid #000;
  }
  .no-print {
    display: none !important;
  }
}
`;

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    borderCollapse: 'collapse',
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    border: 'none',
  },
  letterhead: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#ADD8E6',
    borderRadius: '8px',
    '& h4': {
      fontFamily: 'cursive',
      fontWeight: 'bold',
      color: 'purple',
    },
    '& p': {
      margin: '5px 0',
    },
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
    '& button': {
      marginLeft: theme.spacing(1),
    },
  },
  tableCell: {
    backgroundColor: 'white',
    color: 'black',
    border: '1px solid #F0EAD6',
  },
  tableHeadCell: {
    backgroundColor: '#d4ac0d',
    color: 'white',
    border: '1px solid #F0EAD6',
  },
}));

const DeliveryReportPage = () => {
  const classes = useStyles();
  const [deliveryData, setDeliveryData] = useState([]);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/delivery/get-deliveries');
        setDeliveryData(response.data);
      } catch (error) {
        console.error('Error fetching delivery data:', error);
      }
    };

    fetchDeliveryData();
  }, []);

  const handleDownloadPDF = () => {
    const input = document.querySelector('.printable-area');
    const buttons = document.querySelectorAll('.no-print-button');
    buttons.forEach(button => button.style.display = 'none');

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('delivery_report.pdf');
      buttons.forEach(button => button.style.display = '');
    });
  };

  const handleDownloadCSV = () => {
    const csvRows = [];
    const headers = ['Delivery ID', 'First Name', 'Last Name', 'Address', 'City', 'District', 'Delivery Date', 'Phone', 'Email', 'WhatsApp No', 'Order Notes', 'Total Price'];
    csvRows.push(headers.join(','));

    deliveryData.forEach((delivery) => {
      const row = [
        delivery.deliveryId,
        delivery.firstName,
        delivery.lastName,
        delivery.address,
        delivery.city,
        delivery.district,
        delivery.deliveryDate,
        delivery.phone,
        delivery.email,
        delivery.whatsappNo,
        delivery.orderNotes,
        delivery.totalPrice,
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'delivery_report.csv');
    a.click();
  };

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

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
          className="printable-area"
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            flex: 1,
            margin: '15px',
          }}
        >
          <Box className={classes.letterhead}>
            <Typography variant="h4" gutterBottom>
              Land Of Kings
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Delivery Report
            </Typography>
            <Typography variant="subtitle2">
              Castle Black 1096, Pannipitiya Road Battaramulla, Sri Lanka | Phone: 071 790 1354
            </Typography>
          </Box>
          <Box className={`${classes.buttonsContainer} no-print-button`}>
            <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
              Download CSV
            </Button>
            <Button variant="contained" color="secondary" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </Box>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="delivery table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeadCell}>Delivery ID</TableCell>
                  <TableCell className={classes.tableHeadCell}>First Name</TableCell>
                  <TableCell className={classes.tableHeadCell}>Last Name</TableCell>
                  <TableCell className={classes.tableHeadCell}>Address</TableCell>
                  <TableCell className={classes.tableHeadCell}>City</TableCell>
                  <TableCell className={classes.tableHeadCell}>District</TableCell>
                  <TableCell className={classes.tableHeadCell}>Delivery Date</TableCell>
                  <TableCell className={classes.tableHeadCell}>Phone</TableCell>
                  <TableCell className={classes.tableHeadCell}>Email</TableCell>
                  <TableCell className={classes.tableHeadCell}>WhatsApp No</TableCell>
                  <TableCell className={classes.tableHeadCell}>Order Notes</TableCell>
                  <TableCell className={classes.tableHeadCell}>Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveryData.map((delivery) => (
                  <TableRow key={delivery.deliveryId}>
                    <TableCell className={classes.tableCell}>{delivery.deliveryId.substring(0,5)}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.firstName}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.lastName}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.address}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.city}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.district}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.deliveryDate.substring(0, 10)}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.phone}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.email}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.whatsappNo}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.orderNotes}</TableCell>
                    <TableCell className={classes.tableCell}>{delivery.totalPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default DeliveryReportPage;
