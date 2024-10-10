import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header';

const DeliveryReportPage = () => {
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/delivery/get-deliveries');
        setDeliveryData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching delivery data:', error);
        setError('Failed to load delivery data.');
        setLoading(false);
      }
    };

    fetchDeliveryData();
  }, []);

  const handlePrint = () => {
    window.print();
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
            overflow: 'hidden', 
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
              Delivery Report
            </Typography>
            <Typography variant="body1" style={{ fontFamily: 'sans-serif', color: 'cyan', marginTop: 10 }}>
              Castle Black 1096, Pannipitiya Road Battaramulla, Sri Lanka
              <br />
              Contact: 071 790 1354
            </Typography>
          </Box>
          <Button
            onClick={handlePrint}
            style={{
              margin: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#3f51b5',
              color: 'white',
              borderRadius: '5px',
              textTransform: 'none',
            }}
          >
            Print Report
          </Button>
          <div style={{ width: '100%' }}>
            <TableContainer component={Paper} style={{ overflowX: 'auto', width: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Delivery ID</strong></TableCell>
                    <TableCell><strong>First Name</strong></TableCell>
                    <TableCell><strong>Last Name</strong></TableCell>
                    <TableCell><strong>Address</strong></TableCell>
                    <TableCell><strong>City</strong></TableCell>
                    <TableCell><strong>District</strong></TableCell>
                    <TableCell><strong>Delivery Date</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>WhatsApp No</strong></TableCell>
                    <TableCell><strong>Order Notes</strong></TableCell>
                    <TableCell><strong>Total Price</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={13} align="center">Loading...</TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={13} align="center">{error}</TableCell>
                    </TableRow>
                  ) : (
                    deliveryData.map((item) => (
                      <TableRow key={item.deliveryId}>
                        <TableCell>{item.deliveryId ? item.deliveryId.slice(0, 5) : 'N/A'}</TableCell>
                        <TableCell>{item.firstName}</TableCell>
                        <TableCell>{item.lastName}</TableCell>
                        <TableCell>{item.address}</TableCell>
                        <TableCell>{item.city}</TableCell>
                        <TableCell>{item.deliveryDistrict}</TableCell>
                        <TableCell>{new Date(item.deliveryDate).toLocaleDateString()}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.whatsappNo}</TableCell>
                        <TableCell>{item.orderNotes}</TableCell>
                        <TableCell>{`Rs ${item.totalPrice}`}</TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default DeliveryReportPage;
