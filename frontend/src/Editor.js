import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Container, Box, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const ProposalEditor = () => {
  const [proposal, setProposal] = useState("");
  const [description, setDescription] = useState(""); // State for description
  const [loading, setLoading] = useState(false); // State for loading
  const quillRef = useRef(null); // Reference for Quill editor

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleProposalChange = (content) => {
    setProposal(content); // Update the proposal state with the rich text content
  };

  const generateProposal = async () => {
    setLoading(true); // Set loading to true when generating starts
    try {
      const response = await axios.post('http://127.0.0.1:8000/generate', {
        description: description
      });
      // Convert the plain text response to HTML format (if needed)
      const formattedProposal = response.data.proposal.replace(/\n/g, '<br>');
      setProposal(formattedProposal);
    } catch (error) {
      console.error("Error generating proposal:", error);
    } finally {
      setLoading(false); // Set loading to false when generating ends
    }
  };

  const copyToClipboard = () => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = proposal;
  
    // Replace HTML tags with their corresponding text representations
    let textToCopy = tempElement.innerHTML;
    textToCopy = textToCopy.replace(/<\/p><p><br><\/p><p>/g, '\n\n').replace(/<\/p><p>/g, '\n').replace(/<p>/g, '').replace(/<\/p>/g, '');
  
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Proposal copied to clipboard!');
    }).catch((error) => {
      console.error("Error copying to clipboard:", error);
    });
  };
  
  

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.style.minHeight = '400px';
      editor.root.style.height = 'auto';
    }
  }, [proposal]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, ml: 'auto', mr: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Business Proposal Generator
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={handleDescriptionChange}
          sx={{ mr: 2 }} // Margin right to separate buttons
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={generateProposal}
          sx={{ mr: 2 }} // Margin right to separate buttons
          disabled={loading} // Disable button while loading
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Proposal'}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={copyToClipboard}
          disabled={loading} // Disable button while loading
        >
          Copy Proposal
        </Button>
      </Box>

      <ReactQuill
        ref={quillRef}
        value={proposal}
        onChange={handleProposalChange}
        theme="snow"
        style={{ minHeight: '400px', height: 'auto', marginBottom: '20px' }}
        readOnly={loading} // Make editor read-only while loading
      />
    </Container>
  );
};

export default ProposalEditor;
