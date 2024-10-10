import React, { useEffect, useState } from 'react';
import Sidebar from './../Dashboard/InventoryDashboard';
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

const InventoryReportPage = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get('http://localhost:3002/inventory/get-inventory-items');
        setInventoryItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        setError('Failed to load inventory items.');
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  const handleDownload = async () => {
    const doc = new jsPDF('l', 'mm', 'a3');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 5;
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
    doc.text('Inventory Report', pageWidth / 2, subtitleY, { align: 'center' });
  
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
    const tableColumn = ['Item ID', 'Item Name', 'Category', 'Description', 'Unit of Measure', 'Quantity in Stock', 'Reorder Level', 'Reorder Quantity', 'Supplier Id', 'Cost Price', 'Date Added', 'Last Restocked Date', 'Expiration Date', 'Brand', 'Location in Store', 'Stock Status'];
    const tableRows = [];
    
    // Prepare table rows
    for (const item of inventoryItems) {
      try {
        const response = await fetch(item.inventoryImage);
        if (!response.ok) throw new Error('Image fetch failed');
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        const base64Image = await convertToBase64(imageUrl);
  
        tableRows.push([
          item.itemId,
          item.itemName,
          item.category,
          item.description,
          item.unitOfMeasure,
          item.quantityInStock,
          item.reorderLevel,
          item.reorderQuantity,
          item.supplierId,
          item.costPrice,
          new Date(item.dateAdded).toLocaleDateString(),
          item.lastRestockedDate ? new Date(item.lastRestockedDate).toLocaleDateString() : 'N/A',
          item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A',
          item.brand || 'N/A',
          item.locationInStore || 'N/A',
          item.stockStatus,
        ]);
      } catch (error) {
        console.error('Error fetching image:', error);
        tableRows.push([
          item.itemId,
          item.itemName,
          item.category,
          item.description,
          item.unitOfMeasure,
          item.quantityInStock,
          item.reorderLevel,
          item.reorderQuantity,
          item.supplierId,
          item.costPrice,
          new Date(item.dateAdded).toLocaleDateString(),
          item.lastRestockedDate ? new Date(item.lastRestockedDate).toLocaleDateString() : 'N/A',
          item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A',
          item.brand || 'N/A',
          item.locationInStore || 'N/A',
          item.stockStatus,
        ]);
      }
    }
  
    doc.autoTable({
      startY: addressY + 22,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 10,
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
      columnStyles: {
        0: { cellWidth: 30 }, 
      },
      didDrawCell: (data) => {
        if (data.column.index === 0 && data.cell.raw) {
          const imageUrl = data.cell.raw;
          if (imageUrl) {
            const imageHeight = 22; 
            const imageWidth = 30;
            const xPos = data.cell.x + (data.cell.width - imageWidth) / 2; 
            const yPos = data.cell.y + 2; 
  
            data.cell.text = '';
            doc.addImage(imageUrl, 'JPEG', xPos, yPos, imageWidth, imageHeight);
          }
        }
      },
      margin: { top: 0, bottom: 20, left: margin, right: margin },
    });
  
    // Add Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }
  
    doc.save('inventory_report.pdf');
  };
  

  // Convert image URL to base64 format
  const convertToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.responseType = 'blob';
      xhr.open('GET', url);
      xhr.send();
    });
  };

  return (
    <Box
      style={{
        overflowX: 'hidden',
      }}
    >
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
            overflowX: 'hidden'
          }}
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
              <Typography variant="h4" style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'white' , marginTop:'20px'}}>
                Land Of Kings
              </Typography>
              <Typography variant="h6" style={{ fontFamily: 'serif', fontStyle: 'bold', color: 'cyan' }}>
                Inventory Report
              </Typography>
              <Typography variant="body1" style={{ fontFamily: 'sans-serif', color: 'cyan', marginTop: 10 }}>
                Castle Black 1096, Pannipitiya Road Battaramulla, Sri Lanka 
                <br />
                Contact:  071 790 1354
              </Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={handleDownload} style={{ marginBottom: '20px' }}>
            Download PDF
          </Button>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer component={Paper} style={{ maxWidth: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow style={{backgroundColor:'cyan'}}>
                    <TableCell>Item ID</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Unit of Measure</TableCell>
                    <TableCell>Quantity in Stock</TableCell>
                    <TableCell>Reorder Level</TableCell>
                    <TableCell>Reorder Quantity</TableCell>
                    <TableCell>Supplier Id</TableCell>
                    <TableCell>Cost Price</TableCell>
                    <TableCell>Date Added</TableCell>
                    <TableCell>Last Restocked Date</TableCell>
                    <TableCell>Expiration Date</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Location in Store</TableCell>
                    <TableCell>Stock Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell>{item.itemId}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.unitOfMeasure}</TableCell>
                      <TableCell>{item.quantityInStock}</TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                      <TableCell>{item.reorderQuantity}</TableCell>
                      <TableCell>{item.supplierId}</TableCell>
                      <TableCell>{item.costPrice}</TableCell>
                      <TableCell>{new Date(item.dateAdded).toLocaleDateString()}</TableCell>
                      <TableCell>{item.lastRestockedDate ? new Date(item.lastRestockedDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{item.brand || 'N/A'}</TableCell>
                      <TableCell>{item.locationInStore || 'N/A'}</TableCell>
                      <TableCell>{item.stockStatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default InventoryReportPage;
