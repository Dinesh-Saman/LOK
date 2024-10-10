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

const ReviewReportPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3002/review/get-reviews'); // Adjust the endpoint as necessary
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews.');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
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
    doc.text('Review Report', pageWidth / 2, subtitleY, { align: 'center' });

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
    const tableColumn = ['Review ID', 'Food Name', 'User', 'Price', 'Serving Size', 'Review', 'Rating', 'Status'];
    const tableRows = reviews.map(review => [
      review._id.slice(-5), // Last 5 characters of the review ID
      review.foodName,
      review.user ? review.user.firstName || 'No User' : 'No User',
      review.price,
      review.servingSize,
      review.review,
      review.rating,
      review.status
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

    doc.save('review_report.pdf');
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
              Review Report
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
                  <TableCell><strong>Review ID</strong></TableCell>
                  <TableCell><strong>Food Name</strong></TableCell>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Serving Size</strong></TableCell>
                  <TableCell><strong>Review</strong></TableCell>
                  <TableCell><strong>Rating</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map(review => (
                  <TableRow key={review._id}>
                    <TableCell>{review._id.slice(-5)}</TableCell>
                    <TableCell>{review.foodName}</TableCell>
                    <TableCell>{review.user ? review.user.firstName || 'No User' : 'No User'}</TableCell>
                    <TableCell>{review.price}</TableCell>
                    <TableCell>{review.servingSize}</TableCell>
                    <TableCell>{review.review}</TableCell>
                    <TableCell>{review.rating}</TableCell>
                    <TableCell>{review.status}</TableCell>
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

export default ReviewReportPage;
