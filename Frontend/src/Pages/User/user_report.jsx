import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/guest_header'; 
import axios from 'axios';
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
import jsPDF from 'jspdf';

const UserReportPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3002/user/get-users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDownload = async () => {
    const doc = new jsPDF('landscape', 'mm', 'a3'); 
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
    doc.text('User Report', pageWidth / 2, subtitleY, { align: 'center' });

    // Prepare table data
    const tableColumn = ['User ID', 'First Name', 'Last Name', 'Email', 'Contact', 'NIC', 'DOB', 'Address', 'City', 'District'];
    const tableRows = users.map(user => [
      user._id.slice(0, 5),
      user.firstName,
      user.lastName,
      user.emailAddress,
      user.contact,
      user.NIC,
      user.DOB.substring(0, 10),
      user.address,
      user.city,   // Add City
      user.district // Add District
    ]);

    doc.autoTable({
      startY: subtitleY + 15,
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

    doc.save('user_report.pdf');
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
            overflowX: 'auto',
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
              <Typography variant="h4" style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'white', marginTop: '20px'}}>
                Land Of Kings
              </Typography>
              <Typography variant="h6" style={{ fontFamily: 'serif', fontStyle: 'bold', color: 'cyan' }}>
                User Report
              </Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>User ID</strong></TableCell>
                  <TableCell><strong>First Name</strong></TableCell>
                  <TableCell><strong>Last Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Contact</strong></TableCell>
                  <TableCell><strong>NIC</strong></TableCell>
                  <TableCell><strong>Date of Birth</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell><strong>City</strong></TableCell>
                  <TableCell><strong>District</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user._id.slice(0, 5)}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.emailAddress}</TableCell>
                    <TableCell>{user.contact}</TableCell>
                    <TableCell>{user.NIC}</TableCell>
                    <TableCell>{user.DOB.substring(0, 10)}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>{user.district}</TableCell>
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

export default UserReportPage;
